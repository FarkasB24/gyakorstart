const demoCompanyJobs = {
  rendszergazda: {
    title: "Rendszergazda gyakornok", company: "Rába IT Services Kft.", logo: "IT", logoClass: "logo-mint", meta: "Győr · legalább 5. félév · angol B2", href: "job.html?id=rendszergazda", newCount: 2,
    candidates: [
      { initials: "NA", avatar: "avatar-green", name: "Nagy Anna", status: "new", details: "Mérnökinformatikus · 6. félév · angol C1", match: true, checks: [[true,"Megfelelő szak"],[true,"5+ félév"],[true,"Angol B2+"],[true,"IT alapismeretek"]] },
      { initials: "KB", avatar: "avatar-blue", name: "Kiss Bence", status: "interview", details: "Gazdaságinformatikus · 5. félév · angol B2", match: true, checks: [[true,"Megfelelő szak"],[true,"5+ félév"],[true,"Angol B2+"],[true,"IT alapismeretek"]] },
      { initials: "LL", avatar: "avatar-orange", name: "Lakatos Lili", status: "new", details: "Gazdaságinformatikus · 5. félév · angol B2", match: true, checks: [[true,"Megfelelő szak"],[true,"5+ félév"],[true,"Angol B2+"],[true,"IT alapismeretek"]] },
      { initials: "VM", avatar: "avatar-purple", name: "Varga Marcell", status: "rejected", details: "Programtervező informatikus · 7. félév · angol A2", match: false, checks: [[true,"Megfelelő szak"],[true,"5+ félév"],[false,"Angol B2 szükséges"],[true,"IT alapismeretek"]] }
    ]
  },
  frontend: {
    title: "Frontend fejlesztő gyakornok", company: "WebOrbit Studio", logo: "</>", logoClass: "logo-blue", meta: "Budapest · legalább 3. félév · React alapismeretek", href: "job.html?id=frontend", newCount: 1,
    candidates: [
      { initials:"LL", avatar:"avatar-orange", name:"Lakatos Lili", status: "interview", details:"Gazdaságinformatikus · 5. félév · HTML, CSS, JavaScript", match:true, checks:[[true,"Megfelelő szak"],[true,"3+ félév"],[true,"JavaScript"],[true,"Git"]] },
      { initials:"FK", avatar:"avatar-blue", name:"Farkas Kata", status: "new", details:"Programtervező informatikus · 5. félév · React", match:true, checks:[[true,"Megfelelő szak"],[true,"3+ félév"],[true,"React"],[true,"Git"]] },
    ]
  },
  "it-support": {
    title: "IT support gyakornok", company: "Rába IT Services Kft.", logo: "HD", logoClass: "logo-lilac", meta: "Győr · legalább 2. félév · angol B1", href: "job.html?id=it-support", newCount: 1,
    candidates: [
      { initials:"PA", avatar:"avatar-green", name:"Papp Alex", status: "new", details:"Gazdaságinformatikus · 4. félév · angol B2", match:true, checks:[[true,"Megfelelő szak"],[true,"2+ félév"],[true,"Angol B1+"],[true,"Kommunikáció"]] },
    ]
  }
};

let companyJobs = {};
let selectedJob = "";
let candidateStatusFilter = "new";
const jobPicker = document.querySelector(".company-job-picker");
const companyJobsEmpty = document.querySelector("#company-jobs-empty");
const companyJobsHelp = document.querySelector(".company-jobs-section .section-help");
const companyWelcomeCopy = document.querySelector(".company-welcome p");
const selectedJobArea = document.querySelector("#selected-job-area");
const statusButtons = [...document.querySelectorAll("[data-candidate-status]")];
const applicationStore = window.GyakorStartApplicationStore;
const candidateStatuses = ["new", "interview", "rejected"];
const candidateStatusLabels = {
  new: "Új jelentkező",
  interview: "Interjúra hívva",
  rejected: "Elutasítva"
};

function getCurrentCompanyAccount() {
  try {
    const session = JSON.parse(localStorage.getItem("gyakorstart.session.v1") || "null");
    const accounts = JSON.parse(localStorage.getItem("gyakorstart.accounts.v1") || "[]");
    if (!session || !Array.isArray(accounts)) return null;
    const account = accounts.find((item) => item.email === session.email);
    return account?.role === "company" ? account : null;
  } catch { return null; }
}

const currentCompanyAccount = getCurrentCompanyAccount();
const currentCompanyName = currentCompanyAccount?.profile?.companyName || "";
const companyApiBaseUrl = (document.querySelector('meta[name="api-base-url"]')?.content || "/api").replace(/\/$/, "");
const companyApiMode = document.querySelector('meta[name="api-mode"]')?.content || "prototype";
const useCompanyApi = companyApiMode === "server";

async function requestCompanyApi(path, options = {}) {
  const response = await fetch(`${companyApiBaseUrl}${path}`, {
    credentials: "include",
    ...options,
    headers: { "Accept":"application/json", ...(options.body ? { "Content-Type":"application/json" } : {}), ...(options.headers || {}) }
  });
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.message || payload?.error || `A szerver hibát adott vissza (${response.status}).`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}

function initialsFromName(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts.concat(parts))
    .slice(0, 2).map((part) => Array.from(part)[0] || "?").join("").toLocaleUpperCase("hu-HU");
}

let isSeedingDemoWorkspace = false;

function seedDemoApplications() {
  // A demo jelentkezések kizárólag a statikus bemutatónézet részei.
  // Nem írjuk őket a valódi hallgatói jelentkezések közös tárolójába.
  Object.values(demoCompanyJobs).forEach((job) => job.candidates.forEach((candidate) => {
    const linked = window.GyakorStartDemoStudentProfiles?.findByName(candidate.name);
    candidate.studentId = linked?.id || null;
    candidate.isDemoData = true;
    candidate.applicationId = `${Object.entries(demoCompanyJobs).find(([, value]) => value === job)?.[0] || "demo"}:${candidate.initials}`;
  }));
}

function demoPostIdFor(baseJobId) {
  const accountPart = String(currentCompanyAccount?.id || "company")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 28) || "company";
  return `demo-${accountPart}-${baseJobId}`;
}

function ensureDemoCompanyWorkspace() {
  // A valódi céges fiókhoz soha nem generálunk bemutatóhirdetést.
  return [];
}

function getReliableApplicantCount(job) {
  if (job?.applicantCount !== undefined && job?.applicantCount !== null) {
    const count = Number(job.applicantCount);
    return Number.isFinite(count) && count >= 0 ? count : null;
  }
  return job?.hasApplicationData ? (Array.isArray(job.candidates) ? job.candidates.length : 0) : null;
}

function companyJobFromPost(post) {
  const serverStatus = String(post.status || "active").toLowerCase();
  const normalizedStatus = ({ draft:"draft", active:"active", paused:"paused", closed:"closed", expired:"expired" })[serverStatus] || "active";
  const normalizedPost = { ...post, status:normalizedStatus };
  const hasApplicationData = Array.isArray(post.applications) || !useCompanyApi;
  const records = Array.isArray(post.applications)
    ? post.applications
    : (useCompanyApi ? [] : applicationStore.getForJob(post.id));
  const semesterLabel = window.GyakorStartCatalogs?.semesterLabel(post.minimumSemester);
  const requiredLanguages = (post.languageRequirements || [])
    .filter((item) => item.requirementType !== "preferred")
    .map((item) => `${item.name} ${item.examRequired ? `${companyCatalogs.examLevelLabel(item.examLevel)} nyelvvizsga` : companyCatalogs.languageLevelLabel(item.level)}`.trim());
  const meta = [post.city, post.minimumSemester ? `legalább ${semesterLabel}` : "", requiredLanguages.join(", ")]
    .filter(Boolean).join(" · ");
  const candidates = records.map((record) => ({
    applicationId: record.id,
    studentId: record.studentId || null,
    studentEmail: record.studentEmail || record.email || null,
    initials: initialsFromName(record.studentName),
    avatar: "avatar-green",
    name: record.studentName || "Hallgató",
    status: applicationStore.normalizeStatus(record.status),
    details: record.studentSummary || "Hallgatói jelentkezés",
    match: false,
    checks: []
  }));
  const logo = initialsFromName(post.company || "Cég");
  return {
    title: post.title || "Névtelen piszkozat",
    city: post.city || "Helyszín nincs megadva",
    company: post.company || currentCompanyName || "Cég",
    logo,
    logoClass: "logo-mint",
    meta,
    href: `job.html?id=${encodeURIComponent(post.id)}`,
    candidates,
    applicantCount: post.applicantCount !== undefined && post.applicantCount !== null && Number.isFinite(Number(post.applicantCount))
      ? Number(post.applicantCount)
      : (hasApplicationData ? candidates.length : null),
    hasApplicationData,
    postId: post.id,
    status: normalizedStatus,
    isOwned: true,
    raw: normalizedPost,
    closed: ["closed", "expired"].includes(normalizedStatus),
    isDemoData: Boolean(post.isDemoData)
  };
}

function renderCompanyJobPicker() {
  jobPicker.replaceChildren();
  const entries = Object.entries(companyJobs);
  entries.forEach(([jobId, job]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `company-job-option${jobId === selectedJob ? " active" : ""}`;
    button.dataset.companyJob = jobId;
    const logo = document.createElement("span");
    logo.className = `job-logo ${job.logoClass || "logo-mint"}`;
    logo.textContent = job.logo || "GS";
    const copy = document.createElement("span");
    copy.className = "company-job-copy";
    const title = document.createElement("strong");
    title.textContent = job.title;
    const titleRow = document.createElement("span");
    titleRow.className = "company-job-title-row";
    titleRow.append(title);
    if (job.isOwned) {
      const state = document.createElement("span");
      state.className = `job-lifecycle-badge job-state-${job.status}`;
      state.textContent = window.GyakorStartJobPostings?.statusLabels?.[job.status] || "Aktív";
      titleRow.append(state);
      if (job.isDemoData) {
        const demoBadge = document.createElement("span");
        demoBadge.className = "demo-data-badge";
        demoBadge.textContent = "Bemutatóadat";
        titleRow.append(demoBadge);
      }
    }
    const meta = document.createElement("small");
    const applicantCount = getReliableApplicantCount(job);
    const location = job.city || job.location || String(job.meta || "").split("·")[0].trim() || "Helyszín nincs megadva";
    meta.textContent = `${location} · ${applicantCount === null ? "Jelentkezőszám nem elérhető" : `${applicantCount} jelentkező`}`;
    copy.append(titleRow, meta);
    const mark = document.createElement("span");
    mark.className = "selection-mark";
    mark.textContent = "✓";
    button.append(logo, copy, mark);
    jobPicker.append(button);
  });
  const hasJobs = entries.length > 0;
  jobPicker.hidden = !hasJobs;
  companyJobsEmpty.hidden = hasJobs;
  selectedJobArea.hidden = !hasJobs;
  if (companyJobsHelp) companyJobsHelp.hidden = !hasJobs;
  if (companyWelcomeCopy) companyWelcomeCopy.textContent = hasJobs
    ? "Válassz egy meghirdetett állást, hogy megtekintsd a hozzá tartozó statisztikákat és jelentkezőket."
    : "Hozd létre az első gyakornoki hirdetésedet, és innen kezelheted majd a jelentkezőket.";
  if (!hasJobs) {
    selectedJob = "";
    return;
  }
  if (!companyJobs[selectedJob]) selectedJob = entries[0][0];
  jobPicker.querySelectorAll("[data-company-job]").forEach((button) => {
    button.classList.toggle("active", button.dataset.companyJob === selectedJob);
  });
}

