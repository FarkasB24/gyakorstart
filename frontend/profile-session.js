const PROFILE_ACCOUNTS_KEY = "gyakorstart.accounts.v1";
const PROFILE_SESSION_KEY = "gyakorstart.session.v1";
const profileCatalogs = window.GyakorStartCatalogs;

function resizeProfileTextarea(textarea) {
  if (!textarea) return;
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

document.querySelectorAll("#profile-completion-form textarea").forEach(resizeProfileTextarea);
document.addEventListener("input", (event) => {
  if (event.target.matches("#profile-completion-form textarea")) resizeProfileTextarea(event.target);
});


function readStoredValue(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function accountProfileUrl(role) {
  return role === "company" ? "ceges-profil.html" : "hallgatoi-profil.html";
}

function initialsFor(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "GS";
  const selected = parts.length === 1 ? [parts[0], parts[0]] : [parts[0], parts.at(-1)];
  return selected.map((part) => Array.from(part)[0]).join("").toLocaleUpperCase("hu-HU");
}

function formatBirthDate(value) {
  if (!value) return "Nincs megadva";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("hu-HU", { dateStyle: "long" }).format(date);
}

function semesterLabel(value) {
  return profileCatalogs?.semesterLabel(value) || (value === "7+" ? "7. vagy magasabb félév" : value ? `${value}. félév` : "Nincs megadva");
}

function renderProfileLanguages(container, languages) {
  container.replaceChildren();
  if (!Array.isArray(languages) || !languages.length) {
    const empty = document.createElement("span");
    empty.className = "profile-fact-empty";
    empty.textContent = "Nincs megadva";
    container.append(empty);
    return;
  }

  languages.forEach((language) => {
    const name = language.name || profileCatalogs?.findLanguageByCode(language.code)?.name || language.code || "Nyelv";
    const row = document.createElement("div");
    row.className = "profile-language-item";
    const languageName = document.createElement("strong");
    languageName.textContent = name;
    const details = document.createElement("span");
    const parts = [profileCatalogs?.languageLevelLabel(language.level) || "Szint nincs megadva"];
    if (language.hasExam && language.examLevel) parts.push(`${profileCatalogs?.examLevelLabel(language.examLevel) || "Nyelvvizsga"} nyelvvizsga`);
    details.textContent = parts.join(" · ");
    row.append(languageName, details);
    container.append(row);
  });
}

function setChecklistItem(id, complete, label) {
  const item = document.querySelector(`#${id}`);
  item.classList.toggle("done", complete);
  item.textContent = `${complete ? "✓" : "○"} ${label}`;
}

const currentSession = readStoredValue(PROFILE_SESSION_KEY, null);
const storedAccounts = readStoredValue(PROFILE_ACCOUNTS_KEY, []);
const currentAccount = currentSession && Array.isArray(storedAccounts)
  ? storedAccounts.find((account) => account.email === currentSession.email)
  : null;
const pageRole = document.body.dataset.profileRole;
let pendingProfileImage = "";

if (currentAccount && currentAccount.role !== pageRole) {
  window.location.replace(accountProfileUrl(currentAccount.role));
}

function saveStoredAccounts() {
  localStorage.setItem(PROFILE_ACCOUNTS_KEY, JSON.stringify(storedAccounts));
}

function migrateStudentDetails(profile) {
  // A verzió nélküli régi profil is lehet kitöltött. Soha ne ürítsünk adatot
  // csak azért, mert hiányzik róla a migrációs verziószám.
  if (!Number.isFinite(Number(profile.detailsVersion)) || Number(profile.detailsVersion) < 1) {
    profile.detailsVersion = 1;
  }
  if (profile.detailsVersion < 2) {
    const weeklyHours = Number(profile.weeklyHours);
    profile.weeklyHours = weeklyHours >= 5 && weeklyHours <= 40 ? weeklyHours : "";
    profile.profileImage = profile.profileImage || "";
    profile.detailsVersion = 2;
  }
  if (profile.detailsVersion < 3) {
    const weeklyHours = Number(profile.weeklyHours);
    const validLegacyHours = weeklyHours >= 5 && weeklyHours <= 40;
    if (profile.weeklyHoursMin === undefined || profile.weeklyHoursMin === null) {
      profile.weeklyHoursMin = validLegacyHours ? weeklyHours : "";
    }
    if (profile.weeklyHoursMax === undefined || profile.weeklyHoursMax === null) {
      profile.weeklyHoursMax = validLegacyHours ? weeklyHours : "";
    }
    const legacyLanguageLevels = {
      A1: "Alapszint – egyszerű kifejezések",
      A2: "Alapszint – egyszerű kifejezések",
      B1: "Társalgási szint – hétköznapi beszélgetés",
      B2: "Magabiztos – önálló munkavégzés",
      C1: "Folyékony – szakmai környezetben is",
      C2: "Folyékony – szakmai környezetben is"
    };
    profile.languages = Array.isArray(profile.languages)
      ? profile.languages.map((language) => ({ ...language, level: legacyLanguageLevels[language.level] || language.level }))
      : [];
    delete profile.weeklyHours;
    profile.detailsVersion = 3;
  }
  if (profile.detailsVersion < 4) {
    profile.skills = Array.isArray(profile.skills)
      ? profile.skills.map((skill) => typeof skill === "string" ? { name: skill, level: "" } : skill)
      : [];
    profile.relevantCourses = Array.isArray(profile.relevantCourses) ? profile.relevantCourses : [];
    profile.education = Array.isArray(profile.education) ? profile.education : [];
    profile.experience = Array.isArray(profile.experience) ? profile.experience : [];
    profile.detailsVersion = 4;
  }
  if (profile.detailsVersion < 5) {
    profile.experience = Array.isArray(profile.experience)
      ? profile.experience.map((entry) => ({ ...entry, type: entry.type || "other" }))
      : [];
    profile.drivingLicense = profile.drivingLicense || "";
    profile.availabilityDate = profile.availabilityDate || "";
    profile.linkedinUrl = profile.linkedinUrl || "";
    profile.portfolioUrl = profile.portfolioUrl || "";
    profile.certifications = Array.isArray(profile.certifications) ? profile.certifications : [];
    profile.detailsVersion = 5;
  }
  if (profile.detailsVersion < 6) {
    profile.phone = profile.phone || "";
    profile.city = profile.city || "";
    profile.introduction = profile.introduction || "";
    profile.projects = Array.isArray(profile.projects) ? profile.projects : [];
    profile.detailsVersion = 6;
  }
  if (profile.detailsVersion < 7) {
    profile.major = profile.major || "";
    const knownMajor = profileCatalogs?.findMajorByName(profile.major);
    profile.majorCode = profile.majorCode || knownMajor?.code || (profile.major ? `custom-${profileCatalogs?.slug(profile.major) || "egyeb"}` : "");
    profile.languages = Array.isArray(profile.languages) ? profile.languages.map((language) => {
      const knownLanguage = profileCatalogs?.findLanguageByName(language.name);
      return {
        ...language,
        code: language.code || knownLanguage?.code || `custom-${profileCatalogs?.slug(language.name || "nyelv") || "nyelv"}`,
        name: language.name || knownLanguage?.name || "Egyéb nyelv"
      };
    }) : [];
    profile.detailsVersion = 7;
  }
  if (profile.detailsVersion < 8) {
    const knownMajor = profileCatalogs?.findMajorByCode(profile.majorCode) || profileCatalogs?.findMajorByName(profile.major);
    if (knownMajor) {
      profile.majorCode = knownMajor.code;
      profile.major = knownMajor.name;
    } else if (profile.major) {
      profile.majorCode = profile.majorCode || `custom-${profileCatalogs?.slug(profile.major) || "egyeb"}`;
    }
    profile.languages = Array.isArray(profile.languages) ? profile.languages : [];
    profile.detailsVersion = 8;
  }
  if (profile.detailsVersion < 9) {
    // A nyelvlista mostantól zárt, központilag karbantartott lista.
    // A korábban szabadon beírt értékek közül csak az új listához illeszthetők maradnak meg.
    profile.languages = Array.isArray(profile.languages)
      ? profile.languages.map((language) => {
          const knownLanguage = profileCatalogs?.findLanguageByCode(language.code) || profileCatalogs?.findLanguageByName(language.name);
          // Ismeretlen/régebbi nyelv se vesszen el: egyedi kóddal megőrizzük.
          return knownLanguage
            ? { ...language, code: knownLanguage.code, name: knownLanguage.name }
            : {
                ...language,
                code: language.code || `legacy-${profileCatalogs?.slug(language.name || "nyelv") || "nyelv"}`,
                name: language.name || "Korábban megadott nyelv"
              };
        })
      : [];
    profile.detailsVersion = 9;
  }
  if (profile.detailsVersion < 10) {
    profile.languages = Array.isArray(profile.languages)
      ? profile.languages.map((language) => ({
          ...language,
          level: profileCatalogs?.normalizeLanguageLevel(language.level) || language.level || "",
          examLevel: profileCatalogs?.normalizeExamLevel(language.examLevel) || language.examLevel || ""
        }))
      : [];
    profile.detailsVersion = 10;
  }
  if (profile.detailsVersion < 11) {
    // A közérthető felületi szinthez külön, háttérben használt CEFR-kódot rendelünk.
    // A nyelvvizsga fokozata ettől függetlenül marad meg.
    profile.languages = Array.isArray(profile.languages)
      ? profile.languages.map((language) => ({
          ...language,
          cefrLevel: profileCatalogs?.languageLevelCefr(language.level) || language.cefrLevel || ""
        }))
      : [];
    profile.detailsVersion = 11;
  }
  saveStoredAccounts();
}

function renderAvatar(element, initials, profileImage) {
  element.replaceChildren();
  if (!profileImage) {
    element.textContent = initials;
    return;
  }
  const image = document.createElement("img");
  image.src = profileImage;
  image.alt = "Profilkép";
  element.append(image);
}

function renderPhotoPreview(profileImage, initials) {
  const preview = document.querySelector("#profile-photo-preview");
  const fallback = document.querySelector("#profile-photo-initials");
  preview.style.backgroundImage = profileImage ? `url(${profileImage})` : "";
  preview.classList.toggle("has-photo", Boolean(profileImage));
  fallback.textContent = initials;
}

function resizeProfileImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Csak képfájl tölthető fel."));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error("A kiválasztott kép legfeljebb 8 MB lehet."));
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, 480 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("A képet nem sikerült beolvasni."));
    };
    image.src = objectUrl;
  });
}

