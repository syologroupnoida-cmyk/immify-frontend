import { categoryKey } from "./marketplaceFilters.mjs";

const categoryName = (value) => categoryKey(value).replace(/-services?$/, "");

export function resolveProviderCategories({ selection, requested, options, loading }) {
  if (selection !== null) return selection;
  if (!requested || loading) return [];
  const exact = options.find((option) => option.slug === requested);
  const match = exact || options.find((option) => categoryName(option.title) === categoryName(requested));
  return match ? [match.slug] : [];
}

const countryAliases = {
  us: "united-states", usa: "united-states", "united-states-of-america": "united-states",
  uk: "united-kingdom", "great-britain": "united-kingdom",
  "united-arab-emirates": "uae",
};
const countryKey = (value) => {
  const key = String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return countryAliases[key] || key;
};

export function matchesProviderCountry(vendor, country) {
  return !country || countryKey(vendor.country || "India") === countryKey(country);
}
