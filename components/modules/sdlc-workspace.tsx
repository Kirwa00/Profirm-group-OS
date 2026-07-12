import { StatTile, SectionCard, ModuleNote } from "./ui";

const MILESTONES = [
  { name: "Core Inference Engine V2", status: "In Progress", pct: 68 },
  { name: "SOC2 Compliance Audit", status: "In Progress", pct: 30 },
  { name: "Multi-tenant Dashboard", status: "Complete", pct: 100 },
];

const DECISIONS = ["Confirm pricing tier structure before public beta"];

export default function SdlcWorkspace() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Portfolio Company" value="NeuralPath AI" />
        <StatTile label="Operating Status" value="Building" />
        <StatTile label="Sprint" value="Sprint 7 / 12" />
        <StatTile label="Runway" value="9 months" />
      </div>

      <SectionCard title="SDLC Milestones">
        <div className="space-y-4">
          {MILESTONES.map((m) => (
            <div key={m.name}>
              <div className="flex justify-between font-body text-body-sm mb-1">
                <span className="text-on-surface">{m.name}</span>
                <span className="font-label text-label-sm text-slate-gray uppercase">{m.status}</span>
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-deep-navy rounded-full" style={{ width: `${m.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Open Decisions">
        <ul className="space-y-2">
          {DECISIONS.map((d) => (
            <li key={d} className="font-body text-body-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-warning-amber text-base">radio_button_unchecked</span>
              {d}
            </li>
          ))}
        </ul>
      </SectionCard>

      <ModuleNote>
        Tracks one representative portfolio company (NeuralPath AI) as an example of the SDLC
        workspace pattern — extend to a full multi-company roster when the studio has more than
        one active build.
      </ModuleNote>
    </div>
  );
}
