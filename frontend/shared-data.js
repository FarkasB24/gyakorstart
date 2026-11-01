/*
 * GyakorStart – közös adatok és böngészős prototípus-adattárolás.
 * Egyetlen közös fájlban: törzsadatok, jelentkezések és álláshirdetések.
 * Nincs külön JSON konfigurációs vagy adatfájl.
 */


/* ===== shared-catalogs.js ===== */
/*
 * GyakorStart közös törzsadatok.
 * A hallgatói és céges felület ugyanazokat a nyelv- és szakazonosítókat használja.
 */
(function () {
  const languages = [
    // Elsődleges, a gyakornoki piacon leggyakrabban elvárt nyelvek.
    { code: "english", name: "Angol", aliases: ["English"], group: "Elsődleges nyelvek" },
    { code: "german", name: "Német", aliases: ["Deutsch", "German"], group: "Elsődleges nyelvek" },
    { code: "hungarian", name: "Magyar", aliases: ["Hungarian", "Magyar nyelv"], group: "További választható nyelvek" },
    // További, gyakran hasznos idegen nyelvek. A lista tudatosan rövid és ellenőrzött.
    { code: "french", name: "Francia", aliases: ["Français", "French"], group: "További választható nyelvek" },
    { code: "spanish", name: "Spanyol", aliases: ["Español", "Spanish"], group: "További választható nyelvek" },
    { code: "italian", name: "Olasz", aliases: ["Italiano", "Italian"], group: "További választható nyelvek" },
    { code: "russian", name: "Orosz", aliases: ["Russian"], group: "További választható nyelvek" },
    { code: "chinese", name: "Kínai", aliases: ["Chinese", "Mandarin"], group: "További választható nyelvek" },
    { code: "japanese", name: "Japán", aliases: ["Japanese"], group: "További választható nyelvek" },
    { code: "slovak", name: "Szlovák", aliases: ["Slovak"], group: "További választható nyelvek" }
  ];

  const majors = [
    { code: "engineering-informatics", name: "Mérnökinformatikus", aliases: ["Mérnök informatikus", "Mérnökinformatikus BSc", "Mérnökinformatikus MSc", "Mérnökinfó"], group: "Informatika" },
    { code: "computer-science", name: "Programtervező informatikus", aliases: ["Programtervező informatikus BSc", "Programtervező informatikus MSc", "Programtervező infó"], group: "Informatika" },
    { code: "business-informatics", name: "Gazdaságinformatikus", aliases: ["Gazdaságinformatikus BSc", "Gazdaságinformatikus MSc", "Gazdasági informatikus", "Gazdinfó"], group: "Informatika" },
    { code: "software-engineering", name: "Üzemmérnök-informatikus", aliases: ["Üzemmérnök informatikus", "Üzemmérnökinformatikus"], group: "Informatika" },
    { code: "ai-informatics", name: "Mesterséges intelligencia informatikus", aliases: ["Mesterséges intelligencia informatikus MSc", "MI informatikus"], group: "Informatika" },
    { code: "data-science", name: "Adattudomány", aliases: ["Data Science", "Adattudomány MSc"], group: "Informatika" },
    { code: "electrical-engineering", name: "Villamosmérnök", aliases: ["Villamosmérnöki"], group: "Műszaki és mérnöki" },
    { code: "mechanical-engineering", name: "Gépészmérnök", aliases: ["Gépészmérnöki"], group: "Műszaki és mérnöki" },
    { code: "vehicle-engineering", name: "Járműmérnök", aliases: ["Járműmérnöki"], group: "Műszaki és mérnöki" },
    { code: "mechatronics", name: "Mechatronikai mérnök", aliases: ["Mechatronikai mérnöki"], group: "Műszaki és mérnöki" },
    { code: "logistics-engineering", name: "Logisztikai mérnök", aliases: ["Logisztikai mérnöki"], group: "Műszaki és mérnöki" },
    { code: "transport-engineering", name: "Közlekedésmérnök", aliases: ["Közlekedésmérnöki"], group: "Műszaki és mérnöki" },
    { code: "civil-engineering", name: "Építőmérnök", aliases: ["Építőmérnöki"], group: "Műszaki és mérnöki" },
    { code: "architecture", name: "Építészmérnök", aliases: ["Építészmérnöki"], group: "Műszaki és mérnöki" },
    { code: "industrial-design", name: "Ipari termék- és formatervező mérnök", aliases: ["Ipari termék- és formatervező mérnöki"], group: "Műszaki és mérnöki" },
    { code: "environmental-engineering", name: "Környezetmérnök", aliases: ["Környezetmérnöki"], group: "Műszaki és mérnöki" },
    { code: "chemical-engineering", name: "Vegyészmérnök", aliases: ["Vegyészmérnöki"], group: "Természettudomány és agrár" },
    { code: "biochemical-engineering", name: "Biomérnök", aliases: ["Biomérnöki"], group: "Természettudomány és agrár" },
    { code: "food-engineering", name: "Élelmiszermérnök", aliases: ["Élelmiszermérnöki"], group: "Természettudomány és agrár" },
    { code: "agricultural-engineering", name: "Mezőgazdasági mérnök", aliases: ["Mezőgazdasági mérnöki", "Agrármérnök", "Agrármérnöki"], group: "Természettudomány és agrár" },
    { code: "agricultural-food-machinery", name: "Mezőgazdasági és élelmiszeripari gépészmérnök", aliases: ["Mezőgazdasági és élelmiszeripari gépészmérnöki"], group: "Természettudomány és agrár" },
    { code: "management", name: "Gazdálkodási és menedzsment", group: "Gazdaság és üzlet" },
    { code: "finance-accounting", name: "Pénzügy és számvitel", group: "Gazdaság és üzlet" },
    { code: "commerce-marketing", name: "Kereskedelem és marketing", group: "Gazdaság és üzlet" },
    { code: "international-business", name: "Nemzetközi gazdálkodás", group: "Gazdaság és üzlet" },
    { code: "human-resources", name: "Emberi erőforrások", group: "Gazdaság és üzlet" },
    { code: "tourism-hospitality", name: "Turizmus-vendéglátás", group: "Gazdaság és üzlet" },
    { code: "communication-media", name: "Kommunikáció- és médiatudomány", group: "Társadalom és bölcsészet" },
    { code: "law", name: "Jogász", group: "Társadalom és bölcsészet" },
    { code: "psychology", name: "Pszichológia", group: "Társadalom és bölcsészet" },
    { code: "teacher-training", name: "Tanárképzés", group: "Társadalom és bölcsészet" },
    { code: "biology", name: "Biológia", group: "Természettudomány és agrár" },
    { code: "mathematics", name: "Matematika", group: "Természettudomány és agrár" },
    { code: "physics", name: "Fizika", group: "Természettudomány és agrár" },
    { code: "chemistry", name: "Kémia", group: "Természettudomány és agrár" },
    { code: "nursing", name: "Ápolás és betegellátás", group: "Egészségtudomány" },
    { code: "public-health", name: "Népegészségügyi", group: "Egészségtudomány" },
    { code: "sport-science", name: "Edző", group: "Sport és művészet" },
    { code: "design", name: "Tervezőgrafika", group: "Sport és művészet" },
    { code: "informatics-librarian", name: "Informatikus könyvtáros", group: "Informatika" },
    { code: "garden-engineering", name: "Kertészmérnök", aliases: ["Kertészmérnöki"], group: "Természettudomány és agrár" },
    { code: "plant-production-engineering", name: "Növénytermesztő mérnök", aliases: ["Növénytermesztő mérnöki"], group: "Természettudomány és agrár" },
    { code: "animal-husbandry-engineering", name: "Állattenyésztő mérnök", aliases: ["Állattenyésztő mérnöki"], group: "Természettudomány és agrár" },
    { code: "food-safety-engineering", name: "Élelmiszerbiztonsági és -minőségi mérnök", aliases: ["Élelmiszerbiztonsági és minőségi mérnök"], group: "Természettudomány és agrár" },
    { code: "international-studies", name: "Nemzetközi tanulmányok", group: "Társadalom és bölcsészet" },
    { code: "teacher", name: "Osztatlan tanárképzés", aliases: ["Tanár"], group: "Társadalom és bölcsészet" }
  ];

  // Mindkét felület ugyanazokat a rövid, közérthető szinteket használja.
  // A code mező stabilan tárolható és numerikusan összehasonlítható; a label a felhasználói felirat.
  const languageLevels = [
    { code: "beginner", label: "Kezdő", rank: 1, cefr: "A1" },
    { code: "basic", label: "Alapvető kommunikáció", rank: 2, cefr: "A2" },
    { code: "independent", label: "Önálló kommunikáció", rank: 3, cefr: "B1" },
    { code: "confident", label: "Magabiztos munkakommunikáció", rank: 4, cefr: "B2" },
    { code: "fluent", label: "Folyékony szakmai kommunikáció", rank: 5, cefr: "C1" },
    { code: "native", label: "Anyanyelvi szint", rank: 6, cefr: "C2" }
  ];
  const legacyLanguageLevelMap = new Map([
    ["alapszint – egyszerű kifejezések", "basic"],
    ["alapszint egyszerű kifejezések", "basic"],
    ["társalgási szint – hétköznapi beszélgetés", "independent"],
    ["társalgási szint hétköznapi beszélgetés", "independent"],
    ["magabiztos – önálló munkavégzés", "confident"],
    ["magabiztos önálló munkavégzés", "confident"],
    ["folyékony – szakmai környezetben is", "fluent"],
    ["folyékony szakmai környezetben is", "fluent"],
    ["anyanyelvi szint", "native"],
    ["a1", "beginner"], ["a2", "basic"], ["b1", "independent"],
    ["b2", "confident"], ["c1", "fluent"], ["c2", "native"]
  ]);
  function normalizeLanguageLevel(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return "";
    if (languageLevels.some((level) => level.code === raw)) return raw;
    const normalized = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("hu-HU").replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
    const directLegacy = legacyLanguageLevelMap.get(raw.toLocaleLowerCase("hu-HU")) || legacyLanguageLevelMap.get(normalized);
    if (directLegacy) return directLegacy;
    const byLabel = languageLevels.find((level) => normalizeText(level.label) === normalizeText(raw));
    return byLabel?.code || "";
  }
  function languageLevelLabel(value) {
    const code = normalizeLanguageLevel(value);
    return languageLevels.find((level) => level.code === code)?.label || (value ? "Szint nincs megadva" : "Szint nincs megadva");
  }
  function languageLevelCefr(value) {
    const code = normalizeLanguageLevel(value);
    return languageLevels.find((level) => level.code === code)?.cefr || "";
  }
  function cefrLevelRank(value) {
    const code = String(value || "").toUpperCase();
    return examLevels.find((level) => level.code === code)?.rank ?? null;
  }
  function languageLevelRank(value) {
    // A felületi kategória mögött egységes CEFR-szintet használunk.
    return cefrLevelRank(languageLevelCefr(value));
  }
  function languageLevelMeetsMinimum(studentLevel, minimumLevel) {
    const studentRank = languageLevelRank(studentLevel);
    const minimumRank = languageLevelRank(minimumLevel);
    return studentRank !== null && minimumRank !== null && studentRank >= minimumRank;
  }
  // A nyelvvizsga mező külön, a CEFR hat fokozatát használja.
  // A beszédkészségi skálától függetlenül tároljuk és hasonlítjuk össze.
  const examLevels = [
    { code: "A1", label: "A1", rank: 1 },
    { code: "A2", label: "A2", rank: 2 },
    { code: "B1", label: "B1", rank: 3 },
    { code: "B2", label: "B2", rank: 4 },
    { code: "C1", label: "C1", rank: 5 },
    { code: "C2", label: "C2", rank: 6 }
  ];
  function normalizeExamLevel(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return "";
    const upper = raw.toUpperCase();
    if (examLevels.some((level) => level.code === upper)) return upper;
    const normalized = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("hu-HU").replace(/[–—]/g, "-").replace(/[()]/g, " ").replace(/\s+/g, " ").trim();
    const legacyExamLevels = {
      basic: "B1", intermediate: "B2", advanced: "C1",
      alapfok: "B1", "alapfok b1": "B1", alapfoku: "B1",
      kozepfok: "B2", "kozepfok b2": "B2", kozepfoku: "B2",
      felsofok: "C1", "felsofok c1": "C1", felsofoku: "C1"
    };
    return legacyExamLevels[normalized] || "";
  }
  function examLevelLabel(value) {
    const code = normalizeExamLevel(value);
    return examLevels.find((level) => level.code === code)?.label || "Nincs megadva";
  }
  function examLevelRank(value) {
    const code = normalizeExamLevel(value);
    return examLevels.find((level) => level.code === code)?.rank ?? null;
  }
  function examLevelMeetsMinimum(studentLevel, minimumLevel) {
    const studentRank = examLevelRank(studentLevel);
    const minimumRank = examLevelRank(minimumLevel);
    return studentRank !== null && minimumRank !== null && studentRank >= minimumRank;
  }
  // Közös félévskála: a hallgatói profil és a céges minimumkövetelmény is ezt használja.
  const semesters = [
    { value: "1", label: "1. félév" },
    { value: "2", label: "2. félév" },
    { value: "3", label: "3. félév" },
    { value: "4", label: "4. félév" },
    { value: "5", label: "5. félév" },
    { value: "6", label: "6. félév" },
    { value: "7+", label: "7. vagy magasabb félév" }
  ];

  function semesterLabel(value) {
    return semesters.find((semester) => semester.value === String(value || ""))?.label || "Nincs megadva";
  }

  function semesterRank(value) {
    if (String(value) === "7+") return 7;
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed >= 1 && parsed <= 6 ? parsed : null;
  }

  function semesterMeetsMinimum(studentSemester, minimumSemester) {
    const studentRank = semesterRank(studentSemester);
    const minimumRank = semesterRank(minimumSemester);
    return studentRank !== null && minimumRank !== null && studentRank >= minimumRank;
  }

  function populateSemesterSelect(select, placeholder = "Válassz félévet…") {
    if (!select) return;
    select.replaceChildren();
    const first = document.createElement("option");
    first.value = "";
    first.textContent = placeholder;
    select.append(first);
    semesters.forEach(({ value, label }) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      select.append(option);
    });
  }

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("hu-HU")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function slug(value) {
    const normalized = normalizeText(value).replace(/\s+/g, "-").slice(0, 48);
    if (normalized) return normalized;
    // Nem latin betűs egyedi neveknél is legyen megismételhető, stabil azonosító.
    return Array.from(String(value || "").trim().toLocaleLowerCase("hu-HU"))
      .map((character) => character.codePointAt(0).toString(16))
      .join("-")
      .slice(0, 48);
  }

  function findByName(list, name) {
    const normalized = normalizeText(name);
    return list.find((item) => normalizeText(item.name) === normalized || (item.aliases || []).some((alias) => normalizeText(alias) === normalized));
  }

  function appendGroupedOptions(select, list, placeholder, includeOther = true) {
    select.replaceChildren();
    const first = document.createElement("option");
    first.value = "";
    first.textContent = placeholder;
    select.append(first);

    const groups = new Map();
    list.forEach((item) => {
      if (!groups.has(item.group)) groups.set(item.group, []);
      groups.get(item.group).push(item);
    });
    groups.forEach((items, groupName) => {
      const group = document.createElement("optgroup");
      group.label = groupName;
      items.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.code;
        option.textContent = item.name;
        group.append(option);
      });
      select.append(group);
    });

    if (includeOther) {
      const other = document.createElement("option");
      other.value = "other";
      other.textContent = "Egyéb – saját megadás…";
      select.append(other);
    }
  }

  window.GyakorStartCatalogs = Object.freeze({
    languages,
    majors,
    languageLevels,
    normalizeLanguageLevel,
    languageLevelLabel,
    languageLevelCefr,
    cefrLevelRank,
    languageLevelRank,
    languageLevelMeetsMinimum,
    examLevels,
    normalizeExamLevel,
    examLevelLabel,
    examLevelRank,
    examLevelMeetsMinimum,
    semesters,
    semesterLabel,
    semesterRank,
    semesterMeetsMinimum,
    populateSemesterSelect,
    normalizeText,
    slug,
    findLanguageByCode(code) { return languages.find((item) => item.code === code); },
    findLanguageByName(name) { return findByName(languages, name); },
    findMajorByCode(code) { return majors.find((item) => item.code === code); },
    findMajorByName(name) { return findByName(majors, name); },
    populateLanguageSelect(select, placeholder = "Válassz nyelvet…") {
      // Nyelvnél nincs szabad szöveges „Egyéb” lehetőség: csak ellenőrzött elemek választhatók.
      appendGroupedOptions(select, languages, placeholder, false);
    },
    populateMajorSelect(select, placeholder = "Válassz szakot…") {
      appendGroupedOptions(select, majors, placeholder, true);
    }
  });
})();


