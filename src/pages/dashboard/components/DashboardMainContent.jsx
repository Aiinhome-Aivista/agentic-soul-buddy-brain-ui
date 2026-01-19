import React from "react";
import { Database, Zap, TrendingUp, Link } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardMainContent() {
  const navigate = useNavigate();

  return (
    <div className="w-[65%]">
      <div className="flex flex-col gap-6">
        {/* Header Intro */}
        <div className="bg-[#795EFF] p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-2">Soul Junction Admin Panel</h2>
          <p className="text-[#f1f5f9] mb-4 text-sm">
            Upload multiple database files and get AI-powered insights about data types,
            patterns, relationships, and potential optimizations.
          </p>
          <button
            className="bg-[#1e293b] text-[#f1f5f9] font-semibold px-5 py-2 rounded-xs shadow border-1 border-[#f1f5f9] hover:bg-[#334155] cursor-pointer"
            onClick={() => navigate("/upload")}
          >
            Start Analysis
          </button>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-4 px-3">
          <div className="bg-[#1e293b] p-4 rounded-lg shadow hover:bg-[#334155] flex-1">
            <h3 className="flex items-center gap-2 font-semibold mb-2">
              <Database className="w-5 h-5 text-[#c084fc]" /> Multiple File Formats
            </h3>
            <p className="text-sm text-[#cbd5e1]">
              Support for PDF and Doc files with intelligent parsing.
            </p>
          </div>

          <div className="bg-[#1e293b] p-4 rounded-lg shadow hover:bg-[#334155] flex-1 ">
            <h3 className="flex items-center gap-2 font-semibold mb-2">
              <Zap className="w-5 h-5 text-[#4ade80]" /> Smart Data Type Detection
            </h3>
            <p className="text-sm text-[#cbd5e1]">
              Automatically identify data types: IDs, names, dates, monetary values, and more.
            </p>
          </div>

          <div className="bg-[#1e293b] p-4 rounded-lg shadow hover:bg-[#334155] flex-1">
            <h3 className="flex items-center gap-2 font-semibold mb-2">
              <TrendingUp className="w-5 h-5 text-[#facc15]" /> Pattern Analysis
            </h3>
            <p className="text-sm text-[#cbd5e1]">
              Detect outliers, sequences, correlations, and missing data patterns.
            </p>
          </div>

          <div className="bg-[#1e293b] p-4 rounded-lg shadow hover:bg-[#334155] flex-1">
            <h3 className="flex items-center gap-2 font-semibold mb-2">
              <Link className="w-5 h-5 text-[#22d3ee]" /> Relationship Mapping
            </h3>
            <p className="text-sm text-[#cbd5e1]">
              Identify primary/foreign keys and suggest optimal join strategies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}