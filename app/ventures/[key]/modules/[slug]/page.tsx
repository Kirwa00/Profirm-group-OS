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

const COMPONENTS: Record<string, React.ComponentType> = {
  "financial-hub": FinancialHub,
  "financial-sensitivity": FinancialSensitivity,
  "geological-survey": GeologicalSurvey,
  "fleet-operations": FleetOperations,
  "cil-plant": CilPlant,
  "asset-management": AssetManagement,
  "growth-operations": GrowthOperations,
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
