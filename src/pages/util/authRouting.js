export const ROLE_DASHBOARD_PATHS = {
  client: '/dashboard/customer',
  customer: '/dashboard/customer',
  agent: '/dashboard/agent',
  vendor: '/dashboard/agent',
  partner: '/dashboard/partner',
  admin: '/dashboard/admin',
  superadmin: '/dashboard/superadmin',
  super_admin: '/dashboard/superadmin',
};

const KYC_COMPLETE_STATUSES = ['approved', 'completed', 'verified', 'submitted', 'true'];

export function normalizeRole(role) {
  return String(role || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
}

export function normalizeVendorType(vendorType) {
  return String(vendorType || '').trim().toUpperCase().replace(/[\s-]+/g, '_');
}

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

export function getVendorType(payload = {}) {
  const data = payload?.data || {};
  const user = payload?.user || data?.user || data?.profile || payload?.profile || payload || {};
  const vendorProfile = user?.vendorProfile || data?.vendorProfile || data?.user?.vendorProfile || {};

  return normalizeVendorType(firstValue(
    payload?.vendorType,
    payload?.vendor_type,
    data?.vendorType,
    data?.vendor_type,
    data?.user?.vendorType,
    data?.user?.vendor_type,
    user?.vendorType,
    user?.vendor_type,
    vendorProfile?.vendorType,
    vendorProfile?.vendor_type
  ));
}

export function isVendorRole(role, vendorType = '') {
  const normalizedRole = normalizeRole(role);
  const normalizedVendorType = normalizeVendorType(vendorType);

  return normalizedRole === 'agent' ||
    normalizedRole === 'vendor' ||
    normalizedRole === 'partner' ||
    normalizedVendorType === 'TRAVEL_AGENT' ||
    normalizedVendorType === 'PROPERTY_OWNER';
}

export function getDashboardPath(role, payload = {}) {
  const vendorType = getVendorType(payload);

  if (vendorType === 'PROPERTY_OWNER') {
    return '/dashboard/partner';
  }

  if (vendorType === 'TRAVEL_AGENT') {
    return '/dashboard/agent';
  }

  return ROLE_DASHBOARD_PATHS[normalizeRole(role)] || '/dashboard/customer';
}

export function getLoginPath(role = '', payload = {}) {
  const vendorType = getVendorType(payload);
  const normalizedRole = normalizeRole(role);

  if (vendorType === 'PROPERTY_OWNER' || normalizedRole === 'partner') {
    return '/partner/login';
  }

  if (vendorType === 'TRAVEL_AGENT' || normalizedRole === 'agent' || normalizedRole === 'vendor') {
    return '/agent/login';
  }

  if (normalizedRole === 'client' || normalizedRole === 'customer' || normalizedRole === 'user') {
    return '/user/login';
  }

  if (normalizedRole === 'admin' || normalizedRole === 'superadmin' || normalizedRole === 'super_admin') {
    return '/admin/login';
  }

  // Default to user login for public/client actions when role is unknown.
  return '/user/login';

}

export function getDisplayRoleLabel(role = '') {
  const normalizedRole = normalizeRole(role);
  const roleLabels = {
    client: 'Client',
    customer: 'Client',
    agent: 'Agent',
    vendor: 'Vendor',
    partner: 'Partner',
    admin: 'Admin',
    superadmin: 'Superadmin',
    super_admin: 'Superadmin',
  };

  return roleLabels[normalizedRole] || normalizedRole.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getProfileRoute(role = '') {
  switch (normalizeRole(role)) {
    case 'agent':
    case 'vendor':
      return '/agent/profile';
    case 'partner':
      return '/partner/profile';
    case 'admin':
    case 'superadmin':
    case 'super_admin':
      return '/admin/update-profile';
    case 'client':
    case 'customer':
    case 'user':
    default:
      return '/user/edit-profile';
  }
}

export function getPasswordRoute(role = '') {
  switch (normalizeRole(role)) {
    case 'agent':
    case 'vendor':
      return '/agent/update-password';
    case 'partner':
      return '/partner/update-password';
    case 'admin':
    case 'superadmin':
    case 'super_admin':
      return '/admin/update-password';
    case 'client':
    case 'customer':
    case 'user':
    default:
      return '/user/update-password';
  }
}

export function getKycStatus(payload = {}, userOverride = {}) {
  const data = payload?.data || {};
  const user = userOverride || payload?.user || data?.user || {};

  return firstValue(
    user?.kycStatus,
    user?.kyc_status,
    user?.vendorProfile?.kycStatus,
    user?.vendorProfile?.kyc_status,
    data?.kycStatus,
    data?.kyc_status,
    data?.user?.kycStatus,
    data?.user?.kyc_status,
    data?.user?.vendorProfile?.kycStatus,
    data?.user?.vendorProfile?.kyc_status,
    payload?.kycStatus,
    payload?.kyc_status
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
  const status = String(getKycStatus(payload, user)).toLowerCase();

  return KYC_COMPLETE_STATUSES.includes(status) ||
    Boolean(user?.kycCompleted || user?.isKycCompleted || data?.kycCompleted || data?.isKycCompleted);
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
