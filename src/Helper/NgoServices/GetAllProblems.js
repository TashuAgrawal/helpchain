import axios from "axios";

async function fetchAllCommunityProblems(authToken) {
  try {
    const response = await axios.get("/api/community-problems");

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch community problems");
    }
  } catch (error) {
    console.error("Error fetching community problems:", error);
    throw error;
  }
}

export default fetchAllCommunityProblems;
