// Drill landing page: loads the GTM container named in the URL and pushes one event when the
// form is submitted. Practice only; the email is never stored or sent anywhere.

(function () {
  window.dataLayer = window.dataLayer || [];

  // ?gtm=GTM-XXXXXXX loads that container and remembers it for this browser; ?gtm=none forgets it.
  var param = new URLSearchParams(location.search).get("gtm");
  try {
    if (param === "none") localStorage.removeItem("drill_gtm");
    else if (param) localStorage.setItem("drill_gtm", param);
  } catch {}
  var id = null;
  try { id = localStorage.getItem("drill_gtm"); } catch { id = param; }

  if (id && /^GTM-[A-Z0-9]{4,12}$/.test(id)) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=" + id;
    document.head.appendChild(script);
    document.getElementById("container").textContent = "GTM container: " + id + " (change with ?gtm=…, remove with ?gtm=none)";
  }

  document.getElementById("signup").addEventListener("submit", function (e) {
    e.preventDefault();
    // GA4's recommended event for a lead form. Never the email address.
    window.dataLayer.push({ event: "generate_lead", form_name: "early_access" });
    e.target.hidden = true;
    document.getElementById("thanks").hidden = false;
  });
})();
