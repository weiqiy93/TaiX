import { FileUp, ShieldCheck } from "lucide-react";

export function ClientHome() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <header>
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          2025 Individual Return
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Your return is under CPA review
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sarah Chen is reviewing your documents. You'll get a notification if
          anything is needed from you.
        </p>
      </header>

      <section className="rounded-lg border border-border bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200">
            <FileUp className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">
              1 item needs your attention
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Upload your Fidelity 1099-DIV so we can finalize your dividend
              income section.
            </div>
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Upload document
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">All other items look good</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Wages, interest, and mortgage interest have been received and are
              being reviewed by your CPA.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
