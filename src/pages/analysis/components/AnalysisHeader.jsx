import React, { useState } from "react";
import { Download, FileText, Grid, Layout, File } from "lucide-react";

export default function AnalysisHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div className="flex w-[100%] justify-between items-center">
        <h1 className="text-4xl font-bold text-white mb-2">Analysis Results</h1>
        {/* <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2 bg-[#795EFF] hover:bg-dsh text-white font-medium px-4 py-2 rounded-md shadow-md cursor-pointer"
        >
          <Download className="w-5 h-5" />
          Export Results
          <svg
            className="w-4 h-4 ml-1"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button> */}
      </div>

      <div>
        <div className="text-lg text-[#a1a8b3] mb-4">analysis session</div>
        <div className="text-[#8f9bb3] text-sm">
          1 files • Created Sep 15, 2025, 12:45 PM
        </div>
      </div>

      <div className="flex items-center relative">
        {open && (
          <ul
            className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-10"
            onMouseLeave={() => setOpen(false)}
          >
            <li>
              <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-200 hover:bg-slate-700">
                <FileText className="w-4 h-4" /> JSON Report
              </button>
            </li>
            <li>
              <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-200 hover:bg-slate-700">
                <Grid className="w-4 h-4" /> CSV Export
              </button>
            </li>
            <li>
              <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-200 hover:bg-slate-700">
                <Layout className="w-4 h-4" /> HTML Report
              </button>
            </li>
            <li>
              <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-200 hover:bg-slate-700">
                <File className="w-4 h-4" /> Text Report
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}