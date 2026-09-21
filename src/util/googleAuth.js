const GOOGLE_IDENTITY_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
const GOOGLE_LOGIN_SETUP_ERROR = 'Google login could not start. Please make sure this domain is added in Google OAuth Authorized JavaScript origins.';
const DEFAULT_GOOGLE_CLIENT_ID = '984741326316-g9c7ang3c593tp5tgqc8l7b5i3fv5gm2.apps.googleusercontent.com';

let googleScriptPromise;

function getGoogleClientId() {
    return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENTID || DEFAULT_GOOGLE_CLIENT_ID;
}

function loadGoogleIdentityScript() {
    if (typeof window === 'undefined') {
        return Promise.reject(new Error('Google login is available only in the browser.'));
    }

    if (window.google?.accounts?.id) {
        return Promise.resolve();
    }

    if (googleScriptPromise) {
        return googleScriptPromise;
    }

    googleScriptPromise = new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${GOOGLE_IDENTITY_SCRIPT_SRC}"]`);

        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(), { once: true });
            existingScript.addEventListener('error', () => reject(new Error('Unable to load Google login.')), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = GOOGLE_IDENTITY_SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Unable to load Google login.'));
        document.head.appendChild(script);
    });

    return googleScriptPromise;
}

export async function requestGoogleIdToken() {
    const clientId = getGoogleClientId();

    if (!clientId) {
        throw new Error('Google login is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID.');
    }

    await loadGoogleIdentityScript();

    return new Promise((resolve, reject) => {
        let settled = false;

        const finish = (handler, value) => {
            if (settled) return;
            settled = true;
            window.clearTimeout(timeoutId);
            handler(value);
        };

        const getPromptError = (reason, fallbackMessage) => {
            if (!reason || reason === 'unknown_reason') {
                return new Error(GOOGLE_LOGIN_SETUP_ERROR);
            }

            return new Error(fallbackMessage || reason);
        };

        const timeoutId = window.setTimeout(() => {
            finish(reject, new Error('Google login timed out. Please try again.'));
        }, 120000);

        window.google.accounts.id.cancel();
        window.google.accounts.id.initialize({
            client_id: clientId,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false,
            callback: (response) => {
                if (response?.credential) {
                    finish(resolve, response.credential);
                    return;
                }

                finish(reject, new Error('Google login did not return an ID token.'));
            },
        });

        window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed?.()) {
                finish(reject, getPromptError(
                    notification.getNotDisplayedReason?.(),
                    'Google login could not be displayed.'
                ));
                return;
            }

            if (notification.isSkippedMoment?.()) {
                finish(reject, getPromptError(
                    notification.getSkippedReason?.(),
                    'Google login was skipped.'
                ));
                return;
            }

            if (notification.isDismissedMoment?.()) {
                finish(reject, getPromptError(
                    notification.getDismissedReason?.(),
                    'Google login was cancelled.'
                ));
            }
        });
    });
}
