"use client";

import { useTransition } from "react";
import { updateVentureStatus } from "../actions";
import { STATUS_META } from "@/lib/constants";
import type { VentureStatus } from "@prisma/client";

export default function StatusSelect({
  ventureKey,
  status,
}: {
  ventureKey: string;
  status: VentureStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) =>
        startTransition(() => updateVentureStatus(ventureKey, e.target.value as VentureStatus))
      }
      className="font-label text-label-sm px-3 py-2 rounded border border-outline-variant bg-white uppercase tracking-wide disabled:opacity-60"
    >
      {(Object.entries(STATUS_META) as [VentureStatus, { label: string }][]).map(
        ([value, meta]) => (
          <option key={value} value={value}>
            {meta.label}
          </option>
        )
      )}
    </select>
  );
}
