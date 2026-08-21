(() => {
  "use strict";

  const INSTALLED_KEY = "stealthReader.pwaInstalled";

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  window.addEventListener("appinstalled", () => {
    try {
      localStorage.setItem(INSTALLED_KEY, "1");
    } catch (error) {
      // Ignore quota errors in the demo environment.
    }
    document.documentElement.dataset.pwaInstalled = "1";
    window.dispatchEvent(new Event("stealth-pwa-installed"));
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    window.StealthPwaInstall = event;
    window.dispatchEvent(new Event("stealth-pwa-install-ready"));
  });

  window.StealthPwa = {
    isStandalone() {
      return window.matchMedia("(display-mode: standalone)").matches
        || window.matchMedia("(display-mode: minimal-ui)").matches
        || window.matchMedia("(display-mode: window-controls-overlay)").matches
        || window.navigator.standalone === true;
    },
    isInstalled() {
      if (this.isStandalone()) return true;
      try {
        return localStorage.getItem(INSTALLED_KEY) === "1";
      } catch (error) {
        return false;
      }
    },
    async promptInstall() {
      const deferred = window.StealthPwaInstall;
      if (!deferred) return false;
      deferred.prompt();
      const choice = await deferred.userChoice;
      window.StealthPwaInstall = null;
      return choice.outcome === "accepted";
    }
  };
})();