async function refreshCompanyJobsFromApi() {
  try {
    const payload = await requestCompanyApi("/company/jobs");
    const posts = Array.isArray(payload?.jobs) ? payload.jobs : [];
    companyJobs = Object.fromEntries(posts.map((post) => [String(post.id), companyJobFromPost(post)]));
    const greeting = document.querySelector("#company-greeting");
    if (greeting && currentCompanyName) greeting.textContent = `Jó napot, ${currentCompanyName}!`;
    renderCompanyJobPicker();
    if (selectedJob) renderSelectedJob();
  } catch (error) {
    setJobManagementFeedback(error.message || "A hirdetések betöltése nem sikerült.", true);
  }
}

function syncCompanyJobs() {
  if (isSeedingDemoWorkspace) return;
  if (currentCompanyAccount && useCompanyApi) {
    refreshCompanyJobsFromApi();
    return;
  }
  if (!currentCompanyAccount) {
    // Elkülönített, statikus bemutatónézet; nem kerülnek a minta-jelentkezések
    // a valódi alkalmazások tárolójába.
    seedDemoApplications();
    companyJobs = Object.fromEntries(Object.entries(demoCompanyJobs).map(([id, job]) => [id, {
      ...job, isDemoData: true, hasApplicationData: true, applicantCount: job.candidates.length
    }]));
  } else {
    const store = window.GyakorStartJobPostings;
    const posts = store?.all({ includeClosed:true, includeDrafts:true, includePaused:true }) || [];
    const belongsToCurrentCompany = (post) => post.ownerAccountId
      ? String(post.ownerAccountId) === String(currentCompanyAccount.id)
      : Boolean(currentCompanyName) && post.company === currentCompanyName;
    const ownPosts = posts.filter((post) => !post.isDemoData && belongsToCurrentCompany(post));
    companyJobs = Object.fromEntries(ownPosts.map((post) => [String(post.id), companyJobFromPost(post)]));
    const greeting = document.querySelector("#company-greeting");
    if (greeting && currentCompanyName) greeting.textContent = `Jó napot, ${currentCompanyName}!`;
  }
  renderCompanyJobPicker();
  if (selectedJob) renderSelectedJob();
}

function candidateActionMarkup(status) {
  const button = (action, label, style = "") =>
    `<button type="button" class="candidate-action ${style}" data-candidate-action="${action}">${label}</button>`;
  if (status === "new") {
    return `${button("invite", "Interjúra hívás", "candidate-action-primary")}${button("reject", "Elutasítás", "candidate-action-danger")}`;
  }
  if (status === "interview") {
    return `${button("restore", "Vissza az új jelentkezők közé", "candidate-action-muted")}${button("reject", "Elutasítás", "candidate-action-danger")}`;
  }
  return button("restore", "Jelentkezés újranyitása", "candidate-action-primary");
}

function candidateMarkup(candidate, index) {
  const percent = Number.isFinite(candidate.matchPercent) ? candidate.matchPercent : null;
  const matchBadge = percent !== null
    ? `<span class="candidate-match-percent ${percent >= 80 ? "is-high" : percent >= 60 ? "is-medium" : "is-low"}">${percent}% egyezés</span>`
    : '<span class="partial-match">Egyezés nem számítható</span>';
  return `
    <article class="candidate-card" data-candidate-status-card="${candidate.status}">
      <div class="candidate-avatar ${escapeHtml(candidate.avatar)}" aria-hidden="true">${escapeHtml(candidate.initials)}</div>
      <div class="candidate-main">
        <div class="candidate-name"><h3>${escapeHtml(candidate.name)}</h3><div class="candidate-card-badges">${matchBadge}<span class="candidate-status-badge status-${candidate.status}">${candidateStatusLabels[candidate.status]}</span></div></div>
        <p>${escapeHtml(candidate.details)}</p>
      </div>
      <div class="candidate-card-tools" aria-label="Jelentkező részletei">
        <button class="button button-dark candidate-open-profile" type="button" data-candidate-index="${index}" aria-haspopup="dialog">Profil megtekintése</button>
      </div>
      <div class="candidate-match-action" aria-label="Profil-egyezés részletei">
        <button class="candidate-action candidate-action-primary candidate-open-match" type="button" data-candidate-index="${index}" aria-haspopup="dialog">Profil-egyezés részletei</button>
      </div>
      <div class="candidate-actions" aria-label="Jelentkező kezelése">
        ${candidateActionMarkup(candidate.status)}
      </div>
    </article>`;
}

function calculateCandidateMatch(candidate, job) {
  const { profile } = getCandidateProfile(candidate);
  const matching = window.GyakorStartProfileMatching.calculate(profile, job?.raw || {});
  // A régi, kézzel összeállított bemutatójelölteknél megőrizzük a korábbi ellenőrzéseket,
  // ha a profilból és a hirdetésből még nem számítható egyezés.
  if (matching.percent === null && Array.isArray(candidate.checks) && candidate.checks.length) {
    const legacyChecks = candidate.checks.map(([met, label]) => [Boolean(met), label]);
    const score = Math.round(legacyChecks.filter(([met]) => met).length / legacyChecks.length * 100);
    return { checks: legacyChecks, percent: score, profile };
  }
  return { ...matching, profile };
}

function candidateMatchView(candidate, job) {
  const matchData = calculateCandidateMatch(candidate, job);
  const rawItems = Array.isArray(matchData.details) && matchData.details.length
    ? matchData.details
    : (matchData.checks || []).map(([met, label]) => ({ met, category: "Feltétel", label }));
  const candidateName = matchData.profile?.fullName || candidate.name || "A hallgató";
  const criteriaItems = rawItems.map((item) => ({
    ...item,
    // A megosztott kiértékelés hallgatói feliratait a céges nézetben harmadik személyűre alakítjuk.
    label: String(item.label || "").replace(/\ba profilodban\b/gi, `${candidateName} profiljában`)
      .replace(/\ba profilodból\b/gi, `${candidateName} profiljából`)
      .replace(/\bprofilodban\b/gi, `${candidateName} profiljában`)
      .replace(/\bprofilodból\b/gi, `${candidateName} profiljából`)
      .replace(/\bprofilod\b/gi, `${candidateName} profilja`)
  }));
  return { ...matchData, candidateName, criteriaItems };
}

function candidateMatchIndicator(matchData) {
  if (matchData.percent === null || matchData.percent === undefined) {
    return { className: "is-unknown", symbol: "?", label: "Az egyezés nem számítható" };
  }

  // A profil-összefoglaló ugyanazt a színskálát használja, mint az egyezési százalék címkéje:
  // 80%-tól zöld, 60–79% között sárga, 60% alatt visszafogott terrakotta.
  const className = matchData.percent >= 80
    ? "is-high"
    : matchData.percent >= 60
      ? "is-medium"
      : "is-low";
  const hasUnmetRequirement = matchData.criteriaItems.some((item) => item.met === false);

  if (hasUnmetRequirement) {
    return { className, symbol: "!", label: "Van nem teljesülő feltétel" };
  }
  return { className, symbol: "✓", label: "A kiértékelhető kötelező feltételek teljesülnek" };
}

function renderCandidateMatchCriteria(criteriaItems) {
  return criteriaItems.map((detail) => `
    <li class="candidate-profile-criterion ${detail.met === null ? "is-unknown" : detail.met ? "is-met" : "is-missing"}">
      <span aria-hidden="true">${detail.met === null ? "i" : detail.met ? "✓" : "×"}</span>
      <span><small>${escapeHtml(detail.category || "Feltétel")}</small>${escapeHtml(detail.label)}</span>
    </li>`).join("");
}

function openCandidateMatchDetails(candidate) {
  const dialog = document.querySelector("#candidate-match-dialog");
  const content = document.querySelector("#candidate-match-content");
  const job = companyJobs[selectedJob];
  if (!dialog || !content || !candidate || !job) return;

  const matchData = candidateMatchView(candidate, job);
  const percent = matchData.percent === null ? null : matchData.percent;
  const unmetCount = matchData.criteriaItems.filter((item) => item.met === false).length;
  const infoCount = matchData.criteriaItems.filter((item) => item.met === null).length;
  const criteriaMarkup = matchData.criteriaItems.length
    ? renderCandidateMatchCriteria(matchData.criteriaItems)
    : '<li class="candidate-profile-criterion is-unknown"><span aria-hidden="true">i</span><span><small>Kiértékelés</small>Ehhez a jelentkezéshez még nincs elegendő strukturált adat.</span></li>';
  const percentLabel = percent === null ? "Nem számítható" : `${percent}%`;
  const percentClass = percent === null ? "is-unknown" : percent >= 80 ? "is-high" : percent >= 60 ? "is-medium" : "is-low";
  const description = percent === null
    ? "A hallgatói profil és az álláshirdetés jelenlegi adatai alapján nem számítható megbízható egyezési százalék."
    : unmetCount
      ? `${unmetCount} kötelező feltétel nem teljesül, vagy hiányzik a hallgatói profilból.${infoCount ? ` További ${infoCount} előnyként megjelölt adat tájékoztató jellegű.` : ""} Az alábbi listában láthatók a konkrét eltérések.`
      : infoCount
        ? `A kiértékelhető kötelező feltételek teljesülnek. ${infoCount} előnyként megjelölt adat tájékoztató jellegű.`
        : "A kiértékelhető feltételek teljesülnek. Az alábbi listában a részletes ellenőrzés látható.";
  const progressValue = percent === null ? 0 : percent;

  content.innerHTML = `
    <div class="candidate-match-modal-heading">
      <div>
        <span class="candidate-profile-section-kicker">Személyre szabott illeszkedés</span>
        <h2 id="candidate-match-title">Profil-egyezés</h2>
        <p><strong>${escapeHtml(matchData.candidateName)}</strong> · ${escapeHtml(job.title)}</p>
      </div>
      <strong class="candidate-match-modal-score ${percentClass}">${escapeHtml(percentLabel)}</strong>
    </div>
    <p class="candidate-match-modal-description">${escapeHtml(description)}</p>
    <div class="candidate-match-modal-progress ${percentClass}" role="progressbar" aria-label="Profil-egyezés" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progressValue}"><span style="width:${progressValue}%"></span></div>
    <ul class="candidate-profile-criteria candidate-match-modal-criteria">${criteriaMarkup}</ul>
    <p class="candidate-match-modal-footnote">A kiértékelés a hallgató profiljában megadott adatok és a hirdetés feltételei alapján készült becslés. A hiányzó profiladat nem számít teljesített feltételnek; a százalék önmagában nem helyettesíti a munkáltatói értékelést.</p>`;
  dialog.showModal();
}

