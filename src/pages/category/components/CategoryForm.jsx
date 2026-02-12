import React, { useState, useEffect } from "react";
import { Save, Loader2, X } from "lucide-react";

function CategoryForm({
    editingItem,
    onCancel,
    onSubmit,
    submitting,
    submitSuccess,
    submitError
}) {
    const [formData, setFormData] = useState({
        name: ""
    });

    useEffect(() => {
        if (editingItem) {
            setFormData({
                name: editingItem.name
            });
        }
    }, [editingItem]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between border-b border-[#334155] p-6">
                <h2 className="text-xl font-bold text-white">
                    {editingItem ? "Edit Category" : "Create New Category"}
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

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Category Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-[#795eff] focus:border-transparent transition-all outline-none"
                        placeholder="e.g., Technology"
                    />
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

export default CategoryForm;
