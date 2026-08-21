(() => {
  "use strict";

  const buttons = document.querySelectorAll("[data-guide-plan]");
  const panels = {
    free: document.getElementById("guideFree"),
    pro: document.getElementById("guidePro")
  };

  function currentPlan() {
    const hash = (window.location.hash || "").replace("#", "").toLowerCase();
    if (hash === "free") return "free";
    if (hash === "pro" || hash === "chrome-app-shortcut") return "pro";
    const params = new URLSearchParams(window.location.search);
    const plan = (params.get("plan") || "").toLowerCase();
    return plan === "pro" ? "pro" : "free";
  }

  function showPlan(plan, scrollTarget) {
    const next = plan === "pro" ? "pro" : "free";
    Object.entries(panels).forEach(([name, panel]) => {
      panel?.classList.toggle("hidden", name !== next);
    });
    buttons.forEach((button) => {
      const active = button.getAttribute("data-guide-plan") === next;
      button.setAttribute("aria-pressed", String(active));
    });
    const hash = (window.location.hash || "").replace("#", "");
    if (!scrollTarget && hash !== next) {
      history.replaceState(null, "", `#${next}`);
    }
    if (scrollTarget) {
      document.getElementById(scrollTarget)?.scrollIntoView({ block: "start" });
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      showPlan(button.getAttribute("data-guide-plan"));
    });
  });

  function applyHash() {
    const hash = (window.location.hash || "").replace("#", "").toLowerCase();
    const plan = currentPlan();
    showPlan(plan, hash === "chrome-app-shortcut" ? "chrome-app-shortcut" : "");
  }

  window.addEventListener("hashchange", applyHash);
  applyHash();
})();
