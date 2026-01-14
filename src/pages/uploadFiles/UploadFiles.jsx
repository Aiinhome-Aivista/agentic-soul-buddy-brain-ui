
import React, { useState, useContext } from "react";
import { UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../service/ApiService";
import { Context } from "../../common/helper/Context";
import SessionForm from "../uploadFiles/components/SessionForm";
import FileUploader from "../uploadFiles/components/FileUploader";
import AnalysisOptions from "../uploadFiles/components/AnalysisOptions";
import InfoSection from "../uploadFiles/components/InfoSection";
import { POST_url } from "../../connection/connection";

function UploadFiles() {
    const [sessionName, setSessionName] = useState("");
    const { files, setFiles, setPatterns, setRelationships, setDataTypes, setInsights, setGraphUrl } = useContext(Context);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();


    const handleUpload = async () => {
        if (files.length === 0) {
            alert("Please select files before uploading!");
            return;
        }
        if (sessionName.trim() === "") {
            alert("Please enter a session name!");
            return;
        }

        setIsUploading(true);

        // ✅ Helper for safe API call
        const callApi = async (url, name) => {
            try {
                const formData = new FormData();
                formData.append("session_name", sessionName);
                files.forEach((file) => formData.append("files", file));

                const response = await apiService({ url, method: "POST", data: formData });
                // console.log(`✅ ${name} response:`, response);
                return response;
            } catch (err) {
                console.error(`❌ ${name} failed:`, err);
                return null;
            }
        };

        // ✅ Step 1: Navigate immediately
        navigate("/");
        setFiles([]); // optional - clears selected files visually

        // ✅ Step 2: Run background async chain
        (async () => {
            try {
                const uploadtableres = await callApi(POST_url.uploadtable, "Uploads table API");
                if (!uploadtableres) {
                    console.warn("⚠️ Uploads table API failed ");
                    return;
                }

                // 1️⃣ DataTypes API
                const dataTypesRes = await callApi(POST_url.dataTypes, "Data Types API");

                const filesData = dataTypesRes?.results?.files || {};
                const unstructuredData = dataTypesRes?.results?.unstructured_analysis || {}; // NEW

                if (Object.keys(filesData).length > 0 || Object.keys(unstructuredData).length > 0) {

                    let transformedData = [];

                    // Process Structured Files
                    Object.entries(filesData).forEach(([fileName, fileData]) => {
                        const columns = Object.values(fileData.metadata || {}).map((colMeta) => {
                            const comparisonMeta = fileData.comparison?.[colMeta.column_name] || {};
                            return {
                                column_name: colMeta.column_name,
                                inferred_sql_type: colMeta.technical_metadata?.inferred_sql_type || "",
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
                        transformedData.push({ table_name: fileName, columns, isStructured: true });
                    });

                    // Process Unstructured Files (NEW LOGIC)
                    Object.entries(unstructuredData).forEach(([fileName, analysisData]) => {
                        transformedData.push({
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


                    setDataTypes(transformedData);
                    if (dataTypesRes.results.relationships) {
                        setRelationships(dataTypesRes.results.relationships);
                    }
                } else {
                    console.warn("⚠️ DataTypes API failed or returned no data — stopping chain.");
                    return;
                }

                // 2️⃣ Uploads API (only if DataTypes succeeded)
                const uploadRes = await callApi(POST_url.uploads, "Uploads API");
                if (!uploadRes) {
                    console.warn("⚠️ Uploads API failed — stopping chain.");
                    return;
                }
                if (uploadRes?.html_url) {
                    setGraphUrl(uploadRes.html_url);
                }

                // 3️⃣ Insights API (only after Uploads succeeded)
                const insightsRes = await callApi(POST_url.insights, "Insights API");
                if (insightsRes?.insights) {
                    setInsights(insightsRes.insights);
                }

                // 4️⃣ Optional — Chat Insights Upload (independent)
                callApi("https://aivista.co.in/upload_files", "Chat Insights Upload API").then(
                    (chatInsightsUpload) => {
                        if (chatInsightsUpload?.session_id) {
                            localStorage.setItem("session_id", chatInsightsUpload.session_id);
                        }
                    }
                );

            } catch (err) {
                console.error("⚠️ Background upload chain error:", err);
            } finally {
                setIsUploading(false);
            }
        })();
    };

    return (
        <div className="max-w-[70%] mx-auto rounded-md shadow-md p-1 space-y-6 ">
            <div className="border-b border-slate-700 pb-3">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <UploadCloud className="w-5 h-5 text-[#795EFF]" />
                    Upload Database Files
                </h2>
                <p className="text-slate-400 text-sm">
                    Upload multiple database files for intelligent analysis
                </p>
            </div>
            <SessionForm sessionName={sessionName} setSessionName={setSessionName} />
            <FileUploader files={files} setFiles={setFiles} />
            <AnalysisOptions />
            <div>
                <button
                    disabled={isUploading}
                    onClick={handleUpload}
                    className="w-full bg-[#795effe0] hover:bg-[#795EFF] text-white font-semibold py-2 rounded-md flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-500 disabled:cursor-not-allowed"
                >
                    {isUploading ? "Uploading..." : (
                        <><UploadCloud className="w-5 h-5" /> Upload Files</>
                    )}
                </button>
            </div>
            <InfoSection />
        </div>
    );
}

export default UploadFiles;