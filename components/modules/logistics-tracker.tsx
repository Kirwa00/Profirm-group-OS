import { StatTile, SectionCard, Bar, ModuleNote } from "./ui";

const TRANSIT = [
  { shipment: "Maize Grain — Nakuru → Mill", eta: "2026-07-14", status: "In Transit" },
  { shipment: "Avocado Feedstock — Murang'a → Plant", eta: "2026-07-13", status: "In Transit" },
  { shipment: "Packaging Materials — Nairobi", eta: "2026-07-12", status: "Delivered" },
];

const STORAGE = [
  { unit: "Grain Silo 1", pct: 78 },
  { unit: "Grain Silo 2", pct: 45 },
  { unit: "Oil Storage Tank A", pct: 62 },
];

const STATUS_COLOR: Record<string, string> = {
  "In Transit": "bg-warning-amber/15 text-warning-amber",
  Delivered: "bg-success-green/15 text-success-green",
};

export default function LogisticsTracker() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Live Transit" value="2 shipments" />
        <StatTile label="Operating Costs (MTD)" value="$12,400" />
        <StatTile label="On-Time Rate" value="94%" />
        <StatTile label="Storage Utilization" value="62%" />
      </div>

      <SectionCard title="Raw Material Pipeline">
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm font-body">
            <thead>
              <tr className="font-label text-label-sm text-slate-gray uppercase">
                <th className="text-left p-2">Shipment</th>
                <th className="text-left p-2">ETA</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {TRANSIT.map((t) => (
                <tr key={t.shipment} className="border-t border-outline-variant">
                  <td className="p-2 text-on-surface">{t.shipment}</td>
                  <td className="p-2 text-slate-gray">{t.eta}</td>
                  <td className="p-2">
                    <span className={`font-label text-label-sm px-2 py-0.5 rounded uppercase ${STATUS_COLOR[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Silo & Tank Storage">
        <div className="space-y-4">
          {STORAGE.map((s) => (
            <Bar key={s.unit} label={s.unit} value={s.pct} max={100} unit="%" />
          ))}
        </div>
      </SectionCard>

      <ModuleNote>
        Transit and storage figures are representative — connect to the real logistics tracking
        system when available.
      </ModuleNote>
    </div>
  );
}
