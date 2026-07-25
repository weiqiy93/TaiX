import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { initialReturns } from "@/data/returns";
import { initialFields } from "@/data/fields";
import { initialMessages, type Message, type Visibility } from "@/data/messages";
import type { TaxField, TaxReturn } from "@/types";

export type Role = "cpa" | "client";

type AppStateContextValue = {
  role: Role;
  setRole: (r: Role) => void;
  returns: TaxReturn[];
  fields: TaxField[];
  messages: Message[];
  getReturn: (id: string) => TaxReturn | undefined;
  getField: (id: string) => TaxField | undefined;
  getFieldsForReturn: (returnId: string) => TaxField[];
  getMessagesForField: (fieldId: string) => Message[];
  addMessage: (fieldId: string, body: string, visibility: Visibility) => void;
  verifyField: (fieldId: string) => void;
  correctField: (fieldId: string, newValue: number, reason: string) => void;
  dismissWarning: (fieldId: string) => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

function formatMoney(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("cpa");
  const [returns, setReturns] = useState<TaxReturn[]>(initialReturns);
  const [fields, setFields] = useState<TaxField[]>(initialFields);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const getReturn = useCallback(
    (id: string) => returns.find((r) => r.id === id),
    [returns]
  );

  const getField = useCallback(
    (id: string) => fields.find((f) => f.id === id),
    [fields]
  );

  const getFieldsForReturn = useCallback(
    (returnId: string) => fields.filter((f) => f.returnId === returnId),
    [fields]
  );

  const getMessagesForField = useCallback(
    (fieldId: string) =>
      messages
        .filter((m) => m.fieldId === fieldId)
        .sort((a, b) => a.at.localeCompare(b.at)),
    [messages]
  );

  const addMessage = useCallback(
    (fieldId: string, body: string, visibility: Visibility) => {
      const trimmed = body.trim();
      if (!trimmed) return;
      setMessages((prev) => [
        ...prev,
        {
          id: `MSG-${prev.length + 1}-${Date.now()}`,
          fieldId,
          author: role === "cpa" ? "Sarah Chen" : "John Smith",
          authorRole: role,
          visibility,
          body: trimmed,
          at: new Date().toISOString(),
        },
      ]);
    },
    [role]
  );

  const decrementIssueIfResolved = useCallback(
    (previousState: TaxField["state"], returnId: string) => {
      if (previousState === "needs_review" || previousState === "missing") {
        setReturns((prev) =>
          prev.map((r) =>
            r.id === returnId
              ? { ...r, openIssues: Math.max(0, r.openIssues - 1) }
              : r
          )
        );
      }
    },
    []
  );

  const verifyField = useCallback(
    (fieldId: string) => {
      setFields((prev) => {
        const target = prev.find((f) => f.id === fieldId);
        if (!target) return prev;
        if (target.state === "verified") return prev;
        decrementIssueIfResolved(target.state, target.returnId);
        return prev.map((f) =>
          f.id === fieldId ? { ...f, state: "verified" as const } : f
        );
      });
    },
    [decrementIssueIfResolved]
  );

  const correctField = useCallback(
    (fieldId: string, newValue: number, reason: string) => {
      setFields((prev) => {
        const target = prev.find((f) => f.id === fieldId);
        if (!target) return prev;
        decrementIssueIfResolved(target.state, target.returnId);
        return prev.map((f) =>
          f.id === fieldId
            ? {
                ...f,
                value: newValue,
                displayValue: formatMoney(newValue),
                state: "verified" as const,
                correction: {
                  by: "Sarah Chen",
                  at: new Date().toISOString(),
                  previousValue: f.displayValue,
                  reason,
                },
              }
            : f
        );
      });
    },
    [decrementIssueIfResolved]
  );

  const dismissWarning = useCallback(
    (fieldId: string) => {
      setFields((prev) => {
        const target = prev.find((f) => f.id === fieldId);
        if (!target) return prev;
        decrementIssueIfResolved(target.state, target.returnId);
        return prev.map((f) =>
          f.id === fieldId ? { ...f, state: "locked" as const } : f
        );
      });
    },
    [decrementIssueIfResolved]
  );

  const value = useMemo(
    () => ({
      role,
      setRole,
      returns,
      fields,
      messages,
      getReturn,
      getField,
      getFieldsForReturn,
      getMessagesForField,
      addMessage,
      verifyField,
      correctField,
      dismissWarning,
    }),
    [
      role,
      returns,
      fields,
      messages,
      getReturn,
      getField,
      getFieldsForReturn,
      getMessagesForField,
      addMessage,
      verifyField,
      correctField,
      dismissWarning,
    ]
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
