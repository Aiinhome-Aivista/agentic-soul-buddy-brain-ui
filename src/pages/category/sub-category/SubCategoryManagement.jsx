import React, { useState, useEffect, useContext } from "react";
import { AlertCircle, X } from "lucide-react";
import SubCategoryList from "./components/SubCategoryList";
import SubCategoryForm from "./components/SubCategoryForm";
import { apiService } from "../../../service/ApiService";
import { POST_url, DELETE_url, GET_url, PUT_url } from "../../../connection/connection";

import { Context } from "../../../common/helper/Context";

function SubCategoryManagement() {
    const { user } = useContext(Context);

    const [subCategoryData, setSubCategoryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [categories, setCategories] = useState([]);

    // Form State
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // List State
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchCategories = async () => {
        try {
            const response = await apiService({
                url: POST_url.category,
                method: "GET"
            });
            if (Array.isArray(response)) {
                setCategories(response);
            } else if (response?.data && Array.isArray(response.data)) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const fetchSubCategoryData = async () => {
        setLoading(true);
        try {
            const response = await apiService({
                url: GET_url.listAllSubCategories,
                method: "GET"
            });

            if (response?.status === "success" && Array.isArray(response.data)) {
                // Flatten the nested categories with subcategories
                const flattenedData = response.data.flatMap(cat => {
                    // Find category ID from our categories list if not provided
                    const matchedCat = categories.find(c => c.name === cat.category_name);
                    const categoryId = cat.category_id || matchedCat?.id;

                    return cat.subcategories.map((subName, index) => ({
                        id: `${categoryId || cat.category_name}-${index}`, // Synthetic ID
                        category_id: categoryId,
                        category_name: cat.category_name,
                        name: subName,
                        created_at: new Date().toISOString()
                    }));
                });
                setSubCategoryData(flattenedData);
            } else {
                setSubCategoryData([]);
            }
        } catch (err) {
            setError(err.message || "Failed to fetch sub-categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchCategories();
            fetchSubCategoryData();
        };
        init();
    }, [categories.length === 0]); // Re-run once if categories are empty


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
            if (editingItem) {
                // Determine removed items
                const removed = (formData.original_names || []).filter(name => !formData.subcategory_names.includes(name));
                // Determine added items
                const added = (formData.subcategory_names || []).filter(name => !(formData.original_names || []).includes(name));

                // Delete removed sub-categories
                for (const name of removed) {
                    await apiService({
                        url: DELETE_url.deleteSubCategory(formData.category_id),
                        method: "DELETE",
                        data: {
                            author_name: user?.full_name || "Chief Administrator",
                            subcategory_name: name
                        }
                    });
                }

                // Add new sub-categories
                if (added.length > 0) {
                    await apiService({
                        url: POST_url.addSubCategories(formData.category_id),
                        method: "POST",
                        data: {
                            author_name: user?.full_name || "Chief Administrator",
                            subcategory_name: added
                        }
                    });
                }

                setSubmitSuccess(true);
                setTimeout(() => {
                    handleCloseModal();
                    fetchSubCategoryData();
                }, 1000);
            } else {
                // Create Mode
                const response = await apiService({
                    url: POST_url.addSubCategories(formData.category_id),
                    method: "POST",
                    data: {
                        author_name: user?.full_name || "Chief Administrator",
                        subcategory_name: formData.subcategory_names
                    }
                });

                if (response && response.status === "success") {
                    setSubmitSuccess(true);
                    setTimeout(() => {
                        handleCloseModal();
                        fetchSubCategoryData();
                    }, 1000);
                } else {
                    setSubmitError(response.message || "Operation failed");
                }
            }
        } catch (err) {
            setSubmitError(err.message || "An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (group) => {
        try {
            // Delete each sub-category in the group
            for (const item of group.subcategories) {
                await apiService({
                    url: DELETE_url.deleteSubCategory(item.category_id),
                    method: "DELETE",
                    data: {
                        author_name: user?.full_name || "Chief Administrator",
                        subcategory_name: item.name
                    }
                });
            }
            setDeleteConfirm(null);
            fetchSubCategoryData();
        } catch (err) {
            setError(err.message || "Delete failed");
            fetchSubCategoryData(); // Refresh to show what might have been deleted
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

            <SubCategoryList
                subCategoryData={subCategoryData}
                loading={loading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                openEditPage={handleOpenEditModal}
                openAddPage={handleOpenCreateModal}
                deleteConfirm={deleteConfirm}
                setDeleteConfirm={setDeleteConfirm}
                handleDelete={handleDelete}
                onRefresh={fetchSubCategoryData}
            />

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-lg mx-4 shadow-2xl overflow-hidden">
                        <SubCategoryForm
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

export default SubCategoryManagement;
