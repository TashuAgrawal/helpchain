import axios from "axios";

async function fetchUserTransactionsById(userId){
  try {
    const response = await axios.get(`/api/transactions/user/${userId}`);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch user transactions");
    }
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    throw error;
  }
}

export default fetchUserTransactionsById;
