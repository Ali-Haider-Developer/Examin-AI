// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://zainattiq-examinie.hf.space';

// Helper function to construct API endpoints
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};
