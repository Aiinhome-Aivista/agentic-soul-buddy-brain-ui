// import React, { useContext } from "react";
// import { Context } from "../../../common/helper/Context";

// function VisualizationTab() {
//   const { activeSession, sessionData } = useContext(Context);

//   // Load graphUrl and insights for the active session
//   const graphUrl = activeSession ? sessionData[activeSession]?.graphUrl : null;
//   const insights = activeSession ? sessionData[activeSession]?.insights : [];

//   return (
//     <div style={{ width: "100%", minHeight: "100%", overflow: "auto", padding: "20px" }}>
//       {/* Graph Visualization */}
//       <div className="mb-10">
//         {graphUrl ? (
//           <div
//             style={{
//               width: "100%",
//               height: "600px",
//               overflow: "hidden",
//               borderRadius: "10px",
//               boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//             }}
//           >
//             <iframe
//               src={graphUrl}
//               style={{ width: "100%", height: "100%", border: 0 }}
//               title="Visualization Graph"
//             />
//           </div>
//         ) : (
//           <p className="text-gray-400 text-center">Graph visualization not available.</p>
//         )}
//       </div>

//       {/* Insights Section */}
//       <div className="space-y-4">
//         <h3 className="text-black text-xl font-semibold mb-2">Data Insights</h3>
//         {insights && insights.length > 0 ? (
//           <div className="grid md:grid-cols-2 gap-4">
//             {insights.map((insight, i) => (
//               <div
//                 key={i}
//                 className="p-4 bg-slate-700 text-white rounded-xl shadow hover:shadow-lg transition"
//               >
//                 {insight}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-400">No insights available yet.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default VisualizationTab;


import React, { useContext } from "react";
import { Context } from "../../../common/helper/Context";

function VisualizationTab() {
  const { activeSession, sessionData } = useContext(Context);

  // Load graphUrl and insights for the active session
  const graphUrl = activeSession ? sessionData[activeSession]?.graphUrl : null;
  // insights is an array, default to empty array if not present
  const insights = activeSession ? sessionData[activeSession]?.insights : [];

  // --- Logic to Check for the Error Pattern ---
  const LLM_ERROR_PATTERN = "[LLM Error]";

  // Check if insights is an array with an error string as the first element.
  const hasInsightsError = 
    Array.isArray(insights) && 
    insights.length > 0 && 
    typeof insights[0] === 'string' && 
    insights[0].includes(LLM_ERROR_PATTERN);

  // --- Logic to Check for Displayable Insights ---
  // Insights should be displayed only if they are present AND there is no error.
  const shouldDisplayInsightsContent = 
    Array.isArray(insights) && 
    insights.length > 0 && 
    !hasInsightsError;
  
  // Decide if the entire Data Insights section (including the header) should be rendered.
  // It should be rendered if there are valid insights OR if there's no error 
  // and we want to show the "No insights available yet" message.
  const shouldRenderInsightsSection = 
      shouldDisplayInsightsContent || 
      (!hasInsightsError && (insights.length === 0 || !insights));
  
  // *Self-Correction/Simplification*: A simpler way is to just render the section 
  // UNLESS the specific error is present. If the section renders, the content 
  // inside handles the "No insights available" case.
  const shouldHideSection = hasInsightsError;
  // ---------------------------------------------


  return (
    <div style={{ width: "100%", minHeight: "100%", overflow: "auto", padding: "20px" }}>
      {/* Graph Visualization */}
      <div className="mb-10">
        {graphUrl ? (
          <div
            style={{
              width: "100%",
              height: "600px",
              overflow: "hidden",
              borderRadius: "10px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <iframe
              src={graphUrl}
              style={{ width: "100%", height: "100%", border: 0 }}
              title="Visualization Graph"
            />
          </div>
        ) : (
          <p className="text-gray-400 text-center">Graph visualization not available.</p>
        )}
      </div>

      {/* Insights Section: 
        We use a conditional check here to hide the entire div 
        if hasInsightsError is true. 
      */}
      {!hasInsightsError && (
        <div className="space-y-4">
          <h3 className="text-black text-xl font-semibold mb-2">Data Insights</h3>
          {/* Content display check remains similar to the previous logic */}
          {shouldDisplayInsightsContent ? (
            <div className="grid md:grid-cols-2 gap-4">
              {insights.map((insight, i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-700 text-white rounded-xl shadow hover:shadow-lg transition"
                >
                  {insight}
                </div>
              ))}
            </div>
          ) : (
            // This is shown only if there are NO insights and NO error
            <p className="text-gray-400">No insights available yet.</p>
          )}
        </div>
      )}
      
      {/* Optional: You can add an error message here if the section is hidden */}
      {/*
      {hasInsightsError && (
          <p className="text-red-400">A temporary error occurred while fetching data insights.</p>
      )}
      */}
    </div>
  );
}

export default VisualizationTab;