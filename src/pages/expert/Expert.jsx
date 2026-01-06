import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Heart, Brain, Activity, Search, Filter, 
  Mail, Calendar, Briefcase, UserCircle, AlertCircle,
  CheckCircle, Clock, ChevronRight, Smile, Frown, Meh, RefreshCw
} from 'lucide-react';
import { expertBaseUrl } from '../../env/env';
import { apiService } from '../../service/ApiService';

function Expert() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService({
        url: `${expertBaseUrl}users`,
        method: 'GET'
      });
      
      if (data.error) {
        throw new Error(data.message || 'Failed to fetch users');
      }
      
      setUsers(data.data || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Get emotional state styling
  const getEmotionalStyle = (state) => {
    const lowerState = state?.toLowerCase() || '';
    if (lowerState.includes('happy') && !lowerState.includes('not')) {
      return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50', icon: Smile };
    } else if (lowerState.includes('not happy') || lowerState.includes('sad')) {
      return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50', icon: Frown };
    } else if (lowerState.includes('anxious') || lowerState.includes('stressed')) {
      return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/50', icon: AlertCircle };
    }
    return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50', icon: Meh };
  };

  // Get health status styling
  const getHealthStyle = (health) => {
    const lowerHealth = health?.toLowerCase() || '';
    if (lowerHealth === 'excellent') return { bg: 'bg-emerald-500', text: 'text-white' };
    if (lowerHealth === 'good') return { bg: 'bg-green-500', text: 'text-white' };
    if (lowerHealth === 'fair') return { bg: 'bg-yellow-500', text: 'text-black' };
    if (lowerHealth === 'poor') return { bg: 'bg-red-500', text: 'text-white' };
    return { bg: 'bg-gray-500', text: 'text-white' };
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                          (filterStatus === 'needs-attention' && 
                           (user.emotional_state?.toLowerCase().includes('not') || 
                            user.health?.toLowerCase() === 'poor'));
    return matchesSearch && matchesFilter;
  });

  // Stats calculation
  const needsAttention = users.filter(u => 
    u.emotional_state?.toLowerCase().includes('not') || u.health?.toLowerCase() === 'poor'
  ).length;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[80vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#795EFF] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-300 text-lg">Loading clients...</p>
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
          <p className="text-red-400 text-lg">Failed to load clients</p>
          <p className="text-slate-500 text-sm">{error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-4 px-6 py-2 bg-[#795EFF] hover:bg-[#6a4be8] rounded-lg text-white font-medium flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] w-full text-white flex flex-col gap-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#795EFF] to-[#5a3fd4] p-6 shadow-lg rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <Brain className="w-8 h-8" />
              Counselor Dashboard
            </h2>
            <p className="text-[#e2e8f0] text-sm">
              Monitor and support your clients' mental wellness journey
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchUsers}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <div className="text-right">
              <p className="text-sm text-[#e2e8f0]">Today</p>
              <p className="text-lg font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Clients</p>
              <p className="text-3xl font-bold mt-1">{totalCount}</p>
            </div>
            <Users className="w-12 h-12 text-blue-300 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Needs Attention</p>
              <p className="text-3xl font-bold mt-1">{needsAttention}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-300 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Stable Clients</p>
              <p className="text-3xl font-bold mt-1">{users.length - needsAttention}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-300 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Sessions Today</p>
              <p className="text-3xl font-bold mt-1">3</p>
            </div>
            <Clock className="w-12 h-12 text-purple-300 opacity-80" />
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-[#1e293b] p-4 rounded-xl">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search clients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#795EFF] focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              filterStatus === 'all' 
                ? 'bg-[#795EFF] text-white' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Clients
          </button>
          <button
            onClick={() => setFilterStatus('needs-attention')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
              filterStatus === 'needs-attention' 
                ? 'bg-red-500 text-white' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            Needs Attention
          </button>
        </div>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto overflow-x-hidden max-h-[60vh] pr-2">
        {filteredUsers.map((user) => {
          const emotionalStyle = getEmotionalStyle(user.emotional_state);
          const healthStyle = getHealthStyle(user.health);
          const EmotionIcon = emotionalStyle.icon;

          return (
            <div 
              key={user.user_id} 
              onClick={() => navigate(`/expert/client/${user.user_id}`)}
              className={`bg-[#1e293b] rounded-xl  hover:bg-[#253347] transition-all cursor-pointer group`}
            >
              <div className="p-4">
                {/* User Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#795EFF] to-[#5a3fd4] rounded-full flex items-center justify-center text-sm font-bold shadow-lg flex-shrink-0 uppercase">
                      {user.full_name?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold flex items-center gap-1 truncate">
                        {user.full_name}
                        <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-[#795EFF] group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </h3>
                      <p className="text-slate-400 text-xs flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 flex-shrink-0" /> 
                        <span className="truncate">{user.email}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Health Badge */}
                <div className="mb-3">
                  <span className={`${healthStyle.bg} ${healthStyle.text} text-xs px-2 py-0.5 rounded-full font-medium`}>
                    {user.health}
                  </span>
                </div>

                {/* Emotional State Banner */}
                <div className={`${emotionalStyle.bg} ${emotionalStyle.border} border rounded-lg p-2 mb-3`}>
                  <div className="flex items-center gap-2">
                    <EmotionIcon className={`w-5 h-5 ${emotionalStyle.text} flex-shrink-0`} />
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400">Emotional State</p>
                      <p className={`text-sm font-semibold capitalize ${emotionalStyle.text} truncate`}>{user.emotional_state}</p>
                    </div>
                  </div>
                </div>

                {/* User Details Grid */}
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <UserCircle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{user.age} yrs • {user.gender}</span>
                  </div>
                  {/* <div className="flex items-center gap-2 text-slate-300">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{user.work}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Heart className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{user.relationship}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">Since {formatDate(user.created_at)}</span>
                  </div> */}
                </div>
              </div>

              {/* Card Footer */}
              <div className="border-t border-slate-700 px-4 py-2 flex justify-between items-center bg-slate-800/30 rounded-b-xl">
                <p className="text-[10px] text-slate-500 truncate">
                  Updated: {formatDate(user.updated_at)}
                </p>
                <button 
                  onClick={() => navigate(`/expert/client/${user.user_id}`)}
                  className="text-[#795EFF] hover:text-[#9d85ff] text-xs font-medium flex items-center gap-0.5 transition-colors flex-shrink-0"
                >
                  View <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Users className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">No clients found</p>
          <p className="text-sm">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}

export default Expert;
