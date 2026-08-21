(() => {
  "use strict";

  const nav = document.getElementById("siteNav");
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const demoButtons = document.querySelectorAll("[data-demo-launch]");

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
      "/reader-pro-version.html?popup=1",
      "StealthReaderWindow",
      `popup=1,width=${width},height=${height},top=${top},left=${left},scrollbars=no,resizable=yes`
    );

    if (!popup) {
      window.location.href = "reader-pro-version.html?popup=1";
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

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
