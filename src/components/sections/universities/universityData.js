import universityFallbackCampus from "@/images/university-fallback-campus.png";

export const universityCourseCategories = [
  { category: "Computer Science & IT", courses: ["Computer Science", "Software Engineering", "AI", "Machine Learning", "Data Science", "Cybersecurity", "Cloud Computing", "Information Systems", "Computer Engineering", "Robotics"] },
  { category: "Engineering", courses: ["Mechanical", "Civil", "Electrical", "Electronics", "Chemical", "Aerospace", "Industrial", "Biomedical", "Environmental", "Mechatronics", "Automotive", "Petroleum"] },
  { category: "Business & Management", courses: ["BBA", "MBA", "Finance", "Marketing", "HR", "International Business", "Operations", "Business Analytics", "Entrepreneurship", "Supply Chain"] },
  { category: "Accounting & Finance", courses: ["Accounting", "Finance", "Banking", "Investment", "Financial Analytics", "Actuarial Science", "FinTech"] },
  { category: "Economics", courses: ["Economics", "Applied Economics", "Econometrics", "Development Economics", "Financial Economics"] },
  { category: "Medicine", courses: ["Medicine", "MBBS/MD-equivalent programs", "Medical Sciences", "Clinical Research", "Public Health"] },
  { category: "Nursing", courses: ["Nursing", "Adult Nursing", "Child Nursing", "Mental Health Nursing", "Nursing Leadership"] },
  { category: "Pharmacy", courses: ["Pharmacy", "Pharmaceutical Sciences", "Pharmacology", "Pharmaceutical Biotechnology"] },
  { category: "Dentistry", courses: ["Dentistry", "Dental Surgery", "Oral Health", "Dental Sciences"] },
  { category: "Life Sciences", courses: ["Biology", "Biotechnology", "Biochemistry", "Microbiology", "Genetics", "Molecular Biology", "Neuroscience"] },
  { category: "Health Sciences", courses: ["Physiotherapy", "Occupational Therapy", "Nutrition", "Dietetics", "Radiology", "Medical Laboratory Science"] },
  { category: "Public Health", courses: ["MPH", "Epidemiology", "Global Health", "Health Policy", "Health Administration"] },
  { category: "Architecture", courses: ["Architecture", "Landscape Architecture", "Urban Design", "Interior Architecture"] },
  { category: "Design", courses: ["Product Design", "Fashion Design", "Graphic Design", "UX/UI", "Industrial Design", "Interior Design"] },
  { category: "Law", courses: ["LLB/JD", "LLM", "International Law", "Corporate Law", "Commercial Law", "Human Rights"] },
  { category: "Social Sciences", courses: ["Sociology", "Psychology", "Political Science", "International Relations", "Anthropology"] },
  { category: "Education", courses: ["Education", "Early Childhood Education", "Special Education", "Educational Leadership", "TESOL"] },
  { category: "Arts & Humanities", courses: ["English", "History", "Philosophy", "Literature", "Languages", "Cultural Studies"] },
  { category: "Media & Communication", courses: ["Journalism", "Mass Communication", "Film", "Digital Media", "Advertising", "Public Relations"] },
  { category: "Hospitality & Tourism", courses: ["Hotel Management", "Tourism", "Hospitality", "Event Management", "Culinary Arts"] },
  { category: "Agriculture", courses: ["Agriculture", "Agribusiness", "Horticulture", "Food Science", "Agricultural Engineering"] },
  { category: "Environmental Studies", courses: ["Environmental Science", "Sustainability", "Climate Science", "Renewable Energy"] },
  { category: "Science", courses: ["Physics", "Chemistry", "Mathematics", "Statistics", "Astronomy", "Earth Sciences"] },
  { category: "Architecture & Planning", courses: ["Urban Planning", "Regional Planning", "Real Estate", "Construction Management"] },
  { category: "Aviation", courses: ["Aviation Management", "Aerospace", "Pilot Training", "Airport Management"] },
  { category: "Marine Studies", courses: ["Marine Engineering", "Oceanography", "Marine Biology", "Maritime Management"] },
  { category: "Supply Chain & Logistics", courses: ["Logistics", "Supply Chain Management", "Procurement", "Transportation"] },
  { category: "Psychology", courses: ["Psychology", "Clinical Psychology", "Counselling", "Organizational Psychology"] },
  { category: "Data & Analytics", courses: ["Data Science", "Business Analytics", "Data Analytics", "Statistics", "Big Data"] },
  { category: "AI & Robotics", courses: ["Artificial Intelligence", "Machine Learning", "Robotics", "Autonomous Systems"] },
  { category: "Energy", courses: ["Renewable Energy", "Energy Engineering", "Nuclear Engineering", "Energy Management"] },
  { category: "Construction", courses: ["Construction Management", "Quantity Surveying", "Building Services", "Project Management"] },
  { category: "Fashion", courses: ["Fashion Design", "Fashion Management", "Textile Design", "Fashion Marketing"] },
  { category: "Performing Arts", courses: ["Music", "Dance", "Theatre", "Acting", "Performing Arts"] },
  { category: "Sports", courses: ["Sports Management", "Sports Science", "Exercise Science", "Physiotherapy"] },
  { category: "Veterinary Science", courses: ["Veterinary Medicine", "Animal Science", "Veterinary Biosciences"] },
];

