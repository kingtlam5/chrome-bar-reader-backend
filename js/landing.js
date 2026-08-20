(() => {
  "use strict";

  const nav = document.getElementById("siteNav");
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const demoButtons = document.querySelectorAll("[data-demo-launch]");
  const monthlyBtn = document.getElementById("billingMonthly");
  const lifetimeBtn = document.getElementById("billingLifetime");
  const proPrice = document.getElementById("proPrice");
  const proPeriod = document.getElementById("proPeriod");
  const proNote = document.getElementById("proNote");

  function onScroll() {
    if (!nav) return;
    const top = window.pageYOffset || document.documentElement.scrollTop || 0;
    nav.classList.toggle("nav-scrolled", top > 12);
  }

  function launchDemo() {
    const width = Math.floor(window.screen.width * 0.85);
    const height = Math.floor(window.screen.height * 0.85);
    const left = Math.floor((window.screen.width - width) / 2);
    const top = Math.floor((window.screen.height - height) / 2);

    const popup = window.open(
      "/reader.html",
      "StealthReaderWindow",
      `popup=1,width=${width},height=${height},top=${top},left=${left},scrollbars=no,resizable=yes`
    );

    if (!popup) {
      window.location.href = "reader.html";
    }
  }

  function setBilling(mode) {
    const isLifetime = mode === "lifetime";

    monthlyBtn?.setAttribute("aria-pressed", String(!isLifetime));
    lifetimeBtn?.setAttribute("aria-pressed", String(isLifetime));

    if (proPrice) proPrice.textContent = isLifetime ? "$19.99" : "$2.99";
    if (proPeriod) proPeriod.textContent = isLifetime ? "一次買斷" : "/ 月";
    if (proNote) {
      proNote.textContent = isLifetime
        ? "一次付款，永久解鎖所有偽裝主題、Panic Button 與雲端同步。"
        : "可隨時改為 $19.99 買斷。解鎖所有偽裝主題、Panic Button 與雲端同步。";
    }
  }

  menuBtn?.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    mobileMenu?.classList.toggle("hidden");
  });

  demoButtons.forEach((button) => {
    button.addEventListener("click", launchDemo);
  });

  monthlyBtn?.addEventListener("click", () => setBilling("monthly"));
  lifetimeBtn?.addEventListener("click", () => setBilling("lifetime"));

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  setBilling("monthly");
})();
