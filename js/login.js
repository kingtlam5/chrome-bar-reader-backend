(() => {
  "use strict";

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const submitBtn = form?.querySelector('button[type="submit"]');
  const errorEl = document.getElementById("loginError");
  const formFields = document.getElementById("loginFields");
  const verifyWrap = document.getElementById("loginVerifyWrap");
  const verifyInput = document.getElementById("loginVerifyCode");
  const verifyBtn = document.getElementById("loginVerifyBtn");
  const resendBtn = document.getElementById("loginResendBtn");
  const previewLink = document.getElementById("previewDashboardLink");

  let busy = false;

  function t(key, fallback) {
    return window.ReadbarI18n?.t(key) || fallback || key;
  }

  function emailFromForm() {
    const value = (emailInput?.value || "").trim();
    return value || "user@example.com";
  }

  function usernameFromEmail(email) {
    const at = email.indexOf("@");
    return at > 0 ? email.slice(0, at) : email;
  }

  function memberProfile() {
    const email = emailFromForm();
    return {
      email,
      username: usernameFromEmail(email)
    };
  }

  function showError(message) {
    if (!errorEl) return;
    errorEl.textContent = message || "";
    errorEl.classList.toggle("hidden", !message);
  }

  function setBusy(nextBusy, button) {
    busy = nextBusy;
    const target = button || submitBtn;
    if (target) target.disabled = nextBusy;
    if (resendBtn) resendBtn.disabled = nextBusy;
    if (verifyBtn && target !== verifyBtn) verifyBtn.disabled = nextBusy;
  }

  function showVerify(show) {
    formFields?.classList.toggle("hidden", show);
    verifyWrap?.classList.toggle("hidden", !show);
    if (show) {
      verifyInput?.focus();
    }
  }

  async function enterApp(user) {
    const nextUser = (await window.ReadbarClerk.ensureMembershipMetadata()) || user;
    window.ReadbarClerk.applySession(nextUser);
    window.location.href = window.ReadbarClerk.dashboardFor();
  }

  async function finishSignIn(signIn) {
    if (signIn.status === "complete") {
      const user = await window.ReadbarClerk.activateSession(signIn.createdSessionId);
      await enterApp(user);
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
      showError(window.ReadbarClerk.errorMessage(error));
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
      showError(window.ReadbarClerk.errorMessage(error));
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
      showError(window.ReadbarClerk.errorMessage(error));
    } finally {
      setBusy(false, resendBtn);
    }
  });

  previewLink?.addEventListener("click", () => {
    window.StealthAuth?.set(memberProfile());
  });

  (async () => {
    try {
      const clerk = await window.ReadbarClerk.ready();
      if (clerk?.user) {
        await enterApp(clerk.user);
      }
    } catch (error) {
      showError(window.ReadbarClerk?.errorMessage(error) || t("clerk.unavailable"));
    }
  })();
})();
