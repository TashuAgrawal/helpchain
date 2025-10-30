import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'

interface NGOUpdate {
  usage: string
  date: string
}

interface ActiveNGO {
  id: string | number
  name: string
  updates: NGOUpdate[]
}

interface DonationImpactProps {
  activeNGOs: ActiveNGO[]
}

const DonationImpact: React.FC<DonationImpactProps> = ({ activeNGOs }) => {
  return (
    <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Donation Impact</CardTitle>
        <CardDescription className="dark:text-gray-400">Latest donation utilization by NGOs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeNGOs.slice(0, 3).map((ngo) => (
            <div key={ngo.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              <p className="font-medium dark:text-white">{ngo.name}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{ngo.updates[0]?.usage || 'No updates yet'}</p>
              <span className="text-xs text-green-600 dark:text-green-400">
                {ngo.updates[0] ? `Update posted: ${ngo.updates[0]?.date}` : 'Awaiting update'}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default DonationImpact
