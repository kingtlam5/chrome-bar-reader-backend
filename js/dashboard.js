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

  function openProReaderWindow(url) {
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

    const url = readerUrl("reader-pro-version.html?popup=1");
    const popup = openProReaderWindow(url);
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
  initRequestModal();

  function initRequestModal() {
    const modal = document.getElementById("requestModal");
    const openBtn = document.getElementById("requestFeatureBtn");
    const form = document.getElementById("requestFeatureForm");
    const formWrap = document.getElementById("requestFormWrap");
    const success = document.getElementById("requestSuccess");
    const emailInput = document.getElementById("requestEmail");
    if (!modal || !openBtn || !form) return;

    function openModal() {
      const auth = window.StealthAuth?.get();
      if (emailInput && auth?.email && !emailInput.value) {
        emailInput.value = auth.email;
      }
      formWrap?.classList.remove("hidden");
      success?.classList.add("hidden");
      modal.classList.remove("hidden");
    }

    function closeModal() {
      modal.classList.add("hidden");
    }

    openBtn.addEventListener("click", openModal);

    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-request-modal]")) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const payload = {
        name: document.getElementById("requestName")?.value.trim() || "",
        email: document.getElementById("requestEmail")?.value.trim() || "",
        message: document.getElementById("requestMessage")?.value.trim() || "",
        createdAt: new Date().toISOString()
      };
      try {
        const existing = JSON.parse(localStorage.getItem("stealthReader.featureRequests") || "[]");
        existing.push(payload);
        localStorage.setItem("stealthReader.featureRequests", JSON.stringify(existing));
      } catch (error) {
        // 示範環境仍顯示成功畫面，避免打斷客人。
      }
      form.reset();
      formWrap?.classList.add("hidden");
      success?.classList.remove("hidden");
    });
  }
})();