function renderJobManagement(job) {
  const panel = document.querySelector("#job-management-panel");
  const actions = document.querySelector("#job-management-actions");
  const statusTitle = document.querySelector("#job-management-status");
  const description = document.querySelector("#job-management-description");
  const feedback = document.querySelector("#job-management-feedback");
  if (!panel || !actions) return;
  actions.replaceChildren();
  if (feedback) { feedback.hidden = true; feedback.textContent = ""; }
  if (!job?.isOwned || !job.postId) { panel.hidden = true; return; }

  panel.hidden = false;
  const labels = window.GyakorStartJobPostings?.statusLabels || {};
  statusTitle.textContent = labels[job.status] || "Hirdetés";
  const copy = {
    draft: "A piszkozat csak a közzététel után válik láthatóvá az álláskeresők számára.",
    active: "A közzétett hirdetés feltételei már nem módosíthatók.",
    paused: "A hirdetés nem látható az aktív állások között, és új jelentkezést nem fogad. Bármikor újraaktiválhatod, ha még nem járt le.",
    closed: "A hirdetés véglegesen lezárult. A korábbi jelentkezések és interjúelőzmények továbbra is kezelhetők.",
    expired: "A jelentkezési határidő lejárt. A hirdetés nem aktiválható újra, a korábbi jelentkezések továbbra is kezelhetők."
  };
  description.textContent = copy[job.status] || "";

  const addAction = (action, label, variant = "button-light", options = {}) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `button ${variant}`;
    button.dataset.jobAction = action;
    button.textContent = label;
    if (options.disabled) {
      button.disabled = true;
      button.title = options.title || "Ez a művelet jelenleg nem elérhető.";
      button.setAttribute("aria-disabled", "true");
    }
    actions.append(button);
  };
  if (job.status === "draft") {
    addAction("edit-draft", "Piszkozat szerkesztése", "button-light");
    addAction("publish", "Közzététel", "button-primary");
    const count = getReliableApplicantCount(job);
    addAction("delete", "Piszkozat törlése", "button-danger", {
      disabled: count === null || count > 0,
      title: count === null ? "A törlés előtt ellenőrizni kell a jelentkezések számát." : count > 0 ? `A piszkozathoz már ${count} jelentkezés tartozik, ezért nem törölhető.` : ""
    });
  } else if (job.status === "active") {
    addAction("pause", "Szüneteltetés", "button-light");
    addAction("close", "Végleges lezárás", "button-danger");
    const count = getReliableApplicantCount(job);
    addAction("delete", "Törlés", "button-danger", {
      disabled: count === null || count > 0,
      title: count === null ? "A törlés előtt ellenőrizni kell a jelentkezések számát." : count > 0 ? `A hirdetéshez már ${count} jelentkezés tartozik. Törlés helyett szüneteltetheted vagy lezárhatod.` : ""
    });
  } else if (job.status === "paused") {
    addAction("resume", "Újraaktiválás", "button-primary");
    addAction("close", "Végleges lezárás", "button-danger");
    const count = getReliableApplicantCount(job);
    addAction("delete", "Törlés", "button-danger", {
      disabled: count === null || count > 0,
      title: count === null ? "A törlés előtt ellenőrizni kell a jelentkezések számát." : count > 0 ? `A hirdetéshez már ${count} jelentkezés tartozik. Törlés helyett véglegesen lezárhatod.` : ""
    });
  } else if (["closed", "expired"].includes(job.status)) {
    const count = getReliableApplicantCount(job);
    addAction("delete", "Törlés", "button-danger", {
      disabled: count === null || count > 0,
      title: count === null ? "A törlés előtt ellenőrizni kell a jelentkezések számát." : count > 0 ? `A hirdetéshez már ${count} jelentkezés tartozik. A hirdetés és az előzmények megőrzése érdekében nem törölhető.` : ""
    });
  }
}

function setJobManagementFeedback(message, isError = false) {
  const feedback = document.querySelector("#job-management-feedback");
  if (!feedback) return;
  feedback.hidden = !message;
  feedback.textContent = message || "";
  feedback.classList.toggle("is-error", Boolean(isError));
}

async function performJobLifecycleAction(action) {
  const uiJob = companyJobs[selectedJob];
  const store = window.GyakorStartJobPostings;
  const post = useCompanyApi ? uiJob?.raw : store?.get(selectedJob);
  if (!uiJob || !post || !currentCompanyAccount) return;
  const isOwner = post.ownerAccountId
    ? String(post.ownerAccountId) === String(currentCompanyAccount.id)
    : post.company === currentCompanyName;
  if (!isOwner) return;
  const count = useCompanyApi ? getReliableApplicantCount(uiJob) : store.getApplicantCount(selectedJob);

  if (action === "edit-draft" || action === "publish") {
    if (post.status !== "draft") return;
    openPosting(post);
    return;
  }
  if (action === "delete" && count === null) {
    setJobManagementFeedback("A hirdetés törlése előtt nem sikerült ellenőrizni a jelentkezések számát. Frissítsd a hirdetés adatait, majd próbáld újra.", true);
    return;
  }
  if (action === "delete" && count > 0) {
    setJobManagementFeedback(`A hirdetés nem törölhető, mert már ${count} jelentkezés tartozik hozzá.`, true);
    return;
  }
  if (action === "delete" && !window.confirm("Biztosan törlöd ezt a hirdetést? A művelet nem vonható vissza.")) return;
  if (action === "pause" && !window.confirm("Szünetelteted a hirdetést? Amíg szünetel, új jelentkezés nem érkezhet, de később újraaktiválhatod.")) return;
  if (action === "close") {
    const closeMessage = useCompanyApi
      ? "Véglegesen lezárod a hirdetést? A még elbírálás alatt álló jelentkezések lezárulnak, és a hallgatók értesítést kapnak. A művelet nem vonható vissza."
      : "Véglegesen lezárod a hirdetést? Az elbírálás alatt álló jelentkezések elutasított státuszba kerülnek, és a hallgatói idővonalon is megjelenik a lezárás. A művelet nem vonható vissza.";
    if (!window.confirm(closeMessage)) return;
  }

  let result;
  try {
    if (useCompanyApi) {
      if (action === "delete") {
        result = await requestCompanyApi(`/company/jobs/${encodeURIComponent(selectedJob)}`, { method:"DELETE" });
      } else {
        const status = { pause:"PAUSED", resume:"ACTIVE", close:"CLOSED" }[action];
        result = await requestCompanyApi(`/company/jobs/${encodeURIComponent(selectedJob)}/status`, {
          method:"PATCH", body:JSON.stringify({ status })
        });
      }
    } else if (action === "delete") {
      result = store.deletePost(selectedJob);
    } else {
      result = store.transition(selectedJob, ({ pause:"paused", resume:"active", close:"closed" })[action]);
    }
  } catch (error) {
    setJobManagementFeedback(error.message || "A művelet nem sikerült.", true);
    return;
  }
  if (result?.ok === false) {
    setJobManagementFeedback(result.error || "A művelet nem sikerült.", true);
    return;
  }

  if (action === "delete") selectedJob = "";
  if (useCompanyApi) await refreshCompanyJobsFromApi();
  else syncCompanyJobs();
  if (action === "close") {
    const rejected = Number(result?.rejectedApplicationsCount ?? result?.rejectedCount ?? 0);
    setJobManagementFeedback(`A hirdetés véglegesen lezárult. ${rejected} elbírálás alatt álló jelentkezés lezárult; az érintett hallgatók idővonalán megjelent a döntés.`);
  } else if (action === "delete") {
    setJobManagementFeedback("A hirdetés törölve.");
  } else {
    const messages = { pause:"A hirdetés szünetel. Újraaktiválható, amíg a határidő le nem jár.", resume:"A hirdetés ismét aktív, új jelentkezéseket fogad." };
    setJobManagementFeedback(messages[action] || "A hirdetés állapota frissült.");
  }
}

