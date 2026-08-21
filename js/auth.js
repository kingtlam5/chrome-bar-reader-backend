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
      window.location.replace(auth.plan === "pro" ? "dashboard-pro-version.html" : "dashboard-free-version.html");
      return;
    }
  }

  const auth = getAuth();
  if (auth) {
    document.querySelectorAll("[data-member-email]").forEach((el) => {
      el.textContent = auth.email || "user@example.com";
    });
    document.querySelectorAll("[data-member-username]").forEach((el) => {
      el.textContent = usernameOf(auth);
    });
    document.querySelectorAll("[data-member-plan-label]").forEach((el) => {
      el.textContent = planLabelOf(auth);
    });
    document.querySelectorAll("[data-next-payment]").forEach((el) => {
      el.textContent = nextPaymentLabelOf(auth);
    });
  }

  function usernameOf(member) {
    if (member.username) return member.username;
    const email = member.email || "";
    const at = email.indexOf("@");
    if (at > 0) return email.slice(0, at);
    return email || "testing";
  }

  function planLabelOf(member) {
    if (member.plan === "pro") return "Pro 計劃（每月 $2.99，自動續訂）";
    return "免費計劃";
  }

  function nextPaymentLabelOf(member) {
    if (member.plan !== "pro") return "不適用";
    const source = member.nextPaymentAt ? new Date(member.nextPaymentAt) : addOneMonth(new Date());
    if (Number.isNaN(source.getTime())) return "不適用";
    return `${source.getFullYear()}年${source.getMonth() + 1}月${source.getDate()}日`;
  }

  function addOneMonth(date) {
    const next = new Date(date.getTime());
    next.setMonth(next.getMonth() + 1);
    return next;
  }

  document.addEventListener("click", (event) => {
    const logout = event.target.closest("[data-logout]");
    if (!logout) return;
    event.preventDefault();
    clearAuth();
    window.location.href = "login.html";
  });
})();
