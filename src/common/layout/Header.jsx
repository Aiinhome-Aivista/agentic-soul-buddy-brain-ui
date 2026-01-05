import React from 'react'
import { Database, Home, Upload, Users } from "lucide-react";
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div>
      <header className="flex justify-between items-start pb-10 w-full">
        <h1 className="flex items-center gap-2 text-lg font-semibold">
          <Database className="w-6 h-6" />
          <Link to="/" className="flex items-center gap-2 hover:text-white">
            Data Analysis Tool
          </Link>
        </h1>
        <nav className="flex gap-6 text-slate-300">
          <Link to="/" className="flex items-center gap-2 hover:text-white">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link to="/upload" className="flex items-center gap-2 hover:text-white">
            <Upload className="w-4 h-4" /> Upload Files
          </Link>
          <Link to="/expert" className="flex items-center gap-2 hover:text-white">
            <Users className="w-4 h-4" /> Expert
          </Link>
        </nav>
      </header>
    </div>
  )
}

export default Header