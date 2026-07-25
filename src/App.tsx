import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Dashboard } from "@/pages/Dashboard";
import { ReturnDetail } from "@/pages/ReturnDetail";
import { EvidenceReview } from "@/pages/EvidenceReview";
import { Documents } from "@/pages/Documents";
import { ClientHome } from "@/pages/ClientHome";
import { Placeholder } from "@/pages/Placeholder";
import { useAppState } from "@/state/AppState";

function CPARoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/returns" element={<Placeholder title="Returns" note="The dashboard is the entry point for return work in this prototype." />} />
      <Route path="/returns/:id" element={<ReturnDetail />} />
      <Route
        path="/returns/:id/evidence/:fieldId"
        element={<EvidenceReview />}
      />
      <Route path="/clients" element={<Placeholder title="Clients" />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/tasks" element={<Placeholder title="Tasks" />} />
      <Route path="/messages" element={<Placeholder title="Messages" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function ClientRoutes() {
  return (
    <Routes>
      <Route path="/client" element={<ClientHome />} />
      <Route path="/client/return" element={<Placeholder title="My Return" note="Client view of their 2025 return." />} />
      <Route path="/client/documents" element={<Placeholder title="My Documents" />} />
      <Route path="/client/messages" element={<Placeholder title="Messages" />} />
      <Route path="*" element={<Navigate to="/client" replace />} />
    </Routes>
  );
}

export default function App() {
  const { role } = useAppState();
  return <AppShell>{role === "cpa" ? <CPARoutes /> : <ClientRoutes />}</AppShell>;
}
