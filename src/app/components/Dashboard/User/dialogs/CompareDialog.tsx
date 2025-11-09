// src/app/components/user-dashboard/dialogs/CompareDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { X } from "lucide-react";
import { NGO } from "../types";

interface CompareDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  compareNGOs: NGO[];
  handleAddToCompare: (ngo: NGO) => void;
  onDonate: (ngo: NGO) => void;
}

export function CompareDialog({
  isOpen,
  onOpenChange,
  compareNGOs,
  handleAddToCompare,
  onDonate,
}: CompareDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700 max-w-4xl">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Compare NGOs</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Side-by-side comparison of selected NGOs
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <div className="grid grid-cols-3 gap-4">
            {compareNGOs.map((ngo) => (
              <Card
                key={ngo.id}
                className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm dark:text-white">
                      {ngo.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddToCompare(ngo)}
                      aria-label={`Remove ${ngo.name} from compare`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
