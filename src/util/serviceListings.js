import MainApi from "@/util/MainApi";

const fallbackImage = "/images/services/service-detail-dummy.png";

export const serviceListingCategories = [
  "Immigration Services",
  "Visa Services",
  "Study Abroad Services",
  "Test Preparation",
  "International Services",
  "Family Relocation Services",
  "Document Attestation Services",
  "Financial Services",
  "Business Setup Services and Immigration",
  "Health Insurance",
  "Forex Services",
  "Legal and Compliance",
];

export const SERVICE_FILTER_EVENT = "immify-service-filter";

function getFirstArray(...values) {
  return values.find((value) => Array.isArray(value) && value.length > 0) || [];
}

function findListings(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  for (const key of ["items", "content", "results", "rows", "list", "listings", "serviceListings", "service_listings", "data"]) {
    if (Array.isArray(value[key])) return value[key];
    if (value[key] && typeof value[key] === "object") {
      const nested = findListings(value[key]);
      if (nested.length) return nested;
    }
  }
  return [];
}

function nameOf(value) {
  return typeof value === "string" ? value : value?.name || value?.title || value?.serviceName || value?.categoryName || "";
}

function getCategoryId(category) {
  return String(category?.serviceCategoryId || category?.categoryId || category?.id || category?._id || category?.uuid || "");
}

function getCategoryName(category) {
  return category?.name || category?.categoryName || category?.serviceCategoryName || category?.title || "Unnamed Category";
}

function getServiceId(service) {
  if (typeof service === "string") return "";
  return String(service?.serviceId || service?.id || service?._id || service?.uuid || "");
}

function getServiceName(service) {
  if (typeof service === "string") return service;
  return service?.name || service?.serviceName || service?.title || "Unnamed Service";
}

