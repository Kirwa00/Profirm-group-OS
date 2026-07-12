"use client";

import { useTransition } from "react";

// Icon-based checklist item matching the Stitch mockups' pattern exactly
// (check_box / check_box_outline_blank material icons — see the "Next 3
// Priorities" lists in ventureos_portfolio_overview/code.html) rather than a
// native checkbox input.
export default function ToggleCheckbox({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => Promise<void>;
  label: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => onToggle())}
      className="w-full flex items-start gap-3 text-left disabled:opacity-60"
    >
      <span
        className={`material-symbols-outlined text-lg mt-0.5 ${
          checked ? "text-success-green" : "text-slate-gray"
        }`}
      >
        {checked ? "check_box" : "check_box_outline_blank"}
      </span>
      <span
        className={`font-body text-body-sm ${
          checked ? "line-through text-slate-gray" : "text-on-surface"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
