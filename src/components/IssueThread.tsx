import { useState } from "react";
import { Lock, Send, Users } from "lucide-react";
import { useAppState } from "@/state/AppState";
import type { Visibility } from "@/data/messages";
import { cn } from "@/lib/utils";

export function IssueThread({ fieldId }: { fieldId: string }) {
  const { getMessagesForField, addMessage, role } = useAppState();
  const messages = getMessagesForField(fieldId);
  const [body, setBody] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("client");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Conversation
        </div>
        <div className="text-[11px] text-muted-foreground">
          {messages.length} message{messages.length === 1 ? "" : "s"}
        </div>
      </div>

      <ol className="space-y-2">
        {messages.map((m) => (
          <li
            key={m.id}
            className={cn(
              "rounded-md border px-3 py-2.5 text-sm",
              m.visibility === "internal"
                ? "border-slate-300 bg-slate-50"
                : "border-border bg-white"
            )}
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {m.author}
                </span>
                <span className="text-muted-foreground">
                  {m.authorRole === "cpa" ? "CPA" : "Client"}
                </span>
                <span className="text-muted-foreground">
                  · {formatDate(m.at)}
                </span>
              </div>
              {m.visibility === "internal" ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-700">
                  <Lock className="h-2.5 w-2.5" />
                  Internal
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-700">
                  <Users className="h-2.5 w-2.5" />
                  Client visible
                </span>
              )}
            </div>
            <p className="mt-1.5 leading-snug text-foreground">{m.body}</p>
          </li>
        ))}
      </ol>

      <div className="rounded-md border border-border bg-white p-3">
        {role === "cpa" && (
          <div className="mb-2 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setVisibility("client")}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium",
                visibility === "client"
                  ? "bg-sky-100 text-sky-800"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Users className="h-3 w-3" />
              Client visible
            </button>
            <button
              type="button"
              onClick={() => setVisibility("internal")}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium",
                visibility === "internal"
                  ? "bg-slate-200 text-slate-800"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Lock className="h-3 w-3" />
              Internal note
            </button>
          </div>
        )}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
          placeholder={
            role === "cpa"
              ? visibility === "client"
                ? "Message the client…"
                : "Add an internal note…"
              : "Reply to your CPA…"
          }
          className="w-full resize-none rounded-md border border-border bg-white px-2.5 py-1.5 text-sm outline-none focus:border-primary"
        />
        <div className="mt-2 flex items-center justify-end">
          <button
            type="button"
            disabled={!body.trim()}
            onClick={() => {
              addMessage(fieldId, body, role === "cpa" ? visibility : "client");
              setBody("");
            }}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
