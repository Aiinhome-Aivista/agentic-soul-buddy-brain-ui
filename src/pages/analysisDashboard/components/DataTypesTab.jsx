import React, { useContext, useState, useEffect } from "react";
import { FileText, Plus, Pencil, BookOpen, Layers } from "lucide-react";
import { Context } from "../../../common/helper/Context";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { POST_url, GET_url } from "../../../connection/connection";

// (UnstructuredAnalysisDisplay component remains unchanged)
const UnstructuredAnalysisDisplay = ({ analysis }) => {
  const safeAnalysis = analysis || {};

  return (
    <div className="p-4 space-y-4 text-slate-300">

      {/* Document Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-700 pb-3">
        <div>
          <p className="font-semibold text-white flex items-center gap-1"><BookOpen className="w-4 h-4 text-orange-400" /> Document Type:</p>
          <span className="text-orange-300 font-medium">{safeAnalysis.document_type || 'N/A'}</span>
        </div>
        <div>
          <p className="font-semibold text-white flex items-center gap-1"><Layers className="w-4 h-4 text-cyan-400" /> Sentiment:</p>
          <span className={`font-medium ${safeAnalysis.sentiment === 'Positive' ? 'text-green-400' : 'text-slate-400'}`}>{safeAnalysis.sentiment || 'N/A'}</span>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <p className="font-semibold text-white">Summary 📝</p>
        <blockquote className="p-3 border-l-4 border-slate-600 bg-slate-700/50 text-sm italic">
          {safeAnalysis.summary || 'No summary available.'}
        </blockquote>
      </div>

      {/* Key Topics */}
      <div className="space-y-2">
        <p className="font-semibold text-white">Key Topics / Concepts 💡</p>
        <div className="flex flex-wrap gap-2">
          {(safeAnalysis.key_topics || []).map((topic, index) => (
            <span key={index} className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-700">
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-white">Extracted Entities 👤</p>
        {/* Applied fixed layout and spacing: 
					gap-x-2 and gap-y-3 prevent entities from bunching up or clipping vertically.
				*/}
        <div className="flex flex-wrap gap-x-2 gap-y-3 items-center">
          {(safeAnalysis.entities || []).map((entity, index) => {
            // Style for string entities (Current API format)
            if (typeof entity === 'string') {
              return (
                <span
                  key={index}
                  // EMERALD STYLING applied here
                  className="bg-slate-700/50 text-emerald-300 text-sm font-medium px-3 py-1 rounded-full border border-emerald-600 hover:bg-emerald-900 transition-colors cursor-default"
                >
                  {entity}
                </span>
              );
            }

            // Fallback for the old {name, type} object structure
            return (
              <span key={index} className="bg-slate-700/50 text-red-300 text-xs px-3 py-1 rounded-full border border-red-600">
                {entity.name} {entity.type && `(${entity.type})`}
              </span>
            );
          })}
        </div>
      </div>

    </div>
  );
};
// --------------------------------------------------


export default function DataTypesTab() {
  const { sessionData, updateSessionData, activeSession, setActiveSession, setHasStructuredData, setUnStructuredFilesCount, unstructuredFilesCount } = useContext(Context);
  const sessionName = localStorage.getItem("active_session_name")

  // Get initial dataTypes.
  const initialDataTypes = activeSession ? sessionData[activeSession]?.dataTypes || [] : [];

  if (!activeSession) {
    return <div className="text-white">Please select a session to view its data types.</div>;
  }

  // Dialog States
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(null);
  const [userContextInput, setUserContextInput] = useState("");
  const [currentTable, setCurrentTable] = useState(null);

  // API State
  const [savingLoading, setSavingLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [displayDataTypes, setDisplayDataTypes] = useState(initialDataTypes);
  const [updatedContext, setUpdatedContext] = useState("");


  useEffect(() => {
    setInitialLoading(true);
    fetchTableData();
  }, [updatedContext]);


  // --- MODIFIED LOGIC TO HANDLE BOTH STRUCTURED AND UNSTRUCTURED DATA AND UPDATE NEW STATE ---
  const fetchTableData = async () => {
    try {
      const response = await fetch(GET_url.viewInfo(sessionName));
      if (!response.ok) throw new Error("Failed");

      const result = await response.json();
      const responseData = result?.data?.[0]?.response;
      if (!responseData) return;

      const files = responseData.files || {};
      const unstructuredAnalysis = responseData.unstructured_analysis || {};
      setUnStructuredFilesCount(Object.keys(unstructuredAnalysis).length)
      const patterns = {};

      let newDataTypes = [];
      let foundStructuredData = false; // Flag to check for structured data

      // 1. Process Structured Files (Existing Logic)
      Object.entries(files).forEach(([fileName, fileData]) => {
        const metadata = fileData.metadata || {};
        const comparison = fileData.comparison || {};
        patterns[fileName] = comparison;

        const columns = Object.values(metadata).map((colMeta) => {
          const compMeta = comparison[colMeta.column_name] || {};
          return {
            column_name: colMeta.column_name,
            inferred_sql_type: colMeta.technical_metadata?.inferred_sql_type || "",
            contextual_summary: compMeta.contextual_summary || "",
            technical_summary: compMeta.technical_summary || "",
            differences: Array.isArray(colMeta.differences)
              ? colMeta.differences.join(" | ")
              : "",
            more_accurate: colMeta.which_is_more_accurate?.selected || "",
            confidence: `${Math.round((compMeta.confidence || 0) * 100)}%`,
            sample_values: colMeta.technical_metadata?.sample_values || [],
            user_input: compMeta.user_input || "",
          };
        });

        newDataTypes.push({ table_name: fileName, columns, isStructured: true, analysis: {} });
        foundStructuredData = true; // Set flag if structured data is found
      });

      // 2. Process Unstructured Files (NEW LOGIC)
      Object.entries(unstructuredAnalysis).forEach(([fileName, analysisData]) => {
        newDataTypes.push({
          table_name: fileName,
          isStructured: false,
          analysis: {
            document_type: analysisData.document_type || "N/A",
            summary: analysisData.summary || "No summary available.",
            sentiment: analysisData.sentiment || "N/A",
            key_topics: analysisData.key_topics || [],
            entities: analysisData.entities || [],
          },
          columns: [],
        });
      });

      // --- NEW LOGIC: Update the local state for structured data presence ---
      setHasStructuredData(foundStructuredData);

      const prepareSessionData = {
        dataTypes: newDataTypes,
        patterns,
        relationships: responseData.relationships || [],
        insights: result?.insights?.insights || [],
        graphUrl: result?.graph_url || "",
        // --- ADD NEW STATE TO SESSION DATA FOR CONTEXT ---
        hasStructuredData: foundStructuredData,
      };

      const hasChanged =
        JSON.stringify(displayDataTypes) !== JSON.stringify(newDataTypes);

      // Update session data and local state if data has changed
      if (hasChanged) {
        updateSessionData(sessionName, prepareSessionData);
        setDisplayDataTypes(newDataTypes);
        setActiveSession(sessionName);
        console.log("✅ UPDATED dataTypes and hasStructuredData:", prepareSessionData);
      } else if (sessionData[activeSession]?.hasStructuredData !== foundStructuredData) {
        // Explicitly update context if *only* the structured data flag has changed
        updateSessionData(sessionName, prepareSessionData);
        console.log("✅ UPDATED only hasStructuredData:", foundStructuredData);
      }


    } catch (error) {
      console.error("fetchTableData error:", error);
    } finally {
      // Set loading false after API request completes
      setInitialLoading(false);
    }
  };

  // Open dialog for a specific column (Only applicable to structured data)
  const openDialog = (column, tableData) => {
    setCurrentColumn(column);
    setCurrentTable(tableData);
    setUserContextInput(column.user_input || "");
    setDialogVisible(true);
  };

  const handleSave = async () => {
    setSavingLoading(true);

    const formData = new FormData();
    formData.append("session_name", sessionName);
    formData.append("file_name", currentTable.table_name);
    formData.append("column_name", currentColumn.column_name);
    formData.append("user_input", userContextInput);

    // API success: dialog close
    setDialogVisible(false);
    try {
      const response = await fetch(POST_url.user_input_analyze, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      await fetchTableData();

    } catch (error) {
      console.error("Failed to update user context:", error);
    } finally {
      setSavingLoading(false);
      setUpdatedContext(userContextInput);
    }
  };


  return (
    <div className="space-y-6">

      {initialLoading ? (
        <div className="flex items-center justify-center h-64 text-slate-300">
          <div className="w-8 h-8 border-4 border-[#795EFF] border-t-transparent rounded-full animate-spin mr-3"></div>
          <span>Loading Session Data...</span>
        </div>
      ) : (
        // Render data only once loading is complete
        displayDataTypes.map((tableData, tableIndex) => (
          <div key={tableData.table_name || tableIndex} className="bg-slate-800 border border-slate-700 rounded-lg shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
              <h5 className="flex items-center gap-2 text-lg font-semibold text-white">
                <FileText className="w-5 h-5 text-[#795EFF]" />
                {tableData.table_name}
              </h5>
              <span className="bg-slate-600 text-white text-xs px-2 py-1 rounded">
                {tableData.isStructured
                  ? `${tableData.columns.length} columns`
                  : 'Unstructured Document Analysis'}
              </span>
            </div>

            {savingLoading && tableData.isStructured ? (
              <div className="flex items-center justify-center gap-3 text-slate-300 p-8">
                <div className="w-6 h-6 border-4 border-[#795EFF] border-t-transparent rounded-full animate-spin"></div>
                <span>Saving and refreshing data...</span>
              </div>
            ) : (
              <>
                {tableData.isStructured ? (
                  /* --- Structured Data Table --- */
                  < div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-300">
                      <thead className="bg-slate-700 text-slate-200">
                        <tr>
                          <th className="px-4 py-2">Column</th>
                          <th className="px-4 py-2">Inferred Type</th>
                          <th className="px-4 py-2">Contextual Summary</th>
                          <th className="px-4 py-2">Technical Summary</th>
                          <th className="px-4 py-2">User Context</th>
                          <th className="px-4 py-2">Differences</th>
                          <th className="px-4 py-2">More Accurate</th>
                          <th className="px-4 py-2">Confidence</th>
                          <th className="px-4 py-2">Sample Values</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.columns.map((column, colIndex) => (
                          <tr
                            key={column.column_name || colIndex}
                            className="border-b border-slate-700 hover:bg-slate-700/30 last:border-b-0"
                          >
                            <td className="px-4 py-2 font-medium text-white">
                              {column.column_name}
                            </td>
                            <td className="px-4 py-2">
                              <span className="bg-[#795EFF] text-white px-2 py-0.5 rounded text-xs capitalize">
                                {column.inferred_sql_type}
                              </span>
                            </td>
                            <td className="px-4 py-2">{column.contextual_summary}</td>
                            <td className="px-4 py-2">{column.technical_summary}</td>
                            <td className="px-4 py-2">
                              <div className="flex flex-col gap-1 items-start">
                                <span className="text-xs text-slate-300">
                                  {column.user_input || "No context added"}

                                </span>

                                <button
                                  onClick={() => openDialog(column, tableData)}
                                  className="p-1 rounded-md bg-slate-700 hover:bg-slate-600 text-white"
                                  title={column.user_input ? "Edit" : "Add"}
                                >
                                  {column.user_input ? (
                                    <Pencil className="w-4 h-4" />
                                  ) : (
                                    <Plus className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-xs">{column.differences}</td>
                            <td className="px-4 py-2">{column.more_accurate}</td>
                            <td className="px-4 py-2 w-40">
                              <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                                <div
                                  className="bg-green-500 h-4 text-xs font-bold text-center text-black flex items-center justify-center"
                                  style={{ width: column.confidence || "0%" }}
                                >
                                  {column.confidence}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-slate-400 text-xs">
                              <code>
                                {Array.isArray(column.sample_values)
                                  ? column.sample_values.slice(0, 5).join(", ")
                                  : ""}
                              </code>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* --- Unstructured Data Analysis Display --- */
                  <UnstructuredAnalysisDisplay analysis={tableData.analysis} />
                )}
              </>
            )
            }

          </div>
        ))
      )}


      {/* Dialog (Only used for Structured Data - User Context) */}
      <Dialog
        header={currentColumn?.user_input ? "Edit User Context" : "Add User Context"}
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        style={{ width: "30rem" }}
      >
        <div className="flex flex-col gap-4">
          <InputText
            value={userContextInput}
            onChange={(e) => setUserContextInput(e.target.value)}
            className="w-full"
            placeholder="Enter user context..."
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              className="p-button-text"
              onClick={() => setDialogVisible(false)}
            />
            <Button label="Save" className="p-button-primary" onClick={handleSave} />
          </div>
        </div>
      </Dialog>

    </div >
  );
}