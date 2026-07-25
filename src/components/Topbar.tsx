import { Bell, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAppState } from "@/state/AppState";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { role, setRole } = useAppState();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-white/95 px-4 backdrop-blur md:px-6">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search clients, returns, documents…"
          className="h-9 w-full rounded-md border border-border bg-muted/40 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-white"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-3 rounded-md border border-border bg-white px-2 py-1.5 text-sm hover:bg-muted"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
              SC
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-sm font-medium leading-tight">Sarah Chen</div>
              <div className="text-[11px] text-muted-foreground">
                Working as {role === "cpa" ? "CPA Preparer" : "Personal Taxpayer"}
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-11 z-40 w-64 overflow-hidden rounded-md border border-border bg-white shadow-lg"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div className="border-b border-border px-4 py-3">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Switch role
                </div>
              </div>
              {(
                [
                  { key: "cpa", title: "CPA Preparer", sub: "Firm workspace" },
                  {
                    key: "client",
                    title: "Personal Taxpayer",
                    sub: "Your personal return",
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setRole(opt.key);
                    setMenuOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-muted",
                    role === opt.key && "bg-primary/5"
                  )}
                >
                  <div>
                    <div className="font-medium">{opt.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {opt.sub}
                    </div>
                  </div>
                  {role === opt.key && (
                    <span className="text-xs font-medium text-primary">
                      Active
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
