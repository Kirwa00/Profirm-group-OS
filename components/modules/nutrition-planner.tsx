import { StatTile, SectionCard, ModuleNote } from "./ui";

const ALLOWED = ["Wild-caught fish", "Leafy greens", "Turmeric & ginger", "Extra virgin olive oil", "Berries"];
const AVOID = ["Refined sugar", "Seed oils", "Processed meats", "Refined grains"];

export default function NutritionPlanner() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Today's Recipe" value="Turmeric Salmon" sub="with Asparagus" />
        <StatTile label="Anti-Inflammatory Score" value="9.2 / 10" />
        <StatTile label="Prep Time" value="25 min" />
        <StatTile label="Meals Planned (Week)" value="14" />
      </div>

      <SectionCard title="Anti-Inflammatory Benefits">
        <p className="font-body text-body-sm text-on-surface-variant">
          Salmon delivers omega-3s that lower hs-CRP; turmeric&apos;s curcumin inhibits
          inflammatory cytokines; asparagus adds prebiotic fiber supporting gut-driven
          inflammation control.
        </p>
      </SectionCard>

      <SectionCard title="Anti-Inflammatory Ingredient Library">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="font-label text-label-sm text-success-green uppercase tracking-wide mb-2">
              Priority: Allowed
            </p>
            <ul className="space-y-1">
              {ALLOWED.map((a) => (
                <li key={a} className="font-body text-body-sm text-on-surface">• {a}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-label text-label-sm text-error uppercase tracking-wide mb-2">
              Prohibited: Avoid
            </p>
            <ul className="space-y-1">
              {AVOID.map((a) => (
                <li key={a} className="font-body text-body-sm text-on-surface">• {a}</li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>

      <ModuleNote>
        Recipe and ingredient library are representative — expand with the full meal plan when
        ready.
      </ModuleNote>
    </div>
  );
}
