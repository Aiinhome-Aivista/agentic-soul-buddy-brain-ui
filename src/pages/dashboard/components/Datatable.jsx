// import React, { useState, useMemo, useContext, useEffect } from "react";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import { MultiSelect } from "primereact/multiselect";
// import { Eye, Trash2, Search, RefreshCw } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import Loader from "../../../common/components/Loader";
// import { useTableTrackerData } from "../../../data/useTableTrackerData";
// import { GET_url, DELETE_url } from "../../../connection/connection";
// import { Context } from "../../../common/helper/Context";

// export default function Datatable() {
//   const navigate = useNavigate();
//   const { data, loading, fetchTrackerData } = useTableTrackerData();
//   const { updateSessionData, setActiveSession } = useContext(Context);

//   const [search, setSearch] = useState("");
//   const [loadingSession, setLoadingSession] = useState(null);
//   const [sessionToDelete, setSessionToDelete] = useState(null);
//   const [deleting, setDeleting] = useState(false);

//   // 🆕 STATE: Active Session Dropdown
//   const [activeSessionOptions, setActiveSessionOptions] = useState([]);
//   const [selectedActiveSessions, setSelectedActiveSessions] = useState(null);

//   // 🆕 EFFECT: Fetch Successful Sessions List on Component Mount
//   useEffect(() => {
//     const fetchActiveSessions = async () => {
//       try {
//         const response = await fetch(GET_url.fetchSessions);
//         if (!response.ok) throw new Error("Failed to fetch sessions list");
        
//         const result = await response.json();
        
//         if (result.success && Array.isArray(result.data)) {
//           const options = result.data.map((name) => ({
//             label: name,
//             value: name,
//           }));
//           setActiveSessionOptions(options);
//         }
//       } catch (error) {
//         console.error("Error loading active sessions:", error);
//       }
//     };
//     fetchActiveSessions();
    
//     // 🆕 Initialize selection from previous state if available
//     const saved = localStorage.getItem("active_multi_sessions");
//     if(saved) setSelectedActiveSessions(JSON.parse(saved));
//   }, []);

//   // 🆕 HANDLER: Save selection to LocalStorage immediately
//   const handleActiveSessionChange = (e) => {
//       const value = e.value;
//       setSelectedActiveSessions(value);
//       // Save to local storage so Chat page can access it
//       localStorage.setItem("active_multi_sessions", JSON.stringify(value));
//   };

//   // ✅ Filtered data based on search
//   const filteredData = useMemo(() => {
//     if (!search.trim()) return data;
//     const lower = search.toLowerCase();
//     return data.filter((item) =>
//       Object.values(item).some((val) =>
//         String(val).toLowerCase().includes(lower)
//       )
//     );
//   }, [data, search]);

//   // ✅ View session details
//   const handleViewClick = async (rowData) => {
//     const sessionName = rowData.SESSION_NAME;
//     if (!sessionName) return alert("Session name missing!");

//     setLoadingSession(sessionName);
//     try {
//       const response = await fetch(GET_url.viewInfo(sessionName));
//       if (!response.ok) throw new Error("Failed to fetch session data");
//       const result = await response.json();

//       const responseData = result?.data?.[0]?.response;
//       if (!responseData) throw new Error("Invalid API structure");

//       const files = responseData.files || {};
//       const patterns = {};
//       const dataTypes = Object.entries(files).map(([fileName, fileData]) => {
//         patterns[fileName] = fileData.comparison || {};
//         const columns = Object.values(fileData.metadata || {}).map((colMeta) => {
//           const comparisonMeta = fileData.comparison?.[colMeta.column_name] || {};
//           return {
//             column_name: colMeta.column_name,
//             inferred_sql_type: colMeta.technical_metadata?.inferred_sql_type || "",
//             contextual_summary: comparisonMeta.contextual_summary || "",
//             technical_summary: comparisonMeta.technical_summary || "",
//             differences: Array.isArray(colMeta.differences) ? colMeta.differences.join(" | ") : "",
//             more_accurate: colMeta.which_is_more_accurate?.selected || "",
//             confidence: `${Math.round((comparisonMeta.confidence || 0) * 100)}%`,
//             sample_values: colMeta.technical_metadata?.sample_values || [],
//             user_input: comparisonMeta.user_input || "",
//           };
//         });
//         return { table_name: fileName, columns };
//       });

//       // ✅ Update context data
//       const sessionData = {
//         dataTypes,
//         patterns,
//         relationships: responseData.relationships || [],
//         insights: result?.insights?.insights || [],
//         graphUrl: result?.graph_url || "",
//       };

