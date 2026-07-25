export type ReturnStatus =
  | "Needs Review"
  | "Waiting on Client"
  | "Ready for Review"
  | "Completed";

export type FieldState =
  | "ai"
  | "verified"
  | "needs_review"
  | "editable"
  | "locked"
  | "missing";

export type TaxReturn = {
  id: string;
  client: string;
  year: number;
  type: string;
  status: ReturnStatus;
  progress: number;
  owner: string;
  openIssues: number;
  blocker?: string;
  daysToDeadline: number;
};

export type Correction = {
  by: string;
  at: string;
  previousValue: string;
  reason: string;
};

export type TaxField = {
  id: string;
  returnId: string;
  section: string;
  label: string;
  value: number | null;
  displayValue: string;
  state: FieldState;
  aiResultId?: string;
  correction?: Correction;
};

export type TransformationType = "direct" | "sum" | "manual";

export type AIResult = {
  id: string;
  fieldId: string;
  confidence: number;
  whatAIDid: string;
  reason: string;
  recommendation: string;
  evidenceIds: string[];
  transformation?: {
    type: TransformationType;
    formula?: string;
  };
  warning?: string;
};

export type Evidence = {
  id: string;
  documentId: string;
  documentName: string;
  page: number;
  section: string;
  rawValue: string;
  imageSrc: string;
  highlight: { x: number; y: number; w: number; h: number };
};

export type TaxDocument = {
  id: string;
  name: string;
  type: string;
  status: "Verified" | "Needs Review" | "Processed";
  returnId?: string;
  uploadedAt: string;
};

export type ReturnStage = {
  key: string;
  label: string;
  status: "complete" | "current" | "upcoming";
};
