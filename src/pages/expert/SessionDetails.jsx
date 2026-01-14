import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Bot,
  User,
  Clock,
  Calendar,
} from "lucide-react";
import { baseUrl } from "../../env/env";
import { apiService } from "../../service/ApiService";

function SessionDetails() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch session details from API
  const fetchSessionDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService({
        url: `${baseUrl}session/${sessionId}`,
        method: "GET",
      });

      if (data.error) {
        throw new Error(data.message || "Failed to fetch session details");
      }

      setMessages(data.data || []);
    } catch (err) {
      console.error("Error fetching session details:", err);
      setError(err.message);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails();
    }
  }, [sessionId]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[80vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#795EFF] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-300 text-lg">Loading session...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[80vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-16 h-16 text-red-500" />
          <p className="text-red-400 text-lg">Failed to load session</p>
          <p className="text-slate-500 text-sm">{error}</p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            <button
              onClick={fetchSessionDetails}
              className="px-6 py-2 bg-[#795EFF] hover:bg-[#6a4be8] rounded-lg text-white font-medium flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] w-full text-white flex flex-col gap-6">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#795EFF]" />
              Session Conversation
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {messages.length} messages in this session
            </p>
          </div>
        </div>
        <button
          onClick={fetchSessionDetails}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Session ID Card */}
      <div className="bg-[#1e293b] rounded-xl p-4">
        <div className="flex items-center gap-3 text-sm">
          <Clock className="w-4 h-4 text-slate-500" />
          <span className="text-slate-400">Session ID:</span>
          <span className="text-slate-300 font-mono text-xs bg-slate-800 px-2 py-1 rounded">
            {sessionId}
          </span>
        </div>
      </div>

      {/* Messages Container */}
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-slate-500">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No messages in this session</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto max-h-[65vh] pr-2">
          {messages.map((message, index) => (
            <div key={index} className="space-y-3">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="max-w-[75%] flex items-start gap-3">
                  <div className="bg-[#795EFF] rounded-2xl rounded-tr-sm p-4">
                    <p className="text-white text-sm leading-relaxed">
                      {message.user_input}
                    </p>
                    <p className="text-[#c4b5fd] text-[10px] mt-2 text-right">
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex justify-start">
                <div className="max-w-[75%] flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#795EFF] to-[#5a3fd4] rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-[#1e293b] border border-slate-700 rounded-2xl rounded-tl-sm p-4">
                    <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                      {message.model_response}
                    </p>
                    <p className="text-slate-500 text-[10px] mt-2">
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Session Summary Footer */}
      {messages.length > 0 && (
        <div className="bg-[#1e293b] rounded-xl p-4 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-slate-400">
                <MessageSquare className="w-4 h-4" />
                <span>{messages.length} exchanges</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>
                  {messages.length > 0
                    ? formatDateTime(messages[0].created_at)
                    : "N/A"}
                </span>
              </div>
            </div>
            <div className="text-slate-500 text-xs">
              Last message:{" "}
              {messages.length > 0
                ? formatDateTime(messages[messages.length - 1].created_at)
                : "N/A"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionDetails;
