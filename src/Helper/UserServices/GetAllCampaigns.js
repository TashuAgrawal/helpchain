import axios from "axios";

async function fetchAllCampaigns() {
  try {
    const response = await axios.get("/api/campaigns");
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch campaigns");
    }
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
}

export default fetchAllCampaigns;
