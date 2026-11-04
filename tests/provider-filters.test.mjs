import test from "node:test";
import assert from "node:assert/strict";
import { matchesProviderCountry, resolveProviderCategories } from "../src/util/providerFilters.mjs";

const options = [
  { slug: "api-visa-id", title: "Visa Services" },
  { slug: "api-documents-id", title: "Document Attention Services" },
  { slug: "api-legal-id", title: "Legal and Compliance" },
];
const resolve = (overrides) => resolveProviderCategories({ selection: null, requested: "Visa Services", options, loading: false, ...overrides });

test("service-card query resolves to the API category ID after category loading", () => {
  assert.deepEqual(resolve({ loading: true, options: [{ slug: "Visa Services", title: "Visa Services" }] }), []);
  assert.deepEqual(resolve({}), ["api-visa-id"]);
});

test("category links accept IDs, case changes and existing category aliases", () => {
  assert.deepEqual(resolve({ requested: "api-visa-id" }), ["api-visa-id"]);
  assert.deepEqual(resolve({ requested: " VISA SERVICES " }), ["api-visa-id"]);
  assert.deepEqual(resolve({ requested: "Documentation Services" }), ["api-documents-id"]);
  assert.deepEqual(resolve({ requested: "Legal & Compliance Services" }), ["api-legal-id"]);
});

test("reset and explicit selection take precedence over URL categories", () => {
  assert.deepEqual(resolve({ selection: [] }), []);
  assert.deepEqual(resolve({ selection: ["api-legal-id"] }), ["api-legal-id"]);
});

test("changing the URL query resolves the new category and unknown names remain unfiltered", () => {
  assert.deepEqual(resolve({ requested: "Legal and Compliance" }), ["api-legal-id"]);
  assert.deepEqual(resolve({ requested: "unknown" }), []);
  assert.deepEqual(resolve({ requested: "" }), []);
});

test("country filtering excludes other countries and recognizes common API country names", () => {
  assert.equal(matchesProviderCountry({ country: "Canada" }, "Canada"), true);
  assert.equal(matchesProviderCountry({ country: "India" }, "Canada"), false);
  assert.equal(matchesProviderCountry({ country: "USA" }, "United States"), true);
  assert.equal(matchesProviderCountry({ country: "UK" }, "United Kingdom"), true);
  assert.equal(matchesProviderCountry({ country: "United Arab Emirates" }, "UAE"), true);
});

test("resetting the country shows all providers and Indian fallback data cannot appear as abroad providers", () => {
  assert.equal(matchesProviderCountry({ country: "Canada" }, ""), true);
  assert.equal(matchesProviderCountry({}, "Canada"), false);
  assert.equal(matchesProviderCountry({}, "India"), true);
});
