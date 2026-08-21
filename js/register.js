(() => {
  "use strict";

  const PENDING_KEY = "stealthReader.pendingSignup";
  const form = document.getElementById("registerForm");
  const nameInput = document.getElementById("registerName");
  const emailInput = document.getElementById("registerEmail");
  const freeBtn = document.getElementById("registerFreeBtn");
  const payBtn = document.getElementById("registerPayBtn");
  const planInputs = Array.from(document.querySelectorAll('input[name="plan"]'));

  function selectedPlan() {
    return planInputs.find((input) => input.checked)?.value === "pro" ? "pro" : "free";
  }

  function updateCta() {
    const isPro = selectedPlan() === "pro";
    if (freeBtn) freeBtn.hidden = isPro;
    if (payBtn) payBtn.hidden = !isPro;
  }

  function collectProfile() {
    return {
      name: (nameInput?.value || "").trim(),
      email: (emailInput?.value || "").trim(),
      plan: selectedPlan(),
      createdAt: Date.now()
    };
  }

  function savePendingSignup(profile) {
    // Placeholder until the member database is connected.
    // Do not persist the password in the browser.
    localStorage.setItem(PENDING_KEY, JSON.stringify(profile));
  }

  function preselectPlanFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const plan = (params.get("plan") || "").toLowerCase();
    if (plan !== "pro") return;
    const proInput = planInputs.find((input) => input.value === "pro");
    if (proInput) {
      proInput.checked = true;
      updateCta();
    }
  }

  planInputs.forEach((input) => {
    input.addEventListener("change", updateCta);
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (selectedPlan() !== "free") return;
    if (!form.reportValidity()) return;

    const profile = collectProfile();
    // TODO: POST name / email / password to the member database, then sign in.
    savePendingSignup(profile);
    window.StealthAuth?.set({
      email: profile.email,
      name: profile.name,
      plan: "free"
    });
    window.location.href = "dashboard-free-version.html";
  });

  payBtn?.addEventListener("click", () => {
    if (!form?.reportValidity()) return;
    const profile = collectProfile();
    profile.plan = "pro";
    savePendingSignup(profile);
    // Placeholder payment gateway page. Replace with the real checkout URL later.
    window.location.href = "payment.html";
  });

  preselectPlanFromQuery();
  updateCta();
})();
