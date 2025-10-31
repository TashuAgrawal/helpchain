// src/app/components/user-dashboard/dialogs/DonationGoalDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";

interface DonationGoalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  donationGoalAmount: string;
  setDonationGoalAmount: (val: string) => void;
  donationGoalDeadline: string;
  setDonationGoalDeadline: (val: string) => void;
  handleSetDonationGoal: () => void;
}

export function DonationGoalDialog({
  isOpen, onOpenChange,
  donationGoalAmount, setDonationGoalAmount,
  donationGoalDeadline, setDonationGoalDeadline,
  handleSetDonationGoal
}: DonationGoalDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Set Your Donation Goal</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Challenge yourself to make more impact
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="goal-amount" className="dark:text-gray-300">Goal Amount ($)</Label>
            <Input 
              id="goal-amount" 
              type="number"
              placeholder="1000" 
              className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={donationGoalAmount}
              onChange={(e) => setDonationGoalAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-deadline" className="dark:text-gray-300">Deadline</Label>
            <Input 
              id="goal-deadline" 
              type="date"
              className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={donationGoalDeadline}
              onChange={(e) => setDonationGoalDeadline(e.target.value)}
            />
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
            onClick={handleSetDonationGoal}
          >
            Set Goal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}