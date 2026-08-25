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

  function planOf(user) {
    const meta = user?.publicMetadata || {};
    const unsafe = user?.unsafeMetadata || {};
    const plan = String(unsafe.plan || meta.plan || "free").toLowerCase();
    return plan === "pro" ? "pro" : "free";
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
    const plan = planOf(user);
    const profile = {
      email: emailOf(user),
      username: usernameOf(user),
      name: nameOf(user),
      plan,
      clerkUserId: user?.id || ""
    };
    if (plan === "pro") {
      const next = new Date();
      next.setMonth(next.getMonth() + 1);
      profile.nextPaymentAt = next.toISOString();
    }
    return profile;
  }

  function dashboardFor(plan) {
    return plan === "pro" ? "dashboard-pro-version.html" : "dashboard-free-version.html";
  }

  function errorMessage(err) {
    const first = err?.errors?.[0];
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

  window.ReadbarClerk = {
    PUBLISHABLE_KEY,
    ready,
    planOf,
    profileFromUser,
    dashboardFor,
    errorMessage,
    splitName,
    activateSession,
    applySession,
    withTimeout
  };
})();
