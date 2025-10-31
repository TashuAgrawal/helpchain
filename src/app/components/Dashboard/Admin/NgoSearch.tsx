import { Filter, Search } from 'lucide-react'
import React from 'react'
import { Input } from '../../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'

interface NgoSearchProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  filterCategory: string
  setFilterCategory: (value: string) => void
}

const NgoSearch: React.FC<NgoSearchProps> = ({
  searchQuery,
  setSearchQuery,
  filterCategory,
  setFilterCategory,
}) => {
  return (
    <div>
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by donor or NGO..."
            className="pl-10 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Health">Health</SelectItem>
            <SelectItem value="Water Access">Water Access</SelectItem>
            <SelectItem value="Environment">Environment</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default NgoSearch;
