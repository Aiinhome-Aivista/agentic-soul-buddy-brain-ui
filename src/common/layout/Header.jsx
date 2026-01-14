import React, { useContext } from 'react'
import { Database, Home, Upload, Users, LogOut } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../helper/Context';

function Header() {
  const { user, logout } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine which navigation items to show based on role
  const canAccessHome = user?.role === 'super_admin';
  const canAccessUpload = user?.role === 'super_admin' || user?.role === 'admin';
  const canAccessExpert = user?.role === 'super_admin' || user?.role === 'expert';

  // Get initials from full name
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div>
      <header className="flex justify-between items-start pb-10 w-full">
        <h1 className="flex items-center gap-2 text-lg font-semibold">
          <Database className="w-6 h-6" />
          <Link to="/" className="flex items-center gap-2 hover:text-white">
            Data Analysis Tool
          </Link>
        </h1>
        <div className="flex items-center gap-6">
          <nav className="flex gap-6 text-slate-300">
            {canAccessHome && (
              <Link to="/" className="flex items-center gap-2 hover:text-white">
                <Home className="w-4 h-4" /> Home
              </Link>
            )}
            {canAccessUpload && (
              <Link to="/upload" className="flex items-center gap-2 hover:text-white">
                <Upload className="w-4 h-4" /> Upload Files
              </Link>
            )}
            {canAccessExpert && (
              <Link to="/expert" className="flex items-center gap-2 hover:text-white">
                <Users className="w-4 h-4" /> Expert
              </Link>
            )}
          </nav>
          {user && (
            <div className="flex items-center gap-3 pl-6 border-l border-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  {getInitials(user.full_name)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    {user.full_name}
                  </span>
                  <span className="text-xs text-slate-400 capitalize">
                    {user.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  )
}

export default Header