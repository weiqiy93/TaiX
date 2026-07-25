import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, Check, Pencil } from "lucide-react";
import { useAppState } from "@/state/AppState";
import { aiResults } from "@/data/aiResults";
import { evidenceMap } from "@/data/evidence";
import {
  ConfidenceBadge,
  FieldStateBadge,
} from "@/components/Badges";
import { CorrectionDialog } from "@/components/CorrectionDialog";
import { cn } from "@/lib/utils";

export function EvidenceReview() {
  const { id, fieldId } = useParams<{ id: string; fieldId: string }>();
  const navigate = useNavigate();
  const { getField, getReturn, verifyField } = useAppState();
  const [activeEvidenceIdx, setActiveEvidenceIdx] = useState(0);
  const [correcting, setCorrecting] = useState(false);

  const field = fieldId ? getField(fieldId) : undefined;
  const ret = id ? getReturn(id) : undefined;
  const ai = field?.aiResultId ? aiResults[field.aiResultId] : undefined;

  const evidenceList = useMemo(
    () =>
      ai ? ai.evidenceIds.map((eid) => evidenceMap[eid]).filter(Boolean) : [],
    [ai]
  );
  const activeEvidence = evidenceList[activeEvidenceIdx];

  if (!field || !ret || !ai) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-xl font-semibold">Evidence not available</h1>
        <Link
          to={`/returns/${id ?? ""}`}
          className="mt-3 inline-block text-sm text-primary hover:underline"
        >
          ← Back to return
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>

      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
      >
        <Link to="/" className="hover:text-foreground">
          Returns
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/returns/${ret.id}`} className="hover:text-foreground">
          {ret.client}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span>{field.section}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{field.label}</span>
      </nav>

      <header className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Source review
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {field.label}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-base font-semibold tabular-nums text-foreground">
              {field.displayValue}
            </span>
            <FieldStateBadge state={field.state} />
            <ConfidenceBadge value={ai.confidence} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCorrecting(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium hover:bg-muted"
          >
            <Pencil className="h-3.5 w-3.5" />
            Correct
          </button>
          <button
            type="button"
            onClick={() => {
              verifyField(field.id);
              navigate(`/returns/${ret.id}`);
            }}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Check className="h-3.5 w-3.5" />
            Verify
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
        <aside className="space-y-4">
          <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Return field
            </div>
            <div className="mt-2 text-sm">
              <div className="font-medium">{field.label}</div>
              <div className="text-muted-foreground">
                {ret.year} {ret.type} · {field.section}
              </div>
            </div>
            <div className="mt-3 rounded-md bg-muted/60 px-3 py-2">
              <div className="text-xs text-muted-foreground">Final value</div>
              <div className="text-xl font-semibold tabular-nums">
                {field.displayValue}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Evidence
            </div>
            <ul className="mt-2 space-y-2">
              {evidenceList.map((ev, idx) => (
                <li key={ev.id}>
                  <button
                    type="button"
                    onClick={() => setActiveEvidenceIdx(idx)}
                    className={cn(
                      "flex w-full items-start justify-between gap-3 rounded-md border px-3 py-2 text-left text-sm transition",
                      idx === activeEvidenceIdx
                        ? "border-primary bg-primary/5"
                        : "border-border bg-white hover:bg-muted"
                    )}
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {ev.documentName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Page {ev.page} · {ev.section}
                      </div>
                    </div>
                    <div className="text-sm font-semibold tabular-nums whitespace-nowrap">
                      {ev.rawValue.startsWith("Dividends") ||
                      ev.rawValue.includes("??")
                        ? ""
                        : `$${ev.rawValue.split(" ")[0]}`}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {ai.transformation?.formula && (
            <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Calculation
              </div>
              <div className="mt-2 rounded-md bg-slate-900 px-3 py-2.5 font-mono text-xs text-slate-100">
                {ai.transformation.formula}
              </div>
            </section>
          )}

          <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Related to
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link
                  to={`/returns/${ret.id}`}
                  className="text-primary hover:underline"
                >
                  {ret.year} {ret.type}
                </Link>
              </li>
              <li className="text-muted-foreground">
                {field.section} · {field.label}
              </li>
              <li className="text-muted-foreground">AI review issue</li>
            </ul>
          </section>
        </aside>

        <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
          <header className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">
                {activeEvidence.documentName}
              </div>
              <div className="text-xs text-muted-foreground">
                Page {activeEvidence.page} · {activeEvidence.section}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Raw value:{" "}
              <span className="font-mono text-foreground">
                {activeEvidence.rawValue}
              </span>
            </div>
          </header>

          <div className="relative overflow-hidden rounded-md border border-border bg-muted/30">
            <img
              src={activeEvidence.imageSrc}
              alt={activeEvidence.documentName}
              className="block w-full"
            />
            <span
              className="pointer-events-none absolute rounded-sm ring-4 ring-amber-400/70 shadow-[0_0_0_2px_rgba(251,191,36,0.4)]"
              style={{
                left: `${activeEvidence.highlight.x}%`,
                top: `${activeEvidence.highlight.y}%`,
                width: `${activeEvidence.highlight.w}%`,
                height: `${activeEvidence.highlight.h}%`,
              }}
              aria-label="Highlighted source location"
            />
          </div>
        </section>
      </div>

      <CorrectionDialog
        open={correcting}
        field={field}
        onClose={() => setCorrecting(false)}
        onSaved={() => {
          setCorrecting(false);
          navigate(`/returns/${ret.id}`);
        }}
      />
    </div>
  );
}
