import { baseUrl } from "../env/env";

const API_BASE_URL = baseUrl.replace(/\/$/, ""); // Remove trailing slash if exists

export const POST_url = {
  login: `${API_BASE_URL}/admin_expert_login`,
  dataTypes: `${API_BASE_URL}/analyze_files`,
  patterns: `${API_BASE_URL}/patterns`,
  insights: `${API_BASE_URL}/insight`,
  relationships: `${API_BASE_URL}/relationships`,
  uploads: `${API_BASE_URL}/upload`,
  uploadtable: `${API_BASE_URL}/upload_files_count`,
  uploadfiles_details: `${API_BASE_URL}/uploadfile_details`,
  user_input_analyze: `${API_BASE_URL}/user_input_analyze`,
  updateActiveSessions: `${API_BASE_URL}/update_active_sessions`,
  uploadFiles: `${API_BASE_URL}/upload_files`, // Chat Insights Upload
  insightsChat: `${API_BASE_URL}/insights_chat`, // Chat Insights
  userDetails: `${API_BASE_URL}/user_details`, // Expert - User Details
  expertInsight: `${API_BASE_URL}/expert-insight`, // Expert Insight
  adminRegistration: `${API_BASE_URL}/admin_expert_registration`, // Admin Management - Register
  seo_crud: `${API_BASE_URL}/seo`,
  category: `${API_BASE_URL}/categories`,
  blogs: `${API_BASE_URL}/blogs`,
  // New sub-category endpoints
  addSubCategories: (categoryId) => `${API_BASE_URL}/categories/${categoryId}/subcategories`,
  getSubCategoriesByAll: `${API_BASE_URL}/categories/subcategories/all`,
  contentImages: `${API_BASE_URL}/content-images`,


};

export const GET_url = {
  TableTracker: `${API_BASE_URL}/tracker`,
  viewInfo: (sessionName) =>
    `${API_BASE_URL}/view_info?session_name=${sessionName}`,
  fetchSessions: `${API_BASE_URL}/successful_sessions`,
  users: `${API_BASE_URL}/users`, // Expert - All Users
  userSessions: (userId) => `${API_BASE_URL}/user-sessions/${userId}`, // Expert - User Sessions
  sessionDetails: (sessionId) => `${API_BASE_URL}/session/${sessionId}`, // Expert - Session Details
  ragChat: `${API_BASE_URL}/rag_chat`, // Vector Insights RAG Chat
  adminsList: `${API_BASE_URL}/admin_expert_list`, // Admin Management - List All
  captcha: `${API_BASE_URL}/generate_captcha`,
  souljunction_users: `${API_BASE_URL}/souljunction_users`,
  seo_details: `${API_BASE_URL}/seo`,
  category: `${API_BASE_URL}/categories`,
  listAllSubCategories: `${API_BASE_URL}/categories/subcategories/list-all`,
  tags: `${API_BASE_URL}/blogs/tags`,
  contentImages: `${API_BASE_URL}/content-images`,
};

export const PUT_url = {
  updateSubCategory: (categoryId) => `${API_BASE_URL}/categories/${categoryId}/subcategories`,
  updateBlog: (id) => `${API_BASE_URL}/blogs/${id}`,
  updateCategory: (id) => `${API_BASE_URL}/categories/${id}`,
 
};


// DELETE endpoints
export const DELETE_url = {
  deleteSession: (sessionName) =>
    `${API_BASE_URL}/delete_session/${sessionName}`,
  deleteCategory: (id) => `${API_BASE_URL}/categories/${id}`,
  deleteSubCategory: (categoryId) => `${API_BASE_URL}/categories/${categoryId}/subcategories`,
  deleteBlog: (id) => `${API_BASE_URL}/blogs/${id}`,
  deleteContentImage: (id) => `${API_BASE_URL}/content-images/${id}`,

};
