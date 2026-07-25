import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  Users,
} from "lucide-react";
import { useAppState } from "@/state/AppState";
import { johnSmithStages } from "@/data/stages";
import { aiResults } from "@/data/aiResults";
import { ProgressTimeline } from "@/components/ProgressTimeline";
import { ProgressBar } from "@/components/ProgressBar";
import {
  ConfidenceBadge,
  FieldStateBadge,
  StatusBadge,
} from "@/components/Badges";
import { AIReviewDrawer } from "@/components/AIReviewDrawer";
import type { TaxField } from "@/types";
import { cn } from "@/lib/utils";

export function ReturnDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReturn, getFieldsForReturn } = useAppState();
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);

  const ret = id ? getReturn(id) : undefined;
  const fields = id ? getFieldsForReturn(id) : [];

  const bySection = useMemo(() => {
    const map = new Map<string, TaxField[]>();
    for (const f of fields) {
      if (!map.has(f.section)) map.set(f.section, []);
      map.get(f.section)!.push(f);
    }
    return Array.from(map.entries());
  }, [fields]);

  if (!ret) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-xl font-semibold">Return not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested return does not exist in this prototype.
        </p>
        <Link to="/" className="mt-4 inline-block text-sm text-primary hover:underline">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to review queue
      </button>

      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
      >
        <Link to="/" className="hover:text-foreground">
          Returns
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{ret.client}</span>
        <ChevronRight className="h-3 w-3" />
        <span>{ret.year} {ret.type}</span>
      </nav>

      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{ret.client}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{ret.year} {ret.type}</span>
            <span>·</span>
            <StatusBadge status={ret.status} />
          </div>
        </div>
        <div className="w-full md:w-72">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Return progress</span>
            <span className="font-semibold tabular-nums">{ret.progress}%</span>
          </div>
          <ProgressBar value={ret.progress} />
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-4">
          <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Process
            </div>
            <div className="mt-3">
              <ProgressTimeline stages={johnSmithStages} />
            </div>
          </section>

          <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Next action
            </div>
            <div className="mt-2 flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                SC
              </div>
              <div className="text-sm">
                <div className="font-medium">{ret.owner}</div>
                <div className="text-muted-foreground">
                  Review {ret.openIssues} AI-flagged field
                  {ret.openIssues === 1 ? "" : "s"}
                </div>
              </div>
            </div>
          </section>

          {ret.blocker && (
            <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5" />
                Blocking completion
              </div>
              <div className="mt-2 text-sm text-amber-900">{ret.blocker}</div>
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1 rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100"
              >
                <Users className="h-3 w-3" />
                Message client
              </button>
            </section>
          )}
        </aside>

        <div className="space-y-6">
          {bySection.map(([section, sectionFields]) => (
            <section
              key={section}
              className="rounded-lg border border-border bg-white shadow-sm"
            >
              <header className="flex items-center justify-between border-b border-border px-5 py-3">
                <div className="text-sm font-semibold">{section}</div>
                <div className="text-xs text-muted-foreground">
                  {sectionFields.length} field
                  {sectionFields.length === 1 ? "" : "s"}
                </div>
              </header>
              <ul>
                {sectionFields.map((f) => {
                  const ai = f.aiResultId ? aiResults[f.aiResultId] : undefined;
                  const interactive =
                    f.state !== "locked" && !!f.aiResultId;
                  return (
                    <li
                      key={f.id}
                      className={cn(
                        "flex items-center justify-between gap-3 border-b border-border px-5 py-3 last:border-b-0",
                        interactive
                          ? "cursor-pointer hover:bg-muted/40"
                          : "opacity-90"
                      )}
                      onClick={() => interactive && setActiveFieldId(f.id)}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{f.label}</span>
                          {ai?.warning && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-700">
                              <Sparkles className="h-3 w-3" />
                              {ai.warning}
                            </span>
                          )}
                        </div>
                        {f.correction && (
                          <div className="mt-0.5 text-[11px] text-emerald-700">
                            Corrected by {f.correction.by} · was{" "}
                            {f.correction.previousValue}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {ai && f.state !== "verified" && (
                          <ConfidenceBadge value={ai.confidence} />
                        )}
                        <div className="w-24 text-right text-sm font-semibold tabular-nums">
                          {f.displayValue}
                        </div>
                        <FieldStateBadge state={f.state} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <AIReviewDrawer
        fieldId={activeFieldId}
        onClose={() => setActiveFieldId(null)}
      />
    </div>
  );
}