//       updateSessionData(sessionName, sessionData);
//       setActiveSession(sessionName);

//       // ✅ Save session locally
//       if (result.session_id) localStorage.setItem("session_id", result.session_id);
//       localStorage.setItem("active_session_name", sessionName);
//       localStorage.setItem("session_data", JSON.stringify(sessionData));

//       navigate('/analysis');
//     } catch (error) {
//       console.error("Error fetching session data:", error);
//       alert("Failed to load session details.");
//     } finally {
//       setLoadingSession(null);
//     }
//   };

//   // ✅ Delete session handler
//   const handleDeleteSession = async () => {
//     if (!sessionToDelete) return;
//     setDeleting(true);
//     try {
//       const response = await fetch(DELETE_url.deleteSession(sessionToDelete), { method: "DELETE" });
//       if (!response.ok) throw new Error("Failed to delete session");
//       alert(`Session "${sessionToDelete}" deleted successfully.`);
//       fetchTrackerData();
//     } catch (error) {
//       console.error("Delete error:", error);
//       alert("Error deleting session.");
//     } finally {
//       setDeleting(false);
//       setSessionToDelete(null);
//     }
//   };

//   const actionBodyTemplate = (rowData) => {
//     const isLoading = loadingSession === rowData.SESSION_NAME;
//     const isCompleted = rowData.SESSION_STATUS?.toLowerCase() === "completed" || rowData.SESSION_STATUS?.toLowerCase() === "success";
//     const isDisabled = !!loadingSession || !isCompleted;

//     return (
//       <div className="flex gap-2">
//         <button
//           className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${isDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-[#795eff] hover:bg-[#6a4be8]"}`}
//           disabled={isDisabled}
//           onClick={() => handleViewClick(rowData)}
//         >
//           {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Eye className="w-4 h-4 text-white" />}
//         </button>
//         <button
//           className="w-8 h-8 flex items-center justify-center rounded-md bg-[#961010] hover:bg-[#7f0e0e]"
//           onClick={() => setSessionToDelete(rowData.SESSION_NAME)}
//         >
//           <Trash2 className="w-4 h-4 text-white" />
//         </button>
//       </div>
//     );
//   };

//   const defaultBodyTemplate = (rowData, col) => {
//     const value = rowData[col.field];
//     if (col.field === "SESSION_STATUS") return value === "Success" ? "Completed" : value || "--";
//     if (col.field === "RELATIONSHIPS") return "Done";
//     if (col.field === "Tables_name") return value || "--";
//     return value || "--";
//   };

//   const columns = [
//     { field: "SESSION_NAME", header: "Session Name" },
//     { field: "Tables_name", header: "Table Name" },
//     { field: "DATA_TYPE_ANALYZER", header: "Datatypes" },
//     { field: "RELATIONSHIPS", header: "Relationships" },
//     { field: "VISUALIZATION", header: "Visualization" },
//     { field: "INSIGHTS", header: "Data Insights" },
//     { field: "SESSION_STATUS", header: "Status" },
//     { field: "action", header: "Action" },
//   ];

//   return (
//     <div className="flex flex-col gap-4 w-full">
//       <div className="flex flex-row items-center justify-between mt-6 gap-4">
//         {/* 🆕 Active Session Selector with updated Handler */}
//         {/* <div className="w-1/3">
//           <MultiSelect 
//             value={selectedActiveSessions} 
//             onChange={handleActiveSessionChange}  // <--- UPDATED HANDLER
//             options={activeSessionOptions} 
//             optionLabel="label" 
//             placeholder="Select Active Sessions" 
//             maxSelectedLabels={2}
//             className="w-full"
//             pt={{
//                 root: { className: 'w-full h-10 flex items-center border border-slate-600 rounded-lg bg-slate-800 text-slate-200 transition-colors hover:border-[#795eff]' },
//                 labelContainer: { className: 'flex items-center h-full px-3' }, 
//                 label: { className: 'text-slate-200 text-sm' },
//                 trigger: { className: 'flex items-center justify-center w-10 text-slate-400 bg-transparent' },
//                 panel: { className: 'bg-slate-800 border border-slate-600 text-slate-200 rounded-lg shadow-xl mt-1' },
//                 item: { className: 'hover:bg-slate-700 text-slate-200 p-2 cursor-pointer transition-colors' },
//                 header: { className: 'bg-slate-800 text-slate-200 border-b border-slate-600 p-2 rounded-t-lg flex items-center'},
//                 checkboxContainer: { className: 'text-slate-200' },
//                 checkbox: { className: 'border-slate-500 bg-slate-700 text-white' },
//                 checkboxIcon: { className: 'text-white' },
//                 closeButton: { className: 'text-slate-400 hover:text-white' }
//             }}
//           />
//         </div> */}

