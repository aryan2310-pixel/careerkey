"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin-portal/auth/logout", { method: "POST" });
    router.replace("/admin-portal/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-slate-50"
    >
      Log out
    </button>
  );
}