import { NextResponse } from 'next/server';

const ROLE_DASHBOARD_PATHS = {
  admin: '/dashboard/admin',
  superadmin: '/dashboard/superadmin',
  super_admin: '/dashboard/superadmin',
  agent: '/dashboard/agent',
  vendor: '/dashboard/agent',
  partner: '/dashboard/partner',
  customer: '/dashboard/customer',
  client: '/dashboard/customer',
  user: '/dashboard/customer',
};

const KYC_DASHBOARD_COMPLETE_STATUSES = new Set([
  'approved',
  'approved_by_admin',
  'completed',
  'complete',
  'verified',
  'true',
]);

function normalizeRole(role) {
  return String(role || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
}

function normalizeVendorType(vendorType) {
  return String(vendorType || '').trim().toUpperCase().replace(/[\s-]+/g, '_');
}

function isVendorRequest(role, vendorType) {
  const normalizedRole = normalizeRole(role);
  const normalizedVendorType = normalizeVendorType(vendorType);

  return normalizedRole === 'agent' ||
    normalizedRole === 'vendor' ||
    normalizedRole === 'partner' ||
    normalizedVendorType === 'CONSULTANCY' ||
    normalizedVendorType === 'TRAVEL_AGENT' ||
    normalizedVendorType === 'PROPERTY_OWNER';
}

function isKycCompleteForDashboard(request) {
  const kycFlag = String(request.cookies.get('tripz_kyc')?.value || '').trim().toLowerCase();
  const kycStatus = String(request.cookies.get('tripz_kyc_status')?.value || '').trim().toLowerCase();

  return kycFlag === 'true' || KYC_DASHBOARD_COMPLETE_STATUSES.has(kycStatus);
}

function getDashboardPath(role) {
  return ROLE_DASHBOARD_PATHS[normalizeRole(role)] || '/dashboard/superadmin';
}

function getDashboardPathFromRequest(request, role) {
  const vendorType = normalizeVendorType(request.cookies.get('tripz_vendor_type')?.value);

  if (vendorType === 'CONSULTANCY' || vendorType === 'TRAVEL_AGENT') {
    return '/dashboard/agent';
  }

  if (vendorType === 'PROPERTY_OWNER') {
    return '/dashboard/partner';
  }

  return getDashboardPath(role);
}

function getLoginPathFromRequest(request, role) {
  const vendorType = normalizeVendorType(request.cookies.get('tripz_vendor_type')?.value);

  if (vendorType === 'CONSULTANCY' || vendorType === 'TRAVEL_AGENT' || role === 'agent' || role === 'vendor') {
    return '/agent/login';
  }

  if (vendorType === 'PROPERTY_OWNER' || role === 'partner') {
    return '/partner/login';
  }

  if (role === 'customer' || role === 'client' || role === 'user') {
    return '/user/login';
  }

  return '/admin/login';
}

function redirectTo(pathname, request) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = '';
  return NextResponse.redirect(url);
}

function isLoginPath(pathname) {
  return pathname === '/admin/login' ||
    pathname === '/agent/login' ||
    pathname === '/partner/login' ||
    pathname === '/user/login';
}

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get('tripz_auth')?.value === 'true';
  const role = normalizeRole(request.cookies.get('tripz_role')?.value);
  const vendorType = request.cookies.get('tripz_vendor_type')?.value;
  const dashboardPath = getDashboardPathFromRequest(request, role);

  if (isLoginPath(pathname) && request.nextUrl.search) {
    return redirectTo(pathname, request);
  }

  if (
    isLoginPath(pathname) &&
    isAuthenticated &&
    isVendorRequest(role, vendorType) &&
    !isKycCompleteForDashboard(request)
  ) {
    return NextResponse.next();
  }

  if (isLoginPath(pathname) && isAuthenticated) {
    return redirectTo(dashboardPath, request);
  }

  if (isLoginPath(pathname)) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = getLoginPathFromRequest(request, role);
    loginUrl.search = '';
    return NextResponse.redirect(loginUrl);
  }

  if (
    pathname === '/kyc' &&
    isVendorRequest(role, vendorType) &&
    isKycCompleteForDashboard(request)
  ) {
    return redirectTo(dashboardPath, request);
  }

  if (
    pathname.startsWith('/dashboard') &&
    isVendorRequest(role, vendorType) &&
    !isKycCompleteForDashboard(request)
  ) {
    return redirectTo('/kyc', request);
  }

  if (pathname.startsWith('/dashboard') && pathname !== dashboardPath) {
    return redirectTo(dashboardPath, request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/login',
    '/agent/login',
    '/partner/login',
    '/user/login',
    '/admin/add-subscription-plan',
    '/admin/theme-setting',
    '/admin/update-password',
    '/admin/update-profile',
    '/service/add-category',
    '/service/add-services',
    '/kyc',
  ],
};
