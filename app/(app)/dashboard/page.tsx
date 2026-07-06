"use client";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/auth.store";

import { ManagerDashboard } from "./components/manager-dashboard";
import { ResidentDashboard } from "./components/resident-dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);

  if (role === "staff") {
    router.replace("/tasks");
    return null;
  }

  return (
    <div className="sk-page">
      {role === "manager" ? <ManagerDashboard /> : <ResidentDashboard />}
    </div>
  );
}
