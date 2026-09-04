// Single source of truth for the primary navigation, shared by the desktop
// SideNav and the mobile drawer so they never drift apart.

export type NavItem = { href: string; label: string; icon: string };

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Portfolio", icon: "dashboard" },
  { href: "/calendar", label: "Calendar", icon: "calendar_month" },
  { href: "/priorities", label: "Priorities & Watchlist", icon: "insights" },
  { href: "/tools", label: "OS Tools", icon: "settings_suggest" },
];

// Whether a nav item should render as "active" for the given pathname.
export function isNavActive(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
