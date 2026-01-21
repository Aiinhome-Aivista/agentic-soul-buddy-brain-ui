import React, { useState, useEffect } from "react";
import {
    Search,
    RefreshCw,
    Edit2,
    Trash2,
    Plus,
    X,
    CheckCircle,
    AlertCircle,
    Globe,
    FileText,
    Tag,
} from "lucide-react";
import { apiService } from "../../service/ApiService";
import { GET_url, POST_url } from "../../connection/connection";

function SeoManagement() {
    const [seoData, setSeoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const [formData, setFormData] = useState({
        target_keyword: "",
        seo_title: "",
        meta_description: "",
    });

    // Fetch all SEO data
    const fetchSeoData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiService({
                url: GET_url.seo_details,
                method: "GET",
            });

            if (data.error) {
                throw new Error(data.message || "Failed to fetch SEO data");
            }

            setSeoData(data.data || data || []);
        } catch (err) {
            console.error("Error fetching SEO data:", err);
            setError(err.message);
            setSeoData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSeoData();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setSubmitError("");
    };

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({
            target_keyword: "",
            seo_title: "",
            meta_description: "",
        });
        setShowModal(true);
        setSubmitError("");
        setSubmitSuccess(false);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({
            target_keyword: item.target_keyword || "",
            seo_title: item.seo_title || "",
            meta_description: item.meta_description || "",
        });
        setShowModal(true);
        setSubmitError("");
        setSubmitSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError("");
        setSubmitSuccess(false);

        try {
            const url = editingItem
                ? `${POST_url.seo_crud}/${editingItem.id}`
                : POST_url.seo_crud;

            const response = await apiService({
                url: url,
                method: editingItem ? "PUT" : "POST",
                data: formData,
            });

            if (response.error) {
                setSubmitError(response.message || "Failed to save SEO data");
            } else {
                setSubmitSuccess(true);
                fetchSeoData();
                setTimeout(() => {
                    setShowModal(false);
                    setSubmitSuccess(false);
                    setEditingItem(null);
                }, 1500);
            }
        } catch (err) {
            setSubmitError("An error occurred. Please try again.");
            console.error("SEO save error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await apiService({
                url: `${POST_url.seo_crud}/${id}`,
                method: "DELETE",
            });

            if (response.error) {
                setError(response.message || "Failed to delete SEO entry");
            } else {
                fetchSeoData();
            }
        } catch (err) {
            console.error("Delete error:", err);
            setError("Failed to delete SEO entry");
        } finally {
            setDeleteConfirm(null);
        }
    };

    return (
        <div className="min-h-[80vh] w-full text-white flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
                        <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">SEO Management</h1>
                        <p className="text-slate-400 text-sm">
                            Manage SEO titles, keywords, and meta descriptions
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchSeoData}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 rounded-lg transition font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add SEO Entry
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <Globe className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Total SEO Entries</p>
                            <p className="text-2xl font-bold">{seoData.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Tag className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Keywords Tracked</p>
                            <p className="text-2xl font-bold">
                                {seoData.filter((item) => item.target_keyword).length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <FileText className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Meta Descriptions</p>
                            <p className="text-2xl font-bold">
                                {seoData.filter((item) => item.meta_description).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400">{error}</span>
                    <button
                        onClick={() => setError(null)}
                        className="ml-auto text-red-400 hover:text-red-300"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* SEO Table */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-800/80">
                                <th className="text-left p-4 text-slate-300 font-medium">ID</th>
                                <th className="text-left p-4 text-slate-300 font-medium">
                                    Target Keyword
                                </th>
                                <th className="text-left p-4 text-slate-300 font-medium">
                                    SEO Title
                                </th>
                                <th className="text-left p-4 text-slate-300 font-medium">
                                    Meta Description
                                </th>
                                <th className="text-left p-4 text-slate-300 font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />
                                            <span className="text-slate-400">Loading SEO data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : seoData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Globe className="w-12 h-12 text-slate-600" />
                                            <p className="text-slate-400">No SEO entries found</p>
                                            <button
                                                onClick={openAddModal}
                                                className="mt-2 text-green-400 hover:text-green-300 flex items-center gap-1"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add your first entry
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                [...seoData].sort((a, b) => (a.id || 0) - (b.id || 0)).map((item, index) => (
                                    <tr
                                        key={item.id || index}
                                        className="border-b border-slate-700/50 hover:bg-slate-700/30 transition"
                                    >
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-slate-700 rounded text-sm">
                                                {item.id || index + 1}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-blue-400" />
                                                <span className="text-white font-medium">
                                                    {item.target_keyword || "-"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-slate-300">
                                                {item.seo_title || "-"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className="text-slate-400 text-sm line-clamp-2"
                                                title={item.meta_description}
                                            >
                                                {item.meta_description || "-"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="p-2 hover:bg-blue-500/20 rounded-lg transition text-blue-400 hover:text-blue-300"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                {deleteConfirm === item.id ? (
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="px-2 py-1 bg-red-500 hover:bg-red-600 rounded text-xs text-white"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(null)}
                                                            className="px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded text-xs"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteConfirm(item.id)}
                                                        className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-400 hover:text-red-300"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
                                    <Globe className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold">
                                    {editingItem ? "Edit SEO Entry" : "Add SEO Entry"}
                                </h2>
                            </div>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingItem(null);
                                }}
                                className="p-2 hover:bg-slate-700 rounded-lg transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Target Keyword */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Target Keyword
                                </label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        name="target_keyword"
                                        value={formData.target_keyword}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                                        placeholder="e.g., meditation tips 2026"
                                        required
                                    />
                                </div>
                            </div>

                            {/* SEO Title */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    SEO Title
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        name="seo_title"
                                        value={formData.seo_title}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                                        placeholder="e.g., Best Meditation Tips for 2026"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Meta Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Meta Description
                                </label>
                                <textarea
                                    name="meta_description"
                                    value={formData.meta_description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition resize-none"
                                    placeholder="Enter meta description for SEO..."
                                    required
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    {formData.meta_description.length}/160 characters recommended
                                </p>
                            </div>

                            {/* Error Message */}
                            {submitError && (
                                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                    <span className="text-red-400 text-sm">{submitError}</span>
                                </div>
                            )}

                            {/* Success Message */}
                            {submitSuccess && (
                                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span className="text-green-400 text-sm">
                                        SEO entry {editingItem ? "updated" : "created"} successfully!
                                    </span>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitting || submitSuccess}
                                className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:from-slate-600 disabled:to-slate-600 rounded-lg font-medium transition flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        {editingItem ? "Updating..." : "Creating..."}
                                    </>
                                ) : submitSuccess ? (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        {editingItem ? "Updated!" : "Created!"}
                                    </>
                                ) : (
                                    <>
                                        {editingItem ? (
                                            <>
                                                <Edit2 className="w-4 h-4" />
                                                Update SEO Entry
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4" />
                                                Create SEO Entry
                                            </>
                                        )}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Toast */}
            {deleteConfirm && (
                <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg flex items-center gap-3 z-50">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-slate-300">Confirm deletion?</span>
                </div>
            )}
        </div>
    );
}

export default SeoManagement;
