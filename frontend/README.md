# GyakorStart – frontend prototípus

A projekt hallgatói és céges felületet, álláskeresést, hirdetésrészletezést és jelentkezéskezelést tartalmaz. A közös törzsadatok és a prototípus helyi adatkezelése a `shared-data.js` fájlban található; nincs külön JSON-adat- vagy konfigurációs fájl.

## Fájlok

- `index.html`, `script.js` – kezdőlap és bejelentkezési/regisztrációs felület.
- `hallgatoi-profil.html`, `student-applications.js` – hallgatói profil és jelentkezések, kattintható jelentkezési részletek és idővonal.
- `ceges-profil.html`, `company.js` – céges profil, hirdetésfeladás, jelentkezők kezelése és státuszváltás.
- `jobs.html`, `jobs.js` – álláshirdetések listája és keresése.
- `job.html`, `job-detail.js` – álláshirdetés részletei és jelentkezés.
- `shared-data.js` – közös nyelv-, szak- és félévlista, valamint a helyi jelentkezés- és hirdetéskezelés.
- `profile-session.js`, `site-session-nav.js` – munkamenet és navigáció.
- `styles.css` – közös megjelenés.

## Közös adatok

A hallgatói és céges felület ugyanazokat a közös azonosítókat és listákat használja:

- Nyelvek: angol, német, magyar, francia, spanyol, olasz, orosz, kínai, japán és szlovák.
- Szakok: központi, választható szaklista.
- Félévek: 1–6. félév, valamint 7. vagy magasabb félév.

A `shared-data.js` egy helyen kezeli a prototípus álláshirdetéseit, jelentkezéseit és a közös törzsadatokat. A hallgatói profil és a céges hirdetésfeladás ugyanazt a CEFR-skálát használja mind a nyelvtudás, mind az opcionális nyelvvizsga fokozatának megadásakor: `A1`, `A2`, `B1`, `B2`, `C1`, `C2`. A választómezőkben kizárólag ezek a szintkódok jelennek meg, magyarázó megnevezés nélkül. A korábbi, szöveges szintek és belső azonosítók betöltéskor a megfelelő új szintkódra normalizálódnak.

## Céges bemutatóadatok

A céges felület `prototype` módban, bejelentkezett céges fióknál automatikusan biztosít három bemutatóhirdetést és a hozzájuk tartozó jelentkezőket. A hiányzó bemutatóelemeket akkor is pótolja, ha a fiókban már van saját hirdetés; a bemutatóhirdetések külön „Bemutatóadat” jelölést kapnak. Így kipróbálható a jelentkezőkezelés, az interjúra hívás, az elutasítás, valamint a hirdetés szüneteltetése és lezárása. `server` módban a rendszer nem hoz létre bemutatóadatokat: ilyenkor kizárólag a backend által visszaadott hirdetések jelennek meg.

## Hirdetésfeladás és lejárat

A céges hirdetésfeladáskor kötelező jelentkezési határidőt megadni. A határidő a kiválasztott nap végén, helyi idő szerint 23:59:59.999-kor jár le. A lejárat ellenőrzése oldalbetöltéskor, a böngészőlapra visszatéréskor és a nyitva tartott oldalon időzítve is megtörténik. A lejárt hirdetés nem fogad új jelentkezést, és az aktív álláslistából kikerül.

A `job.html` részletező oldal a céges űrlapon megadott adatokat követi: pozíció, vállalat, helyszín, munkavégzési mód, határidő, tanulmányi feltételek, nyelvi követelmények, munkaidő, díjazás, feladatok és szakmai elvárások. A régi bemutatóhirdetésekhez nem rendelünk kitalált lejárati dátumot.

## Jelentkezések és idővonal

A hallgatói jelentkezések külön kártyákon láthatók. A részletező ablakban megjelenik a teljes kiválasztási idővonal és az eredeti hirdetés megnyitására szolgáló hivatkozás. Az idővonal a jelentkezés beérkezését, az elbírálást, az interjúmeghívást és a végső döntést mutatja; a korábbi lépések teljesültek, az aktuális fázis kiemelt, a későbbi lépések még hátravannak.

A céges oldalon három jelentkezői kategória van: új jelentkezők, interjúra hívottak és lezárt (elutasított) jelentkezések. Az állapotváltozások és az eseménytörténet a közös jelentkezési rekordban tárolódnak.

## Interjúra hívás – státuszváltás

A céges jelentkezőlistában az új jelentkező mellett egyetlen „Interjúra hívás” gomb található. Kattintáskor a jelentkezés státusza `interview` értékre változik, és a hallgató jelentkezési idővonalához „Interjúra hívtak” esemény kerül. Nincs külön interjúütemező modul, megerősítő ablak, dátum- vagy helyszínrögzítés, e-mail-küldés vagy külön meghívóablak. A HR-munkatárs telefonon vagy saját e-mailben, a rendszeren kívül egyeztet a hallgatóval.