function dedupeByIdOrName(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key = item.id ? `id:${item.id}` : `name:${item.name.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function normalizeCategoryServices(payload = {}) {
  const data = payload?.data ?? payload ?? {};
  const nestedData = data?.data ?? data ?? {};
  const services = getFirstArray(
    data?.services,
    data?.service,
    data?.serviceList,
    data?.serviceItems,
    data?.service_items,
    data?.children,
    data?.data?.services,
    data?.data?.service,
    data?.data?.serviceList,
    data?.data?.serviceItems,
    nestedData?.services,
    nestedData?.service,
    nestedData?.serviceList,
    nestedData?.serviceItems,
    Array.isArray(data) ? data : [],
    Array.isArray(nestedData) ? nestedData : []
  );

  return dedupeByIdOrName(services.map((service) => ({
    id: getServiceId(service),
    name: getServiceName(service),
    raw: service,
  })).filter((service) => service.id && service.name));
}

function normalizeServiceCategories(responseData) {
  const data = responseData?.data ?? responseData ?? {};
  const categories = getFirstArray(
    data,
    data?.content,
    data?.items,
    data?.results,
    data?.categories,
    data?.serviceCategories,
    data?.rows,
    data?.list,
    data?.data,
    data?.data?.content,
    data?.data?.items,
    data?.data?.results,
    data?.data?.categories,
    data?.data?.serviceCategories
  );

  return dedupeByIdOrName(categories.map((category) => ({
    id: getCategoryId(category),
    name: getCategoryName(category),
    services: normalizeCategoryServices(category),
    raw: category,
  })).filter((category) => category.id && category.name));
}

function normalizeImageUrl(value) {
  if (typeof value !== "string") return value?.url || fallbackImage;
  const markdownLink = value.match(/^\[[^\]]*\]\((https?:\/\/[^)]+)\)$/);
  return markdownLink?.[1] || value;
}

export function normalizeServiceListing(item) {
  const id = item.serviceListingId || item.listingId || item.id || item._id || item.uuid;
  if (!id) return null;
  const categoryId = item.categoryId || item.serviceCategoryId || item.category?.id || item.serviceCategory?.id || item.category?._id || item.serviceCategory?._id || "";
  const serviceId = item.serviceId || item.service?.id || item.service?._id || item.serviceListingServiceId || "";
  const categoryName = nameOf(item.category) || nameOf(item.serviceCategory) || item.categoryName || "Services";
  const service = item.title || item.serviceTitle || item.serviceName || nameOf(item.service) || "Service listing";
  const priceValue = Number(item.priceInPaise ?? 0) / 100;
  const currency = item.currency || "INR";
  const image = item.imageUrl || item.image?.url || item.image_url || fallbackImage;
  const city = item.dynamicData?.city || item.dynamicData?.country || item.city || item.location || "Online";
  return {
    id: String(id),
    vendorUserId: item.vendorUserId || item.vendor_user_id || item.vendor?.userId || item.vendor?.id || "",
    categoryId: categoryId ? String(categoryId) : "",
    serviceId: serviceId ? String(serviceId) : "",
    detailSlug: `listing-${id}`,
    categorySlug: String(categoryId || categoryName).toLowerCase(),
    categoryName,
    category: item.category || null,
    categoryDescription: item.category?.description || "",
    serviceData: item.service || null,
    serviceDescription: item.service?.description || "",
    serviceName: item.serviceName || nameOf(item.service) || service,
    title: item.title || service,
    categoryLabel: categoryName.toUpperCase(),
    service,
    description: item.description || item.overview || "",
    overview: item.overview || "",
    process: item.process || "",
    pricingDetails: item.pricingDetails || "",
    termsAndConditions: item.termsAndConditions || "",
    chargesIncludeGst: Boolean(item.chargesIncludeGst),
    currency,
    priceInPaise: Number(item.priceInPaise ?? 0),
    dynamicData: item.dynamicData && typeof item.dynamicData === "object" ? item.dynamicData : {},
    vendor: item.vendor || null,
    badgeLabel: "SERVICE",
    badgeClass: "bg-teal-700",
    image: normalizeImageUrl(image),
    city: typeof city === "string" ? city : nameOf(city),
    priceValue,
    priceLabel: new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(priceValue),
    rating: item.rating || null,
    votes: item.reviewCount || 0,
    createdOrder: new Date(item.createdAt || 0).getTime(),
    includes: item.includes || [],
  };
}

function normalizeListingCollection(responseData) {
  const seen = new Set();
  return findListings(responseData)
    .map(normalizeServiceListing)
    .filter((listing) => listing && !seen.has(listing.id) && seen.add(listing.id));
}

export async function fetchServiceListings({ categoryName = "", vendorUserId = "" } = {}) {
  const apiCategoryName = categoryName.trim() === "Immigration Services" ? "Immigration" : categoryName.trim();
  const response = await MainApi.get("/service-listings", {
    params: {
      categoryName: apiCategoryName,
      vendorUserId,
    },
    skipAuth: true,
    suppressAuthRedirect: true,
  });
  return normalizeListingCollection(response.data);
}

export async function fetchServiceListingsByCategoryId(serviceCategoryId) {
  if (!serviceCategoryId) return [];

  const response = await MainApi.get(`/service-listings/category/${encodeURIComponent(serviceCategoryId)}`, {
    skipAuth: true,
    suppressAuthRedirect: true,
  });

  return normalizeListingCollection(response.data);
}

export async function fetchServiceCategories() {
  const response = await MainApi.get("/service-categories", {
    skipAuth: true,
    suppressAuthRedirect: true,
  });
  return normalizeServiceCategories(response.data);
}

export async function fetchCategoryServices(serviceCategoryId) {
  if (!serviceCategoryId) return [];

  const response = await MainApi.get(`/service-categories/${encodeURIComponent(serviceCategoryId)}`, {
    skipAuth: true,
    suppressAuthRedirect: true,
  });
  const categories = normalizeServiceCategories(response.data);
  const detailCategory = categories[0] || null;
  const services = normalizeCategoryServices(response.data);

  return detailCategory?.services?.length ? detailCategory.services : services;
}

export async function fetchServiceListingById(id) {
  try {
    const response = await MainApi.get(`/service-listings/${id}`, { skipAuth: true, suppressAuthRedirect: true });
    const item = response.data?.data?.listing || response.data?.data?.serviceListing || response.data?.data || response.data;
    const listing = normalizeServiceListing(item);
    if (listing) return listing;
  } catch {
    // The collection endpoint may be the only public read route.
  }
  return (await fetchServiceListings()).find((item) => item.id === String(id)) || null;
}

export { fallbackImage as serviceListingFallbackImage };