function renderSkills(skills) {
  const container = document.querySelector("#profile-skills");
  container.replaceChildren();
  if (!Array.isArray(skills) || !skills.length) {
    const empty = document.createElement("span");
    empty.className = "empty-skill";
    empty.textContent = "Még nincs készség megadva";
    container.append(empty);
    return;
  }
  skills.forEach((skill) => {
    const chip = document.createElement("span");
    const name = typeof skill === "string" ? skill : skill.name;
    const level = typeof skill === "string" ? "" : skill.level;
    chip.textContent = level ? `${name} · ${level}` : name;
    container.append(chip);
  });
}

function renderCourses(courses) {
  const container = document.querySelector("#profile-courses");
  container.replaceChildren();
  if (!Array.isArray(courses) || !courses.length) {
    const empty = document.createElement("span");
    empty.className = "empty-skill";
    empty.textContent = "Még nincs tantárgy megadva";
    container.append(empty);
    return;
  }
  courses.forEach((course) => {
    const chip = document.createElement("span");
    chip.textContent = course;
    container.append(chip);
  });
}

function renderHistory(containerId, entries, type, emptyText) {
  const container = document.querySelector(`#${containerId}`);
  container.replaceChildren();
  if (!Array.isArray(entries) || !entries.length) {
    const empty = document.createElement("p");
    empty.className = "profile-empty-copy";
    empty.textContent = emptyText || (type === "education" ? "Még nincs korábbi tanulmány megadva." : "Még nincs munkatapasztalat megadva.");
    container.append(empty);
    return;
  }
  entries.forEach((entry) => {
    const item = document.createElement("article");
    const title = document.createElement("strong");
    const subtitle = document.createElement("span");
    const period = document.createElement("small");
    title.textContent = type === "education"
      ? (entry.institution || entry.program || "Tanulmány")
      : (entry.role || entry.company || "Munkatapasztalat");
    subtitle.textContent = type === "education"
      ? (entry.program || "Képzés nincs megadva")
      : (entry.company || "Szervezet nincs megadva");
    period.textContent = entry.period || "Időszak nincs megadva";
    item.append(title, subtitle, period);
    if (type === "experience" && entry.description) {
      const description = document.createElement("p");
      description.textContent = entry.description;
      item.append(description);
    }
    container.append(item);
  });
}

function safeExternalUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function renderAdditionalData(profile) {
  document.querySelector("#profile-driving-license").textContent = profile.drivingLicense || "Nincs megadva";
  document.querySelector("#profile-availability").textContent = formatBirthDate(profile.availabilityDate);
  const links = document.querySelector("#profile-external-links");
  links.replaceChildren();
  [["LinkedIn", profile.linkedinUrl], ["GitHub / portfólió", profile.portfolioUrl]].forEach(([label, value]) => {
    const url = safeExternalUrl(value);
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `${label} ↗`;
    links.append(link);
  });
  const certifications = document.querySelector("#profile-certifications");
  certifications.replaceChildren();
  if (!Array.isArray(profile.certifications) || !profile.certifications.length) {
    const empty = document.createElement("span");
    empty.className = "empty-skill";
    empty.textContent = "Még nincs tanúsítvány megadva";
    certifications.append(empty);
    return;
  }
  profile.certifications.forEach((certification) => {
    const chip = document.createElement("span");
    chip.textContent = certification;
    certifications.append(chip);
  });
}

function renderProjects(projects) {
  const container = document.querySelector("#profile-projects");
  container.replaceChildren();
  if (!Array.isArray(projects) || !projects.length) {
    const empty = document.createElement("p");
    empty.className = "profile-empty-copy";
    empty.textContent = "Még nincs projekt megadva.";
    container.append(empty);
    return;
  }
  projects.forEach((project) => {
    const card = document.createElement("article");
    const title = document.createElement("strong");
    title.textContent = project.name || "Projekt";
    card.append(title);
    if (project.description) {
      const description = document.createElement("p");
      description.textContent = project.description;
      card.append(description);
    }
    if (project.technologies) {
      const technologies = document.createElement("span");
      technologies.textContent = project.technologies;
      card.append(technologies);
    }
    const url = safeExternalUrl(project.url);
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Projekt megnyitása ↗";
      card.append(link);
    }
    container.append(card);
  });
}

