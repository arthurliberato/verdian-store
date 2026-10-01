"use client";

import { useState } from "react";
import { pushNewsletterSignup, type SignupLocation } from "@/lib/datalayer";

// Demo sign-up: nothing is stored or sent anywhere. The data layer only learns that someone signed
// up and where, never the address.
export function NewsletterForm({ location }: { location: SignupLocation }) {
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(true);
    pushNewsletterSignup(location);
  }

  if (done) {
    return (
      <p className="mt-4 text-sm" role="status">
        You&apos;re on the list. Early access to every drop, before anyone else.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-4 flex max-w-sm gap-2" aria-label="Newsletter sign-up">
      <label htmlFor={`newsletter-${location}`} className="sr-only">
        Email
      </label>
      <input
        id={`newsletter-${location}`}
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Email address"
        className="min-w-0 flex-1 rounded-full border border-line bg-bg px-4 py-2.5 text-sm outline-none transition-colors focus:border-fg"
      />
      <button type="submit" className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-brand-fg transition-opacity hover:opacity-90">
        Sign up
      </button>
    </form>
  );
}
