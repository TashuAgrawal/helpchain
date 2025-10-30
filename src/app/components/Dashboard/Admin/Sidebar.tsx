"use client";
import { Building2, DollarSign, FileText, LayoutDashboard, Users, LogOut } from 'lucide-react'
import React from 'react'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'  // ensure you have Badge component imported

interface SidebarProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
  pendingNGOs?: { length: number };
}





const Sidebar: React.FC<SidebarProps> = ({
  setActiveTab,
  activeTab,
  pendingNGOs = []
}) => {

  const logout=()=>{
    console.log("logout pressed");
  }
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <span className="text-gray-900 dark:text-white">Admin Panel</span>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "dashboard" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            <LayoutDashboard className="w-5 h-5" /> <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("ngos")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "ngos" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            <Building2 className="w-5 h-5" /> <span>Manage NGOs</span>
            {pendingNGOs.length > 0 && (
              <Badge className="ml-auto bg-red-500 dark:bg-red-600">{pendingNGOs.length}</Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "users" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            <Users className="w-5 h-5" /> <span>Manage Users</span>
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "transactions" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            <DollarSign className="w-5 h-5" /> <span>Transactions</span>
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "reports" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            <FileText className="w-5 h-5" /> <span>Reports</span>
          </button>
        </nav>
      </div>
      <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          onClick={() => logout()}
        >
          <LogOut className="w-5 h-5" /> <span>Logout</span>
        </Button>
      </div>
    </aside>
  )
}

export default Sidebar
