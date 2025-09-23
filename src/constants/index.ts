export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const OAUTH2_REDIRECT_URI = import.meta.env.VITE_OAUTH2_REDIRECT_URI || 'http://localhost:5173/oauth2/redirect';

export const ACCESS_TOKEN = 'accessToken';

export const GOOGLE_AUTH_URL = `${API_BASE_URL}/oauth2/authorization/google`;
export const FACEBOOK_AUTH_URL = `${API_BASE_URL}/oauth2/authorization/facebook`;
export const GITHUB_AUTH_URL = `${API_BASE_URL}/oauth2/authorization/github`;