// Placeholder for environment variables. You should ensure these are correctly loaded from your Vite environment.
// For example, if you have a `src/config.ts` or similar:
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { API_BASE_URL, BOOKS_API_BASE_URL, PAGES_API_BASE_URL } from '@constants'; // Import new constants

// Utility to get a cookie by name
function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i=0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

interface RequestOptions extends RequestInit {
  url: string;
  followRedirect?: boolean;
  isAuthCheck?: boolean; // New option to indicate an authentication check
  isMultipart?: boolean; // New option for multipart form data
}

// Helper to determine if an endpoint is on the backend's CSRF ignore list
const isCsrfIgnoredEndpoint = (requestUrl: string) => {
  const url = new URL(requestUrl);
  const path = url.pathname;
  // These paths are ignored by Spring Security's CSRF filter in SecurityConfig.java
  return path.startsWith('/auth/') || 
         path.startsWith('/user/verify-email/request') || 
         path.startsWith('/user/verify-email/confirm') ||
         path.match(/^\/api\/books\/\d+\/pages\/mass-upload$/) || // Match /api/books/{bookId}/pages/mass-upload
         path.match(/^\/api\/books\/\d+\/pages\/all$/); // Match /api/books/{bookId}/pages/all
};

const request = async (options: RequestOptions): Promise<any> => {
  const headers = new Headers();

  const { url, followRedirect = false, isAuthCheck = false, isMultipart = false, ...rest } = options;

  console.log('APIUtils.ts: Current cookies before request:', document.cookie);

  // For state-changing requests (POST, PUT, DELETE) AND if the endpoint is NOT on the CSRF ignore list, add CSRF token
  if (options.method && ['POST', 'PUT', 'DELETE'].includes(options.method.toUpperCase()) && !isCsrfIgnoredEndpoint(url)) {
    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
      headers.append('X-XSRF-TOKEN', csrfToken);
      console.log('APIUtils.ts: X-XSRF-TOKEN header added.');
    } else {
      console.warn('APIUtils.ts: CSRF token (XSRF-TOKEN) not found in cookies for state-changing request to a protected endpoint. This might cause a 403 Forbidden.');
    }
  } else if (options.method && ['POST', 'PUT', 'DELETE'].includes(options.method.toUpperCase()) && isCsrfIgnoredEndpoint(url)) {
    console.log(`APIUtils.ts: CSRF token not sent for ignored endpoint: ${url}`);
  }

  // Set Content-Type only if it's not a multipart request
  if (!isMultipart) {
    headers.append('Content-Type', 'application/json');
  }

  const fetchOptions: RequestInit = {
    ...rest,
    headers,
    redirect: followRedirect ? 'follow' : 'manual',
    credentials: 'include',
  };

  try {
    const response = await fetch(url, fetchOptions);

    // If we are manually handling redirects (i.e., followRedirect is false)
    if (!followRedirect && response.status >= 300 && response.status < 400 && response.headers.has('Location')) {
      const redirectUrl = response.headers.get('Location');
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return new Promise(() => {}); // Stop further execution
      }
    }

    // Handle 401 specifically for authentication checks
    if (response.status === 401 && isAuthCheck) {
      console.log('Frontend: Received 401 for authentication check, returning null.');
      return null; // Return null for unauthenticated state
    }

    const responseText = await response.text();
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
  // No need to check localStorage for token, browser sends HttpOnly cookie automatically
  return request({
    url: `${API_BASE_URL}/user/me`,
    method: 'GET',
    isAuthCheck: true, // Indicate this is an auth check
  });
}

export function login(loginRequest: Record<string, any>): Promise<any> {
  return request({
    url: `${API_BASE_URL}/auth/login`,
    method: 'POST',
    body: JSON.stringify(loginRequest),
    redirect: 'manual', // Explicitly set to manual
  });
}

export function signup(signupRequest: Record<string, any>): Promise<any> {
  return request({
    url: `${API_BASE_URL}/auth/signup`,
    method: 'POST',
    body: JSON.stringify(signupRequest),
  });
}

export function logout(): Promise<any> {
  return request({
    url: `${API_BASE_URL}/auth/logout`,
    method: 'POST', // Logout is a state-changing operation
  });
}

export function forgotPassword(email: string, lang: string): Promise<any> {
  return request({
    url: `${API_BASE_URL}/auth/forgot-password`,
    method: 'POST',
    body: JSON.stringify({ email, lang }),
  });
}

