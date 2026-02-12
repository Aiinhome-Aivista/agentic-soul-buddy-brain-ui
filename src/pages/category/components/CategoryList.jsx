import React from "react";
import { Edit2, Trash2, Search, Plus, RefreshCw } from "lucide-react";

function CategoryList({
    categoryData,
    loading,
    searchQuery,
    setSearchQuery,
    openEditPage,
    openAddPage,
    deleteConfirm,
    setDeleteConfirm,
    handleDelete,
    onRefresh
}) {
    const filteredData = categoryData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Category Management</h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onRefresh}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-slate-300 hover:text-white rounded-lg transition-colors"
                        disabled={loading}
                        title="Refresh List"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={openAddPage}
                        className="bg-[#795eff] hover:bg-[#6b51df] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Category
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-[#1e293b] p-4 rounded-lg border border-[#334155]">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-white placeholder-slate-400 w-full"
                />
            </div>

            <div className="bg-[#1e293b] rounded-lg border border-[#334155] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#334155] bg-[#0f172a]/50">
                            <th className="p-4 text-slate-300 font-medium w-20">ID</th>
                            <th className="p-4 text-slate-300 font-medium">Category Name</th>
                            <th className="p-4 text-slate-300 font-medium w-32 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="p-8 text-center text-slate-400">
                                    Loading categories...
                                </td>
                            </tr>
                        ) : filteredData.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="p-8 text-center text-slate-400">
                                    No categories found.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((item) => (
                                <tr key={item.id} className="border-b border-[#334155] hover:bg-[#334155]/30 transition-colors">
                                    <td className="p-4 text-slate-300">{item.id}</td>
                                    <td className="p-4 text-white font-medium">{item.name}</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditPage(item)}
                                                className="p-2 text-slate-400 hover:text-white hover:bg-[#334155] rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(item)}
                                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-[#334155] rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 max-w-sm w-full shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-2">Delete Category?</h3>
                        <p className="text-slate-300 mb-6">
                            Are you sure you want to delete this category? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-[#334155] rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.author_name)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryList;
