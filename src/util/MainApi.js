import { getLoginPath, normalizeRole } from '@/util/authRouting';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.trip-z.in';
const REFRESH_ENDPOINTS = ['/api/v1/auth/refresh'];
let authRedirectStarted = false;

function buildUrl(path) {
    if (!path) return API_BASE_URL;
    if (/^https?:\/\//i.test(path)) return path;

    const normalizedBase = API_BASE_URL.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
}

function isRequestForEndpoint(url, endpoints) {
    return endpoints.some((endpoint) => url?.includes(endpoint));
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

async function parseResponseBody(response) {
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        return response.json();
    }

    return response.text();
}

async function refreshAccessToken() {
    const refreshToken = getStoredRefreshToken();

    if (!refreshToken || isRefreshTokenExpired()) {
        handleAuthSessionExpired();
        throw createSilentAuthError();
    }

    for (const endpoint of REFRESH_ENDPOINTS) {
        const response = await fetch(buildUrl(endpoint), {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (response.ok) {
            const accessToken = saveRefreshedTokens(await parseResponseBody(response));

            if (accessToken) {
                return accessToken;
            }
        }
    }

    handleAuthSessionExpired();
    throw createSilentAuthError();
}

function makeHttpError(response, data) {
    const message = data?.message || data?.msg || data?.error || response.statusText || 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    error.response = { status: response.status, data };
    return error;
}

async function request(path, { method = 'GET', body, headers = {}, skipAuth = false, _retry = false, ...restOptions } = {}) {
    const url = buildUrl(path);
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const isRefreshRequest = isRequestForEndpoint(url, REFRESH_ENDPOINTS);
    let accessToken = getStoredAccessToken();

    if (accessToken && !skipAuth && !isRefreshRequest && isAccessTokenExpired(accessToken)) {
        accessToken = await refreshAccessToken();
    }

    const requestHeaders = { ...headers };

    if (!isFormData && !requestHeaders['Content-Type'] && !requestHeaders['content-type']) {
        requestHeaders['Content-Type'] = 'application/json';
    }

    if (accessToken && !skipAuth && !isRefreshRequest) {
        requestHeaders.Authorization = `Bearer ${accessToken}`;
    }

    if (isFormData) {
        delete requestHeaders['Content-Type'];
        delete requestHeaders['content-type'];
    }

    const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: requestHeaders,
        body: body === undefined || body === null ? undefined : isFormData ? body : JSON.stringify(body),
        ...restOptions,
    });
    const data = await parseResponseBody(response);

    if ((response.status === 401 || response.status === 403) && !_retry && !skipAuth && !isRefreshRequest) {
        try {
            await refreshAccessToken();
            return request(path, { method, body, headers, skipAuth, _retry: true, ...restOptions });
        } catch (refreshError) {
            handleAuthSessionExpired();
            throw refreshError;
        }
    }

    if (!response.ok) {
        throw makeHttpError(response, data);
    }

    return { data, status: response.status };
}

const MainApi = {
    get(path, options) {
        return request(path, { ...options, method: 'GET' });
    },
    post(path, body, options) {
        return request(path, { ...options, method: 'POST', body });
    },
    put(path, body, options) {
        return request(path, { ...options, method: 'PUT', body });
    },
    patch(path, body, options) {
        return request(path, { ...options, method: 'PATCH', body });
    },
    delete(path, options) {
        return request(path, { ...options, method: 'DELETE' });
    },
    request,
};

export { MainApi };
export default MainApi;
