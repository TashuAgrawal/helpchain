// src/app/components/ngo-dashboard/CommunityTab.tsx

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Plus, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { CommunityProblem } from './types';
import addSolution from "@/Helper/NgoServices/AddSolution";
import { fetchSubmittedIds } from "@/Helper/NgoServices/SubmittedSolutionIds";

interface CommunityTabProps {
  communityProblems: CommunityProblem[];
  isResponseDialogOpen: boolean;
  setIsResponseDialogOpen: (open: boolean) => void;
  selectedProblem: string | null;
  setSelectedProblem: (id: string | null) => void;
  handleRespondToProblem: (id: string) => void;
}

interface SolutionFormData {
  solutionDescription: string;
  estimatedCost: string;
  timeline: string;
}

export function CommunityTab({
  communityProblems,
  isResponseDialogOpen, setIsResponseDialogOpen,
  selectedProblem, setSelectedProblem,
  handleRespondToProblem,
}: CommunityTabProps) {

  // Local Form State
  const [formData, setFormData] = useState<SolutionFormData>({
    solutionDescription: '',
    estimatedCost: '',
    timeline: ''
  });

  // ✅ Submitted problem IDs
  const [submittedProblemIds, setSubmittedProblemIds] = useState<string[]>([]);
  const [loadingSubmitted, setLoadingSubmitted] = useState(true);

  // ✅ Fetch submitted problem IDs on mount
  useEffect(() => {
    const fetchSubmittedProblems = async () => {
      try {
        setLoadingSubmitted(true);
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          const ngoId = userObj?.user.mongoId;
          
          if (ngoId) {
            const result = await fetchSubmittedIds(ngoId);
            setSubmittedProblemIds(result.data.problemIds || []);
          }
        }
      } catch (error) {
        console.error('Error fetching submitted problems:', error);
      } finally {
        setLoadingSubmitted(false);
      }
    };

    fetchSubmittedProblems();
  }, [handleRespondToProblem]);

  // FIXED — Proper form handler
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Check if current problem is submitted
  const isProblemSubmitted = (problemId: string) => {
    return submittedProblemIds.includes(problemId);
  };

  // Save solution
  const saveSolution = async (problemId: string) => {
    try {
      let ngoId;
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        ngoId = userObj?.user.mongoId;
      }

      if (!ngoId) {
        throw new Error('NGO ID not found. Please login again.');
      }

      const solutionData = {
        problemId,
        ngoId,
        ngoName: JSON.parse(userStr || '{}')?.user?.username || 'NGO',
        solutionDescription: formData.solutionDescription.trim(),
        estimatedCost: parseInt(formData.estimatedCost) || 0,
        timeline: formData.timeline.trim()
      };

      if (!solutionData.solutionDescription || !solutionData.timeline || solutionData.estimatedCost <= 0) {
        throw new Error('Please fill all required fields correctly.');
      }

      const result = await addSolution(solutionData);
      console.log('Solution saved:', result);

      // ✅ Add to local submitted list immediately
      setSubmittedProblemIds(prev => [...prev, problemId]);

      setFormData({
        solutionDescription: '',
        estimatedCost: '',
        timeline: ''
      });

      handleRespondToProblem(problemId);
      return { success: true, data: result };

    } catch (error: any) {
      console.error('Error saving solution:', error);
      throw new Error(error.message || 'Failed to submit solution');
    }
  };

  const isFormValid =
    formData.solutionDescription.trim() &&
    formData.estimatedCost &&
    parseInt(formData.estimatedCost) > 0 &&
    formData.timeline.trim();

  if (loadingSubmitted) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading submitted solutions...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Community Problems</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Browse community problems and propose solutions for your NGO 
          <span className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
            {submittedProblemIds.length} submitted
          </span>
        </p>
      </div>

      <div className="space-y-4">
        {communityProblems.map((problem) => {
          const problemSubmitted = isProblemSubmitted(problem.id);
          
          return (
            <Card key={problem.id} className="rounded-xl border-none shadow-sm border-l-4 border-l-teal-500 dark:border-l-teal-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                      <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">{problem.title}</CardTitle>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <Badge variant="secondary" className="bg-teal-100/80 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-3 py-1">
                        {problem.category}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">📍 {problem.location}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">👤 {problem.postedBy}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">📅 {problem.date}</span>
                    </div>
                    <CardDescription className="text-gray-700 dark:text-gray-300 leading-relaxed">{problem.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Dialog
                  open={isResponseDialogOpen && selectedProblem === problem.id}
                  onOpenChange={(open) => {
                    setIsResponseDialogOpen(open);
                    if (!open) {
                      setSelectedProblem(null);
                      setFormData({
                        solutionDescription: '',
                        estimatedCost: '',
                        timeline: ''
                      });
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setSelectedProblem(problem.id)}
                      className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-6 py-3"
                      disabled={problemSubmitted}
                      size="lg"
                    >
                      {problemSubmitted ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Response Submitted
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Propose Solution
                        </>
                      )}
                    </Button>
                  </DialogTrigger>

                  {/* Dialog Content - Same as before */}
                  <DialogContent className="max-w-4xl max-h-[90vh] rounded-2xl dark:bg-gray-800 dark:border-gray-700 p-0 overflow-hidden">
                    {/* ... rest of dialog content remains same ... */}
                    <DialogHeader className="p-6 pb-4 border-b border-gray-200/50 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <DialogTitle className="dark:text-white flex items-center gap-3 text-xl font-bold">
                          <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                          Propose Solution for "{problem.title}"
                        </DialogTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsResponseDialogOpen(false);
                            setSelectedProblem(null);
                          }}
                          className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <DialogDescription className="dark:text-gray-400 text-sm">
                        Help solve this community problem by submitting a detailed solution proposal for your NGO
                      </DialogDescription>
                    </DialogHeader>

                    {/* Problem Summary */}
                    <div className="p-6 pt-2 bg-gradient-to-r from-orange-50/80 to-teal-50/80 dark:from-gray-900/50 dark:to-gray-800/50 border-b border-gray-200/50 dark:border-gray-700">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-orange-100/80 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0 border">
                          <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-lg truncate">{problem.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex flex-wrap items-center gap-2 mt-1">
                            📍 <span>{problem.location}</span>
                            <Badge variant="outline" className="text-xs px-2 py-0.5">{problem.category}</Badge>
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{problem.description}</p>
                    </div>

                    {/* Solution Form */}
                    <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                      <div className="space-y-2">
                        <Label htmlFor="solutionDescription" className="dark:text-gray-300 font-semibold text-sm">
                          Your Proposed Solution *
                        </Label>
                        <Textarea
                          id="solutionDescription"
                          value={formData.solutionDescription}
                          onChange={handleInputChange}
                          placeholder="Describe the full solution..."
                          rows={6}
                          className="rounded-xl dark:bg-gray-700/50 dark:border-gray-600 dark:text-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-vertical min-h-[120px] text-sm leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="estimatedCost" className="dark:text-gray-300 font-semibold text-sm">
                            Estimated Cost (₹) *
                          </Label>
                          <Input
                            id="estimatedCost"
                            type="number"
                            value={formData.estimatedCost}
                            onChange={handleInputChange}
                            placeholder="e.g., 85000"
                            className="rounded-xl dark:bg-gray-700/50 dark:border-gray-600 dark:text-white border-gray-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="timeline" className="dark:text-gray-300 font-semibold text-sm">
                            Expected Timeline *
                          </Label>
                          <Input
                            id="timeline"
                            value={formData.timeline}
                            onChange={handleInputChange}
                            placeholder="e.g., 2-3 months"
                            className="rounded-xl dark:bg-gray-700/50 dark:border-gray-600 dark:text-white border-gray-200"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg"
                          onClick={async () => {
                            try {
                              await saveSolution(problem.id);
                            } catch (error: any) {
                              alert(error.message);
                            }
                          }}
                          disabled={!isFormValid}
                        >
                          Submit Solution Proposal
                        </Button>

                        <Button
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => {
                            setIsResponseDialogOpen(false);
                            setSelectedProblem(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {communityProblems.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No community problems yet</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Be the first to help! Community problems will appear here once users start reporting them.
          </p>
        </div>
      )}
    </>
  );
}
