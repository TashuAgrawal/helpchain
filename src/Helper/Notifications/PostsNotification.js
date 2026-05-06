import axios from "axios";

async function sendCampaignPostNotification(notificationData) {
  try {
    const { data } = await axios.post(
      "/api/notifications/campaign-post",
      notificationData
    );

    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to send campaign notifications";

    console.error("Error sending campaign notifications:", message);
    throw new Error(message);
  }
}

export default sendCampaignPostNotification;