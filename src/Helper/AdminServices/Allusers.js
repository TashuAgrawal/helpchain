import axios from "axios";

async function fetchAllUsers() {
  try {
    const response = await axios.get("/api/admin/users");

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch users");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export default fetchAllUsers;
