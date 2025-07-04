// Utility function to check if the access token is expired
import { API_BASE_URL } from './apiConfig';

export function isTokenExpired(token: string) {
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = tokenPayload.exp * 1000; // Convert to milliseconds
    return Date.now() > expiryTime;
  }

  // Function to refresh access token using refresh token
  export async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      throw new Error('No refresh token available.');
    }

    try {
      // Make a request to your backend or auth server to refresh the token
      const response = await fetch(`${API_BASE_URL}/auth/token/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh access token.');
      }

      const data = await response.json();

      // Store the new access token in local storage
      localStorage.setItem('access_token', data.access_token);

      // Optionally: Update the email or user data if returned
      if (data.email) {
        localStorage.setItem('email', data.email);
      }

      return data.access_token; // Return the new access token

    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }
