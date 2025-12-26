import React, { useState, useContext } from "react";
import { Eye, Trash2, Inbox, RefreshCw } from "lucide-react";
import { ScrollPanel } from "primereact/scrollpanel";
import { Skeleton } from "primereact/skeleton";
import { useTableTrackerData } from "../../../data/useTableTrackerData";
import { Context } from "../../../common/helper/Context";
import { GET_url } from "../../../connection/connection";

function RecentSessions() {
  const { data: recentSessions, loading, fetchTrackerData } = useTableTrackerData();
  const { updateSessionData, setActiveSession } = useContext(Context);
  const [loadingSession, setLoadingSession] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleViewClick = async (rowData) => {
    const sessionName = rowData.SESSION_NAME;
    if (!sessionName) return alert("Session name missing!");

    setLoadingSession(sessionName);

    try {
      const response = await fetch(GET_url.viewInfo(sessionName));
      if (!response.ok) throw new Error("Failed to fetch session data");
      const result = await response.json();

      const responseData = result?.data?.[0]?.response;
      if (!responseData) throw new Error("Invalid API structure");

      const files = responseData.files || {};
      const patterns = {};
      const dataTypes = Object.entries(files).map(([fileName, fileData]) => {
        patterns[fileName] = fileData.comparison || {};

        const columns = Object.values(fileData.metadata || {}).map((colMeta) => {
          const comparisonMeta =
            fileData.comparison?.[colMeta.column_name] || {};
          return {
            column_name: colMeta.column_name,
            inferred_sql_type:
              colMeta.technical_metadata?.inferred_sql_type || "",
            contextual_summary: comparisonMeta.contextual_summary || "",
            technical_summary: comparisonMeta.technical_summary || "",
            differences: Array.isArray(colMeta.differences)
              ? colMeta.differences.join(" | ")
              : "",
            more_accurate: colMeta.which_is_more_accurate?.selected || "",
            confidence: `${Math.round(
              (colMeta.contextual_metadata?.confidence || 0) * 100
            )}%`,
            sample_values: colMeta.technical_metadata?.sample_values || [],
          };
        });

        return { table_name: fileName, columns };
      });

      // 🧠 Create a clean sessionData object
      const sessionData = {
        dataTypes,
        patterns,
        relationships: responseData.relationships || [],
        insights: result?.insights?.insights || [],
        graphUrl: result?.graph_url || "",
      };

      // 🧩 Update context for same-tab use
      updateSessionData(sessionName, sessionData);
      setActiveSession(sessionName);

      // 💾 Save to localStorage for new tab restore
      if (result.session_id) localStorage.setItem("session_id", result.session_id);
      localStorage.setItem("active_session_name", sessionName);
      localStorage.setItem("session_data", JSON.stringify(sessionData));

      // 🚀 Open analysis in new tab
      window.open("/analysis", "_blank");
    } catch (error) {
      console.error("Error fetching session data:", error);
      alert("Failed to load session details.");
    } finally {
      setLoadingSession(null);
    }
  };

  return (
    <div className="px-6 min-w-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Recent Analysis Sessions</h3>
        <button
          onClick={!loading ? fetchTrackerData : undefined}
          className={`p-2 rounded-md transition-colors ${
            loading
              ? "text-slate-500 cursor-not-allowed"
              : "text-slate-400 hover:bg-slate-700 hover:text-white"
          }`}
          disabled={loading}
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      <div className="space-y-4">
        <ScrollPanel style={{ width: "100%", height: "300px" }}>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 mb-4"
              >
                <div className="flex-1">
                  <Skeleton
                    width="60%"
                    height="1.25rem"
                    className="mb-2 !bg-slate-700"
                  />
                  <Skeleton
                    width="40%"
                    height="0.875rem"
                    className="!bg-slate-700"
                  />
                </div>
                <Skeleton
                  shape="circle"
                  size="2rem"
                  className="ml-4 !bg-slate-700"
                />
              </div>
            ))
          ) : recentSessions && recentSessions.length > 0 ? (
            recentSessions.slice(0, 5).map((session) => {
              const isLoading = loadingSession === session.SESSION_NAME;
              const isCompleted =
                session.SESSION_STATUS?.toLowerCase() === "completed" ||
                session.SESSION_STATUS?.toLowerCase() === "success";
              const isDisabled = !!loadingSession || !isCompleted;

              return (
                <div
                  key={session.id}
                  className="flex justify-between items-center bg-[#1a202c] p-3 hover:bg-[#334155] rounded-sm mb-4"
                >
                  <div>
                    <p className="font-semibold cursor-default">
                      {session.SESSION_NAME}
                    </p>
                    <p className="text-xs text-[#94a3b8] cursor-default">
                      {session.SESSION_STATUS} • {formatDate(session.SESSION_TIME)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={isDisabled}
                      className={`p-2 rounded-md transition-colors ${
                        isDisabled
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-[#795eff] hover:bg-[#6a4be8] cursor-pointer"
                      }`}
                      onClick={() => handleViewClick(session)}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>

                    <button className="p-2 rounded-md bg-[#961010] hover:bg-[#7f0e0e] cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
              <Inbox className="w-12 h-12 text-slate-500" />
              <p className="mt-2">No recent sessions found.</p>
            </div>
          )}
        </ScrollPanel>
      </div>
    </div>
  );
}

export default RecentSessions;
