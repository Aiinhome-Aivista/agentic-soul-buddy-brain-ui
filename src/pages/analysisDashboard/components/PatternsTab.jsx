import React from "react";
import { TrendingUp } from "lucide-react";

export default function PatternsTab() {
  return (
    <div className="space-y-6">
      {/* File Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
          <TrendingUp className="w-5 h-5 text-[#795EFF]" />
          <h5 className="text-lg font-semibold text-white">
            users.csv – Pattern Analysis
          </h5>
        </div>

        {/* Body */}
        <div className="p-4 space-y-6">
          {/* Outliers Section */}
          <div>
            <h6 className="text-white font-semibold mb-2">Outliers</h6>
            <ul className="list-disc list-inside text-slate-300 text-sm">
              <li>Age column: 2 extreme values (150, -5)</li>
              <li>Salary column: unusually high values detected</li>
            </ul>
          </div>

          {/* Data Quality Section */}
          <div>
            <h6 className="text-white font-semibold mb-2">Data Quality</h6>
            <ul className="list-disc list-inside text-slate-300 text-sm">
              <li>Missing values in column <code>email</code></li>
              <li>Duplicate rows found in <code>username</code></li>
            </ul>
          </div>

          {/* Correlations Section */}
          <div>
            <h6 className="text-white font-semibold mb-2">Correlations</h6>
            <ul className="list-disc list-inside text-slate-300 text-sm">
              <li><code>Age</code> strongly correlates with <code>Experience</code> (0.82)</li>
              <li><code>Salary</code> moderately correlates with <code>Education</code> (0.65)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Second File Example */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-md">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
          <TrendingUp className="w-5 h-5 text-[#795EFF]" />
          <h5 className="text-lg font-semibold text-white">
            orders.csv – Pattern Analysis
          </h5>
        </div>
        <div className="p-4 space-y-6">
          <div>
            <h6 className="text-white font-semibold mb-2">Outliers</h6>
            <ul className="list-disc list-inside text-slate-300 text-sm">
              <li>Order amount: 3 transactions exceed 1M</li>
            </ul>
          </div>
          <div>
            <h6 className="text-white font-semibold mb-2">Data Quality</h6>
            <ul className="list-disc list-inside text-slate-300 text-sm">
              <li>Some <code>order_date</code> values are invalid</li>
              <li>Duplicate order IDs detected</li>
            </ul>
          </div>
          <div>
            <h6 className="text-white font-semibold mb-2">Correlations</h6>
            <ul className="list-disc list-inside text-slate-300 text-sm">
              <li><code>Order Value</code> correlates with <code>Discount</code> (-0.55)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
