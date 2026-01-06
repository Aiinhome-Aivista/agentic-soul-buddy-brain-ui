import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Briefcase,
  UserCircle,
  Heart,
  AlertCircle,
  CheckCircle,
  Smile,
  Frown,
  Meh,
  RefreshCw,
  Brain,
  Activity,
  Clock,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import { expertBaseUrl, expertBaseUrl2 } from "../../env/env";
import { apiService } from "../../service/ApiService";

function ClientDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // Fetch client details from API
  const fetchClientDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService({
        url: `${expertBaseUrl}user_details`,
        method: "POST",
        data: { user_id: userId },
      });

      if (data.error) {
        throw new Error(data.message || "Failed to fetch client details");
      }

      setClient(data.data || data);
    } catch (err) {
      console.error("Error fetching client details:", err);
      setError(err.message);
      setClient(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user sessions from API
  const fetchSessions = async () => {
    setSessionsLoading(true);
    try {
      const data = await apiService({
        url: `${expertBaseUrl}user-sessions/${userId}`,
        method: 'GET'
      });

      if (data.error) {
        console.error('Failed to fetch sessions:', data.message);
        setSessions([]);
      } else {
        setSessions(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchClientDetails();
      fetchSessions();
    }
  }, [userId]);

  // Get emotional state styling
  const getEmotionalStyle = (state) => {
    const lowerState = state?.toLowerCase() || "";
    if (lowerState.includes("happy") && !lowerState.includes("not")) {
      return {
        bg: "bg-green-500/20",
        text: "text-green-400",
        border: "border-green-500/50",
        icon: Smile,
      };
    } else if (lowerState.includes("good") && !lowerState.includes("not")) {
      return {
        bg: "bg-green-500/20",
        text: "text-green-400",
        border: "border-green-500/50",
        icon: Smile,
      };
    } else if (
      lowerState.includes("not happy") ||
      lowerState.includes("sad") ||
      lowerState.includes("bad")
    ) {
      return {
        bg: "bg-red-500/20",
        text: "text-red-400",
        border: "border-red-500/50",
        icon: Frown,
      };
    } else if (
      lowerState.includes("anxious") ||
      lowerState.includes("stressed")
    ) {
      return {
        bg: "bg-orange-500/20",
        text: "text-orange-400",
        border: "border-orange-500/50",
        icon: AlertCircle,
      };
    }
    return {
      bg: "bg-yellow-500/20",
      text: "text-yellow-400",
      border: "border-yellow-500/50",
      icon: Meh,
    };
  };

  // Get health status styling
  const getHealthStyle = (health) => {
    const lowerHealth = health?.toLowerCase() || "";
    if (lowerHealth === "excellent")
      return { bg: "bg-emerald-500", text: "text-white" };
    if (lowerHealth === "good")
      return { bg: "bg-green-500", text: "text-white" };
    if (lowerHealth === "fair")
      return { bg: "bg-yellow-500", text: "text-black" };
    if (lowerHealth === "poor") return { bg: "bg-red-500", text: "text-white" };
    return { bg: "bg-gray-500", text: "text-white" };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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

  const getSessionDuration = (start, end) => {
    if (!start || !end) return "N/A";
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} min`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[80vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#795EFF] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-300 text-lg">Loading client details...</p>
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
          <p className="text-red-400 text-lg">Failed to load client details</p>
          <p className="text-slate-500 text-sm">{error}</p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => navigate("/expert")}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            <button
              onClick={fetchClientDetails}
              className="px-6 py-2 bg-[#795EFF] hover:bg-[#6a4be8] rounded-lg text-white font-medium flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-[80vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <UserCircle className="w-16 h-16 text-slate-500" />
          <p className="text-slate-400 text-lg">Client not found</p>
          <button
            onClick={() => navigate("/expert")}
            className="mt-4 px-6 py-2 bg-[#795EFF] hover:bg-[#6a4be8] rounded-lg text-white font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const emotionalStyle = getEmotionalStyle(client.emotional_state);
  const healthStyle = getHealthStyle(client.health);
  const EmotionIcon = emotionalStyle.icon;

  return (
    <div className="min-h-[80vh] w-full text-white flex flex-col gap-6">
      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/expert")}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Client Profile</h1>
          <p className="text-slate-400 text-sm">
            View detailed client information
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-[#1e293b] rounded-xl p-6">
            {/* Profile Header */}
            <div className="flex gap-3 items-center text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#795EFF] to-[#5a3fd4] rounded-full flex items-center justify-center text-3xl font-bold shadow-lg uppercase">
                {client.full_name?.charAt(0) || "?"}
              </div>
              <div className="flex flex-col gap-2 items-start">
                <h2 className="text-xl font-bold">{client.full_name}</h2>
                
                <span
                  className={`${healthStyle.bg} ${healthStyle.text} text-sm px-3 py-1 rounded-full font-medium`}
                >
                  {client.health} Health
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 border-t border-slate-700 pt-4">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="text-sm truncate">{client.email}</span>
              </div>
              {client.phone && (
                <div className="flex items-center gap-3 text-slate-300">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">{client.phone}</span>
                </div>
              )}
              {client.location && (
                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">{client.location}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-slate-300">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-sm">
                  Joined {formatDate(client.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-[#1e293b] rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-[#795EFF]" />
              Personal Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-xs mb-1">Age</p>
                <p className="text-lg font-semibold">
                  {client.age || "N/A"} years
                </p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-xs mb-1">Gender</p>
                <p className="text-lg font-semibold capitalize">
                  {client.gender || "N/A"}
                </p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-xs mb-1">Occupation</p>
                <p className="text-lg font-semibold">{client.work || "N/A"}</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-xs mb-1">Relationship</p>
                <p className="text-lg font-semibold capitalize">
                  {client.relationship || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Emotional & Mental State */}
          <div className="bg-[#1e293b] rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#795EFF]" />
              Emotional & Mental State
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Emotional State Card */}
              <div
                className={`${emotionalStyle.bg} ${emotionalStyle.border} border rounded-xl p-5`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <EmotionIcon className={`w-8 h-8 ${emotionalStyle.text}`} />
                  <div>
                    <p className="text-slate-400 text-xs">
                      Current Emotional State
                    </p>
                    <p
                      className={`text-xl font-bold capitalize ${emotionalStyle.text}`}
                    >
                      {client.emotional_state || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Health Status Card */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Activity
                    className={`w-8 h-8 ${
                      healthStyle.bg === "bg-emerald-500" ||
                      healthStyle.bg === "bg-green-500"
                        ? "text-green-400"
                        : healthStyle.bg === "bg-yellow-500"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  />
                  <div>
                    <p className="text-slate-400 text-xs">Overall Health</p>
                    <p className="text-xl font-bold capitalize">
                      {client.health || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {client.notes && (
            <div className="bg-[#1e293b] rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#795EFF]" />
                Notes
              </h3>
              <p className="text-slate-300 leading-relaxed">{client.notes}</p>
            </div>
          )}

          {/* Session History */}
          <div className="bg-[#1e293b] rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#795EFF]" />
              Session History
              <span className="text-sm font-normal text-slate-400 ml-2">
                ({sessions.length} sessions)
              </span>
            </h3>
            
            {sessionsLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-3 border-[#795EFF] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-slate-500">Loading sessions...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No sessions found</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {sessions.map((session, index) => (
                  <div
                    key={session.session_id || index}
                    onClick={() => navigate(`/session/${session.session_id}`)}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#795EFF]/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Activity className="w-5 h-5 text-[#795EFF]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            Session #{sessions.length - index}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {session.session_id?.slice(0, 20)}...
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-slate-400">Duration</p>
                        <p className="text-sm font-semibold text-[#795EFF]">
                          {getSessionDuration(session.session_start, session.last_activity)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-slate-500">Started</p>
                        <p className="text-slate-300">{formatDateTime(session.session_start)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Last Activity</p>
                        <p className="text-slate-300">{formatDateTime(session.last_activity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDetails;
