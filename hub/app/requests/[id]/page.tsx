import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allTickets, getTicket } from "@/lib/tickets";
import { getPerson } from "@/content/people";
import { maturityLevels } from "@/content/requests";
import { Avatar, LevelBadge, PriorityBadge, StatusBadge } from "@/components/Badges";

// Only tickets that existed at build time; anything else is a clean 404
// (never read ticket files at runtime).
export const dynamicParams = false;

export function generateStaticParams() {
  return allTickets().map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: PageProps<"/requests/[id]">): Promise<Metadata> {
  const t = getTicket((await params).id);
  return { title: t ? `${t.id} · ${t.title}` : "Not found" };
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "UTC" }) + " UTC";

export default async function TicketPage({ params }: PageProps<"/requests/[id]">) {
  const t = getTicket((await params).id);
  if (!t) notFound();
  const requester = getPerson(t.requester)!;

  return (
    <div className="max-w-6xl">
      <Link href="/requests" className="text-sm text-muted hover:text-fg">← Data requests</Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-medium tracking-tight">{t.title}</h1>
        <StatusBadge status={t.status} />
      </div>
      <p className="mt-1 text-sm text-muted">{t.id} · opened {fmt(t.created_at)}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {t.thread.map((m, i) => {
            const author = getPerson(m.from);
            const mine = m.from === "arthur";
            return (
              <article key={i} className={`rounded-lg border p-5 ${mine ? "border-brand/40 bg-brand-soft" : "border-line bg-surface"}`}>
                <header className="flex items-center gap-3">
                  <Avatar id={m.from} />
                  <div>
                    <p className="text-sm font-medium">{author?.name ?? m.from}</p>
                    <p className="text-xs text-muted">{author?.title} · {fmt(m.at)}</p>
                  </div>
                </header>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{m.text}</p>
              </article>
            );
          })}

          {t.resolution && (
            <section className="rounded-lg border-2 border-brand p-5">
              <h2 className="font-display text-lg font-medium">Resolution</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{t.resolution.summary}</p>
              {t.resolution.links && t.resolution.links.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm">
                  {t.resolution.links.map((l) => (
                    <li key={l.url}>
                      <a href={l.url} className="underline underline-offset-4" target="_blank" rel="noreferrer">{l.label}</a>
                    </li>
                  ))}
                </ul>
              )}
              {t.resolution.sql && (
                <pre className="mt-4 overflow-x-auto rounded-md bg-sunken p-4 text-xs leading-relaxed"><code>{t.resolution.sql}</code></pre>
              )}
            </section>
          )}
        </div>

        <aside className="h-fit space-y-4 rounded-lg border border-line bg-surface p-5 text-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-muted">Requester</p>
            <p className="mt-2 flex items-center gap-2">
              <Avatar id={t.requester} size={26} />
              <Link href="/people" className="hover:underline">{requester.name}</Link>
            </p>
            <p className="mt-1 text-xs text-muted">{requester.title}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-muted">Priority</p>
            <p className="mt-1"><PriorityBadge priority={t.priority} /></p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-muted">Due</p>
            <p className="mt-1">{t.due}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-muted">Type</p>
            <p className="mt-1 capitalize">{t.category}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-muted">Data needed</p>
            <p className="mt-2"><LevelBadge level={t.level} /></p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{maturityLevels[t.level].description}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
