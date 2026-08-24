(() => {
  "use strict";

  function isMobileReaderDevice() {
    const ua = navigator.userAgent || "";
    if (/Android.+Mobile|iPhone|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      return true;
    }
    if (/iPad|Tablet|Android(?!.*Mobile)/i.test(ua)) {
      return true;
    }
    if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) {
      return true;
    }
    return false;
  }

  if (!isMobileReaderDevice()) return;

  const html = document.documentElement;
  html.classList.add("rb-device-blocked");
  html.classList.remove("reader-login-locked", "pro-reader-locked");

  const notice = document.getElementById("readbarDeviceNotice");
  if (notice) {
    notice.hidden = false;
    notice.removeAttribute("hidden");
  }

  const memo = document.getElementById("memo");
  if (memo) {
    memo.setAttribute("aria-hidden", "true");
    memo.setAttribute("inert", "");
  }
})();
