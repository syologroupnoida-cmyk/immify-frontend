const http = require('http');
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const json = (code, body) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
  if (req.method === 'GET' && url.pathname === '/search') {
    const query = url.searchParams.get('q') || '';
    if (!query) return json(400, { error: 'Query is required' });
    if (query.toLowerCase() === 'lookup failure') return json(503, { error: 'Simulated lookup outage' });
    if (query.toLowerCase() === 'unknown place') return json(200, []);
    return json(200, [{ place_id: 101, display_name: 'Delhi, India', address: { city: 'Delhi', state: 'Delhi', country: 'India' } }]);
  }
  if (req.method === 'GET' && url.pathname === '/reverse') {
    if (!url.searchParams.has('lat') || !url.searchParams.has('lon')) return json(400, { error: 'Coordinates are required' });
    return json(200, { place_id: 102, display_name: 'Moradabad, Uttar Pradesh, India', address: { city: 'Moradabad', state: 'Uttar Pradesh', country: 'India' } });
  }
  return json(501, { error: 'Endpoint not modeled in this dependency fixture' });
});
server.listen(process.env.PORT || 4500);
