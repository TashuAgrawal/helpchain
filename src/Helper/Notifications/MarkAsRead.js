import axios from "axios";

/**
 * Mark a single notification as read
 * @param {string} notificationId - MongoDB _id of the notification
 */
async function markNotificationAsRead(notificationId) {
  try {
    const { data } = await axios.patch(
      `/api/notifications/${notificationId}/read`
    );
    return data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      "Failed to mark notification as read";
    console.error("Error marking notification as read:", message);
    throw new Error(message);
  }
}

export default markNotificationAsRead;
