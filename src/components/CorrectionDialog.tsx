import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useAppState } from "@/state/AppState";
import { aiResults } from "@/data/aiResults";
import { evidenceMap } from "@/data/evidence";
import type { TaxField } from "@/types";

const reasonOptions = [
  "OCR misread",
  "Client provided updated document",
  "Reclassification",
  "Manual correction",
];

export function CorrectionDialog({
  open,
  field,
  onClose,
  onSaved,
}: {
  open: boolean;
  field: TaxField;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { correctField } = useAppState();
  const [value, setValue] = useState<string>(String(field.value ?? ""));
  const [reason, setReason] = useState<string>(reasonOptions[0]);

  useEffect(() => {
    if (open) {
      setValue(String(field.value ?? ""));
      setReason(reasonOptions[0]);
    }
  }, [open, field]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const ai = field.aiResultId ? aiResults[field.aiResultId] : undefined;
  const primaryEvidence = useMemo(
    () => (ai ? evidenceMap[ai.evidenceIds[0]] : undefined),
    [ai]
  );

  const parsed = Number(value.replace(/[$,\s]/g, ""));
  const canSave = Number.isFinite(parsed) && parsed > 0 && parsed !== field.value;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4">
      <div
        className="w-full max-w-md overflow-hidden rounded-lg border border-border bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Correct value
            </div>
            <div className="mt-1 text-base font-semibold">{field.label}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-4 px-5 py-4 text-sm">
          <div className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2">
            <span className="text-xs text-muted-foreground">AI value</span>
            <span className="font-semibold tabular-nums">
              {field.displayValue}
            </span>
          </div>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Correct value (USD)
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1.5 h-9 w-full rounded-md border border-border bg-white px-3 text-sm tabular-nums outline-none focus:border-primary"
              autoFocus
            />
            <span className="mt-1 block text-xs text-muted-foreground">
              Tip: the correct value for this scan is <span className="font-mono">14230</span>.
            </span>
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Reason
            </span>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1.5 h-9 w-full rounded-md border border-border bg-white px-2 text-sm outline-none focus:border-primary"
            >
              {reasonOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          {primaryEvidence && (
            <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs">
              <div className="font-medium">Source</div>
              <div className="text-muted-foreground">
                {primaryEvidence.documentName} · Page {primaryEvidence.page} ·{" "}
                {primaryEvidence.section}
              </div>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => {
              correctField(field.id, parsed, reason);
              onSaved();
            }}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save correction
          </button>
        </footer>
      </div>
    </div>
  );
}
