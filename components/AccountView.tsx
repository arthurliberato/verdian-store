"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

// Fake sign-in: there is no password or backend. Signing in simply gives the
// visitor a stable user_id (a hash of the email) so you can study how GA4
// stitches sessions and devices together for known users.
export function AccountView() {
  const { ready, user, signIn, signOut } = useStore();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");

  if (!ready) return <div className="mx-auto max-w-md px-4 py-16">Loading…</div>;

  if (user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-4xl font-black tracking-tight">Hi, {user.firstName}</h1>
        <p className="mt-3 text-stone-600">Signed in as {user.email}</p>
        <p className="mt-1 text-sm text-stone-500">
          Analytics user_id: <code className="rounded bg-stone-100 px-1.5 py-0.5">{user.userId}</code>
        </p>
        <button type="button" onClick={signOut} className="mt-8 rounded-full border border-black px-6 py-3 font-semibold hover:bg-black hover:text-white">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-4xl font-black tracking-tight">Sign in</h1>
      <p className="mt-3 text-stone-600">Members get early access to drops and faster checkout.</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (email.includes("@") && firstName.trim()) signIn(email, firstName.trim(), "email");
        }}
      >
        <div>
          <label htmlFor="acct-name" className="text-sm font-medium">First name</label>
          <input id="acct-name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:ring-2 focus:ring-forest" />
        </div>
        <div>
          <label htmlFor="acct-email" className="text-sm font-medium">Email</label>
          <input id="acct-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:ring-2 focus:ring-forest" />
        </div>
        <button type="submit" className="w-full rounded-full bg-black py-4 font-semibold text-white hover:bg-forest">Sign in</button>
        <p className="text-xs text-stone-500">Demo store: no password needed and nothing is stored on a server.</p>
      </form>
    </div>
  );
}
