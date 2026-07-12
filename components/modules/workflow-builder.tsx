import { StatTile, SectionCard, ModuleNote } from "./ui";

const WORKFLOWS = [
  { name: "New Lead → CRM Sync", trigger: "Form submission", steps: 4, status: "Active" },
  { name: "Invoice OCR → Ledger Entry", trigger: "Document upload", steps: 6, status: "Active" },
  { name: "Weekly Portfolio Digest", trigger: "Schedule (Mon 08:00)", steps: 3, status: "Active" },
  { name: "Mining Assay Alert", trigger: "Threshold breach", steps: 2, status: "Paused" },
];

const STATUS_COLOR: Record<string, string> = {
  Active: "bg-success-green/15 text-success-green",
  Paused: "bg-surface-container text-on-surface-variant",
};

export default function WorkflowBuilder() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Active Workflows" value="3" />
        <StatTile label="Runs (24h)" value="212" />
        <StatTile label="Success Rate" value="98.6%" />
        <StatTile label="Avg. Run Time" value="1.4s" />
      </div>

      <SectionCard title="Configuration">
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm font-body">
            <thead>
              <tr className="font-label text-label-sm text-slate-gray uppercase">
                <th className="text-left p-2">Workflow</th>
                <th className="text-left p-2">Trigger</th>
                <th className="text-left p-2">Steps</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {WORKFLOWS.map((w) => (
                <tr key={w.name} className="border-t border-outline-variant">
                  <td className="p-2 text-on-surface font-medium">{w.name}</td>
                  <td className="p-2 text-on-surface-variant">{w.trigger}</td>
                  <td className="p-2 text-slate-gray">{w.steps}</td>
                  <td className="p-2">
                    <span className={`font-label text-label-sm px-2 py-0.5 rounded uppercase ${STATUS_COLOR[w.status]}`}>
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Output Schema">
        <p className="font-body text-body-sm text-on-surface-variant">
          Each workflow run emits a structured event (<code className="font-label bg-surface-container px-1 rounded">workflow_id</code>,{" "}
          <code className="font-label bg-surface-container px-1 rounded">status</code>,{" "}
          <code className="font-label bg-surface-container px-1 rounded">duration_ms</code>,{" "}
          <code className="font-label bg-surface-container px-1 rounded">output</code>) to the shared event log for
          cross-venture reporting.
        </p>
      </SectionCard>

      <ModuleNote>
        Workflow list is representative — this is a visual drag-and-drop canvas in the original
        mockup; wire up to the real automation engine (n8n) when ready.
      </ModuleNote>
    </div>
  );
}
