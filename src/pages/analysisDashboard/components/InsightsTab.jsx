import React from "react";
import { Info, CheckCircle, ArrowRight, AlertTriangle } from "lucide-react";

export default function InsightsTab() {
  return (
    <div className="space-y-6">
      {/* Insights Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
          <Info className="w-5 h-5 text-[#795EFF]" />
          <h5 className="text-lg font-semibold text-white">
            users.csv – Data Insights
          </h5>
        </div>

        {/* Body */}
        <div className="p-4 space-y-6">
          {/* File Summary */}
          <div>
            <h6 className="text-white font-semibold mb-3">File Summary</h6>
            <div className="flex justify-between text-center">
              <div>
                <div className="text-xl font-bold text-[#795EFF]">12,345</div>
                <div className="text-slate-400 text-sm">Rows</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-400">24</div>
                <div className="text-slate-400 text-sm">Columns</div>
              </div>
              <div>
                <div className="text-xl font-bold text-yellow-400">15 MB</div>
                <div className="text-slate-400 text-sm">Memory</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-400">8.2%</div>
                <div className="text-slate-400 text-sm">Missing Data</div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div>
            <h6 className="text-white font-semibold mb-3">Key Insights</h6>
            <ul className="space-y-2">
              <li className="flex items-center text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                Age distribution is skewed towards 25–35 years.
              </li>
              <li className="flex items-center text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                70% of users are active monthly.
              </li>
            </ul>
          </div>

          {/* Recommendations */}
          {/* <div>
            <h6 className="text-white font-semibold mb-3">Recommendations</h6>
            <ul className="space-y-2">
              <li className="flex items-center text-slate-300">
                <ArrowRight className="w-4 h-4 text-purple-400 mr-2" />
                Normalize age column to handle outliers.
              </li>
              <li className="flex items-center text-slate-300">
                <ArrowRight className="w-4 h-4 text-purple-400 mr-2" />
                Fill missing emails with placeholder values.
              </li>
            </ul>
          </div> */}

          {/* Data Quality Issues */}
          {/* <div>
            <h6 className="text-white font-semibold mb-3">
              Data Quality Issues
            </h6>
            <ul className="space-y-2">
              <li className="flex items-center text-slate-300">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2" />
                Duplicate usernames found.
              </li>
              <li className="flex items-center text-slate-300">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2" />
                Null values in <code>email</code> column.
              </li>
            </ul>
          </div> */}
        </div>
      </div>

      {/* Example: Second File */}
     </div>
  );
}