function renderStudentProfile() {
  const profile = currentAccount.profile;
  const firstName = profile.fullName.trim().split(/\s+/)[0] || "Hallgató";
  const initials = initialsFor(profile.fullName);
  const languagesComplete = Array.isArray(profile.languages) && profile.languages.length > 0;
  const minimumHours = Number(profile.weeklyHoursMin);
  const maximumHours = Number(profile.weeklyHoursMax);
  const hoursComplete = minimumHours >= 5 && maximumHours <= 40 && minimumHours <= maximumHours;
  const workComplete = Boolean(hoursComplete && profile.workMode);
  const skillsComplete = Array.isArray(profile.skills) && profile.skills.length > 0;
  const contactComplete = Boolean(profile.city && profile.phone);
  const progress = 30 + (contactComplete ? 10 : 0) + (profile.semester ? 15 : 0) + (languagesComplete ? 20 : 0) + (hoursComplete ? 10 : 0) + (profile.workMode ? 5 : 0) + (skillsComplete ? 10 : 0);

  document.querySelector("#student-greeting").textContent = `Szia, ${firstName}!`;
  document.querySelector("#profile-name").textContent = profile.fullName;
  document.querySelector("#profile-major").textContent = `${profile.major} hallgató`;
  document.querySelector("#profile-university").textContent = profile.university;
  const emailLink = document.querySelector("#profile-email");
  const accountEmail = currentAccount.email || "";
  emailLink.textContent = accountEmail || "Nincs megadva";
  if (accountEmail) {
    emailLink.href = `mailto:${accountEmail}`;
    emailLink.setAttribute("aria-label", `E-mail küldése: ${accountEmail}`);
  } else {
    emailLink.removeAttribute("href");
    emailLink.setAttribute("aria-label", "E-mail-cím nincs megadva");
  }
  document.querySelector("#profile-city").textContent = profile.city || "Nincs megadva";
  document.querySelector("#profile-phone").textContent = profile.phone || "Nincs megadva";
  document.querySelector("#profile-introduction").textContent = profile.introduction || "Még nincs bemutatkozás megadva.";
  document.querySelector("#profile-semester").textContent = semesterLabel(profile.semester);
  renderProfileLanguages(document.querySelector("#profile-languages"), profile.languages);
  document.querySelector("#profile-weekly-hours").textContent = hoursComplete
    ? `Heti ${minimumHours}–${maximumHours} óra`
    : "Nincs megadva";
  document.querySelector("#profile-work-mode").textContent = profile.workMode || "Nincs megadva";
  renderAvatar(document.querySelector("#profile-avatar"), initials, profile.profileImage);
  document.querySelector("#profile-progress-value").textContent = `${progress}%`;
  document.querySelector("#profile-progress-ring").style.background = `conic-gradient(var(--green) 0 ${progress}%, #e4e8e2 ${progress}%)`;
  const progressCopy = document.querySelector("#profile-progress-copy");
  if (progressCopy) progressCopy.textContent = progress === 100 ? "Minden fontos adatot megadtál." : "Egészítsd ki a profilodat a jobb találatokért.";
  setChecklistItem("completion-contact", contactComplete, "Elérhetőségek megadása");
  setChecklistItem("completion-study", Boolean(profile.semester), "Félév megadása");
  setChecklistItem("completion-language", languagesComplete, "Nyelvtudás megadása");
  setChecklistItem("completion-work", workComplete, "Munkaidő és munkavégzés megadása");
  setChecklistItem("completion-skills", skillsComplete, "Készségek hozzáadása");
  renderSkills(profile.skills);
  renderCourses(profile.relevantCourses);
  renderHistory("profile-education", profile.education, "education", "Még nincs korábbi tanulmány megadva.");
  renderHistory("profile-professional-experience", profile.experience?.filter((entry) => entry.type === "professional"), "experience", "Még nincs szakmai tapasztalat megadva.");
  renderHistory("profile-other-experience", profile.experience?.filter((entry) => entry.type !== "professional"), "experience", "Még nincs egyéb tapasztalat megadva.");
  renderAdditionalData(profile);
  renderProjects(profile.projects);
  document.title = `${profile.fullName} – GyakorStart`;
}

function escapeProfileHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function updateStudentLanguageSummary(row) {
  const level = row.querySelector(".student-language-level").value;
  row.querySelector(".language-summary").textContent = profileCatalogs.languageLevelLabel(level);
}

function updateStudentLanguageExam(row) {
  const checkbox = row.querySelector(".student-language-has-exam");
  const levelWrap = row.querySelector(".student-language-exam-level-wrap");
  const levelSelect = row.querySelector(".student-language-exam-level");
  levelWrap.hidden = !checkbox.checked;
  levelSelect.disabled = !checkbox.checked;
  levelSelect.required = checkbox.checked;
  if (!checkbox.checked) levelSelect.value = "";
}

function createStudentLanguageCard(language) {
  const row = document.createElement("details");
  row.className = "language-option";
  row.open = true;
  row.dataset.languageCode = language.code;
  const levelOptions = profileCatalogs.languageLevels.map((level) => `<option value="${escapeProfileHtml(level.code)}">${escapeProfileHtml(level.label)}</option>`).join("");
  const examOptions = profileCatalogs.examLevels.map((level) => `<option value="${escapeProfileHtml(level.code)}">${escapeProfileHtml(level.label)}</option>`).join("");
  row.innerHTML = `
    <summary><strong>${escapeProfileHtml(language.name)}</strong><span class="language-summary">${escapeProfileHtml(language.level || "Szint nincs megadva")}</span></summary>
    <div class="language-fields language-fields-student">
      <label>Beszédkészség<select class="student-language-level" required><option value="">Válassz szintet…</option>${levelOptions}</select></label>
      <label class="exam-toggle"><input class="student-language-has-exam" type="checkbox" /> Van nyelvvizsgám</label>
      <label class="student-language-exam-level-wrap" hidden>Nyelvvizsga fokozata<select class="student-language-exam-level" disabled><option value="">Válassz fokozatot…</option>${examOptions}</select></label>
      <button class="text-button language-remove" type="button">Nyelv eltávolítása</button>
    </div>`;
  row.querySelector(".student-language-level").value = profileCatalogs.normalizeLanguageLevel(language.level) || "";
  row.querySelector(".student-language-has-exam").checked = Boolean(language.hasExam);
  row.querySelector(".student-language-exam-level").value = profileCatalogs.normalizeExamLevel(language.examLevel) || "";
  updateStudentLanguageExam(row);
  updateStudentLanguageSummary(row);
  row.querySelector(".student-language-level").addEventListener("change", () => updateStudentLanguageSummary(row));
  row.querySelector(".student-language-has-exam").addEventListener("change", () => updateStudentLanguageExam(row));
  row.querySelector(".language-remove").addEventListener("click", () => {
    row.remove();
    syncStudentLanguageAddControls();
  });
  return row;
}

