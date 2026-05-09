import axios from "axios";

export async function deleteSelectedNotifications(notificationIds) {
  try {
    const response = await axios.delete("/api/notifications/delete", {
      data: { notificationIds },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting selected notifications:", error);
    throw error;
  }
}

export async function deleteAllNotifications(userId) {
  try {
    const response = await axios.delete("/api/notifications/delete", {
      data: { userId, deleteAll: true },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting all notifications:", error);
    throw error;
  }
}
