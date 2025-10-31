// src/app/components/user-dashboard/dialogs/DonateDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Switch } from "../../../ui/switch";
import { Calendar } from "lucide-react";
import { NGO } from '../types';

interface DonateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNGO: NGO | null;
  donationAmount: string;
  setDonationAmount: (amount: string) => void;
  isAnonymous: boolean;
  setIsAnonymous: (anon: boolean) => void;
  handleDonate: () => void;
  onSetRecurring: () => void;
}

export function DonateDialog({
  isOpen, onOpenChange, selectedNGO,
  donationAmount, setDonationAmount,
  isAnonymous, setIsAnonymous,
  handleDonate, onSetRecurring
}: DonateDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Donate to {selectedNGO?.name}</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Your donation will make a real difference
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="dark:text-gray-300">Donation Amount ($)</Label>
            <Input 
              id="amount" 
              type="number" 
              placeholder="100" 
              className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Label htmlFor="anonymous" className="dark:text-gray-300">Donate anonymously</Label>
            <Switch 
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
          </div>
          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
              onClick={handleDonate}
            >
              Donate Now
            </Button>
            <Button 
              variant="outline"
              className="flex-1 rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
              onClick={onSetRecurring}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Set Recurring
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}