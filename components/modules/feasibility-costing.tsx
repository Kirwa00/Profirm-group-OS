import { StatTile, SectionCard, ModuleNote } from "./ui";

const VENTURES = [
  { name: "Grain Milling", stage: "Feasibility Complete", capex: "$180K", irr: "28%" },
  { name: "Turpentine Extraction", stage: "Costing Model", capex: "$95K", irr: "22%" },
  { name: "Avocado Oil", stage: "Feasibility Complete", capex: "$140K", irr: "31%" },
];

export default function FeasibilityCosting() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Ventures in Pipeline" value="3" />
        <StatTile label="Combined CapEx" value="$415K" />
        <StatTile label="Blended IRR" value="27%" />
        <StatTile label="Operational Efficiency" value="84%" />
      </div>

      <SectionCard title="Industrial Ventures Portfolio">
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm font-body">
            <thead>
              <tr className="font-label text-label-sm text-slate-gray uppercase">
                <th className="text-left p-2">Venture</th>
                <th className="text-left p-2">Stage</th>
                <th className="text-left p-2">CapEx</th>
                <th className="text-left p-2">IRR</th>
              </tr>
            </thead>
            <tbody>
              {VENTURES.map((v) => (
                <tr key={v.name} className="border-t border-outline-variant">
                  <td className="p-2 text-on-surface font-medium">{v.name}</td>
                  <td className="p-2 font-label text-label-sm text-slate-gray uppercase">{v.stage}</td>
                  <td className="p-2 text-on-surface-variant">{v.capex}</td>
                  <td className="p-2 text-success-green font-medium">{v.irr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Feasibility Roadmap">
        <p className="font-body text-body-sm text-on-surface-variant">
          Grain milling and avocado oil have completed feasibility studies and moved to
          machinery procurement. Turpentine extraction is finalizing its costing model before
          sign-off. Fertilizer and fuel-wood ventures remain at concept stage.
        </p>
      </SectionCard>

      <ModuleNote>
        Merges the feasibility and detailed-costing mockups (near-identical content in the
        source exports) into one module. Figures are representative.
      </ModuleNote>
    </div>
  );
}
