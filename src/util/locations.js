export const LOCATION_STORAGE_KEY = "immifySelectedLocation";
export const LOCATION_CHANGED_EVENT = "immify-location-change";

export function getLocationSearchTerm(label = "") {
  return label.split(",")[0].trim();
}

export function readSavedLocation() {
  try { return window.localStorage.getItem(LOCATION_STORAGE_KEY) || ""; }
  catch { return ""; }
}

export function saveLocation(label) {
  try { window.localStorage.setItem(LOCATION_STORAGE_KEY, label); } catch {}
  window.dispatchEvent(new CustomEvent(LOCATION_CHANGED_EVENT, { detail: label }));
}

async function getPlaces(params, signal) {
  const response = await fetch(`/api/locations?${new URLSearchParams(params)}`, { signal });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Location lookup is unavailable. Please try again.");
  return data.places || [];
}

export function searchLocations(query, signal) {
  return getPlaces({ q: query.trim() }, signal);
}

export async function detectLocation(signal) {
  if (!navigator.geolocation) throw new Error("Location detection is not supported. Search for a location instead.");
  const position = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, error => reject(new Error(error.code === 1 ? "Location access was denied. Please search manually." : "Unable to detect your location. Please search manually.")), { enableHighAccuracy: false, timeout: 9000, maximumAge: 30 * 60 * 1000 }));
  signal?.throwIfAborted();
  const places = await getPlaces({ lat: String(position.coords.latitude), lon: String(position.coords.longitude) }, signal);
  if (!places.length) throw new Error("No location found. Please search manually.");
  return places[0];
}
