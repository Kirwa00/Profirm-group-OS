import { StatTile, SectionCard, ModuleNote } from "./ui";

const ASSAYS = [
  { sample: "Tank 4 - Barren", au: "0.02 g/t", time: "06:00" },
  { sample: "Tank 1 - Pregnant", au: "38.4 g/t", time: "08:00" },
  { sample: "Feed Composite", au: "3.1 g/t", time: "10:00" },
  { sample: "Tailings", au: "0.08 g/t", time: "12:00" },
];

const SECURITY = [
  { zone: "Gold Room", status: "Locked", detail: "Dual biometric access, last entry 09:14" },
  { zone: "Elution / Smelt House", status: "Locked", detail: "1 authorized crew on-site" },
  { zone: "Perimeter — East Gate", status: "Monitored", detail: "CCTV nominal, 0 incidents (24h)" },
];

export default function CilPlant() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Throughput" value="2,340 t/d" sub="Design: 2,500 t/d" />
        <StatTile label="Recovery" value="93.8%" />
        <StatTile label="24h Gold Pour Forecast" value="41.2 oz" />
        <StatTile label="Cyanide Consumption" value="0.62 kg/t" />
      </div>

      <SectionCard title="Recent Sample Assays">
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm font-body">
            <thead>
              <tr className="font-label text-label-sm text-slate-gray uppercase">
                <th className="text-left p-2">Sample</th>
                <th className="text-left p-2">Au Grade</th>
                <th className="text-left p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {ASSAYS.map((a) => (
                <tr key={a.sample} className="border-t border-outline-variant">
                  <td className="p-2 text-on-surface">{a.sample}</td>
                  <td className="p-2 font-label text-label-sm text-deep-navy">{a.au}</td>
                  <td className="p-2 text-slate-gray">{a.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Gold Room & Security">
        <div className="space-y-3">
          {SECURITY.map((s) => (
            <div
              key={s.zone}
              className="flex items-start gap-3 border-b border-outline-variant last:border-0 pb-3 last:pb-0"
            >
              <span className="material-symbols-outlined text-metallic-gold mt-0.5">lock_person</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-body text-body-md text-on-surface font-medium">{s.zone}</p>
                  <span className="font-label text-label-sm px-2 py-0.5 rounded bg-success-green/15 text-success-green uppercase">
                    {s.status}
                  </span>
                </div>
                <p className="font-body text-body-sm text-slate-gray">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <ModuleNote>
        Plant and security telemetry are representative — connect to SCADA / access-control
        feeds when the site network is available.
      </ModuleNote>
    </div>
  );
}
