(() => {
  "use strict";

  const DEMO_USERNAME = "testing";
  const DEMO_PASSWORD = "testing";

  const gate = document.getElementById("proReaderGate");
  const form = document.getElementById("proReaderLoginForm");
  const usernameInput = document.getElementById("proReaderUsername");
  const passwordInput = document.getElementById("proReaderPassword");
  const errorEl = document.getElementById("proReaderLoginError");
  const memo = document.getElementById("memo");

  if (!gate || !form) return;

  function isLocked() {
    return !gate.hidden;
  }

  function setLocked(locked) {
    document.documentElement.classList.toggle("pro-reader-locked", locked);
    gate.hidden = !locked;
    if (memo) {
      if (locked) {
        memo.setAttribute("aria-hidden", "true");
        memo.setAttribute("inert", "");
      } else {
        memo.removeAttribute("aria-hidden");
        memo.removeAttribute("inert");
      }
    }
  }

  function showError(message) {
    if (!errorEl) return;
    errorEl.hidden = !message;
    errorEl.textContent = message || "";
  }

  function isInsideGate(target) {
    return Boolean(target && gate.contains(target));
  }

  function blockReaderWhileLocked(event) {
    if (!isLocked()) return;
    if (isInsideGate(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  ["keydown", "keyup", "keypress", "wheel", "mousedown", "pointerdown"].forEach((type) => {
    document.addEventListener(type, blockReaderWhileLocked, true);
  });

  gate.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = [...gate.querySelectorAll("input, button")];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = (usernameInput?.value || "").trim();
    const password = passwordInput?.value || "";

    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      showError("");
      setLocked(false);
      return;
    }

    showError("用戶名稱或密碼不正確。");
    passwordInput?.focus();
    passwordInput?.select();
  });

  setLocked(true);
  window.requestAnimationFrame(() => {
    usernameInput?.focus();
  });
})();
