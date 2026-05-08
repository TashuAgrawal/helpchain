import axios from "axios";


async function handleNgoApproval(ngoId, action) {

  
  if (!ngoId || !['approve', 'reject','suspend'].includes(action)) {
    throw new Error("Invalid ngoId or action parameter");
  }

  try {
    const response = await axios.post(
      "/api/admin/handle-ngo",
      { ngoId, action },
    );


    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to handle NGO approval");
    }
  } catch (error) {
    console.error("Error handling NGO approval:", error);
    throw error;
  }
}

export default handleNgoApproval;