function renderSelectedJob() {
  const job = companyJobs[selectedJob];
  if (!job) return;
  const all = job.candidates.map((candidate, index) => {
    const match = calculateCandidateMatch(candidate, job);
    candidate.checks = match.checks;
    candidate.matchPercent = match.percent;
    candidate.match = match.percent === 100;
    return { candidate, index };
  });
  const matching = all.filter(({ candidate }) => candidate.matchPercent !== null && candidate.matchPercent >= 80);
  const statusCounts = Object.fromEntries(candidateStatuses.map((status) => [
    status, all.filter(({ candidate }) => candidate.status === status).length
  ]));
  const applicantCount = getReliableApplicantCount(job);
  const visible = all.filter(({ candidate }) => candidate.status === candidateStatusFilter);

  document.querySelector("#selected-job-heading").textContent = job.title;
  document.querySelector("#selected-job-title").textContent = job.title;
  document.querySelector("#selected-job-meta").textContent = job.meta;
  document.querySelector(".posting-summary .listing-label").textContent = window.GyakorStartJobPostings?.statusLabels?.[job.status] || (job.closed ? "Lezárt hirdetés" : "Aktív hirdetés");
  document.querySelector(".company-stats").hidden = job.status === "draft";
  document.querySelector(".applicants-section").hidden = job.status === "draft";
  document.querySelector("#selected-job-link").hidden = job.status === "draft";
  renderJobManagement(job);
  document.querySelector("#selected-job-logo").textContent = job.logo;
  document.querySelector("#selected-job-logo").className = `job-logo ${job.logoClass}`;
  document.querySelector("#selected-job-link").href = job.href;
  document.querySelector("#stat-total").textContent = applicantCount === null ? "—" : applicantCount;
  const statusCountLabel = (status) => job.hasApplicationData ? statusCounts[status] : "—";
  document.querySelector("#stat-new").textContent = statusCountLabel("new");
  document.querySelector("#stat-interview").textContent = statusCountLabel("interview");
  document.querySelector("#stat-rejected").textContent = statusCountLabel("rejected");

  candidateStatuses.forEach((status) => {
    const count = document.querySelector(`#status-count-${status}`);
    if (count) count.textContent = statusCountLabel(status);
  });
  statusButtons.forEach((button) => {
    const active = button.dataset.candidateStatus === candidateStatusFilter;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  const candidateList = document.querySelector("#candidate-list");
  const emptyCopy = {
    new: ["Nincs új jelentkező ennél az állásnál.", "Amint új jelentkezés érkezik, itt jelenik meg."],
    interview: ["Még senkit sem hívtál interjúra.", "Az új jelentkezőknél az „Interjúra hívás” gombbal jelezheted a kiválasztási továbblépést."],
    rejected: ["Nincs lezárt jelentkezés.", "Az elutasított jelentkezések itt maradnak visszakereshetően."]
  }[candidateStatusFilter];
  if (!job.hasApplicationData && applicantCount !== 0) {
    candidateList.innerHTML = '<div class="candidate-empty-state"><span class="empty-state-icon" aria-hidden="true">👥</span><strong>A jelentkezők adatai nem érkeztek meg</strong><span>Frissítsd a hirdetés adatait, vagy ellenőrizd a jelentkezéslista API-válaszát.</span></div>';
  } else if (all.length === 0) {
    candidateList.innerHTML = '<div class="candidate-empty-state"><span class="empty-state-icon" aria-hidden="true">👤</span><strong>Még nem érkezett jelentkezés erre a hirdetésre</strong><span>Amint egy hallgató jelentkezik, itt jelenik meg a profilja és a jelentkezése.</span></div>';
  } else {
    candidateList.innerHTML = visible.length
      ? visible.map(({ candidate, index }) => candidateMarkup(candidate, index)).join("")
      : `<div class="candidate-empty-state"><span class="empty-state-icon" aria-hidden="true">👤</span><strong>${emptyCopy[0]}</strong><span>${emptyCopy[1]}</span></div>`;
  }
}

async function updateCandidateStatus(candidate, nextStatus, details = {}) {
  if (!candidate || !candidateStatuses.includes(nextStatus)) return false;
  if (candidate.status === nextStatus) return true;

  const feedback = document.querySelector("#candidate-feedback");
  try {
    if (useCompanyApi) {
      if (!candidate.applicationId) throw new Error("A jelentkezés azonosítója hiányzik.");
      const response = await requestCompanyApi(`/applications/${encodeURIComponent(candidate.applicationId)}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus, message: details.message || "" })
      });
      const savedApplication = response?.application || response;
      candidate.status = applicationStore.normalizeStatus(savedApplication?.status || nextStatus);
      // A hallgatói oldal szerver módban a saját jelentkezéseit a következő betöltéskor/fókuszváltáskor frissíti.
      window.dispatchEvent(new CustomEvent("gyakorstart:applications-changed"));
    } else {
      const result = applicationStore.updateStatus(candidate.applicationId, nextStatus, details);
      if (!result.ok && !candidate.isDemoData) throw new Error(result.error || "A jelentkezés státuszát nem sikerült elmenteni.");
      // A demo jelöltek többsége csak a statikus bemutatóadat része; náluk a státusz
      // a bemutatóoldalon változik. A két mintajelentkezés külön demo-tárhelyen naplózódik.
      candidate.status = nextStatus;
    }

    renderSelectedJob();
    feedback.hidden = false;
    feedback.textContent = candidate.isDemoData
      ? `${candidate.name} bemutató-státusza frissült: ${candidateStatusLabels[candidate.status]}.`
      : `${candidate.name} státusza frissült: ${candidateStatusLabels[candidate.status]}. A hallgató a Jelentkezéseim idővonalán is látja a változást.`;
    return true;
  } catch (error) {
    renderSelectedJob();
    feedback.hidden = false;
    feedback.textContent = error.message || "A jelentkezés státuszát nem sikerült elmenteni. Próbáld újra.";
    return false;
  }
}

function normalizeCandidateName(value) {
  return String(value || "").trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("hu-HU").replace(/\s+/g, " ");
}

function findStudentAccount(candidate) {
  try {
    const accounts = JSON.parse(localStorage.getItem("gyakorstart.accounts.v1") || "[]");
    if (!Array.isArray(accounts)) return null;
    const students = accounts.filter((account) => account?.role === "student" && account.profile && typeof account.profile === "object");

    // Elsődleges kapcsolat: a jelentkezésben eltárolt, stabil hallgatói azonosító.
    const byId = students.find((account) => candidate.studentId && String(account.id) === String(candidate.studentId));
    if (byId) return byId;

    // Régebbi helyi jelentkezés-rekordokban előfordulhat, hogy csak az e-mail maradt meg.
    const candidateEmail = String(candidate.studentEmail || candidate.email || "").trim().toLocaleLowerCase("hu-HU");
    if (candidateEmail) {
      const byEmail = students.filter((account) => String(account.email || "").trim().toLocaleLowerCase("hu-HU") === candidateEmail);
      if (byEmail.length === 1) return byEmail[0];
    }

    // Visszafelé kompatibilitás: korábbi prototípus-rekordok néha nem tartalmaztak studentId-t.
    // Csak egyetlen, pontos névegyezés esetén kapcsolunk; több azonos nevű fióknál nem találgatunk.
    const candidateName = normalizeCandidateName(candidate.studentName || candidate.name);
    if (candidateName) {
      const byUniqueName = students.filter((account) =>
        normalizeCandidateName(account.profile?.fullName) === candidateName
      );
      if (byUniqueName.length === 1) return byUniqueName[0];
    }
    return null;
  } catch {
    return null;
  }
}

function normalizeMatchingProfile(profileValue) {
  const profile = profileValue && typeof profileValue === "object" && !Array.isArray(profileValue)
    ? { ...profileValue }
    : {};

  // A hallgatói profiloldal migrációja nem fut le minden felhasználónál,
  // ezért a matching itt is kezeli a korábbi helyi profilverziók mezőit.
  const semesterText = String(profile.semester ?? profile.currentSemester ?? "").trim();
  const semesterMatch = semesterText.match(/7\s*\+|\d+/);
  if (semesterMatch) profile.semester = semesterMatch[0].replace(/\s/g, "");

  const legacyHours = Number(profile.weeklyHours);
  const currentMin = profile.weeklyHoursMin;
  const currentMax = profile.weeklyHoursMax;
  const hasCurrentMin = currentMin !== "" && currentMin !== null && currentMin !== undefined && Number.isFinite(Number(currentMin)) && Number(currentMin) > 0;
  const hasCurrentMax = currentMax !== "" && currentMax !== null && currentMax !== undefined && Number.isFinite(Number(currentMax)) && Number(currentMax) > 0;
  if ((!hasCurrentMin || !hasCurrentMax) && Number.isFinite(legacyHours) && legacyHours >= 5 && legacyHours <= 40) {
    if (!hasCurrentMin) profile.weeklyHoursMin = legacyHours;
    if (!hasCurrentMax) profile.weeklyHoursMax = legacyHours;
  }

  const catalogs = window.GyakorStartCatalogs;
  if (Array.isArray(profile.languages)) {
    profile.languages = profile.languages.map((language) => {
      if (!language || typeof language !== "object") return language;
      const normalized = { ...language };
      normalized.level = catalogs?.normalizeLanguageLevel?.(language.level) || language.level || "";
      normalized.examLevel = catalogs?.normalizeExamLevel?.(language.examLevel) || language.examLevel || "";
      return normalized;
    });
  } else {
    profile.languages = [];
  }

  // Régi profilokban a szak vagy a készségek alternatív mezőnéven is szerepelhettek.
  profile.major = profile.major || profile.majorName || profile.studyProgram || "";
  if (!Array.isArray(profile.skills)) {
    profile.skills = Array.isArray(profile.technicalSkills) ? profile.technicalSkills : [];
  }
  return profile;
}

function getCandidateProfile(candidate) {
  const linkedAccount = findStudentAccount(candidate);
  if (linkedAccount?.profile) {
    return { account: linkedAccount, profile: normalizeMatchingProfile(linkedAccount.profile) };
  }
  if (candidate.isDemoData) {
    return { account: null, profile: normalizeMatchingProfile(buildDemoCandidateProfile(candidate)) };
  }
  return { account: null, profile: normalizeMatchingProfile({}) };
}

function buildDemoCandidateProfile(candidate) {
  const parts = String(candidate.details || "").split("·").map((part) => part.trim()).filter(Boolean);
  const major = parts[0] || "Nincs megadva";
  const semester = parts.find((part) => /félév/i.test(part))?.match(/\d+\.?\s*félév/i)?.[0] || "Nincs megadva";
  const languagePart = parts.find((part) => /angol|német|francia|spanyol|olasz|orosz|kínai|japán|szlovák/i.test(part));
  const extraSkills = parts.filter((part) => part !== major && part !== semester && part !== languagePart);
  const skills = [...new Set([...extraSkills, ...candidate.checks
    .filter(([met, label]) => met && !/(megfelelő szak|félév|nyelv|angol|német)/i.test(label))
    .map(([, label]) => label)])];

  // Kizárólag bemutatóadat: nem valódi személyes elérhetőség.
  const isBaloghPeterDemo = candidate.initials === "BP";
  return {
    fullName: candidate.name,
    university: "Nincs megadva",
    major,
    semester: semester.match(/\d+/)?.[0] || "",
    city: isBaloghPeterDemo ? "Győr" : "Nincs megadva",
    phone: "Nincs megadva",
    email: isBaloghPeterDemo ? "balogh.peter@example.test" : "Nincs megadva",
    introduction: "",
    languages: languagePart ? [{
      name: languagePart.replace(/\s+(A1|A2|B1|B2|C1|C2)$/i, ""),
      level: languagePart.match(/A1|A2|B1|B2|C1|C2/i)?.[0] || languagePart,
      hasExam: false,
      examLevel: ""
    }] : [],
    skills: skills.map((name) => ({ name, level: "" })),
    relevantCourses: [],
    education: [],
    experience: [],
    projects: [],
    drivingLicense: "Nincs megadva",
    availabilityDate: "",
    weeklyHoursMin: "",
    weeklyHoursMax: "",
    workMode: "",
    certifications: [],
    linkedinUrl: "",
    portfolioUrl: "",
    profileImage: "",
    _demo: true
  };
}

function candidateDisplayValue(value, fallback = "Nincs megadva") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function renderProfileDefinitionList(items) {
  return `<dl>${items.map(([label, value]) => `
    <div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(candidateDisplayValue(value))}</dd></div>`).join("")}</dl>`;
}

function renderProfileChips(items, emptyText = "Még nincs megadva.") {
  const values = (Array.isArray(items) ? items : []).map((item) => {
    if (typeof item === "string") return item.trim();
    if (!item || typeof item !== "object") return "";
    const name = item.name || item.title || item.label || "";
    const level = item.level || "";
    return [name, level].filter(Boolean).join(" · ");
  }).filter(Boolean);
  return values.length
    ? `<div class="candidate-profile-skills">${values.map((value) => `<span>${escapeHtml(value)}</span>`).join("")}</div>`
    : `<p class="candidate-profile-empty">${escapeHtml(emptyText)}</p>`;
}

function renderProfileEntries(entries, kind) {
  if (!Array.isArray(entries) || !entries.length) {
    return '<p class="candidate-profile-empty">Még nincs megadva.</p>';
  }
  return `<div class="candidate-profile-entry-list">${entries.map((entry) => {
    const title = kind === "education"
      ? (entry.institution || entry.program || "Tanulmány")
      : kind === "project"
        ? (entry.name || "Projekt")
        : (entry.role || entry.company || "Tapasztalat");
    const subtitle = kind === "education"
      ? (entry.program || "")
      : kind === "project"
        ? (entry.technologies || "")
        : (entry.company || "");
    const period = entry.period || "";
    const description = entry.description || "";
    const url = safeCandidateExternalUrl(entry.url);
    return `<article class="candidate-profile-entry">
      <strong>${escapeHtml(title)}</strong>
      ${subtitle ? `<span>${escapeHtml(subtitle)}</span>` : ""}
      ${period ? `<small>${escapeHtml(period)}</small>` : ""}
      ${description ? `<p>${escapeHtml(description)}</p>` : ""}
      ${url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Megnyitás ↗</a>` : ""}
    </article>`;
  }).join("")}</div>`;
}

function safeCandidateExternalUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function renderCandidateContactItem(label, value, type) {
  const cleanValue = candidateDisplayValue(value);
  if (cleanValue === "Nincs megadva") {
    return `<div class="candidate-contact-item"><span>${escapeHtml(label)}</span><strong class="is-empty">${cleanValue}</strong></div>`;
  }
  let rendered = escapeHtml(cleanValue);
  if (type === "email" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue)) {
    rendered = `<a href="mailto:${escapeHtml(cleanValue)}">${escapeHtml(cleanValue)}</a>`;
  } else if (type === "phone") {
    const phoneHref = cleanValue.replace(/[^\d+]/g, "");
    if (phoneHref.length >= 7) rendered = `<a href="tel:${escapeHtml(phoneHref)}">${escapeHtml(cleanValue)}</a>`;
  }
  return `<div class="candidate-contact-item"><span>${escapeHtml(label)}</span><strong>${rendered}</strong></div>`;
}

function openCandidateProfile(candidate) {
  const dialog = document.querySelector("#candidate-profile-dialog");
  const content = document.querySelector("#candidate-profile-content");
  const { account: linkedAccount, profile: matchedProfile } = getCandidateProfile(candidate);
  const profile = {
    fullName: candidate.name,
    languages: [], skills: [], education: [], experience: [], projects: [], certifications: [],
    ...matchedProfile
  };
  const email = linkedAccount?.email || (profile._demo ? "" : profile.email || "");
  const candidateName = profile.fullName || candidate.name;
  const initials = candidate.initials || candidateName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  const semester = profile.semester
    ? (String(profile.semester) === "7+" ? "7. vagy magasabb félév" : `${profile.semester}. félév`)
    : "Nincs megadva";
  const weeklyHoursMin = Number(profile.weeklyHoursMin);
  const weeklyHoursMax = Number(profile.weeklyHoursMax);
  const weeklyHours = profile.weeklyHoursMin !== "" && profile.weeklyHoursMax !== "" &&
    Number.isFinite(weeklyHoursMin) && Number.isFinite(weeklyHoursMax) && weeklyHoursMin > 0 && weeklyHoursMax >= weeklyHoursMin
    ? `Heti ${weeklyHoursMin}–${weeklyHoursMax} óra`
    : "Nincs megadva";
  const availabilityDate = profile.availabilityDate && !Number.isNaN(new Date(`${profile.availabilityDate}T00:00:00`).getTime())
    ? new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "long", day: "numeric" }).format(new Date(`${profile.availabilityDate}T00:00:00`))
    : "Nincs megadva";
  const languages = Array.isArray(profile.languages) ? profile.languages : [];
  const languageMarkup = languages.length ? `<div class="candidate-profile-entry-list">${languages.map((language) => {
    const name = language.name || language.code || "Nyelv";
    const level = companyCatalogs.languageLevelLabel(language.level);
    const exam = language.hasExam
      ? `${companyCatalogs.examLevelLabel(language.examLevel)} nyelvvizsga`
      : "Nyelvvizsga nincs megadva / nem jelölt";
    const writing = language.writingLevel || language.writing || "";
    return `<article class="candidate-profile-entry candidate-language-entry">
      <strong>${escapeHtml(name)}</strong><span>Beszédkészség: ${escapeHtml(level)}</span>
      ${writing ? `<span>Íráskészség: ${escapeHtml(writing)}</span>` : ""}
      <small>${escapeHtml(exam)}</small>
    </article>`;
  }).join("")}</div>` : '<p class="candidate-profile-empty">Még nincs nyelvtudás megadva.</p>';
  const experience = Array.isArray(profile.experience) ? profile.experience : [];
  const professionalExperience = experience.filter((entry) => entry.type === "professional");
  const otherExperience = experience.filter((entry) => entry.type !== "professional");
  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const profileImage = typeof profile.profileImage === "string" && /^data:image\/(png|jpeg|webp);base64,/i.test(profile.profileImage)
    ? `<img src="${profile.profileImage}" alt="${escapeHtml(candidateName)} profilképe" />`
    : `<span>${escapeHtml(initials)}</span>`;
  const matchData = candidateMatchView(candidate, companyJobs[selectedJob]);
  const matchIndicator = candidateMatchIndicator(matchData);
  const criteria = renderCandidateMatchCriteria(matchData.criteriaItems);
  const matchPercent = matchData.percent === null ? "Nem számítható" : `${matchData.percent}%`;
  const externalLinks = [
    ["LinkedIn", profile.linkedinUrl],
    ["GitHub / portfólió", profile.portfolioUrl]
  ].map(([label, value]) => {
    const url = safeCandidateExternalUrl(value);
    return url ? `<a class="candidate-profile-external-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} ↗</a>` : "";
  }).filter(Boolean).join("");

  content.innerHTML = `
    <div class="candidate-profile-header">
      <div class="candidate-profile-avatar">${profileImage}</div>
      <div class="candidate-profile-heading-copy">
        <span class="modal-kicker">Jelölt adatlap</span>
        <h2 id="candidate-profile-title">${escapeHtml(candidateName)}</h2>
        <p>${escapeHtml(profile.major || "Szak nincs megadva")} · ${escapeHtml(semester)}</p>
      </div>
    </div>
    <section class="candidate-profile-contact" aria-labelledby="candidate-contact-title">
      <div class="candidate-profile-section-heading"><div><span class="candidate-profile-section-kicker">Kapcsolatfelvétel</span><h3 id="candidate-contact-title">Elérhetőségek</h3></div><span class="candidate-contact-visible">A cég számára látható</span></div>
      <div class="candidate-contact-grid">
        ${renderCandidateContactItem("E-mail-cím", email, "email")}
        ${renderCandidateContactItem("Telefonszám", profile.phone, "phone")}
        ${renderCandidateContactItem("Lakóhely", profile.city, "text")}
      </div>
    </section>
    <section class="candidate-profile-section candidate-profile-match ${matchIndicator.className}" aria-labelledby="candidate-profile-match-title">
      <div class="candidate-profile-match-heading">
        <div>
          <span class="candidate-profile-section-kicker">Kiválasztási összefoglaló</span>
          <h3 id="candidate-profile-match-title">${escapeHtml(matchPercent)} egyezés a kiválasztott állással</h3>
          <p>Az érték a megadott profiladatok és a hirdetés feltételei alapján készült becslés. A kötelező feltételek külön is ellenőrizendők.</p>
        </div>
        <span class="candidate-profile-match-icon ${matchIndicator.className}" role="img" aria-label="${escapeHtml(matchIndicator.label)}" title="${escapeHtml(matchIndicator.label)}">${matchIndicator.symbol}</span>
      </div>
      <ul class="candidate-profile-criteria">${criteria}</ul>
    </section>
    <section class="candidate-profile-section candidate-profile-introduction"><h3>Bemutatkozás</h3><p>${escapeHtml(candidateDisplayValue(profile.introduction, "Még nincs bemutatkozás megadva."))}</p></section>
    <div class="candidate-profile-grid">
      <section class="candidate-profile-section"><h3>Tanulmányok</h3>${renderProfileDefinitionList([
        ["Egyetem", profile.university], ["Szak", profile.major], ["Aktuális félév", semester]
      ])}</section>
      <section class="candidate-profile-section"><h3>Nyelvtudás</h3>${languageMarkup}</section>
      <section class="candidate-profile-section"><h3>Készségek és ismeretek</h3>${renderProfileChips(skills, "Még nincs készség megadva.")}<h4 class="candidate-profile-subheading">Releváns tantárgyak</h4>${renderProfileChips(profile.relevantCourses, "Még nincs releváns tantárgy megadva.")}</section>
      <section class="candidate-profile-section"><h3>Jogosítvány és munkavégzés</h3>${renderProfileDefinitionList([
        ["Jogosítvány", profile.drivingLicense], ["Heti vállalt munkaidő", weeklyHours], ["Munkavégzés módja", profile.workMode], ["Legkorábbi munkakezdés", availabilityDate]
      ])}</section>
      <section class="candidate-profile-section"><h3>Szakmai tapasztalat</h3>${renderProfileEntries(professionalExperience, "experience")}</section>
      <section class="candidate-profile-section"><h3>Egyéb munkatapasztalat</h3>${renderProfileEntries(otherExperience, "experience")}</section>
      <section class="candidate-profile-section"><h3>Projektek</h3>${renderProfileEntries(profile.projects, "project")}</section>
      <section class="candidate-profile-section"><h3>Korábbi tanulmányok</h3>${renderProfileEntries(profile.education, "education")}</section>
      <section class="candidate-profile-section"><h3>Tanúsítványok és képesítések</h3>${renderProfileChips(profile.certifications, "Még nincs tanúsítvány megadva.")}</section>
      <section class="candidate-profile-section"><h3>Portfólió és szakmai linkek</h3>${externalLinks || '<p class="candidate-profile-empty">Még nincs külső szakmai link megadva.</p>'}</section>
    </div>
    <div class="candidate-profile-current-status"><span>Jelentkezés állapota</span><strong class="candidate-status-badge status-${candidate.status}">${candidateStatusLabels[candidate.status]}</strong></div>
`;
  dialog.showModal();
}

jobPicker.addEventListener("click", (event) => {
  const button = event.target.closest("[data-company-job]");
  if (!button) return;
  selectedJob = button.dataset.companyJob;
  candidateStatusFilter = "new";
  jobPicker.querySelectorAll("[data-company-job]").forEach((item) => item.classList.toggle("active", item === button));
  document.querySelector("#candidate-feedback").hidden = true;
  renderSelectedJob();
});

statusButtons.forEach((button) => button.addEventListener("click", () => {
  candidateStatusFilter = button.dataset.candidateStatus;
  document.querySelector("#candidate-feedback").hidden = true;
  renderSelectedJob();
}));

// Delegált eseménykezelés: az újrarenderelt kártyák gombjai is működnek.
document.querySelector("#candidate-list").addEventListener("click", async (event) => {
  const profileButton = event.target.closest(".candidate-open-profile");
  const matchButton = event.target.closest(".candidate-open-match");
  const actionButton = event.target.closest("[data-candidate-action]");
  if (!profileButton && !matchButton && !actionButton) return;
  const trigger = profileButton || matchButton || actionButton;
  const card = trigger.closest(".candidate-card");
  const index = Number(card?.querySelector(".candidate-open-profile")?.dataset.candidateIndex);
  const candidate = companyJobs[selectedJob]?.candidates[index];
  if (!candidate) return;
  if (profileButton) {
    openCandidateProfile(candidate);
    return;
  }
  if (matchButton) {
    openCandidateMatchDetails(candidate);
    return;
  }

  const action = actionButton.dataset.candidateAction;
  if (action === "invite") {
    // Egyetlen kattintás: nincs külön interjúűrlap, időpontkezelés vagy e-mail-küldés.
    actionButton.disabled = true;
    actionButton.textContent = "Státusz frissítése…";
    await updateCandidateStatus(candidate, "interview", {
      message: "A vállalat interjúra hívott. A további egyeztetést közvetlenül a vállalat HR-munkatársával intézheted."
    });
    return;
  }
  if (action === "reject") {
    if (!window.confirm(`Biztosan elutasítod ${candidate.name} jelentkezését? A hallgató a profilján látni fogja a lezárást.`)) return;
    await updateCandidateStatus(candidate, "rejected", {
      message: "A cég ezúttal másik jelentkezőt választott. Köszönjük, hogy jelentkeztél!"
    });
    return;
  }
  if (action === "restore") {
    await updateCandidateStatus(candidate, "new", {
      message: "A cég újranyitotta a jelentkezésedet; a kiválasztási folyamat folytatódik."
    });
  }
});

document.querySelector("#candidate-profile-close").addEventListener("click", () => {
  document.querySelector("#candidate-profile-dialog").close();
});
document.querySelector("#candidate-profile-dialog").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});
document.querySelector("#candidate-match-close").addEventListener("click", () => {
  document.querySelector("#candidate-match-dialog").close();
});
document.querySelector("#candidate-match-dialog").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});

