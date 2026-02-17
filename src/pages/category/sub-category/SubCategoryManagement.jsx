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
                url: GET_url.category,
                method: "GET"
            });
            let fetchedCategories = [];
            if (Array.isArray(response)) {
                fetchedCategories = response;
            } else if (response?.data && Array.isArray(response.data)) {
                fetchedCategories = response.data;
            }
            setCategories(fetchedCategories);
            return fetchedCategories;
        } catch (error) {
            console.error("Failed to fetch categories", error);
            return [];
        }
    };

    const fetchSubCategoryData = async (currentCategories) => {
        setLoading(true);
        // Ensure categoriesToList is ALWAYS an array (prevents "find is not a function" if passed an event object)
        const categoriesToList = Array.isArray(currentCategories) ? currentCategories : categories;
        try {
            const response = await apiService({
                url: GET_url.listAllSubCategories,
                method: "GET"
            });

            if (response?.status === "success" && Array.isArray(response.data)) {
                // Flatten the nested categories with subcategories
                const flattenedData = response.data.flatMap(cat => {
                    // Find category ID from our categories list if not provided
                    // Using robust matching (trim and case-insensitive) to handle possible server-side whitespace
                    const matchedCat = Array.isArray(categoriesToList) ? categoriesToList.find(c =>
                        c.name.trim().toLowerCase() === cat.category_name.trim().toLowerCase()
                    ) : null;
                    const categoryId = cat.category_id || matchedCat?.id;

                    return cat.subcategories.map((subName, index) => ({
                        id: `${categoryId || cat.category_name}-${index}`, // Synthetic ID
                        category_id: categoryId,
                        category_name: cat.category_name,
                        name: subName, // Keep raw from server for matching
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
            const fetched = await fetchCategories();
            fetchSubCategoryData(fetched);
        };
        init();
    }, []); // Run only once on mount


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
                const subcategories = formData.subcategories || [];

                // 🔁 RENAME FIRST
                const renames = subcategories.filter(
                    s => s.originalName && s.originalName.trim() !== s.name.trim()
                );

                for (const item of renames) {
                    const res = await apiService({
                        url: PUT_url.updateSubCategory(formData.category_id),
                        method: "PUT",
                        data: {
                            author_name: user?.full_name || user?.username || "Admin",
                            old_name: item.originalName, // Use EXACT raw name for server matching
                            new_name: item.name.trim()
                        }
                    });

                    if (res?.status !== "success") {
                        throw new Error(res?.message || "Rename failed");
                    }
                }

                // 🗑️ DELETE AFTER SUCCESSFUL RENAME
                const originalNames = formData.original_names || [];
                // Only delete names that are NOT present as originalNames in any current row
                const currentOriginalNames = subcategories.map(s => s.originalName).filter(Boolean);
                const removed = originalNames.filter(name => !currentOriginalNames.includes(name));

                for (const name of removed) {
                    const res = await apiService({
                        url: DELETE_url.deleteSubCategory(formData.category_id),
                        method: "DELETE",
                        data: {
                            author_name: user?.full_name || user?.username || "Admin",
                            subcategory_name: name
                        }
                    });

                    if (res?.status !== "success") {
                        throw new Error(res?.message || "Delete failed");
                    }
                }

                // ➕ ADD LAST
                const additions = subcategories.filter(s => !s.originalName).map(s => s.name);

                if (additions.length > 0) {
                    const res = await apiService({
                        url: POST_url.addSubCategories(formData.category_id),
                        method: "POST",
                        data: {
                            author_name: user?.full_name || user?.username || "Admin",
                            subcategory_name: additions
                        }
                    });

                    if (res?.status !== "success") {
                        throw new Error(res?.message || "Add failed");
                    }
                }

                setSubmitSuccess(true);
                await fetchSubCategoryData();
                handleCloseModal();
            } else {
                // Create Mode
                const response = await apiService({
                    url: POST_url.addSubCategories(formData.category_id),
                    method: "POST",
                    data: {
                        author_name: user?.full_name || user?.username || "Admin",
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
                        author_name: user?.full_name || user?.username || "Admin",
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

    const handleDeleteSingleSubCategory = async (categoryId, subcategoryName) => {
        try {
            await apiService({
                url: DELETE_url.deleteSubCategory(categoryId),
                method: "DELETE",
                data: {
                    author_name: user?.full_name || user?.username || "Admin",
                    subcategory_name: subcategoryName
                }
            });
            fetchSubCategoryData();
        } catch (err) {
            setError(err.message || "Failed to delete sub-category");
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
                handleDeleteSingleSubCategory={handleDeleteSingleSubCategory}
                onRefresh={() => fetchSubCategoryData()}
            />

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-lg mx-4 shadow-2xl overflow-hidden">
                        <SubCategoryForm
                            editingItem={editingItem}
                            categories={categories}
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
