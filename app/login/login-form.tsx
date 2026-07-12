"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 bg-primary text-on-primary font-bold rounded hover:bg-deep-navy transition-all active:scale-95 disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction] = useFormState(loginAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div>
        <label className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide block mb-1">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          className="w-full border border-outline-variant rounded px-3 py-2 text-body-md font-body focus:border-deep-navy focus:outline-none focus:ring-0"
          placeholder="you@profirmgroup.com"
        />
      </div>
      <div>
        <label className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide block mb-1">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          className="w-full border border-outline-variant rounded px-3 py-2 text-body-md font-body focus:border-deep-navy focus:outline-none focus:ring-0"
          placeholder="••••••••"
        />
      </div>
      {state?.error ? (
        <p className="text-error text-body-sm font-body">{state.error}</p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
