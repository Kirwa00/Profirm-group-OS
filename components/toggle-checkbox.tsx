"use client";

import { useTransition } from "react";

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
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        disabled={isPending}
        onChange={() => startTransition(() => onToggle())}
        className="w-4 h-4 rounded-sm border-2 border-outline-variant text-primary focus:ring-0 accent-deep-navy cursor-pointer"
      />
      <span
        className={`font-body text-body-md ${
          checked ? "line-through text-slate-gray" : "text-on-surface"
        }`}
      >
        {label}
      </span>
    </label>
  );
}
