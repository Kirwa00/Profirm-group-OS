import { StatTile, SectionCard, ModuleNote } from "./ui";

const PROGRAMS = [
  { name: "Diploma in Applied AI", enrolled: 612, capacity: 700 },
  { name: "Certificate in Data Analytics", enrolled: 348, capacity: 400 },
  { name: "Executive Leadership Track", enrolled: 91, capacity: 120 },
];

const FACULTY = [
  { name: "Dr. A. Wanjiru", role: "Dean of Academics", programs: 3 },
  { name: "Prof. J. Otieno", role: "Head of Applied AI", programs: 2 },
  { name: "M. Chebet", role: "Head of Industry Partnerships", programs: 1 },
];

export default function GrowthOperations() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Total Enrollment" value="4,282" />
        <StatTile label="NPS" value="3.72" sub="of 5.0" />
        <StatTile label="Student : Faculty" value="1:18" />
        <StatTile label="Program Completion" value="88%" />
      </div>

      <SectionCard title="Program Performance">
        <div className="space-y-4">
          {PROGRAMS.map((p) => {
            const pct = Math.round((p.enrolled / p.capacity) * 100);
            return (
              <div key={p.name}>
                <div className="flex justify-between font-body text-body-sm mb-1">
                  <span className="text-on-surface">{p.name}</span>
                  <span className="font-label text-label-sm text-slate-gray">
                    {p.enrolled} / {p.capacity}
                  </span>
                </div>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-deep-navy rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Executive Faculty Roster">
        <div className="space-y-3">
          {FACULTY.map((f) => (
            <div
              key={f.name}
              className="flex items-center justify-between border-b border-outline-variant last:border-0 pb-3 last:pb-0"
            >
              <div>
                <p className="font-body text-body-md text-on-surface font-medium">{f.name}</p>
                <p className="font-body text-body-sm text-slate-gray">{f.role}</p>
              </div>
              <span className="font-label text-label-sm text-deep-navy">
                {f.programs} program{f.programs === 1 ? "" : "s"}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Infrastructure Roadmap">
        <p className="font-body text-body-md text-on-surface-variant">
          New applied-AI lab block breaking ground Q1 next year; student housing phase 2 in
          planning. Full roadmap tracker to be added.
        </p>
      </SectionCard>

      <ModuleNote>
        Enrollment and faculty figures are representative — adapted from the Highlands Institute
        growth &amp; operations mockup.
      </ModuleNote>
    </div>
  );
}
