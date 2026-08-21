(() => {
  "use strict";

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("loginEmail");
  const previewFree = document.getElementById("previewFreeLink");
  const previewPro = document.getElementById("previewProLink");

  function emailFromForm() {
    const value = (emailInput?.value || "").trim();
    return value || "user@example.com";
  }

  function usernameFromEmail(email) {
    const at = email.indexOf("@");
    return at > 0 ? email.slice(0, at) : email;
  }

  function memberProfile(plan) {
    const email = emailFromForm();
    const profile = {
      email,
      username: usernameFromEmail(email),
      plan
    };
    if (plan === "pro") {
      const next = new Date();
      next.setMonth(next.getMonth() + 1);
      profile.nextPaymentAt = next.toISOString();
    }
    return profile;
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    window.StealthAuth?.set(memberProfile("free"));
    window.location.href = "dashboard-free-version.html";
  });

  previewFree?.addEventListener("click", () => {
    window.StealthAuth?.set(memberProfile("free"));
  });

  previewPro?.addEventListener("click", () => {
    window.StealthAuth?.set(memberProfile("pro"));
  });
})();