/* ===== demo-student-profiles.js ===== */
/* Helyi prototípushoz tartozó, fiktív hallgatói tesztprofilok. Éles API-módban nem jönnek létre. */
(() => {
  "use strict";
  const ACCOUNTS_KEY = "gyakorstart.accounts.v1";
  const DEMO_PASSWORD_HASH = "8a4e116a3ba74e94df2e25229ac3c05c1899631722d7355f9cdbd17c06bf5f46"; // GyakorStart2026!
  const profiles = [
    {
          key: "nagy-anna", id: "demo-student-nagy-anna", email: "anna.nagy@example.test", fullName: "Nagy Anna",
          major: "Mérnökinformatikus", majorCode: "engineering-informatics", semester: "6", city: "Győr", university: "Széchenyi István Egyetem",
          language: { name: "Angol", code: "english", level: "fluent", hasExam: true, examLevel: "C1" },
          skills: ["Windows", "Linux", "Hálózati alapismeretek", "Active Directory", "Hibakeresés", "Git"],
          weeklyHoursMin: 20, weeklyHoursMax: 30, workMode: "Irodai", experience: true
        },
    {
          key: "kiss-bence", id: "demo-student-kiss-bence", email: "bence.kiss@example.test", fullName: "Kiss Bence",
          major: "Gazdaságinformatikus", majorCode: "business-informatics", semester: "5", city: "Győr", university: "Széchenyi István Egyetem",
          language: { name: "Angol", code: "english", level: "confident", hasExam: true, examLevel: "B2" },
          skills: ["Windows", "Active Directory", "Office 365", "Hálózati alapismeretek", "Kommunikáció", "SQL"],
          weeklyHoursMin: 20, weeklyHoursMax: 25, workMode: "Irodai", experience: true
        },
    {
          key: "lakatos-lili", id: "demo-student-lili", email: "lili.lakatos@example.test", fullName: "Lakatos Lili",
          major: "Gazdaságinformatikus", majorCode: "business-informatics", semester: "5", city: "Győr", university: "Széchenyi István Egyetem",
          language: { name: "Angol", code: "english", level: "independent", hasExam: true, examLevel: "B2" },
          skills: ["HTML", "CSS", "JavaScript", "React", "Git", "SQL"],
          weeklyHoursMin: 20, weeklyHoursMax: 25, workMode: "Hibrid", experience: true
        },
    {
          key: "varga-marcell", id: "demo-student-varga-marcell", email: "marcell.varga@example.test", fullName: "Varga Marcell",
          major: "Programtervező informatikus", majorCode: "computer-science", semester: "7+", city: "Budapest", university: "Eötvös Loránd Tudományegyetem",
          language: { name: "Angol", code: "english", level: "basic", hasExam: true, examLevel: "A2" },
          skills: ["Windows", "Linux", "Bash", "Hálózati alapismeretek", "Python"],
          weeklyHoursMin: 15, weeklyHoursMax: 20, workMode: "Mindegy", experience: false
        },
    {
          key: "farkas-kata", id: "demo-student-farkas-kata", email: "kata.farkas@example.test", fullName: "Farkas Kata",
          major: "Programtervező informatikus", majorCode: "computer-science", semester: "5", city: "Budapest", university: "Eötvös Loránd Tudományegyetem",
          language: { name: "Angol", code: "english", level: "independent", hasExam: false, examLevel: "" },
          skills: ["HTML", "CSS", "JavaScript", "React", "Git", "TypeScript"],
          weeklyHoursMin: 24, weeklyHoursMax: 30, workMode: "Hibrid", experience: true
        },
    {
          key: "papp-alex", id: "demo-student-papp-alex", email: "alex.papp@example.test", fullName: "Papp Alex",
          major: "Gazdaságinformatikus", majorCode: "business-informatics", semester: "4", city: "Győr", university: "Széchenyi István Egyetem",
          language: { name: "Angol", code: "english", level: "confident", hasExam: true, examLevel: "B2" },
          skills: ["Windows", "Office 365", "Kommunikáció", "Hardverismeretek", "Hálózati alapismeretek", "Hibakeresés"],
          weeklyHoursMin: 20, weeklyHoursMax: 25, workMode: "Hibrid", experience: true
        }
  ];

  const normalizeName = (value) => String(value || "").trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("hu-HU").replace(/\s+/g, " ");
  function makeProfile(seed) {
    const profile = {
      fullName: seed.fullName,
      birthDate: "2003-05-14",
      birthPlace: seed.city,
      university: seed.university,
      major: seed.major,
      majorCode: seed.majorCode,
      semester: seed.semester,
      languages: [{ ...seed.language }],
      weeklyHoursMin: String(seed.weeklyHoursMin),
      weeklyHoursMax: String(seed.weeklyHoursMax),
      workMode: seed.workMode,
      skills: seed.skills.map((name) => ({ name, level: "Magabiztos" })),
      relevantCourses: seed.majorCode === "computer-science"
        ? ["Programozás", "Adatstruktúrák", "Szoftvertechnológia"]
        : ["Programozás", "Adatbázis-kezelés", "Számítógép-hálózatok"],
      education: [{ institution: seed.university, program: seed.major, period: "2023 – jelenleg", description: `${seed.semester === "7+" ? "7. vagy magasabb" : seed.semester}. féléves hallgató` }],
      experience: seed.experience ? [{ type: "professional", role: "IT gyakornoki projektmunka", company: "Egyetemi projektcsapat", period: "2025 – 2026", description: "Egyetemi projektfeladatok és csapatmunka valós fejlesztési környezetet utánzó feladatokon." }] : [],
      projects: [{ name: seed.majorCode === "computer-science" ? "Webalkalmazás-projekt" : "Informatikai laborprojekt", technologies: seed.skills.slice(0, 3).join(", "), period: "2025 – 2026", description: "Egyetemi csapatprojekt, dokumentációval és teszteléssel." }],
      drivingLicense: "B kategória",
      availabilityDate: "2026-11-15",
      linkedinUrl: "",
      portfolioUrl: "",
      certifications: seed.language.hasExam ? [`Angol ${seed.language.examLevel} nyelvvizsga`] : [],
      phone: "",
      city: seed.city,
      introduction: `Hallgatóként olyan gyakornoki lehetőséget keresek, ahol a ${seed.major.toLocaleLowerCase("hu-HU")} képzés során megszerzett tudásomat gyakorlati feladatokban fejleszthetem.`,
      profileImage: "",
      detailsVersion: 10,
      _demoProfileVersion: 1
    };
    return profile;
  }

  function readAccounts() {
    try {
      const parsed = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }

  function ensureSeeded() {
    if (document.querySelector('meta[name="api-mode"]')?.content === "server") return;
    let accounts = readAccounts();
    let changed = false;
    // A korábbi 14 fős demókészletből a már nem használt, kizárólag tesztként létrehozott fiókokat eltávolítjuk.
    // A valódi felhasználói fiókokhoz és a jelentkezési tárhoz nem nyúlunk.
    const retiredDemoIds = new Set([
      "demo-student-balogh-peter", "demo-student-szabo-julia", "demo-student-horvath-nandor",
      "demo-student-kovacs-sara", "demo-student-lakatos-pal", "demo-student-nemeth-marton",
      "demo-student-biro-emma", "demo-student-gal-kristof"
    ]);
    const retainedAccounts = accounts.filter((item) => !(item?.isDemoAccount === true && retiredDemoIds.has(item.id)));
    if (retainedAccounts.length !== accounts.length) { accounts = retainedAccounts; changed = true; }

    profiles.forEach((seed) => {
      let account = accounts.find((item) => item.id === seed.id || item.email === seed.email);
      if (!account) {
        account = {
          id: seed.id,
          role: "student",
          email: seed.email,
          passwordHash: DEMO_PASSWORD_HASH,
          profile: makeProfile(seed),
          createdAt: "2026-10-01T09:00:00.000Z",
          isDemoAccount: true,
          demoProfileKey: seed.key
        };
        accounts.push(account);
        changed = true;
      } else {
        // A meglévő fiókhoz nem nyúlunk hozzá, csak a hiányzó alapstruktúrát pótoljuk.
        if (!account.id) { account.id = seed.id; changed = true; }
        if (!account.role) { account.role = "student"; changed = true; }
        if (!account.email) { account.email = seed.email; changed = true; }
        if (!account.profile || typeof account.profile !== "object" || Array.isArray(account.profile)) {
          account.profile = makeProfile(seed);
          changed = true;
        }
        if (account.isDemoAccount !== true) { account.isDemoAccount = true; changed = true; }
        if (!account.demoProfileKey) { account.demoProfileKey = seed.key; changed = true; }
      }
    });

    // Előre létrehozott, fiktív céges tesztfiók a helyi prototípushoz.
    const companyEmail = "ceg.teszt@gyakorstart.example.test";
    let companyAccount = accounts.find((item) => item.id === "demo-company-technova" || item.email === companyEmail);
    if (!companyAccount) {
      companyAccount = {
        id: "demo-company-technova",
        role: "company",
        email: companyEmail,
        passwordHash: DEMO_PASSWORD_HASH,
        profile: {
          companyName: "TechNova Solutions Kft.",
          taxNumber: "12345678-2-08",
          companyRegistrationNumber: "08-09-123456",
          contactName: "Kovács Péter",
          phone: "+36 30 123 4567",
          registeredOffice: { postalCode: "9021", city: "Győr", street: "Baross Gábor út", houseNumber: "12." },
          location: "9021 Győr, Baross Gábor út 12.",
          website: "https://technova.example",
          introduction: "Fiktív informatikai vállalkozás gyakornoki teszteléshez. Egyedi szoftverfejlesztéssel és vállalati informatikai megoldásokkal foglalkozik."
        },
        createdAt: "2026-11-01T09:00:00.000Z",
        isDemoAccount: true,
        demoProfileKey: "technova-company"
      };
      accounts.push(companyAccount);
      changed = true;
    }

    if (changed) {
      try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts)); }
      catch (error) { console.warn("A hallgatói tesztprofilokat nem sikerült elmenteni.", error); }
    }
  }

  ensureSeeded();
  window.GyakorStartDemoStudentProfiles = Object.freeze({
    list: profiles.map(({ key, id, email, fullName }) => ({ key, id, email, fullName })),
    findByName(name) {
      const normalized = normalizeName(name);
      const seed = profiles.find((item) => normalizeName(item.fullName) === normalized);
      if (!seed) return null;
      const account = readAccounts().find((item) => item.id === seed.id || item.email === seed.email);
      return account ? { id: account.id, email: account.email, profile: account.profile } : null;
    },
    getAccountId(name) { return this.findByName(name)?.id || null; },
    ensure: ensureSeeded
  });
})();


