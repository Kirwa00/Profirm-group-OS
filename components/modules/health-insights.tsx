import { StatTile, SectionCard, ModuleNote } from "./ui";

const RECOMMENDATIONS = [
  "Increase omega-3 intake on high-training days — correlates with faster HRV recovery",
  "Sleep quality drops after 9pm screen exposure — consider a blue-light cutoff",
  "hs-CRP trending down since curcumin stack started (week 3)",
];

export default function HealthInsights() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Wellness Trend (90d)" value="+14%" />
        <StatTile label="Diet-Inflammation Correlation" value="Strong" />
        <StatTile label="Sleep Impact Score" value="0.72" />
        <StatTile label="Stack Performance" value="Positive" />
      </div>

      <SectionCard title="Recommendations">
        <ul className="space-y-2">
          {RECOMMENDATIONS.map((r) => (
            <li key={r} className="font-body text-body-sm text-on-surface flex items-start gap-2">
              <span className="material-symbols-outlined text-metallic-gold text-base mt-0.5">lightbulb</span>
              {r}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Venture Biomarker Index">
        <p className="font-body text-body-sm text-on-surface-variant">
          Composite score blending hs-CRP, HRV, sleep score, and supplement compliance —
          currently 78/100, up from 64/100 at protocol start.
        </p>
      </SectionCard>

      <ModuleNote>
        Insights are illustrative pattern examples, not generated from real correlation
        analysis — wire up to the actual biometric dataset when ready.
      </ModuleNote>
    </div>
  );
}
