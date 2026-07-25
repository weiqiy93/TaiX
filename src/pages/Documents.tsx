import { documents } from "@/data/documents";
import { FileText } from "lucide-react";

export function Documents() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {documents.length} document{documents.length === 1 ? "" : "s"} attached to John Smith's 2025 return.
        </p>
      </header>

      <div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Document</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((d) => (
              <tr
                key={d.id}
                className="border-b border-border last:border-b-0 hover:bg-muted/30"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{d.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{d.type}</td>
                <td className="px-5 py-3 text-muted-foreground">{d.status}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {d.uploadedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
