import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Check, Eye, X } from 'lucide-react'
import { log } from 'console'

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

interface PendingApprovalsProps {
  pendingNGOs: PendingNGO[]
  setIsViewDialogOpen: (open: boolean) => void
  setSelectedNGO: React.Dispatch<React.SetStateAction<PendingNGO | ActiveNGO | null>>
}

const PendingApprovals: React.FC<PendingApprovalsProps> = ({ pendingNGOs, setIsViewDialogOpen, setSelectedNGO }) => {

  const handleApproveNGO = () => {
    console.log("Ngo Approved");
  }

  const handleRejectNGO = () => {
    console.log("Ngo Rejected");
  }

  return (
    <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Pending Approvals</CardTitle>
        <CardDescription className="dark:text-gray-400">NGOs awaiting full verification</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="dark:text-gray-300">NGO Name</TableHead>
              <TableHead className="dark:text-gray-300">Cause</TableHead>
              <TableHead className="dark:text-gray-300">Email</TableHead>
              <TableHead className="dark:text-gray-300">Submitted</TableHead>
              <TableHead className="dark:text-gray-300">Status</TableHead>
              <TableHead className="text-right dark:text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingNGOs.map((ngo) => (
              <TableRow key={ngo.id}>
                <TableCell className="dark:text-gray-200">{ngo.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">{ngo.cause}</Badge>
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">{ngo.email}</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">{ngo.submittedDate}</TableCell>
                <TableCell className="dark:text-gray-300">{ngo.progress}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
                      onClick={() => {
                        setSelectedNGO(ngo);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />View
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 gap-1 rounded-lg"
                      onClick={() => handleApproveNGO()}
                    >
                      <Check className="w-4 h-4" />Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 rounded-lg text-red-600 border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                      onClick={() => handleRejectNGO()}
                    >
                      <X className="w-4 h-4" />Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {pendingNGOs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No pending NGO approvals
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default PendingApprovals
