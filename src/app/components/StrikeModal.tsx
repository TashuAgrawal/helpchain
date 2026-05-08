"use client";
import { useState } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { getAuth } from "firebase/auth";

interface StrikeModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  campaignTitle: string;
}

const REASON_PRESETS = [
  "Fraudulent campaign — funds not being used as described",
  "Misleading or false information in campaign description",
  "Campaign goal already reached but still collecting donations",
  "Suspicious activity or duplicate campaign",
  "Other",
];

export default function StrikeModal({ isOpen, onClose, campaignId, campaignTitle }: StrikeModalProps) {
  const [selectedPreset, setSelectedPreset] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reason = selectedPreset === "Other" ? customReason : selectedPreset;

  const handleSubmit = async () => {
    if (!reason || reason.trim().length < 10) {
      toast.error("Please provide a reason (at least 10 characters).");
      return;
    }

    setIsSubmitting(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must be logged in to file a strike.");
        return;
      }
      const token = await user.getIdToken();

      await axios.post(
        "/api/strikes",
        { campaignId, reason: reason.trim(), details: details.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Strike filed successfully! It will be reviewed by an admin.");
      handleClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to file strike. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedPreset("");
    setCustomReason("");
    setDetails("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="rounded-xl max-w-lg bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-red-900/40 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            Report Strike
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Filing a strike against: <span className="text-white font-medium">{campaignTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Warning notice */}
          <div className="bg-yellow-900/20 border border-yellow-800/40 rounded-lg p-3">
            <p className="text-yellow-400 text-xs">
              ⚠️ Strikes are reviewed by admins. False or malicious reports may result in account suspension.
            </p>
          </div>

          {/* Reason presets */}
          <div>
            <Label className="text-gray-200 mb-2 block">Reason for strike <span className="text-red-400">*</span></Label>
            <div className="space-y-2">
              {REASON_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => { setSelectedPreset(preset); if (preset !== "Other") setCustomReason(""); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                    selectedPreset === preset
                      ? "bg-red-900/30 border-red-600 text-red-300"
                      : "bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Custom reason input (shown when "Other" is selected) */}
          {selectedPreset === "Other" && (
            <div>
              <Label className="text-gray-200 mb-1 block">Specify your reason <span className="text-red-400">*</span></Label>
              <Textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Describe why you're filing this strike (min 10 characters)..."
                rows={2}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 resize-none"
              />
            </div>
          )}

          {/* Additional details */}
          <div>
            <Label className="text-gray-200 mb-1 block">Additional details / evidence <span className="text-gray-500 text-xs">(optional)</span></Label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide any supporting information, links, or evidence..."
              rows={3}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-1.5" />
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedPreset || (selectedPreset === "Other" && customReason.trim().length < 10)}
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" />Submitting…</>
              ) : (
                <><AlertTriangle className="w-4 h-4 mr-1.5" />File Strike</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