/* ===== shared-profile-matching.js ===== */
/* Ugyanaz a súlyozott egyezésvizsgálat a hallgatói és a céges felületen,
   részletes, feltételenkénti indoklással. */
(() => {
  "use strict";
  const catalogs = window.GyakorStartCatalogs;
  function normalize(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("hu-HU").trim();
  }
  function calculate(profileValue, jobValue) {
    const profile = profileValue && typeof profileValue === "object" ? profileValue : {};
    const raw = jobValue?.raw || jobValue || {};
    const checks = [];
    const details = [];
    const weights = [];
    const addDetail = (met, category, label) => details.push({ met, category, label });
    const addGroup = (label, weight, results) => {
      if (!results.length) return;
      const met = results.every(Boolean);
      checks.push([met, label]);
      weights.push({ met, weight });
    };
    const list = (value) => Array.isArray(value) ? value : [];
    const formatHours = (min, max) => min === max ? `${min} óra/hét` : `${min}–${max} óra/hét`;

    // Tanulmányok: elfogadott szak és minimum félév.
    const programs = list(raw.programs)
      .map((item) => typeof item === "string" ? item : item?.name || item?.label || "")
      .filter(Boolean);
    const studyResults = [];
    if (programs.length) {
      const studentMajor = String(profile.major || "").trim();
      const majorKnown = Boolean(studentMajor && normalize(studentMajor) !== "nincs megadva");
      const majorMatch = majorKnown && programs.some((major) => {
        const target = normalize(major);
        const own = normalize(studentMajor);
        return own === target || own.includes(target) || target.includes(own);
      });
      studyResults.push(majorMatch);
      if (!majorKnown) {
        addDetail(false, "Tanulmányok", `Szak megadása szükséges. Elfogadott szakok: ${programs.join(", ")}; a szak nincs megadva a profilodban.`);
      } else if (!majorMatch) {
        addDetail(false, "Tanulmányok", `A hirdetés elfogadott szakjai: ${programs.join(", ")}; a profilodban ${studentMajor} szerepel.`);
      } else {
        addDetail(true, "Tanulmányok", `Szak: ${studentMajor} – megfelel.`);
      }
    }

    const minSemester = Number.parseInt(raw.minimumSemester, 10);
    if (Number.isFinite(minSemester) && minSemester > 0) {
      const studentSemester = Number.parseInt(profile.semester, 10);
      const semesterKnown = Number.isFinite(studentSemester) && studentSemester > 0;
      const semesterMet = semesterKnown && studentSemester >= minSemester;
      studyResults.push(semesterMet);
      if (!semesterKnown) {
        addDetail(false, "Tanulmányok", `Legalább ${minSemester}. félév szükséges; a félév nincs megadva a profilodban.`);
      } else if (!semesterMet) {
        addDetail(false, "Tanulmányok", `Legalább ${minSemester}. félév szükséges; a profilodban ${studentSemester}. félév szerepel.`);
      } else {
        addDetail(true, "Tanulmányok", `Félév: ${studentSemester}. – megfelel a legalább ${minSemester}. féléves elvárásnak.`);
      }
    }
    addGroup("Tanulmányok", 25, studyResults);

    // Nyelvi feltételek: a beszédkészség és a nyelvvizsga külön vizsgálat.
    const requirements = list(raw.languageRequirements);
    const studentLanguages = list(profile.languages);
    const requiredLanguageRequirements = requirements.filter((req) => req.requirementType !== "preferred");
    const languageEvaluations = requiredLanguageRequirements.map((req) => {
      const languageName = String(req.name || catalogs?.findLanguageByCode?.(req.code)?.name || req.code || "Nyelv");
      const requiredName = normalize(req.name || req.code);
      const own = studentLanguages.find((item) =>
        normalize(item.name || item.code) === requiredName ||
        (req.code && normalize(item.code) === normalize(req.code))
      );
      const languageDetails = [];
      let languageMet = true;

      if (!own) {
        languageMet = false;
        languageDetails.push({ met: false, category: "Nyelvtudás", label: `${languageName} nyelvtudás: ${catalogs?.languageLevelLabel?.(req.level) || "az elvárt szint"} szükséges; ez a nyelv nincs megadva a profilodban.` });
        if (req.examRequired) {
          languageDetails.push({ met: false, category: "Nyelvvizsga", label: `${languageName} ${catalogs?.examLevelLabel?.(req.examLevel) || req.examLevel || "előírt szintű"} nyelvvizsga szükséges; a profilodban nincs megadva nyelvvizsga.` });
        }
      } else {
        const ownLevel = own.level;
        const ownLevelRank = catalogs?.languageLevelRank?.(ownLevel);
        const minimumLevelRank = catalogs?.languageLevelRank?.(req.level);
        const levelMet = ownLevelRank !== null && ownLevelRank !== undefined && minimumLevelRank !== null && minimumLevelRank !== undefined && ownLevelRank >= minimumLevelRank;
        languageMet = levelMet;
        if (ownLevelRank === null || ownLevelRank === undefined) {
          languageDetails.push({ met: false, category: "Nyelvtudás", label: `${languageName} nyelvtudás: legalább ${catalogs?.languageLevelLabel?.(req.level) || "az elvárt szint"} szükséges; a beszédkészségi szint nincs megadva a profilodban.` });
        } else if (!levelMet) {
          languageDetails.push({ met: false, category: "Nyelvtudás", label: `${languageName} nyelvtudás: legalább ${catalogs?.languageLevelLabel?.(req.level) || "az elvárt szint"} szükséges; a profilodban ${catalogs?.languageLevelLabel?.(ownLevel) || ownLevel} szerepel.` });
        } else {
          languageDetails.push({ met: true, category: "Nyelvtudás", label: `${languageName} beszédkészség: megfelel (${catalogs?.languageLevelLabel?.(ownLevel) || ownLevel}).` });
        }

        if (req.examRequired) {
          const requiredExam = catalogs?.normalizeExamLevel?.(req.examLevel) || String(req.examLevel || "").toUpperCase();
          const ownExam = catalogs?.normalizeExamLevel?.(own.examLevel) || String(own.examLevel || "").toUpperCase();
          const requiredExamRank = catalogs?.examLevelRank?.(requiredExam);
          const ownExamRank = own.hasExam ? catalogs?.examLevelRank?.(ownExam) : null;
          const examMet = Boolean(own.hasExam && ownExam && ownExamRank !== null && ownExamRank !== undefined && requiredExamRank !== null && requiredExamRank !== undefined && ownExamRank >= requiredExamRank);
          languageMet = languageMet && examMet;
          if (!own.hasExam || !ownExam) {
            languageDetails.push({ met: false, category: "Nyelvvizsga", label: `${languageName} ${catalogs?.examLevelLabel?.(requiredExam) || requiredExam || "előírt szintű"} nyelvvizsga szükséges; a profilodban nincs nyelvvizsga megadva.` });
          } else if (!examMet) {
            languageDetails.push({ met: false, category: "Nyelvvizsga", label: `${languageName} ${catalogs?.examLevelLabel?.(requiredExam) || requiredExam} nyelvvizsga szükséges; a profilodban ${catalogs?.examLevelLabel?.(ownExam) || ownExam} szerepel.` });
          } else {
            languageDetails.push({ met: true, category: "Nyelvvizsga", label: `${languageName} nyelvvizsga: megfelel (${catalogs?.examLevelLabel?.(ownExam) || ownExam}).` });
          }
        }
      }
      return { met: languageMet, details: languageDetails };
    });

    // Előnyként megjelölt nyelvek látszanak a kiértékelésben, de nem csökkentik a százalékot.
    requirements.filter((req) => req.requirementType === "preferred").forEach((req) => {
      const languageName = String(req.name || catalogs?.findLanguageByCode?.(req.code)?.name || req.code || "Nyelv");
      const own = studentLanguages.find((item) => normalize(item.name || item.code) === normalize(req.name || req.code) || (req.code && normalize(item.code) === normalize(req.code)));
      if (!own) {
        addDetail(null, "Előny", `${languageName} nyelvtudás előnyt jelent; nincs megadva a profilodban.`);
        return;
      }
      const meets = catalogs?.languageLevelMeetsMinimum?.(own.level, req.level) ?? false;
      addDetail(meets ? true : null, "Előny", meets
        ? `${languageName} nyelvtudás: az előnyt jelentő szint teljesül.`
        : `${languageName} nyelvtudás előnyt jelentene (${catalogs?.languageLevelLabel?.(req.level) || "elvárt szint"}); a profilodban ${catalogs?.languageLevelLabel?.(own.level) || "nincs megadva szint"} szerepel.`);
    });

    if (requiredLanguageRequirements.length) {
      const relationIsAny = raw.languageRelation === "any" && languageEvaluations.length > 1;
      const languageMet = relationIsAny
        ? languageEvaluations.some((item) => item.met)
        : languageEvaluations.every((item) => item.met);
      if (relationIsAny && languageMet) {
        const matchingLanguage = languageEvaluations.find((item) => item.met);
        matchingLanguage?.details.forEach((item) => addDetail(item.met, item.category, item.label));
        addDetail(true, "Kötelező nyelvi feltételek", "A legalább egy elvárt nyelvre vonatkozó feltétel teljesül.");
      } else {
        languageEvaluations.forEach((item) => item.details.forEach((detail) => addDetail(detail.met, detail.category, detail.label)));
        if (relationIsAny && !languageMet) {
          addDetail(false, "Kötelező nyelvi feltételek", "A felsorolt nyelvek közül legalább egynek teljesítenie kellene az elvárt szintet.");
        }
      }
      addGroup("Kötelező nyelvi feltételek", 25, [languageMet]);
    }

    // Szakmai készségek: minden felsorolt készség külön visszajelzést kap.
    const requiredSkills = list(raw.skills || raw.requiredSkills)
      .map((item) => typeof item === "string" ? item : item?.name || item?.label || "")
      .filter(Boolean);
    const ownSkills = list(profile.skills).map((item) => normalize(typeof item === "string" ? item : item?.name || item?.label || ""));
    if (requiredSkills.length) {
      const skillResults = requiredSkills.map((skill) => {
        const met = ownSkills.includes(normalize(skill));
        addDetail(met, "Szakmai készségek", met
          ? `${skill}-ismeret: megadva a profilodban.`
          : `${skill}-ismeret hiányzik a profilodból.`);
        return met;
      });
      addGroup("Szakmai készségek", 30, skillResults);
    }

    // Munkavégzés: heti óraszám és munkavégzési mód.
    const workResults = [];
    const minHours = Number(raw.minHours), maxHours = Number(raw.maxHours);
    const hoursRequired = Number.isFinite(minHours) && Number.isFinite(maxHours) && minHours > 0 && maxHours > 0;
    if (hoursRequired) {
      const studentMin = Number(profile.weeklyHoursMin), studentMax = Number(profile.weeklyHoursMax);
      const hoursKnown = Number.isFinite(studentMin) && Number.isFinite(studentMax) && studentMin > 0 && studentMax > 0;
      const hoursMet = hoursKnown && studentMax >= minHours && studentMin <= maxHours;
      workResults.push(hoursMet);
      if (!hoursKnown) {
        addDetail(false, "Munkavégzés", `A hirdetés heti ${formatHours(minHours, maxHours)} rendelkezésre állást vár; a vállalható heti óraszám nincs megadva a profilodban.`);
      } else if (!hoursMet) {
        addDetail(false, "Munkavégzés", `A hirdetés heti ${formatHours(minHours, maxHours)} rendelkezésre állást vár; a profilodban ${formatHours(studentMin, studentMax)} szerepel.`);
      } else {
        addDetail(true, "Munkavégzés", `Heti vállalható óraszám: ${formatHours(studentMin, studentMax)} – megfelel.`);
      }
    }
    const requiredWorkMode = raw.workMode || raw.workplace;
    if (requiredWorkMode) {
      const ownWorkMode = String(profile.workMode || "").trim();
      const modeKnown = Boolean(ownWorkMode);
      const modeMet = modeKnown && (normalize(requiredWorkMode) === normalize(ownWorkMode) || normalize(ownWorkMode) === "mindegy");
      workResults.push(modeMet);
      if (!modeKnown) {
        addDetail(false, "Munkavégzés", `A hirdetés munkavégzési módja: ${requiredWorkMode}; a munkavégzési mód nincs megadva a profilodban.`);
      } else if (!modeMet) {
        addDetail(false, "Munkavégzés", `A hirdetés munkavégzési módja ${requiredWorkMode}; a profilodban ${ownWorkMode} szerepel.`);
      } else {
        addDetail(true, "Munkavégzés", `Munkavégzési mód: ${ownWorkMode} – megfelel.`);
      }
    }
    addGroup("Munkavégzés", 20, workResults);

    const totalWeight = weights.reduce((sum, item) => sum + item.weight, 0);
    const percent = totalWeight ? Math.round(weights.reduce((sum, item) => sum + (item.met ? item.weight : 0), 0) / totalWeight * 100) : null;
    return { checks, details, percent, knownGroups: weights.length, totalWeight };
  }
  window.GyakorStartProfileMatching = Object.freeze({ calculate });
})();


