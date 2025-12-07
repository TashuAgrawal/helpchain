// src/Helper/NgoServices/GetUserRating.js
import axios from "axios";

async function getUserRating(ngoId, userId) {
  try {
    const response = await axios.get(`/api/ratings/ngo/${ngoId}/user/${userId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch user rating");
    }
  } catch (error) {
    console.error("Error fetching user rating:", error);
    throw error;
  }
}

export default getUserRating;
