export type Visibility = "client" | "internal";

export type Message = {
  id: string;
  fieldId: string;
  author: string;
  authorRole: "cpa" | "client";
  visibility: Visibility;
  body: string;
  at: string;
};

export const initialMessages: Message[] = [
  {
    id: "MSG-1",
    fieldId: "FLD-1003",
    author: "Sarah Chen",
    authorRole: "cpa",
    visibility: "client",
    body: "Hi John — could you upload your Fidelity 1099-DIV? We see dividend activity in your December brokerage statement but no 1099-DIV on file.",
    at: "2026-02-21T14:22:00Z",
  },
  {
    id: "MSG-2",
    fieldId: "FLD-1003",
    author: "John Smith",
    authorRole: "client",
    visibility: "client",
    body: "I haven't received one yet — I'll follow up with Fidelity today.",
    at: "2026-02-22T09:08:00Z",
  },
  {
    id: "MSG-3",
    fieldId: "FLD-1003",
    author: "David Park",
    authorRole: "cpa",
    visibility: "internal",
    body: "Brokerage statement shows $612 across 6 positions. Confirm whether Fidelity actually issued a 1099-DIV before we file.",
    at: "2026-02-22T15:40:00Z",
  },
];
