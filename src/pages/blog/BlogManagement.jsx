import React, { useState, useEffect, useContext } from "react";
import { AlertCircle, X } from "lucide-react";
import BlogList from "./components/BlogList";
import BlogForm from "./components/BlogForm";
import { apiService } from "../../service/ApiService";
import { POST_url, DELETE_url } from "../../connection/connection";
import { Context } from "../../common/helper/Context";

function BlogManagement() {
    const { user } = useContext(Context);
    const [blogData, setBlogData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [view, setView] = useState("list"); // 'list', 'create', 'edit'
    const [editingItem, setEditingItem] = useState(null);

    // Form State
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // List State
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchBlogData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService({
                url: POST_url.blogs,
                method: "GET"
            });
            console.log("Fetched Blogs:", response);
            if (Array.isArray(response)) {
                setBlogData(response);
            } else if (response?.data && Array.isArray(response.data)) {
                setBlogData(response.data);
            } else {
                setBlogData([]);
                console.warn("Unexpected blog data format", response);
            }

        } catch (err) {
            console.error("Error fetching blogs:", err);
            setError("Failed to load blog posts. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogData();
    }, []);

    const handleSwitchToList = () => {
        setView("list");
        setEditingItem(null);
        setSubmitError("");
        setSubmitSuccess(false);
        fetchBlogData(); // Refresh list on return
    };

    const handleSwitchToCreate = () => {
        setEditingItem(null);
        setView("create");
        setSubmitError("");
        setSubmitSuccess(false);
    };

    const handleSwitchToEdit = (item) => {
        setEditingItem(item);
        setView("edit");
        setSubmitError("");
        setSubmitSuccess(false);
    };

    const handleTogglePin = async (id, currentStatus) => {

        setBlogData(prevData => prevData.map(item =>
            item.id === id ? { ...item, is_pinned: !item.is_pinned } : item
        ));
    };

    const handleSubmit = async (formData) => {
        setSubmitting(true);
        setSubmitError("");
        setSubmitSuccess(false);

        try {
            const url = editingItem
                ? `${POST_url.blogs}/${editingItem.id}`
                : POST_url.blogs;

            const method = editingItem ? "PUT" : "POST";

            // Prepare FormData
            const data = new FormData();

            // Append all fields from formData
            Object.keys(formData).forEach(key => {

                if (key === 'image' && formData[key] instanceof File) {
                    data.append('image', formData[key]);
                } else if (key !== 'featured_image' && key !== 'image') { // exclude preview url
                    // basic fields
                    data.append(key, formData[key]);
                }
            });



            if (user?.full_name) {
                formData.set("author_name", user.full_name);
            }

            const response = await apiService({
                url,
                method,
                data: formData
            });

            if (response?.error) {
                throw new Error(response.message || "Operation failed");
            }

            setSubmitSuccess(true);
            setSubmitting(false);

            setTimeout(() => {
                handleSwitchToList();
            }, 1000);
        } catch (err) {
            console.error("Submit Error:", err);
            setSubmitError(err.message || "Failed to save blog post.");
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, authorName) => {
        try {
            const url = DELETE_url.deleteBlog(id);
            const response = await apiService({
                url,
                method: "DELETE",
                params: { author_name: authorName || user?.full_name || "Admin" }
            });

            if (response?.error) {
                throw new Error(response.message || "Delete failed");
            }

            setBlogData(prevData => prevData.filter(item => item.id !== id));
            setDeleteConfirm(null);
        } catch (err) {
            console.error("Delete Error:", err);
            // Optionally show error to user
            setError("Failed to delete blog post.");
        }
    };

    return (
        <div className="min-h-[80vh] w-full text-white">
            {/* Global Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3 mb-6">
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

            {view === "list" && (
                <BlogList
                    blogData={blogData}
                    loading={loading}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    openEditPage={handleSwitchToEdit}
                    openAddPage={handleSwitchToCreate}
                    deleteConfirm={deleteConfirm}
                    setDeleteConfirm={setDeleteConfirm}
                    handleDelete={handleDelete}
                    fetchBlogData={fetchBlogData}
                    handleTogglePin={handleTogglePin}
                />
            )}

            {(view === "create" || view === "edit") && (
                <BlogForm
                    editingItem={editingItem}
                    onCancel={handleSwitchToList}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    submitSuccess={submitSuccess}
                    submitError={submitError}
                    user={user}
                />
            )}
        </div>
    );
}

export default BlogManagement;
