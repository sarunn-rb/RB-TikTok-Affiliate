"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton({ compact = false }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    if (pending) return;
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <button className={compact ? "icon-button" : "account-button"} onClick={logout} disabled={pending} aria-label="Log out">
      <LogOut size={16} /> {!compact && <span>{pending ? "Logging out…" : "Log out"}</span>}
    </button>
  );
}
