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

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    window.StealthAuth?.set({ email: emailFromForm(), plan: "free" });
    window.location.href = "dashboard-free-version.html";
  });

  previewFree?.addEventListener("click", () => {
    window.StealthAuth?.set({ email: emailFromForm(), plan: "free" });
  });

  previewPro?.addEventListener("click", () => {
    window.StealthAuth?.set({ email: emailFromForm(), plan: "pro" });
  });
})();
