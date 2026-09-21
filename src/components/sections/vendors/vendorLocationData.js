const featuredVendorLocations = [
  {
    name: "New Delhi",
    slug: "new-delhi",
    state: "Delhi",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=85",
    vendorCount: 42,
    rating: 4.8,
    services: ["PR consultation", "Student visa", "Work permit"],
    description: "Find experienced immigration vendors in New Delhi for visa filing, PR planning, study abroad support, and document guidance.",
    vendors: [
      { name: "Capital Visa Advisors", rating: 4.8, specialty: "Canada PR and Express Entry", experience: "9 years" },
      { name: "Delhi Global Migration", rating: 4.7, specialty: "Student and work visas", experience: "7 years" },
      { name: "North Star Immigration Desk", rating: 4.6, specialty: "Documentation and appeals", experience: "6 years" },
    ],
  },
  {
    name: "Mumbai",
    slug: "mumbai",
    state: "Maharashtra",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=85",
    vendorCount: 36,
    rating: 4.7,
    services: ["Business visa", "Visitor visa", "Study abroad"],
    description: "Connect with Mumbai-based immigration vendors for overseas education, business migration, visitor visas, and settlement planning.",
    vendors: [
      { name: "Harbour Immigration Co.", rating: 4.7, specialty: "Business and visitor visas", experience: "8 years" },
      { name: "Mumbai Study Routes", rating: 4.6, specialty: "University admissions", experience: "5 years" },
      { name: "Gateway Visa Partners", rating: 4.5, specialty: "Family relocation", experience: "6 years" },
    ],
  },
  {
    name: "Bengaluru",
    slug: "bengaluru",
    state: "Karnataka",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=85",
    vendorCount: 31,
    rating: 4.9,
    services: ["Tech worker visas", "Skilled migration", "IELTS support"],
    description: "Explore Bengaluru immigration vendors focused on skilled migration, tech worker routes, English tests, and global mobility.",
    vendors: [
      { name: "Silicon City Visa Hub", rating: 4.9, specialty: "Skilled migration", experience: "10 years" },
      { name: "Bengaluru Global Careers", rating: 4.8, specialty: "Tech worker visas", experience: "8 years" },
      { name: "Metro IELTS and Visa", rating: 4.6, specialty: "IELTS and student visas", experience: "5 years" },
    ],
  },
  {
    name: "Hyderabad",
    slug: "hyderabad",
    state: "Telangana",
    image: "https://images.unsplash.com/photo-1577702386422-4a551c93f9b7?auto=format&fit=crop&w=1200&q=85",
    vendorCount: 28,
    rating: 4.7,
    services: ["Student visa", "US visa", "Document support"],
    description: "Browse Hyderabad immigration vendors for student visa filing, US visa guidance, document review, and profile assessment.",
    vendors: [
      { name: "Pearl City Immigration", rating: 4.7, specialty: "US student visas", experience: "7 years" },
      { name: "Hyderabad Visa Experts", rating: 4.6, specialty: "Document support", experience: "6 years" },
      { name: "Global Admit Partners", rating: 4.5, specialty: "Study abroad consulting", experience: "5 years" },
    ],
  },
  {
    name: "Chandigarh",
    slug: "chandigarh",
    state: "Chandigarh",
    image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=1200&q=85",
    vendorCount: 24,
    rating: 4.6,
    services: ["Canada visa", "PR filing", "Family sponsorship"],
    description: "Compare Chandigarh immigration vendors for Canada visas, PR applications, family sponsorship, and case follow-up.",
    vendors: [
      { name: "Chandigarh Maple Visa", rating: 4.6, specialty: "Canada PR", experience: "8 years" },
      { name: "Sector 17 Immigration Desk", rating: 4.5, specialty: "Family sponsorship", experience: "6 years" },
      { name: "North India Visa Care", rating: 4.4, specialty: "Case follow-up", experience: "5 years" },
    ],
  },
];

const popularCityNames = [
  "Bangalore",
  "Mumbai",
  "Chennai",
  "Delhi",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Lucknow",
  "Patna",
  "Jaipur",
  "Indore",
  "Kochi",
  "Kolkata",
  "Coimbatore",
  "Nagpur",
  "Ludhiana",
  "Agra",
  "Bhubaneswar",
  "Bhopal",
  "Guwahati",
  "Surat",
  "Madurai",
  "Visakhapatnam",
  "Sonepat",
  "Vadodara",
  "Meerut",
  "Thiruvananthapuram",
  "Gurgaon",
  "Kozhikode",
  "Varanasi",
  "Siliguri",
  "Allahabad",
  "Rajkot",
  "Ghaziabad",
  "Mysore",
  "Noida",
  "Chandigarh",
  "Navi Mumbai",
  "Vijayawada",
  "Durgapur",
  "Srinagar",
  "Nashik",
  "Panipat",
  "Jammu",
  "Jodhpur",
  "Udaipur",
  "Thane",
  "Raipur",
  "Amritsar",
  "Jabalpur",
];

const fallbackImages = [
  "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=85",
];

export const slugifyVendorLocation = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const createVendorLocation = (name, index) => {
  const vendorCount = 18 + ((index * 7) % 29);
  const rating = (4.3 + ((index % 6) * 0.1)).toFixed(1);

  return {
    name,
    slug: slugifyVendorLocation(name),
    state: "India",
    image: fallbackImages[index % fallbackImages.length],
    vendorCount,
    rating,
    services: ["Visa filing", "PR consultation", "Study abroad"],
    description: `Find immigration vendors in ${name} for visa filing, PR guidance, study abroad consulting, and documentation support.`,
    vendors: [
      { name: `${name} Immigration Desk`, rating, specialty: "Visa filing and documentation", experience: "6 years" },
      { name: `${name} Global Visa Advisors`, rating: "4.5", specialty: "Student visas and PR consultation", experience: "7 years" },
      { name: `${name} Migration Partners`, rating: "4.4", specialty: "Work permits and family relocation", experience: "5 years" },
    ],
  };
};

const featuredBySlug = new Map(featuredVendorLocations.map((location) => [location.slug, location]));

export const vendorLocations = popularCityNames.map((name, index) => {
  const slug = slugifyVendorLocation(name);
  const featuredLocation = featuredBySlug.get(slug) || (slug === "delhi" ? featuredBySlug.get("new-delhi") : null);

  return featuredLocation
    ? {
      ...featuredLocation,
      name,
      slug,
    }
    : createVendorLocation(name, index);
});

export function getVendorLocationBySlug(slug) {
  return vendorLocations.find((location) => location.slug === slug);
}
