import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Pencil,
  Lock,
  FileWarning,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FieldState, ReturnStatus } from "@/types";

const fieldStateStyles: Record<
  FieldState,
  { label: string; icon: typeof Sparkles; className: string; ring: string }
> = {
  ai: {
    label: "AI Generated",
    icon: Sparkles,
    className: "bg-primary/10 text-primary",
    ring: "ring-primary/30",
  },
  verified: {
    label: "Verified",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700",
    ring: "ring-emerald-200",
  },
  needs_review: {
    label: "Needs Review",
    icon: AlertTriangle,
    className: "bg-amber-50 text-amber-700",
    ring: "ring-amber-200",
  },
  editable: {
    label: "Editable",
    icon: Pencil,
    className: "bg-slate-100 text-slate-700",
    ring: "ring-slate-200",
  },
  locked: {
    label: "Locked",
    icon: Lock,
    className: "bg-slate-100 text-slate-500",
    ring: "ring-slate-200",
  },
  missing: {
    label: "Missing Document",
    icon: FileWarning,
    className: "bg-red-50 text-red-700",
    ring: "ring-red-200",
  },
};

export function FieldStateBadge({
  state,
  className,
}: {
  state: FieldState;
  className?: string;
}) {
  const s = fieldStateStyles[state];
  const Icon = s.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        s.className,
        s.ring,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {s.label}
    </span>
  );
}

const returnStatusStyles: Record<
  ReturnStatus,
  { className: string; dot: string }
> = {
  "Needs Review": {
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  "Waiting on Client": {
    className: "bg-sky-50 text-sky-700 ring-sky-200",
    dot: "bg-sky-500",
  },
  "Ready for Review": {
    className: "bg-violet-50 text-violet-700 ring-violet-200",
    dot: "bg-violet-500",
  },
  Completed: {
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
};

export function StatusBadge({ status }: { status: ReturnStatus }) {
  const s = returnStatusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        s.className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {status}
    </span>
  );
}

export function PriorityBadge({
  level,
}: {
  level: "High" | "Medium" | "Low";
}) {
  const styles = {
    High: "bg-red-50 text-red-700 ring-red-200",
    Medium: "bg-amber-50 text-amber-700 ring-amber-200",
    Low: "bg-slate-100 text-slate-600 ring-slate-200",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset",
        styles[level]
      )}
    >
      <Circle className="h-2 w-2 fill-current" />
      {level} priority
    </span>
  );
}

export function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const tier =
    pct >= 90 ? "high" : pct >= 75 ? "medium" : pct >= 60 ? "low" : "very-low";
  const styles = {
    high: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    medium: "bg-sky-50 text-sky-700 ring-sky-200",
    low: "bg-amber-50 text-amber-700 ring-amber-200",
    "very-low": "bg-red-50 text-red-700 ring-red-200",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset tabular-nums",
        styles[tier]
      )}
    >
      {pct}% confidence
    </span>
  );
}
