import type { VentureCategory, VentureStatus, WatchlistSeverity } from "@prisma/client";

export const CATEGORY_META: Record<VentureCategory, { label: string; icon: string }> = {
  AI_STARTUP_STUDIO: { label: "AI Startup Studio", icon: "rocket_launch" },
  AI_AUTOMATION_AGENTS: { label: "AI Automation & Agents", icon: "smart_toy" },
  TRADING_QUANT_RESEARCH: { label: "Trading & Quant Research", icon: "candlestick_chart" },
  MANUFACTURING_INDUSTRIAL: { label: "Manufacturing & Industrial Ventures", icon: "precision_manufacturing" },
  MINING_COMMODITIES: { label: "Mining & Commodities", icon: "landscape" },
  HEALTHCARE_BUSINESSES: { label: "Healthcare Businesses", icon: "medical_services" },
  PERSONAL_HEALTH: { label: "Personal Health", icon: "favorite" },
  PROPERTY_HOSPITALITY: { label: "Property & Hospitality", icon: "apartment" },
  EDUCATION_VENTURES: { label: "Education Ventures", icon: "school" },
  AI_KNOWLEDGE_BASE: { label: "AI Knowledge Base", icon: "menu_book" },
  LEGAL_FINANCE: { label: "Legal & Finance", icon: "gavel" },
};

// Matches the exact status-chip color pairs from the Stitch mockups
// (ventureos_portfolio_overview/code.html): tinted background + a matching
// border, not just a flat translucent fill.
export const STATUS_META: Record<VentureStatus, { label: string; className: string }> = {
  IDEA: { label: "Idea", className: "bg-surface-container text-on-surface-variant border border-outline-variant" },
  VALIDATING: { label: "Validating", className: "bg-amber-50 text-warning-amber border border-amber-200" },
  BUILDING: { label: "Building", className: "bg-blue-50 text-primary-container border border-blue-200" },
  SCALING: { label: "Scaling", className: "bg-emerald-50 text-success-green border border-emerald-200" },
};

export const SEVERITY_META: Record<WatchlistSeverity, { label: string; className: string }> = {
  LOW: { label: "Low", className: "bg-surface-container text-on-surface-variant" },
  MEDIUM: { label: "Medium", className: "bg-warning-amber/15 text-warning-amber" },
  HIGH: { label: "High", className: "bg-error-container text-on-error-container" },
};
