# Homepage location, process and quote updates

The hero and header share `immifySelectedLocation` and the `immify-location-change` event. Selecting a place updates both controls. The header's existing current-location flow fills the hero after browser permission is granted; users can also request detection from the picker. Denied permission leaves manual search available.

The MUI location picker searches on Enter or its Search button, not on each keystroke. It also offers local country options and manual entry. Search submits the location's first component as `serviceLocation` and filters existing live listings by their city/country fields, independently of the text search.

`GET /api/locations?q=...` searches places; `GET /api/locations?lat=...&lon=...` performs reverse lookup. The response contains `places` with `id`, `label` and `query`, plus attribution. Unsupported methods return 405, invalid inputs return 400 and upstream errors return 502. Requests time out after eight seconds. The proxy caches successful results for 24 hours, deduplicates pending lookups and spaces upstream requests by at least 1.1 seconds per server process.

`GEOCODING_BASE_URL` can change the upstream without changing frontend code. It defaults to the existing Nominatim provider. See the [public-instance usage policy](https://operations.osmfoundation.org/policies/nominatim/) and [search documentation](https://nominatim.org/release-docs/latest/api/Search/). Multi-instance deployments must use a shared application-wide rate limiter/cache or an appropriately provisioned provider; the in-memory limiter coordinates one process. Attribution appears in both location pickers.

The homepage process section uses the document's existing four steps and trust note. The provider promotion card was removed. The quote form retains its existing `/leads` request and optional document-upload path; its submit button now has a stable desktop width, full mobile width, loading indicator and synchronous duplicate-submit guard.

## Local verification

Run the dependency simulation without publishing or recording cloud history:

```powershell
postman simulation run postman/simulations/homepage.sim.yaml --port 4900 --no-history --output ndjson
```

The geocoding fixture is based on Nominatim's documented response shape. The quote fixture models the existing frontend caller, not undocumented backend rules. No owning workspace or published owner mock was available in this checkout; these are local fixtures generated from the included contract subsets and extended for failure checks. They have not been published or deployed.

For an isolated QA application, the geocoding upstream is `http://127.0.0.1:4900/geocoding` and the frontend API base is `http://127.0.0.1:4900/immify`. Keep these test addresses out of production builds. During this verification a separate production QA server used the local geocoding upstream, and browser network requests for the existing API were redirected over HTTP to the simulation so the user's port-3000 dev server and production configuration were preserved.

Verified in a real browser:

- Current-location auto-fill, explicit lookup, selection, saved-location restore and two-way header/hero sync.
- Location filtering with Delhi and Mumbai listing fixtures.
- Upstream lookup failure and denied geolocation permission.
- Invalid form sends no lead; a rapid double submit sends exactly one.
- Submission loading, success/reset, failure retaining entered values and successful retry.
- Four process steps, provider-card removal and stable submit-button layout at 1440, 390 and 320 pixels.

The production build and scoped ESLint checks passed. The simulation logs contain the real HTTP lookup and lead calls, including successful and failed submissions. This validates the frontend against the modeled contracts; live-provider operation, production persistence and attachment upload were not exercised. No real enquiries were created.
