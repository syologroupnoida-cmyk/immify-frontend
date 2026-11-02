export function filterKey(value) {
  return String(value || "").trim().toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const categoryAliases = {
  immigration: "immigration-services",
  "test-prepation": "test-preparation",
  "document-attention-services": "document-attestation-services",
  "documentation-services": "document-attestation-services",
  "helth-insurance": "health-insurance",
  "legal-and-complance": "legal-and-compliance",
};
const serviceAliases = {
  pr: "permanent-residency",
  "permanent-residency-pr": "permanent-residency",
  "ecpress-entry": "express-entry",
  "school-addmission": "school-admission",
};

export const categoryKey = (value) => categoryAliases[filterKey(value)] || filterKey(value);
export const serviceKey = (value) => serviceAliases[filterKey(value)] || filterKey(value);
export const queryValues = (value) => (Array.isArray(value) ? value : value ? [value] : []).filter(Boolean);

export function buildFilterGroups(categories, listings, fallbackTabs) {
  const groups = new Map();
  const addGroup = (name, id = "") => {
    const key = categoryKey(name);
    if (!groups.has(key)) groups.set(key, { key, name, ids: [], services: [] });
    const group = groups.get(key);
    if (id && !group.ids.includes(id)) group.ids.push(id);
    return group;
  };
  const addService = (group, name, id = "") => {
    if (!name) return;
    const key = serviceKey(name);
    let service = group.services.find((item) => item.key === key);
    if (!service) { service = { key, name, ids: [] }; group.services.push(service); }
    if (id && !service.ids.includes(id)) service.ids.push(id);
  };
  categories.forEach((category) => {
    const group = addGroup(category.name, category.id);
    (category.services || []).forEach((service) => addService(group, service.name, service.id));
  });
  fallbackTabs.forEach((tab) => {
    const group = addGroup(tab.name);
    group.name = tab.name;
    tab.services.forEach((name) => addService(group, name));
  });
  listings.forEach((item) => {
    const group = [...groups.values()].find((entry) => entry.ids.includes(item.categoryId)) || addGroup(item.categoryName, item.categoryId);
    if (!item.serviceId || !group.services.some((service) => service.ids.includes(item.serviceId))) {
      addService(group, item.serviceName || item.service, item.serviceId);
    }
  });
  return [...groups.values()];
}

export function matchesMarketplaceCategory(item, requested, groups) {
  if (!requested.length) return true;
  return requested.some((value) => {
    const key = categoryKey(value);
    const group = groups.find((entry) => entry.key === key || entry.ids.includes(value));
    return item.categoryId === value || item.categorySlug === value
      || categoryKey(item.categoryName) === key || categoryKey(item.categorySlug) === key
      || Boolean(group?.ids.includes(item.categoryId));
  });
}

export function matchesMarketplaceService(item, requested, groups) {
  if (!requested.length) return true;
  const services = groups.flatMap((group) => group.services);
  return requested.some((value) => {
    const key = serviceKey(value);
    return item.serviceId === value || serviceKey(item.serviceName || item.service) === key
      || services.some((service) => (service.key === key || service.ids.includes(value))
        && (service.ids.includes(item.serviceId) || service.key === serviceKey(item.serviceName || item.service)));
  });
}

export function marketplaceRequestGroups(categories, services, groups) {
  if (categories.length) return groups.filter((group) => categories.some((value) => group.key === categoryKey(value) || group.ids.includes(value)));
  if (services.length) return groups.filter((group) => group.services.some((service) => services.some((value) => service.key === serviceKey(value) || service.ids.includes(value))));
  return [];
}

export function paginationItems(current, total) {
  if (total <= 4) return Array.from({ length: total }, (_, index) => index + 1);
  const numbers = current <= 2 ? [1, 2, 3, total]
    : current >= total - 1 ? [1, total - 2, total - 1, total]
      : [1, current, current + 1, total];
  return [...new Set(numbers)].flatMap((number, index, array) => (
    index && number - array[index - 1] > 1 ? [`gap-${number}`, number] : [number]
  ));
}
