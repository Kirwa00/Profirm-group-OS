// Deterministic per-venture color so the same venture always renders in the
// same color everywhere (task panel, calendar) without storing a color on
// the Venture model. Classes are written out literally (not templated) so
// Tailwind's JIT scanner picks them all up.
const PALETTE = [
  { dot: "bg-rose-500", chip: "bg-rose-50 text-rose-700 border-rose-200" },
  { dot: "bg-orange-500", chip: "bg-orange-50 text-orange-700 border-orange-200" },
  { dot: "bg-amber-500", chip: "bg-amber-50 text-amber-700 border-amber-200" },
  { dot: "bg-lime-500", chip: "bg-lime-50 text-lime-700 border-lime-200" },
  { dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { dot: "bg-teal-500", chip: "bg-teal-50 text-teal-700 border-teal-200" },
  { dot: "bg-cyan-500", chip: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { dot: "bg-blue-500", chip: "bg-blue-50 text-blue-700 border-blue-200" },
  { dot: "bg-indigo-500", chip: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { dot: "bg-violet-500", chip: "bg-violet-50 text-violet-700 border-violet-200" },
  { dot: "bg-fuchsia-500", chip: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200" },
] as const;

export function ventureColor(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}
