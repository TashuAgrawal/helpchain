import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Edit } from 'lucide-react';



interface PendingNGO {
  id: number;
  name: string;
  cause: string;
  submittedDate: string;
  email: string;
  progress: string;
  totalDonations: number;
  description: string;
  registrationNumber: string;
  address: string;
}

interface ActiveNGO {
  id: number;
  name: string;
  cause: string;
  donationsReceived: number;
  updates: { usage: string; date: string }[];
  email: string;
  status: string;
}

interface ActiveNgosProps {
  activeNGOs: ActiveNGO[]
  setIsEditDialogOpen: (open: boolean) => void
  setSelectedNGO: React.Dispatch<React.SetStateAction<PendingNGO | ActiveNGO | null>>
}

const ActiveNgos: React.FC<ActiveNgosProps> =  ({activeNGOs , setSelectedNGO , setIsEditDialogOpen}) => {
    return (
        <div className="mt-8">
            <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800 transition-colors duration-300">
                <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Active NGOs</CardTitle>
                    <CardDescription className="dark:text-gray-400">Track donation utilization and NGO activities</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="dark:text-gray-300">NGO Name</TableHead>
                                <TableHead className="dark:text-gray-300">Cause</TableHead>
                                <TableHead className="dark:text-gray-300">Total Donations</TableHead>
                                <TableHead className="dark:text-gray-300">Status</TableHead>
                                <TableHead className="text-right dark:text-gray-300">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activeNGOs.map((ngo) => (
                                <TableRow key={ngo.id}>
                                    <TableCell className="dark:text-gray-200">{ngo.name}</TableCell>
                                    <TableCell className="dark:text-gray-300">{ngo.cause}</TableCell>
                                    <TableCell className="dark:text-gray-300">${ngo.donationsReceived.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={ngo.status === "approved"
                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}
                                        >
                                            {ngo.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="gap-1 rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
                                                onClick={() => {
                                                    setSelectedNGO(ngo);
                                                    setIsEditDialogOpen(true);
                                                }}
                                            >
                                                <Edit className="w-4 h-4" />Manage
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default ActiveNgos
