// src/app/components/user-dashboard/tabs/CommunityTab.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
// import { DialogTrigger } from "../../../ui/dialog"; // <-- REMOVED THIS LINE
import { Plus, AlertCircle, TrendingUp, MessageCircle } from "lucide-react";
import { CommunityProblem } from '../types';

interface CommunityTabProps {
  communityProblems: CommunityProblem[];
  setIsProblemDialogOpen: (open: boolean) => void;
  handleVoteProblem: (id: string) => void;
}

export function CommunityTab({
  communityProblems, setIsProblemDialogOpen, handleVoteProblem
}: CommunityTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white mb-2">Community Problems</h1>
          <p className="text-gray-600 dark:text-gray-300">Post problems and connect with NGOs who can help</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg gap-2"
          onClick={() => setIsProblemDialogOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Post Problem
        </Button>
      </div>

      {/* Community Problems List */}
      <div className="space-y-4">
        {communityProblems.map((problem) => (
          <Card key={problem.id} className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <CardTitle className="dark:text-white">{problem.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">{problem.category}</Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{problem.location}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Posted by {problem.postedBy}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{problem.date}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 ${problem.userVoted ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                  onClick={() => handleVoteProblem(problem.id)}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{problem.upvotes}</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{problem.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{problem.responses} NGO responses</span>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg dark:border-gray-600 dark:hover:bg-gray-700">
                  View Responses
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}