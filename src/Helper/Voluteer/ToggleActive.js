import axios from "axios";

async function toggleVolunteerActive(userId, pincode) {
  try {
    const { data } = await axios.post("/api/volunteer/toggle", {
      userId,
      pincode,
    });

    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to toggle volunteer active status";

    console.error("Error toggling volunteer status:", message);
    throw new Error(message);
  }
}

export default toggleVolunteerActive;