/* ===== shared-applications.js ===== */
(() => {
  "use strict";

  const STORAGE_KEY = "gyakorstart.applications.v2";
  const DEMO_STORAGE_KEY = "gyakorstart.demo-applications.v1";
  const LEGACY_STATUS_KEY = "gyakorstart.company-application-status.v1";
  const VALID_STATUSES = ["new", "interview", "rejected"];
  const STATUS_LABELS = {
    new: "Elbírálás alatt",
    interview: "Interjúra hívva",
    rejected: "Elutasítva"
  };

  const demoApplications = [
    {
      id: "rendszergazda:LL",
      studentId: "demo-student-lili",
      studentName: "Lakatos Lili",
      jobId: "rendszergazda",
      jobTitle: "Rendszergazda gyakornok",
      company: "Rába IT Services Kft.",
      city: "Győr",
      logo: "IT",
      logoClass: "logo-mint",
      appliedAt: "2026-10-16T09:15:00+02:00",
      status: "new",
      history: [
        {
          type: "submitted",
          title: "Jelentkezés beérkezett",
          message: "A jelentkezésed sikeresen beérkezett a vállalathoz. A kiválasztás állapotát ezen az oldalon követheted.",
          at: "2026-10-16T09:15:00+02:00"
        },
      ]
    },
    {
      id: "frontend:LL",
      studentId: "demo-student-lili",
      studentName: "Lakatos Lili",
      jobId: "frontend",
      jobTitle: "Frontend fejlesztő gyakornok",
      company: "WebOrbit Studio",
      city: "Budapest",
      logo: "</>",
      logoClass: "logo-blue",
      appliedAt: "2026-10-12T10:30:00+02:00",
      status: "interview",
      history: [
        {
          type: "submitted",
          title: "Jelentkezés beérkezett",
          message: "A jelentkezésed sikeresen beérkezett a vállalathoz. A kiválasztás állapotát ezen az oldalon követheted.",
          at: "2026-10-12T10:30:00+02:00"
        },
        {
          type: "interview",
          title: "Interjúra hívtak",
          message: "A vállalat interjúra hívott. A további egyeztetést közvetlenül a vállalat HR-munkatársával intézheted.",
          at: "2026-10-20T14:00:00+02:00"
        }
      ]
    }
  ];

  function safeParse(raw, fallback) {
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function readAll() {
    return safeParse(localStorage.getItem(STORAGE_KEY) || "{}", {});
  }

  function readDemoAll() {
    return safeParse(localStorage.getItem(DEMO_STORAGE_KEY) || "{}", {});
  }

  function writeDemoAll(records) {
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(records));
      window.dispatchEvent(new CustomEvent("gyakorstart:applications-changed"));
      return true;
    } catch (error) {
      console.warn("A bemutatójelentkezést nem sikerült elmenteni.", error);
      return false;
    }
  }

  function writeAll(records) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      window.dispatchEvent(new CustomEvent("gyakorstart:applications-changed"));
      return true;
    } catch (error) {
      console.warn("A jelentkezés állapotát nem sikerült elmenteni.", error);
      return false;
    }
  }

  function normalizeStatus(status) {
    // A szerver enumjai nagybetűsek lehetnek; a korábbi archivált állapot elutasítottként jelenik meg.
    const normalized = String(status || "new").toLowerCase();
    if (normalized === "archived" || normalized === "rejected" || normalized === "declined") return "rejected";
    if (normalized === "interview" || normalized === "interview_invited") return "interview";
    if (normalized === "pending" || normalized === "submitted" || normalized === "new") return "new";
    return VALID_STATUSES.includes(normalized) ? normalized : "new";
  }

  function normalizeHistory(history, company, appliedAt) {
    const events = Array.isArray(history) ? history.map((item) => ({ ...item })) : [];
    const submittedIndex = events.findIndex((item) => item.type === "submitted");
    const receivedIndex = events.findIndex((item) => item.type === "received");

    events.forEach((item) => {
      if (item.type === "interview") {
        item.title = "Interjúra hívtak";
        item.message = "A vállalat interjúra hívott. A további egyeztetést közvetlenül a vállalat HR-munkatársával intézheted.";
        delete item.interview;
      }
    });

    // A beküldés és a céghez történő beérkezés ugyanannak a sikeres műveletnek a két megfogalmazása.
    // A régebbi mentésekből egyetlen, összevont eseményt készítünk.
    if (submittedIndex >= 0) {
      events[submittedIndex] = {
        ...events[submittedIndex],
        title: "Jelentkezés beérkezett",
        message: `A jelentkezésed sikeresen beérkezett a vállalathoz. A kiválasztás állapotát ezen az oldalon követheted.`
      };
      if (receivedIndex >= 0) events.splice(receivedIndex, 1);
    } else if (receivedIndex >= 0) {
      events[receivedIndex] = {
        ...events[receivedIndex],
        type: "submitted",
        title: "Jelentkezés beérkezett",
        message: `A jelentkezésed sikeresen beérkezett a vállalathoz. A kiválasztás állapotát ezen az oldalon követheted.`
      };
    } else if (!events.length) {
      events.push({
        type: "submitted",
        title: "Jelentkezés beérkezett",
        message: `A jelentkezésed sikeresen beérkezett a vállalathoz. A kiválasztás állapotát ezen az oldalon követheted.`,
        at: appliedAt || new Date().toISOString()
      });
    }

    return events.sort((a, b) => new Date(a.at || 0) - new Date(b.at || 0));
  }

  function readLegacyStatuses() {
    return safeParse(localStorage.getItem(LEGACY_STATUS_KEY) || "{}", {});
  }

  function ensure(defaultRecord) {
    if (defaultRecord?.isDemoData) {
      const demoRecords = readDemoAll();
      const existingDemo = demoRecords[defaultRecord.id];
      if (existingDemo) {
        existingDemo.status = normalizeStatus(existingDemo.status);
        existingDemo.history = normalizeHistory(existingDemo.history, existingDemo.company, existingDemo.appliedAt);
        demoRecords[defaultRecord.id] = existingDemo;
        writeDemoAll(demoRecords);
        return existingDemo;
      }
      const demoRecord = {
        ...defaultRecord,
        status: normalizeStatus(defaultRecord.status),
        history: normalizeHistory(defaultRecord.history, defaultRecord.company, defaultRecord.appliedAt),
        createdAt: defaultRecord.appliedAt || new Date().toISOString(),
        isDemoData: true
      };
      demoRecords[demoRecord.id] = demoRecord;
      writeDemoAll(demoRecords);
      return demoRecord;
    }
    const records = readAll();
    const existing = records[defaultRecord.id];
    if (existing) {
      existing.status = normalizeStatus(existing.status);
      existing.history = normalizeHistory(existing.history, existing.company, existing.appliedAt);
      if (!existing.studentId && defaultRecord.studentId) existing.studentId = defaultRecord.studentId;
      if (!existing.studentName && defaultRecord.studentName) existing.studentName = defaultRecord.studentName;
      delete existing.interview;
      records[defaultRecord.id] = existing;
      writeAll(records);
      return existing;
    }

    const legacyStatus = readLegacyStatuses()[defaultRecord.id];
    const record = {
      ...defaultRecord,
      status: normalizeStatus(legacyStatus || defaultRecord.status),
      history: normalizeHistory(defaultRecord.history, defaultRecord.company, defaultRecord.appliedAt),
      createdAt: defaultRecord.appliedAt || new Date().toISOString(),
      updatedAt: null
    };
    records[record.id] = record;
    writeAll(records);
    return record;
  }

  function get(id) {
    const record = readAll()[id] || readDemoAll()[id];
    if (!record) return null;
    record.status = normalizeStatus(record.status);
    record.history = normalizeHistory(record.history, record.company, record.appliedAt);
    return record;
  }

  function getForStudent(studentId) {
    const records = { ...readAll() };
    // A bemutatójelentkezések külön tárhelyen vannak; kizárólag az adott demo hallgató látja őket.
    if (String(studentId || "").startsWith("demo-student-")) Object.assign(records, readDemoAll());
    return Object.values(records)
      .filter((record) => record.studentId === studentId)
      .map((record) => ({ ...record, status: normalizeStatus(record.status), history: normalizeHistory(record.history, record.company, record.appliedAt) }))
      .sort((a, b) => new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0));
  }

  function getForJob(jobId) {
    return Object.values(readAll())
      .filter((record) => !record.isDemoData && String(record.jobId || '') === String(jobId || ''))
      .map((record) => ({ ...record, status: normalizeStatus(record.status), history: normalizeHistory(record.history, record.company, record.appliedAt) }))
      .sort((a, b) => new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0));
  }

  // Szerver által sikeresen létrehozott jelentkezés helyi gyorsítótárazása.
  // A rekord ID-ját a backend adja; studentId-t a backendnek munkamenetből is ellenőriznie kell.
  function addFromServer(payload) {
    if (!payload || !payload.id || !payload.studentId || !payload.jobId) {
      return { ok: false, error: "A szerver válaszából hiányzik a jelentkezés azonosítója." };
    }
    const records = readAll();
    const duplicate = Object.values(records).find((record) =>
      String(record.studentId || "") === String(payload.studentId) &&
      String(record.jobId || "") === String(payload.jobId)
    );
    if (duplicate) return { ok: false, duplicate: true, record: duplicate, error: "Erre az állásra már jelentkeztél." };

    const appliedAt = payload.appliedAt || payload.createdAt || new Date().toISOString();
    const record = {
      ...payload,
      id: String(payload.id),
      studentId: String(payload.studentId),
      jobId: String(payload.jobId),
      status: normalizeStatus(payload.status || "new"),
      appliedAt,
      history: normalizeHistory(Array.isArray(payload.history) && payload.history.length ? payload.history : [{
        type: "submitted",
        title: "Jelentkezés beérkezett",
        message: "A jelentkezésed sikeresen beérkezett a vállalathoz. A kiválasztás állapotát ezen az oldalon követheted.",
        at: appliedAt
      }], payload.company, appliedAt),
      updatedAt: payload.updatedAt || null
    };
    delete record.interview;
    if (records[record.id]) return { ok: false, duplicate: true, record: records[record.id], error: "Ez a jelentkezés már szerepel a listádban." };
    records[record.id] = record;
    const ok = writeAll(records);
    return { ok, record: ok ? record : null, error: ok ? null : "A jelentkezést nem sikerült frissíteni a böngészőben." };
  }

  function syncFromServer(serverApplications, studentId) {
    if (!Array.isArray(serverApplications) || !studentId) return { ok:false, error:"Érvénytelen jelentkezési lista." };
    const records = readAll();
    const incomingIds = new Set();
    serverApplications.forEach((payload) => {
      if (!payload?.id || !payload?.jobId) return;
      if (payload.studentId && String(payload.studentId) !== String(studentId)) return;
      const id = String(payload.id);
      incomingIds.add(id);
      const appliedAt = payload.appliedAt || payload.submittedAt || payload.createdAt || new Date().toISOString();
      records[id] = {
        ...(records[id] || {}),
        ...payload,
        id,
        studentId:String(payload.studentId || studentId),
        jobId:String(payload.jobId),
        status:normalizeStatus(payload.status),
        appliedAt,
        history:normalizeHistory(payload.history, payload.company, appliedAt),
        updatedAt:payload.updatedAt || null
      };
      delete records[id].interview;
    });
    // A saját hallgatói lista szerveroldali lekérdezése a hallgatóhoz tartozó helyi cache-t is egyezteti.
    Object.keys(records).forEach((id) => {
      if (String(records[id]?.studentId || "") === String(studentId) && !incomingIds.has(String(id))) delete records[id];
    });
    const ok = writeAll(records);
    return { ok, error:ok ? null : "A jelentkezési lista frissítése nem sikerült." };
  }

  function updateStatus(id, nextStatus, details = {}) {
    if (!VALID_STATUSES.includes(nextStatus)) return { ok: false, record: null, error: "Érvénytelen státusz." };
    const realRecords = readAll();
    const demoRecords = readDemoAll();
    const isDemo = !realRecords[id] && Boolean(demoRecords[id]);
    const records = isDemo ? demoRecords : realRecords;
    const record = records[id];
    if (!record) return { ok: false, record: null };

    const previousStatus = normalizeStatus(record.status);
    if (previousStatus === nextStatus) return { ok: true, record };

    const now = new Date().toISOString();
    const message = String(details.message || "").trim();
    let event;

    if (nextStatus === "interview") {
      delete record.interview;
      event = {
        type: "interview",
        title: "Interjúra hívtak",
        message: message || "A vállalat interjúra hívott. A további egyeztetést közvetlenül a vállalat HR-munkatársával intézheted.",
        at: now
      };
    } else if (nextStatus === "rejected") {
      delete record.interview;
      event = {
        type: "rejected",
        title: "A jelentkezés lezárult",
        message: message || "A cég ezúttal másik jelentkezőt választott. Köszönjük, hogy jelentkeztél!",
        at: now
      };
    } else {
      delete record.interview;
      event = {
        type: "reopened",
        title: "A jelentkezés ismét aktív",
        message: message || "A cég visszaállította a jelentkezésedet az elbírálás alatt álló jelentkezések közé.",
        at: now
      };
    }

    record.status = nextStatus;
    record.updatedAt = now;
    record.history = Array.isArray(record.history) ? record.history : [];
    record.history.push(event);
    records[id] = record;
    const ok = isDemo ? writeDemoAll(records) : writeAll(records);
    return { ok, record };
  }

  function rejectPendingForJob(jobId, message = "A hirdetést a vállalat véglegesen lezárta, ezért a kiválasztás ezen a pozíción nem folytatódik. Köszönjük a jelentkezésedet!") {
    const records = readAll();
    const now = new Date().toISOString();
    let rejectedCount = 0;
    Object.values(records).forEach((record) => {
      if (String(record.jobId || "") !== String(jobId || "")) return;
      const status = normalizeStatus(record.status);
      if (status !== "new") return;
      record.status = "rejected";
      delete record.interview;
      record.updatedAt = now;
      record.history = normalizeHistory(record.history, record.company, record.appliedAt);
      record.history.push({
        type: "rejected",
        title: "A jelentkezés lezárult",
        message,
        at: now
      });
      rejectedCount += 1;
    });
    if (!rejectedCount) return { ok: true, rejectedCount: 0 };
    const ok = writeAll(records);
    return { ok, rejectedCount: ok ? rejectedCount : 0, error: ok ? null : "A jelentkezések lezárását nem sikerült elmenteni." };
  }

  const legacyRealRecords = readAll();
  const separatedDemoRecords = readDemoAll();
  let demoSeparationChanged = false;
  demoApplications.forEach((seed) => {
    const legacy = legacyRealRecords[seed.id];
    if (legacy) {
      separatedDemoRecords[seed.id] = { ...seed, ...legacy, isDemoData: true };
      delete legacyRealRecords[seed.id];
      demoSeparationChanged = true;
    } else if (!separatedDemoRecords[seed.id]) {
      separatedDemoRecords[seed.id] = { ...seed, isDemoData: true };
      demoSeparationChanged = true;
    }
  });
  if (demoSeparationChanged) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(legacyRealRecords));
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(separatedDemoRecords));
    } catch (error) { console.warn("A bemutatóadatok elkülönítése nem sikerült.", error); }
  }

  // Korábbi helyi mentések migrációja: az interjú kizárólag státuszesemény, nincs időpont- vagy helyszínadat.
  const allStoredApplications = readAll();
  let applicationsMigrated = false;
  Object.values(allStoredApplications).forEach((record) => {
    const normalizedStatus = normalizeStatus(record.status);
    const normalizedHistory = normalizeHistory(record.history, record.company, record.appliedAt);
    if (record.status !== normalizedStatus) {
      record.status = normalizedStatus;
      applicationsMigrated = true;
    }
    if (JSON.stringify(record.history || []) !== JSON.stringify(normalizedHistory)) {
      record.history = normalizedHistory;
      applicationsMigrated = true;
    }
    if (Object.prototype.hasOwnProperty.call(record, "interview")) {
      delete record.interview;
      applicationsMigrated = true;
    }
  });
  if (applicationsMigrated) writeAll(allStoredApplications);

  window.GyakorStartApplicationStore = {
    storageKey: STORAGE_KEY,
    statuses: VALID_STATUSES.slice(),
    statusLabels: { ...STATUS_LABELS },
    demoStudentId: "demo-student-lili",
    ensure,
    get,
    getForStudent,
    getForJob,
    addFromServer,
    syncFromServer,
    updateStatus,
    rejectPendingForJob,
    normalizeStatus
  };
})();


