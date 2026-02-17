// ... imports
import React, { useContext, useState, useEffect, useMemo } from 'react'
import { Database, Home, Upload, Users, LogOut, Shield, UserCircle, Globe, BookOpen, Menu, LayoutList } from "lucide-react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Context } from '../helper/Context';
import { Dropdown } from 'primereact/dropdown';

// Secondary links for Dropdown
const secondaryLinks = [
  { label: 'Expert', icon: Users, path: '/expert', roles: ['super_admin', 'expert'] },
  { label: 'Users', icon: UserCircle, path: '/users', roles: ['super_admin'] },
  { label: 'Admin', icon: Shield, path: '/admin-management', roles: ['super_admin'] },
  { label: 'SEO', icon: Globe, path: '/seo', roles: ['super_admin'] },
  { label: 'Blog', icon: BookOpen, path: '/blog', roles: ['super_admin', 'admin'] },
  { label: 'Category', icon: LayoutList, path: '/category', roles: ['super_admin', 'admin'] }
];

function Header() {
  const { user, logout } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine which navigation items to show based on role
  const canAccessHome = user?.role === 'super_admin' || user?.role === 'admin';
  const canAccessUpload = user?.role === 'super_admin' || user?.role === 'admin';

  // Filter links based on role
  const availableLinks = useMemo(() => {
    return secondaryLinks.filter(link => link.roles.includes(user?.role));
  }, [user?.role]);

  const [selectedLink, setSelectedLink] = useState(null);
  const location = useLocation();

  // Sync Dropdown state with current URL
  useEffect(() => {
    const currentLink = availableLinks.find(link => location.pathname.startsWith(link.path));
    if (currentLink) {
      setSelectedLink(currentLink);
    } else {
      setSelectedLink(null);
    }
  }, [location.pathname, availableLinks]);

  const onLinkChange = (e) => {
    // Navigate to selected path
    navigate(e.value.path);
    // selection is handled by useEffect sync
    setSelectedLink(e.value);
  }

  // Custom option template for Dropdown
  const linkOptionTemplate = (option) => {
    const Icon = option.icon;
    return (
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span>{option.label}</span>
      </div>
    );
  };

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
            Soul Junction Admin Panel
          </Link>
        </h1>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6 text-slate-300">
            {canAccessHome && (
              <Link to="/" className="flex items-center gap-2 hover:text-white">
                <Home className="w-4 h-4" /> Home
              </Link>
            )}
            {canAccessUpload && (
              <Link to="/upload" className="flex items-center gap-2 hover:text-white">
                <Upload className="w-4 h-4" /> Select Files
              </Link>
            )}

            {availableLinks.length > 0 && (
              <div className="w-78">
                <Dropdown
                  value={selectedLink}
                  onChange={onLinkChange}
                  options={availableLinks}
                  optionLabel="label"
                  placeholder="Select Persona"
                  itemTemplate={linkOptionTemplate}
                  valueTemplate={(option, props) => {
                    if (option) return linkOptionTemplate(option);
                    return <span className="text-slate-400 text-sm">{props.placeholder}</span>;
                  }}
                  className="w-full"
                  pt={{
                    root: {
                      className: 'w-full h-9 flex items-center rounded-lg bg-[#1e293b] border border-[#334155] text-white px-2 hover:border-[#64748b] focus-within:ring-2 focus-within:ring-[#795eff] transition-all duration-200'
                    },
                    input: {
                      className: 'w-full bg-transparent border-none focus:ring-0 text-sm text-white placeholder-slate-400 font-sans'
                    },
                    trigger: {
                      className: 'flex items-center justify-center w-8 text-slate-300 hover:text-white'
                    },
                    panel: {
                      className: 'bg-[#1e293b] border border-[#334155] text-white rounded-lg shadow-xl mt-1'
                    },
                    item: {
                      className: 'text-white px-3 py-2 cursor-pointer hover:bg-[#334155] transition-colors text-sm rounded-md mx-1 my-0.5'
                    },
                    header: {
                      className: 'bg-[#1e293b] text-white border-b border-[#334155] px-3 py-2 rounded-t-lg'
                    },
                    list: { className: 'p-1' }
                  }}
                />
              </div>
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