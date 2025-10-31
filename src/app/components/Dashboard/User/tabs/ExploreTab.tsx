// src/app/components/user-dashboard/tabs/ExploreTab.tsx
import React from 'react';
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Separator } from "../../../ui/separator";
import { BarChart3, Search, Filter, TrendingUp, BookmarkCheck } from "lucide-react";
import { NGO } from '../types';
import { NGOCard } from '../NgoCard';

interface ExploreTabProps {
  sortedNGOs: NGO[];
  favoriteNGOs: NGO[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  compareNGOs: NGO[];
  setIsCompareDialogOpen: (open: boolean) => void;
  onDonate: (ngo: NGO) => void;
  onToggleFavorite: (id: number) => void;
  onAddToCompare: (ngo: NGO) => void;
}

export function ExploreTab({
  sortedNGOs, favoriteNGOs,
  searchQuery, setSearchQuery,
  categoryFilter, setCategoryFilter,
  sortBy, setSortBy,
  compareNGOs, setIsCompareDialogOpen,
  onDonate, onToggleFavorite, onAddToCompare
}: ExploreTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white mb-2">Explore NGOs</h1>
          <p className="text-gray-600 dark:text-gray-300">Discover verified NGOs and make a transparent donation</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
            onClick={() => setIsCompareDialogOpen(true)}
            disabled={compareNGOs.length === 0}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Compare ({compareNGOs.length})
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input 
            placeholder="Search NGOs..." 
            className="pl-10 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="Water & Sanitation">Water & Sanitation</SelectItem>
            <SelectItem value="Environment">Environment</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
            <TrendingUp className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="transparency">Transparency Score</SelectItem>
            <SelectItem value="raised">Funds Raised</SelectItem>
            <SelectItem value="donors">Most Donors</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Favorites Section */}
      {favoriteNGOs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Your Favorites
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteNGOs.map((ngo) => (
              <NGOCard
                key={ngo.id} 
                ngo={ngo} 
                onDonate={onDonate}
                onToggleFavorite={onToggleFavorite}
                onAddToCompare={onAddToCompare}
                isInCompare={compareNGOs.some(n => n.id === ngo.id)}
              />
            ))}
          </div>
          <Separator className="my-6 dark:bg-gray-700" />
        </div>
      )}

      {/* All NGOs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedNGOs.map((ngo) => (
          <NGOCard 
            key={ngo.id} 
            ngo={ngo} 
            onDonate={onDonate}
            onToggleFavorite={onToggleFavorite}
            onAddToCompare={onAddToCompare}
            isInCompare={compareNGOs.some(n => n.id === ngo.id)}
          />
        ))}
      </div>
    </div>
  );
}