import axios from 'axios';
import { removeAuthDetails } from "../lib/cookies";

// Function to call the backend API for login
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      'https://cu4k2opuzs5je5i3bq5v5sj7li0gamjd.lambda-url.eu-west-2.on.aws/api/auth/login',
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