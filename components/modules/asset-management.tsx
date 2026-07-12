import { StatTile, SectionCard, ModuleNote } from "./ui";

const PROPERTIES = [
  { name: "The Equator Reef - Zanzibar", location: "Zanzibar, Tanzania", occupancy: 78, status: "Operating" },
  { name: "Lagos Heights Executive", location: "Lagos, Nigeria", occupancy: 64, status: "Operating" },
  { name: "Rift Valley Lodge", location: "Naivasha, Kenya", occupancy: 0, status: "Renovation" },
];

const RENOVATION_PIPELINE = [
  { property: "Rift Valley Lodge", phase: "Structural Rework", pct: 45 },
  { property: "Lagos Heights Executive — Wing B", phase: "Interior Fit-Out", pct: 80 },
];

export default function AssetManagement() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Properties" value="3" sub="2 operating, 1 in renovation" />
        <StatTile label="Portfolio Occupancy" value="71%" />
        <StatTile label="RevPAR (Blended)" value="$142" />
        <StatTile label="Pipeline Deals" value="2" />
      </div>

      <SectionCard title="Portfolio Geo-Distribution">
        <div className="space-y-3">
          {PROPERTIES.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between border-b border-outline-variant last:border-0 pb-3 last:pb-0"
            >
              <div>
                <p className="font-body text-body-md text-on-surface font-medium">{p.name}</p>
                <p className="font-body text-body-sm text-slate-gray">{p.location}</p>
              </div>
              <div className="text-right">
                <span
                  className={`font-label text-label-sm px-2 py-0.5 rounded uppercase ${
                    p.status === "Operating"
                      ? "bg-success-green/15 text-success-green"
                      : "bg-warning-amber/15 text-warning-amber"
                  }`}
                >
                  {p.status}
                </span>
                {p.status === "Operating" ? (
                  <p className="font-label text-label-sm text-deep-navy mt-1">{p.occupancy}% occ.</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Renovation Pipeline">
        <div className="space-y-4">
          {RENOVATION_PIPELINE.map((r) => (
            <div key={r.property}>
              <div className="flex justify-between font-body text-body-sm mb-1">
                <span className="text-on-surface">{r.property} — {r.phase}</span>
                <span className="font-label text-label-sm text-slate-gray">{r.pct}%</span>
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-metallic-gold rounded-full" style={{ width: `${r.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Strategic Acquisition Module">
        <p className="font-body text-body-md text-on-surface-variant">
          2 acquisition targets under review in the East Africa coastal corridor. Full deal
          pipeline tracking to be added once due-diligence data rooms are shared.
        </p>
      </SectionCard>

      <ModuleNote>
        Portfolio figures are representative — adapted from the Trans Africa Equator Hotels asset
        management mockup.
      </ModuleNote>
    </div>
  );
}
