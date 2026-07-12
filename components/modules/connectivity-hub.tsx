import { StatTile, SectionCard, ModuleNote } from "./ui";

const ACTIVE = [
  { name: "MetaTrader 5 (MT5)", category: "Trading", status: "Connected" },
  { name: "Salesforce CRM", category: "Sales", status: "Connected" },
  { name: "Slack Enterprise", category: "Comms", status: "Connected" },
];

const MARKETPLACE = [
  { name: "Google Cloud Vertex AI", category: "AI / ML" },
  { name: "Stripe Treasury", category: "Finance" },
  { name: "GitHub Enterprise", category: "Dev Tools" },
  { name: "Snowflake Data Cloud", category: "Data" },
];

export default function ConnectivityHub() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Active Integrations" value="3" />
        <StatTile label="Marketplace" value="4 available" />
        <StatTile label="Cross-Venture Telemetry" value="Live" />
        <StatTile label="API Calls (24h)" value="8,412" />
      </div>

      <SectionCard title="Active Library">
        <div className="space-y-3">
          {ACTIVE.map((i) => (
            <div key={i.name} className="flex items-center justify-between border-b border-outline-variant last:border-0 pb-3 last:pb-0">
              <div>
                <p className="font-body text-body-md text-on-surface font-medium">{i.name}</p>
                <p className="font-body text-body-sm text-slate-gray">{i.category}</p>
              </div>
              <span className="font-label text-label-sm px-2 py-0.5 rounded bg-success-green/15 text-success-green uppercase">
                {i.status}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Integration Marketplace">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MARKETPLACE.map((m) => (
            <div key={m.name} className="border border-outline-variant rounded p-3 flex items-center justify-between">
              <div>
                <p className="font-body text-body-sm text-on-surface font-medium">{m.name}</p>
                <p className="font-label text-label-sm text-slate-gray uppercase">{m.category}</p>
              </div>
              <span className="material-symbols-outlined text-metallic-gold">add_circle</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <ModuleNote>
        Integration list is representative — wire up to the real connector registry when
        available.
      </ModuleNote>
    </div>
  );
}
