import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getOsTool } from "@/lib/os-tools";
import WorkflowBuilder from "@/components/modules/workflow-builder";
import AgentMonitor from "@/components/modules/agent-monitor";
import DocumentAiHub from "@/components/modules/document-ai-hub";
import ConnectivityHub from "@/components/modules/connectivity-hub";

const COMPONENTS: Record<string, React.ComponentType> = {
  "workflow-builder": WorkflowBuilder,
  "agent-monitor": AgentMonitor,
  "document-ai-hub": DocumentAiHub,
  "connectivity-hub": ConnectivityHub,
};

export default function OsToolPage({ params }: { params: { slug: string } }) {
  const tool = getOsTool(params.slug);
  const Component = COMPONENTS[params.slug];

  if (!tool || !Component) notFound();

  return (
    <AppShell>
      <Link
        href="/tools"
        className="font-label text-label-sm text-slate-gray hover:text-primary inline-flex items-center gap-1 mb-4"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Back to OS Tools
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-metallic-gold text-3xl">{tool.icon}</span>
        <h1 className="font-headline text-headline-lg text-deep-navy">{tool.label}</h1>
      </div>

      <Component />
    </AppShell>
  );
}
