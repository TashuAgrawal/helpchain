import axios from "axios";

async function addCampaign(campaignData) {
  try {
    const response = await axios.post("/api/campaigns/add", campaignData);

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to add campaign");
    }
  } catch (error) {
    console.error("Error adding campaign:", error);
    throw error;
  }
}

export default addCampaign;
