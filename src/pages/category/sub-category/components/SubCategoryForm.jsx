import React, { useState, useEffect } from "react";
import { Save, Loader2, X, Tag, ChevronDown, Plus } from "lucide-react";
import { apiService } from "../../../../service/ApiService";
import { POST_url, GET_url } from "../../../../connection/connection";

function SubCategoryForm({
    editingItem,
    categories,
    onCancel,
    onSubmit,
    submitting,
    submitSuccess,
    submitError
}) {
    const [formData, setFormData] = useState({
        category_id: "",
    });
    const [subNames, setSubNames] = useState([{ name: "", originalName: null }]); // Start with one empty row

    useEffect(() => {
        if (editingItem) {
            setFormData({
                category_id: editingItem.category_id ? String(editingItem.category_id) : "",
            });
            const names = editingItem.subcategories.map(s => {
                const rawName = s.name || "";
                return {
                    name: rawName.trim(), // Trim for user input
                    originalName: rawName  // Keep EXACT raw name for server matching
                };
            });
            setSubNames(names.length > 0 ? names : [{ name: "", originalName: null }]);
        } else {
            setFormData({ category_id: "" });
            setSubNames([{ name: "", originalName: null }]);
        }
    }, [editingItem]);

    const handleRowChange = (index, value) => {
        const newSubNames = [...subNames];
        newSubNames[index] = { ...newSubNames[index], name: value };
        setSubNames(newSubNames);
    };

    const handleAddRow = () => {
        setSubNames([...subNames, { name: "", originalName: null }]);
    };

    const handleRemoveRow = (index) => {
        if (subNames.length > 1) {
            const newSubNames = subNames.filter((_, i) => i !== index);
            setSubNames(newSubNames);
        } else {
            setSubNames([{ name: "", originalName: null }]); // Keep at least one empty row
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddRow();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Filter out empty rows and trim values
        const finalRows = subNames
            .map(row => ({
                ...row,
                name: row.name.trim()
            }))
            .filter(row => row.name !== "");

        if (finalRows.length === 0 && !editingItem) return;

        onSubmit({
            category_id: formData.category_id,
            subcategories: finalRows, // Pass the objects
            // Maintain compatibility or derived data if needed
            subcategory_names: finalRows.map(r => r.name),
            original_names: editingItem ? editingItem.subcategories.map(s => s.name) : []
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
                            <option value="" disabled>Select parent category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Sub-Category Names */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-slate-300">
                            {editingItem ? "Sub-Category Names" : "Add Sub-Category Names"} <span className="text-red-400">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={handleAddRow}
                            className="flex items-center gap-1.5 text-sm text-[#795eff] hover:text-[#6b51df] transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add More
                        </button>
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto p-1 pr-2 custom-scrollbar">
                        {subNames.map((row, index) => (
                            <div key={index} className="flex gap-2">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={row.name}
                                        onChange={(e) => handleRowChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        autoFocus={index === subNames.length - 1 && index !== 0}
                                        className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-[#795eff] focus:border-transparent transition-all outline-none"
                                        placeholder="enter sub-category name"
                                        required={subNames.length === 1}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveRow(index)}
                                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
                                    title="Remove row"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
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