Prototípus módban a státuszváltozás a `shared-data.js` helyi jelentkezési tárában rögzül, és ugyanabban a böngészőben azonnal megjelenik a hallgatói idővonalon. Szerver módban a céges frontend a `PATCH /api/applications/{applicationId}/status` végpontot hívja meg a `{ "status": "interview", "message": "..." }` adattal. A backend a hitelesített céges munkamenet alapján ellenőrizze a jogosultságot, mentse az új státuszt és a hozzá tartozó idővonal-eseményt. A hallgatói felület a `GET /api/applications/me` végpont frissítésével jeleníti meg az új eseményt. Ez a művelet nem küld e-mailt és nem kezel interjúidőpontot.

## Futtatás

A frontend mappájában indíts helyi webszervert:

```bash
python3 -m http.server 8000
```

Ezután nyisd meg a `http://localhost:8000/index.html` címet.

## Prototípus-korlátok

A frontend jelenleg `localStorage`-ot használ. A céges és hallgatói felület adatainak szinkronja ezért csak ugyanabban a böngészőprofilban működik. Az e-mail-értesítések nem működnek, és a hirdetések határidő miatti lezárása sem fut szerveroldali háttérfolyamatként. Valódi, különböző felhasználók és eszközök közötti működéshez backend, SQL Server-adatbázis, szerveroldali jogosultság-ellenőrzés és ütemezett lejáratkezelés szükséges.

## Backend-integráció előkészítése

Az állásrészletező oldalon a jelentkezés a `POST /api/applications` végpontra kerül. Az alapértelmezett API-alapcím a `job.html` `meta[name="api-base-url"]` elemében található (`/api`); külön backendcímen futó szervernél ezt az értéket kell módosítani.

A kérés JSON-törzse:

```json
{
  "studentId": "<bejelentkezett hallgató azonosítója>",
  "jobId": "<álláshirdetés azonosítója>",
  "note": "<hallgatói bemutatkozás / jelentkezési üzenet>"
}
```

A kérés cookie-alapú munkamenetet továbbít (`credentials: include`). A backendnek a munkamenetből is ellenőriznie kell a hallgató személyazonosságát és a kért `studentId` jogosultságát; a kliens által küldött azonosító önmagában nem tekinthető hitelesnek. Duplikált jelentkezésre célszerű `409 Conflict`, sikeres létrehozásra pedig `201 Created` választ adni.

A sikeres válasz JSON-ja legalább az új jelentkezés azonosítóját tartalmazza, például:

```json
{
  "application": {
    "id": "<szerver által kiosztott jelentkezésazonosító>",
    "appliedAt": "2026-10-31T18:00:00Z",
    "status": "new"
  }
}
```

Sikeres válasz után a frontend a szerver által kiosztott azonosítóval frissíti a helyi jelentkezési gyorsítótárat, amely eseményt küld a hallgatói jelentkezéslista újrarendereléséhez. A nyitott backend nélküli prototípusban a kérés sikertelen lesz, és a felület hibaüzenetet mutat; nem jelenít meg hamis sikeres jelentkezést.

## Nyelvi követelmények és díjazás

A hirdetések nyelvi feltételei strukturált rekordok: nyelvazonosító és -név, minimum beszédkészségi szint, kötelező/előnyt jelentő jelleg, valamint opcionális nyelvvizsga-követelmény és szint. A hirdetés részletező oldala minden nyelvet külön kártyán jelenít meg. A hirdetésfeladásnál minden hozzáadott nyelvhez kötelező a beszédkészségi szint; bejelölt nyelvvizsga esetén a vizsgaszint is kötelező. Ha nincs nyelvi elvárás, a nyelvi szekció nem jelenik meg.

Az órabér formázását a `shared-data.js` közös `GyakorStartFormatters.formatHourlyRate()` függvénye végzi. Az álláslistában és a hirdetésrészletező oldalon is ez adja az ezres tagolású forintösszeget és a külön megjelenő `/ óra` mértékegységet.

## Hirdetések életciklusa

A céges felületen a saját hirdetések állapotai:

- `draft` / Piszkozat: közzététel előtt szerkeszthető; a hallgatók nem látják és nem jelentkezhetnek rá. A piszkozat menthető részlegesen, később folytatható és közzétehető.
- `active` / Aktív: közzétett, jelentkezést fogad; a közzététel után a feltételei nem szerkeszthetők.
- `paused` / Szüneteltetett: nem jelenik meg az aktív álláslistában és nem fogad új jelentkezést; a határidő lejárta előtt újraaktiválható.
- `closed` / Lezárt: végleges állapot, nem aktiválható újra. A korábbi jelentkezések és interjúelőzmények a céges felületen tovább kezelhetők.
- `expired` / Lejárt: a határidő napjának végén automatikusan beálló végleges állapot.

