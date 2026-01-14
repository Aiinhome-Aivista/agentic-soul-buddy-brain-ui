import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Users,
  Shield,
  Mail,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  User,
  Trash2,
  X,
} from "lucide-react";
import { apiService } from "../../service/ApiService";
import { GET_url, POST_url } from "../../connection/connection";

function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin",
    full_name: "",
  });

  // Fetch all admins/experts
  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService({
        url: GET_url.adminsList,
        method: "GET",
      });

      if (data.error) {
        throw new Error(data.message || "Failed to fetch admins");
      }

      setAdmins(data.data || []);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError(err.message);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const response = await apiService({
        url: POST_url.adminRegistration,
        method: "POST",
        data: formData,
      });

      if (response.status === "success") {
        setSubmitSuccess(true);
        setFormData({
          username: "",
          email: "",
          password: "",
          role: "admin",
          full_name: "",
        });
        fetchAdmins(); // Refresh the list
        setTimeout(() => {
          setShowModal(false);
          setSubmitSuccess(false);
        }, 2000);
      } else {
        setSubmitError(response.message || "Failed to create account");
      }
    } catch (err) {
      setSubmitError("An error occurred. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadge = (role) => {
    if (role === "super_admin") {
      return (
        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full font-medium">
          Super Admin
        </span>
      );
    } else if (role === "admin") {
      return (
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium">
          Admin
        </span>
      );
    } else if (role === "expert") {
      return (
        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
          Expert
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full font-medium">
        {role}
      </span>
    );
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-[80vh] w-full text-white flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-7 h-7 text-[#795EFF]" />
            Admin Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage admins and experts
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchAdmins}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-medium flex items-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#795EFF] hover:bg-[#6a4be8] rounded-lg text-white font-medium flex items-center gap-2 transition"
          >
            <UserPlus className="w-4 h-4" />
            Add New
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1e293b] rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold">{admins.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1e293b] rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Admins</p>
              <p className="text-2xl font-bold">
                {admins.filter((a) => a.role === "admin").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#1e293b] rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Experts</p>
              <p className="text-2xl font-bold">
                {admins.filter((a) => a.role === "expert").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-[#1e293b] rounded-xl p-6 flex-1">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#795EFF]" />
          All Users
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-[#795EFF] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400">Loading users...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchAdmins}
              className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
            >
              Try Again
            </button>
          </div>
        ) : admins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="w-12 h-12 text-slate-500 mb-3 opacity-50" />
            <p className="text-slate-400">No users found</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-4 py-2 bg-[#795EFF] hover:bg-[#6a4be8] rounded-lg text-sm"
            >
              Add First User
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">
                    Username
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, index) => (
                  <tr
                    key={admin.id || index}
                    className="border-b border-slate-700/50 hover:bg-slate-800/50 transition"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {getInitials(admin.full_name)}
                        </div>
                        <span className="font-medium">{admin.full_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{admin.email}</td>
                    <td className="py-4 px-4 text-slate-400">
                      @{admin.username}
                    </td>
                    <td className="py-4 px-4">{getRoleBadge(admin.role)}</td>
                    <td className="py-4 px-4 text-slate-400 text-sm">
                      {admin.created_at
                        ? new Date(admin.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] rounded-2xl w-full max-w-md shadow-2xl border border-slate-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#795EFF]" />
                Add New User
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSubmitError("");
                  setSubmitSuccess(false);
                }}
                className="p-2 hover:bg-slate-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Dr. John Doe"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#795EFF] focus:border-transparent transition"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="johndoe"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#795EFF] focus:border-transparent transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#795EFF] focus:border-transparent transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#795EFF] focus:border-transparent transition pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#795EFF] focus:border-transparent transition"
                >
                  <option value="admin">Admin</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                  <p className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {submitError}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {submitSuccess && (
                <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm">
                  <p className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    User created successfully!
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#795EFF] hover:bg-[#6a4be8] disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition mt-6"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create User
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManagement;
