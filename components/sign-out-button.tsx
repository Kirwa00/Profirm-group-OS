import { signOut } from "@/auth";

export default function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <button
        type="submit"
        className="material-symbols-outlined text-slate-gray cursor-pointer hover:text-primary"
        title="Sign out"
      >
        logout
      </button>
    </form>
  );
}
