export type OsToolDef = {
  slug: string;
  label: string;
  icon: string;
  description: string;
};

// Cross-venture OS tooling — not scoped to a single venture, unlike lib/modules.ts.
export const OS_TOOLS: OsToolDef[] = [
  {
    slug: "workflow-builder",
    label: "Workflow Orchestration Builder",
    icon: "account_tree",
    description: "Design and monitor cross-venture automation workflows.",
  },
  {
    slug: "agent-monitor",
    label: "Agent Intelligence Monitor",
    icon: "smart_toy",
    description: "Fleet health, cost, and reasoning logs for autonomous agents.",
  },
  {
    slug: "document-ai-hub",
    label: "Document AI & OCR Hub",
    icon: "scanner",
    description: "Document extraction jobs across every venture.",
  },
  {
    slug: "connectivity-hub",
    label: "Connectivity & Integrations Library",
    icon: "hub",
    description: "Active integrations and the marketplace of available connectors.",
  },
];

export function getOsTool(slug: string): OsToolDef | undefined {
  return OS_TOOLS.find((t) => t.slug === slug);
}
