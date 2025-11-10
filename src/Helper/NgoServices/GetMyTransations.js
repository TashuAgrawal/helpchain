import axios from "axios";

async function fetchTransactionsByNgoId(ngoId) {
  try {
    const response = await axios.get(`/api/transactions/ngo/${ngoId}`);
    if (response.status === 200) {
      return response.data; // Array of transaction objects
    } else {
      throw new Error("Failed to fetch transactions");
    }
  } catch (error) {
    console.error("Error fetching transactions by NGO ID:", error);
    throw error;
  }
}

export default fetchTransactionsByNgoId;
