(() => {
  "use strict";

  const STORAGE_KEY = "stealthMemoReader.v1";
  const launchBtn = document.getElementById("launchReaderBtn");
  const bookNameEl = document.getElementById("currentBook");
  const progressEl = document.getElementById("currentProgress");
  const progressBarEl = document.getElementById("progressBar");
  const lastReadEl = document.getElementById("lastReadAt");
  const lockedControls = document.querySelectorAll("[data-locked]");

  function launchReader() {
    const mode = launchBtn?.dataset.launchMode || "pro";

    if (mode === "basic") {
      const win = window.open("/reader.html", "StealthReaderBasic");
      if (!win) {
        window.location.href = "reader.html";
      }
      return;
    }

    const width = Math.floor(window.screen.width * 0.85);
    const height = Math.floor(window.screen.height * 0.85);
    const left = Math.floor((window.screen.width - width) / 2);
    const top = Math.floor((window.screen.height - height) / 2);

    // Pro：popup=1 隱藏原生 Chrome 網址列與分頁欄
    const popup = window.open(
      "/reader.html",
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
        lastRead: formatLastRead(Date.now())
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

  launchBtn?.addEventListener("click", launchReader);

  lockedControls.forEach((control) => {
    control.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "index.html#pricing";
    });
  });

  renderReadingCard();
})();
