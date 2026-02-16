import React from "react";
import { Edit2, Trash2, Search, Plus, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

function SubCategoryList({
    subCategoryData,
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
    // Pagination state
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);

    const filteredData = subCategoryData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category_name && item.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Reset to page 1 when search changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Group filtered data by category
    const groupedData = React.useMemo(() => {
        const groups = {};
        filteredData.forEach(item => {
            const key = item.category_name || `ID:${item.category_id}`;
            if (!groups[key]) {
                groups[key] = {
                    category_name: item.category_name,
                    category_id: item.category_id,
                    subcategories: []
                };
            }
            groups[key].subcategories.push(item);
        });
        return Object.values(groups);
    }, [filteredData]);

    // Calculate pagination based on grouped categories
    const totalItems = groupedData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = groupedData.slice(startIndex, endIndex);

    // Pagination handlers
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Sub-Category Management</h1>
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
                        Add Sub-Category
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-[#1e293b] p-4 rounded-lg border border-[#334155]">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search sub-categories or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-white placeholder-slate-400 w-full"
                />
            </div>

            <div className="bg-[#1e293b] rounded-lg border border-[#334155] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#334155] bg-[#0f172a]/50">
                                <th className="p-4 text-slate-300 font-medium w-24">Cat ID</th>
                                <th className="p-4 text-slate-300 font-medium w-64">Category</th>
                                <th className="p-4 text-slate-300 font-medium">Sub-Categories</th>
                             
                                <th className="p-4 text-slate-300 font-medium w-32 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-400">
                                        Loading sub-categories...
                                    </td>
                                </tr>
                            ) : groupedData.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-400">
                                        No sub-categories found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((group, groupIdx) => (
                                    <tr key={group.category_id || groupIdx} className="border-b border-[#334155] hover:bg-[#334155]/30 transition-colors">
                                        <td className="p-4 text-slate-300">
                                            <span className="px-2 py-1 bg-slate-700 rounded text-sm">
                                                {group.category_id || '-'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-[#795eff] font-medium">{group.category_name || `ID: ${group.category_id}`}</td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-2 py-1">
                                                {group.subcategories.map((sub) => (
                                                    <div
                                                        key={sub.id}
                                                        className="inline-flex items-center px-3 py-1 bg-[#795eff]/10 border border-[#795eff]/20 rounded-full"
                                                    >
                                                        <span className="text-white text-sm font-medium">{sub.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditPage(group)}
                                                    className="p-2 text-slate-400 hover:text-white hover:bg-[#334155] rounded-lg transition-colors"
                                                    title="Manage Sub-categories"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(group)}
                                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-[#334155] rounded-lg transition-colors"
                                                    title="Delete All Sub-categories"
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

                {/* Pagination Controls */}
                {!loading && groupedData.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-[#334155]">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400">Show</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                className="px-3 py-1.5 bg-[#0f172a] border border-[#334155] rounded-lg text-white text-sm focus:outline-none focus:border-[#795eff] focus:ring-1 focus:ring-[#795eff] transition"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="text-sm text-slate-400">entries</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg transition ${currentPage === 1
                                    ? 'text-slate-600 cursor-not-allowed'
                                    : 'text-slate-400 hover:bg-[#334155] hover:text-white'
                                    }`}
                                title="First page"
                            >
                                <ChevronsLeft className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg transition ${currentPage === 1
                                    ? 'text-slate-600 cursor-not-allowed'
                                    : 'text-slate-400 hover:bg-[#334155] hover:text-white'
                                    }`}
                                title="Previous page"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {(() => {
                                const pages = [];
                                const maxVisiblePages = 5;
                                let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                                let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                                if (endPage - startPage < maxVisiblePages - 1) {
                                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                                }

                                for (let i = startPage; i <= endPage; i++) {
                                    pages.push(
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(i)}
                                            className={`min-w-[2rem] px-3 py-1.5 rounded-lg text-sm font-medium transition ${currentPage === i
                                                ? 'bg-[#795eff] text-white'
                                                : 'text-slate-400 hover:bg-[#334155] hover:text-white'
                                                }`}
                                        >
                                            {i}
                                        </button>
                                    );
                                }
                                return pages;
                            })()}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg transition ${currentPage === totalPages
                                    ? 'text-slate-600 cursor-not-allowed'
                                    : 'text-slate-400 hover:bg-[#334155] hover:text-white'
                                    }`}
                                title="Next page"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg transition ${currentPage === totalPages
                                    ? 'text-slate-600 cursor-not-allowed'
                                    : 'text-slate-400 hover:bg-[#334155] hover:text-white'
                                    }`}
                                title="Last page"
                            >
                                <ChevronsRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="text-sm text-slate-400">
                            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 max-w-sm w-full shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-2">Delete Sub-Categories?</h3>
                        <p className="text-slate-300 mb-6">
                            Are you sure you want to delete all sub-categories in <strong>{deleteConfirm.category_name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-[#334155] rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                Delete All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SubCategoryList;
