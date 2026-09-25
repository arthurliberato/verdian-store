"use client";

// On-screen dataLayer inspector — lets you watch every push as it happens,
// before GTM/GA4 are even connected.
//
// Shown automatically in development. On the live site, open any URL with
// ?debug=1 to turn it on (remembered in localStorage) and ?debug=0 to turn it off.
// (GTM's own Preview mode / Tag Assistant is the "real" tool once GTM is set up.)

import { useEffect, useState } from "react";
import { subscribeToDataLayer } from "@/lib/analytics";

type Entry = { id: number; time: string; data: Record<string, unknown> };

const STORAGE_KEY = "verdian_debug";

export function DataLayerDebug() {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("debug");
    try {
      if (param === "1") localStorage.setItem(STORAGE_KEY, "1");
      if (param === "0") localStorage.removeItem(STORAGE_KEY);
    } catch {}
    let stored = false;
    try {
      stored = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(process.env.NODE_ENV === "development" ? param !== "0" : stored);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let counter = 0;
    const add = (data: Record<string, unknown>) => {
      if (data.ecommerce === null && Object.keys(data).length === 1) return; // hide the reset pushes
      const id = ++counter;
      const time = new Date().toLocaleTimeString([], { hour12: false });
      setEntries((prev) => [{ id, time, data }, ...prev].slice(0, 50));
    };
    // Show anything pushed before the panel mounted (GTM's own gtm.js etc.).
    (window.dataLayer || []).forEach((d) => {
      if (d && typeof d === "object" && "event" in d) add(d);
    });
    return subscribeToDataLayer(add);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono text-xs" aria-label="dataLayer debug panel">
      {open ? (
        <div className="w-[min(420px,calc(100vw-2rem))] max-h-[60vh] flex flex-col rounded-lg bg-zinc-950 text-zinc-100 shadow-2xl ring-1 ring-white/10">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
            <span className="font-semibold">dataLayer · {entries.length} events</span>
            <div className="flex gap-3">
              <button onClick={() => setEntries([])} className="text-zinc-400 hover:text-white">
                clear
              </button>
              <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white">
                close
              </button>
            </div>
          </div>
          <ul className="overflow-y-auto divide-y divide-white/5">
            {entries.length === 0 && <li className="px-3 py-4 text-zinc-500">Interact with the store to see events.</li>}
            {entries.map((e) => (
              <li key={e.id}>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-white/5 flex justify-between gap-2"
                  onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                >
                  <span className="text-emerald-400">{String(e.data.event)}</span>
                  <span className="text-zinc-500">{e.time}</span>
                </button>
                {expanded === e.id && (
                  <pre className="px-3 pb-3 whitespace-pre-wrap break-all text-zinc-300">
                    {JSON.stringify(e.data, null, 2)}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-zinc-950 text-emerald-400 px-4 py-2 shadow-lg ring-1 ring-white/10"
        >
          dataLayer ({entries.length})
        </button>
      )}
    </div>
  );
}
