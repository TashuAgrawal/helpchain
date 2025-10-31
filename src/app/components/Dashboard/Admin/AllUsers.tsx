import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Eye } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';

interface User {
  id: number;
  name: string;
  email: string;
  totalDonations: number;
  donationCount: number;
  joinedDate: string;
  status: string;
  badge: string;
}

interface AllUsersProps {
  users: User[]
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>
  setIsUserDialogOpen: (open: boolean) => void
}

const AllUsers: React.FC<AllUsersProps> =  ({users , setSelectedUser , setIsUserDialogOpen}) => {
    return (
        <div>
            <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800 transition-colors duration-300">
                <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">All Users</CardTitle>
                    <CardDescription className="dark:text-gray-400">Platform users with donation history</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="dark:text-gray-300">Name</TableHead>
                                <TableHead className="dark:text-gray-300">Email</TableHead>
                                <TableHead className="dark:text-gray-300">Total Donated</TableHead>
                                <TableHead className="dark:text-gray-300">Donations</TableHead>
                                <TableHead className="dark:text-gray-300">Badge</TableHead>
                                <TableHead className="dark:text-gray-300">Status</TableHead>
                                <TableHead className="text-right dark:text-gray-300">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="dark:text-gray-200">{user.name}</TableCell>
                                    <TableCell className="text-gray-600 dark:text-gray-400">{user.email}</TableCell>
                                    <TableCell className="text-teal-600 dark:text-teal-400">${user.totalDonations.toLocaleString()}</TableCell>
                                    <TableCell className="dark:text-gray-300">{user.donationCount}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">{user.badge}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={user.status === "active"
                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}
                                        >
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="gap-1 rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsUserDialogOpen(true);
                                                }}
                                            >
                                                <Eye className="w-4 h-4" />View
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

export default AllUsers
