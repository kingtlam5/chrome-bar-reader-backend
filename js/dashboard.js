(() => {
  "use strict";

  const STORAGE_KEY = document.body?.dataset.readerStorage || "stealthMemoReader.v1";
  const SETTINGS_KEY = "stealthMemoReader.settings.v1";
  const launchBtn = document.getElementById("launchReaderBtn");
  const bookNameEl = document.getElementById("currentBook");
  const progressEl = document.getElementById("currentProgress");
  const progressBarEl = document.getElementById("progressBar");
  const lastReadEl = document.getElementById("lastReadAt");
  const lockedControls = document.querySelectorAll("[data-locked]");
  const panicKeyInput = document.getElementById("panicKeyInput");

  function readerUrl(fileName) {
    try {
      return new URL(fileName, window.location.href).href;
    } catch (error) {
      return fileName;
    }
  }

  function launchReader() {
    const mode = launchBtn?.dataset.launchMode || "pro";

    if (mode === "basic") {
      const url = readerUrl("reader-free-version.html");
      const win = window.open(url, "_blank");
      if (!win) {
        window.location.assign(url);
      }
      return;
    }

    const width = Math.floor(window.screen.width * 0.85);
    const height = Math.floor(window.screen.height * 0.85);
    const left = Math.floor((window.screen.width - width) / 2);
    const top = Math.floor((window.screen.height - height) / 2);
    const url = readerUrl("reader-pro-version.html?popup=1");

    const popup = window.open(
      url,
      "StealthReaderWindow",
      `popup=1,width=${width},height=${height},top=${top},left=${left},scrollbars=no,resizable=yes`
    );

    if (!popup) {
      alert("無法開啟彈出視窗。請允許此網站的彈出視窗後再試。");
    }
  }

  function formatLastRead(timestamp) {
    if (!timestamp) return "今天 14:32";

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "今天 14:32";

    const now = new Date();
    const sameDay = date.toDateString() === now.toDateString();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    if (sameDay) return `今天 ${hours}:${minutes}`;
    return `${date.getMonth() + 1}/${date.getDate()} ${hours}:${minutes}`;
  }

  function formatKeyLabel(key) {
    if (!key || key === " " || key === "Space" || key === "Spacebar") return "Space";
    if (key === "Escape") return "Esc";
    return key.length === 1 ? key.toUpperCase() : key;
  }

  function loadSettings() {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") || {};
    } catch (error) {
      return {};
    }
  }

  function saveSettings(next) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  }

  function loadReadingCard() {
    const fallback = {
      fileName: "《三體》",
      percent: 67,
      lastRead: "今天 14:32"
    };

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || !Array.isArray(saved.s) || saved.s.length === 0) {
        return fallback;
      }

      const total = saved.s.length;
      const index = Math.min(Math.max(Number(saved.i) || 0, 0), total - 1);
      const percent = Math.round((index + 1) / total * 100);

      return {
        fileName: saved.n || "未命名文件",
        percent,
        lastRead: formatLastRead(saved.syncedAt || Date.now())
      };
    } catch (error) {
      return fallback;
    }
  }

  function renderReadingCard() {
    const data = loadReadingCard();

    if (bookNameEl) bookNameEl.textContent = data.fileName;
    if (progressEl) progressEl.textContent = `${data.percent}%`;
    if (lastReadEl) lastReadEl.textContent = data.lastRead;
    if (progressBarEl) {
      progressBarEl.style.setProperty("--progress", `${data.percent}%`);
      progressBarEl.setAttribute("aria-valuenow", String(data.percent));
    }
  }

  function renderPanicKey() {
    if (!panicKeyInput) return;
    const settings = loadSettings();
    const panic = settings.shortcuts?.panic || settings.panicKey || " ";
    panicKeyInput.value = formatKeyLabel(panic);
  }

  launchBtn?.addEventListener("click", launchReader);

  lockedControls.forEach((control) => {
    control.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "index.html#pricing";
    });
  });

  panicKeyInput?.addEventListener("keydown", (event) => {
    event.preventDefault();
    const settings = loadSettings();
    settings.panicKey = event.key;
    settings.shortcuts = { ...(settings.shortcuts || {}), panic: event.key };
    saveSettings(settings);
    panicKeyInput.value = formatKeyLabel(event.key);
  });

  renderReadingCard();
  renderPanicKey();
})();
