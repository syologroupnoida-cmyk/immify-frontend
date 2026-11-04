import { topCountries } from "./homeData";

const photos = {
  canada: { src: "/images/countries/destination-canada.webp", alt: "Toronto skyline and CN Tower across the waterfront" },
  australia: { src: "/images/countries/destination-australia.webp", alt: "Sydney Opera House and Harbour Bridge beside the harbour" },
  "united-states": { src: "/images/countries/destination-united-states.webp", alt: "Statue of Liberty and the New York skyline" },
  "united-kingdom": { src: "/images/countries/destination-united-kingdom.webp", alt: "Big Ben and the Houses of Parliament beside the River Thames" },
  "new-zealand": { src: "/images/countries/destination-new-zealand.webp", alt: "Queenstown lake and the Southern Alps in New Zealand" },
  germany: { src: "/images/countries/destination-germany.webp", alt: "Brandenburg Gate in Berlin, Germany" },
  uae: { src: "/images/countries/destination-uae.webp", alt: "Dubai skyline and Burj Khalifa beside the waterfront" },
  singapore: { src: "/images/countries/destination-singapore.webp", alt: "Marina Bay Sands and the Singapore skyline" },
  ireland: { src: "/images/countries/destination-ireland.webp", alt: "Ha'penny Bridge crossing the River Liffey in Dublin" },
  france: { src: "/images/countries/destination-france.webp", alt: "Eiffel Tower and the River Seine in Paris" },
};

export const featuredDestinations = topCountries.slice(0, 4);

export function getDestinationPhoto(slug) {
  return photos[slug] || { src: "/images/home/immify-move-abroad.webp", alt: "International travellers preparing for their next chapter abroad" };
}
