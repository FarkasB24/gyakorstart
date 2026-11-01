const searchInput = document.querySelector("#job-search");
const locationFilter = document.querySelector("#location-filter");
const fieldFilter = document.querySelector("#field-filter");
const sortJobs = document.querySelector("#sort-jobs");
const jobList = document.querySelector("#job-list");
let jobCards = [...document.querySelectorAll(".listing-card")];
const resultCount = document.querySelector("#result-count");
const jobCount = document.querySelector("#job-count");
const emptyResults = document.querySelector("#empty-results");
const normalize = (value) => String(value ?? "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase("hu-HU")
  .replace(/\s+/g, " ")
  .trim();


// A statikus bemutatóhirdetések egyezésvizsgálati adatai megegyeznek a job-detail.js adataival.
const demoJobMatchData = {
  rendszergazda: {
    programs: ["Mérnökinformatikus", "Gazdaságinformatikus", "Programtervező informatikus"],
    minimumSemester: "5",
    languageRequirements: [{ code: "english", name: "Angol", level: "Magabiztos – önálló munkavégzés", requirementType: "required", examRequired: false, examLevel: "" }],
    skills: ["Windows", "Linux", "Hálózati alapismeretek", "Active Directory"],
    minHours: 20, maxHours: 30, workMode: "Hibrid"
  },
  frontend: {
    programs: ["Programtervező informatikus", "Mérnökinformatikus"],
    minimumSemester: "3",
    languageRequirements: [{ code: "english", name: "Angol", level: "Társalgási szint – hétköznapi beszélgetés", requirementType: "required", examRequired: false, examLevel: "" }],
    skills: ["HTML", "CSS", "JavaScript", "React", "Git"],
    minHours: 24, maxHours: 24, workMode: "Hibrid"
  },
  penzugy: {
    programs: ["Pénzügy és számvitel", "Gazdálkodási és menedzsment"],
    minimumSemester: "3",
    languageRequirements: [{ code: "english", name: "Angol", level: "Társalgási szint – hétköznapi beszélgetés", requirementType: "required", examRequired: false, examLevel: "" }],
    minHours: 20, maxHours: 25, workMode: "Irodai"
  },
  gyartastervezo: {
    programs: ["Gépészmérnök", "Mechatronikai mérnök"],
    minimumSemester: "4",
    languageRequirements: [
      { code: "english", name: "Angol", level: "Társalgási szint – hétköznapi beszélgetés", requirementType: "required", examRequired: false, examLevel: "" },
      { code: "german", name: "Német", level: "Társalgási szint – hétköznapi beszélgetés", requirementType: "required", examRequired: false, examLevel: "" }
    ],
    languageRelation: "any", minHours: 24, maxHours: 32, workMode: "Irodai"
  },
  marketing: {
    programs: ["Kereskedelem és marketing", "Kommunikáció- és médiatudomány"],
    minimumSemester: "2",
    languageRequirements: [{ code: "english", name: "Angol", level: "Társalgási szint – hétköznapi beszélgetés", requirementType: "required", examRequired: false, examLevel: "" }],
    minHours: 20, maxHours: 20, workMode: "Hibrid"
  }
};

function getCurrentStudentAccount() {
  try {
    const session = JSON.parse(localStorage.getItem("gyakorstart.session.v1") || "null");
    const accounts = JSON.parse(localStorage.getItem("gyakorstart.accounts.v1") || "[]");
    if (!session || !Array.isArray(accounts)) return null;
    const account = accounts.find((item) => item.email === session.email);
    return account?.role === "student" && account.id ? account : null;
  } catch {
    return null;
  }
}

function getCardMatchJob(card) {
  const postingId = card.dataset.postingId;
  if (postingId) return window.GyakorStartJobPostings?.get(postingId) || null;
  try {
    const href = new URL(card.getAttribute("href") || "", window.location.href);
    return demoJobMatchData[href.searchParams.get("id") || "rendszergazda"] || null;
  } catch {
    return null;
  }
}

function renderMatchBubbles() {
  const student = getCurrentStudentAccount();
  const matcher = window.GyakorStartProfileMatching;
  jobCards.forEach((card) => {
    card.querySelector(".job-match-row")?.remove();
    if (!student || !matcher?.calculate) return;

    const job = getCardMatchJob(card);
    if (!job) return;
    const matching = matcher.calculate(student.profile || {}, job);
    if (!matching || matching.percent === null) return;

    const row = document.createElement("div");
    row.className = "job-match-row";
    const bubble = document.createElement("span");
    const levelClass = matching.percent >= 80 ? "is-high" : matching.percent >= 60 ? "is-medium" : "is-low";
    bubble.className = `job-match-bubble ${levelClass}`;
    bubble.textContent = `${matching.percent}% profil-egyezés`;
    const missingDetails = (matching.details || []).filter((item) => item.met === false).map((item) => item.label);
    bubble.title = missingDetails.length
      ? `Profil-egyezés: ${matching.percent}%. Hiányzó feltételek:
${missingDetails.join("\n")}`
      : `Profil-egyezés: ${matching.percent}%. A kötelező feltételek teljesülnek.`;
    bubble.setAttribute("aria-label", `Profil-egyezés: ${matching.percent} százalék${missingDetails.length ? `. Hiányzó feltételek: ${missingDetails.join("; ")}` : ". A kötelező feltételek teljesülnek."}`);
    row.append(bubble);
    const tags = card.querySelector(".listing-tags");
    if (tags) tags.insertAdjacentElement("afterend", row);
    else card.querySelector(".job-info")?.append(row);
  });
}

function filterJobs() {
  const query = normalize(searchInput.value.trim());
  let count = 0;
  jobCards.forEach((card) => {
    const searchable = normalize(`${card.dataset.title} ${card.dataset.company} ${card.dataset.field} ${card.textContent}`);
    const visible = (!query || searchable.includes(query)) && (locationFilter.value === "all" || card.dataset.location === locationFilter.value) && (fieldFilter.value === "all" || card.dataset.field === fieldFilter.value);
    card.hidden = !visible;
    if (visible) count += 1;
  });
  resultCount.textContent = `${count} lehetőség`;
  jobCount.textContent = count;
  emptyResults.hidden = count !== 0;
  const emptyTitle = emptyResults.querySelector("h3");
  const emptyCopy = emptyResults.querySelector("p");
  if (jobCards.length === 0) {
    emptyTitle.textContent = "Jelenleg nincsenek elérhető állások";
    emptyCopy.textContent = "Nézz vissza később, mert folyamatosan érkeznek új gyakornoki lehetőségek.";
    emptyResults.querySelector("[data-clear-filters]").hidden = true;
  } else {
    emptyTitle.textContent = "Nincs találat";
    emptyCopy.textContent = "Próbálj más keresést vagy módosítsd a szűrőket.";
    emptyResults.querySelector("[data-clear-filters]").hidden = false;
  }
}

function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char]); }

