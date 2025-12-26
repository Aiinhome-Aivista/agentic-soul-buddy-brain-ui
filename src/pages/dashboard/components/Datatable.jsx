
import React, { useState, useMemo, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Eye, Trash2, Search, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../../../common/components/Loader";
import { useTableTrackerData } from "../../../data/useTableTrackerData";
import { GET_url, DELETE_url } from "../../../connection/connection";
import { Context } from "../../../common/helper/Context";

export default function Datatable() {
  const navigate = useNavigate();
  const { data, loading, fetchTrackerData } = useTableTrackerData();
  const { updateSessionData, setActiveSession } = useContext(Context);

  const [search, setSearch] = useState("");
  const [loadingSession, setLoadingSession] = useState(null);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ✅ Filtered data based on search
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const lower = search.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(lower)
      )
    );
  }, [data, search]);

  // ✅ View session details
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
            // confidence: `${Math.round(
            //   (colMeta.contextual_metadata?.confidence || 0) * 100
            // )}%`,
            confidence: `${Math.round((comparisonMeta.confidence || 0) * 100)}%`,
            sample_values: colMeta.technical_metadata?.sample_values || [],
            user_input: comparisonMeta.user_input || "",
          };
        });

        return { table_name: fileName, columns };
      });

      // ✅ Update context data
      const sessionData = {
        dataTypes,
        patterns,
        relationships: responseData.relationships || [],
        insights: result?.insights?.insights || [],
        graphUrl: result?.graph_url || "",
      };

      updateSessionData(sessionName, sessionData);
      setActiveSession(sessionName);

      // ✅ Save session locally
      if (result.session_id)
        localStorage.setItem("session_id", result.session_id);
      localStorage.setItem("active_session_name", sessionName);
      localStorage.setItem("session_data", JSON.stringify(sessionData));

      // window.open("/analysis", "_blank");
      navigate('/analysis')
    } catch (error) {
      console.error("Error fetching session data:", error);
      alert("Failed to load session details.");
    } finally {
      setLoadingSession(null);
    }
  };

  // ✅ Delete session handler
  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;
    setDeleting(true);
    try {
      const response = await fetch(DELETE_url.deleteSession(sessionToDelete), {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete session");
      alert(`Session "${sessionToDelete}" deleted successfully.`);
      fetchTrackerData();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting session.");
    } finally {
      setDeleting(false);
      setSessionToDelete(null);
    }
  };

  // ✅ Action buttons for each row
  const actionBodyTemplate = (rowData) => {
    const isLoading = loadingSession === rowData.SESSION_NAME;
    const isCompleted =
      rowData.SESSION_STATUS?.toLowerCase() === "completed" ||
      rowData.SESSION_STATUS?.toLowerCase() === "success";
    const isDisabled = !!loadingSession || !isCompleted;

    return (
      <div className="flex gap-2">
        <button
          className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${isDisabled
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#795eff] hover:bg-[#6a4be8]"
            }`}
          disabled={isDisabled}
          onClick={() => handleViewClick(rowData)}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Eye className="w-4 h-4 text-white" />
          )}
        </button>

        <button
          className="w-8 h-8 flex items-center justify-center rounded-md bg-[#961010] hover:bg-[#7f0e0e]"
          onClick={() => setSessionToDelete(rowData.SESSION_NAME)}
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      </div>
    );
  };

  // ✅ Custom cell rendering
  const defaultBodyTemplate = (rowData, col) => {
    const value = rowData[col.field];
    if (col.field === "SESSION_STATUS")
      return value === "Success" ? "Completed" : value || "--";
    if (col.field === "RELATIONSHIPS") return "Done";
    if (col.field === "Tables_name") return value || "--"; // ✅ Fix for Table Names
    return value || "--";
  };

  // ✅ Define columns (Tables_name bound correctly)
  const columns = [
    { field: "SESSION_NAME", header: "Session Name" },
    { field: "Tables_name", header: "Table Name" }, // ✅ Fixed field name
    { field: "DATA_TYPE_ANALYZER", header: "Datatypes" },
    { field: "RELATIONSHIPS", header: "Relationships" },
    { field: "VISUALIZATION", header: "Visualization" },
    { field: "INSIGHTS", header: "Data Insights" },
    { field: "SESSION_STATUS", header: "Status" },
    { field: "action", header: "Action" },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 🔍 Search & Refresh */}
      <div className="flex flex-row items-center justify-end mt-6 gap-4">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-4 pr-10 border border-slate-600 rounded-lg text-slate-200 bg-slate-800 focus:ring-2 focus:ring-[#795eff] focus:outline-none"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>

        <button
          className={`w-10 h-10 flex items-center justify-center border border-slate-600 rounded-lg ${loading
              ? "bg-slate-700 cursor-not-allowed"
              : "bg-slate-800 hover:bg-slate-700"
            }`}
          onClick={!loading ? fetchTrackerData : undefined}
        >
          <RefreshCw
            className={`w-5 h-5 ${loading ? "animate-spin text-white" : "text-slate-400"
              }`}
          />
        </button>
      </div>

      {/* 📋 Main DataTable */}
      <DataTable
        value={filteredData}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        rowHover
        className="w-full"
        emptyMessage={loading ? <Loader /> : "No sessions found."}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        {columns.map((col) =>
          col.field === "action" ? (
            <Column
              key={col.field}
              header={col.header}
              body={actionBodyTemplate}
            />
          ) : (
            <Column
              key={col.field}
              field={col.field}
              header={col.header}
              body={(row) => defaultBodyTemplate(row, col)}
            />
          )
        )}
      </DataTable>

      {/* 🗑️ Confirmation Modal */}
      {sessionToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-lg p-6 w-96 text-center">
            <h2 className="text-lg font-semibold text-white mb-4">
              Delete Session
            </h2>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete <br />
              <span className="font-bold text-[#ff7676]">{sessionToDelete}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
                onClick={() => setSessionToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-lg bg-[#961010] hover:bg-[#7f0e0e] text-white ${deleting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                onClick={handleDeleteSession}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
