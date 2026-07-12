import { StatTile, SectionCard, ModuleNote } from "./ui";

const SUPPLIERS = [
  { name: "Anhui Zhengyuan Machinery", price: "$62,000", leadTime: "10 weeks", rating: "4.6" },
  { name: "Henan Huatai Equipment", price: "$58,500", leadTime: "12 weeks", rating: "4.3" },
  { name: "Kompass East Africa", price: "$71,000", leadTime: "6 weeks", rating: "4.8" },
];

export default function MachineryProcurement() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Unit" value="Solvent Extraction" />
        <StatTile label="Capacity" value="2 t/h" />
        <StatTile label="Suppliers Evaluated" value="3" />
        <StatTile label="Target Lead Time" value="≤ 10 wks" />
      </div>

      <SectionCard title="Supplier Evaluation Matrix">
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm font-body">
            <thead>
              <tr className="font-label text-label-sm text-slate-gray uppercase">
                <th className="text-left p-2">Supplier</th>
                <th className="text-left p-2">Price</th>
                <th className="text-left p-2">Lead Time</th>
                <th className="text-left p-2">Rating</th>
              </tr>
            </thead>
            <tbody>
              {SUPPLIERS.map((s) => (
                <tr key={s.name} className="border-t border-outline-variant">
                  <td className="p-2 text-on-surface font-medium">{s.name}</td>
                  <td className="p-2 text-on-surface-variant">{s.price}</td>
                  <td className="p-2 text-slate-gray">{s.leadTime}</td>
                  <td className="p-2 font-label text-label-sm text-deep-navy">{s.rating} / 5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Ready for Procurement?">
        <p className="font-body text-body-sm text-on-surface-variant">
          Kompass East Africa offers the shortest lead time at a premium price; Henan Huatai is
          the lowest cost with the longest lead time. Recommendation pending final CapEx sign-off
          from the manufacturing venture&apos;s feasibility hub.
        </p>
      </SectionCard>

      <ModuleNote>
        Supplier data is representative — replace with real quotes once RFQs are back from the
        shortlisted vendors.
      </ModuleNote>
    </div>
  );
}