const dialog = document.querySelector("#posting-dialog");
const formView = document.querySelector("#posting-form-view");
const success = document.querySelector("#posting-success");

// A hallgatói profil és a céges hirdetés ugyanazokat a közös törzsadatokat használja.
const companyCatalogs = window.GyakorStartCatalogs;
const minimumSemesterSelect = document.querySelector("#post-min-semester");
if (minimumSemesterSelect) {
  companyCatalogs.populateSemesterSelect(minimumSemesterSelect, "Válassz minimum félévet…");
}
const studentLanguageLevels = companyCatalogs.languageLevels;
const examLevels = companyCatalogs.examLevels;
const postLanguageList = document.querySelector("#post-language-list");
const postLanguageSelect = document.querySelector("#post-language-to-add");
const postLanguageAddRow = document.querySelector("#post-language-add-row");
const postLanguageEmpty = document.querySelector("#post-language-empty");
const postProgramList = document.querySelector("#post-program-list");
const postProgramSelect = document.querySelector("#post-program-to-add");
const postProgramCustomWrap = document.querySelector("#post-program-custom-wrap");
const postProgramCustomInput = document.querySelector("#post-program-custom-name");

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

companyCatalogs.populateLanguageSelect(postLanguageSelect);
companyCatalogs.populateMajorSelect(postProgramSelect);

