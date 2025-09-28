// Placeholder for environment variables. You should ensure these are correctly loaded from your Vite environment.
// For example, if you have a `src/config.ts` or similar:
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { ACCESS_TOKEN, API_BASE_URL, BOOKS_API_BASE_URL, PAGES_API_BASE_URL } from '@constants'; // Import new constants


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
    const response = await fetch(url, fetchOptions);

    // If we are manually handling redirects (i.e., followRedirect is false)
    if (!followRedirect && response.status >= 300 && response.status < 400 && response.headers.has('Location')) {
      const redirectUrl = response.headers.get('Location');
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return new Promise(() => {}); // Stop further execution
      }
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
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (!token) {
    console.warn('getCurrentUser: No access token found in localStorage.');
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

export function forgotPassword(email: string): Promise<any> {
  return request({
    url: `${API_BASE_URL}/auth/forgot-password`,
    method: 'POST',
    body: JSON.stringify({ email }),
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
    url: `${API_BASE_URL}/user/verify-email/confirm?token=${token}`,
    method: 'GET',
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

interface BookResponse {
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

interface PageResponse {
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

export function createBook(bookRequest: CreateBookRequest): Promise<BookResponse> {
  return request({
    url: BOOKS_API_BASE_URL,
    method: 'POST',
    body: JSON.stringify(bookRequest),
  });
}

export function updateBook(bookId: number, bookRequest: UpdateBookRequest): Promise<BookResponse> {
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

export function addPageToBook(bookId: number, pageRequest: CreatePageRequest): Promise<PageResponse> {
  return request({
    url: PAGES_API_BASE_URL(bookId),
    method: 'POST',
    body: JSON.stringify(pageRequest),
  });
}

export function updatePage(bookId: number, pageId: number, pageRequest: UpdatePageRequest): Promise<PageResponse> {
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