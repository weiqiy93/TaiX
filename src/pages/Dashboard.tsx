import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  AlertTriangle,
  Inbox,
  CheckCircle2,
  Users,
} from "lucide-react";
import { useAppState } from "@/state/AppState";
import { getPriorityScore, priorityLabel } from "@/lib/priority";
import {
  PriorityBadge,
  StatusBadge,
} from "@/components/Badges";
import { formatDeadline } from "@/lib/utils";

export function Dashboard() {
  const { returns } = useAppState();
  const navigate = useNavigate();

  const ranked = useMemo(
    () =>
      [...returns]
        .map((r) => ({ ...r, score: getPriorityScore(r) }))
        .sort((a, b) => b.score - a.score),
    [returns]
  );

  const needsAttention = ranked.filter(
    (r) => r.status !== "Completed" && r.openIssues > 0
  ).length;

  const counts = {
    needsAction: returns.filter((r) => r.status === "Needs Review").length,
    waiting: returns.filter((r) => r.status === "Waiting on Client").length,
    ready: returns.filter((r) => r.status === "Ready for Review").length,
    completed: returns.filter((r) => r.status === "Completed").length,
  };

  const topThree = ranked.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 md:px-8 md:py-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Good morning, Sarah
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {needsAttention === 0
              ? "You're all clear — nothing needs your attention right now."
              : `${needsAttention} return${needsAttention === 1 ? "" : "s"} need your attention.`}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Ranking updated moments ago
        </div>
      </header>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Priority queue
          </h2>
          <span className="text-xs text-muted-foreground">
            Ranked by deadline, open issues, and status
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {topThree.map((r) => {
            const level = priorityLabel(r.score);
            return (
              <article
                key={r.id}
                className="flex h-full flex-col justify-between rounded-lg border border-border bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-base font-semibold">{r.client}</div>
                      <div className="text-xs text-muted-foreground">
                        {r.year} {r.type}
                      </div>
                    </div>
                    <PriorityBadge level={level} />
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>
                        {r.openIssues > 0
                          ? `${r.openIssues} AI issue${r.openIssues === 1 ? "" : "s"} to review`
                          : "No open AI issues"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatDeadline(r.daysToDeadline)}</span>
                    </div>
                    {r.blocker && (
                      <div className="rounded-md bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800 ring-1 ring-inset ring-amber-200">
                        Blocker: {r.blocker}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/returns/${r.id}`)}
                  className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  {r.status === "Waiting on Client"
                    ? "View request"
                    : r.status === "Ready for Review"
                      ? "Review"
                      : "Review return"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Needs Action"
          value={counts.needsAction}
          accent="text-amber-700 bg-amber-50 ring-amber-200"
        />
        <SummaryCard
          icon={<Users className="h-4 w-4" />}
          label="Waiting on Client"
          value={counts.waiting}
          accent="text-sky-700 bg-sky-50 ring-sky-200"
        />
        <SummaryCard
          icon={<Inbox className="h-4 w-4" />}
          label="Ready for Review"
          value={counts.ready}
          accent="text-violet-700 bg-violet-50 ring-violet-200"
        />
        <SummaryCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Completed"
          value={counts.completed}
          accent="text-emerald-700 bg-emerald-50 ring-emerald-200"
        />
      </section>

      <section className="rounded-lg border border-border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">All returns</h2>
            <p className="text-xs text-muted-foreground">
              Sorted by priority. Click a row to open the return.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Issues</th>
                <th className="px-5 py-3 font-medium">Deadline</th>
                <th className="px-5 py-3 font-medium">Owner</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30"
                >
                  <td className="px-5 py-3">
                    <div className="font-medium">{r.client}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.year} {r.type}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-5 py-3 tabular-nums">
                    {r.openIssues > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                        {r.openIssues}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {formatDeadline(r.daysToDeadline)}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {r.owner}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      to={`/returns/${r.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      Open
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <span
          className={`inline-flex h-6 w-6 items-center justify-center rounded-md ring-1 ring-inset ${accent}`}
        >
          {icon}
        </span>
      </div>
      <div className="mt-3 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
