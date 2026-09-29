// Generate a stakeholder ticket from the request bank.
//
//   npm run ticket                     # random stakeholder
//   npm run ticket -- --from lucas     # a specific stakeholder
//   npm run ticket -- --count 3        # several at once
//
// Picks a request the stakeholder would plausibly send, crosses it with a
// "twist" from their current week (preferably an initiative from their Year 1
// plan that's running or coming up), and writes content/tickets/DR-XXXX.json.
// No API calls: wording comes from the profiles and templates. Claude (in a
// Claude Code session) can rewrite or answer tickets in character later.

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { agents, getPerson } from "../content/people";
import { requestBank, twists, type Priority } from "../content/requests";
import { activeInitiatives } from "../content/plans";
import type { Ticket } from "../lib/ticket-types";

const args = process.argv.slice(2);
const option = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const pick = <T,>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

const dir = path.join(process.cwd(), "content", "tickets");

function nextId(): string {
  const nums = existsSync(dir)
    ? readdirSync(dir).map((f) => Number(f.match(/^DR-(\d+)\.json$/)?.[1] ?? 0))
    : [];
  return `DR-${String(Math.max(0, ...nums) + 1).padStart(4, "0")}`;
}

function priorityFor(twist: string): Priority {
  const urgentWords = /tomorrow|today|Thursday|Friday|next Tuesday|this week|before the weekend|launch week|middle of/i;
  if (urgentWords.test(twist)) return Math.random() < 0.5 ? "Urgent" : "High";
  return pick<Priority>(["Low", "Normal", "Normal", "High"]);
}

function dueDate(priority: Priority): string {
  const days = { Urgent: 1, High: 3, Normal: 7, Low: 14 }[priority];
  const d = new Date(Date.now() + days * 86_400_000);
  return d.toISOString().slice(0, 10);
}

/** Templates behind requests that are still open — avoid asking twice. */
function openTemplateIds(): Set<string> {
  if (!existsSync(dir)) return new Set();
  return new Set(
    readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => JSON.parse(readFileSync(path.join(dir, f), "utf8")) as Ticket)
      .filter((t) => t.status !== "done" && t.status !== "declined")
      .map((t) => t.template_id),
  );
}

function generate(fromId?: string): Ticket {
  const requester = fromId ? getPerson(fromId) : pick(agents);
  if (!requester || !requester.agent) throw new Error(`Unknown stakeholder: ${fromId}`);
  const open = openTemplateIds();
  const all = requestBank.filter((r) => r.from.includes(requester.id));
  const fresh = all.filter((r) => !open.has(r.id));
  const candidates = fresh.length > 0 ? fresh : all;
  const request = pick(candidates);
  // Prefer what's on the requester's plan right now (running or starting
  // within three weeks); fall back to the generic twists.
  const fromPlan = activeInitiatives(requester.id).map((i) => i.twist!);
  const twist = fromPlan.length > 0 && Math.random() < 0.7 ? pick(fromPlan) : pick(twists[requester.id]);
  const priority = priorityFor(twist);

  const text = [pick(requester.greetings!), "", twist, "", request.body, "", pick(requester.signoffs!)].join("\n");

  return {
    id: nextId(),
    created_at: new Date().toISOString(),
    requester: requester.id,
    title: request.title,
    category: request.category,
    level: request.level,
    priority,
    due: dueDate(priority),
    status: "new",
    template_id: request.id,
    thread: [{ from: requester.id, at: new Date().toISOString(), text }],
  };
}

const count = Number(option("count") ?? 1);
for (let i = 0; i < count; i++) {
  const ticket = generate(option("from"));
  writeFileSync(path.join(dir, `${ticket.id}.json`), JSON.stringify(ticket, null, 2) + "\n");
  console.log(`${ticket.id}  ${ticket.priority.padEnd(6)}  ${getPerson(ticket.requester)!.name.padEnd(15)}  ${ticket.title}`);
}
