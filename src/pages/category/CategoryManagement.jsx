import React, { useState, useEffect, useContext } from "react";
import { AlertCircle, X } from "lucide-react";
import CategoryList from "./components/CategoryList";
import CategoryForm from "./components/CategoryForm";
import { apiService } from "../../service/ApiService";
import { POST_url, DELETE_url, PUT_url } from "../../connection/connection";
import { Context } from "../../common/helper/Context";

function CategoryManagement() {
    const { user } = useContext(Context);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Form State
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // List State
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchCategoryData = async () => {
        setLoading(true);
        try {
            const response = await apiService({
                url: POST_url.category,
                method: "GET"
            });

            if (Array.isArray(response)) {
                setCategoryData(response);
            } else if (response?.data && Array.isArray(response.data)) {
                setCategoryData(response.data);
            } else {
                setCategoryData([]);
            }
        } catch (err) {
            setError(err.message || "Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryData();
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setSubmitError("");
        setSubmitSuccess(false);
    };

    const handleOpenCreateModal = () => {
        setEditingItem(null);
        setShowModal(true);
        setSubmitError("");
        setSubmitSuccess(false);
    };

    const handleOpenEditModal = (item) => {
        setEditingItem(item);
        setShowModal(true);
        setSubmitError("");
        setSubmitSuccess(false);
    };

    const handleSubmit = async (formData) => {
        setSubmitting(true);
        setSubmitError("");
        setSubmitSuccess(false);

        try {
            const url = editingItem
                ? PUT_url.updateCategory(editingItem.id)
                : POST_url.category;

            const method = editingItem ? "PUT" : "POST";

            const payload = {
                ...formData,
                author_name: user?.full_name || user?.username || "Admin"
            };

            const response = await apiService({
                url,
                method,
                data: payload
            });

            if (response && !response.error) {
                setSubmitSuccess(true);
                setTimeout(() => {
                    handleCloseModal();
                    fetchCategoryData();
                }, 1000);
            } else {
                setSubmitError(response.message || "Operation failed");
            }
        } catch (err) {
            setSubmitError(err.message || "An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, authorName) => {
        try {
            const response = await apiService({
                url: DELETE_url.deleteCategory(id),
                method: "DELETE",
                params: { author_name: authorName || user?.full_name || user?.username || "Admin" }
            });
            if (response && !response.error) {
                setDeleteConfirm(null);
                fetchCategoryData();
            } else {
                setError(response.message || "Delete failed");
            }
        } catch (err) {
            setError(err.message || "Delete failed");
        }
    };

    return (
        <div className="min-h-[80vh] w-full text-white">
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3 mb-6">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400">{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <CategoryList
                categoryData={categoryData}
                loading={loading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                openEditPage={handleOpenEditModal}
                openAddPage={handleOpenCreateModal}
                deleteConfirm={deleteConfirm}
                setDeleteConfirm={setDeleteConfirm}
                handleDelete={handleDelete}
                onRefresh={fetchCategoryData}
            />

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-lg mx-4 shadow-2xl overflow-hidden">
                        <CategoryForm
                            editingItem={editingItem}
                            onCancel={handleCloseModal}
                            onSubmit={handleSubmit}
                            submitting={submitting}
                            submitSuccess={submitSuccess}
                            submitError={submitError}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryManagement;