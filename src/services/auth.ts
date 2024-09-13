import axios from 'axios';
import { removeAuthDetails } from "../lib/cookies";

// Function to call the backend API for login
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
      { email, password }
    );

    // Ensure response.data structure matches what you expect
    const { data } = response;
    if (data.data && data.data.token && data.data.user) {
      return {
        token: data.data.token,
        user: data.data.user
      };
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}

export const signOut = () => {
  // Remove the JWT token from cookies
  removeAuthDetails ();

  // Redirect to login page
  window.location.href = "/login";
};