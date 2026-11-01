/* GyakorStart – hirdetésrészletek. A céges űrlap mezőit azonos sorrendben jeleníti meg. */
const demoJobs = {
  rendszergazda: { title: "Rendszergazda gyakornok", company: "Rába IT Services Kft.", companyDescription: "A Rába IT Services Kft. bemutatóprofilja: informatikai üzemeltetési és támogatási feladatokkal, vállalati rendszerek működtetésével és felhasználói támogatással foglalkozó mintavállalat. Gyakornokaink mentorálás mellett szerezhetnek gyakorlati tapasztalatot.", logo: "IT", location: "Győr", mode: "Hibrid", minHours: 20, maxHours: 30, pay: "2 600 Ft / óra", programs: ["Mérnökinformatikus", "Gazdaságinformatikus", "Programtervező informatikus"], minimumSemester: "5", languageRequirements: [{ code: "english", name: "Angol", level: "Magabiztos – önálló munkavégzés", requirementType: "required", examRequired: false, examLevel: "" }], workplace: "Hibrid", skills: ["Windows", "Linux", "Hálózati alapismeretek", "Active Directory"], requirements: "Windows és Linux rendszerek alapszintű ismerete\nHálózati alapismeretek: TCP/IP, DNS és DHCP\nJó problémamegoldó és kommunikációs készség\nActive Directory ismerete előnyt jelent", tasks: "Felhasználói hibajegyek kezelése mentor segítségével\nMunkaállomások telepítése és karbantartása\nJogosultságok és belső dokumentációk frissítése" },
  frontend: { title: "Frontend fejlesztő gyakornok", company: "WebOrbit Studio", companyDescription: "A WebOrbit Studio bemutatóprofilja: webes felületek és digitális szolgáltatások tervezésével, fejlesztésével foglalkozó mintavállalat. A gyakornokok valósághű fejlesztési feladatokon, tapasztalt csapattagok támogatásával dolgozhatnak.", logo: "</>", location: "Budapest", mode: "Hibrid", minHours: 24, maxHours: 24, pay: "2 800 Ft / óra", programs: ["Programtervező informatikus", "Mérnökinformatikus"], minimumSemester: "3", languageRequirements: [{ code: "english", name: "Angol", level: "Társalgási szint – hétköznapi beszélgetés", requirementType: "required", examRequired: false, examLevel: "" }], workplace: "Hibrid", skills: ["HTML", "CSS", "JavaScript", "React", "Git"], requirements: "Biztos HTML, CSS és JavaScript alapok\nReact alapszintű ismerete\nGit használata\nReszponzív felületek iránti igény", tasks: "Webes komponensek fejlesztése\nHibajavítás és kód review\nEgyüttműködés a design csapattal" },
  penzugy: { title: "Pénzügyi asszisztens gyakornok", company: "Danube Finance Kft.", companyDescription: "A Danube Finance Kft. bemutatóprofilja: pénzügyi és üzleti támogató folyamatokat végző mintavállalat, ahol a gyakornokok adatokkal, kimutatásokkal és adminisztratív pénzügyi feladatokkal szerezhetnek tapasztalatot.", logo: "DF", location: "Budapest", mode: "Irodai", minHours: 20, maxHours: 25, pay: "2 300 Ft / óra", programs: ["Pénzügy és számvitel", "Gazdálkodási és menedzsment"], minimumSemester: "3", languageRequirements: [{ code: "english", name: "Angol", level: "Társalgási szint – hétköznapi beszélgetés", requirementType: "required", examRequired: false, examLevel: "" }], workplace: "Irodai", requirements: "Magabiztos Excel-ismeret\nPrecíz és megbízható munkavégzés\nAlapvető számviteli ismeretek", tasks: "Kimutatások frissítése\nSzámlák ellenőrzése\nHavi zárás előkészítése" },
  gyartastervezo: { title: "Gyártástervező mérnök gyakornok", company: "FlexMotion Kft.", companyDescription: "A FlexMotion Kft. bemutatóprofilja: műszaki és gyártástámogatási folyamatokkal foglalkozó mintavállalat. Gyakornokai mérnöki projektekbe és dokumentációs feladatokba kapcsolódhatnak be.", logo: "FM", location: "Győr", mode: "Irodai", minHours: 24, maxHours: 32, pay: "2 700 Ft / óra", programs: ["Gépészmérnök", "Mechatronikai mérnök"], minimumSemester: "4", languageRequirements: [
    { code: "english", name: "Angol", level: "Társalgási szint – hétköznapi beszélgetés", requirementType: "required", examRequired: false, examLevel: "" },
    { code: "german", name: "Német", level: "Társalgási szint – hétköznapi beszélgetés", requirementType: "required", examRequired: false, examLevel: "" }], languageRelation: "any", workplace: "Irodai", requirements: "Műszaki rajzok olvasása\nCAD alapismeretek\nAnalitikus gondolkodás", tasks: "Gyártási folyamatok elemzése\nMűszaki dokumentáció frissítése\nMérnöki projektek támogatása" },
  marketing: { title: "Marketing asszisztens gyakornok", company: "KreatívPont", companyDescription: "A KreatívPont bemutatóprofilja: marketingkommunikációs és digitális tartalomkészítési feladatokat végző mintavállalat, ahol a gyakornokok kampányok és kreatív projektek megvalósítását támogathatják.", logo: "KP", location: "Szeged", mode: "Hibrid", minHours: 20, maxHours: 20, pay: "2 200 Ft / óra", programs: ["Kereskedelem és marketing", "Kommunikáció- és médiatudomány"], minimumSemester: "2", languageRequirements: [{ code: "english", name: "Angol", level: "Társalgási szint – hétköznapi beszélgetés", requirementType: "required", examRequired: false, examLevel: "" }], workplace: "Hibrid", requirements: "Jó szövegírási készség\nCanva vagy Adobe alapismeretek\nAktív social media ismeret", tasks: "Tartalmak előkészítése\nKampányeredmények gyűjtése\nEsemények kommunikációs támogatása" },
  "it-support": { title: "IT support gyakornok", company: "Rába IT Services Kft.", logo: "HD", location: "Győr", mode: "Hibrid", minHours: 20, maxHours: 25, pay: "2 400 Ft / óra", programs: ["Mérnökinformatikus", "Gazdaságinformatikus", "Programtervező informatikus"], minimumSemester: "2", languageRequirements: [{ code: "english", name: "Angol", level: "Társalgási szint – hétköznapi beszélgetés", requirementType: "required", examRequired: false, examLevel: "" }], workplace: "Hibrid", skills: ["Windows", "Kommunikáció", "Hardverismeretek", "Hálózati alapismeretek"], requirements: "Windows felhasználói ismeretek\nSegítőkész kommunikáció\nAlapvető hardver- és hálózati ismeretek", tasks: "Felhasználói hibajegyek fogadása\nEszközök előkészítése\nBelső tudásbázis frissítése" }
};

