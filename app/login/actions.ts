"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { isDbConfigured } from "@/lib/prisma";

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  if (!isDbConfigured()) {
    return { error: "No database connected yet — see setup instructions below." };
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/");

  try {
    await signIn("credentials", { email, password, redirectTo: callbackUrl });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw err;
  }
}
