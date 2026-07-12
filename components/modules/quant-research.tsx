import { StatTile, SectionCard, ModuleNote } from "./ui";

const EQUITY_CURVE = [100, 108, 104, 121, 133, 129, 148, 162];

const RISK_DIRECTIVES = [
  "Max 1% account risk per trade",
  "No more than 3 concurrent positions",
  "Hard stop at -5% weekly drawdown",
];

const EXECUTION_LOG = [
  { pair: "XAUUSD", side: "Buy", result: "+1.8R", time: "09:14" },
  { pair: "EURUSD", side: "Sell", result: "-1.0R", time: "07:52" },
  { pair: "GBPJPY", side: "Buy", result: "+2.3R", time: "06:30" },
];

export default function QuantResearch() {
  const max = Math.max(...EQUITY_CURVE);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Strategy" value="Alpha Horizon Systems" />
        <StatTile label="MT5 Core Units" value="4" />
        <StatTile label="YTD Return" value="+62%" />
        <StatTile label="Max Drawdown" value="-8.4%" />
      </div>

      <SectionCard title="Portfolio Equity Curve">
        <div className="flex items-end gap-2 h-32">
          {EQUITY_CURVE.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
              <div className="w-full bg-metallic-gold/70 rounded-t" style={{ height: `${(v / max) * 100}%` }} />
              <span className="font-label text-label-sm text-slate-gray mt-1">W{i + 1}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Risk Directives">
        <ul className="space-y-2">
          {RISK_DIRECTIVES.map((r) => (
            <li key={r} className="font-body text-body-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-base">shield</span>
              {r}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Recent Execution Logs">
        <div className="space-y-2">
          {EXECUTION_LOG.map((e, i) => (
            <div key={i} className="flex items-center justify-between font-body text-body-sm border-b border-outline-variant last:border-0 pb-2 last:pb-0">
              <span className="text-on-surface font-medium">{e.pair} — {e.side}</span>
              <span className={e.result.startsWith("+") ? "text-success-green" : "text-error"}>{e.result}</span>
              <span className="text-slate-gray font-label text-label-sm">{e.time}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <ModuleNote>
        Equity curve and execution logs are representative — connect to the real MT5 EA backtest
        exports when ready.
      </ModuleNote>
    </div>
  );
}
