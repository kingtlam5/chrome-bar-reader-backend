(() => {
  "use strict";

  const AUTH_KEY = "stealthReader.auth";

  function getAuth() {
    try {
      const raw = sessionStorage.getItem(AUTH_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.email || !parsed.plan) return null;
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function setAuth(data) {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(data));
  }

  function clearAuth() {
    sessionStorage.removeItem(AUTH_KEY);
  }

  window.StealthAuth = { get: getAuth, set: setAuth, clear: clearAuth };

  const required = document.body?.dataset.requirePlan;
  if (required) {
    const auth = getAuth();
    if (!auth) {
      window.location.replace("login.html");
      return;
    }
    if (auth.plan !== required) {
      window.location.replace(auth.plan === "pro" ? "dashboard.html" : "free.html");
      return;
    }
  }

  const auth = getAuth();
  if (auth?.email) {
    document.querySelectorAll("[data-member-email]").forEach((el) => {
      el.textContent = auth.email;
    });
  }

  document.addEventListener("click", (event) => {
    const logout = event.target.closest("[data-logout]");
    if (!logout) return;
    event.preventDefault();
    clearAuth();
    window.location.href = "login.html";
  });
})();