function updatePostLanguageControls() {
  const addedCodes = new Set([...postLanguageList.querySelectorAll("[data-post-language]")].map((row) => row.dataset.postLanguage));
  [...postLanguageSelect.options].forEach((option) => {
    option.disabled = option.value !== "" && addedCodes.has(option.value);
  });
  if (postLanguageSelect.selectedOptions[0]?.disabled) postLanguageSelect.value = "";
  const requiredCount = [...postLanguageList.querySelectorAll("[data-post-language]")]
    .filter((row) => row.querySelector(".post-language-requirement-type").value === "required").length;
  const relationLabel = document.querySelector(".post-language-relation-label");
  relationLabel.hidden = requiredCount < 2;
  if (requiredCount < 2) document.querySelector("#post-language-relation").value = "all";
  postLanguageEmpty.hidden = addedCodes.size > 0;
}

function addPostLanguageRequirement(language) {
  if (!language?.code || !language?.name) return false;
  const duplicate = [...postLanguageList.querySelectorAll("[data-post-language]")]
    .some((row) => row.dataset.postLanguage === language.code || companyCatalogs.normalizeText(row.querySelector(".post-language-card-heading strong").textContent) === companyCatalogs.normalizeText(language.name));
  if (duplicate) {
    postLanguageSelect.setCustomValidity("Ezt a nyelvet már hozzáadtad.");
    postLanguageSelect.reportValidity();
    return false;
  }

  const row = document.createElement("article");
  row.className = "post-language-card";
  row.dataset.postLanguage = language.code;
  row.innerHTML = `
    <div class="post-language-card-heading">
      <strong>${escapeHtml(language.name)}</strong>
      <button class="post-language-remove" type="button" aria-label="${escapeHtml(language.name)} eltávolítása">Eltávolítás</button>
    </div>
    <div class="post-language-fields">
      <label class="post-language-speaking-level">Minimum elvárt beszédkészség
        <select class="post-language-level" required>
          <option value="">Válassz szintet…</option>
          ${studentLanguageLevels.map((level) => `<option value="${escapeHtml(level.code)}">${escapeHtml(level.label)}</option>`).join("")}
        </select>
      </label>
      <label class="post-language-type">Elvárás jellege
        <select class="post-language-requirement-type">
          <option value="required">Kötelező feltétel</option>
          <option value="preferred">Előnyt jelent</option>
        </select>
      </label>
      <div class="post-language-exam-options">
        <label class="post-language-exam-toggle">
          <input class="post-language-exam-required" type="checkbox" />
          <span><strong>Nyelvvizsga szükséges</strong><small>Csak akkor jelöld be, ha valóban feltétel.</small></span>
        </label>
        <label class="post-language-exam-level-wrap" hidden>Minimum nyelvvizsga-fokozat
          <select class="post-language-exam-level" disabled>
            <option value="">Válassz fokozatot…</option>
            ${examLevels.map((level) => `<option value="${escapeHtml(level.code)}">${escapeHtml(level.label)}</option>`).join("")}
          </select>
        </label>
      </div>
    </div>`;

  row.querySelector(".post-language-remove").addEventListener("click", () => {
    row.remove();
    updatePostLanguageControls();
  });
  const examToggle = row.querySelector(".post-language-exam-required");
  const examLevelWrap = row.querySelector(".post-language-exam-level-wrap");
  const examLevelSelect = row.querySelector(".post-language-exam-level");
  const requirementType = row.querySelector(".post-language-requirement-type");
  const examTitle = row.querySelector(".post-language-exam-toggle strong");
  const examHelp = row.querySelector(".post-language-exam-toggle small");
  function syncLanguageRequirementCopy() {
    const preferred = requirementType.value === "preferred";
    examTitle.textContent = preferred ? "A nyelvvizsga megléte is előny" : "Nyelvvizsga szükséges";
    if (examHelp) examHelp.textContent = preferred ? "Plusz előnyt jelenthet a kiválasztásnál." : "Csak akkor jelöld be, ha valóban feltétel.";
  }
  requirementType.addEventListener("change", () => {
    syncLanguageRequirementCopy();
    updatePostLanguageControls();
  });
  syncLanguageRequirementCopy();
  examToggle.addEventListener("change", () => {
    examLevelWrap.hidden = !examToggle.checked;
    examLevelSelect.disabled = !examToggle.checked;
    examLevelSelect.required = examToggle.checked;
    if (!examToggle.checked) examLevelSelect.value = "";
  });
  postLanguageList.append(row);
  updatePostLanguageControls();
  row.querySelector(".post-language-level").focus();
  return true;
}

function handleAddPostLanguage() {
  const language = companyCatalogs.findLanguageByCode(postLanguageSelect.value);
  if (!language) {
    postLanguageSelect.setCustomValidity("Válassz egy nyelvet a listából.");
    postLanguageSelect.reportValidity();
    return;
  }
  const added = addPostLanguageRequirement(language);
  if (!added) return;
  postLanguageSelect.value = "";
  updatePostLanguageControls();
}

function collectPostLanguageRequirements(validate = true) {
  const rows = [...postLanguageList.querySelectorAll("[data-post-language]")];
  for (const row of rows) {
    const level = row.querySelector(".post-language-level");
    const examRequired = row.querySelector(".post-language-exam-required").checked;
    const examLevel = row.querySelector(".post-language-exam-level");
    if (validate && !level.value) {
      level.setCustomValidity("Minden hozzáadott nyelvhez válassz minimum beszédkészségi szintet.");
      level.reportValidity();
      return null;
    }
    level.setCustomValidity("");
    if (validate && examRequired && !examLevel.value) {
      examLevel.setCustomValidity("Add meg a szükséges nyelvvizsga fokozatát.");
      examLevel.reportValidity();
      return null;
    }
    examLevel.setCustomValidity("");
  }
  return rows.map((row) => {
    const examRequired = row.querySelector(".post-language-exam-required").checked;
    return {
      code: row.dataset.postLanguage,
      name: row.querySelector(".post-language-card-heading strong").textContent.trim(),
      level: row.querySelector(".post-language-level").value,
      minimumCefrLevel: companyCatalogs.languageLevelCefr(row.querySelector(".post-language-level").value),
      requirementType: row.querySelector(".post-language-requirement-type").value,
      examRequired,
      examLevel: examRequired ? row.querySelector(".post-language-exam-level").value : ""
    };
  });
}

