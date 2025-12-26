import React from "react";
import ReadyToAnalyze from "./ReadyToAnalyze";
import AnalysisDashboard from "../../analysisDashboard/AnalysisDashboard";

export default function AnalysisContent({ analyzed, setAnalyzed }) {
  return (
    <div>
      {analyzed ? <AnalysisDashboard /> : <ReadyToAnalyze setAnalyzed={setAnalyzed} />}
    </div>
  );
}
