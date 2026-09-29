// Ticket types and labels — no Node APIs, safe to import in client components.

import type { MaturityLevel, Priority, RequestCategory } from "../content/requests";

export type TicketStatus = "new" | "in_progress" | "waiting" | "done" | "declined";

export type Message = {
  from: string; // people id
  at: string; // ISO timestamp
  text: string;
};

export type Ticket = {
  id: string;
  created_at: string;
  requester: string;
  title: string;
  category: RequestCategory;
  level: MaturityLevel;
  priority: Priority;
  due: string; // YYYY-MM-DD
  status: TicketStatus;
  template_id: string;
  thread: Message[];
  resolution?: {
    summary: string;
    links?: { label: string; url: string }[];
    sql?: string;
  };
};

export const statusLabels: Record<TicketStatus, string> = {
  new: "New",
  in_progress: "In progress",
  waiting: "Waiting on requester",
  done: "Done",
  declined: "Declined",
};
