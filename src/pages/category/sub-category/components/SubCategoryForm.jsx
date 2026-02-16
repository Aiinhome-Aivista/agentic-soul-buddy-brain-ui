import React, { useState, useEffect } from "react";
import { Save, Loader2, X, Tag, ChevronDown, Plus } from "lucide-react";
import { apiService } from "../../../../service/ApiService";
import { POST_url } from "../../../../connection/connection";

function SubCategoryForm({
    editingItem,
    onCancel,
    onSubmit,
    submitting,
    submitSuccess,
    submitError
}) {
    const [formData, setFormData] = useState({
        category_id: "",
        name: "" // Used for current input
    });
    const [subNames, setSubNames] = useState([]); // Array for sub-categories
    const [existingNames, setExistingNames] = useState([]); // Track original names for sync
    const [categories, setCategories] = useState([]);
    const [fetchingCategories, setFetchingCategories] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            setFetchingCategories(true);
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
            } finally {
                setFetchingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (editingItem) {
            // editingItem is now a group object: {category_id, category_name, subcategories: []}
            setFormData({
                category_id: editingItem.category_id || "",
                name: ""
            });
            const names = editingItem.subcategories.map(s => s.name);
            setSubNames(names);
            setExistingNames(names);
        } else {
            setFormData(prev => ({ ...prev, name: "", category_id: "" }));
            setSubNames([]);
            setExistingNames([]);
        }
    }, [editingItem]);

    const handleAddSubName = () => {
        const trimmed = formData.name.trim();
        if (trimmed && !subNames.includes(trimmed)) {
            setSubNames([...subNames, trimmed]);
            setFormData({ ...formData, name: "" });
        }
    };

    const handleRemoveSubName = (nameToRemove) => {
        setSubNames(subNames.filter(n => n !== nameToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSubName();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Include the current input if not empty
        let finalNames = [...subNames];
        const currentName = formData.name.trim();
        if (currentName && !finalNames.includes(currentName)) {
            finalNames.push(currentName);
        }

        if (finalNames.length === 0 && !editingItem) return;

        // Pass the array of sub-category names to be synced/added
        onSubmit({
            category_id: formData.category_id,
            subcategory_names: finalNames,
            original_names: existingNames // So management can determine what to add/remove
        });
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between border-b border-[#334155] p-6">
                <h2 className="text-xl font-bold text-white">
                    {editingItem ? `Manage Sub-Categories: ${editingItem.category_name}` : "Create Multiple Sub-Categories"}
                </h2>
                <button
                    onClick={onCancel}
                    className="text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {submitError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm">
                        {submitError}
                    </div>
                )}

                {/* Parent Category */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Parent Category <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            required
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            className="w-full bg-[#0f172a] border border-[#334155] rounded-lg pl-10 pr-10 py-2.5 text-white focus:ring-2 focus:ring-[#795eff] focus:border-transparent transition-all outline-none appearance-none"
                        >
                            <option value="" disabled>{fetchingCategories ? "Loading categories..." : "Select parent category"}</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Sub-Category Names */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        {editingItem ? "Sub-Category Name" : "Add Sub-Category Names"} <span className="text-red-400">*</span>
                    </label>

                    {subNames.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {subNames.map((name) => (
                                <span key={name} className="flex items-center gap-1.5 px-3 py-1 bg-[#795eff]/20 border border-[#795eff]/30 text-[#a594ff] rounded-full text-sm">
                                    {name}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSubName(name)}
                                        className="hover:text-white"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-[#795eff] focus:border-transparent transition-all outline-none"
                            placeholder="enter sub-category name"
                            required={subNames.length === 0}
                        />
                        <button
                            type="button"
                            onClick={handleAddSubName}
                            className="p-2.5 bg-[#334155] hover:bg-[#475569] text-white rounded-lg transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-slate-300 hover:text-white hover:bg-[#334155] rounded-lg transition-colors"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-[#795eff] hover:bg-[#6b51df] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                {editingItem ? "Update" : "Create"}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SubCategoryForm;
