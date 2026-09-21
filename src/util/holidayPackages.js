import MainApi from "@/util/MainApi";

export const HOLIDAY_PACKAGES_ENDPOINT = "/holiday-packages";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.immify.in/api/v1";
const HOLIDAY_PACKAGES_ENDPOINT_CANDIDATES = [
  HOLIDAY_PACKAGES_ENDPOINT,
  "/packages",
  "/package-listings",
];

const fallbackImages = [
  "/images/home/home-hero-immigration.png",
  "/images/home/home-hero-study.png",
  "/images/home/home-hero-work.png",
  "/images/home/home-hero-documentation.png",
];

const badgeStyles = ["bg-blue-600", "bg-emerald-500", "bg-violet-500", "bg-amber-500"];

const getFirstArray = (...values) => values.find((value) => Array.isArray(value)) || [];

const findFirstNestedArray = (value, depth = 0) => {
  if (!value || depth > 3) return [];
  if (Array.isArray(value)) return value;
  if (typeof value !== "object") return [];

  for (const item of Object.values(value)) {
    const nested = findFirstNestedArray(item, depth + 1);
    if (nested.length) return nested;
  }

  return [];
};

export function normalizeHolidayPackagesResponse(responseData) {
  const data = responseData?.data || responseData || {};
  const nestedData = data?.data || {};

  return getFirstArray(
    responseData,
    data?.packages,
    data?.holidayPackages,
    data?.holiday_packages,
    data?.items,
    data?.results,
    data?.content,
    nestedData?.packages,
    nestedData?.holidayPackages,
    nestedData?.holiday_packages,
    nestedData?.items,
    nestedData?.results,
    nestedData?.content
  ).length
    ? getFirstArray(
        responseData,
        data?.packages,
        data?.holidayPackages,
        data?.holiday_packages,
        data?.items,
        data?.results,
        data?.content,
        nestedData?.packages,
        nestedData?.holidayPackages,
        nestedData?.holiday_packages,
        nestedData?.items,
        nestedData?.results,
        nestedData?.content
      )
    : findFirstNestedArray(responseData);
}

const slugifyValue = (value) =>
  String(value || "package")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getHolidayPackageFallbackImage = (index = 0) => fallbackImages[index % fallbackImages.length];

const getAbsoluteImageUrl = (value, index) => {
  if (value && typeof value === "object") {
    return getAbsoluteImageUrl(
      value.url || value.path || value.location || value.fileUrl || value.file_url || value.secureUrl || value.secure_url,
      index
    );
  }

  if (typeof value !== "string" || !value.trim()) return getHolidayPackageFallbackImage(index);

  const text = value.trim();
  const markdownMatch = text.match(/\((https?:\/\/[^)]+)\)/i);
  const imageUrl = markdownMatch?.[1] || text;

  if (/^(https?:)?\/\//i.test(imageUrl) || imageUrl.startsWith("data:") || imageUrl.startsWith("blob:")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/images/")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/uploads") || imageUrl.startsWith("uploads/")) {
    const normalizedBase = API_BASE_URL.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
    const normalizedPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    return `${normalizedBase}${normalizedPath}`;
  }

  if (imageUrl.startsWith("/")) {
    const normalizedBase = API_BASE_URL.replace(/\/$/, "");
    return `${normalizedBase}${imageUrl}`;
  }

  return imageUrl;
};

const getPackageImage = (pkg, index) => {
  const images = pkg?.images || pkg?.gallery || pkg?.media || [];
  const firstImage = Array.isArray(images) ? images[0] : images;
  const imageUrl =
    pkg?.imageUrl ||
    pkg?.image_url ||
    pkg?.thumbnailUrl ||
    pkg?.thumbnail_url ||
    pkg?.coverImage ||
    pkg?.cover_image ||
    pkg?.bannerImage ||
    pkg?.banner_image ||
    pkg?.featuredImage ||
    pkg?.featured_image ||
    pkg?.image ||
    pkg?.thumbnail ||
    firstImage?.url ||
    firstImage?.path ||
    firstImage?.location ||
    firstImage;

  return getAbsoluteImageUrl(imageUrl, index);
};

const getPackagePrice = (pkg) => {
  const rawAmount = pkg?.priceInPaise ?? pkg?.price_in_paise ?? pkg?.price ?? pkg?.amount ?? pkg?.startingPrice ?? pkg?.starting_price;
  const numericAmount = Number(rawAmount);
  const currency = pkg?.currency || "INR";

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return { priceValue: 0, priceLabel: "On Request" };
  }

  const displayAmount = pkg?.priceInPaise !== undefined || pkg?.price_in_paise !== undefined ? numericAmount / 100 : numericAmount;

  return {
    priceValue: displayAmount,
    priceLabel: `${currency} ${displayAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
  };
};

export function normalizeHolidayPackage(pkg = {}, index = 0) {
  const title = pkg?.title || pkg?.name || pkg?.packageName || pkg?.package_name || "Holiday Package";
  const theme = pkg?.holidayTheme || pkg?.holiday_theme || pkg?.theme || pkg?.packageTheme || pkg?.package_theme || pkg?.type || "Featured";
  const tripType = pkg?.tripType || pkg?.trip_type || pkg?.packageType || pkg?.package_type || pkg?.destinationType || pkg?.destination_type || "";
  const city = pkg?.location || pkg?.city || pkg?.destination || pkg?.destinationName || pkg?.destination_name || "India";
  const rating = Number(pkg?.rating || pkg?.averageRating || pkg?.average_rating || 4.8);
  const votes = Number(pkg?.reviewsCount || pkg?.reviews_count || pkg?.votes || pkg?.reviewCount || 0);
  const id = String(pkg?.holidayPackageId || pkg?.packageId || pkg?.id || pkg?._id || `${slugifyValue(title)}-${index}`);
  const price = getPackagePrice(pkg);

  return {
    ...pkg,
    id,
    title,
    service: title,
    detailSlug: pkg?.slug || `${slugifyValue(title)}-${id}`,
    holidayTheme: String(theme || "Featured").trim() || "Featured",
    tripType: String(tripType || "").trim(),
    categoryName: String(theme || "Featured").trim() || "Featured",
    categoryLabel: String(theme || "Featured").toUpperCase(),
    badgeLabel: pkg?.badgeLabel || pkg?.badge || (index === 0 ? "FEATURED" : "POPULAR"),
    badgeClass: pkg?.badgeClass || badgeStyles[index % badgeStyles.length],
    image: getPackageImage(pkg, index),
    city,
    rating: Number.isFinite(rating) ? rating.toFixed(1) : "4.8",
    votes: Number.isFinite(votes) ? votes : 0,
    createdOrder: index,
    ...price,
  };
}

export async function fetchHolidayPackages(params = {}) {
  let lastError;

  for (const endpoint of HOLIDAY_PACKAGES_ENDPOINT_CANDIDATES) {
    try {
      const response = await MainApi.get(endpoint, {
        params,
        skipAuth: true,
        suppressAuthRedirect: true,
      });

      return normalizeHolidayPackagesResponse(response?.data).map(normalizeHolidayPackage);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export function isInternationalPackage(pkg = {}) {
  const values = [
    pkg.tripType,
    pkg.packageType,
    pkg.package_type,
    pkg.destinationType,
    pkg.destination_type,
    pkg.destination,
    pkg.country,
    pkg.categoryName,
    pkg.holidayTheme,
  ];

  return values.some((value) => String(value || "").toLowerCase().includes("international"));
}