export const universityDegreeLevels = [
  "Certificate",
  "Diploma",
  "Advanced Diploma",
  "Foundation",
  "Associate Degree",
  "Bachelor's",
  "Honours Bachelor's",
  "Graduate Certificate",
  "Graduate Diploma",
  "Master's",
  "MBA",
  "MPhil",
  "PhD",
  "Doctorate",
  "Postdoctoral",
];

const regionCountries = [
  { region: "North America", countries: ["Canada", "USA", "Mexico"] },
  { region: "Europe", countries: ["UK", "Germany", "France", "Ireland", "Netherlands", "Sweden", "Finland", "Denmark", "Norway", "Switzerland", "Austria", "Belgium", "Spain", "Portugal", "Italy", "Poland", "Czech Republic", "Hungary", "Estonia", "Latvia", "Lithuania"] },
  { region: "Oceania", countries: ["Australia", "New Zealand"] },
  { region: "Asia", countries: ["Singapore", "Japan", "South Korea", "Malaysia", "Hong Kong", "UAE", "Saudi Arabia"] },
];

const regionImages = {
  "North America": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=85",
  Europe: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=85",
  Oceania: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1200&q=85",
  Asia: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=85",
};

const countryImageOverrides = {
  Canada: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=85",
  USA: "https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&w=1200&q=85",
  UK: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=85",
  Australia: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1200&q=85",
  Singapore: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=85",
  UAE: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=85",
};

const countryFlagCodes = {
  Canada: "ca",
  USA: "us",
  Mexico: "mx",
  UK: "gb",
  Germany: "de",
  France: "fr",
  Ireland: "ie",
  Netherlands: "nl",
  Sweden: "se",
  Finland: "fi",
  Denmark: "dk",
  Norway: "no",
  Switzerland: "ch",
  Austria: "at",
  Belgium: "be",
  Spain: "es",
  Portugal: "pt",
  Italy: "it",
  Poland: "pl",
  "Czech Republic": "cz",
  Hungary: "hu",
  Estonia: "ee",
  Latvia: "lv",
  Lithuania: "lt",
  Australia: "au",
  "New Zealand": "nz",
  Singapore: "sg",
  Japan: "jp",
  "South Korea": "kr",
  Malaysia: "my",
  "Hong Kong": "hk",
  UAE: "ae",
  "Saudi Arabia": "sa",
};