Hirdetés bármely állapotban csak akkor törölhető, ha még egyetlen jelentkezés sem tartozik hozzá. Ha akár egy jelentkezés is érkezett, a törlés gomb tiltott; a hirdetés szüneteltethető vagy véglegesen lezárható, a jelentkezési és interjúelőzmények megőrzésével. A piszkozat törölhető, ha nincs hozzá jelentkezés. Közzétett hirdetés tartalma nem szerkeszthető.

A helyi prototípusban a végleges lezárás a hirdetéshez tartozó összes `new` / elbírálás alatt álló jelentkezést egyetlen mentéssel `rejected` állapotra váltja, és mindegyik hallgatói idővonalhoz lezáró eseményt ad. Az interjúra hívott és már elutasított jelentkezések változatlanul megmaradnak. A lezárásról valódi e-mail vagy több eszköz közötti értesítés még nem történik: ehhez a backend tranzakciós értesítési folyamata szükséges.

## Hirdetés-életciklus backend API-szerződés

A céges oldal alapértelmezetten prototípus módban fut (`ceges-profil.html`, `meta[name="api-mode"] = prototype`). Ha a backend végpontok elkészültek, az érték `server`-re állítható. Ebben a módban a hirdetéslistázás és a hirdetéskezelő műveletek a `/api` alapcímen lévő API-t hívják (`meta[name="api-base-url"]`). A szerver a hitelesített céges munkamenetből ellenőrizze a hirdetés tulajdonosát; a kliens által küldött `ownerAccountId` nem megbízható jogosultsági bizonyíték.

Szükséges végpontok:

- `GET /api/company/jobs` – a bejelentkezett cég saját hirdetései, állapotuk, `applicantCount` mezőjük és a jelentkezők teljes listája (`applications` tömb, státusszal és a megjelenítéshez szükséges hallgatói adatokkal). A törlés frontendoldali engedélyezéséhez megbízható jelentkezőszám szükséges; ha ez hiányzik, a törlés tiltva marad.
- `GET /api/applications/me` – a bejelentkezett hallgató összes saját jelentkezése, aktuális státusza és teljes eseménytörténete. A hallgatói profil `server` módban betöltéskor és visszatéréskor frissíti a listát ebből a végpontból.
- `POST /api/company/jobs` – új piszkozat (`status: DRAFT`) vagy új, teljesen validált hirdetés (`status: ACTIVE`) létrehozása.
- `PUT /api/company/jobs/:id` – csak `DRAFT` állapotú, a bejelentkezett céghez tartozó hirdetés módosítása.
- `POST /api/company/jobs/:id/publish` – piszkozat validálása és közzététele (`DRAFT` → `ACTIVE`).
- `PATCH /api/company/jobs/:id/status` – csak az engedélyezett átmenetek: `ACTIVE` → `PAUSED` vagy `CLOSED`; `PAUSED` → `ACTIVE` vagy `CLOSED`.
- `DELETE /api/company/jobs/:id` – csak akkor törölhet, ha a hirdetéshez nincs jelentkezés; ellenkező esetben `409 Conflict` választ adjon.

A `PATCH .../status` végpont `CLOSED` kérésnél egyetlen adatbázis-tranzakcióban végezze el a következőket: ellenőrizze a cég tulajdonjogát és a megengedett állapotát; állítsa a hirdetést `CLOSED` állapotba; az adott hirdetés minden `PENDING` / `NEW` jelentkezését állítsa `REJECTED` státuszra; hozzon létre minden érintett jelentkezéshez státusztörténeti sort és értesítési rekordot vagy transactional outbox bejegyzést; majd commitoljon. Az értesítésküldő worker a commit után küldje ki az in-app és e-mail értesítéseket. A backend válasza tartalmazza a frissített hirdetést és a lezárt jelentkezések számát, például `{"job":{"id":"...","status":"CLOSED"},"rejectedApplicationsCount":3}`.

A törlési végpontnál a jelentkezés-létezés ellenőrzése és a törlés ugyanabban a tranzakcióban történjen (vagy adatbázis oldali megszorítás védje), hogy párhuzamos jelentkezés ne okozhasson adatvesztést. Lezárt és lejárt hirdetés soha ne aktiválható újra. A határidő szerveroldali ütemezett feladatban is ellenőrizendő; a böngésző időzítője önmagában nem garantál automatikus lezárást.

