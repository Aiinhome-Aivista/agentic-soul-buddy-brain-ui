import React from "react";
import { Info, Search } from "lucide-react";

function InfoSection() {
  return (
    <>
      {/* Supported File Formats */}
      {/* <div className="bg-sky-100/10 border border-sky-400 rounded-md p-4 text-sm text-slate-200">
        <h3 className="flex items-center gap-2 font-semibold text-sky-300 mb-2">
          <Info className="w-4 h-4" /> Supported File Formats
        </h3>
        <div className="flex flex-wrap gap-6">
          <ul className="list-disc list-inside space-y-1">
            <li>
              <span className="font-semibold text-white">CSV:</span> Auto-detection of delimiters
            </li>
            <li>
              <span className="font-semibold text-white">SQL:</span> CREATE TABLE and INSERT statements
            </li>
          </ul>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <span className="font-semibold text-white">Excel:</span> .xls and .xlsx with multiple sheet support
            </li>
            <li>
              <span className="font-semibold text-white">XML:</span> Structured XML data with auto-parsing
            </li>
          </ul>
        </div>
      </div> */}

      {/* What happens during analysis */}
      <div className="bg-slate-800 rounded-md">
        <div className="flex items-center gap-2 border-b border-slate-700 px-4 py-3">
          <Search className="w-4 h-4 text-slate-300" />
          <h3 className="text-white font-semibold">What happens during analysis?</h3>
        </div>
        <div className="flex flex-wrap justify-between gap-6 p-6 text-sm">
          <div className="max-w-sm">
            <h4 className="text-[#795EFF] font-semibold mb-2">Data Type Detection</h4>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              <li>Automatic identification of IDs, names, dates, monetary values</li>
              <li>Pattern classification for better understanding</li>
              <li>Data quality assessment</li>
            </ul>
          </div>
          <div className="max-w-sm">
            <h4 className="text-green-400 font-semibold mb-2">Relationship Mapping</h4>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              <li>Primary and foreign key identification</li>
              <li>Join strategy recommendations</li>
              <li>Table relationship visualization</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default InfoSection;