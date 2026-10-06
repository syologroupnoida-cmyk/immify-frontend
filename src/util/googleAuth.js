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

function createGoogleButtonDialog({ onClose }) {
    const overlay = document.createElement('div');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.cssText = [
        'position:fixed',
        'inset:0',
        'z-index:9999',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'background:rgba(15,23,42,0.48)',
        'padding:20px',
    ].join(';');

    const panel = document.createElement('div');
    panel.style.cssText = [
        'width:min(360px,100%)',
        'border-radius:12px',
        'background:#fff',
        'box-shadow:0 24px 60px rgba(15,23,42,0.25)',
        'padding:22px',
        'font-family:Inter,Roboto,Arial,sans-serif',
        'text-align:center',
    ].join(';');

    const title = document.createElement('div');
    title.textContent = 'Continue with Google';
    title.style.cssText = 'color:#0f172a;font-size:18px;font-weight:700;margin-bottom:8px';

    const subtitle = document.createElement('div');
    subtitle.textContent = 'Choose your Google account to continue.';
    subtitle.style.cssText = 'color:#64748b;font-size:14px;margin-bottom:18px';

    const buttonHost = document.createElement('div');
    buttonHost.style.cssText = 'display:flex;justify-content:center;min-height:44px';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.textContent = 'Cancel';
    closeButton.style.cssText = [
        'margin-top:16px',
        'border:1px solid #cbd5e1',
        'border-radius:8px',
        'background:#fff',
        'color:#334155',
        'font-size:14px',
        'font-weight:600',
        'padding:8px 14px',
        'cursor:pointer',
    ].join(';');

    const close = () => {
        overlay.remove();
    };

    closeButton.addEventListener('click', () => {
        close();
        onClose?.();
    });

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            close();
            onClose?.();
        }
    });

    panel.appendChild(title);
    panel.appendChild(subtitle);
    panel.appendChild(buttonHost);
    panel.appendChild(closeButton);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    return { buttonHost, close };
}

export async function requestGoogleIdToken() {
    const clientId = getGoogleClientId();

    if (!clientId) {
        throw new Error('Google login is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID.');
    }

    await loadGoogleIdentityScript();

    return new Promise((resolve, reject) => {
        let settled = false;
        let dialog;

        const finish = (handler, value) => {
            if (settled) return;
            settled = true;
            window.clearTimeout(timeoutId);
            dialog?.close();
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

        dialog = createGoogleButtonDialog({
            onClose: () => finish(reject, new Error('Google login was cancelled.')),
        });

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

        try {
            window.google.accounts.id.renderButton(dialog.buttonHost, {
                type: 'standard',
                theme: 'outline',
                size: 'large',
                text: 'continue_with',
                shape: 'rectangular',
                logo_alignment: 'left',
                width: 280,
            });
        } catch (error) {
            finish(reject, getPromptError(error?.message, GOOGLE_LOGIN_SETUP_ERROR));
        }
    });
}
