import { API_BASE_URL, ACCESS_TOKEN } from '../constants';

interface RequestOptions extends RequestInit {
  url: string;
}

const request = (options: RequestOptions): Promise<any> => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  if (accessToken) {
    headers.append('Authorization', 'Bearer ' + accessToken);
  }

  const { url, ...rest } = options;
  const fetchOptions: RequestInit = {
    ...rest,
    headers,
  };

  return fetch(url, fetchOptions).then((response) =>
    response
      .json()
      .then((json) => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        return json;
      })
      .catch((err) => Promise.reject(err))
  );
};

export function getCurrentUser(): Promise<any> {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (!token) {
    return Promise.reject('No access token set.');
  }

  return request({
    url: API_BASE_URL + '/user/me',
    method: 'GET',
  });
}

export function login(loginRequest: Record<string, any>): Promise<any> {
  return request({
    url: API_BASE_URL + '/auth/login',
    method: 'POST',
    body: JSON.stringify(loginRequest),
  });
}

export function signup(signupRequest: Record<string, any>): Promise<any> {
  return request({
    url: API_BASE_URL + '/auth/signup',
    method: 'POST',
    body: JSON.stringify(signupRequest),
  });
}
