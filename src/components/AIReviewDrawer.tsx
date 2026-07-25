import { useEffect, useMemo, useState } from "react";
import {
  X,
  Sparkles,
  Check,
  Pencil,
  ExternalLink,
  Info,
  FileWarning,
  Send,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppState } from "@/state/AppState";
import { aiResults } from "@/data/aiResults";
import { evidenceMap } from "@/data/evidence";
import { ConfidenceBadge, FieldStateBadge } from "@/components/Badges";
import { CorrectionDialog } from "@/components/CorrectionDialog";
import { IssueThread } from "@/components/IssueThread";
import type { FieldState } from "@/types";

export function AIReviewDrawer({
  fieldId,
  onClose,
}: {
  fieldId: string | null;
  onClose: () => void;
}) {
  const { getField, verifyField, getMessagesForField } = useAppState();
  const [correcting, setCorrecting] = useState(false);
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const field = fieldId ? getField(fieldId) : undefined;
  const ai = field?.aiResultId ? aiResults[field.aiResultId] : undefined;

  useEffect(() => {
    if (!fieldId) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fieldId, onClose]);

  const open = !!fieldId && !!field;

  const evidenceList = useMemo(
    () => (ai ? ai.evidenceIds.map((id) => evidenceMap[id]).filter(Boolean) : []),
    [ai]
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/30 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-white shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {field && ai && (
          <>
            <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-primary">
                  <Sparkles className="h-3 w-3" />
                  AI review
                </div>
                <div className="mt-1 text-lg font-semibold leading-tight">
                  {field.label}
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="tabular-nums text-foreground text-base font-semibold">
                    {field.displayValue}
                  </span>
                  <FieldStateBadge state={field.state} />
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4 text-sm">
              <div className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2">
                <div className="text-xs text-muted-foreground">
                  Model confidence
                </div>
                <ConfidenceBadge value={ai.confidence} />
              </div>

              {ai.warning && (
                <div className="flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-inset ring-amber-200">
                  <FileWarning className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{ai.warning}</span>
                </div>
              )}

              <Section title="What AI did">{ai.whatAIDid}</Section>
              <Section title="Why">{ai.reason}</Section>

              {evidenceList.length > 0 && (
                <div>
                  <SectionTitle>Evidence</SectionTitle>
                  <ul className="mt-2 space-y-2">
                    {evidenceList.map((ev) => (
                      <li
                        key={ev.id}
                        className="rounded-md border border-border bg-white px-3 py-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium">
                              {ev.documentName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Page {ev.page} · {ev.section}
                            </div>
                          </div>
                          <div className="text-sm font-semibold tabular-nums">
                            {ev.rawValue.startsWith("Dividends")
                              ? ""
                              : `$${ev.rawValue.split(" ")[0]}`}
                          </div>
                        </div>
                        {ev.rawValue.startsWith("Dividends") && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {ev.rawValue}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {ai.transformation?.formula && (
                <div>
                  <SectionTitle>Calculation</SectionTitle>
                  <div className="mt-2 rounded-md bg-slate-900 px-3 py-2.5 font-mono text-xs text-slate-100">
                    {ai.transformation.formula}
                  </div>
                </div>
              )}

              <div className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2.5">
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
                  <Info className="h-3 w-3" />
                  Recommended action
                </div>
                <div className="mt-1 text-sm text-foreground">
                  {ai.recommendation}
                </div>
              </div>

              {field.correction && (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-900">
                  <div className="font-semibold">
                    Corrected by {field.correction.by}
                  </div>
                  <div className="mt-0.5">
                    Previous AI value: {field.correction.previousValue}
                  </div>
                  <div className="mt-0.5">Reason: {field.correction.reason}</div>
                </div>
              )}

              {getMessagesForField(field.id).length > 0 && (
                <div className="border-t border-border pt-4">
                  <IssueThread fieldId={field.id} />
                </div>
              )}
            </div>

            <footer className="flex flex-wrap items-center gap-2 border-t border-border px-5 py-3">
              {evidenceList.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/returns/${params.id ?? field.returnId}/evidence/${field.id}`
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium hover:bg-muted"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View evidence
                </button>
              )}
              <div className="flex-1" />
              {field.state === "missing" ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="h-3.5 w-3.5" />
                  Request document
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setCorrecting(true)}
                    disabled={field.value === null}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Correct
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      verifyField(field.id);
                      onClose();
                    }}
                    disabled={field.state === "verified"}
                    className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {verifyLabel(field.state)}
                  </button>
                </>
              )}
            </footer>

            <CorrectionDialog
              open={correcting}
              field={field}
              onClose={() => setCorrecting(false)}
              onSaved={() => {
                setCorrecting(false);
                onClose();
              }}
            />
          </>
        )}
      </aside>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <p className="mt-1 text-sm text-foreground">{children}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </div>
  );
}

function verifyLabel(state: FieldState): string {
  if (state === "verified") return "Verified";
  if (state === "needs_review") return "Verify";
  return "Accept";
}
