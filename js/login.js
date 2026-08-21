(() => {
  "use strict";

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("loginEmail");
  const registerLink = document.getElementById("registerLink");
  const proLink = document.getElementById("proLoginLink");

  function emailFromForm() {
    const value = (emailInput?.value || "").trim();
    return value || "user@example.com";
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    window.StealthAuth?.set({ email: emailFromForm(), plan: "free" });
    window.location.href = "free.html";
  });

  registerLink?.addEventListener("click", () => {
    window.StealthAuth?.set({ email: emailFromForm(), plan: "free" });
  });

  proLink?.addEventListener("click", () => {
    window.StealthAuth?.set({ email: emailFromForm(), plan: "pro" });
  });
})();
