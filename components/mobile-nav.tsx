"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isNavActive } from "@/lib/nav";

// Hamburger trigger + slide-in drawer, shown only below `lg` (the desktop
// SideNav takes over at that breakpoint). Closes on navigation, backdrop
// tap, or Escape.
export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        className="flex items-center justify-center w-10 h-10 -ml-2 rounded text-on-surface hover:bg-surface-container"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80vw] bg-deep-navy text-white flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-metallic-gold/20 flex items-center justify-center rounded border border-metallic-gold/30">
                  <span className="material-symbols-outlined text-metallic-gold">apps</span>
                </div>
                <p className="font-headline text-lg text-metallic-gold leading-tight">Profirm OS</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="w-9 h-9 flex items-center justify-center rounded text-white/80 hover:bg-white/10"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="flex-1 space-y-1 px-3 pt-2 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const active = isNavActive(item.href, pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
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

            <div className="px-3 pb-5 pt-2">
              <Link
                href="/ventures/new"
                className="w-full py-3 bg-metallic-gold text-deep-navy font-bold rounded flex items-center justify-center gap-2 hover:bg-white transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">add</span>
                <span className="font-label">New Venture</span>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
