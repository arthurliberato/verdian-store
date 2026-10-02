// Drill landing page. Loads tracking named in the URL and pushes one event when the form is
// submitted. Practice only; the email is never stored or sent anywhere.
//
//   ?gtm=GTM-XXXXXXX   load that GTM container (GTM drills)
//   ?ga=G-XXXXXXX      load GA4 directly with gtag.js, no GTM (GA4 drills)
//   ?debug=1           with ?ga=, mark hits as debug so they show in DebugView
//   ?gtm=none / ?ga=none   forget the saved value
//
// Values are remembered per browser, so the parameter is only needed once.

(function () {
  window.dataLayer = window.dataLayer || [];
  var params = new URLSearchParams(location.search);

  // Reads ?name=, saves it (or forgets it on "none") and returns the current value if it's valid.
  function remembered(name, pattern) {
    var key = "drill_" + name;
    var param = params.get(name);
    try {
      if (param === "none") localStorage.removeItem(key);
      else if (param) localStorage.setItem(key, param);
      param = localStorage.getItem(key);
    } catch {
      if (param === "none") param = null;
    }
    return param && pattern.test(param) ? param : null;
  }

  function load(src) {
    var script = document.createElement("script");
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }

  var notes = [];

  // GTM: the standard container snippet, with the ID from the URL.
  var gtmId = remembered("gtm", /^GTM-[A-Z0-9]{4,12}$/);
  if (gtmId) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    load("https://www.googletagmanager.com/gtm.js?id=" + gtmId);
    notes.push("GTM container: " + gtmId);
  }

  // GA4 without GTM: the standard gtag.js snippet, with the measurement ID from the URL.
  var gaId = remembered("ga", /^G-[A-Z0-9]{6,12}$/);
  var gtag = null;
  if (gaId) {
    gtag = function () {
      window.dataLayer.push(arguments);
    };
    load("https://www.googletagmanager.com/gtag/js?id=" + gaId);
    gtag("js", new Date());
    gtag("config", gaId, params.get("debug") === "1" ? { debug_mode: true } : {});
    notes.push("GA4 (gtag.js): " + gaId + (params.get("debug") === "1" ? ", debug" : ""));
  }

  if (notes.length) {
    document.getElementById("container").textContent = notes.join(" · ") + " (change with ?gtm=… or ?ga=…, remove with =none)";
  }

  document.getElementById("signup").addEventListener("submit", function (e) {
    e.preventDefault();
    // GA4's recommended event for a lead form. Never the email address.
    // For GTM: a data layer push. For gtag.js: a direct GA4 event.
    window.dataLayer.push({ event: "generate_lead", form_name: "early_access" });
    if (gtag) gtag("event", "generate_lead", { form_name: "early_access" });
    e.target.hidden = true;
    document.getElementById("thanks").hidden = false;
  });
})();