function describePostLanguageRequirements(requirements) {
  if (!requirements.length) return "Nyelvtudás: nem feltétel.";
  const mandatory = requirements.filter((item) => item.requirementType === "required");
  const preferred = requirements.filter((item) => item.requirementType === "preferred");
  const format = (item) => {
    const exam = item.examRequired ? `, legalább ${companyCatalogs.examLevelLabel(item.examLevel)} nyelvvizsgával` : "";
    return `${item.name}: ${companyCatalogs.languageLevelLabel(item.level)}${exam}`;
  };
  const relation = document.querySelector("#post-language-relation").value === "any"
    ? "Elegendő egy kötelező nyelv ismerete"
    : "Minden kötelező nyelv ismerete szükséges";
  const parts = [];
  if (mandatory.length) parts.push(`${relation}: ${mandatory.map(format).join("; ")}`);
  if (preferred.length) parts.push(`Előnyt jelent: ${preferred.map(format).join("; ")}`);
  return parts.join(". ") + ".";
}

function updatePostProgramControls() {
  const addedCodes = new Set([...postProgramList.querySelectorAll("[data-post-program]")].map((item) => item.dataset.postProgram));
  [...postProgramSelect.options].forEach((option) => {
    option.disabled = option.value !== "" && option.value !== "other" && addedCodes.has(option.value);
  });
  if (postProgramSelect.selectedOptions[0]?.disabled) postProgramSelect.value = "";
  const isOther = postProgramSelect.value === "other";
  postProgramCustomWrap.hidden = !isOther;
  postProgramCustomInput.required = isOther;
  if (!isOther) postProgramCustomInput.setCustomValidity("");
  document.querySelector("#post-program-empty").hidden = addedCodes.size > 0;
}

function addPostProgram(program) {
  if (!program?.code || !program?.name) return false;
  const duplicate = [...postProgramList.querySelectorAll("[data-post-program]")]
    .some((item) => item.dataset.postProgram === program.code || companyCatalogs.normalizeText(item.querySelector("strong").textContent) === companyCatalogs.normalizeText(program.name));
  if (duplicate) {
    const target = postProgramSelect.value === "other" ? postProgramCustomInput : postProgramSelect;
    target.setCustomValidity("Ezt a szakot már hozzáadtad.");
    target.reportValidity();
    return false;
  }
  const chip = document.createElement("span");
  chip.className = "post-program-chip";
  chip.dataset.postProgram = program.code;
  chip.innerHTML = `<strong>${escapeHtml(program.name)}</strong><button type="button" aria-label="${escapeHtml(program.name)} eltávolítása">×</button>`;
  chip.querySelector("button").addEventListener("click", () => {
    chip.remove();
    updatePostProgramControls();
  });
  postProgramList.append(chip);
  postProgramCustomInput.setCustomValidity("");
  updatePostProgramControls();
  return true;
}

function handleAddPostProgram() {
  let program;
  if (postProgramSelect.value === "other") {
    const name = postProgramCustomInput.value.trim();
    if (!name) {
      postProgramCustomInput.setCustomValidity("Add meg a szak vagy képzés nevét.");
      postProgramCustomInput.reportValidity();
      return;
    }
    const known = companyCatalogs.findMajorByName(name);
    program = known || { code: `custom-${companyCatalogs.slug(name) || `major-${Date.now()}`}`, name };
  } else {
    program = companyCatalogs.findMajorByCode(postProgramSelect.value);
  }
  const added = addPostProgram(program);
  if (!added) return;
  postProgramCustomInput.value = "";
  postProgramSelect.value = "";
  updatePostProgramControls();
}

function collectPostPrograms() {
  return [...postProgramList.querySelectorAll("[data-post-program]")].map((item) => ({
    code: item.dataset.postProgram,
    name: item.querySelector("strong").textContent
  }));
}

function describePostPrograms(programs) {
  return programs.length
    ? `Elfogadott szakok (a felsoroltak bármelyike megfelelő): ${programs.map((item) => item.name).join(", ")}.`
    : "Minden szak elfogadott.";
}

let editingDraftId = null;

function companyDetailsComplete(profile = currentCompanyAccount?.profile || {}) {
  const office = profile.registeredOffice || {};
  return Boolean(
    String(profile.companyName || "").trim() &&
    /^\d{8}-\d-\d{2}$/.test(String(profile.taxNumber || "").trim()) &&
    String(profile.contactName || "").trim() &&
    String(profile.phone || "").trim() &&
    /^\d{4}$/.test(String(office.postalCode || "").trim()) &&
    String(office.city || "").trim() && String(office.street || "").trim() &&
    String(office.houseNumber || "").trim()
  );
}

function openCompanyDetails() {
  if (!currentCompanyAccount) return;
  const profile = currentCompanyAccount.profile || {};
  const office = profile.registeredOffice || {};
  const form = document.querySelector("#company-details-form");
  form.elements.companyName.value = profile.companyName || "";
  form.elements.taxNumber.value = profile.taxNumber || "";
  form.elements.companyRegistrationNumber.value = profile.companyRegistrationNumber || "";
  form.elements.contactName.value = profile.contactName || "";
  form.elements.phone.value = profile.phone || "";
  form.elements.postalCode.value = office.postalCode || "";
  form.elements.city.value = office.city || "";
  form.elements.street.value = office.street || "";
  form.elements.houseNumber.value = office.houseNumber || "";
  form.elements.website.value = profile.website || "";
  document.querySelector("#company-details-message").textContent = "";
  document.querySelector("#company-details-dialog").showModal();
}

document.querySelector("#open-company-details")?.addEventListener("click", openCompanyDetails);
document.querySelector("#company-details-close")?.addEventListener("click", () => document.querySelector("#company-details-dialog").close());
document.querySelector("#company-details-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity() || !currentCompanyAccount) return;
  const data = new FormData(form);
  const profile = currentCompanyAccount.profile || (currentCompanyAccount.profile = {});
  profile.companyName = String(data.get("companyName") || "").trim();
  profile.taxNumber = String(data.get("taxNumber") || "").trim();
  profile.companyRegistrationNumber = String(data.get("companyRegistrationNumber") || "").trim();
  profile.contactName = String(data.get("contactName") || "").trim();
  profile.phone = String(data.get("phone") || "").trim();
  profile.registeredOffice = {
    postalCode: String(data.get("postalCode") || "").trim(),
    city: String(data.get("city") || "").trim(),
    street: String(data.get("street") || "").trim(),
    houseNumber: String(data.get("houseNumber") || "").trim()
  };
  profile.location = `${profile.registeredOffice.postalCode} ${profile.registeredOffice.city}, ${profile.registeredOffice.street} ${profile.registeredOffice.houseNumber}`;
  profile.website = String(data.get("website") || "").trim();
  const accounts = JSON.parse(localStorage.getItem("gyakorstart.accounts.v1") || "[]");
  const index = accounts.findIndex((account) => String(account.id) === String(currentCompanyAccount.id));
  if (index >= 0) { accounts[index] = currentCompanyAccount; localStorage.setItem("gyakorstart.accounts.v1", JSON.stringify(accounts)); }
  const greeting = document.querySelector("#company-greeting");
  if (greeting) greeting.textContent = `Üdv, ${profile.companyName}!`;
  document.querySelector("#company-details-message").textContent = "A céges adatokat elmentettük.";
  window.setTimeout(() => document.querySelector("#company-details-dialog").close(), 500);
});

function openPosting(post = null) {
  if (currentCompanyAccount && !companyDetailsComplete()) {
    openCompanyDetails();
    const message = document.querySelector("#company-details-message");
    if (message) message.textContent = "Hirdetés közzététele előtt kérjük, töltsd ki a kötelező cégadatokat.";
    return;
  }
  resetPostingForm();
  editingDraftId = post?.status === "draft" ? String(post.id) : null;
  formView.hidden = false;
  success.hidden = true;
  const apiError = document.querySelector("#posting-api-error");
  if (apiError) { apiError.hidden = true; apiError.textContent = ""; }
  document.querySelector(".posting-dialog .modal-kicker").textContent = editingDraftId ? "Piszkozat szerkesztése" : "Új hirdetés";
  document.querySelector("#posting-form-view h2").textContent = editingDraftId ? "Piszkozat szerkesztése" : "Add meg a kiválasztás feltételeit";
  document.querySelector("#posting-form button[type=submit]").textContent = editingDraftId ? "Közzététel →" : "Közzététel →";
  const expiryInput = document.querySelector("#post-expires-on");
  const today = window.GyakorStartJobPostings?.localDateString() || new Date().toISOString().slice(0, 10);
  expiryInput.min = today;
  if (post) {
    document.querySelector("#post-position-title").value = post.title || "";
    document.querySelector("#post-location").value = post.city || "";
    document.querySelector("#post-expires-on").value = post.expiresOn || "";
    document.querySelector("#post-min-semester").value = post.minimumSemester || "";
    document.querySelector("#post-work-mode").value = post.workMode || "";
    document.querySelector("#post-hours-min").value = post.minHours ?? "";
    document.querySelector("#post-hours-max").value = post.maxHours ?? "";
    document.querySelector("#post-hourly-rate").value = post.hourlyRate || "";
    document.querySelector("#post-company-description").value = post.companyDescription || "";
    document.querySelector("#post-tasks").value = post.tasks || "";
    document.querySelector("#post-requirements").value = post.requirements || "";
    document.querySelector("#post-language-relation").value = post.languageRelation || "all";
    (post.programs || []).forEach((program) => addPostProgram(program));
    (post.languageRequirements || []).forEach((language) => {
      const catalogLanguage = companyCatalogs.findLanguageByCode(language.code) || { code:language.code, name:language.name };
      if (!addPostLanguageRequirement(catalogLanguage)) return;
      const row = postLanguageList.querySelector(`[data-post-language="${CSS.escape(language.code)}"]`);
      if (!row) return;
      row.querySelector(".post-language-level").value = companyCatalogs.normalizeLanguageLevel(language.level) || "";
      // A hirdetés minimumkövetelményének CEFR-értéke mindig a felületi kategóriából képződik.
      row.querySelector(".post-language-requirement-type").value = language.requirementType || "required";
      const examToggle = row.querySelector(".post-language-exam-required");
      const examSelect = row.querySelector(".post-language-exam-level");
      examToggle.checked = Boolean(language.examRequired);
      examSelect.disabled = !examToggle.checked;
      examSelect.required = examToggle.checked;
      row.querySelector(".post-language-exam-level-wrap").hidden = !examToggle.checked;
      examSelect.value = companyCatalogs.normalizeExamLevel(language.examLevel) || "";
    });
    updatePostLanguageControls();
    updatePostProgramControls();
  }
  dialog.querySelectorAll("#posting-form textarea").forEach(resizePostingTextarea);
  dialog.showModal();
}

