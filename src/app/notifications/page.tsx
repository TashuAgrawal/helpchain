"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  BellOff,
  CheckCheck,
  Megaphone,
  Users,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Loader2,
  Trash2,
  CheckSquare,
} from "lucide-react";
import getUserNotifications from "@/Helper/Notifications/GetNotification";
import markNotificationAsRead from "@/Helper/Notifications/MarkAsRead";
import markAllNotificationsRead from "@/Helper/Notifications/MarkAllRead";
import acceptVolunteerRequest from "@/Helper/Voluteer/AcceptRequest";
import { deleteSelectedNotifications, deleteAllNotifications } from "@/Helper/Notifications/DeleteNotification";
import axios from "axios";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type NotificationType =
  | "follow"
  | "campaign_update"
  | "campaign_post"
  | "volunteer_message"
  | "general"
  | "new_campaign"
  | "campaign_request";

interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  campaignId?: string | { _id: string };
  fromUserId?: string;
  isRead: boolean;
  createdAt: string;
  // UI-only state for volunteer notifications
  volunteerStatus?: "pending" | "accepted" | "rejected" | "loading";
}

type FilterType = "all" | "unread" | "campaign" | "volunteer";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function getCampaignId(campaignId?: string | { _id: string }): string | null {
  if (!campaignId) return null;
  if (typeof campaignId === "string") return campaignId;
  return campaignId._id;
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "campaign_post":
    case "campaign_update":
    case "new_campaign":
      return (
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <Megaphone className="w-5 h-5 text-blue-400" />
        </div>
      );
    case "campaign_request":
    case "volunteer_message":
      return (
        <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
          <Users className="w-5 h-5 text-violet-400" />
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
          <Bell className="w-5 h-5 text-teal-400" />
        </div>
      );
  }
}

