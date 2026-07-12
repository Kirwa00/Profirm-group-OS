import { StatTile, SectionCard, ModuleNote } from "./ui";

const FLEET = [
  { agent: "Research Agent", venture: "AI Startup Studio", state: "Running", tasksToday: 42 },
  { agent: "Document Extraction Agent", venture: "Profirm OS", state: "Running", tasksToday: 118 },
  { agent: "Outreach Agent", venture: "AI Startup Studio", state: "Idle", tasksToday: 6 },
  { agent: "Assay Monitoring Agent", venture: "Migingo Gold", state: "Running", tasksToday: 24 },
];

const REASONING_LOG = [
  { time: "10:42", entry: "Document Extraction Agent: classified invoice, confidence 0.97" },
  { time: "10:41", entry: "Research Agent: queried 3 sources for competitor pricing" },
  { time: "10:38", entry: "Assay Monitoring Agent: flagged grade below threshold on RC-118" },
];

const STATE_COLOR: Record<string, string> = {
  Running: "bg-success-green/15 text-success-green",
  Idle: "bg-surface-container text-on-surface-variant",
};

export default function AgentMonitor() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Autonomous Fleet" value="4 agents" />
        <StatTile label="Computational Velocity" value="1,240 tok/s" />
        <StatTile label="Total Fleet Cost (MTD)" value="$186" />
        <StatTile label="Task Queue Density" value="12" />
      </div>

      <SectionCard title="Autonomous Fleet">
        <div className="space-y-3">
          {FLEET.map((a) => (
            <div key={a.agent} className="flex items-center justify-between border-b border-outline-variant last:border-0 pb-3 last:pb-0">
              <div>
                <p className="font-body text-body-md text-on-surface font-medium">{a.agent}</p>
                <p className="font-body text-body-sm text-slate-gray">{a.venture}</p>
              </div>
              <div className="text-right">
                <span className={`font-label text-label-sm px-2 py-0.5 rounded uppercase ${STATE_COLOR[a.state]}`}>
                  {a.state}
                </span>
                <p className="font-label text-label-sm text-deep-navy mt-1">{a.tasksToday} tasks today</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Reasoning Log">
        <div className="space-y-2">
          {REASONING_LOG.map((r, i) => (
            <p key={i} className="font-body text-body-sm text-on-surface-variant">
              <span className="font-label text-label-sm text-slate-gray mr-2">{r.time}</span>
              {r.entry}
            </p>
          ))}
        </div>
      </SectionCard>

      <ModuleNote>
        Fleet telemetry is representative — connect to the real agent orchestration
        layer&apos;s event stream when available.
      </ModuleNote>
    </div>
  );
}
