import { StatTile, SectionCard, Bar, ModuleNote } from "./ui";

const RESOURCE_DISTRIBUTION = [
  { type: "Oxide Ore", tonnes: 1.8, grade: 2.1 },
  { type: "Transitional Ore", tonnes: 3.4, grade: 2.6 },
  { type: "Sulphide Ore", tonnes: 6.2, grade: 3.4 },
];

const ASSAYS = [
  { hole: "DDH-241", depth: "112.5m", grade: "4.8 g/t", date: "2026-07-08" },
  { hole: "DDH-242", depth: "88.0m", grade: "2.1 g/t", date: "2026-07-09" },
  { hole: "DDH-243", depth: "134.2m", grade: "6.3 g/t", date: "2026-07-10" },
  { hole: "RC-118", depth: "45.0m", grade: "1.7 g/t", date: "2026-07-11" },
];

export default function GeologicalSurvey() {
  const maxTonnes = Math.max(...RESOURCE_DISTRIBUTION.map((r) => r.tonnes));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Measured + Indicated" value="11.4 Mt" sub="@ 3.0 g/t Au" />
        <StatTile label="Inferred" value="4.9 Mt" sub="@ 2.4 g/t Au" />
        <StatTile label="Contained Ounces" value="1.11 Moz" />
        <StatTile label="Resource Model" value="v4.2" sub="Last updated 2026-07-10" />
      </div>

      <SectionCard title="Resource Distribution (Ore Type)">
        <div className="space-y-4">
          {RESOURCE_DISTRIBUTION.map((r) => (
            <Bar key={r.type} label={`${r.type} — ${r.grade} g/t avg grade`} value={r.tonnes} max={maxTonnes} unit=" Mt" />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Real-time Assay Log">
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm font-body">
            <thead>
              <tr className="font-label text-label-sm text-slate-gray uppercase">
                <th className="text-left p-2">Hole</th>
                <th className="text-left p-2">Depth</th>
                <th className="text-left p-2">Grade</th>
                <th className="text-left p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {ASSAYS.map((a) => (
                <tr key={a.hole} className="border-t border-outline-variant">
                  <td className="p-2 font-label text-label-sm text-deep-navy">{a.hole}</td>
                  <td className="p-2 text-on-surface-variant">{a.depth}</td>
                  <td className="p-2 text-on-surface font-medium">{a.grade}</td>
                  <td className="p-2 text-slate-gray">{a.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <ModuleNote>
        Grade control and assay data are representative — connect to the real drilling database
        when the survey team&apos;s export pipeline is ready.
      </ModuleNote>
    </div>
  );
}
