export function getApiMessage(payload, fallback = 'Request completed successfully.') {
  return payload?.message || payload?.msg || payload?.data?.message || fallback;
}

export function getApiErrorMessage(error, fallback = 'Request failed. Please try again.') {
  const data = error?.response?.data;
  return data?.message || data?.msg || data?.error || error?.message || fallback;
}

export function extractUploadedImageUrl(payload) {
  if (!payload) return '';

  const root = payload?.data || payload;
  const candidates = [
    root?.url,
    root?.secure_url,
    root?.imageUrl,
    root?.avatarUrl,
    root?.avatar_url,
    root?.image?.url,
    root?.file?.url,
    root?.data?.url,
    root?.data?.secure_url,
  ];

  if (Array.isArray(root?.images) && root.images[0]) {
    candidates.push(root.images[0]?.url, root.images[0]?.secure_url, root.images[0]?.imageUrl, root.images[0]?.avatarUrl);
  }

  if (Array.isArray(root?.files) && root.files[0]) {
    candidates.push(root.files[0]?.url, root.files[0]?.secure_url, root.files[0]?.imageUrl, root.files[0]?.avatarUrl);
  }

  return candidates.find((item) => typeof item === 'string' && item.trim()) || '';
}

function parseStoredJson(key) {
  if (typeof window === 'undefined') return null;

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

export function readStoredUserFromStorage() {
  if (typeof window === 'undefined') return null;

  const authData = parseStoredJson('authData');
  const userData = parseStoredJson('userData');
  const legacyUserData = parseStoredJson('UserData');

  const candidate = userData || legacyUserData || authData?.user || authData?.data?.user || authData?.data || authData || null;

  if (candidate && typeof candidate === 'object') {
    return candidate;
  }

  return null;
}

export function mapStoredUserToProfileForm(user) {
  if (!user || typeof user !== 'object') return null;

  const firstName = user.firstName || user.first_name || user.firstname || (user.name ? user.name.split(' ')[0] : '') || '';
  const lastName = user.lastName || user.last_name || user.lastname || (user.name ? user.name.split(' ').slice(1).join(' ') : '') || '';
  const phoneNumber = user.phoneNumber || user.phone || user.mobile || user.contactNumber || '';
  const profileImage =
    user.profileImage ||
    user.profile?.url ||
    user.avatarUrl ||
    user.avatar_url ||
    user.avatar ||
    user.image ||
    null;

  return {
    firstName,
    lastName,
    email: user.email || user.emailAddress || '',
    phoneNumber,
    profileImage,
    profileImageUrl: profileImage,
  };
}

export function persistStoredUser(updatedUser) {
  if (typeof window === 'undefined') return null;

  const currentUser = readStoredUserFromStorage() || {};
  const firstName = updatedUser?.firstName ?? currentUser.firstName ?? currentUser.first_name ?? '';
  const lastName = updatedUser?.lastName ?? currentUser.lastName ?? currentUser.last_name ?? '';
  const email = updatedUser?.email ?? currentUser.email ?? currentUser.emailAddress ?? '';
  const phone = updatedUser?.phone ?? updatedUser?.phoneNumber ?? currentUser.phone ?? currentUser.phoneNumber ?? currentUser.mobile ?? '';
  const profileImage =
    updatedUser?.profileImage ??
    updatedUser?.avatarUrl ??
    updatedUser?.avatar_url ??
    currentUser.profileImage ??
    currentUser.avatarUrl ??
    currentUser.avatar_url ??
    currentUser.avatar ??
    currentUser.image ??
    null;
  const avatarUrl =
    updatedUser?.avatarUrl ??
    updatedUser?.avatar_url ??
    updatedUser?.profileImage ??
    currentUser.avatarUrl ??
    currentUser.avatar_url ??
    currentUser.profileImage ??
    currentUser.avatar ??
    currentUser.image ??
    null;

  const normalizedUser = {
    ...currentUser,
    ...updatedUser,
    firstName,
    lastName,
    email,
    phone,
    phoneNumber: phone,
    profileImage,
    profileImageUrl: avatarUrl,
    avatarUrl,
    avatar: avatarUrl,
    avatar_url: avatarUrl,
    name: [firstName, lastName].filter(Boolean).join(' ').trim() || currentUser.name || currentUser.fullName || currentUser.full_name || email || 'Traveler',
  };

  const authData = parseStoredJson('authData');
  const authPayload = authData && typeof authData === 'object' ? authData : {};

  if (authPayload?.user && typeof authPayload.user === 'object') {
    authPayload.user = { ...authPayload.user, ...normalizedUser };
  } else if (authPayload?.data && typeof authPayload.data === 'object' && authPayload.data.user && typeof authPayload.data.user === 'object') {
    authPayload.data.user = { ...authPayload.data.user, ...normalizedUser };
  } else if (authPayload?.data && typeof authPayload.data === 'object') {
    authPayload.data = { ...authPayload.data, ...normalizedUser };
  } else {
    authPayload.user = normalizedUser;
  }

  window.localStorage.setItem('authData', JSON.stringify(authPayload));
  window.localStorage.setItem('userData', JSON.stringify(normalizedUser));
  window.localStorage.setItem('UserData', JSON.stringify(normalizedUser));
  window.localStorage.setItem('isAuthenticated', 'true');
  window.dispatchEvent(new Event('tripz-auth-change'));

  return normalizedUser;
}