// <div className="w-1/3">
//   <MultiSelect
//     value={selectedActiveSessions}
//     onChange={handleActiveSessionChange}
//     options={activeSessionOptions}
//     optionLabel="label"
//     placeholder="Select Active Sessions"
//     maxSelectedLabels={2}
//     className="w-full"
//     pt={{
//       /* Input container (same as search box) */
//       root: {
//         className:
//           'w-full h-11 flex items-center rounded-xl ' +
//           'bg-[#1e293b] border border-[#334155] ' +
//           'text-white px-2 ' +
//           'transition-all duration-200 ' +
//           'hover:border-[#64748b] focus-within:ring-2 focus-within:ring-[#795eff]'
//       },

//       /* Selected values / placeholder */
//       labelContainer: {
//         className: 'flex items-center h-full px-2 gap-1'
//       },
//       label: {
//         className: 'text-black text-sm'
//       },

//       /* Dropdown arrow */
//       trigger: {
//         className:
//           'flex items-center justify-center w-10 text-slate-300 hover:text-white'
//       },

//       /* Dropdown panel */
//       panel: {
//         className:
//           'bg-[#1e293b] border border-[#334155] text-black rounded-xl shadow-xl mt-2'
//       },

//       /* Items */
//       item: {
//         className:
//           'text-white px-3 py-2 cursor-pointer rounded-md ' +
//           'hover:bg-[#334155] transition-colors'
//       },

//       /* Header */
//       header: {
//         className:
//           'bg-[#1e293b] text-white border-b border-[#334155] px-3 py-2 rounded-t-xl'
//       },

//       /* Checkbox */
//       checkboxContainer: {
//         className: 'text-black'
//       },
//       checkbox: {
//         className:
//           'border-slate-500 bg-transparent text-black'
//       },
//       checkboxIcon: {
//         className: 'text-black'
//       },

//       /* Remove (x) icon */
//       closeButton: {
//         className: 'text-slate-300 hover:text-black'
//       }
//     }}
//   />
// </div>


//         <div className="flex flex-row items-center gap-4 w-1/2 justify-end">
//           <div className="relative w-full">
//             <input
//               type="text"
//               placeholder="Search sessions..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full h-10 pl-4 pr-10 border border-slate-600 rounded-lg text-slate-200 bg-slate-800 focus:ring-2 focus:ring-[#795eff] focus:outline-none"
//             />
//             <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//           </div>
//           <button
//             className={`w-10 h-10 flex items-center justify-center border border-slate-600 rounded-lg ${loading ? "bg-slate-700 cursor-not-allowed" : "bg-slate-800 hover:bg-slate-700"}`}
//             onClick={!loading ? fetchTrackerData : undefined}
//           >
//             <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin text-white" : "text-slate-400"}`} />
//           </button>
//         </div>
//       </div>

//       <DataTable
//         value={filteredData} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} rowHover className="w-full"
//         emptyMessage={loading ? <Loader /> : "No sessions found."}
//         paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
//         currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
//       >
//         {columns.map((col) => col.field === "action" ? (
//             <Column key={col.field} header={col.header} body={actionBodyTemplate} />
//           ) : (
//             <Column key={col.field} field={col.field} header={col.header} body={(row) => defaultBodyTemplate(row, col)} />
//           )
//         )}
//       </DataTable>
//       {sessionToDelete && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
//           <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-lg p-6 w-96 text-center">
//             <h2 className="text-lg font-semibold text-white mb-4">Delete Session</h2>
//             <p className="text-slate-300 mb-6">Are you sure you want to delete <br /><span className="font-bold text-[#ff7676]">{sessionToDelete}</span>?</p>
//             <div className="flex justify-center gap-4">
//               <button className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white" onClick={() => setSessionToDelete(null)} disabled={deleting}>Cancel</button>
//               <button className={`px-4 py-2 rounded-lg bg-[#961010] hover:bg-[#7f0e0e] text-white ${deleting ? "opacity-70 cursor-not-allowed" : ""}`} onClick={handleDeleteSession} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useMemo, useContext, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import { Eye, Trash2, Search, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../../../common/components/Loader";
import { useTableTrackerData } from "../../../data/useTableTrackerData";
// ✅ Added POST_url to imports
import { GET_url, DELETE_url, POST_url } from "../../../connection/connection";
import { Context } from "../../../common/helper/Context";

