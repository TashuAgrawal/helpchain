import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Star } from 'lucide-react'

interface ActiveNGO {
  id: string | number
  name: string
  donationsReceived: number
}

interface LeaderboardProps {
  activeNGOs: ActiveNGO[]
}

const Leaderboard: React.FC<LeaderboardProps> = ({ activeNGOs }) => {
  return (
    <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Top NGOs</CardTitle>
        <CardDescription className="dark:text-gray-400">Most trusted NGOs this month</CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          {activeNGOs.slice(0, 3).map((ngo, idx) => (
            <li key={ngo.id} className="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-200 mb-2">
              <Star className="w-4 h-4 text-yellow-400 dark:text-yellow-500" />
              {idx + 1}. {ngo.name} - ${ngo.donationsReceived.toLocaleString()}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default Leaderboard
