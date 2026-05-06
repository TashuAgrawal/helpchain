import axios from "axios";

async function acceptVolunteerRequest(payload) {
  try {
    const { data } = await axios.post(
      "/api/volunteer/request/respond-request",
      payload
    );

    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to accept volunteer request";

    console.error("Error accepting volunteer request:", message);
    throw new Error(message);
  }
}

export default acceptVolunteerRequest;