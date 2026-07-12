export type ModuleDef = {
  ventureKey: string;
  slug: string;
  label: string;
  icon: string;
};

// Registry of converted Stitch mockups, grouped under the venture they belong
// to. Filled in as modules are converted from stitch_sdlc_blue_gold_interface/.
export const MODULES: ModuleDef[] = [
  { ventureKey: "migingo-gold-project", slug: "financial-hub", label: "Executive Financial Hub", icon: "monitoring" },
  { ventureKey: "migingo-gold-project", slug: "geological-survey", label: "Geological Survey & Mine Planning", icon: "landscape" },
  { ventureKey: "migingo-gold-project", slug: "fleet-operations", label: "Mine Planning & Fleet Operations", icon: "local_shipping" },
  { ventureKey: "migingo-gold-project", slug: "cil-plant", label: "CIL Plant Operations & Security", icon: "factory" },
  { ventureKey: "migingo-gold-project", slug: "financial-sensitivity", label: "Financial Sensitivity Model", icon: "query_stats" },
  { ventureKey: "trans-africa-equator-hotels", slug: "asset-management", label: "Asset Management Hub", icon: "apartment" },
  { ventureKey: "highlands-institute", slug: "growth-operations", label: "Growth & Operations Hub", icon: "school" },
];

export function getModulesForVenture(ventureKey: string): ModuleDef[] {
  return MODULES.filter((m) => m.ventureKey === ventureKey);
}

export function getModule(ventureKey: string, slug: string): ModuleDef | undefined {
  return MODULES.find((m) => m.ventureKey === ventureKey && m.slug === slug);
}
