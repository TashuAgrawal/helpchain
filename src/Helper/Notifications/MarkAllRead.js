import axios from "axios";

/**
 * Mark ALL notifications for a user as read
 * @param {string} userId
 */
async function markAllNotificationsRead(userId) {
  try {
    const { data } = await axios.patch("/api/notifications/mark-all-read", {
      userId,
    });
    return data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      "Failed to mark all notifications as read";
    console.error("Error marking all notifications as read:", message);
    throw new Error(message);
  }
}

export default markAllNotificationsRead;
