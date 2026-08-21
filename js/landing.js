(() => {
  "use strict";

  const nav = document.getElementById("siteNav");
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  function onScroll() {
    if (!nav) return;
    const top = window.pageYOffset || document.documentElement.scrollTop || 0;
    nav.classList.toggle("nav-scrolled", top > 12);
  }

  menuBtn?.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    mobileMenu?.classList.toggle("hidden");
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
