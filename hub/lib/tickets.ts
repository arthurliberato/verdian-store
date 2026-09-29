// Tickets are JSON files in content/tickets/, one per request. They're read
// at build time, so every new ticket or reply is a commit and the hub
// redeploys with it.

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Ticket } from "./ticket-types";

export * from "./ticket-types";

export const TICKETS_DIR = path.join(process.cwd(), "content", "tickets");

export function allTickets(): Ticket[] {
  return readdirSync(TICKETS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(path.join(TICKETS_DIR, f), "utf8")) as Ticket)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function getTicket(id: string): Ticket | undefined {
  return allTickets().find((t) => t.id === id);
}
