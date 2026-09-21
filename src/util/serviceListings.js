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

function normalizeImageUrl(value) {
  if (typeof value !== "string") return value?.url || fallbackImage;
  const markdownLink = value.match(/^\[[^\]]*\]\((https?:\/\/[^)]+)\)$/);
  return markdownLink?.[1] || value;
}

export function normalizeServiceListing(item) {
  const id = item.serviceListingId || item.listingId || item.id || item._id || item.uuid;
  if (!id) return null;
  const categoryName = nameOf(item.category) || nameOf(item.serviceCategory) || item.categoryName || "Services";
  const service = item.title || item.serviceTitle || item.serviceName || nameOf(item.service) || "Service listing";
  const priceValue = Number(item.priceInPaise ?? 0) / 100;
  const currency = item.currency || "INR";
  const image = item.imageUrl || item.image?.url || item.image_url || fallbackImage;
  const city = item.dynamicData?.city || item.dynamicData?.country || item.city || item.location || "Online";
  return {
    id: String(id),
    detailSlug: `listing-${id}`,
    categorySlug: String(item.categoryId || item.category?.id || categoryName).toLowerCase(),
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

export async function fetchServiceListings({ categoryName = "" } = {}) {
  const apiCategoryName = categoryName.trim() === "Immigration Services" ? "Immigration" : categoryName.trim();
  const endpoint = apiCategoryName
    ? `/service-listings?categoryName=${encodeURIComponent(apiCategoryName)}`
    : "/service-listings";
  const response = await MainApi.get(endpoint, {
    skipAuth: true,
    suppressAuthRedirect: true,
  });
  return normalizeListingCollection(response.data);
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
