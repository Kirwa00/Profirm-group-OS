import { StatTile, SectionCard, ModuleNote } from "./ui";

const MARKERS = [
  { name: "hs-CRP", value: "0.8 mg/L", trend: "Improving" },
  { name: "Fasting Glucose", value: "88 mg/dL", trend: "Stable" },
  { name: "Resting HR", value: "54 bpm", trend: "Improving" },
];

const SUPPLEMENTS = ["Omega-3 (2g)", "Curcumin + Piperine", "Vitamin D3/K2", "Magnesium Glycinate"];

const MEALS = [
  { slot: "Morning Focus", item: "Avocado & Smoked Salmon" },
  { slot: "Afternoon Recovery", item: "Mediterranean Quinoa Bowl" },
  { slot: "Today's Nutrition", item: "Wild Alaskan Halibut" },
];

export default function WellnessDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Protocol Status" value="Active" sub="Week 6 of 12" />
        <StatTile label="Adherence" value="91%" />
        <StatTile label="Inflammation Trend" value="Improving" />
        <StatTile label="Supplement Stack" value="4 items" />
      </div>

      <SectionCard title="Core Wellness Markers">
        <div className="space-y-3">
          {MARKERS.map((m) => (
            <div key={m.name} className="flex items-center justify-between border-b border-outline-variant last:border-0 pb-2 last:pb-0">
              <p className="font-body text-body-md text-on-surface">{m.name}</p>
              <div className="text-right">
                <p className="font-label text-label-md text-deep-navy">{m.value}</p>
                <p className="font-label text-label-sm text-success-green uppercase">{m.trend}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Today's Nutrition">
        <div className="space-y-2">
          {MEALS.map((m) => (
            <div key={m.slot} className="flex justify-between font-body text-body-sm">
              <span className="text-slate-gray">{m.slot}</span>
              <span className="text-on-surface font-medium">{m.item}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Supplement Stack">
        <div className="flex flex-wrap gap-2">
          {SUPPLEMENTS.map((s) => (
            <span key={s} className="font-label text-label-sm px-2 py-1 rounded bg-surface-container text-on-surface-variant">
              {s}
            </span>
          ))}
        </div>
      </SectionCard>

      <ModuleNote>
        Markers and meal plan are representative — connect to real lab results and wearable data
        when available.
      </ModuleNote>
    </div>
  );
}
