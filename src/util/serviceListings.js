import MainApi from "@/util/MainApi";

const fallbackImage = "/images/services/service-detail-dummy.png";

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
    categoryLabel: categoryName.toUpperCase(),
    service,
    description: item.description || item.overview || "",
    badgeLabel: "SERVICE",
    badgeClass: "bg-teal-700",
    image: typeof image === "string" ? image : image.url || fallbackImage,
    city: typeof city === "string" ? city : nameOf(city),
    priceValue,
    priceLabel: new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(priceValue),
    rating: item.rating || null,
    votes: item.reviewCount || 0,
    createdOrder: new Date(item.createdAt || 0).getTime(),
    includes: item.includes || [],
  };
}

export async function fetchServiceListings() {
  const listings = [];
  const seen = new Set();
  for (let skip = 0; ; skip += 100) {
    const response = await MainApi.get("/service-listings", {
      skipAuth: true,
      suppressAuthRedirect: true,
      params: { take: 100, skip },
    });
    const batch = findListings(response.data);
    let added = 0;
    for (const item of batch) {
      const listing = normalizeServiceListing(item);
      if (listing && !seen.has(listing.id)) {
        seen.add(listing.id);
        listings.push(listing);
        added += 1;
      }
    }
    if (batch.length < 100 || added === 0) break;
  }
  return listings;
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
