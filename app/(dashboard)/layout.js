import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getReviewSession } from "@/lib/session";

export default async function DashboardLayout({ children }) {
  const session = await getReviewSession();
  if (session?.role !== "reviewer") redirect("/login");
  return <AppShell username={session.username}>{children}</AppShell>;
}
