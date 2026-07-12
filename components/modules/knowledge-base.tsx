import { StatTile, SectionCard, ModuleNote } from "./ui";

const CATEGORIES = [
  { code: "01", name: "Market Thesis", docs: 14 },
  { code: "02", name: "Prompt Libraries", docs: 38 },
  { code: "03", name: "PKM Folder Structures", docs: 7 },
  { code: "04", name: "Competitive Analyses", docs: 11 },
];

export default function KnowledgeBase() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Total Documents" value="70" />
        <StatTile label="Categories" value="4" />
        <StatTile label="Last Synced" value="2h ago" />
        <StatTile label="Contributors" value="1" />
      </div>

      <SectionCard title="Master Categories">
        <div className="space-y-3">
          {CATEGORIES.map((c) => (
            <div key={c.code} className="flex items-center justify-between border-b border-outline-variant last:border-0 pb-3 last:pb-0">
              <div className="flex items-center gap-3">
                <span className="font-label text-label-sm text-metallic-gold">{c.code}</span>
                <p className="font-body text-body-md text-on-surface font-medium">{c.name}</p>
              </div>
              <span className="font-label text-label-sm text-slate-gray">{c.docs} docs</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Document Hub">
        <p className="font-body text-body-sm text-on-surface-variant">
          Central store for prompt libraries, folder structures, and PKM system notes referenced
          across every venture.
        </p>
      </SectionCard>

      <ModuleNote>
        Category counts are representative — sync to the master document system when the folder
        structure is finalized.
      </ModuleNote>
    </div>
  );
}