function resizePostingTextarea(textarea) {
  if (!textarea) return;
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

document.querySelectorAll("#posting-form textarea").forEach((textarea) => {
  textarea.addEventListener("input", () => resizePostingTextarea(textarea));
  resizePostingTextarea(textarea);
});

function resetPostingForm() {
  const form = document.querySelector("#posting-form");
  const apiError = document.querySelector("#posting-api-error");
  if (apiError) { apiError.hidden = true; apiError.textContent = ""; }
  form.reset();
  form.querySelectorAll("textarea").forEach(resizePostingTextarea);
  document.querySelector("#post-expires-on").value = "";
  postLanguageList.replaceChildren();
  postProgramList.replaceChildren();
  document.querySelector("#posting-success-language").textContent = "";
  document.querySelector("#posting-success-programs").textContent = "";
  document.querySelector("#posting-success-overview").textContent = "";
  document.querySelector("#post-language-relation").value = "all";
  postProgramCustomInput.value = "";
  postProgramCustomInput.setCustomValidity("");
  updatePostLanguageControls();
  updatePostProgramControls();
}

document.querySelector("#open-posting").addEventListener("click", openPosting);
document.querySelector("#open-posting-secondary").addEventListener("click", openPosting);
document.querySelector("#company-empty-posting").addEventListener("click", openPosting);
window.addEventListener("gyakorstart:job-postings-changed", () => {
  if (!isSeedingDemoWorkspace) syncCompanyJobs();
});
window.addEventListener("gyakorstart:applications-changed", () => {
  if (currentCompanyAccount && !isSeedingDemoWorkspace) syncCompanyJobs();
});
document.querySelector("#posting-close").addEventListener("click", () => dialog.close());
document.querySelector("#posting-done").addEventListener("click", () => {
  resetPostingForm();
  dialog.close();
});
postLanguageSelect.addEventListener("change", () => {
  postLanguageSelect.setCustomValidity("");
  updatePostLanguageControls();
});
document.querySelector("#add-post-language").addEventListener("click", handleAddPostLanguage);
postProgramSelect.addEventListener("change", () => {
  postProgramSelect.setCustomValidity("");
  updatePostProgramControls();
});
postProgramCustomInput.addEventListener("input", () => postProgramCustomInput.setCustomValidity(""));
document.querySelector("#add-post-program").addEventListener("click", handleAddPostProgram);
const postingForm = document.querySelector("#posting-form");
const minimumPostHours = document.querySelector("#post-hours-min");
const maximumPostHours = document.querySelector("#post-hours-max");
function validatePostingHours() {
  const min = Number(minimumPostHours.value);
  const max = Number(maximumPostHours.value);
  maximumPostHours.setCustomValidity(minimumPostHours.value && maximumPostHours.value && min > max
    ? "A maximum óraszám nem lehet kisebb a minimumnál."
    : "");
}
minimumPostHours.addEventListener("input", validatePostingHours);
maximumPostHours.addEventListener("input", validatePostingHours);
const postingExpiryInput = document.querySelector("#post-expires-on");
postingExpiryInput.addEventListener("input", () => postingExpiryInput.setCustomValidity(""));
postingExpiryInput.addEventListener("change", () => postingExpiryInput.setCustomValidity(""));

function readPostingFormData(validateLanguages = true) {
  const languageRequirements = collectPostLanguageRequirements(validateLanguages);
  if (languageRequirements === null) return null;
  const position = document.querySelector("#post-position-title").value.trim();
  const location = document.querySelector("#post-location").value.trim();
  const semester = document.querySelector("#post-min-semester").value;
  const workMode = document.querySelector("#post-work-mode").value;
  const minHoursValue = document.querySelector("#post-hours-min").value;
  const maxHoursValue = document.querySelector("#post-hours-max").value;
  return {
    title:position, company:currentCompanyName || "GyakorStart", ownerAccountId:currentCompanyAccount?.id || "",
    city:location, workMode, minimumSemester:semester, programs:collectPostPrograms(),
    languageRequirements, languageRelation:document.querySelector("#post-language-relation").value,
    minHours:minHoursValue ? Number(minHoursValue) : null, maxHours:maxHoursValue ? Number(maxHoursValue) : null,
    hourlyRate:document.querySelector("#post-hourly-rate").value.trim(),
    companyDescription:document.querySelector("#post-company-description").value.trim(),
    tasks:document.querySelector("#post-tasks").value.trim(),
    requirements:document.querySelector("#post-requirements").value.trim(),
    expiresOn:document.querySelector("#post-expires-on").value,
    field:/marketing|kommunikáció/i.test(position) ? "Marketing" : /pénzügy|számvitel/i.test(position) ? "Pénzügy" : /mérnök|gyártás/i.test(position) ? "Mérnöki" : "IT"
  };
}

function showPostingSaved(post, asDraft) {
  const expiryDate = post.expiresOn ? new Date(`${post.expiresOn}T00:00:00`) : null;
  const summary = [
    post.title ? `Pozíció: ${post.title}` : "Piszkozat cím nélkül",
    post.city ? `Helyszín: ${post.city}` : "Helyszín még nincs megadva",
    post.expiresOn && !Number.isNaN(expiryDate?.getTime()) ? `Jelentkezési határidő: ${new Intl.DateTimeFormat("hu-HU", { year:"numeric", month:"long", day:"numeric" }).format(expiryDate)}` : "Jelentkezési határidő még nincs megadva"
  ];
  document.querySelector("#posting-success-title").textContent = asDraft ? "Piszkozat elmentve" : "A hirdetés közzétéve";
  document.querySelector("#posting-success-copy").textContent = asDraft
    ? "A piszkozatot később folytathatod és közzéteheted. A hallgatók még nem látják."
    : "A hirdetés megjelent az álláskeresőben, és a megadott határidőig fogad jelentkezéseket.";
  document.querySelector("#posting-success-overview").textContent = summary.join(" · ");
  document.querySelector("#posting-success-language").textContent = describePostLanguageRequirements(post.languageRequirements || []);
  document.querySelector("#posting-success-programs").textContent = describePostPrograms(post.programs || []);
  document.querySelector("#posting-success-language").dataset.relation = post.languageRelation || "all";
  formView.hidden = true;
  success.hidden = false;
  editingDraftId = null;
  if (post?.id) selectedJob = String(post.id);
  if (useCompanyApi) refreshCompanyJobsFromApi();
  else syncCompanyJobs();
}

async function savePosting(asDraft) {
  if (!asDraft) {
    validatePostingHours();
    if (!postingForm.reportValidity()) return;
  }
  const data = readPostingFormData(!asDraft);
  if (!data) return;
  const store = window.GyakorStartJobPostings;
  if (!store) return;

  if (asDraft) {
    try {
      let result;
      if (useCompanyApi) {
        result = editingDraftId
          ? await requestCompanyApi(`/company/jobs/${encodeURIComponent(editingDraftId)}`, { method:"PUT", body:JSON.stringify({ ...data, status:"DRAFT" }) })
          : await requestCompanyApi("/company/jobs", { method:"POST", body:JSON.stringify({ ...data, status:"DRAFT" }) });
        result = result?.job || result;
      } else {
        const draftId = editingDraftId || `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        result = (editingDraftId ? store.updateDraft(draftId, data) : store.saveDraft({ ...data, id:draftId }));
        if (!result.ok) throw new Error(result.error || "A piszkozat mentése nem sikerült.");
        result = result.post;
      }
      if (!result?.id) throw new Error("A szerver válaszából hiányzik a hirdetés azonosítója.");
      showPostingSaved(result, true);
    } catch (error) {
      const message = document.querySelector("#posting-api-error");
      if (message) { message.hidden = false; message.textContent = error.message || "A piszkozat mentése nem sikerült."; }
    }
    return;
  }

  const expiresOn = data.expiresOn;
  const todayString = store.localDateString();
  const expiryDate = new Date(`${expiresOn}T00:00:00`);
  if (!expiresOn || expiresOn < todayString || Number.isNaN(expiryDate.getTime())) {
    const expiryInput = document.querySelector("#post-expires-on");
    expiryInput.setCustomValidity("A jelentkezési határidőnek ma vagy egy későbbi napnak kell lennie.");
    expiryInput.reportValidity();
    return;
  }
  try {
    let result;
    if (useCompanyApi) {
      result = editingDraftId
        ? await requestCompanyApi(`/company/jobs/${encodeURIComponent(editingDraftId)}/publish`, { method:"POST", body:JSON.stringify(data) })
        : await requestCompanyApi("/company/jobs", { method:"POST", body:JSON.stringify({ ...data, status:"ACTIVE" }) });
      result = result?.job || result;
    } else {
      const localResult = editingDraftId
        ? store.publishDraft(editingDraftId, data)
        : store.save({ ...data, id:`company-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` });
      if (!localResult?.ok) throw new Error(localResult?.error || "A hirdetést nem sikerült közzétenni.");
      result = localResult.post;
    }
    if (!result?.id) throw new Error("A szerver válaszából hiányzik a hirdetés azonosítója.");
    showPostingSaved(result, false);
  } catch (error) {
    const message = document.querySelector("#posting-api-error");
    if (message) { message.hidden = false; message.textContent = error.message || "A hirdetést nem sikerült közzétenni."; }
    else {
      const target = document.querySelector("#post-expires-on");
      target.setCustomValidity(error.message || "A hirdetést nem sikerült közzétenni.");
      target.reportValidity();
    }
  }
}

postingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  savePosting(false);
});
document.querySelector("#save-posting-draft").addEventListener("click", () => savePosting(true));

document.querySelector("#job-management-actions").addEventListener("click", (event) => {
  const button = event.target.closest("[data-job-action]");
  if (!button || button.disabled) return;
  performJobLifecycleAction(button.dataset.jobAction);
});
updatePostLanguageControls();
updatePostProgramControls();
syncCompanyJobs();
