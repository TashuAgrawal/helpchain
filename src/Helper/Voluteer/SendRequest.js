import axios from "axios";

async function sendVolunteerRequest(requestData) {
  try {
    const { data } = await axios.post(
      "/api/volunteer/send-request",
      requestData
    );

    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to send volunteer request";

    console.error("Error sending volunteer request:", message);
    throw new Error(message);
  }
}

export default sendVolunteerRequest;