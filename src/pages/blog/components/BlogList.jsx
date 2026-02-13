import React from "react";
import { baseUrl } from "../../../env/env";
import {
    Edit2,
    Trash2,
    Plus,
    BookOpen,
    Image as ImageIcon,
    Calendar,
    RefreshCw,
    Search,
    X,
    Eye,
    EyeOff,
    Pin,
    Tag,
    Clock,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from "lucide-react";

const BlogList = ({
    blogData,
    loading,
    searchQuery,
    setSearchQuery,
    openEditPage,
    openAddPage,
    deleteConfirm,
    setDeleteConfirm,
    handleDelete,
    fetchBlogData,
    handleTogglePin
}) => {
    const [filterStatus, setFilterStatus] = React.useState('ALL'); // 'ALL', 'PUBLISHED', 'DRAFT'
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [blogToDelete, setBlogToDelete] = React.useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);

    // Helper to strip HTML tags for preview (if content is HTML)
    const stripHtml = (html) => {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    // Helper to parse tags
    const parseTags = (tags) => {
        if (!tags) return [];
        if (Array.isArray(tags)) return tags;
        try {
            const parsed = JSON.parse(tags);
            if (Array.isArray(parsed)) return parsed;
            return tags.split(',').map(t => t.trim());
        } catch (e) {
            return tags.split(',').map(t => t.trim());
        }
    };

    // Filter and sort data
    const filteredAndSortedData = React.useMemo(() => {
        return [...blogData]
            .filter((item) => {
                // 1. Filter by Search Query
                if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase();
                    const matchesSearch = (
                        (item.title?.toLowerCase() || "").includes(query) ||
                        (item.content?.toLowerCase() || "").includes(query) ||
                        (item.category?.toLowerCase() || "").includes(query) ||
                        (item.tags?.toString()?.toLowerCase() || "").includes(query)
                    );
                    if (!matchesSearch) return false;
                }

                // 2. Filter by Status (Published/Draft/All)
                if (filterStatus === 'PUBLISHED') {
                    return item.is_post === 1 || item.is_post === "1";
                }
                if (filterStatus === 'DRAFT') {
                    return item.is_post === 0 || item.is_post === "0";
                }

                return true; // 'ALL'
            })
            // Sort by Pinned first, then by Date
            .sort((a, b) => {
                if (a.is_pinned && !b.is_pinned) return -1;
                if (!a.is_pinned && b.is_pinned) return 1;
                return new Date(b.created_at || b.date) - new Date(a.created_at || a.date);
            });
    }, [blogData, searchQuery, filterStatus]);

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterStatus]);

    // Calculate pagination
    const totalItems = filteredAndSortedData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredAndSortedData.slice(startIndex, endIndex);

    // Pagination handlers
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Blog Management</h1>
                        <p className="text-slate-400 text-sm">
                            Manage blog posts, articles, and updates
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchBlogData}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                    <button
                        onClick={openAddPage}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 rounded-lg transition font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Post
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search posts by title, category, or content..."
                    className="w-full pl-12 pr-10 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition text-white placeholder-slate-500"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                    onClick={() => setFilterStatus('ALL')}
                    className={`bg-slate-800/50 border rounded-xl p-4 cursor-pointer transition-all ${filterStatus === 'ALL' ? 'border-yellow-500 ring-1 ring-yellow-500/50' : 'border-slate-700 hover:border-slate-600'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <BookOpen className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Total Posts</p>
                            <p className="text-2xl font-bold">{blogData.length}</p>
                        </div>
                    </div>
                </div>
                <div
                    onClick={() => setFilterStatus('PUBLISHED')}
                    className={`bg-slate-800/50 border rounded-xl p-4 cursor-pointer transition-all ${filterStatus === 'PUBLISHED' ? 'border-green-500 ring-1 ring-green-500/50' : 'border-slate-700 hover:border-slate-600'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <Eye className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Published</p>
                            <p className="text-2xl font-bold">
                                {blogData.filter(item => item.is_post === 1 || item.is_post === "1").length}
                            </p>
                        </div>
                    </div>
                </div>
                <div
                    onClick={() => setFilterStatus('DRAFT')}
                    className={`bg-slate-800/50 border rounded-xl p-4 cursor-pointer transition-all ${filterStatus === 'DRAFT' ? 'border-slate-500 ring-1 ring-slate-500/50' : 'border-slate-700 hover:border-slate-600'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-500/20 rounded-lg">
                            <EyeOff className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Drafts</p>
                            <p className="text-2xl font-bold">
                                {blogData.filter(item => item.is_post === 0 || item.is_post === "0").length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog Table */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-800/80">
                                <th className="text-left p-4 text-slate-300 font-medium">ID</th>
                                <th className="text-left p-4 text-slate-300 font-medium max-w-xs">Title</th>
                                <th className="text-left p-4 text-slate-300 font-medium max-w-sm">Content Preview</th>
                                <th className="text-left p-4 text-slate-300 font-medium">Featured Image</th>
                                <th className="text-left p-4 text-slate-300 font-medium">Category</th>
                                <th className="text-left p-4 text-slate-300 font-medium">Tags</th>
                                <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                                <th className="text-left p-4 text-slate-300 font-medium">Created Date</th>
                                <th className="text-left p-4 text-slate-300 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="p-8 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />
                                            <span className="text-slate-400">Loading Blog posts...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredAndSortedData.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="p-8 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <BookOpen className="w-12 h-12 text-slate-600" />
                                            <p className="text-slate-400">No blog posts found</p>
                                            <button
                                                onClick={openAddPage}
                                                className="mt-2 text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Create your first post
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((item, index) => (
                                    <tr
                                        key={item.id || index}
                                        className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition ${item.is_pinned ? 'bg-slate-800/80' : ''}`}
                                    >
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-slate-700 rounded text-sm">
                                                {item.id || startIndex + index + 1}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-white font-medium truncate max-w-[200px] block" title={item.title}>
                                                {item.title}
                                            </span>
                                            {(item.is_pinned === 1 || item.is_pinned === true) && (
                                                <span className="text-[10px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded mt-1 inline-block">
                                                    Pinned
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs text-slate-400 block max-w-[300px] truncate" title={stripHtml(item.content_preview || item.content || "")}>
                                                {stripHtml(item.content_preview || item.content || "").substring(0, 80)}...
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {item.image_url || item.featured_image || item.image ? (
                                                <img
                                                    src={(item.image_url || item.featured_image || item.image)?.startsWith('http')
                                                        ? (item.image_url || item.featured_image || item.image)
                                                        : `${baseUrl}${(item.image_url || item.featured_image || item.image).replace(/^\/+/, '')}`}
                                                    alt="Thumbnail"
                                                    className="w-12 h-12 rounded object-cover border border-slate-600"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://via.placeholder.com/150?text=No+Image";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-slate-700 flex items-center justify-center text-slate-500">
                                                    <ImageIcon className="w-6 h-6" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                {item.category_name || item.category || "General"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                                                {parseTags(item.tags).slice(0, 3).map((tag, idx) => (
                                                    <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {parseTags(item.tags).length > 3 && (
                                                    <span className="text-[10px] text-slate-500">
                                                        +{parseTags(item.tags).length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.is_post === 1 || item.is_post === "1"
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                }`}>
                                                {item.is_post === 1 || item.is_post === "1" ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 text-slate-400 text-sm">
                                                <div className="flex items-center gap-1">

                                                    <span>
                                                        {new Date(item.created_at || item.date).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-slate-500">

                                                    <span>
                                                        {new Date(item.created_at || item.date).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleTogglePin(item.id)}
                                                    className={`p-2 rounded-lg transition ${item.is_pinned
                                                        ? 'text-yellow-400 bg-yellow-500/20 hover:bg-yellow-500/30'
                                                        : 'text-slate-400 hover:bg-slate-600 hover:text-slate-200'
                                                        }`}
                                                    title={item.is_pinned ? "Unpin Post" : "Pin Post"}
                                                >
                                                    <Pin className={`w-4 h-4 ${item.is_pinned ? 'fill-current' : ''}`} />
                                                </button>
                                                <button
                                                    onClick={() => openEditPage(item)}
                                                    className="p-2 hover:bg-blue-500/20 rounded-lg transition text-blue-400 hover:text-blue-300"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setBlogToDelete(item);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                    className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-400 hover:text-red-300"
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

                {/* Pagination Controls */}
                {!loading && filteredAndSortedData.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">
                        {/* Left: Items per page */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400">Show</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="text-sm text-slate-400">entries</span>
                        </div>

                        {/* Center: Page navigation */}
                        <div className="flex items-center gap-1">
                            {/* First page */}
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg transition ${currentPage === 1
                                        ? 'text-slate-600 cursor-not-allowed'
                                        : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                    }`}
                                title="First page"
                            >
                                <ChevronsLeft className="w-4 h-4" />
                            </button>

                            {/* Previous page */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg transition ${currentPage === 1
                                        ? 'text-slate-600 cursor-not-allowed'
                                        : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                    }`}
                                title="Previous page"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* Page numbers */}
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
                                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                                                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                                }`}
                                        >
                                            {i}
                                        </button>
                                    );
                                }
                                return pages;
                            })()}

                            {/* Next page */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg transition ${currentPage === totalPages
                                        ? 'text-slate-600 cursor-not-allowed'
                                        : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                    }`}
                                title="Next page"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>

                            {/* Last page */}
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg transition ${currentPage === totalPages
                                        ? 'text-slate-600 cursor-not-allowed'
                                        : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                    }`}
                                title="Last page"
                            >
                                <ChevronsRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Right: Showing entries info */}
                        <div className="text-sm text-slate-400">
                            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && blogToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-red-500/20 rounded-lg">
                                <Trash2 className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Delete Blog Post</h3>
                                <p className="text-sm text-slate-400">This action cannot be undone</p>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="mb-6">
                            <p className="text-slate-300 mb-3">
                                Are you sure you want to delete this blog post?
                            </p>
                            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
                                <p className="text-sm text-slate-400 mb-1">Title:</p>
                                <p className="text-white font-medium">{blogToDelete.title}</p>
                            </div>
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-sm text-red-400 flex items-start gap-2">
                                    <span className="text-lg">⚠️</span>
                                    <span>This will permanently delete the blog post and all associated data.</span>
                                </p>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="flex items-center gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setDeleteModalOpen(false);
                                    setBlogToDelete(null);
                                }}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-white font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(blogToDelete.id, blogToDelete.author_name);
                                    setDeleteModalOpen(false);
                                    setBlogToDelete(null);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition text-white font-medium flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Post
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default BlogList;
