(() => {
  "use strict";

  const root = document.querySelector("#student-application-list");
  const dialog = document.querySelector("#student-application-dialog");
  const dialogTitle = document.querySelector("#student-application-dialog-title");
  const dialogCompany = document.querySelector("#student-application-dialog-company");
  const dialogStatus = document.querySelector("#student-application-dialog-status");
  const dialogStatusCopy = document.querySelector("#student-application-dialog-status-copy");
  const dialogApplied = document.querySelector("#student-application-dialog-applied");
  const dialogTimeline = document.querySelector("#student-application-dialog-timeline");
  const dialogJobLink = document.querySelector("#student-application-job-link");
  const closeButton = document.querySelector("#student-application-dialog-close");
  const store = window.GyakorStartApplicationStore;
  if (!root || !store || !dialog) return;

  const statusLabels = {
    new: "Elbírálás alatt",
    interview: "Interjúra hívva",
    rejected: "Elutasítva"
  };

  const statusDescriptions = {
    new: "A jelentkezésed beérkezett. A cég elbírálja, és itt követheted a további változásokat.",
    interview: "A cég interjúra hívott. A további egyeztetést közvetlenül a vállalat HR-munkatársa végzi.",
    rejected: "A kiválasztás lezárult. A korábbi eseményeket továbbra is visszanézheted."
  };

  let activeApplicationId = null;

  function getCurrentStudentId() {
    try {
      const session = JSON.parse(localStorage.getItem("gyakorstart.session.v1") || "null");
      const accounts = JSON.parse(localStorage.getItem("gyakorstart.accounts.v1") || "[]");
      if (!session || !Array.isArray(accounts)) return null;
      const account = accounts.find((item) => item.email === session.email);
      return account?.role === "student" ? account.id : null;
    } catch { return null; }
  }

  const currentStudentId = getCurrentStudentId();

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Dátum nem elérhető";
    return new Intl.DateTimeFormat("hu-HU", {
      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
    }).format(date);
  }

  function getJobUrl(application) {
    const jobId = String(application.jobId || "").trim();
    return jobId ? `job.html?id=${encodeURIComponent(jobId)}` : "jobs.html";
  }

  function renderTimelineItem({ state, type, title, message, at }) {
    const eventTimeLabel = type === "interview" ? "Státusz frissítve" : "Esemény rögzítve";
    return `
      <li class="application-timeline-item is-${state} event-${escapeHtml(type || "update")}">
        <span class="application-timeline-marker" aria-hidden="true"></span>
        <div class="application-timeline-copy">
          <div class="application-timeline-title-row">
            <strong>${escapeHtml(title)}</strong>
            ${at ? `<time datetime="${escapeHtml(at)}"><span class="application-timeline-time-label">${eventTimeLabel}</span><span>${escapeHtml(formatDate(at))}</span></time>` : ""}
          </div>
          ${message ? `<p>${escapeHtml(message)}</p>` : ""}
        </div>
      </li>`;
  }

  function renderTimeline(application) {
    const history = (Array.isArray(application.history) ? application.history : [])
      .slice()
      .sort((a, b) => new Date(a.at || 0) - new Date(b.at || 0));
    const status = store.normalizeStatus(application.status);
    const submitted = history.find((item) => item.type === "submitted");
    const interviewEvents = history.filter((item) => item.type === "interview");
    const rejectedEvents = history.filter((item) => item.type === "rejected");
    const reopenEvents = history.filter((item) => item.type === "reopened");
    const latestInterview = interviewEvents.at(-1) || null;
    const latestRejected = rejectedEvents.at(-1) || null;
    const latestReopen = reopenEvents.at(-1) || null;

    const interviewState = status === "interview"
      ? "current"
      : (status === "rejected" && latestInterview) || (status === "new" && latestInterview && latestReopen)
        ? "complete"
        : status === "rejected" ? "skipped" : "upcoming";

    const reviewMessage = status === "new"
      ? (latestReopen?.message || "A cég jelenleg áttekinti és értékeli a jelentkezésedet.")
      : "A cég áttekintette a jelentkezésedet, és továbblépett a kiválasztási folyamatban.";

    const stages = [
      {
        state: "complete",
        type: "submitted",
        title: "Jelentkezés beérkezett",
        message: "A jelentkezésed sikeresen beérkezett a vállalathoz.",
        at: submitted?.at || application.appliedAt
      },
      {
        state: status === "new" ? "current" : "complete",
        type: "review",
        title: status === "new" ? "Elbírálás alatt" : "Elbírálás megtörtént",
        message: reviewMessage,
        at: status === "new" && latestReopen ? latestReopen.at : ""
      },
      {
        state: interviewState,
        type: "interview",
        title: latestInterview ? "Interjúra hívtak" : (status === "rejected" ? "Interjúra hívás (nem történt)" : "Interjúra hívás"),
        message: latestInterview
          ? (latestInterview.message || "A vállalat interjúra hívott. A további egyeztetést közvetlenül a vállalat HR-munkatársa végzi.")
          : status === "rejected"
            ? "A kiválasztási folyamat interjú nélkül zárult le."
            : "Ha a cég interjúra hív, a státuszváltozás itt jelenik meg.",
        at: latestInterview?.at || ""
      },
      {
        state: status === "rejected" ? "current" : "upcoming",
        type: "decision",
        title: status === "rejected" ? "Kiválasztás lezárult" : "Végső döntés",
        message: status === "rejected"
          ? (latestRejected?.message || "A kiválasztás lezárult.")
          : "A cég döntése után itt jelenik meg a kiválasztás eredménye.",
        at: status === "rejected" ? (latestRejected?.at || "") : ""
      }
    ];

    return stages.map(renderTimelineItem).join("");
  }

  function renderApplication(application) {
    const status = store.normalizeStatus(application.status);
    const jobUrl = getJobUrl(application);
    return `
      <article class="student-application-card" data-application-id="${escapeHtml(application.id)}">
        <button class="student-application-open" type="button" data-open-application="${escapeHtml(application.id)}" aria-haspopup="dialog">
          <span class="student-application-main">
            <span class="job-logo ${escapeHtml(application.logoClass || "logo-mint")}" aria-hidden="true">${escapeHtml(application.logo || "GS")}</span>
            <span class="student-application-copy">
              <strong class="student-application-title">${escapeHtml(application.jobTitle)}</strong>
              <span class="student-application-company">${escapeHtml(application.company)} · ${escapeHtml(application.city)}</span>
              <span class="student-application-date">Jelentkezés: ${escapeHtml(formatDate(application.appliedAt))}</span>
            </span>
          </span>
          <span class="student-application-side">
            <span class="application-status ${status}">${escapeHtml(statusLabels[status])}</span>
            <span class="student-application-details-hint">Jelentkezés részletei <span aria-hidden="true">→</span></span>
          </span>
        </button>
        <div class="student-application-actions">
          <a class="student-application-job-link" href="${escapeHtml(jobUrl)}">Eredeti hirdetés megtekintése <span aria-hidden="true">↗</span></a>
        </div>
      </article>`;
  }

  function openApplication(applicationId) {
    const application = store.get(applicationId);
    if (!application) return;

    activeApplicationId = applicationId;
    const status = store.normalizeStatus(application.status);
    dialogTitle.textContent = application.jobTitle || "Jelentkezés részletei";
    dialogCompany.textContent = `${application.company || "Cég nincs megadva"}${application.city ? ` · ${application.city}` : ""}`;
    dialogStatus.textContent = statusLabels[status];
    dialogStatus.className = `application-status ${status}`;
    dialogStatusCopy.textContent = statusDescriptions[status];
    dialogApplied.textContent = `Jelentkezés: ${formatDate(application.appliedAt)}`;
    dialogTimeline.innerHTML = renderTimeline(application) || '<li class="application-timeline-empty">Ehhez a jelentkezéshez még nincs rögzített esemény.</li>';
    dialogJobLink.href = getJobUrl(application);
    dialogJobLink.hidden = !application.jobId;

    if (!dialog.open) dialog.showModal();
  }

  const apiBaseUrl = (document.querySelector('meta[name="api-base-url"]')?.content || "/api").replace(/\/$/, "");
  const apiMode = document.querySelector('meta[name="api-mode"]')?.content || "prototype";

  async function refreshStudentApplicationsFromServer() {
    if (apiMode !== "server" || !currentStudentId) return;
    try {
      const response = await fetch(`${apiBaseUrl}/applications/me`, {
        method:"GET", credentials:"include", headers:{ "Accept":"application/json" }
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.message || "A jelentkezéseket nem sikerült frissíteni.");
      const applications = Array.isArray(payload?.applications) ? payload.applications : [];
      const result = store.syncFromServer(applications, currentStudentId);
      if (!result.ok) throw new Error(result.error || "A jelentkezések frissítése nem sikerült.");
    } catch (error) {
      console.warn("A szerveroldali jelentkezések frissítése nem sikerült.", error);
    }
  }

  function render() {
    const applications = store.getForStudent(currentStudentId);
    root.innerHTML = applications.length
      ? applications.map(renderApplication).join("")
      : '<div class="application-empty-state"><span class="empty-state-icon" aria-hidden="true">▤</span><strong>Még nem jelentkeztél sehova</strong><span>Böngéssz a gyakornoki lehetőségek között, és add le az első jelentkezésedet.</span><a class="button button-primary" href="jobs.html">Állások böngészése</a></div>';

    if (dialog.open && activeApplicationId) openApplication(activeApplicationId);
  }

  root.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-open-application]");
    if (!trigger) return;
    openApplication(trigger.dataset.openApplication);
  });

  root.addEventListener("keydown", (event) => {
    const trigger = event.target.closest("[data-open-application]");
    if (!trigger || (event.key !== "Enter" && event.key !== " ")) return;
    if (trigger.tagName.toLowerCase() === "button") return;
    event.preventDefault();
    openApplication(trigger.dataset.openApplication);
  });

  closeButton?.addEventListener("click", () => dialog.close());
  document.querySelector("#student-application-dialog-close-secondary")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => { activeApplicationId = null; });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  window.addEventListener("gyakorstart:applications-changed", async () => {
    await refreshStudentApplicationsFromServer();
    render();
  });
  window.addEventListener("focus", refreshStudentApplicationsFromServer);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refreshStudentApplicationsFromServer(); });
  window.addEventListener("storage", (event) => {
    if (!event.key || event.key === store.storageKey) render();
  });
  render();
  refreshStudentApplicationsFromServer();
})();
