"use client";
import { AlertTriangle, Building2, DollarSign, FileText, LayoutDashboard, Users, LogOut, Zap } from 'lucide-react';
import React from 'react';
import { Badge } from '../../ui/badge';

interface SidebarProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
  pendingNGOs?: { length: number };
  pendingStrikes?: number;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'ngos',      label: 'Manage NGOs',  icon: Building2 },
  { id: 'users',     label: 'Manage Users', icon: Users },
  { id: 'transactions', label: 'Transactions', icon: DollarSign },
  { id: 'reports',   label: 'Reports',      icon: FileText },
  { id: 'strikes',   label: 'Strikes',      icon: AlertTriangle },
];

const Sidebar: React.FC<SidebarProps> = ({ setActiveTab, activeTab, pendingNGOs = [], pendingStrikes = 0 }) => {
  const getBadge = (id: string) => {
    if (id === 'ngos' && pendingNGOs.length > 0)
      return <Badge className="ml-auto bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs">{pendingNGOs.length}</Badge>;
    if (id === 'strikes' && pendingStrikes > 0)
      return <Badge className="ml-auto bg-red-500/20 text-red-300 border border-red-500/30 text-xs">{pendingStrikes}</Badge>;
    return null;
  };

  return (
    <aside className="w-64 bg-[#161b27] border-r border-white/[0.06] fixed h-full flex flex-col z-10">
      {/* Logo */}
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-sm tracking-wide">HelpChain</span>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
              <span>{label}</span>
              {getBadge(id)}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.06]">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