function syncStudentLanguageAddControls() {
  const select = document.querySelector("#language-to-add");
  const addedCodes = new Set([...document.querySelectorAll("#student-language-list [data-language-code]")].map((row) => row.dataset.languageCode));
  [...select.options].forEach((option) => {
    option.disabled = option.value !== "" && addedCodes.has(option.value);
  });
  if (select.selectedOptions[0]?.disabled) select.value = "";
  document.querySelector("#language-empty").hidden = addedCodes.size > 0;
}

function addStudentLanguage() {
  const select = document.querySelector("#language-to-add");
  const language = profileCatalogs.findLanguageByCode(select.value);
  if (!language) {
    select.setCustomValidity("Válassz egy nyelvet a listából.");
    select.reportValidity();
    return;
  }
  const duplicate = [...document.querySelectorAll("#student-language-list [data-language-code]")]
    .some((row) => row.dataset.languageCode === language.code);
  if (duplicate) {
    select.setCustomValidity("Ezt a nyelvet már hozzáadtad.");
    select.reportValidity();
    return;
  }
  const row = createStudentLanguageCard(language);
  document.querySelector("#student-language-list").append(row);
  select.value = "";
  syncStudentLanguageAddControls();
  row.querySelector(".student-language-level").focus();
}

function renderStudentLanguageEditors(languages = []) {
  const list = document.querySelector("#student-language-list");
  list.replaceChildren();
  languages.forEach((saved) => {
    const known = profileCatalogs.findLanguageByCode(saved.code) || profileCatalogs.findLanguageByName(saved.name);
    // Csak az engedélyezett közös nyelvlista elemei jelenhetnek meg.
    if (!known) return;
    const language = {
      code: known.code,
      name: known.name,
      level: profileCatalogs.normalizeLanguageLevel(saved.level) || "",
      cefrLevel: profileCatalogs.languageLevelCefr(saved.level) || saved.cefrLevel || "",
      hasExam: Boolean(saved.hasExam),
      examLevel: profileCatalogs.normalizeExamLevel(saved.examLevel) || ""
    };
    list.append(createStudentLanguageCard(language));
  });
  syncStudentLanguageAddControls();
}

function collectStudentLanguages() {
  return [...document.querySelectorAll("#student-language-list [data-language-code]")].map((row) => ({
    code: row.dataset.languageCode,
    name: row.querySelector("summary strong").textContent,
    level: row.querySelector(".student-language-level").value,
    cefrLevel: profileCatalogs.languageLevelCefr(row.querySelector(".student-language-level").value),
    hasExam: row.querySelector(".student-language-has-exam").checked,
    examLevel: row.querySelector(".student-language-has-exam").checked
      ? row.querySelector(".student-language-exam-level").value
      : ""
  }));
}

function syncMajorCustomField(select, wrap, input) {
  const isOther = select.value === "other";
  wrap.hidden = !isOther;
  input.required = isOther;
  if (!isOther) input.value = "";
}

function setMajorEditor(select, customWrap, customInput, majorCode, majorName) {
  const known = profileCatalogs.findMajorByCode(majorCode) || profileCatalogs.findMajorByName(majorName);
  select.value = known?.code || "other";
  customInput.value = known ? "" : (majorName || "");
  syncMajorCustomField(select, customWrap, customInput);
}

function collectMajorEditor(select, customInput) {
  if (select.value === "other") {
    const name = customInput.value.trim();
    const known = profileCatalogs.findMajorByName(name);
    return known
      ? { code: known.code, name: known.name }
      : { code: `custom-${profileCatalogs.slug(name) || `major-${Date.now()}`}`, name };
  }
  const major = profileCatalogs.findMajorByCode(select.value);
  return major ? { code: major.code, name: major.name } : { code: "", name: "" };
}

function removeEditorRow(event) {
  const row = event.currentTarget.closest(".repeatable-row");
  const list = row.parentElement;
  row.remove();
  if (!list.children.length) {
    const empty = document.createElement("p");
    empty.className = "repeatable-empty";
    empty.textContent = list.dataset.emptyText;
    list.append(empty);
  }
}

function prepareEditorList(listId, emptyText) {
  const list = document.querySelector(`#${listId}`);
  list.replaceChildren();
  list.dataset.emptyText = emptyText;
  return list;
}

