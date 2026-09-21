const AUTH_LOADING_EVENT = 'immify-auth-loading';

export function showAuthLoading(title) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_LOADING_EVENT, { detail: title }));
  }
}

export function closeAuthLoading() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_LOADING_EVENT, { detail: '' }));
  }
}

export function subscribeAuthLoading(listener) {
  window.addEventListener(AUTH_LOADING_EVENT, listener);
  return () => window.removeEventListener(AUTH_LOADING_EVENT, listener);
}
