/* =========================================================
   AI Resource Hub — script.js
   Configure your endpoints below. Leave GOOGLE_APPS_SCRIPT_URL
   empty to disable tracking without breaking the page.
   ========================================================= */
const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbxMc3yC4DOMiO4db64OTLncxHprMCzunAyrCJWH-qGqZjsUWZxHqlBMBrt5UKL7TyDtDA/exec",
  WHATSAPP_URL: "https://wa.me/8801706374984"
};

(function () {
  "use strict";

  /* ---------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const header = document.querySelector(".site-header");

  if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      const isOpen = header.classList.toggle("mobile-menu-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    // Close menu when a nav link is tapped
    document.querySelectorAll("#primary-nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("mobile-menu-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* ---------------------------------------------------------
     FAQ accordion
     --------------------------------------------------------- */
  document.querySelectorAll(".accordion-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      const panel = document.getElementById(trigger.getAttribute("aria-controls"));

      trigger.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });

  /* ---------------------------------------------------------
     WhatsApp links
     --------------------------------------------------------- */
  ["whatsappCta", "whatsappFooter"].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.setAttribute("href", CONFIG.WHATSAPP_URL);
  });

  /* ---------------------------------------------------------
     AI Tools search + category filter
     --------------------------------------------------------- */
  const toolSearch = document.getElementById("toolSearch");
  const filterPills = document.querySelectorAll(".filter-pill");
  const toolCards = document.querySelectorAll(".tool-card");
  const noResults = document.getElementById("noResults");

  let activeFilter = "all";
  let activeQuery = "";

  function applyToolFilter() {
    let visibleCount = 0;

    toolCards.forEach(function (card) {
      const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
      const matchesQuery = !activeQuery || card.dataset.name.includes(activeQuery);
      const visible = matchesCategory && matchesQuery;

      card.hidden = !visible;
      if (visible) visibleCount++;
    });

    if (noResults) noResults.hidden = visibleCount !== 0;
  }

  if (toolSearch) {
    toolSearch.addEventListener("input", function () {
      activeQuery = toolSearch.value.trim().toLowerCase();
      applyToolFilter();
    });
  }

  filterPills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      filterPills.forEach(function (p) { p.classList.remove("is-active"); });
      pill.classList.add("is-active");
      activeFilter = pill.dataset.filter;
      applyToolFilter();
    });
  });

  /* ---------------------------------------------------------
     UTM + basic technical info capture
     --------------------------------------------------------- */
  function getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || "",
      utm_term: params.get("utm_term") || ""
    };
  }

  function buildPayload() {
    const utm = getUTMParams();
    return {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent || "",
      referrer: document.referrer || "",
      pageUrl: window.location.href,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_content: utm.utm_content,
      utm_term: utm.utm_term,
      screenWidth: window.screen ? window.screen.width : null,
      screenHeight: window.screen ? window.screen.height : null,
      language: navigator.language || ""
    };
  }

  /* ---------------------------------------------------------
     Send tracking once per browser session, non-blocking,
     fails silently if no endpoint is configured or the
     request errors out.
     --------------------------------------------------------- */
  function trackPageViewOnce() {
    if (!CONFIG.GOOGLE_APPS_SCRIPT_URL) return; // tracking disabled — page keeps working normally

    const SESSION_KEY = "arh_tracked_session";
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return; // already tracked this session
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch (err) {
      // sessionStorage unavailable (e.g. privacy mode) — proceed without dedup guarantee
    }

    const payload = buildPayload();

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        navigator.sendBeacon(CONFIG.GOOGLE_APPS_SCRIPT_URL, blob);
      } else {
        fetch(CONFIG.GOOGLE_APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(function () {
          /* swallow network errors — never break the page */
        });
      }
    } catch (err) {
      /* tracking must never break the page */
    }
  }

  // Defer tracking until after first paint so it never blocks rendering
  if (document.readyState === "complete") {
    trackPageViewOnce();
  } else {
    window.addEventListener("load", trackPageViewOnce);
  }
})();
