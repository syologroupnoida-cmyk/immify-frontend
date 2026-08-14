import { marketplaceTabs } from "../home/homeData";

const listingImages = [
  "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80",
];

const cityPool = [
  "New Delhi, India",
  "Bangalore, India",
  "Mumbai, India",
  "Chandigarh, India",
  "Pune, India",
  "Chennai, India",
  "Ahmedabad, India",
  "Hyderabad, India",
];

const requestedServicesByCategory = {
  "immigration-services": ["PR", "Ecpress Entry", "Citizenship", "Residency"],
  "visa-services": ["Tourist visa", "Work Visa", "Student Visa", "Business Visa", "Dependent Visa"],
  "study-abroad-services": ["University Services", "School Addmission"],
  "test-prepation": ["IELTS", "TOEFL", "GRE", "SAT", "GMAT", "Language Training"],
  "international-services": ["Global Mobility", "Cross Border Support", "Destination Advisory"],
  "family-relocation-services": ["Family Move Planning", "Schooling Support", "Settlement Support"],
  "document-attention-services": ["Document Attention", "Attestation", "Notary Support"],
  "financial-services": ["Education Loan", "Funds Guidance", "Tax Advisory"],
  "business-setup-services-and-immigration": ["Business Setup", "Corporate Immigration", "Investor Pathway"],
  "helth-insurance": ["Travel Insurance", "Student Insurance", "Medical Coverage"],
  "forex-services": ["Currency Exchange", "Forex Card", "Remittance"],
  "legal-and-complance": ["Legal Consultation", "Case Compliance", "Appeal Support"],
};

const requestedCategoryLabels = {
  "immigration-services": "Immigration Services",
  "visa-services": "Visa Services",
  "study-abroad-services": "Study Abroad Services",
  "test-prepation": "Test Prepation",
  "international-services": "International services tab",
  "family-relocation-services": "Family Relocation Services",
  "document-attention-services": "Document Attention Services",
  "financial-services": "Financial Services",
  "business-setup-services-and-immigration": "Business setup services and immigration",
  "helth-insurance": "Helth Insurance",
  "forex-services": "Forex Services",
  "legal-and-complance": "Legal and Complance",
};

export const marketplaceServiceAliasMap = {
  "express entry": "Ecpress Entry",
  "ecpress entry": "Ecpress Entry",
  "tourist visa": "Tourist visa",
  "school admission": "School Addmission",
};

export const structuredMarketplaceTabs = marketplaceTabs.map((tab) => ({
  ...tab,
  name: requestedCategoryLabels[tab.slug] || tab.name,
  services: requestedServicesByCategory[tab.slug] || tab.services,
}));

const getServiceImage = (serviceIndex) => listingImages[serviceIndex % listingImages.length];

export const slugifyValue = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function buildMarketplaceListings(tabs = structuredMarketplaceTabs) {
  const badges = [
    { label: "FEATURED", className: "bg-blue-600" },
    { label: "POPULAR", className: "bg-emerald-500" },
    { label: "NEW", className: "bg-violet-500" },
    { label: "BEST DEAL", className: "bg-amber-500" },
  ];

  let counter = 1;

  return tabs.flatMap((tab, tabIndex) =>
    tab.services.map((service, serviceIndex) => {
      const badge = badges[(tabIndex + serviceIndex) % badges.length];
      const city = cityPool[(tabIndex + serviceIndex) % cityPool.length];
      const priceValue = 8000 + ((tabIndex + 1) * 2900 + serviceIndex * 1400);
      const rating = (4.2 + ((tabIndex + serviceIndex) % 8) * 0.1).toFixed(1);
      const votes = 28 + tabIndex * 9 + serviceIndex * 4;

      return {
        id: `${tab.slug}-${service}-${counter++}`,
        detailSlug: `${tab.slug}--${slugifyValue(service)}`,
        categorySlug: tab.slug,
        categoryName: tab.name,
        categoryLabel: tab.name.toUpperCase(),
        service,
        badgeLabel: badge.label,
        badgeClass: badge.className,
        image: getServiceImage(serviceIndex),
        city,
        priceValue,
        priceLabel: `INR ${priceValue.toLocaleString("en-IN")}`,
        rating,
        votes,
        createdOrder: tabIndex * 100 + serviceIndex,
      };
    })
  );
}
