"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Portfolio", icon: "dashboard" },
  { href: "/priorities", label: "Priorities & Watchlist", icon: "insights" },
  { href: "/tools", label: "OS Tools", icon: "settings_suggest" },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col h-[calc(100vh-64px)] w-64 bg-deep-navy text-white py-unit sticky top-16 shadow-md z-30">
      <div className="px-6 py-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-metallic-gold/20 flex items-center justify-center rounded border border-metallic-gold/30">
            <span className="material-symbols-outlined text-metallic-gold">apps</span>
          </div>
          <div>
            <p className="font-headline text-lg text-metallic-gold leading-tight">Profirm OS</p>
            <p className="font-label text-xs text-white/60 uppercase tracking-widest">
              Venture Management
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 ${
                active
                  ? "bg-white/10 text-metallic-gold border-r-4 border-metallic-gold font-bold"
                  : "text-white/80 hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label text-label-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-auto space-y-4">
        <Link
          href="/ventures/new"
          className="w-full py-3 bg-metallic-gold text-deep-navy font-bold rounded flex items-center justify-center gap-2 hover:bg-white transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>
          <span className="font-label">New Venture</span>
        </Link>
      </div>
    </aside>
  );
}
