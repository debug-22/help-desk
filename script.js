// ========================================
// AI RESOURCE HUB - MAIN JAVASCRIPT
// ========================================

const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL:
    "https://script.google.com/macros/s/AKfycbxMc3yC4DOMiO4db64OTLncxHprMCzunAyrCJWH-qGqZjsUWZxHqlBMBrt5UKL7TyDtDA/exec",

  WHATSAPP_URL:
    "https://wa.me/8801706374984"
};


// ========================================
// MOBILE NAVIGATION
// ========================================

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("active");
      menuToggle.classList.remove("active");
    });
  });
}


// ========================================
// FAQ ACCORDION
// ========================================

document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const item = question.closest(".faq-item");

    if (!item) return;

    const answer = item.querySelector(".faq-answer");

    item.classList.toggle("active");

    if (item.classList.contains("active")) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = null;
    }
  });
});


// ========================================
// WHATSAPP LINKS
// ========================================

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.href = CONFIG.WHATSAPP_URL;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});


// ========================================
// UTM PARAMETER TRACKING
// ========================================

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


// ========================================
// BUILD VISITOR DATA
// ========================================

function buildPayload() {
  const utm = getUTMParams();

  return {
    timestamp: new Date().toISOString(),

    userAgent: navigator.userAgent,

    referrer: document.referrer,

    pageUrl: window.location.href,

    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    utm_content: utm.utm_content,
    utm_term: utm.utm_term,

    screenWidth: window.screen.width,
    screenHeight: window.screen.height,

    language: navigator.language
  };
}


// ========================================
// SEND VISITOR DATA TO GOOGLE SHEETS
// ========================================

function trackVisitor() {

  if (!CONFIG.GOOGLE_APPS_SCRIPT_URL) {
    console.warn("Google Apps Script URL is not configured.");
    return;
  }

  // Track only once per browser tab session
  const trackingKey = "arh_tracked_session";

  if (sessionStorage.getItem(trackingKey)) {
    return;
  }

  sessionStorage.setItem(trackingKey, "1");

  const payload = buildPayload();

  try {

    const blob = new Blob(
      [JSON.stringify(payload)],
      {
        type: "text/plain;charset=UTF-8"
      }
    );

    if (navigator.sendBeacon) {

      navigator.sendBeacon(
        CONFIG.GOOGLE_APPS_SCRIPT_URL,
        blob
      );

    } else {

      fetch(CONFIG.GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=UTF-8"
        },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});

    }

  } catch (error) {
    console.warn("Visitor tracking failed:", error);
  }
}


// ========================================
// START TRACKING AFTER PAGE LOAD
// ========================================

window.addEventListener("load", () => {
  trackVisitor();
});