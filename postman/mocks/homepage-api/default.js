const http = require('http');
let requests = [];
let failNext = false;
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:3017');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-mock-session');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  const json = (code, body) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.method === 'POST' && url.pathname === '/_test/reset') { requests = []; failNext = false; return json(200, { reset: true }); }
  if (req.method === 'POST' && url.pathname === '/_test/fail-next') { failNext = true; return json(200, { failNext: true }); }
  if (req.method === 'GET' && url.pathname === '/_test/requests') return json(200, { requests });
  if (req.method === 'POST' && url.pathname === '/leads') {
    let body = req.body;
    if (!body) { const chunks = []; for await (const chunk of req) chunks.push(chunk); try { body = JSON.parse(Buffer.concat(chunks).toString()); } catch { return json(400, { message: 'Invalid JSON' }); } }
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return json(400, { message: 'Invalid JSON' }); } }
    const required = ['firstName', 'lastName', 'email', 'phone', 'servicesRequired', 'destinationCountries', 'message'];
    if (required.some(key => !body?.[key] || (Array.isArray(body[key]) && !body[key].length))) return json(400, { message: 'Missing required enquiry fields' });
    requests.push({ path: '/leads', body });
    await new Promise(resolve => setTimeout(resolve, 600));
    if (failNext) { failNext = false; return json(503, { message: 'Temporary enquiry outage. Please try again.' }); }
    return json(201, { message: 'Your enquiry has been received.' });
  }
  if (req.method === 'GET' && url.pathname === '/service-listings') return json(200, { data: [{ id: 'qa-delhi-visa', categoryName: 'Visa Services', title: 'Delhi visa consultation', description: 'Local QA fixture', dynamicData: { city: 'Delhi', country: 'India' }, priceInPaise: 10000, currency: 'INR' }, { id: 'qa-mumbai-visa', categoryName: 'Visa Services', title: 'Mumbai visa consultation', description: 'Local QA fixture', dynamicData: { city: 'Mumbai', country: 'India' }, priceInPaise: 10000, currency: 'INR' }] });
  if (req.method === 'GET' && ['/jobs', '/vendors', '/universities', '/categories', '/service-categories', '/subscription-plans'].some(path => url.pathname.startsWith(path))) return json(200, { data: [] });
  return json(501, { message: 'Endpoint not modeled in this dependency fixture' });
});
server.listen(process.env.PORT || 4500);
