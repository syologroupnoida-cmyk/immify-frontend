const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.immify.in/api/v1';

function getTargetUrl(req) {
  const path = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
  const query = { ...req.query };
  delete query.path;

  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item));
      return;
    }
    if (value !== undefined) searchParams.append(key, value);
  });

  const base = API_BASE_URL.replace(/\/$/, '');
  const search = searchParams.toString();
  return `${base}/${path}${search ? `?${search}` : ''}`;
}

export default async function handler(req, res) {
  const headers = { ...req.headers };
  delete headers.host;
  delete headers.connection;
  delete headers['content-length'];

  try {
    const response = await fetch(getTargetUrl(req), {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
    });

    const contentType = response.headers.get('content-type') || '';
    const body = contentType.includes('application/json') ? await response.json() : await response.text();

    res.status(response.status);
    if (contentType) res.setHeader('content-type', contentType);
    res.send(body);
  } catch (error) {
    res.status(502).json({
      message: error?.message || 'Unable to reach API server.',
    });
  }
}
