// Google Tag Manager container snippet.
//
// The container ID comes from the NEXT_PUBLIC_GTM_ID environment variable
// (Vercel → Project → Settings → Environment Variables). If it isn't set,
// nothing is loaded and the site runs with no tracking at all.
//
// NEXT_PUBLIC_ variables are baked in at build time: after changing it in
// Vercel, redeploy for the change to take effect.

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

/** Google's standard head snippet. Rendered by app/layout.tsx. */
export function gtmSnippet(id: string) {
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`;
}

/** Fallback for browsers with JavaScript disabled. Goes first inside <body>. */
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
