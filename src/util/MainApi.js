const DEFAULT_TIMEOUT = 15000;

function getBaseUrl() {
    return process.env.NEXT_PUBLIC_API_BASE_URL || '';
}

function buildUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const baseUrl = getBaseUrl();

    return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}

function getStoredToken() {
    if (typeof window === 'undefined') return '';

    const localToken = localStorage.getItem('accessToken');
    if (localToken) return localToken;

    try {
        const authData = JSON.parse(localStorage.getItem('authData') || 'null');
        return authData?.accessToken || authData?.token || authData?.data?.token || '';
    } catch {
        return '';
    }
}

function getHeaders(includeJson = true) {
    const headers = {};
    const token = getStoredToken();

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (includeJson) {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
}

async function request(path, { method = 'GET', body, headers = {}, timeout = DEFAULT_TIMEOUT, ...restOptions } = {}) {
    const url = buildUrl(path);
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const requestHeaders = {
        ...getHeaders(!isFormData),
        ...headers,
    };

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), timeout) : null;

    try {
        const fetchOptions = {
            method,
            headers: requestHeaders,
            credentials: 'include',
            ...restOptions,
            signal: controller?.signal,
        };

        if (body !== undefined && body !== null) {
            fetchOptions.body = isFormData ? body : JSON.stringify(body);
        }

        const response = await fetch(url, fetchOptions);
        const contentType = response.headers.get('content-type') || '';
        let responseData = null;

        if (contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }

        if (!response.ok) {
            const error = new Error(responseData?.message || responseData?.error || 'Request failed');
            error.status = response.status;
            error.response = responseData;
            throw error;
        }

        return responseData;
    } catch (error) {
        if (error?.name === 'AbortError') {
            const timeoutError = new Error('Request timed out');
            timeoutError.status = 408;
            throw timeoutError;
        }

        throw error;
    } finally {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }
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
    delete(path, body, options) {
        return request(path, { ...options, method: 'DELETE', body });
    },
    dashboard: {
        summary(role, options) {
            return request(`/api/v1/dashboard/${role}/summary`, { ...options, method: 'GET' });
        },
        stats(role, options) {
            return request(`/api/v1/dashboard/${role}/stats`, { ...options, method: 'GET' });
        },
        list(role, resource, options) {
            return request(`/api/v1/dashboard/${role}/${resource}`, { ...options, method: 'GET' });
        },
    },
};

export default MainApi;