/* ===== shared-job-postings.js ===== */
/* Hirdetés-életciklus prototípus. Éles rendszerben ugyanezeket az átmeneteket a backendnek is ellenőriznie kell. */
(() => {
  "use strict";
  const KEY = "gyakorstart.job-postings.v1";
  // A korábbi bemutatócégekhez tartozó rövid ismertetők. Ezek tesztadatok,
  // nem valós vállalati bemutatkozások. A korábbi hirdetések migrációja
  // kizárólag a céges leírást egészíti ki; a jelentkezéseket nem módosítja.
  const LEGACY_COMPANY_DESCRIPTIONS = {
    "Rába IT Services Kft.": "A Rába IT Services Kft. bemutatóprofilja: informatikai üzemeltetési és támogatási feladatokkal, vállalati rendszerek működtetésével és felhasználói támogatással foglalkozó mintavállalat. Gyakornokaink mentorálás mellett szerezhetnek gyakorlati tapasztalatot.",
    "WebOrbit Studio": "A WebOrbit Studio bemutatóprofilja: webes felületek és digitális szolgáltatások tervezésével, fejlesztésével foglalkozó mintavállalat. A gyakornokok valósághű fejlesztési feladatokon, tapasztalt csapattagok támogatásával dolgozhatnak.",
    "Danube Finance Kft.": "A Danube Finance Kft. bemutatóprofilja: pénzügyi és üzleti támogató folyamatokat végző mintavállalat, ahol a gyakornokok adatokkal, kimutatásokkal és adminisztratív pénzügyi feladatokkal szerezhetnek tapasztalatot.",
    "FlexMotion Kft.": "A FlexMotion Kft. bemutatóprofilja: műszaki és gyártástámogatási folyamatokkal foglalkozó mintavállalat. Gyakornokai mérnöki projektekbe és dokumentációs feladatokba kapcsolódhatnak be.",
    "KreatívPont": "A KreatívPont bemutatóprofilja: marketingkommunikációs és digitális tartalomkészítési feladatokat végző mintavállalat, ahol a gyakornokok kampányok és kreatív projektek megvalósítását támogathatják."
  };
  const VALID_STATUSES = ["draft", "active", "paused", "closed", "expired"];
  const STATUS_LABELS = {
    draft: "Piszkozat",
    active: "Aktív",
    paused: "Szüneteltetett",
    closed: "Lezárt",
    expired: "Lejárt"
  };
  const read = () => {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(value) ? value : [];
    } catch { return []; }
  };
  const write = (items) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent("gyakorstart:job-postings-changed"));
      return true;
    } catch (error) {
      console.warn("A hirdetések állapotát nem sikerült menteni.", error);
      return false;
    }
  };
  const localDateString = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
  function normalizeStatus(post) {
    if (VALID_STATUSES.includes(post?.status)) return post.status;
    if (post?.status === "closed" || post?.closed) return "closed";
    return "active";
  }
  function isValidExpiryDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
    if (!match) return false;
    const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }
  function isExpired(post, now = new Date()) {
    if (!isValidExpiryDate(post?.expiresOn)) return false;
    const endOfDeadlineDay = new Date(`${post.expiresOn}T23:59:59.999`);
    return now.getTime() >= endOfDeadlineDay.getTime();
  }
  function applicationRecordsFor(postId) {
    return window.GyakorStartApplicationStore?.getForJob(postId) || [];
  }
  function refresh() {
    const items = read();
    let changed = false;
    const now = new Date().toISOString();
    items.forEach((post) => {
      // Visszafelé kompatibilis adatfrissítés: a régi hirdetések megkapják
      // a hozzájuk tartozó bemutató cég leírását, ha az korábban hiányzott.
      // Ismeretlen, valódi cégekhez nem találunk ki bemutatkozást.
      if (!String(post.companyDescription || "").trim()) {
        const legacyDescription = LEGACY_COMPANY_DESCRIPTIONS[String(post.company || "").trim()];
        if (legacyDescription) { post.companyDescription = legacyDescription; changed = true; }
      }
      const status = normalizeStatus(post);
      if (status !== post.status) { post.status = status; changed = true; }
      if (Array.isArray(post.languageRequirements)) {
        post.languageRequirements = post.languageRequirements.map((item) => {
          const normalizedLevel = window.GyakorStartCatalogs?.normalizeLanguageLevel(item.level) || "";
          const normalizedExamLevel = window.GyakorStartCatalogs?.normalizeExamLevel(item.examLevel) || "";
          const minimumCefrLevel = window.GyakorStartCatalogs?.languageLevelCefr(normalizedLevel || item.level) || "";
          if ((normalizedLevel && normalizedLevel !== item.level) || (normalizedExamLevel && normalizedExamLevel !== item.examLevel) || minimumCefrLevel !== (item.minimumCefrLevel || "")) changed = true;
          return {
            ...item,
            ...(normalizedLevel ? { level: normalizedLevel } : {}),
            ...(minimumCefrLevel ? { minimumCefrLevel } : {}),
            ...(normalizedExamLevel ? { examLevel: normalizedExamLevel } : {})
          };
        });
      }
      // Csak a közzétett hirdetések járnak le; a piszkozatot a cég később még befejezheti.
      if (["active", "paused"].includes(post.status) && isExpired(post)) {
        post.status = "expired";
        post.expiredAt = now;
        post.closedAt = now;
        changed = true;
      }
    });
    if (changed) write(items);
    return items;
  }
  function scheduleNextExpiry() {
    const active = refresh().filter((post) => ["active", "paused"].includes(post.status) && post.expiresOn);
    if (!active.length) return;
    const next = active.map((post) => new Date(`${post.expiresOn}T23:59:59.999`))
      .filter((date) => !Number.isNaN(date.getTime())).sort((a,b)=>a-b)[0];
    if (!next) return;
    const delay = Math.max(1000, next.getTime() - Date.now() + 25);
    window.setTimeout(() => { refresh(); scheduleNextExpiry(); }, Math.min(delay, 2147483000));
  }
  function saveDraft(post) {
    const items = refresh();
    if (!post?.id) return { ok:false, error:"A piszkozat azonosítója hiányzik." };
    const existingIndex = items.findIndex((item) => item.id === String(post.id));
    if (existingIndex >= 0) {
      const existing = items[existingIndex];
      if (existing.status !== "draft") return { ok:false, error:"Közzétett hirdetés már nem szerkeszthető." };
      items[existingIndex] = { ...existing, ...post, status:"draft", updatedAt:new Date().toISOString() };
      if (!write(items)) return { ok:false, error:"A piszkozat mentése nem sikerült." };
      return { ok:true, post:items[existingIndex] };
    }
    const record = { ...post, status:"draft", createdAt:new Date().toISOString(), updatedAt:null };
    items.unshift(record);
    if (!write(items)) return { ok:false, error:"A piszkozat mentése nem sikerült." };
    return { ok:true, post:record };
  }
  function save(post) {
    const items = refresh();
    if (!post?.id || !String(post.title || "").trim() || !isValidExpiryDate(post?.expiresOn)) return { ok:false, error:"A hirdetés címe és érvényes lejárati dátuma kötelező." };
    if (isExpired(post)) return { ok:false, error:"A lejárati dátum nem lehet korábbi a mai napnál." };
    if (items.some((item) => item.id === String(post.id))) return { ok:false, error:"Ez a hirdetésazonosító már létezik." };
    const record = { ...post, title:String(post.title).trim(), status:"active", createdAt:new Date().toISOString(), publishedAt:new Date().toISOString(), closedAt:null };
    items.unshift(record);
    if (!write(items)) return { ok:false, error:"A hirdetés közzététele nem sikerült." };
    scheduleNextExpiry();
    return { ok:true, post:record };
  }
  function publishDraft(id, completePost = {}) {
    const items = refresh();
    const index = items.findIndex((post) => post.id === String(id));
    if (index < 0) return { ok:false, error:"A piszkozat nem található." };
    const current = items[index];
    if (current.status !== "draft") return { ok:false, error:"Csak piszkozat tehető közzé." };
    const next = { ...current, ...completePost, id:current.id, status:"active", publishedAt:new Date().toISOString(), updatedAt:new Date().toISOString() };
    if (!next.title || !isValidExpiryDate(next.expiresOn) || isExpired(next)) return { ok:false, error:"A közzétételhez töltsd ki a kötelező mezőket és adj meg érvényes határidőt." };
    items[index] = next;
    if (!write(items)) return { ok:false, error:"A hirdetés közzététele nem sikerült." };
    scheduleNextExpiry();
    return { ok:true, post:next };
  }
  function updateDraft(id, post) { return saveDraft({ ...post, id:String(id) }); }
  function get(id) { return refresh().find((post) => post.id === String(id)) || null; }
  function all({ includeClosed = false, includeDrafts = false, includePaused = false } = {}) {
    // A bemutatóhirdetések nem jelennek meg a valódi álláskeresőben és céges listákban.
    const items = refresh().filter((post) => !post.isDemoData);
    if (includeClosed) return items;
    return items.filter((post) => post.status === "active" || (includePaused && post.status === "paused") || (includeDrafts && post.status === "draft"));
  }
  function canApply(id) { return get(id)?.status === "active"; }
  function getApplicantCount(id) { return applicationRecordsFor(id).length; }
  function canDelete(id) { return getApplicantCount(id) === 0; }
  function deletePost(id) {
    const items = refresh();
    const post = items.find((item) => item.id === String(id));
    if (!post) return { ok:false, error:"A hirdetés nem található." };
    const applicantCount = getApplicantCount(id);
    if (applicantCount > 0) return { ok:false, error:`A hirdetés nem törölhető, mert ${applicantCount} jelentkezés tartozik hozzá.` };
    const next = items.filter((item) => item.id !== String(id));
    if (!write(next)) return { ok:false, error:"A hirdetést nem sikerült törölni." };
    return { ok:true, deletedId:String(id) };
  }
  function transition(id, nextStatus) {
    if (!["active", "paused", "closed"].includes(nextStatus)) return { ok:false, error:"Érvénytelen hirdetésállapot." };
    const items = refresh();
    const post = items.find((item) => item.id === String(id));
    if (!post) return { ok:false, error:"A hirdetés nem található." };
    const current = post.status;
    const previousTimestamps = { updatedAt: post.updatedAt || null, closedAt: post.closedAt || null, pausedAt: post.pausedAt || null, resumedAt: post.resumedAt || null };
    const allowed = (current === "active" && ["paused", "closed"].includes(nextStatus)) ||
      (current === "paused" && ["active", "closed"].includes(nextStatus));
    if (!allowed) return { ok:false, error:"Ebből az állapotból ez a művelet nem engedélyezett." };
    if (nextStatus === "active" && isExpired(post)) {
      post.status = "expired";
      post.expiredAt = new Date().toISOString();
      write(items);
      return { ok:false, error:"A hirdetés határideje lejárt, ezért nem aktiválható újra." };
    }
    const now = new Date().toISOString();
    post.status = nextStatus;
    post.updatedAt = now;
    if (nextStatus === "closed") post.closedAt = now;
    if (nextStatus === "active") post.resumedAt = now;
    if (nextStatus === "paused") post.pausedAt = now;
    let rejectedCount = 0;
    if (!write(items)) return { ok:false, error:"A hirdetés állapotát nem sikerült menteni." };
    if (nextStatus === "closed") {
      // A prototípusban a függő jelentkezések egyetlen mentéssel zárulnak le.
      // Az éles backendnek a hirdetés és a jelentkezések módosítását tranzakcióban kell végeznie,
      // az értesítéseket pedig transactional outboxból kell kézbesítenie.
      const applicationResult = window.GyakorStartApplicationStore?.rejectPendingForJob(id);
      if (applicationResult?.ok === false) {
        // Ha a helyi jelentkezésmentés hibázik, a hirdetés állapotát is visszaállítjuk.
        post.status = current;
        Object.entries(previousTimestamps).forEach(([key, value]) => {
          if (value === null) delete post[key];
          else post[key] = value;
        });
        write(items);
        return { ok:false, error:applicationResult.error || "A függő jelentkezések lezárása nem sikerült." };
      }
      rejectedCount = applicationResult?.rejectedCount || 0;
    }
    return { ok:true, post, rejectedCount };
  }
  window.GyakorStartJobPostings = {
    key:KEY, statuses:VALID_STATUSES.slice(), statusLabels:{ ...STATUS_LABELS },
    save, saveDraft, updateDraft, publishDraft, get, all, refresh, isExpired,
    canApply, canDelete, getApplicantCount, deletePost, transition, localDateString, isValidExpiryDate
  };
  refresh(); scheduleNextExpiry();
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { refresh(); scheduleNextExpiry(); } });
})();