const countryCities = {
  Canada: ["Toronto", "Vancouver", "Montreal", "Ottawa", "Calgary"],
  USA: ["New York", "Boston", "Chicago", "Seattle", "San Francisco"],
  UK: ["London", "Manchester", "Birmingham", "Leeds", "Edinburgh"],
  Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Stuttgart"],
  France: ["Paris", "Lyon", "Toulouse", "Nice", "Bordeaux"],
  Ireland: ["Dublin", "Cork", "Galway", "Limerick", "Waterford"],
  Australia: ["Melbourne", "Sydney", "Brisbane", "Perth", "Adelaide"],
  "New Zealand": ["Auckland", "Wellington", "Christchurch", "Hamilton", "Dunedin"],
  Singapore: ["Singapore", "Jurong", "Tampines", "Queenstown", "Novena"],
  UAE: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Al Ain"],
};

const countryCurrencies = {
  Canada: "CAD",
  USA: "USD",
  Mexico: "MXN",
  UK: "GBP",
  Australia: "AUD",
  "New Zealand": "NZD",
  Singapore: "SGD",
  UAE: "AED",
  "Saudi Arabia": "SAR",
  Japan: "JPY",
  "South Korea": "KRW",
  Malaysia: "MYR",
  "Hong Kong": "HKD",
};

const universityNameSeeds = ["Global", "International", "Metropolitan", "Applied Sciences", "Royal", "Central", "Technical", "Medical", "Business", "Innovation"];

const allCountries = regionCountries.flatMap((group) =>
  group.countries.map((country) => ({
    country,
    region: group.region,
    image: countryImageOverrides[country] || regionImages[group.region],
    flagUrl: countryFlagCodes[country] ? `https://flagcdn.com/w80/${countryFlagCodes[country]}.png` : "",
  }))
);

const allCourses = universityCourseCategories.flatMap((group) => group.courses);
const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const universityCountryMeta = allCountries;

export const universities = allCountries.flatMap((countryMeta, countryIndex) => {
  const cities = countryCities[countryMeta.country] || ["Capital City", "Metro City", "Central City", "University Town", "North Campus"];
  const currency = countryCurrencies[countryMeta.country] || "EUR";

  return universityNameSeeds.map((seed, index) => {
    const course = allCourses[(countryIndex * 10 + index) % allCourses.length];
    const city = cities[index % cities.length];
    const tuition = 12500 + countryIndex * 420 + index * 650;
    const name = `${city} ${seed} University`;

    return {
      name,
      slug: slugify(`${name}-${countryMeta.country}`),
      country: countryMeta.country,
      region: countryMeta.region,
      city,
      type: index % 3 === 0 ? "Public" : index % 3 === 1 ? "Private" : "Applied Institute",
      level: universityDegreeLevels[index % universityDegreeLevels.length],
      course,
      courses: allCourses,
      tuition,
      tuitionLabel: `${currency} ${tuition.toLocaleString("en-IN")}/yr`,
      ranking: `#${10 + countryIndex + index} International`,
      rating: Number((4.3 + ((countryIndex + index) % 7) * 0.1).toFixed(1)),
      reviews: 110 + countryIndex * 11 + index * 13,
      intake: index % 2 === 0 ? "September 2026" : "January 2027",
      scholarship: index % 3 === 0 ? "Up to 30%" : index % 3 === 1 ? "Merit grants" : "Up to 20%",
      duration: index % 4 === 0 ? "4 years" : index % 4 === 1 ? "2 years" : index % 4 === 2 ? "18 months" : "5 years",
      image: countryMeta.image || universityFallbackCampus.src,
      summary: `A ${countryMeta.region} institution in ${city}, ${countryMeta.country}, offering ${course} plus broad study pathways across international degree levels.`,
      highlights: ["International support", course, countryMeta.region],
    };
  });
});

export const universityCountries = allCountries.map((item) => item.country);
export const universityCourses = allCourses;
export const universityTypes = [...new Set(universities.map((item) => item.type))];
