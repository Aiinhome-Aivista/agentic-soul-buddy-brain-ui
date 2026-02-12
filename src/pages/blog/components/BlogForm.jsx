import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    FileText,
    Tag,
    Image as ImageIcon,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    Save,
    X
} from "lucide-react";
import { apiService } from "../../../service/ApiService";
import { POST_url } from "../../../connection/connection";
import { BLOG_STATUS } from "../../../common/constants";

const BlogForm = ({ editingItem, onCancel, onSubmit, submitting, submitSuccess, submitError, user }) => {

    const [formData, setFormData] = useState({
        title: "",
        content_preview: "",
        category_id: "",
        featured_image: "", 
        status: BLOG_STATUS.PUBLISHED,
        is_pinned: false,
        author_name: user?.full_name || ""
    });

    const [imageFile, setImageFile] = useState();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
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
        fetchCategories();
    }, []);

    useEffect(() => {
        if (editingItem) {
            setFormData({
                title: editingItem.title || "",
                content_preview: editingItem.content_preview || editingItem.content || "",
                category_id: editingItem.category_id || "",
                featured_image: editingItem.image || editingItem.featured_image || "", // Adjust based on what API returns
                status: editingItem.is_post === 1 ? BLOG_STATUS.PUBLISHED : (editingItem.status || BLOG_STATUS.PUBLISHED),
                is_pinned: editingItem.is_pinned || false,
                author_name: editingItem.author_name || user?.full_name || ""
            });

        }
    }, [editingItem]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("author_name", formData.author_name);
        data.append("title", formData.title);
        data.append("content_preview", formData.content_preview);
        data.append("category_id", formData.category_id);
        data.append("is_pinned", formData.is_pinned ? 1 : 0);
        data.append("is_post", formData.status === BLOG_STATUS.PUBLISHED ? 1 : 0);

        if (imageFile) {
            data.append("image", imageFile);
        }
        onSubmit(data);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 border-b border-slate-700 pb-4">
                <button
                    onClick={onCancel}
                    className="p-2 hover:bg-slate-700 rounded-full transition text-slate-400 hover:text-white"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-white">
                    {editingItem ? "Edit Blog Post" : "Create New Post"}
                </h2>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-xl">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Title
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition text-white"
                                placeholder="Enter post title"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Category
                            </label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    required
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition appearance-none text-white"
                                >
                                    <option value="" disabled className="bg-slate-800 text-slate-400">Select category</option>
                                    {categories.map((cat, index) => (
                                        <option key={cat.id || index} value={cat.id} className="bg-slate-800">{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Status
                            </label>
                            <div className="flex gap-4 items-center h-[50px]">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={BLOG_STATUS.PUBLISHED}
                                        checked={formData.status === BLOG_STATUS.PUBLISHED}
                                        onChange={handleInputChange}
                                        className="hidden peer"
                                    />
                                    <div className="w-4 h-4 rounded-full border border-slate-400 peer-checked:border-green-500 peer-checked:bg-green-500 transition-colors"></div>
                                    <span className="text-slate-300 peer-checked:text-green-400 transition-colors">Published</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={BLOG_STATUS.DRAFT}
                                        checked={formData.status === BLOG_STATUS.DRAFT}
                                        onChange={handleInputChange}
                                        className="hidden peer"
                                    />
                                    <div className="w-4 h-4 rounded-full border border-slate-400 peer-checked:border-slate-400 peer-checked:bg-slate-500 transition-colors"></div>
                                    <span className="text-slate-300 transition-colors">Draft</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Featured Image
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                name="image"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const imageUrl = URL.createObjectURL(file);
                                        setFormData({
                                            ...formData,
                                            featured_image: imageUrl,
                                        });
                                        setImageFile(file);
                                    }
                                }}
                                accept="image/*"
                                className="w-full pl-4 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500/10 file:text-yellow-400 hover:file:bg-yellow-500/20"
                            />
                        </div>
                        {formData.featured_image && (
                            <div className="mt-4 p-2 bg-slate-900/50 rounded-lg border border-slate-700 inline-block relative group">
                                <p className="text-xs text-slate-500 mb-2">Image Preview:</p>
                                <img
                                    src={formData.featured_image}
                                    alt="Preview"
                                    className="max-h-40 rounded object-cover"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, featured_image: "" });
                                        setImageFile(null);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove Image"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Ping Status */}
                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_pinned"
                                checked={formData.is_pinned}
                                onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                                className="w-4 h-4 bg-slate-700 border-slate-600 rounded focus:ring-yellow-500 text-yellow-500 cursor-pointer"
                            />
                            <span className="text-slate-300 text-sm">Pin this post to top</span>
                        </label>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Content
                        </label>
                        <textarea
                            name="content_preview"
                            value={formData.content_preview}
                            onChange={handleInputChange}
                            rows={12}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition min-h-[300px] text-white font-mono text-sm leading-relaxed"
                            placeholder="<p>Write your amazing blog post here...</p>"
                            required
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            Tip: You can use HTML tags for formatting.
                        </p>
                    </div>

                    {/* Error Message */}
                    {submitError && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg animate-fadeIn">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            <span className="text-red-400 text-sm">{submitError}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {submitSuccess && (
                        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg animate-fadeIn">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm">
                                Post {editingItem ? "updated" : "created"} successfully! Redirecting...
                            </span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-700">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-slate-300 hover:text-white font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || submitSuccess}
                            className="px-8 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 disabled:from-slate-600 disabled:to-slate-600 rounded-lg font-medium transition flex items-center justify-center gap-2 text-white shadow-lg min-w-[140px]"
                        >
                            {submitting ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : submitSuccess ? (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Saved!
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    {editingItem ? "Update Post" : "Publish Post"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogForm;
