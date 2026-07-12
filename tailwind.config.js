const path = require("path");

// Tokens sourced from stitch_extracted/stitch_sdlc_blue_gold_interface/venture_integrity/DESIGN.md
//
// Plain .js (not .ts) — Next.js's built-in PostCSS/Tailwind integration was
// silently failing to load tailwind.config.ts, falling back to Tailwind's
// own default config (content: []), which explains why only the Tailwind
// base/reset layer compiled and every utility class was missing at runtime.
/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    path.join(__dirname, "app/**/*.{ts,tsx}"),
    path.join(__dirname, "components/**/*.{ts,tsx}"),
  ],
  theme: {
    extend: {
      colors: {
        surface: "#fbf9fb",
        "surface-dim": "#dbd9db",
        "surface-bright": "#fbf9fb",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f5f3f5",
        "surface-container": "#efedef",
        "surface-container-high": "#eae7ea",
        "surface-container-highest": "#e4e2e4",
        "on-surface": "#1b1b1d",
        "on-surface-variant": "#44474d",
        "inverse-surface": "#303032",
        "inverse-on-surface": "#f2f0f2",
        outline: "#75777e",
        "outline-variant": "#c5c6cd",
        "surface-tint": "#515f78",
        primary: "#000000",
        "on-primary": "#ffffff",
        "primary-container": "#0d1c32",
        "on-primary-container": "#76849f",
        "inverse-primary": "#b9c7e4",
        secondary: "#765a19",
        "on-secondary": "#ffffff",
        "secondary-container": "#ffd88a",
        "on-secondary-container": "#795c1b",
        tertiary: "#000000",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#191c1e",
        "on-tertiary-container": "#818486",
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        background: "#fbf9fb",
        "on-background": "#1b1b1d",
        "surface-variant": "#e4e2e4",
        "deep-navy": "#0A192F",
        "metallic-gold": "#B8964F",
        "slate-gray": "#64748B",
        "success-green": "#10B981",
        "warning-amber": "#F59E0B",
      },
      fontFamily: {
        display: ["var(--font-manrope)", "sans-serif"],
        headline: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        label: ["var(--font-jetbrains-mono)", "monospace"],
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "500" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }],
      },
      spacing: {
        unit: "8px",
        "margin-mobile": "16px",
        "margin-desktop": "40px",
        gutter: "24px",
      },
      maxWidth: {
        "container-max": "1280px",
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
    },
  },
  plugins: [],
};

module.exports = config;
