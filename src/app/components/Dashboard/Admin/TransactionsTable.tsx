import React from 'react'
import { Card, CardContent } from '../../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table'
import { Badge } from '../../ui/badge'

interface Transaction {
  id: string | number
  donor: string
  ngo: string
  amount: number
  date: string
  status: string
  utilization: string
}

interface TransactionsTableProps {
  filteredTransactions: Transaction[]
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ filteredTransactions }) => {
  return (
    <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800 transition-colors duration-300">
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="dark:text-gray-300">Donor</TableHead>
              <TableHead className="dark:text-gray-300">NGO</TableHead>
              <TableHead className="dark:text-gray-300">Amount</TableHead>
              <TableHead className="dark:text-gray-300">Date</TableHead>
              <TableHead className="dark:text-gray-300">Status</TableHead>
              <TableHead className="dark:text-gray-300">Utilization</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell className="dark:text-gray-200">{transaction.donor}</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">{transaction.ngo}</TableCell>
                <TableCell className="text-teal-600 dark:text-teal-400">${transaction.amount}</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">{transaction.date}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">{transaction.utilization}</TableCell>
              </TableRow>
            ))}
            {filteredTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default TransactionsTable
