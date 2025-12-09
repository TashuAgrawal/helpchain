import axios from "axios";

async function CheckFollowing(userId , ngoId) {
  try {
    const response = await axios.get(`/api/follow/user/${userId}/ngo/${ngoId}/check`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to CheckFollowing");
    }
  } catch (error) {
    console.error("Error CheckFollowing:", error);
    throw error;
  }
}

export default CheckFollowing;
