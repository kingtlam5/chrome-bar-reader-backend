(() => {
  "use strict";

  const DEMO_USERNAME = "testing";
  const DEMO_PASSWORD = "testing";
  const LAUNCH_TICKET_KEY = "stealthProReader.launchTicket";
  const LAUNCH_TICKET_MS = 30000;
  const UNLOCK_MESSAGE = "stealth-pro-unlock";

  const form = document.getElementById("proReaderLoginForm");
  const usernameInput = document.getElementById("proReaderUsername");
  const passwordInput = document.getElementById("proReaderPassword");
  const errorEl = document.getElementById("proReaderLoginError");
  const gate = document.getElementById("proReaderGate");
  const memo = document.getElementById("memo");
  const standalone = document.body?.dataset.proLoginPage === "1";

  function showError(message) {
    if (!errorEl) return;
    errorEl.hidden = !message;
    errorEl.textContent = message || "";
  }

  function credentialsMatch(username, password) {
    return username === DEMO_USERNAME && password === DEMO_PASSWORD;
  }

  function readerUrl(fileName) {
    try {
      return new URL(fileName, window.location.href).href;
    } catch (error) {
      return fileName;
    }
  }

  function openProReaderWindow() {
    const url = readerUrl("reader-pro-version.html?popup=1");
    const width = Math.floor(window.screen.availWidth * 0.92);
    const height = Math.floor(window.screen.availHeight * 0.92);
    const left = Math.floor((window.screen.availWidth - width) / 2) + (window.screen.availLeft || 0);
    const top = Math.floor((window.screen.availHeight - height) / 2) + (window.screen.availTop || 0);
    const features = [
      "popup=yes",
      "location=no",
      "toolbar=no",
      "menubar=no",
      "status=no",
      "scrollbars=no",
      "resizable=yes",
      `width=${width}`,
      `height=${height}`,
      `left=${left}`,
      `top=${top}`
    ].join(",");
    return window.open(url, "StealthReaderWindow", features);
  }

  function issueLaunchTicket() {
    try {
      localStorage.setItem(LAUNCH_TICKET_KEY, String(Date.now()));
    } catch (error) {
      // Ignore quota errors in the demo environment.
    }
  }

  function consumeLaunchTicket() {
    try {
      const raw = localStorage.getItem(LAUNCH_TICKET_KEY);
      localStorage.removeItem(LAUNCH_TICKET_KEY);
      const issuedAt = Number(raw);
      return Number.isFinite(issuedAt) && Date.now() - issuedAt < LAUNCH_TICKET_MS;
    } catch (error) {
      return false;
    }
  }

  function bindLoginForm(onSuccess) {
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const username = (usernameInput?.value || "").trim();
      const password = passwordInput?.value || "";

      if (credentialsMatch(username, password)) {
        showError("");
        onSuccess();
        return;
      }

      showError("用戶名稱或密碼不正確。");
      passwordInput?.focus();
      passwordInput?.select();
    });
  }

  if (standalone) {
    bindLoginForm(() => {
      issueLaunchTicket();
      const reader = openProReaderWindow();
      if (!reader) {
        window.location.assign(readerUrl("reader-pro-version.html?popup=1"));
        return;
      }
      reader.focus();
      window.close();
    });
    window.requestAnimationFrame(() => {
      usernameInput?.focus();
    });
    return;
  }

  if (!gate || !form) return;

  function isLocked() {
    return Boolean(gate.open) || !gate.hidden;
  }

  function setLocked(locked) {
    document.documentElement.classList.toggle("pro-reader-locked", locked);
    if (locked) {
      gate.hidden = false;
      if (typeof gate.showModal === "function") {
        if (!gate.open) {
          try {
            gate.showModal();
          } catch (error) {
            gate.setAttribute("open", "");
          }
        }
      } else {
        gate.removeAttribute("hidden");
      }
      memo?.setAttribute("aria-hidden", "true");
      memo?.setAttribute("inert", "");
    } else {
      if (typeof gate.close === "function" && gate.open) {
        gate.close();
      }
      gate.hidden = true;
      memo?.removeAttribute("aria-hidden");
      memo?.removeAttribute("inert");
    }
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

  gate.addEventListener("cancel", (event) => {
    event.preventDefault();
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

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return;
    if (event.data?.type === UNLOCK_MESSAGE) {
      setLocked(false);
    }
  });

  bindLoginForm(() => {
    setLocked(false);
  });

  if (consumeLaunchTicket()) {
    setLocked(false);
  } else {
    setLocked(true);
    window.requestAnimationFrame(() => {
      usernameInput?.focus();
    });
  }
})();