A frontend `prototype` módban a státuszváltások és a függőben lévő jelentkezések lezárása ugyanabban a böngészőprofilban tárolódik. A `server` mód a céges hirdetéskezelő műveleteihez és a hallgatói saját jelentkezések lekérdezéséhez tartalmaz API-klienst; éles bekapcsolás előtt a fenti végpontok mellett a nyilvános `GET /api/jobs` álláslista és `GET /api/jobs/:id` hirdetésrészletező kiszolgálást is a backendhez kell kapcsolni. Éles használathoz a szerveroldali jogosultság-ellenőrzés, tranzakció/értesítés és határidő-ütemezés megvalósítása együtt szükséges. A `server` módot csak ezek elkészülte után állítsd át mind a céges, mind a hallgatói HTML-oldalon.


## Egyezési százalék

A céges jelentkezőlistán és a jelentkező adatlapján az egyezési százalék a megtekintett hirdetés és a hallgató ismert profiladatai alapján számolódik. A pontozási területek: tanulmányok (25%), kötelező nyelvi feltételek (25%), szakmai készségek (30%), munkaidő és munkavégzési mód (20%). Csak értékelhető, mindkét oldalon megadott területek kerülnek a százalék nevezőjébe; a hiányzó adatot a rendszer külön jelzi, nem tekinti automatikusan teljesítettnek. A kötelező feltételek részletesen, a százaléktól függetlenül is láthatók. A százalék tájékoztató illeszkedési mutató, nem automatikus kiválasztási döntés. A céges jelentkezőlistában minden jelöltnél külön **Egyezés részletei** gomb nyitja meg a részletes értékelést: ugyanazt a százalékot, a teljesült feltételeket és a konkrét hiányokat/eltéréseket mutatja meg, mint a hallgatói állásrészletező. A céges nézetben a szövegek a hallgató profiljára hivatkoznak (például „Git-ismeret hiányzik Nagy Anna profiljából”), nem a hallgatót megszólító megfogalmazást használják. Az előnyként megjelölt adatok tájékoztató jellegűek, ezeket a rendszer nem számolja kötelező hiányosságnak.

## Hallgatói tesztprofilok és egyezésvizsgálat

A prototípus módban a frontend 6 fiktív, előre kitöltött hallgatói tesztfiókot hoz létre a böngésző `localStorage` tárában. A profilok a céges mintajelentkezők neveihez kapcsolódnak, így a céges jelentkező-adatlap és a hallgatói állásrészletező ugyanazokat a profiladatokat használja. A tesztprofilok nem valódi személyek és nem tartalmaznak valódi elérhetőséget.

**Minden tesztfiók közös jelszava:** `GyakorStart2026!`

| Teszthallgató | Belépési e-mail-cím | Tesztelési szerep |
| Nagy Anna | anna.nagy@example.test | Magas egyezésű minta |
| Kiss Bence | bence.kiss@example.test | Részleges egyezés |
| Lakatos Lili | lili.lakatos@example.test | Hiányzó szakmai készségek és meglévő jelentkezések |
| Varga Marcell | marcell.varga@example.test | Nyelvi feltételek eltérése |
| Farkas Kata | kata.farkas@example.test | Szakmai készségek összehasonlítása |
| Papp Alex | alex.papp@example.test | IT support profil és készségek |

### Céges tesztfiók

| Adat | Belépési érték |
|---|---|
| Cégnév | TechNova Solutions Kft. |
| E-mail-cím | `ceg.teszt@gyakorstart.example.test` |
| Jelszó | `GyakorStart2026!` |

A céges tesztfiók a helyi prototípusban automatikusan létrejön. Bejelentkezés után a céges felületre irányít; a fiókkal új teszthirdetés hozható létre. A fiókhoz nem rendelünk hozzá más cégek bemutatóhirdetéseit vagy jelentkezéseit.

A teszteléshez indítsd el a frontend helyi webszerverét, majd az `index.html` oldalon jelentkezz be a fenti hallgatói vagy céges fiókok egyikével. Nyisd meg az Állások oldalt, majd egy állás részleteit: a hallgató a saját, kitöltött profilja alapján látja az egyezési százalékot és a részletes feltételeket. Másik tesztprofil kipróbálásához jelentkezz ki, majd lépj be egy másik e-mail-címmel.

A korábbi 14 fős tesztkészletből a már nem használt nyolc, demóként jelölt hallgatói fiókot a következő betöltéskor a rendszer eltávolítja. A hat megtartott hallgatói tesztprofil és a céges tesztfiók meglévő, kézzel módosított adatait nem írja felül. A korábbi jelentkezési rekordok és státusztörténetek külön tárhelyen vannak, ezeket a tesztadat-migráció nem törli és nem módosítja. A mintaadatok nem írják felül a már meglévő valódi fiókokat. A tesztfiókok profiljának kézi módosításai a böngészőben maradnak, és újratöltéskor nem állnak vissza automatikusan. A tesztfiókok csak `prototype` módban jönnek létre; `server` API-módban a seedelés leáll.