function appendSkillEditor(skill = {}) {
  const list = document.querySelector("#skill-editor-list");
  list.querySelector(".repeatable-empty")?.remove();
  const row = document.createElement("div");
  row.className = "repeatable-row skill-editor-row";
  row.innerHTML = '<label>Készség<input class="skill-name" placeholder="pl. Excel vagy JavaScript" /></label><label>Szint<select class="skill-level"><option value="">Válassz szintet…</option><option>Tanulom</option><option>Alapszint</option><option>Önállóan használom</option><option>Magabiztos</option><option>Haladó</option></select></label><button class="text-button repeatable-remove" type="button" aria-label="Készség eltávolítása">Eltávolítás</button>';
  row.querySelector(".skill-name").value = skill.name || "";
  row.querySelector(".skill-level").value = skill.level || "";
  row.querySelector(".repeatable-remove").addEventListener("click", removeEditorRow);
  list.append(row);
}

function appendEducationEditor(education = {}) {
  const list = document.querySelector("#education-editor-list");
  list.querySelector(".repeatable-empty")?.remove();
  const row = document.createElement("div");
  row.className = "repeatable-row education-editor-row";
  row.innerHTML = '<label>Intézmény<input class="education-institution" placeholder="pl. Révai Miklós Gimnázium" /></label><label>Képzés vagy végzettség<input class="education-program" placeholder="pl. Érettségi" /></label><label>Időszak<input class="education-period" placeholder="pl. 2018–2022" /></label><button class="text-button repeatable-remove" type="button" aria-label="Tanulmány eltávolítása">Eltávolítás</button>';
  row.querySelector(".education-institution").value = education.institution || "";
  row.querySelector(".education-program").value = education.program || "";
  row.querySelector(".education-period").value = education.period || "";
  row.querySelector(".repeatable-remove").addEventListener("click", removeEditorRow);
  list.append(row);
}

function appendExperienceEditor(experience = {}, type = "other") {
  const listId = type === "professional" ? "professional-experience-editor-list" : "other-experience-editor-list";
  const list = document.querySelector(`#${listId}`);
  list.querySelector(".repeatable-empty")?.remove();
  const row = document.createElement("div");
  row.className = "repeatable-row experience-editor-row";
  row.dataset.experienceType = type;
  row.innerHTML = '<label>Cég vagy szervezet<input class="experience-company" placeholder="pl. Minta Kft." /></label><label>Pozíció<input class="experience-role" placeholder="pl. Diákmunka" /></label><label>Időszak<input class="experience-period" placeholder="pl. 2025 nyara" /></label><label class="experience-description-label">Rövid leírás<textarea class="experience-description" rows="2" placeholder="Mivel foglalkoztál?"></textarea></label><button class="text-button repeatable-remove" type="button" aria-label="Munkatapasztalat eltávolítása">Eltávolítás</button>';
  row.querySelector(".experience-company").value = experience.company || "";
  row.querySelector(".experience-role").value = experience.role || "";
  row.querySelector(".experience-period").value = experience.period || "";
  row.querySelector(".experience-description").value = experience.description || "";
  row.querySelector(".repeatable-remove").addEventListener("click", removeEditorRow);
  list.append(row);
}

function appendProjectEditor(project = {}) {
  const list = document.querySelector("#project-editor-list");
  list.querySelector(".repeatable-empty")?.remove();
  const row = document.createElement("div");
  row.className = "repeatable-row project-editor-row";
  row.innerHTML = '<label>Projekt neve<input class="project-name" placeholder="pl. Egyetemi készletkezelő alkalmazás" /></label><label>Használt eszközök vagy technológiák<input class="project-technologies" placeholder="pl. Java, SQL vagy Excel" /></label><label class="project-description-label">Rövid leírás<textarea class="project-description" rows="3" placeholder="Mi volt a projekt célja, és te mit készítettél benne?"></textarea></label><label>Projektlink<input class="project-url" type="url" placeholder="https://..." /></label><button class="text-button repeatable-remove" type="button" aria-label="Projekt eltávolítása">Eltávolítás</button>';
  row.querySelector(".project-name").value = project.name || "";
  row.querySelector(".project-technologies").value = project.technologies || "";
  row.querySelector(".project-description").value = project.description || "";
  row.querySelector(".project-url").value = project.url || "";
  row.querySelector(".repeatable-remove").addEventListener("click", removeEditorRow);
  list.append(row);
}

