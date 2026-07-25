import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  FileText,
  ListChecks,
  MessagesSquare,
  Home,
  MessageCircle,
  FileStack,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppState } from "@/state/AppState";

const cpaNav = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/returns", icon: FolderKanban, label: "Returns" },
  { to: "/clients", icon: Users, label: "Clients" },
  { to: "/documents", icon: FileText, label: "Documents" },
  { to: "/tasks", icon: ListChecks, label: "Tasks" },
  { to: "/messages", icon: MessagesSquare, label: "Messages" },
];

const clientNav = [
  { to: "/client", icon: Home, label: "Home", end: true },
  { to: "/client/return", icon: FileStack, label: "My Return" },
  { to: "/client/documents", icon: FileText, label: "Documents" },
  { to: "/client/messages", icon: MessageCircle, label: "Messages" },
];

export function Sidebar() {
  const { role } = useAppState();
  const nav = role === "cpa" ? cpaNav : clientNav;

  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 shrink-0 flex-col border-r border-border bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-semibold">
          Tx
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">TaxFlow AI</div>
          <div className="text-[11px] text-muted-foreground">
            {role === "cpa" ? "Firm workspace" : "Client portal"}
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-md bg-muted px-3 py-3 text-xs text-muted-foreground">
          <div className="font-medium text-foreground mb-1">Prototype demo</div>
          OCR, AI, and messaging are simulated for the case study.
        </div>
      </div>
    </aside>
  );
}
