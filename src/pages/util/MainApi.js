import axios from 'axios';
import { getLoginPath, getVendorType, normalizeRole } from './authRouting';

const API_BASE_URL = 'https://api.trip-z.in';
const REFRESH_ENDPOINTS = ['/api/v1/auth/refresh'];
let authRedirectStarted = false;

function isRequestForEndpoint(config, endpoints) {
  return endpoints.some((endpoint) => config?.url?.includes(endpoint));
}

function getStoredAccessToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('accessToken') || '';
}

function getStoredRefreshToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('refreshToken') || '';
}

export function getUserRole() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('userRole') || '';
}

function isAccessTokenExpired(token) {
  if (typeof window === 'undefined' || !token) return false;

  try {
    const payload = token.split('.')[1];
    if (!payload) return false;

    const normalizedPayload = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(payload.length / 4) * 4, '=');
    const decodedPayload = JSON.parse(window.atob(normalizedPayload));

    return Boolean(decodedPayload?.exp && decodedPayload.exp * 1000 <= Date.now());
  } catch {
    return false;
  }
}

function isRefreshTokenExpired() {
  if (typeof window === 'undefined') return true;

  const refreshExpiresAt = localStorage.getItem('refreshExpiresAt');
  return Boolean(refreshExpiresAt && new Date(refreshExpiresAt).getTime() <= Date.now());
}

function readStoredJson(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function clearStoredTokens() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('authData');
  localStorage.removeItem('userData');
  localStorage.removeItem('UserData');
  localStorage.removeItem('userRole');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('refreshExpiresAt');
  document.cookie = 'tripz_auth=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'tripz_role=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'tripz_kyc=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'tripz_kyc_status=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'tripz_vendor_type=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'tripz_next_step=; path=/; max-age=0; SameSite=Lax';
  window.dispatchEvent(new Event('tripz-auth-change'));
}

function getLoginRedirectPath() {
  if (typeof window === 'undefined') return '/user/login';

  const storedRole = normalizeRole(localStorage.getItem('userRole'));
  const storedUser = readStoredJson('userData') || readStoredJson('UserData') || {};
  const authData = readStoredJson('authData') || {};
  const role = storedRole || normalizeRole(storedUser?.role || authData?.role || authData?.data?.user?.role);
  const payload = storedUser || authData || {};

  return getLoginPath(role, payload) || '/user/login';
}

function createSilentAuthError() {
  const error = new Error('AUTH_SESSION_EXPIRED');
  error.silentAuthRedirect = true;
  return error;
}

function redirectToLogin(loginPath = getLoginRedirectPath()) {
  if (typeof window === 'undefined' || authRedirectStarted) return;

  authRedirectStarted = true;
  const currentPath = `${window.location.pathname}${window.location.search}`;

  if (currentPath !== loginPath) {
    window.location.replace(loginPath);
  }
}

function handleAuthSessionExpired() {
  const loginPath = getLoginRedirectPath();
  clearStoredTokens();
  redirectToLogin(loginPath);
}

function stopPageErrorHandling() {
  return new Promise(() => {});
}

function saveRefreshedTokens(payload) {
  if (typeof window === 'undefined') return '';

  const data = payload?.data || payload || {};
  const accessToken = data.accessToken || data.access_token || '';
  const refreshToken = data.refreshToken || data.refresh_token || getStoredRefreshToken();
  const refreshExpiresAt = data.refreshExpiresAt || data.refresh_expires_at || '';

  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  if (refreshExpiresAt) localStorage.setItem('refreshExpiresAt', refreshExpiresAt);

  return accessToken;
}

async function refreshAccessToken() {
  const refreshToken = getStoredRefreshToken();

  if (!refreshToken || isRefreshTokenExpired()) {
    handleAuthSessionExpired();
    throw createSilentAuthError();
  }

  let response;

  for (const endpoint of REFRESH_ENDPOINTS) {
    try {
      response = await axios.post(
        `${API_BASE_URL}${endpoint}`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
      break;
    } catch (error) {
      if (endpoint === REFRESH_ENDPOINTS[REFRESH_ENDPOINTS.length - 1]) {
        handleAuthSessionExpired();
        throw createSilentAuthError();
      }
    }
  }

  const accessToken = saveRefreshedTokens(response?.data);

  if (!accessToken) {
    handleAuthSessionExpired();
    throw createSilentAuthError();
  }

  return accessToken;
}

const MainApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

MainApi.interceptors.request.use((config) => {
  return (async () => {
    // Let the browser set multipart boundaries for FormData requests.
    if (typeof FormData !== 'undefined' && config?.data instanceof FormData) {
      config.headers = config.headers || {};

      if (typeof config.headers.delete === 'function') {
        config.headers.delete('Content-Type');
        config.headers.delete('content-type');
      } else {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
      }
    }

    let accessToken = getStoredAccessToken();
    const skipAuth = config.skipAuth === true;
    const isRefreshRequest = isRequestForEndpoint(config, REFRESH_ENDPOINTS);

    if (accessToken && !skipAuth && !isRefreshRequest && isAccessTokenExpired(accessToken)) {
      try {
        accessToken = await refreshAccessToken();
      } catch (error) {
        if (error?.silentAuthRedirect) return stopPageErrorHandling();
        throw error;
      }
    }

    if (accessToken && !skipAuth && !isRefreshRequest) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  })();
});

MainApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const skipAuth = originalRequest?.skipAuth === true;
    const isRefreshRequest = isRequestForEndpoint(originalRequest, REFRESH_ENDPOINTS);

    if ((status === 401 || status === 403) && originalRequest && !originalRequest._retry && !skipAuth && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        const accessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return MainApi(originalRequest);
      } catch (refreshError) {
        handleAuthSessionExpired();
        if (refreshError?.silentAuthRedirect) return stopPageErrorHandling();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { MainApi };
export default MainApi;
