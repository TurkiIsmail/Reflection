"use client";
import Dashboard from "@/components/main/dashboard";
import Nav from "@/components/navbar/nav";

export default function DashboardPage() {
  return (
    <>
        <Nav />
      <div className="min-h-screen text-white flex flex-col items-center justify-start pt-12">
        <Dashboard />
      </div>
    </>
  );
}
