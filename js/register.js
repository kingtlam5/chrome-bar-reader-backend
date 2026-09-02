(() => {
  "use strict";

  const form = document.getElementById("registerForm");
  const nameInput = document.getElementById("registerName");
  const emailInput = document.getElementById("registerEmail");
  const passwordInput = document.getElementById("registerPassword");
  const submitBtn = document.getElementById("registerSubmitBtn");
  const failModal = document.getElementById("registerFailModal");
  const failBody = document.getElementById("registerFailBody");
  const errorEl = document.getElementById("registerError");
  const formFields = document.getElementById("registerFields");
  const verifyWrap = document.getElementById("registerVerifyWrap");
  const verifyInput = document.getElementById("registerVerifyCode");
  const verifyBtn = document.getElementById("registerVerifyBtn");
  const resendBtn = document.getElementById("registerResendBtn");

  let busy = false;

  function t(key, fallback) {
    return window.ReadbarI18n?.t(key) || fallback || key;
  }

  function showError(message) {
    if (!errorEl) return;
    errorEl.textContent = message || "";
    errorEl.classList.toggle("hidden", !message);
  }

  function openFailModal(message) {
    if (failBody && message) {
      failBody.textContent = message;
    }
    failModal?.classList.remove("hidden");
  }

  function closeFailModal() {
    failModal?.classList.add("hidden");
  }

  function setBusy(nextBusy, button) {
    busy = nextBusy;
    if (submitBtn) submitBtn.disabled = nextBusy;
    if (verifyBtn) verifyBtn.disabled = nextBusy;
    if (resendBtn) resendBtn.disabled = nextBusy;
    if (button) button.disabled = nextBusy;
  }

  function showVerify(show) {
    formFields?.classList.toggle("hidden", show);
    verifyWrap?.classList.toggle("hidden", !show);
    if (show) verifyInput?.focus();
  }

  async function createSignUp() {
    const clerk = await window.ReadbarClerk.ready();
    const name = (nameInput?.value || "").trim();
    const emailAddress = (emailInput?.value || "").trim();
    const password = passwordInput?.value || "";
    const { firstName, lastName } = window.ReadbarClerk.splitName(name);
    const payload = {
      emailAddress,
      password,
      unsafeMetadata: window.ReadbarClerk.membershipMeta(null, { name })
    };
    if (firstName) payload.firstName = firstName;
    if (lastName) payload.lastName = lastName;

    const timeoutMs = 45000;
    const timeoutMessage = t("register.captchaTimeout", "Verification took too long. Complete the checkbox and try again.");

    try {
      return await window.ReadbarClerk.withTimeout(
        clerk.client.signUp.create(payload),
        timeoutMs,
        timeoutMessage
      );
    } catch (error) {
      const param = error?.errors?.[0]?.meta?.paramName || "";
      if (param === "first_name" || param === "last_name") {
        return window.ReadbarClerk.withTimeout(
          clerk.client.signUp.create({
            emailAddress,
            password,
            unsafeMetadata: window.ReadbarClerk.membershipMeta(null, { name })
          }),
          timeoutMs,
          timeoutMessage
        );
      }
      throw error;
    }
  }

  async function sendEmailCode() {
    const clerk = await window.ReadbarClerk.ready();
    await clerk.client.signUp.prepareEmailAddressVerification({
      strategy: "email_code"
    });
  }

  async function finishSignedIn(user) {
    const nextUser = (await window.ReadbarClerk.persistMembership()) || user;
    window.ReadbarClerk.applySession(nextUser);
    window.location.href = window.ReadbarClerk.dashboardFor();
  }

  async function completeIfReady(signUp) {
    if (signUp.status === "complete") {
      const user = await window.ReadbarClerk.activateSession(signUp.createdSessionId);
      await finishSignedIn(user);
      return true;
    }
    return false;
  }

  async function startSignUp() {
    showError("");
    const signUp = await createSignUp();
    if (await completeIfReady(signUp)) return;

    const needsEmail =
      signUp.unverifiedFields?.includes("email_address") ||
      signUp.status === "missing_requirements";

    if (needsEmail) {
      await sendEmailCode();
      showVerify(true);
      return;
    }

    throw new Error(t("register.needMoreSteps", "Sign-up needs another step that is not available here."));
  }

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy) return;
    if (!form.reportValidity()) return;

    setBusy(true, submitBtn);
    try {
      await startSignUp();
    } catch (error) {
      const message = window.ReadbarClerk?.errorMessage(error) || t("register.failBody");
      showError(message);
      openFailModal(message);
    } finally {
      setBusy(false, submitBtn);
    }
  });

  verifyBtn?.addEventListener("click", async () => {
    if (busy) return;
    const code = (verifyInput?.value || "").trim();
    if (!code) {
      showError(t("register.codeRequired", "Enter the verification code."));
      return;
    }

    showError("");
    setBusy(true, verifyBtn);
    try {
      const clerk = await window.ReadbarClerk.ready();
      const signUp = await clerk.client.signUp.attemptEmailAddressVerification({ code });
      if (!(await completeIfReady(signUp))) {
        throw new Error(t("register.needMoreSteps", "Sign-up needs another step that is not available here."));
      }
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
      await sendEmailCode();
    } catch (error) {
      showError(window.ReadbarClerk.errorMessage(error));
    } finally {
      setBusy(false, resendBtn);
    }
  });

  failModal?.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-register-fail]")) {
      closeFailModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && failModal && !failModal.classList.contains("hidden")) {
      closeFailModal();
    }
  });

  (async () => {
    try {
      const clerk = await window.ReadbarClerk.ready();
      if (clerk?.user) {
        const user = (await window.ReadbarClerk.ensureMembershipMetadata()) || clerk.user;
        window.ReadbarClerk.applySession(user);
        window.location.replace(window.ReadbarClerk.dashboardFor());
      }
    } catch (error) {
      showError(window.ReadbarClerk?.errorMessage(error) || t("clerk.unavailable"));
    }
  })();
})();
