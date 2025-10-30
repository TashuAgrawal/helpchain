import React from 'react'
import { Card, CardContent } from '../../ui/card'
import { Activity, Building2, DollarSign, Users } from 'lucide-react'

interface StatCardsProps {
  totalDonations: number;
  totalActiveNGOs: number;
  totalUsers: number;
  pendingNGOs: number; // or define a stricter type if available
}

const StatCards: React.FC<StatCardsProps> = ({
  totalDonations,
  totalActiveNGOs,
  totalUsers,
  pendingNGOs
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Donations Card */}
      <Card className="rounded-xl border-none shadow-sm bg-gradient-to-br from-blue-500 to-blue-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-blue-100 text-sm">Total Donations</p>
              <h3 className="mt-1">${totalDonations.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Active NGOs Card */}
      <Card className="rounded-xl border-none shadow-sm bg-gradient-to-br from-teal-500 to-teal-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-teal-100 text-sm">Active NGOs</p>
              <h3 className="mt-1">{totalActiveNGOs}</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Users Card */}
      <Card className="rounded-xl border-none shadow-sm bg-gradient-to-br from-purple-500 to-purple-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-purple-100 text-sm">Total Users</p>
              <h3 className="mt-1">{totalUsers}</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Approvals Card */}
      <Card className="rounded-xl border-none shadow-sm bg-gradient-to-br from-orange-500 to-orange-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-orange-100 text-sm">Pending Approvals</p>
              <h3 className="mt-1">{pendingNGOs}</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatCards
