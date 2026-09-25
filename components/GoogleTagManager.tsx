import Script from "next/script";

// Loads the GTM container. Set NEXT_PUBLIC_GTM_ID (e.g. GTM-ABC1234) in
// .env.local locally and in Vercel → Project → Settings → Environment Variables.
// Without it the store still pushes to window.dataLayer (visible in the debug
// panel) — nothing is sent anywhere.
//
// This is Google's standard container snippet. The first line creates the
// dataLayer and records `gtm.start`, which GTM uses for its "Container Loaded"
// (gtm.js) event — the trigger your GA4 configuration tag fires on.
export function GoogleTagManager() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtmId) return null;
  return (
    <>
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}
