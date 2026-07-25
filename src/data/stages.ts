import type { ReturnStage } from "@/types";

export const johnSmithStages: ReturnStage[] = [
  { key: "docs", label: "Documents received", status: "complete" },
  { key: "ai", label: "AI processing complete", status: "complete" },
  { key: "cpa", label: "CPA review", status: "current" },
  { key: "client", label: "Client clarification", status: "upcoming" },
  { key: "final", label: "Final review", status: "upcoming" },
  { key: "file", label: "Ready to file", status: "upcoming" },
];
