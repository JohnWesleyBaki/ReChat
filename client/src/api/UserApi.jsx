import axios from "axios";

const API_URL = "http://localhost:5050";

const getContacts = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/friends/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

const addFriend = async (userId, friendId) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/${userId}/friends/${friendId}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getRandomUser = async () => {
  try {
    const userId = localStorage.getItem("userId");
    const response = await axios.get(`${API_URL}/random/user`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      params: { userId }, // Exclude the current user
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching random user:", error);
    throw error;
  }
};

export { getContacts, addFriend, getRandomUser };
