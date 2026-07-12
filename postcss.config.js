const path = require("path");

// Explicit config path — Tailwind's own auto-discovery of tailwind.config.js
// was silently failing inside Next.js's PostCSS invocation (base/reset layer
// compiled, but content/utilities resolved empty), even though the same
// config worked fine via the standalone `tailwindcss` CLI with --config.
module.exports = {
  plugins: {
    tailwindcss: { config: path.join(__dirname, "tailwind.config.js") },
    autoprefixer: {},
  },
};
