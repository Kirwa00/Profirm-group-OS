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

export const STATUS_META: Record<VentureStatus, { label: string; className: string }> = {
  IDEA: { label: "Idea", className: "bg-surface-container text-on-surface-variant" },
  VALIDATING: { label: "Validating", className: "bg-warning-amber/15 text-warning-amber" },
  BUILDING: { label: "Building", className: "bg-primary-container/15 text-primary-container" },
  SCALING: { label: "Scaling", className: "bg-success-green/15 text-success-green" },
};

export const SEVERITY_META: Record<WatchlistSeverity, { label: string; className: string }> = {
  LOW: { label: "Low", className: "bg-surface-container text-on-surface-variant" },
  MEDIUM: { label: "Medium", className: "bg-warning-amber/15 text-warning-amber" },
  HIGH: { label: "High", className: "bg-error-container text-on-error-container" },
};
