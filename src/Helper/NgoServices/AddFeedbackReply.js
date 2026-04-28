import axios from "axios";

async function addFeedbackReply(replyData) {
  try {
    // Assuming your route is at /api/feedback/reply
    const response = await axios.post("/api/feedback/reply/add", replyData);

    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to add reply");
    }
  } catch (error) {
    // We catch the error and extract the message from the server if available
    const errorMessage = error.response?.data?.message || error.message || "Error adding reply";
    console.error("Error adding feedback reply:", errorMessage);
    throw new Error(errorMessage);
  }
}

export default addFeedbackReply;