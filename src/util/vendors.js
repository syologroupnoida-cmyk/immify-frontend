import MainApi from "@/util/MainApi";
import { normalizeServiceListing } from "@/util/serviceListings";

export const vendorFallbackImage = "/images/vendor-dummy-consultancy.png";

function findVendors(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];

  for (const key of ["vendors", "items", "content", "results", "rows", "list", "data"]) {
    if (Array.isArray(value[key])) return value[key];
    if (value[key] && typeof value[key] === "object") {
      const nested = findVendors(value[key]);
      if (nested.length) return nested;
    }
  }

  return [];
}

function getName(value) {
  return typeof value === "string" ? value : value?.name || value?.title || value?.categoryName || value?.serviceName || "";
}

function slugify(value) {
  return String(value || "vendor")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeImageUrl(value) {
  if (typeof value !== "string") return value?.url || vendorFallbackImage;
  const markdownLink = value.match(/^\[[^\]]*\]\((https?:\/\/[^)]+)\)$/);
  return markdownLink?.[1] || value || vendorFallbackImage;
}

function getProfile(item) {
  return item.vendorProfile || item.profile || item.kyc || item.businessProfile || {};
}

function getVendorLocation(item, profile = {}) {
  return item.location || profile.location || item.address || {};
}

function getVendorCompany(item, profile = {}) {
  return item.company || item.companyProfile || profile.company || profile.companyProfile || {};
}

function getUniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

export function normalizeVendor(item) {
  if (!item || typeof item !== "object") return null;
  const profile = getProfile(item);
  const location = getVendorLocation(item, profile);
  const company = getVendorCompany(item, profile);
  const vendorUserId = item.vendorUserId || item.vendor_user_id || item.userId || item.vendorId || item.id || item.user?.id || profile.userId;
  if (!vendorUserId) return null;

  const firstName = item.firstName || item.first_name || item.user?.firstName || "";
  const lastName = item.lastName || item.last_name || item.user?.lastName || "";
  const name = item.businessName
    || item.companyName
    || item.vendorName
    || profile.businessName
    || profile.companyName
    || `${firstName} ${lastName}`.trim()
    || item.name
    || item.username
    || "Immigration Vendor";
  const city = item.city || profile.city || location.city || company.officeCity || item.dynamicData?.city || "Delhi";
  const state = item.state || profile.state || location.state || company.officeState || item.dynamicData?.state || city;
  const country = item.country || profile.country || location.country || company.country || item.dynamicData?.country || "India";
  const category = item.category || item.serviceCategory || profile.category || {};
  const inlineServiceListings = Array.isArray(item.services)
    ? item.services.map((service) => normalizeServiceListing({ ...service, vendorUserId })).filter(Boolean)
    : [];
  const inlineServiceCategories = inlineServiceListings.map((service) => service.categoryName);
  const inlineServiceNames = inlineServiceListings.map((service) => service.serviceName || service.service || service.title);
  const services = [
    ...inlineServiceNames,
    ...(Array.isArray(item.serviceListings) ? item.serviceListings.map((service) => getName(service.service) || service.serviceName || service.title) : []),
  ].filter(Boolean);
  const categoryTitle = getName(category) || item.categoryName || item.serviceCategoryName || inlineServiceCategories[0] || services[0] || "Immigration Services";
  const categoryId = item.categoryId || item.serviceCategoryId || category.id || category._id || "";
  const serviceId = item.serviceId || item.service?.id || item.service?._id || item.primaryServiceId || "";
  const specialty = item.specialty || profile.specialty || inlineServiceCategories[0] || services[0] || categoryTitle;
  const rating = Number(item.rating || item.averageRating || item.avgRating || 4.8);
  const companySinceYears = Number(company.companySinceYears || item.companySinceYears || profile.companySinceYears || 0);
  const currentYear = new Date().getFullYear();
  const derivedExperienceYears = companySinceYears > 1800 && companySinceYears <= currentYear ? currentYear - companySinceYears : 0;
  const experience = item.experience || profile.experience || (item.yearsOfExperience ? `${item.yearsOfExperience}+ years` : "") || (derivedExperienceYears ? `${derivedExperienceYears}+ years` : "Verified");
  const phone = item.phone || item.phoneNumber || item.mobile || item.user?.phone || "";
  const image = normalizeImageUrl(
    item.imageUrl
      || item.profileImageUrl
      || item.logoUrl
      || item.avatarUrl
      || item.companyLogoUrl
      || company.companyLogoUrl
      || profile.imageUrl
      || profile.logoUrl
      || item.avatar
  );

  return {
    id: String(vendorUserId),
    vendorUserId: String(vendorUserId),
    slug: slugify(item.slug || `${city}-${name}-${vendorUserId}`),
    name,
    categorySlug: String(categoryId || categoryTitle).toLowerCase(),
    categoryId: categoryId ? String(categoryId) : "",
    serviceId: serviceId ? String(serviceId) : "",
    categoryTitle,
    locationSlug: slugify(city),
    city,
    state,
    country,
    image,
    rating: Number.isFinite(rating) ? rating : 4.8,
    experience,
    specialty,
    services: getUniqueValues(services.length ? services : [specialty, categoryTitle]).slice(0, 8),
    serviceListings: inlineServiceListings,
    serviceCategories: getUniqueValues(inlineServiceCategories),
    responseTime: item.responseTime || profile.responseTime || "Same day",
    phone,
    description: item.description || profile.description || `${name} supports ${String(specialty).toLowerCase()} in ${city}.`,
    company: {
      companyName: company.companyName || item.companyName || "",
      businessName: company.businessName || item.businessName || "",
      companyLogoUrl: company.companyLogoUrl || item.companyLogoUrl || "",
      companySinceYears: company.companySinceYears || item.companySinceYears || "",
      teamSize: company.teamSize || item.teamSize || "",
      websiteUrl: company.websiteUrl || item.websiteUrl || "",
      facebookUrl: company.facebookUrl || item.facebookUrl || "",
      instagramUrl: company.instagramUrl || item.instagramUrl || "",
    },
  };
}

