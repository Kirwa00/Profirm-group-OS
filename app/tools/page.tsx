import Link from "next/link";
import AppShell from "@/components/app-shell";
import { OS_TOOLS } from "@/lib/os-tools";

export default function ToolsPage() {
  return (
    <AppShell>
      <h1 className="font-headline text-display-lg text-deep-navy mb-2">OS Tools</h1>
      <p className="font-body text-body-lg text-slate-gray mb-8 max-w-2xl">
        Cross-venture automation and infrastructure — not scoped to a single business.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {OS_TOOLS.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="block bg-surface-container-lowest border border-outline-variant relative stitch-card-hover"
          >
            <div className="h-0.5 bg-metallic-gold w-full absolute top-0 left-0" />
            <div className="p-6 flex items-start gap-4">
              <div className="w-10 h-10 bg-surface-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-deep-navy">{tool.icon}</span>
              </div>
              <div>
                <p className="font-headline text-headline-md text-deep-navy">{tool.label}</p>
                <p className="font-body text-body-sm text-slate-gray mt-1">{tool.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