function fillProfileBackgroundEditors(profile) {
  const skillList = prepareEditorList("skill-editor-list", "Még nincs készség hozzáadva.");
  (profile.skills?.length ? profile.skills : [{}]).forEach(appendSkillEditor);
  const educationList = prepareEditorList("education-editor-list", "Még nincs korábbi tanulmány hozzáadva.");
  if (profile.education?.length) profile.education.forEach(appendEducationEditor);
  else educationList.innerHTML = '<p class="repeatable-empty">Még nincs korábbi tanulmány hozzáadva.</p>';
  const professionalList = prepareEditorList("professional-experience-editor-list", "Még nincs szakmai tapasztalat hozzáadva.");
  const professionalExperience = profile.experience?.filter((entry) => entry.type === "professional") || [];
  if (professionalExperience.length) professionalExperience.forEach((entry) => appendExperienceEditor(entry, "professional"));
  else professionalList.innerHTML = '<p class="repeatable-empty">Még nincs szakmai tapasztalat hozzáadva.</p>';
  const otherList = prepareEditorList("other-experience-editor-list", "Még nincs egyéb munkatapasztalat hozzáadva.");
  const otherExperience = profile.experience?.filter((entry) => entry.type !== "professional") || [];
  if (otherExperience.length) otherExperience.forEach((entry) => appendExperienceEditor(entry, "other"));
  else otherList.innerHTML = '<p class="repeatable-empty">Még nincs egyéb munkatapasztalat hozzáadva.</p>';
  const projectList = prepareEditorList("project-editor-list", "Még nincs projekt hozzáadva.");
  if (profile.projects?.length) profile.projects.forEach(appendProjectEditor);
  else projectList.innerHTML = '<p class="repeatable-empty">Még nincs projekt hozzáadva.</p>';
  document.querySelector("#edit-relevant-courses").value = Array.isArray(profile.relevantCourses) ? profile.relevantCourses.join(", ") : "";
  document.querySelector("#edit-city").value = profile.city || "";
  document.querySelector("#edit-phone").value = profile.phone || "";
  document.querySelector("#edit-introduction").value = profile.introduction || "";
  document.querySelector("#edit-driving-license").value = profile.drivingLicense || "";
  document.querySelector("#edit-availability-date").value = profile.availabilityDate || "";
  document.querySelector("#edit-linkedin-url").value = profile.linkedinUrl || "";
  document.querySelector("#edit-portfolio-url").value = profile.portfolioUrl || "";
  document.querySelector("#edit-certifications").value = Array.isArray(profile.certifications) ? profile.certifications.join(", ") : "";
}

function openProfileEditor() {
  if (!currentAccount || currentAccount.role !== "student") {
    window.location.href = "index.html";
    return;
  }
  const profile = currentAccount.profile;
  document.querySelector("#edit-semester").value = profile.semester || "";
  document.querySelector("#edit-weekly-hours-min").value = profile.weeklyHoursMin || "";
  document.querySelector("#edit-weekly-hours-max").value = profile.weeklyHoursMax || "";
  document.querySelector("#edit-work-mode").value = profile.workMode || "";
  setMajorEditor(
    document.querySelector("#edit-major"),
    document.querySelector("#edit-major-custom-wrap"),
    document.querySelector("#edit-major-custom"),
    profile.majorCode,
    profile.major
  );
  fillProfileBackgroundEditors(profile);
  document.querySelectorAll("#profile-completion-form textarea").forEach(resizeProfileTextarea);
  pendingProfileImage = profile.profileImage || "";
  renderPhotoPreview(pendingProfileImage, initialsFor(profile.fullName));
  document.querySelector("#profile-photo-input").value = "";
  renderStudentLanguageEditors(profile.languages || []);
  document.querySelector("#profile-save-message").textContent = "";
  document.querySelector("#profile-dialog").showModal();
}

function collectSkills() {
  return [...document.querySelectorAll(".skill-editor-row")].map((row) => ({
    name: row.querySelector(".skill-name").value.trim(),
    level: row.querySelector(".skill-level").value
  })).filter((skill) => skill.name).slice(0, 20);
}

function collectEducation() {
  return [...document.querySelectorAll(".education-editor-row")].map((row) => ({
    institution: row.querySelector(".education-institution").value.trim(),
    program: row.querySelector(".education-program").value.trim(),
    period: row.querySelector(".education-period").value.trim()
  })).filter((entry) => entry.institution || entry.program).slice(0, 10);
}

function collectExperience() {
  return [...document.querySelectorAll(".experience-editor-row")].map((row) => ({
    type: row.dataset.experienceType || "other",
    company: row.querySelector(".experience-company").value.trim(),
    role: row.querySelector(".experience-role").value.trim(),
    period: row.querySelector(".experience-period").value.trim(),
    description: row.querySelector(".experience-description").value.trim()
  })).filter((entry) => entry.company || entry.role).slice(0, 10);
}

function collectProjects() {
  return [...document.querySelectorAll(".project-editor-row")].map((row) => ({
    name: row.querySelector(".project-name").value.trim(),
    technologies: row.querySelector(".project-technologies").value.trim(),
    description: row.querySelector(".project-description").value.trim(),
    url: row.querySelector(".project-url").value.trim()
  })).filter((project) => project.name || project.description).slice(0, 10);
}

if (profileCatalogs && document.querySelector("#edit-major")) profileCatalogs.populateMajorSelect(document.querySelector("#edit-major"));
if (profileCatalogs && document.querySelector("#edit-semester")) profileCatalogs.populateSemesterSelect(document.querySelector("#edit-semester"), "Válassz félévet…");

