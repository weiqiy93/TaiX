import type { AIResult } from "@/types";

export const aiResults: Record<string, AIResult> = {
  "AI-1001": {
    id: "AI-1001",
    fieldId: "FLD-1001",
    confidence: 0.98,
    whatAIDid: "Extracted Box 1 wages from the Acme Corp W-2.",
    reason: "High OCR confidence and unambiguous digits.",
    recommendation: "No action needed. Value looks reliable.",
    evidenceIds: ["EV-W2-1"],
    transformation: { type: "direct" },
  },
  "AI-1002": {
    id: "AI-1002",
    fieldId: "FLD-1002",
    confidence: 0.87,
    whatAIDid: "Combined interest reported across two 1099-INT documents.",
    reason: "Both documents map to taxable interest income (Box 1).",
    recommendation: "Verify the combined value before locking.",
    evidenceIds: ["EV-CHASE-INT", "EV-FIDELITY-INT"],
    transformation: {
      type: "sum",
      formula: "$1,820 + $3,000 = $4,820",
    },
  },
  "AI-1003": {
    id: "AI-1003",
    fieldId: "FLD-1003",
    confidence: 0.42,
    whatAIDid:
      "Flagged a likely missing 1099-DIV based on brokerage dividend activity.",
    reason:
      "Fidelity brokerage statement shows $612 of dividend income, but no 1099-DIV was uploaded.",
    recommendation: "Request the Fidelity 1099-DIV from the client.",
    evidenceIds: ["EV-FIDELITY-BROKERAGE"],
    warning: "Possible missing 1099-DIV",
  },
  "AI-1004": {
    id: "AI-1004",
    fieldId: "FLD-1004",
    confidence: 0.95,
    whatAIDid: "Reconciled capital gains from broker consolidated 1099-B.",
    reason: "Totals match the broker-provided summary.",
    recommendation: "No action needed.",
    evidenceIds: ["EV-FIDELITY-BROKERAGE"],
    transformation: { type: "direct" },
  },
  "AI-1005": {
    id: "AI-1005",
    fieldId: "FLD-1005",
    confidence: 0.61,
    whatAIDid: "Extracted Box 1 mortgage interest from Form 1098.",
    reason:
      "The source image is low quality and the final two digits are ambiguous.",
    recommendation: "Review the source before approving.",
    evidenceIds: ["EV-1098"],
    transformation: { type: "direct" },
    warning: "Low-confidence OCR on final digits",
  },
  "AI-1006": {
    id: "AI-1006",
    fieldId: "FLD-1006",
    confidence: 0.94,
    whatAIDid: "Aggregated donation receipts from uploaded PDFs.",
    reason: "Amounts match the year-end donation letters.",
    recommendation: "No action needed.",
    evidenceIds: [],
    transformation: { type: "sum", formula: "$1,200 + $800 + $400 = $2,400" },
  },
};
