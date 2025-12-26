import React from "react";
import RecentSessions from "../components/RecentSessions";
import SupportingFormat from "../components/SupportingFormat";

export default function DashboardSidebar() {
  return (
    <div className="flex flex-col w-[35%] gap-8">
      <RecentSessions />
      <SupportingFormat />
    </div>
  );
}
