// Enhanced CommunityTab with improved styling
// Paste this file in: src/app/components/user-dashboard/tabs/CommunityTab.tsx

"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";
import {
  Plus,
  AlertCircle,
  TrendingUp,
  MessageCircle,
  Eye,
} from "lucide-react";
import { CommunityProblem } from "../types";
import { fetchSubmittedSolution } from "@/Helper/UserServices/GetSolution";
import { motion } from "framer-motion";

interface CommunityTabProps {
  communityProblems: CommunityProblem[];
  setIsProblemDialogOpen: (open: boolean) => void;
  handleVoteProblem: (id: string) => void;
}

interface GroupedSolution {
  _id: string; 
  solutions: Array<{
    _id: string;
    ngoId: string;
    solutionDescription: string;
    estimatedCost: number;
    timeline: string;
    status: string;
    submittedAt: string;
  }>;
  count: number;
}

export function CommunityTab({ communityProblems, setIsProblemDialogOpen, handleVoteProblem }: CommunityTabProps) {
  const [groupedSolutions, setGroupedSolutions] = useState<GroupedSolution[]>([]);
  const [loadingSolutions, setLoadingSolutions] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoadingSolutions(true);
        const result = await fetchSubmittedSolution();
        setGroupedSolutions(result.data.groupedSolutions || []);
      } catch {
      } finally {
        setLoadingSolutions(false);
      }
    }
    fetchData();
  }, []);

  const getSolutionsForProblem = (problemId: string) => {
    return groupedSolutions.find((group) => group._id === problemId)?.solutions || [];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-50 to-teal-50 dark:from-gray-900/30 dark:to-gray-800/30 shadow-sm border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Community Problems</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Post real-life issues and get NGO solutions</p>
        </div>

        <Button
          className="bg-gradient-to-r from-blue-600 to-teal-600 hover:scale-105 transition-all duration-200 shadow-md text-white rounded-xl gap-2"
          onClick={() => setIsProblemDialogOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Post Problem
        </Button>
      </div>

      {/* Problem List */}
      <div className="space-y-6">
        {communityProblems.map((problem) => {
          const solutions = getSolutionsForProblem(problem.id);

          return (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm">
                <CardHeader className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        <CardTitle className="text-lg font-semibold dark:text-white">{problem.title}</CardTitle>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap text-xs">
                        <Badge className="px-3 py-1 rounded-full dark:bg-gray-700 dark:text-gray-300 bg-orange-100 text-orange-700">
                          {problem.category}
                        </Badge>
                        <span className="text-gray-600 dark:text-gray-400">📍 {problem.location}</span>
                        <span className="text-gray-600 dark:text-gray-400">👤 {problem.postedBy}</span>
                        <span className="text-gray-600 dark:text-gray-400">📅 {problem.date}</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm shadow-sm transition-all duration-200 hover:scale-105 ${problem.userVoted ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" : "text-gray-600 dark:text-gray-400"}`}
                      onClick={() => handleVoteProblem(problem.id)}
                    >
                      <TrendingUp className="w-4 h-4" />
                      {problem.upvotes}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-6 pt-2">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">{problem.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      {solutions.length} NGO response(s)
                    </div>

                    {/* View Responses */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={solutions.length === 0 || loadingSolutions}
                          className="rounded-full px-4 py-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                          <Eye className="w-4 h-4" />
                          View Responses
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-2xl max-h-[80vh] rounded-2xl border-none overflow-hidden shadow-2xl bg-white dark:bg-gray-900 p-0">
                        <DialogHeader className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-teal-50 dark:from-gray-900/50 dark:to-gray-800/50">
                          <DialogTitle className="flex items-center gap-3 text-xl font-bold dark:text-white">
                            <AlertCircle className="w-6 h-6 text-orange-500" /> NGO Responses for "{problem.title}"
                          </DialogTitle>
                          <DialogDescription className="dark:text-gray-400 text-sm">
                            {solutions.length} organization(s) have submitted proposals
                          </DialogDescription>
                        </DialogHeader>

                        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
                          {solutions.length === 0 ? (
                            <div className="text-center py-16 opacity-60">
                              <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                              <p>No responses yet</p>
                            </div>
                          ) : (
                            solutions.map((solution, index) => (
                              <motion.div
                                key={solution._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white flex items-center justify-center text-xs font-semibold">
                                      NGO {index + 1}
                                    </div>

                                    <div>
                                      <p className="font-semibold dark:text-white">₹{solution.estimatedCost.toLocaleString()}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{solution.timeline}</p>
                                    </div>
                                  </div>

                                  <Badge
                                    className={`px-3 py-1 rounded-full text-xs shadow-sm ${solution.status === "approved"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}
                                  >
                                    {solution.status.toUpperCase()}
                                  </Badge>
                                </div>

                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {solution.solutionDescription}
                                </p>

                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                                  Submitted: {new Date(solution.submittedAt).toLocaleDateString()}
                                </p>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}