/* ===== Közös megjelenítési formázók ===== */
(() => {
  "use strict";
  function parseHourlyRate(value) {
    if (typeof value === "number") return Number.isFinite(value) && value >= 0 ? value : null;
    const text = String(value ?? "").trim();
    if (!text) return null;
    const match = text.match(/\d[\d\s\u00a0]*(?:[,.]\d{1,2})?/);
    if (!match) return null;
    const normalized = match[0].replace(/[\s\u00a0]/g, "").replace(/\./g, "").replace(",", ".");
    const amount = Number(normalized);
    return Number.isFinite(amount) && amount >= 0 ? amount : null;
  }
  function formatHourlyRate(value) {
    const amount = parseHourlyRate(value);
    if (amount === null) {
      return { amountText: String(value || "Bér egyeztetés szerint").trim(), unitText: "", numericValue: null };
    }
    return {
      // Az en-US csoportosítást szóközös ezres tagolásra alakítjuk; ez a 4 számjegyű összegeket is csoportosítja.
      amountText: `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(amount).replace(/,/g, "\u00a0").replace(/\.(\d{1,2})$/, ",$1")} Ft`,
      unitText: "/ óra",
      numericValue: amount
    };
  }
  window.GyakorStartFormatters = { ...(window.GyakorStartFormatters || {}), parseHourlyRate, formatHourlyRate };
})();
