import axios from "axios";

async function fetchBookmarkedNGOs(userId) {
  try {
    const response = await axios.get(`/api/bookmarks/user/${userId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch bookmarked NGOs");
    }
  } catch (error) {
    console.error("Error fetching bookmarked NGOs:", error);
    throw error;
  }
}

export default fetchBookmarkedNGOs;
