"use client";
import { useEffect, useState } from "react";
import { AlertTriangle, MessageSquare, Loader2, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { getAuth } from "firebase/auth";

interface NgoStrike {
  _id: string;
  campaignId: { _id: string; title: string; isStruck: boolean } | null;
  reason: string;
  details: string;
  status: "pending" | "accepted" | "rejected";
  adminNote: string;
  reviewedAt: string | null;
  ngoReply: string;
  repliedAt: string | null;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-900/30 text-yellow-400 border-yellow-700",
  accepted: "bg-red-900/30 text-red-400 border-red-700",
  rejected: "bg-gray-700 text-gray-400 border-gray-600",
};

interface NgoStrikesProps {
  ngoId: string;
}

export function NgoStrikes({ ngoId }: NgoStrikesProps) {
  const [strikes, setStrikes] = useState<NgoStrike[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedStrike, setSelectedStrike] = useState<NgoStrike | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const getToken = async () => {
    const auth = getAuth();
    return auth.currentUser?.getIdToken();
  };

  const fetchNgoStrikes = async () => {
    if (!ngoId) return;
    setLoading(true);
    try {
      const token = await getToken();
      // Fetch all strikes filtered to this NGO's campaigns
      const res = await axios.get(`/api/strikes/ngo/${ngoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStrikes(res.data.strikes);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load strikes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNgoStrikes(); }, [ngoId]);

  const openReplyDialog = (strike: NgoStrike) => {
    setSelectedStrike(strike);
    setReplyText(strike.ngoReply || "");
    setReplyDialogOpen(true);
  };

  const handleSubmitReply = async () => {
    if (!selectedStrike) return;
    if (replyText.trim().length < 10) {
      toast.error("Reply must be at least 10 characters.");
      return;
    }
    setIsReplying(true);
    try {
      const token = await getToken();
      await axios.patch(
        `/api/strikes/${selectedStrike._id}/reply`,
        { reply: replyText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Your reply has been submitted to the admin.");
      setReplyDialogOpen(false);
      fetchNgoStrikes();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit reply.");
    } finally {
      setIsReplying(false);
    }
  };

  const acceptedCount = strikes.filter((s) => s.status === "accepted").length;
  const pendingCount = strikes.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            Campaign Strikes
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            User-filed strikes against your campaigns. Reply to accepted strikes to provide your defence.
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          {pendingCount > 0 && (
            <Badge className="bg-yellow-900/30 text-yellow-400 border border-yellow-700">{pendingCount} Pending</Badge>
          )}
          {acceptedCount > 0 && (
            <Badge className="bg-red-900/30 text-red-400 border border-red-700">{acceptedCount} Accepted</Badge>
          )}
        </div>
      </div>

      {/* Info box for accepted strikes */}
      {acceptedCount > 0 && (
        <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4">
          <p className="text-red-300 text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              You have <strong>{acceptedCount}</strong> accepted strike{acceptedCount > 1 ? "s" : ""}. The affected campaign{acceptedCount > 1 ? "s are" : " is"} locked from accepting donations until an admin removes the strike. Submit your reply to dispute it.
            </span>
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-blue-400" />
        </div>
      ) : strikes.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No strikes filed against your campaigns. Keep up the good work!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {strikes.map((strike) => (
            <Card key={strike._id} className="rounded-xl border-none shadow-sm dark:bg-gray-800">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-red-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <CardTitle className="dark:text-white text-base">
                        {strike.campaignId?.title ?? "Unknown Campaign"}
                      </CardTitle>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Filed: {new Date(strike.createdAt).toLocaleDateString()}
                        {strike.reviewedAt && ` · Reviewed: ${new Date(strike.reviewedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`border capitalize ${STATUS_COLORS[strike.status]}`}>
                      {strike.status}
                    </Badge>
                    {strike.campaignId?.isStruck && (
                      <Badge className="border border-red-700 bg-red-900/30 text-red-300 text-xs">🔒 Locked</Badge>
                    )}
                    {strike.ngoReply && (
                      <Badge className="border border-blue-700 bg-blue-900/20 text-blue-300 text-xs">
                        <MessageSquare className="w-3 h-3 mr-1" />Replied
                      </Badge>
                    )}
                    <button
                      onClick={() => setExpandedId(expandedId === strike._id ? null : strike._id)}
                      className="text-gray-400 hover:text-gray-200 p-1"
                    >
                      {expandedId === strike._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </CardHeader>

              {expandedId === strike._id && (
                <CardContent className="pt-0 space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500 dark:text-gray-400">Reason Filed</Label>
                      <p className="text-gray-800 dark:text-gray-200 text-sm mt-1">{strike.reason}</p>
                    </div>
                    {strike.details && (
                      <div>
                        <Label className="text-xs text-gray-500 dark:text-gray-400">Additional Details</Label>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1 whitespace-pre-wrap">{strike.details}</p>
                      </div>
                    )}
                    {strike.adminNote && (
                      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <Label className="text-xs text-gray-400 mb-1 block">Admin Note</Label>
                        <p className="text-gray-300 text-sm">{strike.adminNote}</p>
                      </div>
                    )}
                    {strike.ngoReply && (
                      <div className="bg-blue-900/10 border border-blue-800/30 rounded-lg p-3">
                        <Label className="text-xs text-blue-400 flex items-center gap-1 mb-1">
                          <MessageSquare className="w-3 h-3" /> Your Reply
                          <span className="text-gray-500 ml-2">{strike.repliedAt ? new Date(strike.repliedAt).toLocaleDateString() : ""}</span>
                        </Label>
                        <p className="text-blue-200 text-sm whitespace-pre-wrap">{strike.ngoReply}</p>
                      </div>
                    )}
                  </div>

                  {/* Reply button — only for accepted strikes without a reply */}
                  {strike.status === "accepted" && (
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                      onClick={() => openReplyDialog(strike)}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      {strike.ngoReply ? "Update Reply" : "Submit Reply / Defence"}
                    </Button>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Reply dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              Reply to Strike
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Campaign: <span className="text-white font-medium">{selectedStrike?.campaignId?.title}</span>
              <br />Your reply will be reviewed by the admin. Provide clear evidence or explanation to dispute the strike.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-sm text-gray-400 mb-1 block">Your Defence / Reply <span className="text-red-400">*</span></Label>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Explain why this strike is incorrect. Provide any supporting information, receipts, or evidence..."
                rows={5}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{replyText.length} characters (minimum 10)</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300"
                onClick={() => setReplyDialogOpen(false)}
                disabled={isReplying}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 gap-1.5"
                onClick={handleSubmitReply}
                disabled={isReplying || replyText.trim().length < 10}
              >
                {isReplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
