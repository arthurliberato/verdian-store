import type { Priority } from "@/content/requests";
import { maturityLevels, type MaturityLevel } from "@/content/requests";
import { statusLabels, type TicketStatus } from "@/lib/ticket-types";
import { getPerson } from "@/content/people";

const pill = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

export function StatusBadge({ status }: { status: TicketStatus }) {
  const tone: Record<TicketStatus, string> = {
    new: "bg-brand text-brand-fg",
    in_progress: "bg-amber-200 text-amber-950 dark:bg-amber-900 dark:text-amber-100",
    waiting: "bg-sky-200 text-sky-950 dark:bg-sky-900 dark:text-sky-100",
    done: "bg-sunken text-muted",
    declined: "bg-sunken text-muted line-through",
  };
  return <span className={`${pill} ${tone[status]}`}>{statusLabels[status]}</span>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const tone: Record<Priority, string> = {
    Urgent: "text-red-700 dark:text-red-400",
    High: "text-orange-700 dark:text-orange-400",
    Normal: "text-fg",
    Low: "text-muted",
  };
  return <span className={`text-xs font-medium ${tone[priority]}`}>{priority}</span>;
}

export function LevelBadge({ level }: { level: MaturityLevel }) {
  return (
    <span className={`${pill} border border-line text-muted`} title={maturityLevels[level].description}>
      L{level} · {maturityLevels[level].name}
    </span>
  );
}

export function Avatar({ id, size = 32 }: { id: string; size?: number }) {
  const person = getPerson(id);
  const initials = person ? person.name.split(" ").map((n) => n[0]).join("").slice(0, 2) : "?";
  return (
    <span
      aria-hidden="true"
      className="inline-grid shrink-0 place-items-center rounded-full bg-brand-soft font-medium text-fg"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}
