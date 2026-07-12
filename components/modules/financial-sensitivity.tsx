import { SectionCard, ModuleNote } from "./ui";

const GOLD_PRICES = [1900, 2100, 2300, 2500, 2700];
const AISC_SCENARIOS = [850, 950, 1050];

function npvFor(price: number, aisc: number) {
  // Illustrative linear approximation for the sensitivity grid.
  const margin = price - aisc;
  return Math.round(margin * 1.7 - 300);
}

export default function FinancialSensitivity() {
  return (
    <div className="space-y-6">
      <SectionCard title="Gold Price Sensitivity Matrix — NPV ($M)">
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm font-body">
            <thead>
              <tr>
                <th className="text-left font-label text-label-sm text-slate-gray uppercase p-2">
                  AISC \ Gold Price
                </th>
                {GOLD_PRICES.map((p) => (
                  <th
                    key={p}
                    className="text-right font-label text-label-sm text-slate-gray uppercase p-2"
                  >
                    ${p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AISC_SCENARIOS.map((aisc) => (
                <tr key={aisc} className="border-t border-outline-variant">
                  <td className="p-2 font-label text-label-sm text-on-surface">${aisc}/oz</td>
                  {GOLD_PRICES.map((price) => {
                    const npv = npvFor(price, aisc);
                    return (
                      <td
                        key={price}
                        className={`p-2 text-right font-body ${
                          npv < 0 ? "text-error" : npv > 1400 ? "text-success-green font-bold" : "text-on-surface"
                        }`}
                      >
                        ${npv}M
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Break-Even Analysis">
        <p className="font-body text-body-md text-on-surface-variant">
          Break-even gold price at base-case AISC ($950/oz) with current strip ratio and reagent
          costs: <span className="font-bold text-deep-navy">$1,050/oz</span>. Current spot price
          provides a <span className="font-bold text-success-green">54% margin buffer</span>.
        </p>
      </SectionCard>

      <ModuleNote>
        Sensitivity figures are illustrative — replace `npvFor` in
        components/modules/financial-sensitivity.tsx with the real mining financial model once
        it&apos;s ready to wire in.
      </ModuleNote>
    </div>
  );
}
