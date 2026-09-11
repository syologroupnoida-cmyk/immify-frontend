export const ROLE_DASHBOARD_PATHS = {
    client: '/dashboard/customer',
    customer: '/dashboard/customer',
    user: '/dashboard/customer',
    agent: '/dashboard/agent',
    vendor: '/dashboard/agent',
    partner: '/dashboard/partner',
    admin: '/dashboard/admin',
    superadmin: '/dashboard/superadmin',
    super_admin: '/dashboard/superadmin',
};

const KYC_COMPLETE_STATUSES = [
    'approved',
    'approved_by_admin',
];

const KYC_INCOMPLETE_STEPS = [
    'complete_kyc',
    'kyc',
    'start_kyc',
    'submit_kyc',
    'resubmit_kyc',
];

export function normalizeRole(role) {
    if (!role) return '';

    const value = String(role).trim().toLowerCase().replace(/[\s-]+/g, '_');
    const roleMap = {
        superadmin: 'superadmin',
        super_admin: 'superadmin',
        admin: 'admin',
        agent: 'agent',
        travel_agent: 'agent',
        partner: 'partner',
        property_owner: 'partner',
        vendor: 'partner',
        customer: 'customer',
        client: 'customer',
        user: 'customer',
        traveler: 'customer',
    };

    return roleMap[value] || value;
}

export function normalizeVendorType(vendorType) {
    return String(vendorType || '').trim().toUpperCase().replace(/[\s-]+/g, '_');
}

function firstValue(...values) {
    return values.find((value) => value !== undefined && value !== null && value !== '');
}

function isTruthyKycFlag(value) {
    if (value === true || value === 1) return true;
    if (value === false || value === 0 || value === undefined || value === null || value === '') return false;

    return ['true', 'yes', 'y', '1', 'completed', 'complete', 'submitted', 'verified', 'approved'].includes(
        String(value).trim().toLowerCase()
    );
}

function normalizeKycValue(value) {
    return String(value || '').trim().toLowerCase();
}

export function getVendorType(userOrAuthData) {
    const payload = userOrAuthData || {};
    const data = payload?.data || {};
    const user = payload?.user || data?.user || data?.profile || payload?.profile || payload || {};
    const vendorProfile = user?.vendorProfile || data?.vendorProfile || data?.user?.vendorProfile || {};
    const candidate = firstValue(
        payload?.vendorType,
        payload?.vendor_type,
        payload?.userType,
        payload?.user_type,
        payload?.type,
        payload?.roleName,
        data?.vendorType,
        data?.vendor_type,
        data?.user?.vendorType,
        data?.user?.vendor_type,
        user?.vendorType,
        user?.vendor_type,
        vendorProfile?.vendorType,
        vendorProfile?.vendor_type
    );

    return normalizeVendorType(candidate);
}

export function isVendorRole(role, vendorType = '') {
    const normalizedRole = normalizeRole(role);
    const normalizedVendorType = normalizeVendorType(vendorType);

    return normalizedRole === 'agent' ||
        normalizedRole === 'vendor' ||
        normalizedRole === 'partner' ||
        normalizedVendorType === 'CONSULTANCY' ||
        normalizedVendorType === 'TRAVEL_AGENT' ||
        normalizedVendorType === 'PROPERTY_OWNER';
}

export function getDisplayRoleLabel(role) {
    const normalizedRole = normalizeRole(role);
    const labels = {
        superadmin: 'Super Admin',
        admin: 'Admin',
        agent: 'Agent',
        partner: 'Partner',
        customer: 'Customer',
        user: 'Customer',
        client: 'Customer',
    };

    return labels[normalizedRole] || role || 'User';
}

export function getProfileRoute(role) {
    const normalizedRole = normalizeRole(role);

    switch (normalizedRole) {
        case 'agent':
            return '/agent/profile';
        case 'partner':
            return '/partner/profile';
        case 'customer':
        case 'client':
        case 'user':
            return '/user/profile';
        case 'superadmin':
        case 'admin':
            return '/admin/profile';
        default:
            return '/';
    }
}

export function getDashboardRoute(role) {
    const normalizedRole = normalizeRole(role);

    switch (normalizedRole) {
        case 'superadmin':
            return '/dashboard/superadmin';
        case 'admin':
            return '/dashboard/admin';
        case 'agent':
            return '/dashboard/agent';
        case 'partner':
            return '/dashboard/partner';
        case 'customer':
        case 'client':
        case 'user':
            return '/dashboard/customer';
        default:
            return '/';
    }
}

