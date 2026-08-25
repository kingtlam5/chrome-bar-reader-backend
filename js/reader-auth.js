(() => {
  "use strict";

  if (document.documentElement.classList.contains("rb-device-blocked")) return;

  const requiredPlan = document.body?.dataset.readerPlan === "pro" ? "pro" : "free";
  const lockClass = requiredPlan === "pro" ? "pro-reader-locked" : "reader-login-locked";
  const gate = document.querySelector("[data-reader-login-gate]");
  const form = gate?.querySelector("form");
  const emailInput = form?.querySelector('input[name="email"], input[type="email"]');
  const passwordInput = form?.querySelector('input[name="password"], input[type="password"]');
  const errorEl = gate?.querySelector("[data-reader-login-error]");
  const submitBtn = form?.querySelector('button[type="submit"]');
  const fieldsWrap = gate?.querySelector("[data-reader-login-fields]");
  const verifyWrap = gate?.querySelector("[data-reader-login-verify]");
  const verifyInput = gate?.querySelector("[data-reader-login-code]");
  const verifyBtn = gate?.querySelector("[data-reader-login-verify-btn]");
  const resendBtn = gate?.querySelector("[data-reader-login-resend]");
  const altEl = gate?.querySelector("[data-reader-login-alt]");
  const html = document.documentElement;
  let locked = true;
  let busy = false;

  html.classList.add(lockClass);

  function t(key, fallback) {
    return window.ReadbarI18n?.t(key) || fallback || key;
  }

  function showError(message) {
    if (!errorEl) return;
    errorEl.textContent = message || "";
    errorEl.hidden = !message;
  }

  function setBusy(nextBusy, button) {
    busy = nextBusy;
    const target = button || submitBtn;
    if (target) target.disabled = nextBusy;
    if (resendBtn) resendBtn.disabled = nextBusy;
    if (verifyBtn && target !== verifyBtn) verifyBtn.disabled = nextBusy;
  }

  function showVerify(show) {
    fieldsWrap?.toggleAttribute("hidden", show);
    verifyWrap?.toggleAttribute("hidden", !show);
    if (show) verifyInput?.focus();
  }

  function readerUrl(fileName) {
    try {
      const url = new URL(fileName, window.location.href);
      const popup = new URLSearchParams(window.location.search).get("popup");
      if (popup) url.searchParams.set("popup", popup);
      return url.href;
    } catch (error) {
      return fileName;
    }
  }

  function unlockReader() {
    locked = false;
    html.classList.remove(lockClass);
    gate?.setAttribute("hidden", "");
    const memo = document.getElementById("memo");
    if (memo) {
      memo.removeAttribute("aria-hidden");
      memo.removeAttribute("inert");
    }
  }

  function blockWhileLocked(event) {
    if (!locked) return;
    if (gate && gate.contains(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
  }

  ["keydown", "keyup", "keypress", "wheel", "mousedown", "pointerdown"].forEach((type) => {
    document.addEventListener(type, blockWhileLocked, true);
  });

  async function admitUser(user) {
    const nextUser = (await window.ReadbarClerk.ensureMembershipMetadata()) || user;
    const profile = window.ReadbarClerk.applySession(nextUser);
    const plan = profile.plan === "pro" ? "pro" : "free";

    if (requiredPlan === "pro" && plan !== "pro") {
      showError(t("reader.loginNeedPro", "Free members cannot open the Pro reader."));
      if (altEl) altEl.hidden = false;
      return false;
    }

    if (requiredPlan === "free" && plan === "pro") {
      window.location.replace(readerUrl("reader-pro-version.html"));
      return true;
    }

    showError("");
    if (altEl) altEl.hidden = true;
    unlockReader();
    return true;
  }

  async function finishSignIn(signIn) {
    if (signIn.status === "complete") {
      const user = await window.ReadbarClerk.activateSession(signIn.createdSessionId);
      await admitUser(user);
      return;
    }

    if (signIn.status === "needs_second_factor" || signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors?.find((factor) => factor.strategy === "email_code");
      if (!emailCodeFactor) {
        throw new Error(t("login.needMoreSteps", "This sign-in needs another verification step that is not available here."));
      }
      const clerk = await window.ReadbarClerk.ready();
      await clerk.client.signIn.prepareSecondFactor({
        strategy: "email_code",
        emailAddressId: emailCodeFactor.emailAddressId
      });
      showVerify(true);
      return;
    }

    throw new Error(t("login.needMoreSteps", "This sign-in needs another verification step that is not available here."));
  }

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy) return;
    showError("");
    if (altEl) altEl.hidden = true;
    if (!form.reportValidity()) return;

    setBusy(true);
    try {
      const clerk = await window.ReadbarClerk.ready();
      const signIn = await clerk.client.signIn.create({
        identifier: (emailInput?.value || "").trim(),
        password: passwordInput?.value || ""
      });
      await finishSignIn(signIn);
    } catch (error) {
      showError(window.ReadbarClerk?.errorMessage(error) || t("reader.loginError"));
      passwordInput?.focus();
      passwordInput?.select();
    } finally {
      setBusy(false);
    }
  });

  verifyBtn?.addEventListener("click", async () => {
    if (busy) return;
    const code = (verifyInput?.value || "").trim();
    if (!code) {
      showError(t("login.codeRequired", "Enter the verification code."));
      return;
    }

    showError("");
    setBusy(true, verifyBtn);
    try {
      const clerk = await window.ReadbarClerk.ready();
      const signIn = await clerk.client.signIn.attemptSecondFactor({
        strategy: "email_code",
        code
      });
      await finishSignIn(signIn);
    } catch (error) {
      showError(window.ReadbarClerk?.errorMessage(error) || t("reader.loginError"));
    } finally {
      setBusy(false, verifyBtn);
    }
  });

  resendBtn?.addEventListener("click", async () => {
    if (busy) return;
    showError("");
    setBusy(true, resendBtn);
    try {
      const clerk = await window.ReadbarClerk.ready();
      const emailCodeFactor = clerk.client.signIn.supportedSecondFactors?.find(
        (factor) => factor.strategy === "email_code"
      );
      await clerk.client.signIn.prepareSecondFactor({
        strategy: "email_code",
        emailAddressId: emailCodeFactor?.emailAddressId
      });
    } catch (error) {
      showError(window.ReadbarClerk?.errorMessage(error) || t("reader.loginError"));
    } finally {
      setBusy(false, resendBtn);
    }
  });

  (async () => {
    if (typeof window.ReadbarClerk?.ready !== "function") {
      showError(t("clerk.unavailable"));
      return;
    }
    try {
      const clerk = await window.ReadbarClerk.ready();
      if (clerk?.user) {
        await admitUser(clerk.user);
        return;
      }
    } catch (error) {
      showError(window.ReadbarClerk?.errorMessage(error) || t("clerk.unavailable"));
    }
    emailInput?.focus();
  })();
})();