const formatHourlyRate = window.GyakorStartFormatters?.formatHourlyRate || ((value) => ({ amountText: String(value || "Bér egyeztetés szerint"), unitText: "" }));
function renderCardPrice(card, rawValue) {
  const price = card.querySelector(".job-cta p");
  if (!price) return;
  const formatted = formatHourlyRate(rawValue);
  price.classList.add("job-price-display");
  price.replaceChildren();
  const amount = document.createElement("strong");
  amount.textContent = formatted.amountText;
  price.append(amount);
  if (formatted.unitText) {
    const unit = document.createElement("span");
    unit.className = "job-price-unit";
    unit.textContent = formatted.unitText;
    price.append(unit);
  }
}
function normalizeStaticCardPrices() {
  jobCards.forEach((card) => renderCardPrice(card, card.dataset.pay || card.querySelector(".job-cta strong")?.textContent || ""));
}
function renderCompanyPosts() {
  const store = window.GyakorStartJobPostings;
  if (!store) return;
  const activePosts = store.all();
  const activeIds = new Set(activePosts.map((post) => String(post.id)));
  jobList.querySelectorAll("[data-posting-id]").forEach((card) => {
    if (!activeIds.has(String(card.dataset.postingId))) card.remove();
  });
  activePosts.slice().reverse().forEach((post) => {
    const existing = jobList.querySelector(`[data-posting-id="${CSS.escape(post.id)}"]`);
    if (existing) existing.remove();
    const card = document.createElement("a");
    card.className = "listing-card listing-link";
    card.href = `job.html?id=${encodeURIComponent(post.id)}`;
    card.dataset.postingId = post.id;
    card.dataset.title = post.title;
    card.dataset.company = post.company;
    card.dataset.location = post.city;
    card.dataset.field = post.field || "IT";
    card.dataset.pay = String(Number(String(post.hourlyRate || "").replace(/[^0-9]/g, "")) || 0);
    const programs = (post.programs || []).map((item) => item.name).join(", ") || "Bármely képzés";
    const deadline = new Intl.DateTimeFormat("hu-HU", { year:"numeric", month:"short", day:"numeric" }).format(new Date(`${post.expiresOn}T00:00:00`));
    card.innerHTML = `<div class="job-logo logo-mint">GS</div><div class="job-info"><div class="listing-label">Jelentkezési határidő: ${escapeHtml(deadline)}</div><h3>${escapeHtml(post.title)}</h3><p class="company-name">${escapeHtml(post.company)}</p><div class="listing-tags"><span>⌖ ${escapeHtml(post.city)}</span><span>◐ ${escapeHtml(post.workMode)}</span><span>◷ Heti ${escapeHtml(post.minHours)}–${escapeHtml(post.maxHours)} óra</span></div><p class="skills"><strong>Jelentkezhet:</strong> ${escapeHtml(programs)}</p></div><div class="job-cta"><p></p><span class="button button-primary">Részletek →</span></div>`;
    renderCardPrice(card, post.hourlyRate || "");
    jobList.prepend(card);
  });
  jobCards = [...document.querySelectorAll(".listing-card")];
  renderMatchBubbles();
  filterJobs();
}

function clearFilters() { searchInput.value = ""; locationFilter.value = "all"; fieldFilter.value = "all"; filterJobs(); }
searchInput.addEventListener("input", filterJobs);
locationFilter.addEventListener("change", filterJobs);
fieldFilter.addEventListener("change", filterJobs);
sortJobs.addEventListener("change", () => { const cards = [...jobCards].sort((a, b) => sortJobs.value === "pay-desc" ? Number(b.dataset.pay) - Number(a.dataset.pay) : Number(b.classList.contains("featured")) - Number(a.classList.contains("featured"))); cards.forEach((card) => jobList.appendChild(card)); });
document.querySelector("#clear-filters").addEventListener("click", clearFilters);
document.querySelectorAll("[data-clear-filters]").forEach((button) => button.addEventListener("click", clearFilters));

normalizeStaticCardPrices();
renderCompanyPosts();
renderMatchBubbles();
window.addEventListener("gyakorstart:job-postings-changed", renderCompanyPosts);
window.addEventListener("storage", (event) => {
  if (!event.key || event.key === "gyakorstart.accounts.v1" || event.key === "gyakorstart.session.v1") renderMatchBubbles();
});
window.addEventListener("focus", renderMatchBubbles);
