// src/app/components/ngo-dashboard/DonorsTab.tsx

import React from 'react';
import { MessageCircle, Award, CheckCircle, Send, Filter, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";  
import { Button } from "../../ui/button";  
import { Badge } from "../../ui/badge";  
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";  
import { Label } from "../../ui/label";  
import { Textarea } from "../../ui/textarea";  
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";  
import { toast } from "sonner";
import { Donation, DonorFeedback } from './types';

interface DonorsTabProps {
  donationFilter: string;
  setDonationFilter: (filter: string) => void;
  filteredDonations: Donation[];
  donorFeedback: DonorFeedback[];
  isFeedbackReplyOpen: boolean;
  setIsFeedbackReplyOpen: (open: boolean) => void;
  selectedFeedback: DonorFeedback | null;
  setSelectedFeedback: (fb: DonorFeedback | null) => void;
  handleReplyToFeedback: (id: number) => void;
}

export function DonorsTab({
  donationFilter, setDonationFilter,
  filteredDonations, donorFeedback,
  isFeedbackReplyOpen, setIsFeedbackReplyOpen,
  selectedFeedback, setSelectedFeedback,
  handleReplyToFeedback
}: DonorsTabProps) {

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white mb-2">Donor Management</h1>
          <p className="text-gray-600 dark:text-gray-300">View and engage with your donors</p>
        </div>
        <div className="flex gap-3">
          <Select value={donationFilter} onValueChange={setDonationFilter}>
            <SelectTrigger className="w-48 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="all">All Donations</SelectItem>
              <SelectItem value="anonymous">Anonymous</SelectItem>
              <SelectItem value="named">Named Donors</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
            onClick={() => toast.success("Donor data exported successfully!")}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donor List */}
        <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Recent Donors</CardTitle>
            <CardDescription className="dark:text-gray-400">All donations received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-gray-900 dark:text-white">{donation.donor}</h4>
                      {donation.anonymous && (
                        <Badge variant="secondary" className="text-xs dark:bg-gray-600 dark:text-gray-300">Anonymous</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{donation.date}</p>
                    {donation.message && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 italic mt-1">"{donation.message}"</p>
                    )}
                  </div>
                  <div className="text-right">
                    <h4 className="text-teal-600 dark:text-teal-400">${donation.amount}</h4>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Donor Feedback */}
        <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Donor Feedback</CardTitle>
            <CardDescription className="dark:text-gray-400">Comments and ratings from donors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {donorFeedback.map((fb) => (
                <div key={fb.id} className="pb-3 border-b dark:border-gray-700 last:border-b-0 last:pb-0">
                  <div className="flex items-start gap-2">
                    <MessageCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-gray-900 dark:text-white text-sm">{fb.donor}</p>
                        <div className="flex gap-0.5">
                          {Array(fb.rating).fill(0).map((_, i) => (
                            <Award key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{fb.comment}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{fb.date}</span>
                        {fb.replied ? (
                          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Replied
                          </Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="rounded-lg dark:border-gray-600 dark:hover:bg-gray-700 h-7 text-xs"
                            onClick={() => {
                              setSelectedFeedback(fb);
                              setIsFeedbackReplyOpen(true);
                            }}
                          >
                            <Send className="w-3 h-3 mr-1" />Reply
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reply to Feedback Dialog */}
      <Dialog open={isFeedbackReplyOpen} onOpenChange={setIsFeedbackReplyOpen}>
        <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Reply to Feedback</DialogTitle>
            <DialogDescription className="dark:text-gray-400">Respond to donor's comment</DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4 mt-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-900 dark:text-white mb-1">"{selectedFeedback.comment}"</p>
                <span className="text-xs text-gray-600 dark:text-gray-400">- {selectedFeedback.donor}</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-reply" className="dark:text-gray-300">Your Reply</Label>
                <Textarea
                  id="feedback-reply"
                  placeholder="Type your response to the donor..."
                  rows={4}
                  className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
                onClick={() => handleReplyToFeedback(selectedFeedback.id)}
              >
                <Send className="w-4 h-4 mr-2" />Send Reply
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}