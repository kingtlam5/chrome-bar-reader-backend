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
  const faqItems = document.querySelectorAll(".faq-item");

  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("nav-scrolled", window.scrollY > 12);
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

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  setBilling("monthly");

  let scrollAnimation = 0;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function getHeaderOffset() {
    return (nav?.offsetHeight || 72) + 12;
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function slideTo(target) {
    const destination = Math.max(
      0,
      target.getBoundingClientRect().top + window.scrollY - getHeaderOffset()
    );
    const start = window.scrollY;
    const distance = destination - start;

    if (Math.abs(distance) < 2 || prefersReducedMotion()) {
      window.scrollTo(0, destination);
      return;
    }

    const duration = Math.min(1100, Math.max(600, Math.abs(distance) * 0.5));
    const startTime = performance.now();
    cancelAnimationFrame(scrollAnimation);

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, start + distance * easeInOutCubic(progress));
      if (progress < 1) {
        scrollAnimation = requestAnimationFrame(tick);
      }
    }

    scrollAnimation = requestAnimationFrame(tick);
  }

  function closeMobileMenu() {
    if (!mobileMenu || mobileMenu.classList.contains("hidden")) return;
    mobileMenu.classList.add("hidden");
    menuBtn?.setAttribute("aria-expanded", "false");
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href")?.slice(1);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      closeMobileMenu();
      slideTo(target);
      history.pushState(null, "", `#${id}`);
    });
  });
})();
