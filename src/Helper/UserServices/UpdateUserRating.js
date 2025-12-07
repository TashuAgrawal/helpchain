
import axios from "axios";

async function updateUserRating(ngoId, userId, rating) {
  try {
    const response = await axios.put(`/api/ratings/ngo/${ngoId}/user/${userId}`, { rating });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to update user rating");
    }
  } catch (error) {
    console.error("Error updating user rating:", error);
    throw error;
  }
}

export {updateUserRating };
