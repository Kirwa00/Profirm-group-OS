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
  { ventureKey: "ai-startup-studio", slug: "sdlc-workspace", label: "SDLC Workspace", icon: "integration_instructions" },
  { ventureKey: "trading-quant-research", slug: "quant-research", label: "Trading & Quant Research", icon: "candlestick_chart" },
  { ventureKey: "ai-knowledge-base", slug: "knowledge-base", label: "Knowledge Base", icon: "menu_book" },
  { ventureKey: "manufacturing-industrial-ventures", slug: "feasibility-costing", label: "Feasibility & Costing Hub", icon: "request_quote" },
  { ventureKey: "manufacturing-industrial-ventures", slug: "logistics", label: "Logistics & Supply Chain Tracker", icon: "local_shipping" },
  { ventureKey: "manufacturing-industrial-ventures", slug: "machinery-procurement", label: "Machinery Procurement Specs", icon: "precision_manufacturing" },
  { ventureKey: "personal-health", slug: "wellness-dashboard", label: "Anti-Inflammatory Dashboard", icon: "favorite" },
  { ventureKey: "personal-health", slug: "biometric-tracker", label: "Biometric & Supplement Tracker", icon: "monitor_heart" },
  { ventureKey: "personal-health", slug: "health-insights", label: "Health Insights & Optimization", icon: "insights" },
  { ventureKey: "personal-health", slug: "nutrition-planner", label: "Nutrition & Meal Planner", icon: "restaurant" },
];

export function getModulesForVenture(ventureKey: string): ModuleDef[] {
  return MODULES.filter((m) => m.ventureKey === ventureKey);
}

export function getModule(ventureKey: string, slug: string): ModuleDef | undefined {
  return MODULES.find((m) => m.ventureKey === ventureKey && m.slug === slug);
}
