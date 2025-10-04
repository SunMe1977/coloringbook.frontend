export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const GOOGLE_AUTH_URL = `${API_BASE_URL}/oauth2/authorization/google`;
export const FACEBOOK_AUTH_URL = `${API_BASE_URL}/oauth2/authorization/facebook`;
export const GITHUB_AUTH_URL = `${API_BASE_URL}/oauth2/authorization/github`;

export const BOOKS_API_BASE_URL = `${API_BASE_URL}/api/books`;
export const PAGES_API_BASE_URL = (bookId: number | string) => `${BOOKS_API_BASE_URL}/${bookId}/pages`;

export const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dj64nuyqg/image/upload/';