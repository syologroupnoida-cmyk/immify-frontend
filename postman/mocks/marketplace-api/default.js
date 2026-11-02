// Caller-derived fixtures use the response fields normalized by src/util/serviceListings.js.
const http = require("http");
let requests = [];
const categories = [
  { id: "visa-id", name: "Visa Services", services: [{ id: "work-id", name: "Work Visa" }, { id: "tourist-id", name: "Tourist Visa" }] },
  { id: "immigration-id", name: "Immigration", services: [{ id: "pr-id", name: "Permanent Residency (PR)" }] },
];
const listings = Array.from({ length: 64 }, (_, index) => {
  const category = index % 4 === 3 ? categories[1] : categories[0];
  const service = category.services[category === categories[1] ? 0 : index % 2];
  return { id: `qa-marketplace-${index + 1}`, categoryId: category.id, categoryName: category.name, serviceId: service.id, serviceName: service.name, title: `${service.name} planning ${index + 1}`, description: "Sample provider support for your overseas plans.", imageUrl: "/images/marketplace-banner.png", dynamicData: { city: index % 2 ? "Mumbai" : "Delhi" }, priceInPaise: (index + 1) * 100000, currency: "INR" };
});
http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const path = url.pathname;
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  const send = (status, body) => { res.writeHead(status, { "Content-Type": "application/json" }); res.end(JSON.stringify(body)); };
  if (req.method === "GET" && path === "/_test/requests") return send(200, { requests });
  if (req.method === "POST" && path === "/_test/reset") { requests = []; return send(200, { reset: true }); }
  requests.push({ method: req.method, path, categoryName: url.searchParams.get("categoryName") || "" });
  if (req.method === "GET" && path === "/service-listings") {
    const categoryName = url.searchParams.get("categoryName");
    return send(200, { data: categoryName ? listings.filter((item) => item.categoryName === categoryName) : listings });
  }
  if (req.method === "GET" && path === "/service-categories") return send(200, { data: categories.map(({ id, name }) => ({ id, name })) });
  const category = categories.find((item) => path === `/service-categories/${item.id}`);
  if (req.method === "GET" && category) return send(200, { data: category });
  return send(501, { message: "Endpoint not modeled by the marketplace fixture" });
}).listen(process.env.PORT || 4500);
