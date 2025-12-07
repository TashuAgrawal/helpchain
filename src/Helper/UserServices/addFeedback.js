import axios from "axios";

async function addFeedback(feedbackData) {
  try {
    const response = await axios.post(`/api/feedback/add`, feedbackData);
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error("Failed to add feedback");
    }
  } catch (error) {
    console.error("Error adding feedback:", error);
    throw error;
  }
}

export default addFeedback;
