(() => {
  "use strict";

  const LINKS = {
    20: "https://buy.stripe.com/test_7sY14n8tc4klfAR1N55Rm00",
    50: "https://buy.stripe.com/test_6oU28rdNwcQR74l4Zh5Rm01",
    100: "https://buy.stripe.com/test_6oU9ATaBkeYZbkBgHZ5Rm02"
  };

  const modal = document.getElementById("tipModal");
  if (!modal) return;

  const chooseWrap = document.getElementById("tipChooseWrap");
  const thanksWrap = document.getElementById("tipThanksWrap");

  function showPanel(panel) {
    chooseWrap?.classList.toggle("hidden", panel !== "choose");
    thanksWrap?.classList.toggle("hidden", panel !== "thanks");
  }

  function openModal(panel) {
    showPanel(panel || "choose");
    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
    showPanel("choose");
  }

  document.querySelectorAll("[data-open-tip-modal]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openModal("choose");
    });
  });

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-tip-modal]")) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });

  modal.querySelectorAll("[data-tip-amount]").forEach((link) => {
    const amount = link.getAttribute("data-tip-amount");
    const href = LINKS[amount];
    if (href) link.href = href;
  });

  try {
    const params = new URLSearchParams(location.search);
    if (params.get("tip") === "ok") {
      openModal("thanks");
      params.delete("tip");
      const next = `${location.pathname}${params.toString() ? `?${params}` : ""}${location.hash}`;
      history.replaceState({}, "", next);
    }
  } catch (error) {
    // Ignore malformed query strings.
  }
})();