if (currentAccount?.role === "student") {
  migrateStudentDetails(currentAccount.profile);
  renderStudentProfile();
  profileCatalogs.populateLanguageSelect(document.querySelector("#language-to-add"));
  document.querySelector("#language-to-add").addEventListener("change", () => {
    document.querySelector("#language-to-add").setCustomValidity("");
    syncStudentLanguageAddControls();
  });
  document.querySelector("#add-language").addEventListener("click", addStudentLanguage);
  document.querySelector("#edit-major").addEventListener("change", () => syncMajorCustomField(
    document.querySelector("#edit-major"),
    document.querySelector("#edit-major-custom-wrap"),
    document.querySelector("#edit-major-custom")
  ));
  document.querySelector("#add-skill").addEventListener("click", () => appendSkillEditor({ level: "Tanulom" }));
  document.querySelector("#add-education").addEventListener("click", () => appendEducationEditor());
  document.querySelector("#add-professional-experience").addEventListener("click", () => appendExperienceEditor({}, "professional"));
  document.querySelector("#add-other-experience").addEventListener("click", () => appendExperienceEditor({}, "other"));
  document.querySelector("#add-project").addEventListener("click", () => appendProjectEditor());
  document.querySelectorAll("[data-open-profile-editor]").forEach((button) => button.addEventListener("click", openProfileEditor));
  document.querySelector("#profile-dialog-close").addEventListener("click", () => document.querySelector("#profile-dialog").close());
  document.querySelector("#profile-photo-input").addEventListener("change", async (event) => {
    const file = event.currentTarget.files[0];
    if (!file) return;
    const photoMessage = document.querySelector("#profile-save-message");
    photoMessage.textContent = "A kép feldolgozása…";
    try {
      pendingProfileImage = await resizeProfileImage(file);
      renderPhotoPreview(pendingProfileImage, initialsFor(currentAccount.profile.fullName));
      photoMessage.textContent = "✓ A kép készen áll a mentésre.";
    } catch (error) {
      photoMessage.textContent = error.message;
    }
  });
  document.querySelector("#remove-profile-photo").addEventListener("click", () => {
    pendingProfileImage = "";
    document.querySelector("#profile-photo-input").value = "";
    renderPhotoPreview("", initialsFor(currentAccount.profile.fullName));
    document.querySelector("#profile-save-message").textContent = "A profilkép törlésre lesz jelölve.";
  });
  document.querySelector("#profile-completion-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const minimumHoursInput = document.querySelector("#edit-weekly-hours-min");
    const maximumHoursInput = document.querySelector("#edit-weekly-hours-max");
    const minimumHours = Number(minimumHoursInput.value);
    const maximumHours = Number(maximumHoursInput.value);
    maximumHoursInput.setCustomValidity(minimumHours > maximumHours ? "A maximális óraszám nem lehet kisebb a minimálisnál." : "");
    if (!event.currentTarget.reportValidity()) return;
    const profile = currentAccount.profile;
    profile.semester = document.querySelector("#edit-semester").value;
    const selectedMajor = collectMajorEditor(document.querySelector("#edit-major"), document.querySelector("#edit-major-custom"));
    if (!selectedMajor.name) {
      document.querySelector("#edit-major-custom").setCustomValidity("Válassz szakot, vagy add meg a képzés nevét.");
      document.querySelector("#edit-major-custom").reportValidity();
      return;
    }
    document.querySelector("#edit-major-custom").setCustomValidity("");
    profile.major = selectedMajor.name;
    profile.majorCode = selectedMajor.code;
    profile.weeklyHoursMin = minimumHours;
    profile.weeklyHoursMax = maximumHours;
    profile.workMode = document.querySelector("#edit-work-mode").value;
    profile.languages = collectStudentLanguages();
    profile.skills = collectSkills();
    profile.relevantCourses = document.querySelector("#edit-relevant-courses").value.split(",").map((course) => course.trim()).filter(Boolean).slice(0, 20);
    profile.education = collectEducation();
    profile.experience = collectExperience();
    profile.drivingLicense = document.querySelector("#edit-driving-license").value;
    profile.availabilityDate = document.querySelector("#edit-availability-date").value;
    profile.linkedinUrl = document.querySelector("#edit-linkedin-url").value.trim();
    profile.portfolioUrl = document.querySelector("#edit-portfolio-url").value.trim();
    profile.certifications = document.querySelector("#edit-certifications").value.split(",").map((certification) => certification.trim()).filter(Boolean).slice(0, 20);
    profile.city = document.querySelector("#edit-city").value.trim();
    profile.phone = document.querySelector("#edit-phone").value.trim();
    profile.introduction = document.querySelector("#edit-introduction").value.trim();
    profile.projects = collectProjects();
    profile.profileImage = pendingProfileImage;
    saveStoredAccounts();
    renderStudentProfile();
    document.querySelector("#profile-save-message").textContent = "✓ A profilod adatait elmentettük.";
    window.setTimeout(() => document.querySelector("#profile-dialog").close(), 450);
  });
}

if (!currentAccount && pageRole === "student") {
  document.querySelectorAll("[data-open-profile-editor]").forEach((button) => button.addEventListener("click", () => {
    window.location.href = "index.html";
  }));
}

if (currentAccount?.role === "company") {
  document.querySelector("#company-greeting").textContent = `Üdv, ${currentAccount.profile.companyName}!`;
  document.title = `${currentAccount.profile.companyName} – GyakorStart`;
}

document.querySelectorAll("[data-logout]").forEach((link) => link.addEventListener("click", () => {
  localStorage.removeItem(PROFILE_SESSION_KEY);
}));
