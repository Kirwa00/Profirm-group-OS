import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getModule } from "@/lib/modules";
import FinancialHub from "@/components/modules/financial-hub";
import FinancialSensitivity from "@/components/modules/financial-sensitivity";
import GeologicalSurvey from "@/components/modules/geological-survey";
import FleetOperations from "@/components/modules/fleet-operations";
import CilPlant from "@/components/modules/cil-plant";
import AssetManagement from "@/components/modules/asset-management";
import GrowthOperations from "@/components/modules/growth-operations";
import SdlcWorkspace from "@/components/modules/sdlc-workspace";
import QuantResearch from "@/components/modules/quant-research";
import KnowledgeBase from "@/components/modules/knowledge-base";
import FeasibilityCosting from "@/components/modules/feasibility-costing";
import LogisticsTracker from "@/components/modules/logistics-tracker";
import MachineryProcurement from "@/components/modules/machinery-procurement";
import WellnessDashboard from "@/components/modules/wellness-dashboard";
import BiometricTracker from "@/components/modules/biometric-tracker";
import HealthInsights from "@/components/modules/health-insights";
import NutritionPlanner from "@/components/modules/nutrition-planner";

const COMPONENTS: Record<string, React.ComponentType> = {
  "financial-hub": FinancialHub,
  "financial-sensitivity": FinancialSensitivity,
  "geological-survey": GeologicalSurvey,
  "fleet-operations": FleetOperations,
  "cil-plant": CilPlant,
  "asset-management": AssetManagement,
  "growth-operations": GrowthOperations,
  "sdlc-workspace": SdlcWorkspace,
  "quant-research": QuantResearch,
  "knowledge-base": KnowledgeBase,
  "feasibility-costing": FeasibilityCosting,
  logistics: LogisticsTracker,
  "machinery-procurement": MachineryProcurement,
  "wellness-dashboard": WellnessDashboard,
  "biometric-tracker": BiometricTracker,
  "health-insights": HealthInsights,
  "nutrition-planner": NutritionPlanner,
};

export default function ModulePage({ params }: { params: { key: string; slug: string } }) {
  const moduleDef = getModule(params.key, params.slug);
  const Component = COMPONENTS[params.slug];

  if (!moduleDef || !Component) notFound();

  return (
    <AppShell>
      <Link
        href={`/ventures/${params.key}`}
        className="font-label text-label-sm text-slate-gray hover:text-primary inline-flex items-center gap-1 mb-4"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Back to venture
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-metallic-gold text-3xl">
          {moduleDef.icon}
        </span>
        <h1 className="font-headline text-headline-lg text-deep-navy">{moduleDef.label}</h1>
      </div>

      <Component />
    </AppShell>
  );
}
