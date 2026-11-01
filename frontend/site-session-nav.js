(() => {
  const accountsKey = "gyakorstart.accounts.v1";
  const sessionKey = "gyakorstart.session.v1";
  let session = null;
  let accounts = [];

  try {
    session = JSON.parse(localStorage.getItem(sessionKey) || "null");
    accounts = JSON.parse(localStorage.getItem(accountsKey) || "[]");
  } catch {
    return;
  }

  const account = session && Array.isArray(accounts)
    ? accounts.find((item) => item.email === session.email)
    : null;
  if (!account) return;

  const nav = document.querySelector(".site-header .nav");
  const actions = document.querySelector(".site-header .auth-actions");
  if (!nav || !actions) return;

  if (account.role === "student") {
    nav.innerHTML = '<a href="jobs.html">Állások</a><a href="index.html#kinek-szol">Rólunk</a><a href="hallgatoi-profil.html#jelentkezeseim">Jelentkezéseim</a>';
    actions.innerHTML = '<a class="button button-primary" href="hallgatoi-profil.html">Saját profil</a><button class="button button-ghost session-logout" type="button">Kijelentkezés</button>';
  } else if (account.role === "company") {
    nav.innerHTML = '<a href="jobs.html">Állások</a><a href="ceges-profil.html">Céges nézet</a>';
    actions.innerHTML = '<a class="button button-primary" href="ceges-profil.html">Saját profil</a><button class="button button-ghost session-logout" type="button">Kijelentkezés</button>';
  } else {
    return;
  }

  actions.querySelector(".session-logout").addEventListener("click", () => {
    localStorage.removeItem(sessionKey);
    window.location.href = "index.html";
  });
})();
