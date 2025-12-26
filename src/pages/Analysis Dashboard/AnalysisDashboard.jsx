import React from "react";
export default function Analysis() {
  return (
    <div className="min-h-screen bg-[#181C2A] flex flex-col items-center py-12">
      <div className="text-left w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-2">Analysis Results</h1>
        <div className="text-lg text-[#a1a8b3] mb-4">
          analysis session
        </div>
        <div className="text-[#8f9bb3] text-sm">
          1 files • Created Sep 15, 2025, 12:45 PM
        </div>
      </div>
      <div className="grid grid-cols-4 gap-8 mt-8 mb-8 max-w-4xl w-full">
        <div className="bg-[#7A6FF0] rounded-lg py-10 flex flex-col items-center">
          <svg className="w-10 h-10 mb-2" /* icon code here */ />
          <span className="text-4xl font-bold text-white">1</span>
          <span className="text-lg text-white mt-2">Files Analyzed</span>
        </div>
        <div className="bg-[#77E1A7] rounded-lg py-10 flex flex-col items-center">
          <svg className="w-10 h-10 mb-2" /* icon code here */ />
          <span className="text-4xl font-bold text-white">531</span>
          <span className="text-lg text-white mt-2">Total Rows</span>
        </div>
        <div className="bg-[#B59A2A] rounded-lg py-10 flex flex-col items-center">
          <svg className="w-10 h-10 mb-2" /* icon code here */ />
          <span className="text-4xl font-bold text-white">12</span>
          <span className="text-lg text-white mt-2">Total Columns</span>
        </div>
        <div className="bg-[#32C8E2] rounded-lg py-10 flex flex-col items-center">
          <svg className="w-10 h-10 mb-2" /* icon code here */ />
          <span className="text-4xl font-bold text-white">85%</span>
          <span className="text-lg text-white mt-2">Quality Score</span>
        </div>
      </div>
      <div className="flex flex-col items-center mt-6">
        <div className="flex items-center justify-center mb-3">
          {/* Play icon */}
          <svg className="w-14 h-14 text-[#7A6FF0]" /* icon code here */ />
        </div>
        <div className="text-2xl font-semibold text-white mb-3">Ready to Analyze</div>
        <div className="text-[#a1a8b3] mb-6">
          Your files have been uploaded successfully. Click the button below to start the analysis.
        </div>
        <button className="bg-[#7A6FF0] hover:bg-[#5e54c7] text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition">
          Start Analysis
        </button>
      </div>
    </div>
  );
}
