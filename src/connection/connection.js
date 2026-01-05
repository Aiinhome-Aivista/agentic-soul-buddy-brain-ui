// const API_BASE_URL = "http://72.61.226.68:3004"
const API_BASE_URL = "http://122.163.121.176:3004"

export const POST_url = {
    dataTypes: `${API_BASE_URL}/analyze_files`,
    patterns: `${API_BASE_URL}/patterns`,
    insights: `${API_BASE_URL}/insight`,
    relationships: `${API_BASE_URL}/relationships`,
    uploads: `${API_BASE_URL}/upload`,
    uploadtable: `${API_BASE_URL}/upload_files_count`,
    uploadfiles_details: `${API_BASE_URL}/uploadfile_details`,
    user_input_analyze:`${API_BASE_URL}/user_input_analyze`,
    updateActiveSessions: `${API_BASE_URL}/update_active_sessions`,
};
export const GET_url = {
    TableTracker: `${API_BASE_URL}/tracker`,
    viewInfo: (sessionName) => `${API_BASE_URL}/view_info?session_name=${sessionName}`,
    fetchSessions: `${API_BASE_URL}/successful_sessions`,
};

// DELETE endpoints
export const DELETE_url = {
  deleteSession: (sessionName) =>
    `${API_BASE_URL}/delete_session/${sessionName}`,
};