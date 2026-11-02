const stateKey = Symbol.for("immify.geocoding-cache");
const state = globalThis[stateKey] ||= { cache: new Map(), pending: new Map(), queue: Promise.resolve(), lastRequest: 0 };
const cacheLifetime = 24 * 60 * 60 * 1000;

function normalizePlace(place) {
  const address = place.address || {};
  const city = address.city || address.town || address.village || address.municipality || address.county || address.state_district || "";
  const parts = [...new Set([city, address.state, address.country].filter(Boolean))];
  const label = parts.join(", ") || place.display_name || place.name || "";
  return { id: String(place.place_id || label), label, query: city || address.country || place.name || label.split(",")[0] };
}

async function lookup(key, endpoint, params) {
  const cached = state.cache.get(key);
  if (cached && cached.expires > Date.now()) return cached.places;
  if (state.pending.has(key)) return state.pending.get(key);
  const task = state.queue.catch(() => {}).then(async () => {
    const wait = Math.max(0, 1100 - (Date.now() - state.lastRequest));
    if (wait) await new Promise(resolve => setTimeout(resolve, wait));
    state.lastRequest = Date.now();
    const base = process.env.GEOCODING_BASE_URL || "https://nominatim.openstreetmap.org";
    const url = `${base.replace(/\/$/, "")}/${endpoint}?${new URLSearchParams({ format: "jsonv2", addressdetails: "1", "accept-language": "en", ...params })}`;
    const response = await fetch(url, { headers: { Accept: "application/json", "User-Agent": "ImmifyPortal/1.0 (+https://www.immify.in)" }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Location service is temporarily unavailable. Please try again.");
    const body = await response.json();
    if (body.error) throw new Error("No location found. Please search manually.");
    const seen = new Set();
    const places = (Array.isArray(body) ? body : [body]).map(normalizePlace).filter(place => place.label && !seen.has(place.label) && seen.add(place.label));
    if (state.cache.size >= 256) state.cache.delete(state.cache.keys().next().value);
    state.cache.set(key, { places, expires: Date.now() + cacheLifetime });
    return places;
  });
  state.queue = task.catch(() => {});
  state.pending.set(key, task);
  try { return await task; } finally { state.pending.delete(key); }
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.setHeader("Allow", "GET").status(405).json({ message: "Method not allowed" });
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const reverse = req.query.lat !== undefined || req.query.lon !== undefined;
  let params;
  if (reverse) {
    const lat = Number(req.query.lat), lon = Number(req.query.lon);
    if (typeof req.query.lat !== "string" || !req.query.lat.trim() || typeof req.query.lon !== "string" || !req.query.lon.trim() || !Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return res.status(400).json({ message: "Valid latitude and longitude are required." });
    params = { lat: String(lat), lon: String(lon), zoom: "10" };
  } else {
    if (q.length < 2 || q.length > 120) return res.status(400).json({ message: "Enter a city or country between 2 and 120 characters." });
    params = { q, limit: "6" };
  }
  try {
    const places = await lookup(`${reverse ? "reverse" : "search"}:${JSON.stringify(params).toLowerCase()}`, reverse ? "reverse" : "search", params);
    res.setHeader("Cache-Control", "private, max-age=300");
    return res.status(200).json({ places, attribution: "© OpenStreetMap contributors" });
  } catch (error) {
    return res.status(502).json({ message: error.name === "TimeoutError" ? "Location lookup timed out. Please try again." : "Location service is temporarily unavailable. Please try again or enter your location manually." });
  }
}
