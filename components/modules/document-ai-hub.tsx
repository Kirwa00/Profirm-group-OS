import { StatTile, SectionCard, ModuleNote } from "./ui";

const JOBS = [
  { doc: "Invoice — Kirinyaga Suppliers Ltd", type: "Invoice", fields: 12, status: "Complete" },
  { doc: "Migingo Drilling Report Q3", type: "Technical Report", fields: 34, status: "Complete" },
  { doc: "Hotel Renovation Contract", type: "Contract", fields: 21, status: "Processing" },
  { doc: "Staff Payslip Batch (18)", type: "Payslip", fields: 8, status: "Complete" },
];

const STATUS_COLOR: Record<string, string> = {
  Complete: "bg-success-green/15 text-success-green",
  Processing: "bg-warning-amber/15 text-warning-amber",
};

export default function DocumentAiHub() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Jobs Processed (MTD)" value="1,284" />
        <StatTile label="Extraction Accuracy" value="96.4%" />
        <StatTile label="Avg. Processing Time" value="4.2s" />
        <StatTile label="In Queue" value="3" />
      </div>

      <SectionCard title="Recent Jobs">
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm font-body">
            <thead>
              <tr className="font-label text-label-sm text-slate-gray uppercase">
                <th className="text-left p-2">Document</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Fields Extracted</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {JOBS.map((j) => (
                <tr key={j.doc} className="border-t border-outline-variant">
                  <td className="p-2 text-on-surface">{j.doc}</td>
                  <td className="p-2 font-label text-label-sm text-deep-navy uppercase">{j.type}</td>
                  <td className="p-2 text-slate-gray">{j.fields}</td>
                  <td className="p-2">
                    <span className={`font-label text-label-sm px-2 py-0.5 rounded uppercase ${STATUS_COLOR[j.status]}`}>
                      {j.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <ModuleNote>
        Job history is representative — wire up to the real OCR/document-AI pipeline&apos;s job
        log when available.
      </ModuleNote>
    </div>
  );
}
