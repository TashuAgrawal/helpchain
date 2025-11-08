import axios from "axios";

async function fetchPendingNgos() {
  try {
    const response = await axios.get("/api/admin/pending-ngos");

    if (response.status === 200) {
      return response.data; // Array of NGOs
    } else {
      throw new Error("Failed to fetch pending NGOs");
    }
  } catch (error) {
    console.error("Error fetching pending NGOs:", error);
    throw error;
  }
}

export default fetchPendingNgos;