export function getDashboardPath(role, payload = {}) {
    const vendorType = getVendorType(payload);

    if (vendorType === 'PROPERTY_OWNER') {
        return '/dashboard/partner';
    }

    if (vendorType === 'TRAVEL_AGENT' || vendorType === 'CONSULTANCY') {
        return '/dashboard/agent';
    }

    return ROLE_DASHBOARD_PATHS[normalizeRole(role)] || '/dashboard/customer';
}

export function getLoginRoute(role) {
    const normalizedRole = normalizeRole(role);

    switch (normalizedRole) {
        case 'admin':
        case 'superadmin':
            return '/admin/login';
        case 'agent':
            return '/agent/login';
        case 'partner':
            return '/partner/login';
        case 'customer':
        case 'client':
        case 'user':
            return '/user/login';
        default:
            return '/user/login';
    }
}

export function getLoginPath(role = '', payload = {}) {
    const vendorType = getVendorType(payload);
    const normalizedRole = normalizeRole(role);

    if (vendorType === 'PROPERTY_OWNER' || normalizedRole === 'partner') {
        return '/partner/login';
    }

    if (vendorType === 'TRAVEL_AGENT' || vendorType === 'CONSULTANCY' || normalizedRole === 'agent' || normalizedRole === 'vendor') {
        return '/agent/login';
    }

    if (normalizedRole === 'client' || normalizedRole === 'customer' || normalizedRole === 'user') {
        return '/user/login';
    }

    if (normalizedRole === 'admin' || normalizedRole === 'superadmin' || normalizedRole === 'super_admin') {
        return '/admin/login';
    }

    return '/user/login';
}

export function getSignUpRoute(role) {
    const normalizedRole = normalizeRole(role);

    switch (normalizedRole) {
        case 'admin':
        case 'superadmin':
            return '/admin/sign-up';
        case 'agent':
            return '/agent/sign-up';
        case 'partner':
            return '/partner/sign-up';
        case 'customer':
        case 'client':
        case 'user':
            return '/user/sign-up';
        default:
            return '/user/sign-up';
    }
}

export function getPasswordRoute(role) {
    const normalizedRole = normalizeRole(role);

    switch (normalizedRole) {
        case 'agent':
            return '/agent/update-password';
        case 'partner':
            return '/partner/update-password';
        case 'customer':
        case 'client':
        case 'user':
            return '/user/update-password';
        case 'superadmin':
        case 'admin':
            return '/admin/update-password';
        default:
            return '/';
    }
}

export function isAuthRoute(pathname = '') {
    return /^\/(admin|agent|partner|user)\/(login|sign-up)(\/)?$/.test(pathname);
}

export function isDashboardRoute(pathname = '') {
    return pathname.startsWith('/dashboard') || pathname.startsWith('/service/add-category');
}

export function shouldUseDefaultLayout(Component, pathname = '') {
    if (Component?.disableDefaultLayout) return false;
    if (Component?.useDefaultLayout) return true;

    return false;
}

export function getKycStatus(payload = {}, userOverride = {}) {
    const data = payload?.data || {};
    const user = userOverride || payload?.user || data?.user || {};
    const vendorProfile = user?.vendorProfile || data?.vendorProfile || data?.user?.vendorProfile || {};
    const kyc = user?.kyc || user?.kycDetails || user?.kycProfile || user?.vendorKyc || vendorProfile?.kyc || vendorProfile?.kycDetails || data?.kyc || data?.kycDetails || data?.vendorKyc || payload?.kyc || payload?.kycDetails || payload?.vendorKyc || {};

    return firstValue(
        user?.kycStatus,
        user?.kyc_status,
        user?.kycState,
        user?.kyc_state,
        user?.vendorProfile?.kycStatus,
        user?.vendorProfile?.kyc_status,
        vendorProfile?.kycStatus,
        vendorProfile?.kyc_status,
        vendorProfile?.kycState,
        vendorProfile?.kyc_state,
        kyc?.status,
        kyc?.kycStatus,
        kyc?.kyc_status,
        kyc?.state,
        kyc?.verificationStatus,
        kyc?.verification_status,
        data?.kycStatus,
        data?.kyc_status,
        data?.kycState,
        data?.kyc_state,
        data?.user?.kycStatus,
        data?.user?.kyc_status,
        data?.user?.kycState,
        data?.user?.kyc_state,
        data?.user?.vendorProfile?.kycStatus,
        data?.user?.vendorProfile?.kyc_status,
        data?.user?.vendorProfile?.kycState,
        data?.user?.vendorProfile?.kyc_state,
        payload?.kycStatus,
        payload?.kyc_status,
        payload?.kycState,
        payload?.kyc_state
    ) || '';
}

