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

  function normalizePlan(value) {
    return String(value || "").toLowerCase() === "pro" ? "pro" : "free";
  }

  function membershipMeta(signupPlan, extra) {
    const requested = normalizePlan(signupPlan);
    return {
      plan: "free",
      signupPlan: requested,
      ...(requested === "pro" ? { proRequestedAt: new Date().toISOString() } : {}),
      ...(extra || {})
    };
  }

  function signupPlanOf(user) {
    const unsafe = user?.unsafeMetadata || {};
    return normalizePlan(unsafe.signupPlan || unsafe.requestedPlan || unsafe.plan);
  }

  function isEntitledPro(user) {
    return normalizePlan(user?.publicMetadata?.plan) === "pro";
  }

  function planOf(user) {
    if (isEntitledPro(user)) return "pro";
    const unsafe = user?.unsafeMetadata || {};
    // Applying for Pro must not unlock Pro until payment (or an admin publicMetadata grant).
    if (normalizePlan(unsafe.signupPlan || unsafe.requestedPlan) === "pro") return "free";
    if (!hasPlanValue(unsafe.signupPlan) && normalizePlan(unsafe.plan) === "pro") return "free";
    return normalizePlan(unsafe.plan);
  }

  function hasPlanValue(value) {
    const raw = String(value || "").toLowerCase();
    return raw === "pro" || raw === "free";
  }

  async function persistMembership(signupPlan) {
    const clerk = await ready();
    const user = clerk?.user;
    if (!user?.update) return user || null;

    const current = { ...(user.unsafeMetadata || {}) };
    const requested = normalizePlan(signupPlan || current.signupPlan || current.plan);
    const entitled = isEntitledPro(user);
    const next = {
      ...current,
      signupPlan: requested,
      plan: entitled ? "pro" : "free"
    };
    if (requested === "pro" && !entitled && !next.proRequestedAt) {
      next.proRequestedAt = new Date().toISOString();
    }

    await user.update({ unsafeMetadata: next });
    return clerk.user;
  }

  async function ensureMembershipMetadata() {
    const clerk = await ready();
    const user = clerk?.user;
    if (!user?.update) return user || null;

    const current = { ...(user.unsafeMetadata || {}) };
    const next = { ...current };
    const entitled = isEntitledPro(user);
    let changed = false;

    if (!hasPlanValue(next.signupPlan)) {
      next.signupPlan = normalizePlan(current.signupPlan || current.requestedPlan || current.plan);
      changed = true;
    }

    if (normalizePlan(next.signupPlan) === "pro" && !entitled) {
      if (next.plan !== "free") {
        next.plan = "free";
        changed = true;
      }
      if (!next.proRequestedAt) {
        next.proRequestedAt = new Date().toISOString();
        changed = true;
      }
    } else if (!hasPlanValue(next.plan)) {
      next.plan = entitled ? "pro" : "free";
      changed = true;
    } else if (entitled && next.plan !== "pro") {
      next.plan = "pro";
      changed = true;
    }

    if (!changed) return user;
    await user.update({ unsafeMetadata: next });
    return clerk.user;
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
    signupPlanOf,
    membershipMeta,
    persistMembership,
    ensureMembershipMetadata,
    profileFromUser,
    dashboardFor,
    errorMessage,
    splitName,
    activateSession,
    applySession,
    withTimeout
  };
})();
