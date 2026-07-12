import { StatTile, SectionCard, ModuleNote } from "./ui";

const LIFECYCLE = [
  { phase: "Exploration & Permitting", status: "Complete", pct: 100 },
  { phase: "Feasibility Study", status: "Complete", pct: 100 },
  { phase: "Construction", status: "In Progress", pct: 62 },
  { phase: "Commissioning", status: "Upcoming", pct: 0 },
  { phase: "Steady-State Production", status: "Upcoming", pct: 0 },
];

const CASHFLOW = [-180, -260, -90, 40, 110, 165, 210, 240];

export default function FinancialHub() {
  const maxAbs = Math.max(...CASHFLOW.map((v) => Math.abs(v)));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Project NPV (8%)" value="$1.42B" sub="Base case, $2,300/oz gold" />
        <StatTile label="IRR" value="34.6%" />
        <StatTile label="AISC" value="$981/oz" sub="All-in sustaining cost" />
        <StatTile label="Payback Period" value="2.3 yrs" />
      </div>

      <SectionCard title="Project Lifecycle Timeline">
        <div className="space-y-4">
          {LIFECYCLE.map((phase) => (
            <div key={phase.phase}>
              <div className="flex justify-between font-body text-body-sm mb-1">
                <span className="text-on-surface">{phase.phase}</span>
                <span className="font-label text-label-sm text-slate-gray uppercase">
                  {phase.status}
                </span>
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-deep-navy rounded-full"
                  style={{ width: `${phase.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Cumulative Cash Flow ($M)">
        <div className="flex items-end gap-2 h-40">
          {CASHFLOW.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
              <div
                className={`w-full rounded-t ${v < 0 ? "bg-error-container" : "bg-success-green/60"}`}
                style={{ height: `${(Math.abs(v) / maxAbs) * 100}%` }}
              />
              <span className="font-label text-label-sm text-slate-gray mt-1">Y{i + 1}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <ModuleNote>
        Representative figures for planning purposes — adapted from the Migingo Gold financial
        model mockup. Not yet wired to the live financial sensitivity dataset.
      </ModuleNote>
    </div>
  );
}
