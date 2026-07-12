import { StatTile, SectionCard, Bar, ModuleNote } from "./ui";

const SLEEP_STAGES = [
  { stage: "Deep Sleep", pct: 22 },
  { stage: "REM Sleep", pct: 24 },
  { stage: "Light Sleep", pct: 48 },
];

const COMPLIANCE = [
  { day: "Mon", taken: true },
  { day: "Tue", taken: true },
  { day: "Wed", taken: true },
  { day: "Thu", taken: false },
  { day: "Fri", taken: true },
];

export default function BiometricTracker() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="HRV (7d avg)" value="62 ms" />
        <StatTile label="Sleep Score" value="84 / 100" />
        <StatTile label="Recovery" value="78%" />
        <StatTile label="Supplement Compliance" value="80%" />
      </div>

      <SectionCard title="Sleep Stage Analysis">
        <div className="space-y-3">
          {SLEEP_STAGES.map((s) => (
            <Bar key={s.stage} label={s.stage} value={s.pct} max={100} unit="%" />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Supplement Compliance History">
        <div className="flex gap-3">
          {COMPLIANCE.map((c) => (
            <div key={c.day} className="flex flex-col items-center gap-1">
              <span
                className={`material-symbols-outlined ${c.taken ? "text-success-green" : "text-outline-variant"}`}
              >
                {c.taken ? "check_circle" : "radio_button_unchecked"}
              </span>
              <span className="font-label text-label-sm text-slate-gray">{c.day}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Exercise Log">
        <p className="font-body text-body-sm text-on-surface-variant">
          Zone 2 cardio (40 min) + resistance training (3x/week). Last session: yesterday, 52
          min, avg HR 128 bpm.
        </p>
      </SectionCard>

      <ModuleNote>
        Biometric data is representative — sync to real wearable exports (Oura, Whoop, etc.)
        when available.
      </ModuleNote>
    </div>
  );
}
