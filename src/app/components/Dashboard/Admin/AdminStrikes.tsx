"use client";
import { useEffect, useState } from "react";
import { AlertTriangle, Check, X, Trash2, ChevronDown, ChevronUp, Loader2, MessageSquare } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { getAuth } from "firebase/auth";

interface Strike {
  _id: string;
  campaignId: { _id: string; title: string; isStruck: boolean; ngoId: string } | null;
  filedBy: { username: string; email: string } | null;
  reason: string;
  details: string;
  status: "pending" | "accepted" | "rejected";
  adminNote: string;
  reviewedAt: string | null;
  ngoReply: string;
  repliedAt: string | null;
  createdAt: string;
}

const STATUS_COLORS = {
  pending: "bg-yellow-900/30 text-yellow-400 border-yellow-700",
  accepted: "bg-red-900/30 text-red-400 border-red-700",
  rejected: "bg-gray-700 text-gray-400 border-gray-600",
};

export default function AdminStrikes() {
  const [strikes, setStrikes] = useState<Strike[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "accepted" | "rejected">("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedStrike, setSelectedStrike] = useState<Strike | null>(null);
  const [reviewAction, setReviewAction] = useState<"accept" | "reject">("accept");
  const [adminNote, setAdminNote] = useState("");
  const [isActing, setIsActing] = useState(false);
  const [dismissingId, setDismissingId] = useState<string | null>(null);

  const getToken = async () => {
    const auth = getAuth();
    return auth.currentUser?.getIdToken();
  };

  const fetchStrikes = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const url = statusFilter === "all" ? "/api/strikes" : `/api/strikes?status=${statusFilter}`;
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setStrikes(res.data.strikes);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load strikes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStrikes(); }, [statusFilter]);

  const openReviewDialog = (strike: Strike, action: "accept" | "reject") => {
    setSelectedStrike(strike);
    setReviewAction(action);
    setAdminNote("");
    setReviewDialogOpen(true);
  };

  const handleReview = async () => {
    if (!selectedStrike) return;
    setIsActing(true);
    try {
      const token = await getToken();
      await axios.patch(
        `/api/strikes/${selectedStrike._id}/review`,
        { action: reviewAction, adminNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(reviewAction === "accept" ? "Strike accepted — campaign locked." : "Strike rejected.");
      setReviewDialogOpen(false);
      fetchStrikes();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Action failed.");
    } finally {
      setIsActing(false);
    }
  };

  const handleDismiss = async (strikeId: string) => {
    setDismissingId(strikeId);
    try {
      const token = await getToken();
      await axios.delete(`/api/strikes/${strikeId}/dismiss`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Strike dismissed and campaign unlocked.");
      fetchStrikes();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to dismiss strike.");
    } finally {
      setDismissingId(null);
    }
  };

  const pendingCount = strikes.filter((s) => s.status === "pending").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          Campaign Strikes
        </h1>
        <p className="text-gray-600 dark:text-gray-300">Review user-reported strikes against NGO campaigns</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["pending", "accepted", "rejected", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              statusFilter === f
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {f === "pending" && pendingCount > 0 ? `Pending (${pendingCount})` : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : strikes.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          No {statusFilter !== "all" ? statusFilter : ""} strikes found.
        </div>
      ) : (
        <div className="space-y-4">
          {strikes.map((strike) => (
            <Card key={strike._id} className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-red-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <CardTitle className="text-gray-900 dark:text-white text-base">
                        {strike.campaignId?.title ?? "Unknown Campaign"}
                      </CardTitle>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Filed by: <span className="text-gray-700 dark:text-gray-300">{strike.filedBy?.username ?? strike.filedBy?.email ?? "Unknown"}</span>
                        {" · "}
                        {new Date(strike.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge className={`border capitalize ${STATUS_COLORS[strike.status]}`}>
                      {strike.status}
                    </Badge>
                    {strike.campaignId?.isStruck && (
                      <Badge className="border border-red-700 bg-red-900/30 text-red-300 text-xs">🔒 Locked</Badge>
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
                      <Label className="text-xs text-gray-500 dark:text-gray-400">Reason</Label>
                      <p className="text-gray-800 dark:text-gray-200 text-sm mt-1">{strike.reason}</p>
                    </div>
                    {strike.details && (
                      <div>
                        <Label className="text-xs text-gray-500 dark:text-gray-400">Additional Details</Label>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1 whitespace-pre-wrap">{strike.details}</p>
                      </div>
                    )}
                    {strike.adminNote && (
                      <div>
                        <Label className="text-xs text-gray-500 dark:text-gray-400">Admin Note</Label>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{strike.adminNote}</p>
                      </div>
                    )}
                    {strike.ngoReply && (
                      <div className="bg-blue-900/10 border border-blue-800/30 rounded-lg p-3">
                        <Label className="text-xs text-blue-400 flex items-center gap-1 mb-1">
                          <MessageSquare className="w-3 h-3" /> NGO Reply
                          <span className="text-gray-500 ml-2">{strike.repliedAt ? new Date(strike.repliedAt).toLocaleDateString() : ""}</span>
                        </Label>
                        <p className="text-blue-200 text-sm whitespace-pre-wrap">{strike.ngoReply}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {strike.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white gap-1.5"
                          onClick={() => openReviewDialog(strike, "accept")}
                        >
                          <Check className="w-3.5 h-3.5" /> Accept Strike
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 gap-1.5"
                          onClick={() => openReviewDialog(strike, "reject")}
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </Button>
                      </>
                    )}
                    {strike.status === "accepted" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-800 text-red-400 hover:bg-red-900/20 gap-1.5"
                        disabled={dismissingId === strike._id}
                        onClick={() => handleDismiss(strike._id)}
                      >
                        {dismissingId === strike._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Remove Strike & Unlock Campaign
                      </Button>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Review confirmation dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700 max-w-md">
          <DialogHeader>
            <DialogTitle className={`dark:text-white flex items-center gap-2 ${reviewAction === "accept" ? "text-red-400" : "text-gray-300"}`}>
              {reviewAction === "accept" ? (
                <><Check className="w-4 h-4" /> Accept Strike</>
              ) : (
                <><X className="w-4 h-4" /> Reject Strike</>
              )}
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {reviewAction === "accept"
                ? "This will lock the campaign and prevent it from accepting new donations. The NGO will be able to reply."
                : "This will dismiss the strike. The campaign remains active."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-sm text-gray-400 mb-1 block">Admin note (optional)</Label>
              <Textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add a note explaining your decision..."
                rows={3}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-gray-600 text-gray-300" onClick={() => setReviewDialogOpen(false)} disabled={isActing}>
                Cancel
              </Button>
              <Button
                className={`flex-1 ${reviewAction === "accept" ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-500"}`}
                onClick={handleReview}
                disabled={isActing}
              >
                {isActing ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                Confirm {reviewAction === "accept" ? "Accept" : "Reject"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
