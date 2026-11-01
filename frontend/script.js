const ACCOUNTS_KEY = "gyakorstart.accounts.v1";
const SESSION_KEY = "gyakorstart.session.v1";

const dialog = document.querySelector("#auth-dialog");
const form = document.querySelector("#auth-form");
const title = document.querySelector("#auth-title");
const subtitle = document.querySelector("#auth-subtitle");
const submitButton = form.querySelector("button[type='submit']");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const message = document.querySelector("#form-message");
const tabs = [...document.querySelectorAll("[data-auth-tab]")];
const registrationRole = document.querySelector("#registration-role");
const studentFields = document.querySelector("#student-registration-fields");
const companyFields = document.querySelector("#company-registration-fields");
const catalogs = window.GyakorStartCatalogs;
const studentMajorSelect = document.querySelector("#student-major");
const studentMajorCustomWrap = document.querySelector("#student-major-custom-wrap");
const studentMajorCustomInput = document.querySelector("#student-major-custom");

if (catalogs && studentMajorSelect) catalogs.populateMajorSelect(studentMajorSelect);

function syncRegistrationMajorField() {
  const isOther = studentMajorSelect?.value === "other";
  if (studentMajorCustomWrap) studentMajorCustomWrap.hidden = !isOther;
  if (studentMajorCustomInput) {
    studentMajorCustomInput.required = Boolean(isOther && !studentFields.disabled);
    if (!isOther) studentMajorCustomInput.value = "";
  }
}

studentMajorSelect?.addEventListener("change", syncRegistrationMajorField);

function readAccounts() {
  try {
    const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
    return Array.isArray(accounts) ? accounts : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

async function hashPassword(value) {
  if (window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(value);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  let fallback = 2166136261;
  for (const character of value) fallback = Math.imul(fallback ^ character.charCodeAt(0), 16777619);
  return `demo-${(fallback >>> 0).toString(16)}`;
}

function selectedRole() {
  return form.querySelector("[name='account-role']:checked")?.value || "student";
}

function profileUrl(role) {
  return role === "company" ? "ceges-profil.html" : "hallgatoi-profil.html";
}

function postLoginUrl(account) {
  if (account?.role !== "student") return profileUrl(account?.role);
  const returnTo = new URLSearchParams(window.location.search).get("returnTo");
  if (!returnTo) return profileUrl(account.role);

  try {
    const target = new URL(returnTo, window.location.href);
    const targetFile = target.pathname.split("/").pop();
    if (target.origin !== window.location.origin || targetFile !== "job.html") {
      return profileUrl(account.role);
    }
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return profileUrl(account.role);
  }
}

function setMessage(text, type = "") {
  message.textContent = text;
  message.dataset.type = type;
}

function syncRegistrationFields() {
  const registering = form.dataset.mode === "register";
  const studentSelected = selectedRole() === "student";
  studentFields.hidden = !registering || !studentSelected;
  studentFields.disabled = !registering || !studentSelected;
  companyFields.hidden = !registering || studentSelected;
  companyFields.disabled = !registering || studentSelected;
  syncRegistrationMajorField();
}

function setAuthMode(mode) {
  const login = mode === "login";
  form.dataset.mode = mode;
  title.textContent = login ? "Jó, hogy újra itt vagy!" : "Hozd létre a profilodat!";
  subtitle.textContent = login ? "Lépj be az e-mail-címeddel és a jelszavaddal." : "Először válaszd ki, hogy hallgatóként vagy cégként regisztrálsz.";
  submitButton.textContent = login ? "Bejelentkezés" : "Fiók létrehozása";
  passwordInput.autocomplete = login ? "current-password" : "new-password";
  registrationRole.hidden = login;
  dialog.classList.toggle("register-mode", !login);
  setMessage("");
  syncRegistrationFields();
  tabs.forEach((tab) => {
    const selected = tab.dataset.authTab === mode;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
}

function saveSession(account) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: account.email, role: account.role }));
}

function renderSessionHeader() {
  const actions = document.querySelector("#auth-actions");
  if (!actions) return;
  let session;
  try {
    session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    session = null;
  }
  const account = session && readAccounts().find((item) => item.email === session.email);
  if (!account) return;
  if (account.role === "student") {
    document.querySelector(".site-header .nav").innerHTML = '<a href="jobs.html">Állások</a><a href="index.html#kinek-szol">Rólunk</a><a href="hallgatoi-profil.html#jelentkezeseim">Jelentkezéseim</a>';
    actions.innerHTML = '<a class="button button-primary" href="hallgatoi-profil.html">Saját profil</a><button class="button button-ghost session-logout" id="header-logout">Kijelentkezés</button>';
  } else {
    actions.innerHTML = `<a class="button button-primary" href="${profileUrl(account.role)}">Saját profil</a><button class="button button-ghost" id="header-logout">Kijelentkezés</button>`;
  }
  document.querySelector("#header-logout").addEventListener("click", () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.reload();
  });
}

document.querySelectorAll("[data-open-auth]").forEach((button) => button.addEventListener("click", () => {
  form.reset();
  setAuthMode(button.dataset.openAuth);
  if (button.dataset.authRole) {
    const roleInput = form.querySelector(`[name="account-role"][value="${button.dataset.authRole}"]`);
    if (roleInput) roleInput.checked = true;
  }
  syncRegistrationFields();
  dialog.showModal();
}));

