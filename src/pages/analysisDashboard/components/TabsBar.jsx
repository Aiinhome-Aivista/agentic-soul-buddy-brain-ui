import React, { useState } from "react";
import { Type, TrendingUp, Link, Info, BarChart2, MessageSquare  } from "lucide-react";
import DataTypesTab from "./DataTypesTab";
import PatternsTab from "./PatternsTab";
import InsightsTab from "./InsightsTab";
import VisualizationTab from "./VisualizationTab";
import RelationshipsTab from "./RelationshipTab";
import VectorInsightsTab from "./VectorInsightsTab";
import ChatInsightsTab from "./ChatInsightsTab";

export default function TabsBar() {
  const [activeTab, setActiveTab] = useState("data-types");
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "data-types", label: "Data Types", icon: <Type className="w-4 h-4" /> },
    // { id: "patterns", label: "Patterns", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "relationships", label: "Relationships", icon: <Link className="w-4 h-4" /> },
    //{ id: "insights", label: "Insights", icon: <Info className="w-4 h-4" /> },
    { id: "visualization", label: "Visualization", icon: <BarChart2 className="w-4 h-4" /> },
   // { id: "chat-insights", label: "Chat Insights", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "vector-insights", label: "Speak to your data", icon: <Info className="w-4 h-4" /> },
  ];

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-[100%] mx-auto mt-6">
      {/* Tabs */}
      <ul className="flex border-b border-slate-700 text-sm font-medium text-slate-300">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 -mb-px border-b-2 transition-colors ${activeTab === tab.id
                ? "border-[#795EFF] text-white"
                : "border-transparent hover:text-[#795EFF] hover:border-[#795EFF]"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Main Content Area */}
      <div className="py-6">
        {loading ? (
          <div className="flex items-center justify-center gap-3 text-slate-300">
            <div className="w-5 h-5 border-2 border-[#795EFF] border-t-transparent rounded-full animate-spin"></div>
            <span>Loading analysis data...</span>
          </div>
        ) : (
          <div className="tab-content">
            {activeTab === "data-types" && (
              <div id="dataTypesContent" className="text-slate-200">
                {/* Replace with dynamic content */}
                <DataTypesTab />

              </div>
            )}
            {activeTab === "patterns" && (
              <div id="patternsContent" className="text-slate-200">
                <PatternsTab />
              </div>
            )}
            {activeTab === "relationships" && (
              <div id="relationshipsContent" className="text-slate-200">
                <RelationshipsTab />
              </div>
            )}
            {activeTab === "insights" && (
              <div id="insightsContent" className="text-slate-200">
                <InsightsTab />
              </div>
            )}
            {activeTab === "visualization" && (
              <div id="visualizationContent" className="text-slate-200 bg-slate-200 rounded-md w-[100%] min-h-[100%]">
                <VisualizationTab />
              </div>

            )}
               {activeTab === "chat-insights" && ( // ✅ new section
              <div id="chatInsightsContent" className="text-slate-200">
                <ChatInsightsTab />
              </div>
            )}
            {activeTab === "vector-insights" && (
              <div id="vectorInsightsContent" className="text-slate-200">
                <VectorInsightsTab />
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
