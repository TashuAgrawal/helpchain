// src/app/components/user-dashboard/dialogs/PostProblemDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Textarea } from "../../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";

interface PostProblemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newProblemTitle: string;
  setNewProblemTitle: (val: string) => void;
  newProblemDescription: string;
  setNewProblemDescription: (val: string) => void;
  newProblemCategory: string;
  setNewProblemCategory: (val: string) => void;
  newProblemLocation: string;
  setNewProblemLocation: (val: string) => void;
  handlePostProblem: () => void;
}

export function PostProblemDialog({
  isOpen, onOpenChange,
  newProblemTitle, setNewProblemTitle,
  newProblemDescription, setNewProblemDescription,
  newProblemCategory, setNewProblemCategory,
  newProblemLocation, setNewProblemLocation,
  handlePostProblem
}: PostProblemDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Post a Community Problem</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Share a problem and NGOs can propose solutions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="problem-title" className="dark:text-gray-300">Problem Title</Label>
            <Input 
              id="problem-title" 
              placeholder="Brief description of the problem" 
              className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={newProblemTitle}
              onChange={(e) => setNewProblemTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="problem-category" className="dark:text-gray-300">Category</Label>
            <Select value={newProblemCategory} onValueChange={setNewProblemCategory}>
              <SelectTrigger className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="Water & Sanitation">Water & Sanitation</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Environment">Environment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="problem-location" className="dark:text-gray-300">Location</Label>
            <Input 
              id="problem-location" 
              placeholder="City, State" 
              className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={newProblemLocation}
              onChange={(e) => setNewProblemLocation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="problem-description" className="dark:text-gray-300">Detailed Description</Label>
            <Textarea
              id="problem-description"
              placeholder="Explain the problem in detail..."
              rows={5}
              className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={newProblemDescription}
              onChange={(e) => setNewProblemDescription(e.target.value)}
            />
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
            onClick={handlePostProblem}
          >
            Post Problem
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}