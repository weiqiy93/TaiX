import type { TaxDocument } from "@/types";

export const documents: TaxDocument[] = [
  {
    id: "DOC-W2",
    name: "Acme Corp W-2 (2025)",
    type: "W-2",
    status: "Verified",
    returnId: "RET-001",
    uploadedAt: "2026-02-14",
  },
  {
    id: "DOC-CHASE-INT",
    name: "Chase 1099-INT (2025)",
    type: "1099-INT",
    status: "Verified",
    returnId: "RET-001",
    uploadedAt: "2026-02-18",
  },
  {
    id: "DOC-FIDELITY-INT",
    name: "Fidelity 1099-INT (2025)",
    type: "1099-INT",
    status: "Needs Review",
    returnId: "RET-001",
    uploadedAt: "2026-02-19",
  },
  {
    id: "DOC-1098",
    name: "Home Loan Form 1098 (2025)",
    type: "1098",
    status: "Needs Review",
    returnId: "RET-001",
    uploadedAt: "2026-02-20",
  },
  {
    id: "DOC-FIDELITY-BROKERAGE",
    name: "Fidelity Brokerage Statement (Dec 2025)",
    type: "Statement",
    status: "Processed",
    returnId: "RET-001",
    uploadedAt: "2026-02-20",
  },
];
