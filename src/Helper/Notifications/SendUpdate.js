import axios from "axios";

async function sendCampaignUpdateNotification(payload) {
  try {
    const { data } = await axios.post(
      "/api/notifications/campaign-update",
      payload
    );

    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to send campaign update notifications";

    console.error("Error sending campaign update notifications:", message);
    throw new Error(message);
  }
}

export default sendCampaignUpdateNotification;