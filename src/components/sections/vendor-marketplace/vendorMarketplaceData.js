import { vendorCategories } from "../home/homeData";
import { vendorLocations } from "../vendors/vendorLocationData";

const responseTimes = ["Within 2 hours", "Same day", "Within 24 hours", "Next business day"];
const fallbackCities = [
  { city: "New Delhi", state: "Delhi" },
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Bengaluru", state: "Karnataka" },
  { city: "Hyderabad", state: "Telangana" },
];

const parseExperienceYears = (experience) => {
  const match = String(experience || "").match(/\d+/);
  return match ? Number(match[0]) : 0;
};

export const vendorMarketplaceCategories = vendorCategories.map((category) => ({
  slug: category.slug,
  title: category.title,
  tags: category.tags,
}));

export const vendorMarketplaceLocations = vendorLocations.map((location) => ({
  slug: location.slug,
  name: location.name,
  state: location.state,
}));

export const vendorMarketplaceListings = vendorLocations.flatMap((location, locationIndex) =>
  location.vendors.map((vendor, vendorIndex) => {
    const category = vendorCategories[(locationIndex + vendorIndex) % vendorCategories.length];
    const rating = Number(vendor.rating);
    const experienceYears = parseExperienceYears(vendor.experience);
    const services = [...new Set([vendor.specialty, ...category.tags, ...location.services])].slice(0, 5);

    return {
      id: `${location.slug}-${vendorIndex}`,
      slug: `${location.slug}-${vendor.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`,
      name: vendor.name,
      categorySlug: category.slug,
      categoryTitle: category.title,
      locationSlug: location.slug,
      city: location.name,
      state: location.state,
      image: category.image || location.image,
      rating,
      experience: vendor.experience,
      experienceYears,
      specialty: vendor.specialty,
      services,
      responseTime: responseTimes[(locationIndex + vendorIndex) % responseTimes.length],
      description: `${vendor.name} supports ${vendor.specialty.toLowerCase()} in ${location.name}, with practical help across documentation, eligibility checks, and application planning.`,
    };
  })
);

export const featuredVendorProfiles = vendorCategories.map((category, index) => {
  const location = fallbackCities[index % fallbackCities.length];
  const rating = 4.7 + ((index % 3) * 0.1);
  const experienceYears = 5 + ((index * 2) % 9);

  return {
    id: `featured-${category.slug}`,
    slug: category.slug,
    vendorUserId: category.slug,
    name: `Immify ${category.title}`,
    categorySlug: category.slug,
    categoryTitle: category.title,
    locationSlug: location.city.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    city: location.city,
    state: location.state,
    country: "India",
    image: "/images/vendor-dummy-consultancy.png",
    rating,
    experience: `${experienceYears}+ years`,
    experienceYears,
    specialty: category.tags[0] || category.title,
    services: category.tags,
    responseTime: responseTimes[index % responseTimes.length],
    phone: "08487868432",
    description: `${category.title} support for ${category.summary.toLowerCase()} Compare services, review coverage, and request a guided quote through Immify.`,
  };
});

export const vendorMarketplaceServices = [
  ...new Set(vendorMarketplaceListings.flatMap((listing) => listing.services)),
].sort((first, second) => first.localeCompare(second));

export function getVendorMarketplaceListingBySlug(slug) {
  return vendorMarketplaceListings.find((listing) => listing.slug === slug)
    || featuredVendorProfiles.find((listing) => listing.slug === slug || listing.vendorUserId === slug);
}
