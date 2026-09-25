"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

// Fires `newsletter_signup` (custom event). Mark it as a Key Event in GA4 if
// you want it counted as a conversion. The email itself is never sent to analytics.
export function NewsletterForm({ location }: { location: string }) {
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("all");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    track("newsletter_signup", { form_location: location, interest });
    setDone(true);
  }

  if (done) return <p className="font-medium">You&apos;re in. Watch your inbox for the next drop.</p>;

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row" aria-label="Newsletter signup">
      <label htmlFor={`nl-email-${location}`} className="sr-only">
        Email address
      </label>
      <input
        id={`nl-email-${location}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="flex-1 rounded-full border border-stone-300 bg-white px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-forest"
      />
      <label htmlFor={`nl-interest-${location}`} className="sr-only">
        Interested in
      </label>
      <select
        id={`nl-interest-${location}`}
        value={interest}
        onChange={(e) => setInterest(e.target.value)}
        className="rounded-full border border-stone-300 bg-white px-4 py-3 text-sm text-black"
      >
        <option value="all">Everything</option>
        <option value="classic">Classic</option>
        <option value="performance">Performance</option>
        <option value="street">Street drops</option>
      </select>
      <button type="submit" className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-forest">
        Subscribe
      </button>
    </form>
  );
}
