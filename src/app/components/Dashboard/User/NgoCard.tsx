// src/app/components/user-dashboard/NGOCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Progress } from "../../ui/progress";
import { Star, Bookmark, BookmarkCheck, FileText, Heart, BarChart3 } from "lucide-react";
import { NGO } from './types';

interface NGOCardProps {
  ngo: NGO; 
  onDonate: (ngo: NGO) => void; 
  onToggleFavorite: (id: number) => void;
  onAddToCompare: (ngo: NGO) => void;
  isInCompare: boolean;
}

export function NGOCard({ 
  ngo, 
  onDonate, 
  onToggleFavorite, 
  onAddToCompare,
  isInCompare 
}: NGOCardProps) {
  const progress = (ngo.raised / ngo.goal) * 100;
  
  return (
    <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-800">
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl overflow-hidden">
        {/* <ImageWithFallback 
          src={ngo.image} 
          alt={ngo.name} 
          className="w-full h-full object-cover"
        /> */}
        <div className="absolute top-3 right-3 flex gap-2">
          {ngo.verified && (
            <Badge className="bg-blue-600 text-white">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Verified
            </Badge>
          )}
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full h-8 w-8 p-0"
            onClick={() => onToggleFavorite(ngo.id)}
          >
            {ngo.isFavorite ? (
              <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <Bookmark className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </Button>
        </div>
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-gray-900 dark:text-white mb-2">{ngo.name}</CardTitle>
            <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300 mb-2">{ngo.cause}</Badge>
            <p className="text-sm text-gray-600 dark:text-gray-400">{ngo.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-300">Progress</span>
            <span className="text-gray-900 dark:text-white">
              ${ngo.raised.toLocaleString()} / ${ngo.goal.toLocaleString()}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">{ngo.donors} donors</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-gray-900 dark:text-white">{ngo.transparencyScore}/100</span>
          </div>
        </div>
        <div className="text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
          <p className="text-green-700 dark:text-green-400">
            <FileText className="w-3 h-3 inline mr-1" />
            {ngo.lastUpdate}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
            onClick={() => onDonate(ngo)}
          >
            <Heart className="w-4 h-4 mr-2" />
            Donate
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`rounded-lg ${isInCompare ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600 dark:border-blue-400' : 'dark:border-gray-600 dark:hover:bg-gray-700'}`}
            onClick={() => onAddToCompare(ngo)}
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}