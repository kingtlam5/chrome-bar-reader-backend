(() => {
  "use strict";

  const buttons = document.querySelectorAll("[data-guide-plan]");
  const panels = {
    free: document.getElementById("guideFree"),
    pro: document.getElementById("guidePro")
  };

  function currentPlan() {
    const hash = (window.location.hash || "").replace("#", "").toLowerCase();
    if (hash === "pro" || hash === "free") return hash;
    const params = new URLSearchParams(window.location.search);
    const plan = (params.get("plan") || "").toLowerCase();
    return plan === "pro" ? "pro" : "free";
  }

  function showPlan(plan) {
    const next = plan === "pro" ? "pro" : "free";
    Object.entries(panels).forEach(([name, panel]) => {
      panel?.classList.toggle("hidden", name !== next);
    });
    buttons.forEach((button) => {
      const active = button.getAttribute("data-guide-plan") === next;
      button.setAttribute("aria-pressed", String(active));
    });
    if (window.location.hash.replace("#", "") !== next) {
      history.replaceState(null, "", `#${next}`);
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      showPlan(button.getAttribute("data-guide-plan"));
    });
  });

  window.addEventListener("hashchange", () => showPlan(currentPlan()));
  showPlan(currentPlan());
})();