export default function Datatable() {
  const navigate = useNavigate();
  const { data, loading, fetchTrackerData } = useTableTrackerData();
  const { updateSessionData, setActiveSession } = useContext(Context);

  const [search, setSearch] = useState("");
  const [loadingSession, setLoadingSession] = useState(null);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // 🆕 STATE: Active Session Dropdown
  const [activeSessionOptions, setActiveSessionOptions] = useState([]);
  const [selectedActiveSessions, setSelectedActiveSessions] = useState(null);

  // 🆕 EFFECT: Fetch Successful Sessions List on Component Mount
  useEffect(() => {
    const fetchActiveSessions = async () => {
      try {
        const response = await fetch(GET_url.fetchSessions);
        if (!response.ok) throw new Error("Failed to fetch sessions list");

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const options = result.data.map((name) => ({
            label: name,
            value: name,
          }));
          setActiveSessionOptions(options);
        }
      } catch (error) {
        console.error("Error loading active sessions:", error);
      }
    };
    fetchActiveSessions();
  }, []);

  // 🆕 HANDLER: Save selection to Database
  const handleActiveSessionChange = async (e) => {
    const value = e.value;
    setSelectedActiveSessions(value);

    // Save to Database (for Voice Assistant)
    try {
      await fetch(POST_url.updateActiveSessions, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active_sessions: value }),
      });
      console.log("Active sessions synced to DB");
    } catch (err) {
      console.error("Failed to sync sessions to DB", err);
    }
  };

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
            confidence: `${Math.round(
              (comparisonMeta.confidence || 0) * 100
            )}%`,
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

      navigate("/analysis");
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

  const actionBodyTemplate = (rowData) => {
    const isLoading = loadingSession === rowData.SESSION_NAME;
    const isCompleted =
      rowData.SESSION_STATUS?.toLowerCase() === "completed" ||
      rowData.SESSION_STATUS?.toLowerCase() === "success";
    const isDisabled = !!loadingSession || !isCompleted;

    return (
      <div className="flex gap-2">
        <button
          className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
            isDisabled
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

  const defaultBodyTemplate = (rowData, col) => {
    const value = rowData[col.field];
    if (col.field === "SESSION_STATUS")
      return value === "Success" ? "Completed" : value || "--";
    if (col.field === "RELATIONSHIPS") return "Done";
    if (col.field === "Tables_name") return value || "--";
    return value || "--";
  };

  const columns = [
    { field: "SESSION_NAME", header: "Session Name" },
    { field: "Tables_name", header: "Table Name" },
    { field: "DATA_TYPE_ANALYZER", header: "Datatypes" },
    { field: "RELATIONSHIPS", header: "Relationships" },
    { field: "VISUALIZATION", header: "Visualization" },
    { field: "INSIGHTS", header: "Data Insights" },
    { field: "SESSION_STATUS", header: "Status" },
    { field: "action", header: "Action" },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-row items-center justify-between mt-6 gap-4">
        
        {/* 🆕 Active Session Selector with updated Handler & Styling */}
        <div className="w-1/3">
          <MultiSelect
            value={selectedActiveSessions}
            onChange={handleActiveSessionChange}
            options={activeSessionOptions}
            optionLabel="label"
            placeholder="Select Active Sessions"
            maxSelectedLabels={2}
            className="w-full"
          />
        </div>

        {/* Search & Refresh (Right Side) */}
        <div className="flex flex-row items-center gap-4 w-1/2 justify-end">
          <div className="relative w-full">
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
            className={`w-10 h-10 flex items-center justify-center border border-slate-600 rounded-lg ${
              loading
                ? "bg-slate-700 cursor-not-allowed"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
            onClick={!loading ? fetchTrackerData : undefined}
          >
            <RefreshCw
              className={`w-5 h-5 ${
                loading ? "animate-spin text-white" : "text-slate-400"
              }`}
            />
          </button>
        </div>
      </div>

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
      {sessionToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-lg p-6 w-96 text-center">
            <h2 className="text-lg font-semibold text-white mb-4">
              Delete Session
            </h2>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete <br />
              <span className="font-bold text-[#ff7676]">
                {sessionToDelete}
              </span>
              ?
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
                className={`px-4 py-2 rounded-lg bg-[#961010] hover:bg-[#7f0e0e] text-white ${
                  deleting ? "opacity-70 cursor-not-allowed" : ""
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