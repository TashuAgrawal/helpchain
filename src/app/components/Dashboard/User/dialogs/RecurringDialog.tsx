// src/app/components/user-dashboard/dialogs/RecurringDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { NGO } from '../types';

interface RecurringDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNGO: NGO | null;
  donationAmount: string;
  setDonationAmount: (amount: string) => void;
  recurringFrequency: string;
  setRecurringFrequency: (freq: string) => void;
  handleRecurringDonation: () => void;
}

export function RecurringDialog({
  isOpen, onOpenChange, selectedNGO,
  donationAmount, setDonationAmount,
  recurringFrequency, setRecurringFrequency,
  handleRecurringDonation
}: RecurringDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Set Up Recurring Donation</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Support {selectedNGO?.name} regularly
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="recurring-amount" className="dark:text-gray-300">Amount ($)</Label>
            <Input 
              id="recurring-amount" 
              type="number" 
              placeholder="50" 
              className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="dark:text-gray-300">Frequency</Label>
            <Select value={recurringFrequency} onValueChange={setRecurringFrequency}>
              <SelectTrigger className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
            onClick={handleRecurringDonation}
          >
            Set Up Recurring Donation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}