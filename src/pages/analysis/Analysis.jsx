// import React, { useState } from "react";
// import AnalysisHeader from "../analysis/components/AnalysisHeader";
// import AnalysisStats from "../analysis/components/AnalysisStats";
// import AnalysisContent from "../analysis/components/AnalysisContent";

// export default function Analysis() {
//   const [analyzed, setAnalyzed] = useState(null);

//   return (
//     <div>
//       <AnalysisHeader />
//       <AnalysisStats />
//       <AnalysisContent analyzed={analyzed} setAnalyzed={setAnalyzed} />
//     </div>
//   );
// }


import React, { useState, useEffect, useContext } from "react";
import AnalysisHeader from "../analysis/components/AnalysisHeader";
import AnalysisStats from "../analysis/components/AnalysisStats";
import AnalysisContent from "../analysis/components/AnalysisContent";
import { Context } from "../../common/helper/Context";
import { POST_url } from "../../connection/connection";

export default function Analysis() {
  const [analyzed, setAnalyzed] = useState(null);
  const { updateSessionData, setActiveSession } = useContext(Context);
  const [session, setSession] = useState('')
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    // Restore session from localStorage when opened in a new tab
    const sessionName = localStorage.getItem("active_session_name");
    const sessionData = JSON.parse(localStorage.getItem("session_data") || "{}");

    if (sessionName && Object.keys(sessionData).length > 0) {
      setActiveSession(sessionName);
      updateSessionData(sessionName, sessionData);
      setSession(sessionName)
      // console.log(" Session restored from localStorage:", sessionName);
    } else {
      // console.warn(" No session found in localStorage. Redirect or show message.");
    }
  }, [setActiveSession, updateSessionData]);

  // Fetch data when session is set
  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      try {
        const res = await fetch(POST_url.uploadfiles_details, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_name: session }),

        });

        if (!res.ok) throw new Error("Failed to fetch data");
        const result = await res.json();
        const extracted = {
          total_columns: result?.data?.total_columns ?? 0,
          total_files_uploaded: result?.data?.total_files_uploaded ?? 0,
          average_quality_score: result?.data?.average_quality_score ?? 0,
          total_rows: result?.data?.total_rows ?? 0
        };
  
        setResponseData(extracted);
      } catch (error) {
        console.error(" Error fetching data:", error);
      }
    };

    fetchData();
  }, [session]);

  return (
    <div>
      <AnalysisHeader />
      <AnalysisStats responseData = {responseData} />
      <AnalysisContent analyzed={analyzed} setAnalyzed={setAnalyzed} />
    </div>
  );
}
