(() => {
  "use strict";

  const STORAGE_KEY = document.body?.dataset.readerStorage || "stealthMemoReader.v1";
  const SETTINGS_KEY = "stealthMemoReader.settings.v1";
  const launchBtn = document.getElementById("launchReaderBtn");
  const bookNameEl = document.getElementById("currentBook");
  const progressEl = document.getElementById("currentProgress");
  const progressBarEl = document.getElementById("progressBar");
  const lastReadEl = document.getElementById("lastReadAt");
  const panicKeyInput = document.getElementById("panicKeyInput");

  function t(key, vars) {
    return window.ReadbarI18n?.t(key, vars) || key;
  }

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

  function launchReader() {
    if (isMobileReaderDevice()) {
      window.location.assign(readerUrl("reader.html"));
      return;
    }

    const url = readerUrl("reader.html?popup=1");
    const popup = openProReaderWindow(url);
    if (!popup) {
      alert(t("dash.popupBlocked"));
      return;
    }
    popup.focus();
  }

  function formatLastRead(timestamp) {
    if (!timestamp) return t("dash.sampleLastRead");

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return t("dash.sampleLastRead");

    const now = new Date();
    const sameDay = date.toDateString() === now.toDateString();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    if (sameDay) return t("dash.todayTime", { time: `${hours}:${minutes}` });
    const lang = window.ReadbarI18n?.getLang() || "zh-Hant";
    if (lang === "en") {
      return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
    }
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
      fileName: t("dash.sampleBook"),
      percent: 67,
      lastRead: t("dash.sampleLastRead")
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
        fileName: saved.n || t("dash.unnamed"),
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
  initAccountModals();
  window.ReadbarI18n?.onChange(renderReadingCard);

  function bindModal(modal, closeAttr) {
    if (!modal) return { open() {}, close() {} };

    function open() {
      modal.classList.remove("hidden");
    }

    function close() {
      modal.classList.add("hidden");
    }

    modal.addEventListener("click", (event) => {
      if (event.target.closest(`[${closeAttr}]`)) close();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.classList.contains("hidden")) {
        close();
      }
    });

    return { open, close };
  }

  function initAccountModals() {
    const passwordModal = document.getElementById("changePasswordModal");
    const passwordForm = document.getElementById("changePasswordForm");
    const passwordFormWrap = document.getElementById("changePasswordFormWrap");
    const passwordFail = document.getElementById("changePasswordFail");
    const passwordSuccess = document.getElementById("changePasswordSuccess");
    const passwordError = document.getElementById("changePasswordError");
    const passwordSubmit = passwordForm?.querySelector('button[type="submit"]');
    const failTitle = passwordFail?.querySelector("[data-pw-fail-title]");
    const failBody = passwordFail?.querySelector("[data-pw-fail-body]");
    const passwordUi = bindModal(passwordModal, "data-close-change-password");
    const minLength = window.ReadbarClerk?.MIN_PASSWORD_LENGTH || 15;
    let passwordBusy = false;

    function showPasswordPanel(panel) {
      passwordFormWrap?.classList.toggle("hidden", panel !== "form");
      passwordFail?.classList.toggle("hidden", panel !== "fail");
      passwordSuccess?.classList.toggle("hidden", panel !== "success");
    }

    function showPasswordError(message) {
      if (!passwordError) return;
      passwordError.textContent = message || "";
      passwordError.classList.toggle("hidden", !message);
    }

    function setPasswordBusy(nextBusy) {
      passwordBusy = nextBusy;
      if (passwordSubmit) passwordSubmit.disabled = nextBusy;
    }

    function resetPasswordModal() {
      passwordForm?.reset();
      showPasswordError("");
      setPasswordBusy(false);
      showPasswordPanel("form");
    }

    document.querySelectorAll("[data-open-change-password]").forEach((button) => {
      button.addEventListener("click", () => {
        resetPasswordModal();
        passwordUi.open();
      });
    });

    passwordModal?.addEventListener("click", (event) => {
      if (event.target.closest("[data-retry-change-password]")) {
        resetPasswordModal();
      }
    });

    passwordForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (passwordBusy) return;

      const data = new FormData(passwordForm);
      const currentPassword = String(data.get("currentPassword") || "");
      const newPassword = String(data.get("newPassword") || "");
      const confirmPassword = String(data.get("confirmPassword") || "");

      showPasswordError("");
      if (newPassword !== confirmPassword) {
        showPasswordError(t("dash.pwMismatch"));
        return;
      }
      if (newPassword.length < minLength) {
        showPasswordError(t("dash.pwTooShort"));
        return;
      }
      if (!passwordForm.reportValidity()) return;
      if (typeof window.ReadbarClerk?.updatePassword !== "function") {
        showPasswordError(t("clerk.unavailable"));
        return;
      }

      setPasswordBusy(true);
      try {
        await window.ReadbarClerk.updatePassword({ currentPassword, newPassword });
        passwordForm.reset();
        showPasswordPanel("success");
      } catch (error) {
        const message = window.ReadbarClerk?.errorMessage(error) || t("dash.pwFailBody");
        if (error?.code === "not_signed_in") {
          if (failTitle) failTitle.textContent = t("dash.pwNeedSignInTitle");
          if (failBody) failBody.textContent = t("dash.pwNeedSignInBody");
          showPasswordPanel("fail");
        } else {
          showPasswordError(message);
        }
      } finally {
        setPasswordBusy(false);
      }
    });
  }

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
