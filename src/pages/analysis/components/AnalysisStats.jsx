import React, { useContext } from "react";
import { File, Database, Columns, CircleCheckBig } from "lucide-react";
import { Context } from "../../../common/helper/Context";
import { useState, useEffect } from "react";

export default function AnalysisStats({ responseData }) {
  const { files, hasStructuredData, unstructuredFilesCount } = useContext(Context);

  return (
    <div className="flex flex-wrap justify-center w-full gap-6 mb-6">
      {hasStructuredData ? (
        // ----------------------------------------------------
        // FIX: Wrap the multiple adjacent elements in a parent div
        // ----------------------------------------------------
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Files Analyzed */}
          <div className="flex-1 min-w-[200px] bg-blue-600 text-white rounded-lg shadow p-6 flex flex-col items-center">
            <File className="w-8 h-8 mb-2" />
            {/* <h3 className="text-2xl font-bold">{Array.isArray(files) ? files.length : 0}</h3> */}
            <h3 className="text-2xl font-bold">{responseData?.total_files_uploaded ?? 0}
            </h3>
            <p className="text-sm">Files Analyzed</p>
          </div>

          {/* Total Rows */}
          <div className="flex-1 min-w-[200px] bg-green-600 text-white rounded-lg shadow p-6 flex flex-col items-center">
            <Database className="w-8 h-8 mb-2" />
            <h3 className="text-2xl font-bold">{responseData?.total_rows ?? 0}
            </h3>
            <p className="text-sm">Total Rows</p>
          </div>

          {/* Total Columns */}
          <div className="flex-1 min-w-[200px] bg-yellow-500 text-white rounded-lg shadow p-6 flex flex-col items-center">
            <Columns className="w-8 h-8 mb-2" />
            <h3 className="text-2xl font-bold">{responseData?.total_columns ?? 0}</h3>
            <p className="text-sm">Total Columns</p>
          </div>

          {/* Quality Score */}
          <div className="flex-1 min-w-[200px] bg-cyan-500 text-white rounded-lg shadow p-6 flex flex-col items-center">
            <CircleCheckBig className="w-8 h-8 mb-2" />
            <h3 className="text-2xl font-bold">{responseData?.average_quality_score ?? 0}%</h3>
            <p className="text-sm">Quality Score</p>
          </div>

        </div> // <-- Closing the parent wrapper div

      ) : (
        <div className="flex w-xs bg-blue-600 text-white rounded-lg shadow p-6 flex flex-col items-center">
            <File className="w-8 h-8 mb-2" />
            {/* <h3 className="text-2xl font-bold">{Array.isArray(files) ? files.length : 0}</h3> */}
            <h3 className="text-2xl font-bold">{unstructuredFilesCount ?? 0}
            </h3>
            <p className="text-sm">Files Analyzed</p>
          </div>
      )}
    </div>
  );
}
