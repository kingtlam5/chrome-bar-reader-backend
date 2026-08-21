(() => {
  "use strict";

  const PENDING_KEY = "stealthReader.pendingSignup";
  const form = document.getElementById("registerForm");
  const nameInput = document.getElementById("registerName");
  const emailInput = document.getElementById("registerEmail");
  const freeWrap = document.getElementById("registerFreeWrap");
  const payWrap = document.getElementById("registerPayWrap");
  const payBtn = document.getElementById("registerPayBtn");
  const failModal = document.getElementById("registerFailModal");
  const planInputs = Array.from(document.querySelectorAll('input[name="plan"]'));

  function selectedPlan() {
    return planInputs.find((input) => input.checked)?.value === "pro" ? "pro" : "free";
  }

  function updateCta() {
    const isPro = selectedPlan() === "pro";
    freeWrap?.classList.toggle("hidden", isPro);
    payWrap?.classList.toggle("hidden", !isPro);
  }

  function collectProfile() {
    return {
      name: (nameInput?.value || "").trim(),
      email: (emailInput?.value || "").trim(),
      plan: selectedPlan(),
      createdAt: Date.now()
    };
  }

  function openFailModal() {
    failModal?.classList.remove("hidden");
  }

  function closeFailModal() {
    failModal?.classList.add("hidden");
  }

  function preselectPlanFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const plan = (params.get("plan") || "").toLowerCase();
    if (plan !== "pro") return;
    const proInput = planInputs.find((input) => input.value === "pro");
    if (proInput) {
      proInput.checked = true;
    }
  }

  planInputs.forEach((input) => {
    input.addEventListener("change", updateCta);
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (selectedPlan() !== "free") return;
    if (!form.reportValidity()) return;
    // No member API yet: do not send or store signup data.
    openFailModal();
  });

  payBtn?.addEventListener("click", () => {
    if (!form?.reportValidity()) return;
    const profile = collectProfile();
    profile.plan = "pro";
    localStorage.setItem(PENDING_KEY, JSON.stringify(profile));
    window.location.href = "payment.html";
  });

  failModal?.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-register-fail]")) {
      closeFailModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && failModal && !failModal.classList.contains("hidden")) {
      closeFailModal();
    }
  });

  preselectPlanFromQuery();
  updateCta();
})();