function normalizeVendorCollection(responseData) {
  const seen = new Set();
  return findVendors(responseData)
    .map(normalizeVendor)
    .filter((vendor) => vendor && !seen.has(vendor.vendorUserId) && seen.add(vendor.vendorUserId));
}

function findSingleVendor(responseData) {
  return normalizeVendor(
    responseData?.data?.vendor
      || responseData?.data?.vendorProfile
      || responseData?.data?.profile
      || responseData?.data?.user
      || responseData?.data?.item
      || responseData?.data?.result
      || responseData?.data
      || responseData?.vendor
      || responseData?.vendorProfile
      || responseData?.profile
      || responseData?.user
      || responseData?.item
      || responseData?.result
      || responseData
  );
}

export async function fetchVendors({
  vendorUserId = "",
  city = "",
  state = "",
  country = "",
  categoryId = "",
  serviceId = "",
} = {}) {
  const endpoint = vendorUserId ? `/vendors/${encodeURIComponent(vendorUserId)}` : "/vendors";
  const requestOptions = {
    skipAuth: true,
    suppressAuthRedirect: true,
  };

  if (!vendorUserId) {
    requestOptions.params = Object.fromEntries(
      Object.entries({
        city,
        state,
        country,
        categoryId,
        serviceId,
      }).filter(([, value]) => value)
    );
  }

  const response = await MainApi.get(endpoint, requestOptions);

  const singleVendor = findSingleVendor(response.data);
  return singleVendor ? [singleVendor] : normalizeVendorCollection(response.data);
}

export async function fetchVendorById(vendorUserId, filters = {}) {
  if (!vendorUserId) return null;
  return (await fetchVendors({ ...filters, vendorUserId }))[0] || null;
}
