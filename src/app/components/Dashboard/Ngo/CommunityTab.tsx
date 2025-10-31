// src/app/components/ngo-dashboard/CommunityTab.tsx

import React from 'react';
import { AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card"; 
import { Button } from "../../ui/button"; 
import { Badge } from "../../ui/badge"; 
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog"; 
import { Input } from "../../ui/input"; 
import { Label } from "../../ui/label"; 
import { Textarea } from "../../ui/textarea"; 
import { CommunityProblem } from './types';

interface CommunityTabProps {
  communityProblems: CommunityProblem[];
  isResponseDialogOpen: boolean;
  setIsResponseDialogOpen: (open: boolean) => void;
  selectedProblem: number | null;
  setSelectedProblem: (id: number | null) => void;
  handleRespondToProblem: (id: number) => void;
}

export function CommunityTab({
  communityProblems,
  isResponseDialogOpen, setIsResponseDialogOpen,
  selectedProblem, setSelectedProblem,
  handleRespondToProblem
}: CommunityTabProps) {

  return (
    <>
      <div className="mb-6">
        <h1 className="text-gray-900 dark:text-white mb-2">Community Problems</h1>
        <p className="text-gray-600 dark:text-gray-300">Browse problems and provide solutions</p>
      </div>

      <div className="space-y-4">
        {communityProblems
          .filter((p) => p.relevantToUs)
          .map((problem) => (
            <Card key={problem.id} className="rounded-xl border-none shadow-sm border-l-4 border-l-teal-500 dark:border-l-teal-400 bg-white dark:bg-gray-800 transition-colors duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <CardTitle className="text-gray-900 dark:text-white">{problem.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap mb-3">
                      <Badge variant="secondary" className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400">
                        {problem.category}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{problem.location}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Posted by {problem.postedBy}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{problem.date}</span>
                      {problem.responded && (
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Responded
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="dark:text-gray-300">{problem.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Dialog 
                  open={isResponseDialogOpen && selectedProblem === problem.id} 
                  onOpenChange={(open) => {
                    setIsResponseDialogOpen(open);
                    if (!open) setSelectedProblem(null);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setSelectedProblem(problem.id)}
                      className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
                      disabled={problem.responded}
                    >
                      {problem.responded ? "Response Submitted" : "Propose Solution"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="dark:text-white">Propose Your Solution</DialogTitle>
                      <DialogDescription className="dark:text-gray-400">
                        Explain how your NGO can help solve this problem
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                        <h4 className="text-sm text-gray-900 dark:text-white mb-1">{problem.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{problem.location}</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="solution-response" className="dark:text-gray-300">Your Proposed Solution</Label>
                        <Textarea
                          id="solution-response"
                          placeholder="Describe how your NGO can solve this problem..."
                          rows={5}
                          className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estimated-cost" className="dark:text-gray-300">Estimated Cost (₹)</Label>
                        <Input
                          id="estimated-cost"
                          type="number"
                          placeholder="e.g., 80000"
                          className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timeline" className="dark:text-gray-300">Timeline</Label>
                        <Input
                          id="timeline"
                          placeholder="e.g., 2-3 months"
                          className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
                        onClick={() => handleRespondToProblem(problem.id)}
                      >
                        Submit Response
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  );
}