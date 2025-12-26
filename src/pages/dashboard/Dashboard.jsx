import React from 'react';
import DashboardMainContent from "../dashboard/components/DashboardMainContent";
import DashboardSidebar from "./components/DashboardSidebar";
import Datatable from './components/Datatable';

function Dashboard() {
  return (
    <div className="min-h-[80vh] w-[100%] text-white flex flex-col gap-6">
      <div className="flex gap-4">
        <DashboardMainContent />
        <DashboardSidebar />
      </div>
      <div className="flex w-full">
        <Datatable />
      </div>
    </div>
  );
}

export default Dashboard;
