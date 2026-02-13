
import {
    ArrowLeft,
    FileText,
    Tag,
    Image as ImageIcon,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    Save,
    X,
    Plus,
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading6,
    Heading3,
    ChevronDown,

} from "lucide-react";
import { apiService } from "../../../service/ApiService";
import { POST_url, GET_url } from "../../../connection/connection";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../env/env";


import Underline from "@tiptap/extension-underline";
import TiptapEditor from "./TitapEditor";


const BlogForm = ({ editingItem, onCancel, onSubmit, submitting, submitSuccess, submitError, user }) => {

    // Helper to get full image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "";
        if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) return imagePath;
        return `${baseUrl}${imagePath.replace(/^\/+/, '')}`;
    };

    const [formData, setFormData] = useState({
        title: "",
        content_preview: "",
        category_id: "",
        featured_image: "",
        is_post: 1,
        is_pinned: false,
        author_name: user?.full_name || "",
        tags: ""
    });

    const [imageFile, setImageFile] = useState();
    const [categories, setCategories] = useState([]);

    // Tags State
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

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

    // Fetch Tags
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await apiService({
                    url: GET_url.tags,
                    method: "GET"
                });

                let tagsData = [];
                if (Array.isArray(response)) {
                    tagsData = response;
                } else if (response?.data && Array.isArray(response.data)) {
                    tagsData = response.data;
                } else if (response?.tags && Array.isArray(response.tags)) {
                    tagsData = response.tags;
                } else if (response?.data?.tags && Array.isArray(response.data.tags)) {
                    tagsData = response.data.tags;
                }

                setAvailableTags(tagsData);
            } catch (error) {
                console.error("Failed to fetch tags", error);
            }
        };
        fetchTags();
    }, []);


    useEffect(() => {
        if (editingItem) {

            // Parse tags from editingItem
            let initialTags = [];
            if (editingItem.tags) {
                if (Array.isArray(editingItem.tags)) {
                    initialTags = editingItem.tags;
                } else if (typeof editingItem.tags === 'string') {
                    try {
                        // Try parsing as JSON array
                        const parsed = JSON.parse(editingItem.tags);
                        if (Array.isArray(parsed)) initialTags = parsed;
                        else initialTags = editingItem.tags.split(',').map(t => t.trim());
                    } catch (e) {
                        // Fallback to comma separation
                        initialTags = editingItem.tags.split(',').map(t => t.trim());
                    }
                }
            }

            setSelectedTags(initialTags);

            // Get the image path and construct full URL
            const imagePath = editingItem.image_url || editingItem.image || editingItem.featured_image || "";
            const fullImageUrl = getImageUrl(imagePath);

            setFormData({
                title: editingItem.title || "",
                content_preview: editingItem.content_preview || editingItem.content || "",
                category_id: editingItem.category_id || "",
                featured_image: fullImageUrl,
                is_post: editingItem.is_post === 1 || editingItem.is_post === "1" ? 1 : 0,
                is_pinned: editingItem.is_pinned || false,
                author_name: editingItem.author_name || user?.full_name || "",
                tags: ""
            });

        }
    }, [editingItem, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Tag Handlers
    const handleTagInputChange = (e) => {
        setTagInput(e.target.value);
        setIsTagDropdownOpen(true);
    };

    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(tagInput);
        }
    };

    const addTag = (tag) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !selectedTags.includes(trimmedTag)) {
            setSelectedTags([...selectedTags, trimmedTag]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("author_name", formData.author_name);
        data.append("title", formData.title);
        data.append("content_preview", formData.content_preview);
        data.append("category_id", formData.category_id);
        data.append("is_pinned", formData.is_pinned ? 1 : 0);
        data.append("is_post", formData.is_post);

        data.append("tags", JSON.stringify(selectedTags));

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
                                    className="w-full pl-10 pr-10 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition appearance-none text-white"
                                >
                                    <option value="" disabled className="bg-slate-800 text-slate-400">Select category</option>
                                    {categories.map((cat, index) => (
                                        <option key={cat.id || index} value={cat.id} className="bg-slate-800">{cat.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
                                        name="is_post"
                                        value={1}
                                        checked={formData.is_post === 1}
                                        onChange={(e) => setFormData({ ...formData, is_post: 1 })}
                                        className="hidden peer"
                                    />
                                    <div className="w-4 h-4 rounded-full border border-slate-400 peer-checked:border-green-500 peer-checked:bg-green-500 transition-colors"></div>
                                    <span className="text-slate-300 peer-checked:text-green-400 transition-colors">Published</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="is_post"
                                        value={0}
                                        checked={formData.is_post === 0}
                                        onChange={(e) => setFormData({ ...formData, is_post: 0 })}
                                        className="hidden peer"
                                    />
                                    <div className="w-4 h-4 rounded-full border border-slate-400 peer-checked:border-slate-400 peer-checked:bg-slate-500 transition-colors"></div>
                                    <span className="text-slate-300 transition-colors">Draft</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Tags Field */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Tags
                        </label>
                        <div className="relative group">
                            <Tag className="absolute left-3 top-3 w-4 h-4 text-slate-400 z-10" />
                            <div
                                className={`w-full pl-10 pr-10 py-2 min-h-[50px] bg-slate-700/50 border rounded-lg transition flex flex-wrap gap-2 items-center cursor-text ${isTagDropdownOpen ? 'border-yellow-500 ring-1 ring-yellow-500' : 'border-slate-600 focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500'}`}
                                onClick={() => {
                                    document.getElementById('tag-input').focus();
                                    setIsTagDropdownOpen(true);
                                }}
                            >
                                {selectedTags.map((tag, index) => (
                                    <span key={index} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 text-sm border border-yellow-500/20">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeTag(tag);
                                            }}
                                            className="hover:text-yellow-300 focus:outline-none"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    id="tag-input"
                                    type="text"
                                    value={tagInput}
                                    onChange={handleTagInputChange}
                                    onKeyDown={handleTagInputKeyDown}
                                    onFocus={() => setIsTagDropdownOpen(true)}
                                    className="bg-transparent border-none outline-none text-white placeholder-slate-500 flex-1 min-w-[120px] py-1"
                                    placeholder={selectedTags.length === 0 ? "Select or type to add tags..." : ""}
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none z-10" />

                            {/* Custom Dropdown for Tags */}
                            {isTagDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-[9998]" onClick={() => setIsTagDropdownOpen(false)}></div>
                                    <div className="absolute z-[9999] w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                                        {availableTags.filter(tag => {
                                            const tagName = typeof tag === 'string' ? tag : (tag.name || tag.label || tag.title || tag.tag || tag.value || "");
                                            return tagName.toLowerCase().includes(tagInput.toLowerCase());
                                        }).length > 0 ? (
                                            availableTags
                                                .filter(tag => {
                                                    const tagName = typeof tag === 'string' ? tag : (tag.name || tag.label || tag.title || tag.tag || tag.value || "");
                                                    return tagName.toLowerCase().includes(tagInput.toLowerCase());
                                                })
                                                .map((tag, index) => {
                                                    const tagName = typeof tag === 'string' ? tag : (tag.name || tag.label || tag.title || tag.tag || tag.value || "");
                                                    const isSelected = selectedTags.includes(tagName);
                                                    return (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                if (isSelected) {
                                                                    removeTag(tagName);
                                                                } else {
                                                                    addTag(tagName);
                                                                }
                                                                document.getElementById('tag-input').focus();
                                                            }}
                                                            className={`w-full text-left px-4 py-2.5 hover:bg-slate-700 transition flex items-center gap-3 group ${isSelected ? 'bg-slate-700/50' : 'text-slate-300'}`}
                                                        >
                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-yellow-500 border-yellow-500' : 'border-slate-500 group-hover:border-slate-400'}`}>
                                                                {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                                                            </div>
                                                            <span className={isSelected ? 'text-yellow-500' : 'text-slate-300 group-hover:text-white'}>{tagName}</span>
                                                        </button>
                                                    );
                                                })
                                        ) : (
                                            tagInput && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        addTag(tagInput);
                                                        setTagInput("");
                                                        setIsTagDropdownOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-3 hover:bg-slate-700 text-slate-300 transition flex items-center gap-2"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    <span>Add "{tagInput}"</span>
                                                </button>
                                            )
                                        )}
                                        {availableTags.length === 0 && !tagInput && (
                                            <div className="px-4 py-3 text-slate-500 text-sm italic">
                                                No tags available. Type to create one.
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
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

                    {/* Pin Status */}
                    <div>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative w-4 h-4 shrink-0">
                                <input
                                    type="checkbox"
                                    name="is_pinned"
                                    checked={formData.is_pinned}
                                    onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                                    className="hidden peer"
                                />
                                <div className="absolute inset-0 rounded-full border border-slate-400 peer-checked:border-green-500 transition-colors"></div>
                                <div className="absolute inset-[3px] rounded-full bg-green-500 scale-0 peer-checked:scale-100 transition-transform duration-200"></div>
                            </div>
                            <span className="text-slate-300 text-sm">Pin this post to top</span>
                        </label>
                    </div>

                    {/* Content */}


                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="block text-sm font-medium text-slate-300">
                                Content
                            </label>
                        </div>

                        <TiptapEditor
                            formData={formData}
                            setFormData={setFormData}
                        />

                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50"></span>
                            Rich text editor enabled. Formatting will be saved as HTML.
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

