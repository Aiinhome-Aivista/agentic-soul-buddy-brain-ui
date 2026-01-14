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
            <div className="flex items-center gap-4 pl-6 border-l border-slate-600">
              <span className="text-sm text-slate-400">
                {user.full_name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-300 hover:text-red-400 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  )
}

export default Header