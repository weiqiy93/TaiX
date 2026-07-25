import { Check, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReturnStage } from "@/types";

export function ProgressTimeline({ stages }: { stages: ReturnStage[] }) {
  return (
    <ol className="space-y-3">
      {stages.map((stage, idx) => {
        const isLast = idx === stages.length - 1;
        return (
          <li key={stage.key} className="relative flex items-start gap-3">
            <div className="flex flex-col items-center">
              <StageIcon status={stage.status} />
              {!isLast && (
                <span
                  className={cn(
                    "mt-0.5 h-6 w-px",
                    stage.status === "complete"
                      ? "bg-emerald-300"
                      : stage.status === "current"
                        ? "bg-primary/40"
                        : "bg-border"
                  )}
                />
              )}
            </div>
            <div className="pb-2">
              <div
                className={cn(
                  "text-sm",
                  stage.status === "upcoming"
                    ? "text-muted-foreground"
                    : "font-medium text-foreground"
                )}
              >
                {stage.label}
              </div>
              {stage.status === "current" && (
                <div className="text-xs text-primary">In progress</div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function StageIcon({ status }: { status: ReturnStage["status"] }) {
  if (status === "complete")
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
        <Check className="h-3 w-3" />
      </span>
    );
  if (status === "current")
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
      </span>
    );
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-white text-muted-foreground">
      <Circle className="h-2 w-2" />
    </span>
  );
}