const id = new URLSearchParams(window.location.search).get("id") || "rendszergazda";
const companyPost = window.GyakorStartJobPostings?.get(id) || null;
const demo = demoJobs[id] || demoJobs.rendszergazda;
const job = companyPost ? {
  title: companyPost.title, company: companyPost.company, logo: "GS", location: companyPost.city,
  mode: companyPost.workMode, minHours: companyPost.minHours, maxHours: companyPost.maxHours,
  pay: companyPost.hourlyRate || "Bér egyeztetés szerint", programs: companyPost.programs || [],
  minimumSemester: companyPost.minimumSemester || "", languageRequirements: companyPost.languageRequirements || [],
  languageRelation: companyPost.languageRelation || "all", companyDescription: companyPost.companyDescription || "", tasks: companyPost.tasks || "",
  requirements: companyPost.requirements || "", expiresOn: companyPost.expiresOn, status: companyPost.status
} : { ...demo, expiresOn: null, status: "demo" };

const $ = (selector) => document.querySelector(selector);
const setText = (selector, value) => { const node = $(selector); if (node) node.textContent = value ?? ""; };
function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}
function appendEmpty(container, text) { container.append(make("p", "detail-empty", text)); }
function formatDate(dateString) {
  if (!dateString) return "Nincs megadva";
  const date = new Date(`${dateString}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "Nincs megadva" : new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "long", day: "numeric" }).format(date);
}
function semesterLabel(value) {
  if (!value) return "Nincs megadva";
  if (window.GyakorStartCatalogs?.semesterLabel) return window.GyakorStartCatalogs.semesterLabel(value);
  return String(value) === "7+" ? "7. vagy magasabb félév" : `${value}. félév`;
}
function formatMinimumSemester(value) {
  if (!value) return "Nincs félévhez kötve";
  const label = semesterLabel(value);
  return String(value) === "7+" ? `Minimum: ${label}` : `Legalább a ${label}`;
}
function formatHours(minimum, maximum) {
  if (minimum === undefined || maximum === undefined || minimum === "" || maximum === "") return "Nincs megadva";
  return Number(minimum) === Number(maximum)
    ? `Heti ${minimum} óra`
    : `Heti ${minimum}–${maximum} óra`;
}
function addList(container, values, prefix = "✓") {
  container.replaceChildren();
  const list = make("ul", "requirement-list");
  values.filter(Boolean).forEach((value) => {
    const item = make("li");
    item.append(make("span", "", prefix), document.createTextNode(String(value)));
    list.append(item);
  });
  if (!list.children.length) appendEmpty(container, "Nincs külön megadva.");
  else container.append(list);
}
function renderParagraphs(container, text, emptyText) {
  container.replaceChildren();
  const lines = String(text || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) { appendEmpty(container, emptyText); return; }
  const list = make("ul", "detail-bullet-list");
  lines.forEach((line) => {
    const item = make("li");
    const icon = make("span", "detail-bullet-icon", "✓");
    icon.setAttribute("aria-hidden", "true");
    item.append(icon, make("span", "detail-bullet-copy", line));
    list.append(item);
  });
  container.append(list);
}
function renderPlainText(container, text, emptyText) {
  container.replaceChildren();
  const paragraphs = String(text || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!paragraphs.length) { appendEmpty(container, emptyText); return; }
  paragraphs.forEach((line) => container.append(make("p", "detail-company-description-copy", line)));
}
function renderPrograms(programs) {
  const container = $("#detail-programs");
  const intro = $("#detail-program-intro");
  container.replaceChildren();
  const names = programs.map((item) => typeof item === "string" ? item : item?.name).filter(Boolean);
  if (intro) intro.hidden = true;
  if (!names.length) { appendEmpty(container, "Minden szak elfogadott."); return; }
  names.forEach((name) => container.append(make("span", "", name)));
}
function renderLanguages(requirements) {
  const container = $("#detail-language-requirements");
  const section = $("#detail-language-section");
  const intro = $("#detail-language-intro");
  container.replaceChildren();
  if (!Array.isArray(requirements) || requirements.length === 0) {
    if (section) section.hidden = true;
    return;
  }
  if (section) section.hidden = false;
  if (intro) intro.hidden = false;
  const mandatory = requirements.filter((item) => item.requirementType !== "preferred");
  const preferred = requirements.filter((item) => item.requirementType === "preferred");
  if (mandatory.length && job.languageRelation === "any") {
    setText("#detail-language-intro", "A kötelező nyelvek közül legalább egy ismerete szükséges.");
  } else if (mandatory.length) {
    setText("#detail-language-intro", "Minden kötelezőként megjelölt nyelv ismerete szükséges.");
  } else if (preferred.length) {
    setText("#detail-language-intro", "A felsorolt nyelvek ismerete előnyt jelent, de nem kizáró feltétel.");
  } else {
    setText("#detail-language-intro", "A cég által megadott minimum nyelvtudási szintek.");
  }
  if (mandatory.length > 1) {
    const rule = make("p", "detail-language-rule", job.languageRelation === "any"
      ? "Elegendő a kötelező nyelvek közül legalább egyet ismerni."
      : "A felsorolt kötelező nyelvek mindegyikének ismerete szükséges.");
    container.append(rule);
  }
  requirements.forEach((item) => {
    const card = make("article", "detail-language-card");
    const top = make("div", "detail-language-card-top");
    top.append(make("h3", "", item.name || "Nyelv"));
    top.append(make("span", item.requirementType === "preferred" ? "detail-requirement-badge preferred" : "detail-requirement-badge required", item.requirementType === "preferred" ? "Előnyt jelent" : "Kötelező"));
    card.append(top);
    const levelLabel = window.GyakorStartCatalogs?.languageLevelLabel(item.level) || item.level || "Nincs megadva";
    card.append(make("p", "", `Minimum elvárt nyelvtudás: ${levelLabel}`));
    const examCopy = item.examRequired
      ? (item.requirementType === "preferred"
        ? `Nyelvvizsga: előnyt jelent, legalább ${window.GyakorStartCatalogs?.examLevelLabel(item.examLevel) || "megadott szint"} szinten.`
        : `Nyelvvizsga: kötelező, legalább ${window.GyakorStartCatalogs?.examLevelLabel(item.examLevel) || "megadott szint"} szinten.`)
      : "Nyelvvizsga: nem szükséges.";
    card.append(make("p", "detail-exam-note", examCopy));
    container.append(card);
  });
}

// A címsor és a rövid adatok.
document.title = `${job.title} – GyakorStart`;
setText("#detail-title", job.title);
setText("#detail-company", job.company);
setText("#detail-logo", job.logo);
setText("#detail-location", `⌖ ${job.location}`);
setText("#detail-mode", `◐ ${job.mode}`);
setText("#detail-hours", `◷ ${formatHours(job.minHours, job.maxHours)}`);
function renderHourlyPay(selector, value) {
  const target = $(selector);
  if (!target) return;
  const formatted = window.GyakorStartFormatters?.formatHourlyRate(value) || { amountText: String(value || "Bér egyeztetés szerint"), unitText: "" };
  target.replaceChildren(make("span", "hourly-price-amount", formatted.amountText));
  if (formatted.unitText) target.append(make("small", "hourly-price-unit", formatted.unitText));
}
renderHourlyPay("#detail-pay", job.pay);
setText("#detail-semester", formatMinimumSemester(job.minimumSemester));
setText("#detail-workplace", job.mode || "Nincs megadva");
setText("#detail-hours-fact", formatHours(job.minHours, job.maxHours));
renderHourlyPay("#detail-pay-fact", job.pay || "Bér egyeztetés szerint");
setText("#detail-application-status", "");
renderPrograms(job.programs || []);
renderLanguages(job.languageRequirements || []);
const companyDescriptionSection = $("#detail-company-description-section");
if (companyDescriptionSection) companyDescriptionSection.hidden = !String(job.companyDescription || "").trim();
renderPlainText($("#detail-company-description"), job.companyDescription, "A cég bemutatkozása még nincs megadva.");
renderParagraphs($("#detail-tasks"), job.tasks, "A feladatok még nincsenek részletezve.");
renderParagraphs($("#detail-requirements"), job.requirements, "Szakmai elvárás még nincs külön megadva.");

// A jelentkezési határidő jól láthatóan megjelenik a hirdetés fejlécében és az alapfeltételek között is.
const deadline = formatDate(job.expiresOn);
setText("#detail-deadline-fact", deadline);
if (job.expiresOn) {
  setText("#detail-deadline-title", job.status === "closed" ? "A jelentkezés lezárult" : "Jelentkezési határidő");
  setText("#detail-deadline-text", job.status === "closed"
    ? `${deadline} · A határidő lejárt, a hirdetés már nem fogad jelentkezést.`
    : `${deadline} · A jelentkezés a megadott nap végéig, 23:59-ig adható le.`);
  $("#detail-deadline-banner").classList.toggle("is-closed", job.status === "closed");
} else {
  setText("#detail-deadline-title", "Jelentkezési határidő");
  setText("#detail-deadline-text", "Nincs megadva.");
}
if (job.status === "closed") {
  setText("#detail-posting-label", "Lezárt álláshirdetés");
  setText("#detail-application-status", "A jelentkezési határidő lejárt, erre a pozícióra már nem lehet jelentkezni.");
} else if (companyPost) {
  setText("#detail-posting-label", "Céges gyakornoki hirdetés");
}

const dialog = $("#application-dialog");
const formView = $("#application-form-view");
const success = $("#application-success");
const applicationForm = $("#application-form");
const applicationError = $("#application-error");
const applicationSubmit = applicationForm.querySelector('[type="submit"]');
const apiBaseUrl = (document.querySelector('meta[name="api-base-url"]')?.content || "/api").replace(/\/$/, "");
const apiMode = document.querySelector('meta[name="api-mode"]')?.content || "prototype";
const useApplicationApi = apiMode === "server";
setText("#application-heading", job.title);
setText("#application-company", job.company);

function getCurrentStudentAccount() {
  try {
    const session = JSON.parse(localStorage.getItem("gyakorstart.session.v1") || "null");
    const accounts = JSON.parse(localStorage.getItem("gyakorstart.accounts.v1") || "[]");
    if (!session || !Array.isArray(accounts)) return null;
    const account = accounts.find((item) => item.email === session.email);
    return account?.role === "student" && account.id ? account : null;
  } catch { return null; }
}

const applyButton = $("#open-application");
function redirectToStudentLogin() {
  const loginUrl = new URL("index.html", window.location.href);
  const currentPage = `${window.location.pathname.split("/").pop() || "job.html"}${window.location.search}${window.location.hash}`;
  loginUrl.searchParams.set("auth", "login");
  loginUrl.searchParams.set("role", "student");
  loginUrl.searchParams.set("returnTo", currentPage);
  window.location.href = loginUrl.href;
}

function hasApplied(student) {
  return Boolean(student?.id && window.GyakorStartApplicationStore?.getForStudent(student.id)
    .some((application) => String(application.jobId) === String(id)));
}

const matchJobData = companyPost || {
  programs: job.programs || [],
  minimumSemester: job.minimumSemester || "",
  languageRequirements: job.languageRequirements || [],
  languageRelation: job.languageRelation || "all",
  skills: job.skills || job.requiredSkills || [],
  minHours: job.minHours,
  maxHours: job.maxHours,
  workMode: job.mode || job.workplace || ""
};

function renderStudentProfileMatch(student = getCurrentStudentAccount()) {
  const panel = $("#student-profile-match");
  const loginNote = $("#student-match-login-note");
  const score = $("#student-match-percent");
  const description = $("#student-match-description");
  const progress = $("#student-match-progress");
  const fill = $("#student-match-progress-fill");
  const criteria = $("#student-match-criteria");
  if (!panel || !loginNote || !score || !description || !progress || !fill || !criteria) return;

  if (!student) {
    panel.hidden = true;
    loginNote.hidden = false;
    return;
  }
  loginNote.hidden = true;
  panel.hidden = false;
  const matching = window.GyakorStartProfileMatching?.calculate(student.profile || {}, matchJobData);
  criteria.replaceChildren();
  panel.classList.remove("is-high", "is-medium", "is-low", "is-unknown");
  progress.classList.remove("is-high", "is-medium", "is-low", "is-unknown");
  score.classList.remove("is-high", "is-medium", "is-low", "is-unknown");
  if (!matching || matching.percent === null) {
    panel.classList.add("is-unknown");
    score.classList.add("is-unknown");
    score.textContent = "Nem számítható";
    description.textContent = "A profilodban jelenleg nincs elegendő adat az egyezés kiszámításához. Egészítsd ki a tanulmányi, nyelvi és munkavégzési adataidat.";
    progress.hidden = true;
    return;
  }

  const percent = matching.percent;
  const matchLevel = percent >= 80 ? "is-high" : percent >= 60 ? "is-medium" : "is-low";
  panel.classList.add(matchLevel);
  progress.classList.add(matchLevel);
  score.classList.add(matchLevel);
  score.textContent = `${percent}%`;
  const detailedItems = Array.isArray(matching.details) ? matching.details : [];
  const missingItems = detailedItems.filter((item) => item.met === false);
  description.textContent = missingItems.length
    ? `${missingItems.length} feltétel nem teljesül, vagy nincs megadva a profilodban. Az alábbi listában pontosan látod, mi hiányzik.`
    : "A megadott profiladataid alapján minden ellenőrzött kötelező feltételnek megfelelsz. Az előnyként megjelölt feltételeket külön jelöltük.";
  progress.hidden = false;
  progress.setAttribute("aria-valuenow", String(percent));
  fill.style.width = `${percent}%`;

  if (detailedItems.length) {
    detailedItems.forEach((detail) => {
      const met = detail.met;
      const statusClass = met === null ? "is-info" : met ? "is-met" : "is-missing";
      const item = make("li", statusClass);
      const icon = make("span", "student-match-criterion-icon", met === null ? "i" : met ? "✓" : "×");
      icon.setAttribute("aria-hidden", "true");
      const content = make("div", "student-match-criterion-content");
      content.append(
        make("small", "student-match-criterion-category", detail.category || "Feltétel"),
        make("span", "student-match-criterion-label", detail.label)
      );
      const statusLabel = met === null ? "Előny" : met ? "Megfelel" : "Hiányzik";
      item.append(icon, content, make("strong", "student-match-criterion-status", statusLabel));
      criteria.append(item);
    });
  } else {
    const empty = make("li", "is-info");
    empty.textContent = "Ehhez a hirdetéshez nincs elegendő strukturált feltétel a részletes ellenőrzéshez.";
    criteria.append(empty);
  }
}

function syncApplyButton() {
  const student = getCurrentStudentAccount();
  const latestPost = companyPost ? (window.GyakorStartJobPostings?.get(id) || companyPost) : null;
  if (companyPost && !window.GyakorStartJobPostings?.canApply(id)) {
    applyButton.disabled = true;
    const messages = {
      draft: "A hirdetés még nem elérhető",
      paused: "A jelentkezés átmenetileg szünetel",
      closed: "A hirdetés véglegesen lezárult",
      expired: "A jelentkezési határidő lejárt"
    };
    const message = messages[latestPost?.status] || "A jelentkezés nem elérhető";
    applyButton.textContent = message;
    setText("#detail-application-status", message);
    setText("#detail-posting-label", message);
    setText("#detail-deadline-title", message);
    $("#detail-deadline-banner")?.classList.add("is-closed");
    return;
  }
  $("#detail-deadline-banner")?.classList.remove("is-closed");
  if (!student) {
    applyButton.disabled = false;
    applyButton.textContent = "Hallgatói bejelentkezés szükséges";
    setText("#detail-application-status", "A jelentkezéshez hallgatói fiókkal kell bejelentkezned.");
    return;
  }
  if (hasApplied(student)) {
    applyButton.disabled = true;
    applyButton.textContent = "Már jelentkeztél erre az állásra";
    return;
  }
  applyButton.disabled = false;
  applyButton.textContent = "Jelentkezem erre az állásra →";
}

syncApplyButton();
renderStudentProfileMatch();
window.addEventListener("gyakorstart:job-postings-changed", () => {
  syncApplyButton();
  renderStudentProfileMatch();
});
window.addEventListener("storage", (event) => {
  if (!event.key || event.key === "gyakorstart.accounts.v1" || event.key === "gyakorstart.session.v1") {
    renderStudentProfileMatch();
    syncApplyButton();
  }
});
applyButton.addEventListener("click", () => {
  const student = getCurrentStudentAccount();
  if (!student) {
    redirectToStudentLogin();
    return;
  }
  if (companyPost && !window.GyakorStartJobPostings?.canApply(id)) {
    syncApplyButton();
    return;
  }
  if (hasApplied(student)) {
    syncApplyButton();
    setText("#detail-application-status", "Erre az állásra már elküldted a jelentkezésedet.");
    return;
  }
  formView.hidden = false;
  success.hidden = true;
  applicationError.hidden = true;
  applicationError.textContent = "";
  $("#applicant-name").value = student.profile?.fullName || "";
  $("#applicant-email").value = student.email || "";
  $("#application-note").value = student.profile?.introduction || "";
  dialog.showModal();
});

$("#application-close").addEventListener("click", () => dialog.close());
$("#application-done").addEventListener("click", () => dialog.close());

applicationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!applicationForm.reportValidity()) return;

  const student = getCurrentStudentAccount();
  if (!student) {
    applicationError.hidden = false;
    applicationError.textContent = "A jelentkezéshez hallgatói bejelentkezés szükséges.";
    return;
  }
  if (companyPost && !window.GyakorStartJobPostings?.canApply(id)) {
    applyButton.disabled = true;
    applyButton.textContent = "A jelentkezés lezárult";
    dialog.close();
    return;
  }
  if (hasApplied(student)) {
    applicationError.hidden = false;
    applicationError.textContent = "Erre az állásra már jelentkeztél.";
    syncApplyButton();
    return;
  }

  const originalSubmitLabel = applicationSubmit.textContent;
  applicationSubmit.disabled = true;
  applicationSubmit.textContent = "Jelentkezés küldése…";
  applicationError.hidden = true;
  applicationError.textContent = "";

  try {
    let saved;
    if (useApplicationApi) {
      const response = await fetch(`${apiBaseUrl}/applications`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ studentId: student.id, jobId: id, note: $("#application-note").value.trim() })
      });
      const responseBody = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = responseBody.message || responseBody.error ||
          (response.status === 409 ? "Erre az állásra már jelentkeztél." : "A jelentkezést nem sikerült elküldeni.");
        throw new Error(message);
      }
      const serverApplication = responseBody.application || responseBody.data?.application || responseBody.data || responseBody;
      const serverId = serverApplication.id || serverApplication.applicationId || responseBody.applicationId;
      if (!serverId) throw new Error("A szerver nem adott vissza jelentkezésazonosítót.");
      saved = window.GyakorStartApplicationStore?.addFromServer({
        ...serverApplication, id: serverId, studentId: student.id,
        studentName: student.profile?.fullName || student.email, jobId: id,
        jobTitle: job.title, company: job.company, city: job.location || job.city || "",
        logo: job.logo || "GS", logoClass: "logo-mint", note: $("#application-note").value.trim(),
        appliedAt: serverApplication.appliedAt || serverApplication.createdAt || new Date().toISOString(),
        status: serverApplication.status || "new"
      });
    } else {
      // Helyi prototípus: a hallgatói és céges oldal ugyanazt a rekordot olvassa.
      const appliedAt = new Date().toISOString();
      saved = window.GyakorStartApplicationStore?.addFromServer({
        id: `app-${student.id}-${id}-${Date.now()}`,
        studentId: student.id, studentName: student.profile?.fullName || student.email,
        jobId: id, jobTitle: job.title, company: job.company,
        city: job.location || job.city || "", logo: job.logo || "GS", logoClass: "logo-mint",
        note: $("#application-note").value.trim(), appliedAt, status: "new",
        history: [{ type: "submitted", title: "Jelentkezés beérkezett",
          message: `A jelentkezésed sikeresen beérkezett a(z) ${job.company} vállalathoz.`, at: appliedAt }]
      });
    }
    if (!saved?.ok) throw new Error(saved?.error || "A jelentkezést nem sikerült elmenteni.");
    // Az addFromServer eseményt küld, így a nyitott hallgatói jelentkezési lista azonnal újrarenderelődik.
    formView.hidden = true;
    success.hidden = false;
    setText("#application-success-copy", `A ${job.company} részére leadott jelentkezésed sikeresen megérkezett.`);
    syncApplyButton();
  } catch (error) {
    applicationError.hidden = false;
    applicationError.textContent = error instanceof TypeError
      ? "A szerver jelenleg nem érhető el. Ellenőrizd a backend kapcsolatát, majd próbáld újra."
      : (error.message || "Váratlan hiba történt a jelentkezés küldésekor.");
  } finally {
    applicationSubmit.disabled = false;
    applicationSubmit.textContent = originalSubmitLabel;
  }
});

