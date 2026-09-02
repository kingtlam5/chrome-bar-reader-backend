(() => {
  "use strict";

  // Clerk publishable keys are designed for the browser. This value comes from
  // the environment secret CLERK_PUBLISHABLE_KEY (pk_test_…).
  const PUBLISHABLE_KEY = "pk_test_Ym9zcy1lbXUtMzc0Mi5jbGVyay5hY2NvdW50cy5kZXYk";
  const CLERK_JS_VERSION = "5";

  let loadPromise = null;

  function t(key, fallback) {
    return window.ReadbarI18n?.t(key) || fallback || key;
  }

  function frontendApiFromKey(key) {
    try {
      const encoded = String(key || "").split("_").slice(2).join("_");
      return atob(encoded).replace(/\$+$/, "");
    } catch (error) {
      return "";
    }
  }

  function loadScript() {
    return new Promise((resolve, reject) => {
      if (window.Clerk) {
        resolve(window.Clerk);
        return;
      }

      const frontendApi = frontendApiFromKey(PUBLISHABLE_KEY);
      if (!frontendApi) {
        reject(new Error(t("clerk.unavailable", "Clerk is not available.")));
        return;
      }

      const script = document.createElement("script");
      script.async = true;
      script.crossOrigin = "anonymous";
      script.src = `https://${frontendApi}/npm/@clerk/clerk-js@${CLERK_JS_VERSION}/dist/clerk.browser.js`;
      script.setAttribute("data-clerk-publishable-key", PUBLISHABLE_KEY);
      script.onload = () => {
        if (!window.Clerk) {
          reject(new Error(t("clerk.unavailable", "Clerk is not available.")));
          return;
        }
        resolve(window.Clerk);
      };
      script.onerror = () => {
        reject(new Error(t("clerk.unavailable", "Clerk is not available.")));
      };
      document.head.appendChild(script);
    });
  }

  function ready() {
    if (!loadPromise) {
      loadPromise = (async () => {
        const clerk = await loadScript();
        if (!clerk.loaded) {
          await clerk.load();
        }
        return clerk;
      })();
    }
    return loadPromise;
  }

  function membershipMeta(_ignored, extra) {
    return { ...(extra || {}) };
  }

  async function persistMembership() {
    const clerk = await ready();
    return clerk?.user || null;
  }

  async function ensureMembershipMetadata() {
    const clerk = await ready();
    return clerk?.user || null;
  }

  function emailOf(user) {
    return (
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress ||
      ""
    );
  }

  function nameOf(user) {
    const full = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
    if (full) return full;
    return String(user?.unsafeMetadata?.name || "").trim();
  }

  function usernameOf(user) {
    if (user?.username) return user.username;
    const email = emailOf(user);
    const at = email.indexOf("@");
    return at > 0 ? email.slice(0, at) : email;
  }

  function profileFromUser(user) {
    return {
      email: emailOf(user),
      username: usernameOf(user),
      name: nameOf(user),
      clerkUserId: user?.id || ""
    };
  }

  function dashboardFor() {
    return "dashboard.html";
  }

  function errorMessage(err) {
    const first = err?.errors?.[0];
    const code = first?.code || err?.code || "";
    if (code === "form_password_incorrect" || code === "form_password_validation_failed") {
      return t("dash.pwWrongCurrent", "The current password is incorrect.");
    }
    if (code === "form_password_pwned") {
      return t("dash.pwPwned", "Please choose a different password.");
    }
    if (code === "form_password_not_strong_enough" || code === "form_password_size_in_bytes") {
      return t("dash.pwTooWeak", "The new password does not meet the password rules.");
    }
    if (code === "session_reverification_required" || code === "reverification_required") {
      return t("dash.pwNeedReverify", "Please sign in again, then change the password.");
    }
    return (
      first?.longMessage ||
      first?.message ||
      err?.message ||
      t("clerk.errorGeneric", "Could not complete authentication.")
    );
  }

  function splitName(name) {
    const trimmed = String(name || "").trim();
    if (!trimmed) return { firstName: "", lastName: "" };
    const parts = trimmed.split(/\s+/);
    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(" ")
    };
  }

  function withTimeout(promise, ms, message) {
    let timer = 0;
    const timeout = new Promise((_, reject) => {
      timer = window.setTimeout(() => {
        reject(new Error(message || t("clerk.errorGeneric", "Could not complete authentication.")));
      }, ms);
    });
    return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timer));
  }

  async function activateSession(sessionId) {
    const clerk = await ready();
    if (!sessionId) {
      throw new Error(t("clerk.errorGeneric", "Could not complete authentication."));
    }
    await clerk.setActive({ session: sessionId });
    return clerk.user;
  }

  async function applySession(user) {
    const profile = profileFromUser(user);
    window.StealthAuth?.set(profile);
    return profile;
  }

  const MIN_PASSWORD_LENGTH = 15;
  const REVERIFY_AFTER_MINUTES = 10;

  function clerkErrorCodes(err) {
    const codes = [];
    if (err?.code) codes.push(String(err.code));
    if (Array.isArray(err?.errors)) {
      err.errors.forEach((item) => {
        if (item?.code) codes.push(String(item.code));
      });
    }
    return codes;
  }

  function isReverificationRequired(err) {
    return clerkErrorCodes(err).some((code) => (
      code === "session_reverification_required" ||
      code === "reverification_required"
    ));
  }

  function firstFactorAgeMinutes(session) {
    const age = session?.factorVerificationAge;
    if (!Array.isArray(age)) return Number.POSITIVE_INFINITY;
    const minutes = Number(age[0]);
    return Number.isFinite(minutes) ? minutes : Number.POSITIVE_INFINITY;
  }

  async function reverifyWithPassword(clerk, password) {
    const session = clerk?.session;
    const start = session?.startVerification || session?.__experimental_startVerification;
    const attempt = session?.attemptFirstFactorVerification || session?.__experimental_attemptFirstFactorVerification;
    if (typeof start !== "function" || typeof attempt !== "function") {
      throw new Error(t("dash.pwNeedReverify", "Please sign in again, then change the password."));
    }

    const started = await start.call(session, { level: "first_factor" });
    if (started?.status === "complete") return started;

    const result = await attempt.call(session, {
      strategy: "password",
      password
    });
    if (result?.status === "complete") return result;
    if (result?.status === "needs_second_factor") {
      throw new Error(t("dash.pwNeedReverify", "Please sign in again, then change the password."));
    }
    throw new Error(t("dash.pwWrongCurrent", "The current password is incorrect."));
  }

  async function updatePassword({ currentPassword, newPassword }) {
    const clerk = await ready();
    const user = clerk?.user;
    if (!user) {
      const error = new Error(
        t("dash.pwNeedSignInBody", "Sign in with your member account to change the password.")
      );
      error.code = "not_signed_in";
      throw error;
    }
    if (typeof user.updatePassword !== "function") {
      throw new Error(t("clerk.unavailable", "Clerk is not available."));
    }

    const payload = {
      currentPassword,
      newPassword,
      signOutOfOtherSessions: true
    };

    async function tryUpdate() {
      return user.updatePassword(payload);
    }

    try {
      if (firstFactorAgeMinutes(clerk.session) >= REVERIFY_AFTER_MINUTES) {
        await reverifyWithPassword(clerk, currentPassword);
      }
      return await tryUpdate();
    } catch (error) {
      if (!isReverificationRequired(error)) throw error;
      await reverifyWithPassword(clerk, currentPassword);
      return tryUpdate();
    }
  }

  window.ReadbarClerk = {
    PUBLISHABLE_KEY,
    MIN_PASSWORD_LENGTH,
    ready,
    membershipMeta,
    persistMembership,
    ensureMembershipMetadata,
    profileFromUser,
    dashboardFor,
    errorMessage,
    splitName,
    activateSession,
    applySession,
    withTimeout,
    updatePassword
  };
})();