function getFilterLabel(type: FilterType): string {
  const labels: Record<FilterType, string> = {
    all: "All",
    unread: "Unread",
    campaign: "Campaign",
    volunteer: "Volunteer",
  };
  return labels[type];
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch real volunteer status from CampaignVolunteer ──────────────
  const fetchVolunteerStatus = useCallback(
    async (uid: string, campaignId: string): Promise<"pending" | "accepted" | "rejected"> => {
      try {
        const { data } = await axios.get(
          `/api/volunteer/request-status?userId=${uid}&campaignId=${campaignId}`
        );
        return data.status as "pending" | "accepted" | "rejected";
      } catch {
        return "pending"; // safe fallback
      }
    },
    []
  );

  // ── Fetch notifications then hydrate volunteer statuses ───────────────
  const fetchNotifications = useCallback(async (uid: string) => {
    try {
      setLoading(true);
      const data = await getUserNotifications(uid);
      const rawNotifications: Notification[] = (data.notifications ?? []).map(
        (n: Notification) => ({
          ...n,
          // Temporarily set pending; will be replaced after status fetch
          volunteerStatus:
            n.type === "campaign_request" ? ("pending" as const) : undefined,
        })
      );
      setNotifications(rawNotifications);
      setUnreadCount(data.unreadCount ?? 0);

      // Batch-fetch real statuses for campaign_request notifications
      const volunteerNotifications = rawNotifications.filter(
        (n) => n.type === "campaign_request" && n.campaignId
      );

      if (volunteerNotifications.length > 0) {
        const statusResults = await Promise.allSettled(
          volunteerNotifications.map((n) => {
            const cid = getCampaignId(n.campaignId);
            return fetchVolunteerStatus(uid, cid!);
          })
        );

        setNotifications((prev) =>
          prev.map((n) => {
            if (n.type !== "campaign_request" || !n.campaignId) return n;
            const idx = volunteerNotifications.findIndex(
              (vn) => vn._id === n._id
            );
            if (idx === -1) return n;
            const result = statusResults[idx];
            const realStatus =
              result.status === "fulfilled" ? result.value : "pending";
            return { ...n, volunteerStatus: realStatus };
          })
        );
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchVolunteerStatus]);

  useEffect(() => {
    const userStr =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (userStr) {
      const parsed = JSON.parse(userStr);
      const uid = parsed?.user?.mongoId ?? "";
      setUserId(uid);
      if (uid) fetchNotifications(uid);
    } else {
      setLoading(false);
    }
  }, [fetchNotifications]);

  // ── Mark single as read ──────────────────────
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      try {
        await markNotificationAsRead(notification._id);
      } catch {
        // Revert on failure
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: false } : n
          )
        );
        setUnreadCount((c) => c + 1);
      }
    }

    // Navigate for campaign types
    const cid = getCampaignId(notification.campaignId);
    if (
      (notification.type === "campaign_post" ||
        notification.type === "campaign_update" ||
        notification.type === "new_campaign") &&
      cid
    ) {
      router.push(`/campaign/${cid}`);
    }
  };

  // ── Volunteer Accept / Reject ─────────────────
  const handleVolunteerAction = async (
    notification: Notification,
    action: "accepted" | "rejected"
  ) => {
    const cid = getCampaignId(notification.campaignId);
    if (!cid) return;

    // Optimistic loading state
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === notification._id
          ? { ...n, volunteerStatus: "loading" as const }
          : n
      )
    );

    try {
      await acceptVolunteerRequest({
        userId,
        campaignid: cid,
        action,
      });

      // Success — update status and mark as read
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id
            ? { ...n, volunteerStatus: action, isRead: true }
            : n
        )
      );

      if (!notification.isRead) {
        setUnreadCount((c) => Math.max(0, c - 1));
        markNotificationAsRead(notification._id).catch(() => { });
      }
    } catch (err: any) {
      // 409 = already responded — show the real current status from API
      const currentStatus: "accepted" | "rejected" | undefined =
        err?.response?.data?.currentStatus;

      if (err?.response?.status === 409 && currentStatus) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id
              ? { ...n, volunteerStatus: currentStatus, isRead: true }
              : n
          )
        );
        // Mark as read silently since they already responded
        if (!notification.isRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
          markNotificationAsRead(notification._id).catch(() => { });
        }
      } else {
        // Other error — revert to pending
        console.error("Volunteer action failed:", err);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id
              ? { ...n, volunteerStatus: "pending" }
              : n
          )
        );
      }
    }
  };


  // ── Mark all read ────────────────────────────
  const handleMarkAllRead = async () => {
    if (!userId || unreadCount === 0) return;
    setMarkingAllRead(true);
    try {
      await markAllNotificationsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all read:", err);
    } finally {
      setMarkingAllRead(false);
    }
  };

  // ── Filter ───────────────────────────────────
  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "campaign")
      return ["campaign_post", "campaign_update", "new_campaign"].includes(
        n.type
      );
    if (filter === "volunteer")
      return ["campaign_request", "volunteer_message"].includes(n.type);
    return true;
  });

  // ── Deletion ─────────────────────────────────
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((n) => n._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    setDeleting(true);
    try {
      await deleteSelectedNotifications(selectedIds);
      setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n._id)));
      
      setUnreadCount((prev) => {
        const deletedUnread = notifications.filter((n) => selectedIds.includes(n._id) && !n.isRead).length;
        return Math.max(0, prev - deletedUnread);
      });
      setSelectedIds([]);
      setIsSelectionMode(false);
    } catch (err) {
      console.error("Failed to delete selected:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!userId || notifications.length === 0) return;
    setDeleting(true);
    try {
      await deleteAllNotifications(userId);
      setNotifications([]);
      setUnreadCount(0);
      setSelectedIds([]);
      setIsSelectionMode(false);
    } catch (err) {
      console.error("Failed to delete all:", err);
    } finally {
      setDeleting(false);
    }
  };

  const filterTypes: FilterType[] = ["all", "unread", "campaign", "volunteer"];

  // ── Badge counts per filter ──────────────────
  const filterCounts: Record<FilterType, number> = {
    all: notifications.length,
    unread: notifications.filter((n) => !n.isRead).length,
    campaign: notifications.filter((n) =>
      ["campaign_post", "campaign_update", "new_campaign"].includes(n.type)
    ).length,
    volunteer: notifications.filter((n) =>
      ["campaign_request", "volunteer_message"].includes(n.type)
    ).length,
  };

  // ────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* ── Header ─────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-[#0f1117]/95 backdrop-blur-sm border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-gray-400 hover:text-white"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-400" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-blue-500 text-white text-xs font-bold">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {notifications.length} total · {unreadCount} unread
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {isSelectionMode ? (
                <>
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium transition-all"
                  >
                    <CheckSquare className="w-4 h-4" />
                    {selectedIds.length === filtered.length ? "Deselect All" : "Select All"}
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    disabled={deleting || selectedIds.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium transition-all disabled:opacity-50"
                  >
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Delete ({selectedIds.length})
                  </button>
                  <button
                    onClick={handleDeleteAll}
                    disabled={deleting || notifications.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium transition-all disabled:opacity-50"
                  >
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Delete All
                  </button>
                  <button
                    onClick={() => {
                      setIsSelectionMode(false);
                      setSelectedIds([]);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium transition-all"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {notifications.length > 0 && (
                    <button
                      onClick={() => setIsSelectionMode(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium transition-all"
                    >
                      <CheckSquare className="w-4 h-4" />
                      Select
                    </button>
                  )}
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      disabled={markingAllRead}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-sm font-medium transition-all disabled:opacity-50"
                    >
                      {markingAllRead ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCheck className="w-4 h-4" />
                      )}
                      Mark all read
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── Filter Tabs ───────────────────── */}
          <div className="flex items-center gap-1 mt-4 overflow-x-auto pb-0.5 scrollbar-hide">
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0 mr-1" />
            {filterTypes.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${filter === f
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white/[0.05] text-gray-400 hover:bg-white/[0.09] hover:text-white"
                  }`}
              >
                {getFilterLabel(f)}
                {filterCounts[f] > 0 && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${filter === f
                        ? "bg-white/20 text-white"
                        : "bg-white/10 text-gray-300"
                      }`}
                  >
                    {filterCounts[f]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          /* Loading skeleton */
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-[#161b27] border border-white/[0.06] rounded-xl p-4 animate-pulse"
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/[0.06]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/[0.06] rounded w-2/5" />
                    <div className="h-3 bg-white/[0.04] rounded w-3/4" />
                    <div className="h-3 bg-white/[0.04] rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
              <BellOff className="w-9 h-9 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-400 mb-1">
              {filter === "all" ? "No notifications yet" : `No ${filter} notifications`}
            </h3>
            <p className="text-sm text-gray-600 max-w-xs">
              {filter === "all"
                ? "You're all caught up! Notifications about campaigns, volunteers, and updates will appear here."
                : `Switch to 'All' to see your complete notification history.`}
            </p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="mt-4 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-sm hover:bg-blue-500/20 transition-colors border border-blue-500/20"
              >
                View all notifications
              </button>
            )}
          </div>
        ) : (
          /* Notification list */
          <div className="space-y-2">
            {filtered.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onClick={() => {
                  if (isSelectionMode) {
                    toggleSelection(notification._id);
                  } else {
                    handleNotificationClick(notification);
                  }
                }}
                onVolunteerAction={handleVolunteerAction}
                isSelectionMode={isSelectionMode}
                isSelected={selectedIds.includes(notification._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// NotificationCard
// ─────────────────────────────────────────────
function NotificationCard({
  notification,
  onClick,
  onVolunteerAction,
  isSelectionMode,
  isSelected,
}: {
  notification: Notification;
  onClick: () => void;
  onVolunteerAction: (
    n: Notification,
    action: "accepted" | "rejected"
  ) => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
}) {
  const isVolunteerRequest = notification.type === "campaign_request";
  const isClickableLink =
    ["campaign_post", "campaign_update", "new_campaign"].includes(
      notification.type
    ) && getCampaignId(notification.campaignId);

  return (
    <div
      className={`relative group rounded-xl border transition-all duration-200 ${notification.isRead
          ? "bg-[#161b27] border-white/[0.05] hover:border-white/[0.1]"
          : "bg-blue-950/20 border-blue-500/20 hover:border-blue-500/30 shadow-sm shadow-blue-500/5"
        } ${isSelected ? "ring-2 ring-blue-500 bg-blue-500/10" : ""}`}
    >
      {/* Unread indicator bar */}
      {!notification.isRead && (
        <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-blue-500 rounded-full" />
      )}

      <div className="p-4">
        <div
          className={`flex gap-3 ${isClickableLink || isSelectionMode ? "cursor-pointer" : ""}`}
          onClick={isClickableLink || !isVolunteerRequest || isSelectionMode ? onClick : undefined}
        >
          {/* Checkbox for selection mode */}
          {isSelectionMode && (
            <div className="flex items-center justify-center flex-shrink-0 pt-2">
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  isSelected
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-500 bg-transparent"
                }`}
              >
                {isSelected && <CheckCheck className="w-3.5 h-3.5 text-white" />}
              </div>
            </div>
          )}

          {/* Icon */}
          {!isSelectionMode && getNotificationIcon(notification.type)}

          {/* Body */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`text-sm font-semibold leading-snug ${notification.isRead ? "text-gray-300" : "text-white"
                  }`}
              >
                {notification.title}
              </h3>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {!notification.isRead && (
                  <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                )}
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  <Clock className="w-3 h-3 inline-block mr-0.5 -mt-0.5" />
                  {timeAgo(notification.createdAt)}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-0.5 leading-relaxed">
              {notification.message}
            </p>

            {/* Type badge */}
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${isVolunteerRequest
                    ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                    : notification.type === "campaign_post" ||
                      notification.type === "campaign_update" ||
                      notification.type === "new_campaign"
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                  }`}
              >
                {isVolunteerRequest ? (
                  <Users className="w-3 h-3" />
                ) : notification.type === "campaign_post" ||
                  notification.type === "campaign_update" ||
                  notification.type === "new_campaign" ? (
                  <Megaphone className="w-3 h-3" />
                ) : (
                  <Bell className="w-3 h-3" />
                )}
                {notification.type.replace(/_/g, " ")}
              </span>

              {/* View campaign link for campaign types */}
              {isClickableLink && (
                <span className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">
                  <ExternalLink className="w-3 h-3" />
                  View Campaign
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Volunteer Accept / Reject ── */}
        {isVolunteerRequest && (
          <div className="mt-3 ml-13 pl-13">
            {notification.volunteerStatus === "loading" ? (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing…
              </div>
            ) : notification.volunteerStatus === "accepted" ? (
              <div className="flex items-center gap-1.5 text-sm text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                You accepted this request
              </div>
            ) : notification.volunteerStatus === "rejected" ? (
              <div className="flex items-center gap-1.5 text-sm text-red-400 font-medium">
                <XCircle className="w-4 h-4" />
                You rejected this request
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onVolunteerAction(notification, "accepted");
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 text-sm font-medium transition-all hover:shadow-sm hover:shadow-emerald-500/10"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Accept
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onVolunteerAction(notification, "rejected");
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 text-sm font-medium transition-all hover:shadow-sm hover:shadow-red-500/10"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
