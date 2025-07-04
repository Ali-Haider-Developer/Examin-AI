import { isTokenExpired, refreshAccessToken } from './isTokenExpired';

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  if (typeof window === 'undefined') {
    return false; // Not authenticated on server-side
  }

  const token = localStorage.getItem('access_token');

  if (!token) {
    return false; // No token found
  }

  try {
    // Check if token is expired
    if (isTokenExpired(token)) {
      // Try to refresh the token
      try {
        await refreshAccessToken();
        return true; // Successfully refreshed token
      } catch (error) {
        // Failed to refresh token
        console.error('Failed to refresh token:', error);
        return false;
      }
    }

    // Token is valid
    return true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Redirect to login if not authenticated
export const redirectToLogin = (router: any, reason?: string) => {
  // Clear any auth data
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');

  // Redirect to login page with reason if provided
  if (reason) {
    router.push(`/login?reason=${reason}`);
  } else {
    router.push('/login');
  }
};

// Protect route - use this in useEffect of protected pages
export const protectRoute = async (router: any): Promise<boolean> => {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    const token = localStorage.getItem('access_token');

    // If token exists but is expired, use session_expired reason
    if (token && isTokenExpired(token)) {
      redirectToLogin(router, 'session_expired');
    } else {
      // Otherwise, use auth_required reason
      redirectToLogin(router, 'auth_required');
    }
    return false;
  }

  return true;
};
