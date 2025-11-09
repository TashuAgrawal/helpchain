import axios from "axios";

/**
 * Fetches all campaigns for a specific NGO by ngoId.
 * 
 * @param {string} ngoId - NGO's MongoDB ObjectId string
 * @param {string} authToken - Authorization token if required
 * @returns {Promise<Array>} - Resolves to array of campaign objects
 */
async function fetchCampaignsByNgo(ngoId) {
  try {
    const response = await axios.get(`/api/campaigns/ngo/${ngoId}`);

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

export default fetchCampaignsByNgo;
