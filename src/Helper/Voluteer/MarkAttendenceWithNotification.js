import axios from "axios";

async function markVolunteerAttendance(attendanceData) {
  try {
    const { data } = await axios.post(
      "/api/notifications/volunteer-attendance",
      attendanceData
    );
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to mark attendance";

    console.error("Error marking attendance:", message);
    throw new Error(message);
  }
}

export default markVolunteerAttendance;