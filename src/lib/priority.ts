import type { TaxReturn } from "@/types";

export function getPriorityScore(r: TaxReturn): number {
  let score = 0;

  if (r.daysToDeadline <= 3) score += 50;
  else if (r.daysToDeadline <= 7) score += 30;
  else if (r.daysToDeadline <= 14) score += 10;

  score += r.openIssues * 10;

  if (r.status === "Needs Review") score += 20;
  if (r.status === "Waiting on Client") score += 10;

  return score;
}

export function priorityLabel(score: number): "High" | "Medium" | "Low" {
  if (score >= 60) return "High";
  if (score >= 30) return "Medium";
  return "Low";
}