tabs.forEach((tab) => tab.addEventListener("click", () => setAuthMode(tab.dataset.authTab)));
form.querySelectorAll("[name='account-role']").forEach((input) => input.addEventListener("change", syncRegistrationFields));
document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  submitButton.disabled = true;
  setMessage(form.dataset.mode === "login" ? "Belépés folyamatban…" : "Fiók létrehozása…");

  try {
    const email = emailInput.value.trim().toLocaleLowerCase("hu-HU");
    const passwordHash = await hashPassword(passwordInput.value);
    const accounts = readAccounts();

    if (form.dataset.mode === "login") {
      const account = accounts.find((item) => item.email === email && item.passwordHash === passwordHash);
      if (!account) {
        setMessage("Hibás e-mail-cím vagy jelszó. Ha még nincs fiókod, válaszd a Regisztráció fület.", "error");
        return;
      }
      const requiredRole = new URLSearchParams(window.location.search).get("role");
      if (requiredRole === "student" && account.role !== "student") {
        setMessage("Ehhez az állásra történő jelentkezéshez hallgatói fiókkal kell bejelentkezned.", "error");
        return;
      }
      saveSession(account);
      setMessage("Sikeres bejelentkezés!", "success");
      window.location.href = postLoginUrl(account);
      return;
    }

    if (accounts.some((item) => item.email === email)) {
      setMessage("Ezzel az e-mail-címmel már létezik fiók. Jelentkezz be!", "error");
      return;
    }

    const role = selectedRole();
    const requiredRole = new URLSearchParams(window.location.search).get("role");
    if (requiredRole === "student" && role !== "student") {
      setMessage("Ehhez az állásra történő jelentkezéshez hallgatói fiókot hozz létre.", "error");
      return;
    }
    const selectedMajorCode = studentMajorSelect?.value || "";
    const selectedMajor = catalogs?.findMajorByCode(selectedMajorCode);
    const customMajorName = studentMajorCustomInput?.value.trim() || "";
    const normalizedCustomMajor = selectedMajorCode === "other" ? catalogs?.findMajorByName(customMajorName) : null;
    const majorName = selectedMajorCode === "other" ? (normalizedCustomMajor?.name || customMajorName) : (selectedMajor?.name || "");
    if (role === "student" && (!majorName || (selectedMajorCode === "other" && !customMajorName))) {
      setMessage("Válassz szakot, vagy add meg a képzés nevét!", "error");
      return;
    }
    const profile = role === "student"
      ? {
          fullName: document.querySelector("#student-name").value.trim(),
          birthDate: document.querySelector("#student-birth-date").value,
          birthPlace: document.querySelector("#student-birth-place").value.trim(),
          university: document.querySelector("#student-university").value.trim(),
          major: majorName,
          majorCode: selectedMajorCode === "other" ? (normalizedCustomMajor?.code || `custom-${catalogs.slug(customMajorName) || `major-${Date.now()}`}`) : selectedMajorCode,
          semester: "",
          languages: [],
          weeklyHoursMin: "",
          weeklyHoursMax: "",
          workMode: "",
          skills: [],
          relevantCourses: [],
          education: [],
          experience: [],
          drivingLicense: "",
          availabilityDate: "",
          linkedinUrl: "",
          portfolioUrl: "",
          certifications: [],
          phone: "",
          city: "",
          introduction: "",
          projects: [],
          profileImage: "",
          detailsVersion: 8
        }
      : {
          companyName: document.querySelector("#company-name").value.trim(),
          taxNumber: document.querySelector("#company-tax-number").value.trim(),
          companyRegistrationNumber: document.querySelector("#company-reg-number").value.trim(),
          contactName: document.querySelector("#contact-name").value.trim(),
          phone: document.querySelector("#company-phone").value.trim(),
          registeredOffice: {
            postalCode: document.querySelector("#company-postal-code").value.trim(),
            city: document.querySelector("#company-city").value.trim(),
            street: document.querySelector("#company-street").value.trim(),
            houseNumber: document.querySelector("#company-house-number").value.trim()
          },
          location: `${document.querySelector("#company-postal-code").value.trim()} ${document.querySelector("#company-city").value.trim()}, ${document.querySelector("#company-street").value.trim()} ${document.querySelector("#company-house-number").value.trim()}`,
          website: document.querySelector("#company-website").value.trim()
        };

    const account = {
      id: window.crypto?.randomUUID?.() || `account-${Date.now()}`,
      role,
      email,
      passwordHash,
      profile,
      createdAt: new Date().toISOString()
    };
    accounts.push(account);
    saveAccounts(accounts);
    saveSession(account);
    setMessage("A fiókod elkészült! Megnyitjuk a profilodat…", "success");
    window.location.href = postLoginUrl(account);
  } catch {
    setMessage("A böngésző nem tudta elmenteni a fiókot. Ellenőrizd, hogy engedélyezett-e a helyi tárhely.", "error");
  } finally {
    submitButton.disabled = false;
  }
});

setAuthMode("login");
syncRegistrationMajorField();
renderSessionHeader();

const authParams = new URLSearchParams(window.location.search);
if (authParams.get("auth") === "login") {
  form.reset();
  setAuthMode("login");
  if (authParams.get("role") === "student") {
    subtitle.textContent = "Az állásra történő jelentkezéshez lépj be hallgatói fiókoddal.";
  }
  dialog.showModal();
}
