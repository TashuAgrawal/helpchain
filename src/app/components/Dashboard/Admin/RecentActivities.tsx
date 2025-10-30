import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Activity } from 'lucide-react'

interface ActivityItem {
  id: string | number
  description: string
  time: string
}

interface RecentActivitiesProps {
  recentActivities: ActivityItem[]
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ recentActivities }) => {
  return (
    <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Recent Activities</CardTitle>
        <CardDescription className="dark:text-gray-400">Latest platform actions and events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-4 border-b dark:border-gray-700 last:border-b-0 last:pb-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white text-sm">{activity.description}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentActivities
