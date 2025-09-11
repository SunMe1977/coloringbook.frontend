// Placeholder for environment variables. You should ensure these are correctly loaded from your Vite environment.
// For example, if you have a `src/config.ts` or similar:
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { ACCESS_TOKEN } from '../constants'; // Import ACCESS_TOKEN from constants file

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';


interface RequestOptions extends RequestInit {
  url: string;
  followRedirect?: boolean;
}

const request = async (options: RequestOptions): Promise<any> => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  if (accessToken) {
    headers.append('Authorization', `Bearer ${accessToken}`);
  }

  const { url, followRedirect = false, ...rest } = options;
  const fetchOptions: RequestInit = {
    ...rest,
    headers,
    redirect: followRedirect ? 'follow' : 'manual',
  };

  try {
    console.log('Frontend: Sending request to:', url, 'with options:', fetchOptions); // NEW: Log request details
    const response = await fetch(url, fetchOptions);
    console.log('Frontend: Backend response status:', response.status);

    // If we are manually handling redirects (i.e., followRedirect is false)
    if (!followRedirect && response.status >= 300 && response.status < 400 && response.headers.has('Location')) {
      const redirectUrl = response.headers.get('Location');
      if (redirectUrl) {
        console.log('Frontend: Redirecting to:', redirectUrl); // NEW: Log redirect
        window.location.href = redirectUrl;
        return new Promise(() => {}); // Stop further execution
      }
    }

    const responseText = await response.text();
    console.log('Frontend: Backend response (raw text):', responseText);

    if (!response.ok) {
      try {
        const json = JSON.parse(responseText);
        return Promise.reject(json);
      } catch (parseError) {
        console.error('Frontend: Failed to parse error response as JSON:', parseError, 'Raw text:', responseText); // More detailed error
        return Promise.reject({ message: responseText || 'Unknown error occurred.' });
      }
    }

    // If response is OK, parse as JSON
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('Frontend: Failed to parse successful response as JSON:', parseError, 'Raw text:', responseText); // More detailed error
      if (response.status === 204 || responseText.trim() === '') {
          return {}; // Return an empty object for No Content
      }
      return Promise.reject({ message: 'Failed to parse successful response.' });
    }

  } catch (error) {
    console.error('Frontend: Network or fetch error caught:', error); // NEW: Catch and log network errors
    return Promise.reject(error);
  }
};


export function getCurrentUser(): Promise<any> {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (!token) {
    return Promise.reject('No access token set.');
  }

  return request({
    url: `${API_BASE_URL}/user/me`,
    method: 'GET',
  });
}

export function login(loginRequest: Record<string, any>): Promise<any> {
  return request({
    url: `${API_BASE_URL}/auth/login`,
    method: 'POST',
    body: JSON.stringify(loginRequest),
    // Removed followRedirect: true, as backend will now return JSON directly
  });
}

export function signup(signupRequest: Record<string, any>): Promise<any> {
  return request({
    url: `${API_BASE_URL}/auth/signup`,
    method: 'POST',
    body: JSON.stringify(signupRequest),
  });
}