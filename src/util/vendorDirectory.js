import MainApi from '@/util/MainApi';

export async function fetchDirectoryPage({ take = 20, skip = 0, search = '', city = '', category = '' } = {}) {
  const params = { take, skip };
  if (search) params.search = search;
  if (city) params.city = city;
  if (category) params.category = category;
  const response = await MainApi.get('/vendors/directory', { params, skipAuth: true, suppressAuthRedirect: true });
  const data = response.data?.data;
  if (!Array.isArray(data?.items) || !Number.isFinite(Number(data.total))) throw new Error('Invalid vendor directory response.');
  return { items: data.items, total: Number(data.total) };
}

export async function fetchDirectoryVendor(id) {
  const response = await MainApi.get(`/vendors/directory/${encodeURIComponent(id)}`, { skipAuth: true, suppressAuthRedirect: true });
  const vendor = response.data?.data;
  if (!vendor?.id) throw new Error('Invalid vendor detail response.');
  return vendor;
}

let categoryCache;
let categoryRequest;

export async function fetchDirectoryCategories() {
  if (categoryCache) return categoryCache;
  if (categoryRequest) return categoryRequest;
  categoryRequest = (async () => {
  const first = await fetchDirectoryPage({ take: 100, skip: 0 });
  const offsets = Array.from({ length: Math.max(0, Math.ceil(first.total / 100) - 1) }, (_, index) => (index + 1) * 100);
  const pages = [first];
  for (let index = 0; index < offsets.length; index += 4) {
    pages.push(...await Promise.all(offsets.slice(index, index + 4).map((skip) => fetchDirectoryPage({ take: 100, skip }))));
  }
  categoryCache = [...new Set(pages.flatMap((page) => page.items.map((item) => item.category).filter((value) => typeof value === 'string' && value.trim()).map((value) => value.trim())))].sort((a, b) => a.localeCompare(b));
  return categoryCache;
  })();
  try { return await categoryRequest; } finally { categoryRequest = null; }
}

export function shortVendorName(name) {
  const words = String(name || 'Provider').trim().split(/\s+/);
  return words.length > 3 ? `${words.slice(0, 3).join(' ')}...` : words.join(' ');
}

export function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}
