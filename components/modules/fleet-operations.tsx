import { StatTile, SectionCard, ModuleNote } from "./ui";

const BLAST_SCHEDULE = [
  { block: "Sector A7 - Bench 12", date: "2026-07-14", tonnes: "18,400t", status: "Scheduled" },
  { block: "Sector A7 - Bench 13", date: "2026-07-17", tonnes: "21,000t", status: "Scheduled" },
  { block: "Sector B2 - Bench 4", date: "2026-07-12", tonnes: "15,200t", status: "Loaded" },
];

const FLEET = [
  { unit: "Haul Truck #1 (CAT 793F)", state: "Hauling", utilization: 92 },
  { unit: "Haul Truck #2 (CAT 793F)", state: "Loading", utilization: 88 },
  { unit: "Excavator #1 (Komatsu PC5500)", state: "Digging", utilization: 95 },
  { unit: "Drill Rig #1", state: "Idle — Maintenance", utilization: 41 },
];

const STATE_COLOR: Record<string, string> = {
  Hauling: "bg-success-green/15 text-success-green",
  Loading: "bg-success-green/15 text-success-green",
  Digging: "bg-success-green/15 text-success-green",
  "Idle — Maintenance": "bg-warning-amber/15 text-warning-amber",
};

export default function FleetOperations() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Fleet Availability" value="87%" />
        <StatTile label="Trucks Active" value="6 / 7" />
        <StatTile label="Strip Ratio (MTD)" value="4.2:1" />
        <StatTile label="Ore Mined (MTD)" value="142,800t" />
      </div>

      <SectionCard title="Blast Schedule">
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm font-body">
            <thead>
              <tr className="font-label text-label-sm text-slate-gray uppercase">
                <th className="text-left p-2">Block</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Volume</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {BLAST_SCHEDULE.map((b) => (
                <tr key={b.block} className="border-t border-outline-variant">
                  <td className="p-2 text-on-surface">{b.block}</td>
                  <td className="p-2 text-slate-gray">{b.date}</td>
                  <td className="p-2 text-on-surface-variant">{b.tonnes}</td>
                  <td className="p-2">
                    <span className="font-label text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant uppercase">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Fleet Status">
        <div className="space-y-3">
          {FLEET.map((f) => (
            <div key={f.unit} className="flex items-center justify-between border-b border-outline-variant last:border-0 pb-3 last:pb-0">
              <div>
                <p className="font-body text-body-md text-on-surface">{f.unit}</p>
                <span className={`font-label text-label-sm px-2 py-0.5 rounded uppercase ${STATE_COLOR[f.state]}`}>
                  {f.state}
                </span>
              </div>
              <p className="font-label text-label-md text-deep-navy">{f.utilization}%</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <ModuleNote>
        Blast schedule and fleet telemetry are representative — wire up to the dispatch
        system&apos;s API when available.
      </ModuleNote>
    </div>
  );
}
