import axios from "axios";

async function toggleBookmark(userId, ngoId) {
  try {
    const response = await axios.post("/api/bookmarks/toggle", { userId, ngoId });
    return response.data;
  } catch (error) {
    console.error("Failed to toggle bookmark:", error);
    throw error;
  }
}

export default toggleBookmark;
