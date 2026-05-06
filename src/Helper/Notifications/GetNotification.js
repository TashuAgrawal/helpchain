import axios from "axios";

async function getUserNotifications(userId) {
  try {
    const { data } = await axios.get(`/api/notifications/${userId}`);

    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch user notifications";

    console.error("Error fetching user notifications:", message);
    throw new Error(message);
  }
}

export default getUserNotifications;