export function getNextStep(payload = {}, userOverride = {}) {
    const data = payload?.data || {};
    const user = userOverride || payload?.user || data?.user || {};

    return firstValue(
        user?.nextStep,
        user?.next_step,
        user?.vendorProfile?.nextStep,
        user?.vendorProfile?.next_step,
        data?.nextStep,
        data?.next_step,
        data?.user?.nextStep,
        data?.user?.next_step,
        data?.user?.vendorProfile?.nextStep,
        data?.user?.vendorProfile?.next_step,
        payload?.nextStep,
        payload?.next_step
    ) || '';
}

export function isKycComplete(payload = {}, userOverride = {}) {
    const data = payload?.data || {};
    const user = userOverride || payload?.user || data?.user || {};
    const vendorProfile = user?.vendorProfile || data?.vendorProfile || data?.user?.vendorProfile || {};
    const kyc = user?.kyc || user?.kycDetails || user?.kycProfile || user?.vendorKyc || vendorProfile?.kyc || vendorProfile?.kycDetails || data?.kyc || data?.kycDetails || data?.vendorKyc || payload?.kyc || payload?.kycDetails || payload?.vendorKyc || {};
    const status = normalizeKycValue(getKycStatus(payload, user));
    const nextStep = normalizeKycValue(getNextStep(payload, user));

    if (KYC_COMPLETE_STATUSES.includes(status)) {
        return true;
    }

    if (status || KYC_INCOMPLETE_STEPS.includes(nextStep)) {
        return false;
    }

    return [
            user?.kycCompleted,
            user?.isKycCompleted,
            user?.kycVerified,
            user?.isKycVerified,
            user?.hasCompletedKyc,
            user?.kycSubmitted,
            user?.isKycSubmitted,
            vendorProfile?.kycCompleted,
            vendorProfile?.isKycCompleted,
            vendorProfile?.kycVerified,
            vendorProfile?.isKycVerified,
            vendorProfile?.hasCompletedKyc,
            vendorProfile?.kycSubmitted,
            vendorProfile?.isKycSubmitted,
            kyc?.completed,
            kyc?.isCompleted,
            kyc?.verified,
            kyc?.isVerified,
            kyc?.submitted,
            kyc?.isSubmitted,
            data?.kycCompleted,
            data?.isKycCompleted,
            data?.kycVerified,
            data?.isKycVerified,
            data?.hasCompletedKyc,
            data?.kycSubmitted,
            data?.isKycSubmitted,
            payload?.kycCompleted,
            payload?.isKycCompleted,
            payload?.kycVerified,
            payload?.isKycVerified,
            payload?.hasCompletedKyc,
            payload?.kycSubmitted,
            payload?.isKycSubmitted
        ].some(isTruthyKycFlag);
}

export function isAwaitingApproval(payload = {}, user = {}) {
    const kycStatus = String(getKycStatus(payload, user)).toUpperCase();
    const nextStep = String(getNextStep(payload, user)).toUpperCase();

    return kycStatus === 'SUBMITTED' && nextStep === 'AWAITING_APPROVAL';
}

export function shouldCompleteKyc(role, payload = {}, user = {}) {
    const vendorType = getVendorType(user) || getVendorType(payload);

    return isVendorRole(role, vendorType) && !isKycComplete(payload, user);
}

export function getPostLoginPath(role, payload = {}, user = {}) {
    const kycStatus = normalizeKycValue(getKycStatus(payload, user));
    const vendorType = getVendorType(user) || getVendorType(payload);

    if (KYC_COMPLETE_STATUSES.includes(kycStatus)) {
        return getDashboardPath(role, user || payload);
    }

    if (isVendorRole(role, vendorType) && kycStatus) {
        return '/kyc';
    }

    if (shouldCompleteKyc(role, payload, user)) {
        return '/kyc';
    }

    return getDashboardPath(role, user || payload);
}

export function getStoredUserData() {
    if (typeof window === 'undefined') {
        return null;
    }

    for (const key of ['userData', 'UserData']) {
        try {
            const value = window.localStorage.getItem(key);
            if (value) {
                return JSON.parse(value);
            }
        } catch {
            window.localStorage.removeItem(key);
        }
    }

    return null;
}