export function resetPassword(token: string, newPassword: string): Promise<any> {
  return request({
    url: `${API_BASE_URL}/auth/reset-password`,
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}

export function updateUserProfile(updateRequest: { name: string; email: string }): Promise<any> {
  return request({
    url: `${API_BASE_URL}/user/me`,
    method: 'PUT',
    body: JSON.stringify(updateRequest),
  });
}

export function requestEmailVerification(): Promise<any> {
  return request({
    url: `${API_BASE_URL}/user/verify-email/request`,
    method: 'POST',
  });
}

export function confirmEmailVerification(token: string): Promise<any> {
  return request({
    url: `${API_BASE_URL}/user/verify-email/confirm`, // No token in URL
    method: 'POST', // Changed to POST
    body: JSON.stringify({ token }), // Token in body
  });
}

// --- Book API Calls ---

interface BookRequest {
  languageIso: string;
  title: string;
  subtitle?: string;
  authorName?: string;
  description?: string;
  keywords?: string;
  coverImageFilename?: string;
}

export interface BookResponse {
  id: number;
  userId: number;
  coverImageFilename?: string;
  languageIso: string;
  title: string;
  subtitle?: string;
  authorName?: string;
  description?: string;
  keywords?: string;
  pages?: PageResponse[];
  createdAt: string;
  updatedAt: string;
}

interface PageRequest {
  pageNumber: number;
  imageFilename?: string;
  description?: string;
}

export interface PageResponse {
  id: number;
  bookId: number;
  pageNumber: number;
  imageFilename?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page number (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
}

export function getAllBooks(page: number, size: number, sort: string, search?: string): Promise<PaginatedResponse<BookResponse>> {
  let url = `${BOOKS_API_BASE_URL}?page=${page}&size=${size}&sort=${sort}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  return request({
    url: url,
    method: 'GET',
  });
}

export function getBookById(bookId: number): Promise<BookResponse> {
  return request({
    url: `${BOOKS_API_BASE_URL}/${bookId}`,
    method: 'GET',
  });
}

export function createBook(bookRequest: BookRequest): Promise<BookResponse> {
  return request({
    url: BOOKS_API_BASE_URL,
    method: 'POST',
    body: JSON.stringify(bookRequest),
  });
}

export function updateBook(bookId: number, bookRequest: BookRequest): Promise<BookResponse> {
  return request({
    url: `${BOOKS_API_BASE_URL}/${bookId}`,
    method: 'PUT',
    body: JSON.stringify(bookRequest),
  });
}

export function deleteBook(bookId: number): Promise<any> {
  return request({
    url: `${BOOKS_API_BASE_URL}/${bookId}`,
    method: 'DELETE',
  });
}

// --- Page API Calls ---

export function getPagesByBookId(bookId: number): Promise<PageResponse[]> {
  return request({
    url: PAGES_API_BASE_URL(bookId),
    method: 'GET',
  });
}

export function getPageById(bookId: number, pageId: number): Promise<PageResponse> {
  return request({
    url: `${PAGES_API_BASE_URL(bookId)}/${pageId}`,
    method: 'GET',
  });
}

export function addPageToBook(bookId: number, pageRequest: PageRequest): Promise<PageResponse> {
  return request({
    url: PAGES_API_BASE_URL(bookId),
    method: 'POST',
    body: JSON.stringify(pageRequest),
  });
}

export function updatePage(bookId: number, pageId: number, pageRequest: PageRequest): Promise<PageResponse> {
  return request({
    url: `${PAGES_API_BASE_URL(bookId)}/${pageId}`,
    method: 'PUT',
    body: JSON.stringify(pageRequest),
  });
}

export function deletePage(bookId: number, pageId: number): Promise<any> {
  return request({
    url: `${PAGES_API_BASE_URL(bookId)}/${pageId}`,
    method: 'DELETE',
  });
}

interface MovePageRequest {
  oldPageNumber: number;
  newPageNumber: number;
}

export function reorderPages(bookId: number, movePageRequest: MovePageRequest): Promise<any> {
  return request({
    url: `${PAGES_API_BASE_URL(bookId)}/reorder`,
    method: 'POST',
    body: JSON.stringify(movePageRequest),
  });
}

export function uploadPageImage(bookId: number, pageId: number, file: File): Promise<PageResponse> {
  const formData = new FormData();
  formData.append('file', file);

  return request({
    url: `${PAGES_API_BASE_URL(bookId)}/${pageId}/upload-image`,
    method: 'POST',
    body: formData,
    isMultipart: true, // Indicate multipart form data
  });
}

export function deletePageImage(bookId: number, pageId: number): Promise<any> {
  return request({
    url: `${PAGES_API_BASE_URL(bookId)}/${pageId}/image`,
    method: 'DELETE',
  });
}

export function massUploadPages(bookId: number, files: File[]): Promise<PageResponse[]> {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file); // Use 'files' as the parameter name for multiple files
  });

  return request({
    url: `${PAGES_API_BASE_URL(bookId)}/mass-upload`,
    method: 'POST',
    body: formData,
    isMultipart: true,
  });
}

export function deleteAllPages(bookId: number): Promise<any> {
  return request({
    url: `${PAGES_API_BASE_URL(bookId)}/all`,
    method: 'DELETE',
  });
}