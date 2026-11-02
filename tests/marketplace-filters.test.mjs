import test from "node:test";
import assert from "node:assert/strict";
import { buildFilterGroups, marketplaceRequestGroups, matchesMarketplaceCategory, matchesMarketplaceService, paginationItems } from "../src/util/marketplaceFilters.mjs";

const categories = [
  { id: "visa-id", name: "Visa Services", services: [{ id: "work-id", name: "Work Visa" }, { id: "tourist-id", name: "Tourist Visa" }] },
  { id: "immigration-id", name: "Immigration", services: [{ id: "pr-id", name: "Permanent Residency (PR)" }] },
];
const listings = [
  { id: "work", categoryId: "visa-id", categoryName: "Visa Services", serviceId: "work-id", serviceName: "Work Visa", service: "Career move consultation" },
  { id: "tourist", categoryId: "visa-id", categoryName: "Visa Services", serviceId: "tourist-id", serviceName: "Tourist Visa", service: "A trip to remember" },
  { id: "pr", categoryId: "immigration-id", categoryName: "Immigration", serviceId: "pr-id", serviceName: "Permanent Residency (PR)", service: "Your next chapter" },
];
const groups = buildFilterGroups(categories, listings, [{ name: "Immigration Services", services: ["PR", "Express Entry"] }]);
const filter = (category, service) => listings.filter((item) => matchesMarketplaceCategory(item, category, groups) && matchesMarketplaceService(item, service, groups)).map((item) => item.id);

test("footer category and service names filter listings with unrelated display titles", () => {
  assert.deepEqual(filter(["visa-services"], ["Work Visa"]), ["work"]);
  assert.deepEqual(filter(["immigration-services"], ["PR"]), ["pr"]);
});
test("legacy ID links, multiple checkboxes, and clearing filters work", () => {
  assert.deepEqual(filter(["visa-id"], ["work-id"]), ["work"]);
  assert.deepEqual(filter([], ["work-visa", "tourist-visa"]), ["work", "tourist"]);
  assert.deepEqual(filter(["visa-services", "immigration-services"], []), ["work", "tourist", "pr"]);
  assert.deepEqual(filter([], []), ["work", "tourist", "pr"]);
  assert.deepEqual(filter([], ["unknown-service"]), []);
  assert.deepEqual(filter(["unknown-category"], []), []);
});
test("canonical service IDs still match when listing names differ", () => {
  assert.equal(matchesMarketplaceService({ serviceId: "work-id", serviceName: "A custom listing title" }, ["Work Visa"], groups), true);
  assert.equal(matchesMarketplaceService(listings[1], ["Work Visa"], groups), false);
});
test("API category requests follow category checkboxes, service checkboxes and legacy IDs", () => {
  assert.deepEqual(marketplaceRequestGroups(["visa-services"], [], groups).map((group) => group.name), ["Visa Services"]);
  assert.deepEqual(marketplaceRequestGroups([], ["Work Visa"], groups).map((group) => group.ids), [["visa-id"]]);
  assert.deepEqual(marketplaceRequestGroups([], ["pr-id"], groups).map((group) => group.name), ["Immigration Services"]);
  assert.equal(marketplaceRequestGroups(["visa-id", "immigration-services"], [], groups).length, 2);
  assert.deepEqual(marketplaceRequestGroups([], [], groups), []);
});
test("catalog merges API and footer categories without dropping services", () => {
  const immigration = groups.filter((group) => group.key === "immigration-services");
  assert.equal(immigration.length, 1);
  assert.equal(immigration[0].services.filter((service) => service.key === "permanent-residency").length, 1);
  assert.equal(immigration[0].services.some((service) => service.key === "express-entry"), true);
  const customTitles = buildFilterGroups(categories, [{ ...listings[0], serviceName: "A custom listing title" }], []);
  assert.equal(customTitles[0].services.length, 2);
});
test("pagination stays compact, includes current and last page, and never skips a single gap without an ellipsis", () => {
  for (let total = 1; total <= 100; total++) {
    for (let current = 1; current <= total; current++) {
      const items = paginationItems(current, total);
      const numbers = items.filter((item) => typeof item === "number");
      assert.ok(numbers.length <= 4);
      assert.ok(numbers.includes(current));
      assert.ok(numbers.includes(total));
      assert.equal(new Set(numbers).size, numbers.length);
      for (let index = 1; index < items.length; index++) {
        if (typeof items[index] === "number" && typeof items[index - 1] === "number") assert.equal(items[index] - items[index - 1], 1);
      }
    }
  }
});
