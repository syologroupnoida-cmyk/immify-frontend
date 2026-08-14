export function normalizeRole(role) {
    if (!role) return '';

    const value = String(role).trim().toLowerCase();
    const roleMap = {
        superadmin: 'superadmin',
        super_admin: 'superadmin',
        admin: 'admin',
        agent: 'agent',
        travel_agent: 'agent',
        'travel-agent': 'agent',
        partner: 'partner',
        property_owner: 'partner',
        'property-owner': 'partner',
        vendor: 'partner',
        customer: 'customer',
        client: 'customer',
        user: 'customer',
        traveler: 'customer',
    };

    return roleMap[value] || value;
}

export function getVendorType(userOrAuthData) {
    const candidate = userOrAuthData?.vendorType
        || userOrAuthData?.vendor_type
        || userOrAuthData?.userType
        || userOrAuthData?.user_type
        || userOrAuthData?.type
        || userOrAuthData?.roleName
        || '';

    return String(candidate).trim().toUpperCase();
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
