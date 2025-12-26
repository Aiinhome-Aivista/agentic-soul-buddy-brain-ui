import React from "react";
import { Settings } from "lucide-react";

function AnalysisOptions() {
  return (
    <div className="bg-slate-900 border border-slate-600 rounded-md p-4">
      <h3 className="flex items-center gap-2 font-semibold text-white mb-3">
        <Settings className="w-4 h-4 text-[#795EFF]" /> Analysis Options
      </h3>
      <div className="flex flex-wrap gap-4 text-sm text-slate-300">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-[#795EFF]" defaultChecked /> Data Type Analysis
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-[#795EFF]" defaultChecked /> Pattern Detection
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-[#795EFF]" /> Relationship Analysis
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-[#795EFF]" /> Outlier Detection
        </label>
      </div>
    </div>
  );
}

export default AnalysisOptions;