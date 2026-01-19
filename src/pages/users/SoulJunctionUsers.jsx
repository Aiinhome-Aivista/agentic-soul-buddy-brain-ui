import React, { useState, useEffect } from 'react';
import {
    Users, Search, RefreshCw, AlertCircle, Calendar,
    Crown, Clock, ChevronRight, User
} from 'lucide-react';
import { apiService } from '../../service/ApiService';
import { GET_url } from '../../connection/connection';

function SoulJunctionUsers() {
    const [searchTerm, setSearchTerm] = useState('');
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
                url: GET_url.users,
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

    // Filter users by search term
    const filteredUsers = users.filter(user => {
        return user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Get plan color styling
    const getPlanStyle = (planName) => {
        const lowerPlan = planName?.toLowerCase() || '';
        if (lowerPlan.includes('gold')) {
            return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50', icon: '🥇' };
        } else if (lowerPlan.includes('silver')) {
            return { bg: 'bg-slate-400/20', text: 'text-slate-300', border: 'border-slate-400/50', icon: '🥈' };
        } else if (lowerPlan.includes('bronze')) {
            return { bg: 'bg-orange-600/20', text: 'text-orange-400', border: 'border-orange-600/50', icon: '🥉' };
        } else if (lowerPlan.includes('platinum')) {
            return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/50', icon: '💎' };
        }
        return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50', icon: '⭐' };
    };

    // Get remaining days styling
    const getRemainingDaysStyle = (days) => {
        if (days <= 5) return 'text-red-400 bg-red-500/20';
        if (days <= 7) return 'text-orange-400 bg-orange-500/20';
        return 'text-green-400 bg-green-500/20';
    };

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
                    <p className="text-slate-300 text-lg">Loading users...</p>
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
                    <p className="text-red-400 text-lg">Failed to load users</p>
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
                            <Users className="w-8 h-8" />
                            Soul Junction Users
                        </h2>
                        <p className="text-[#e2e8f0] text-sm">
                            View all registered users and their subscription details
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
                            <p className="text-sm text-[#e2e8f0]">Total Users</p>
                            <p className="text-2xl font-bold">{totalCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex flex-wrap gap-4 items-center bg-[#1e293b] p-4 rounded-xl">
                <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#795EFF] focus:border-transparent"
                    />
                </div>
                <div className="text-sm text-slate-400">
                    Showing {filteredUsers.length} of {totalCount} users
                </div>
            </div>

            {/* User Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto overflow-x-hidden max-h-[60vh] pr-2">
                {filteredUsers.map((user) => {
                    const planStyle = getPlanStyle(user.subscription?.plan_name);

                    return (
                        <div
                            key={user.user_id}
                            className="bg-[#1e293b] rounded-xl hover:bg-[#253347] transition-all group"
                        >
                            <div className="p-4">
                                {/* User Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#795EFF] to-[#5a3fd4] rounded-full flex items-center justify-center text-lg font-bold shadow-lg flex-shrink-0 uppercase">
                                            {user.full_name?.charAt(0) || '?'}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-base font-semibold truncate">
                                                {user.full_name?.split(' ')[0]}
                                            </h3>
                                            {/* <p className="text-slate-400 text-xs truncate">
                                                {user.user_id?.slice(0, 8)}...
                                            </p> */}
                                        </div>
                                    </div>
                                </div>

                                {/* Subscription Plan Badge */}
                                {user.subscription && (
                                    <>
                                        <div className={`${planStyle.bg} ${planStyle.border} border rounded-lg p-3 mb-3`}>
                                            <div className="flex items-center gap-2">
                                                <Crown className={`w-5 h-5 ${planStyle.text}`} />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[10px] text-slate-400">Subscription Plan</p>
                                                    <p className={`text-sm font-semibold ${planStyle.text}`}>
                                                        {planStyle.icon} {user.subscription.plan_name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subscription Details */}
                                        <div className="space-y-2 text-xs">
                                            <div className="flex items-center justify-between text-slate-300">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                                    Start Date
                                                </span>
                                                <span className="font-medium">{formatDate(user.subscription.start_date)}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-slate-300">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                                    End Date
                                                </span>
                                                <span className="font-medium">{formatDate(user.subscription.end_date)}</span>
                                            </div>
                                        </div>

                                        {/* Remaining Days */}
                                        <div className={`mt-3 p-2 rounded-lg ${getRemainingDaysStyle(user.subscription.remaining_days)} text-center`}>
                                            <div className="flex items-center justify-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span className="font-semibold">
                                                    {user.subscription.remaining_days} days remaining
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {!user.subscription && (
                                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-center">
                                        <p className="text-slate-400 text-sm">No active subscription</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <Users className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm">Try adjusting your search criteria</p>
                </div>
            )}
        </div>
    );
}

export default SoulJunctionUsers;
