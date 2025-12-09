import axios from "axios";

async function UpdateRaisedAmount(campaignData) {
    try {
        const response = await axios.post("/api/campaigns/update-raised", campaignData);
        return response;
    } catch (error) {
        console.error("Error adding campaign:", error);
        throw error;
    }
}

export default UpdateRaisedAmount;
