const assert = require('node:assert/strict');
const fs = require('node:fs');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
(async () => {
  fs.mkdirSync('tmp/marketplace-preview', { recursive: true });
  const targets = await (await fetch('http://127.0.0.1:9224/json/list')).json();
  const target = targets.find((item) => item.type === 'page');
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve); socket.addEventListener('error', reject); });
  let nextId = 0;
  const pending = new Map();
  const exceptions = [];
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id); pending.delete(message.id);
      message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result);
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const waitFor = async (expression) => {
    for (let attempt = 0; attempt < 120; attempt++) { if (await evaluate(`Boolean(${expression})`)) return; await delay(500); }
    throw new Error('Timed out: ' + expression);
  };
  const click = (selector) => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const snapshot = async (file) => {
    const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync('tmp/marketplace-preview/' + file, Buffer.from(data, 'base64'));
  };
  const navigate = async (path) => { await send('Page.navigate', { url: 'http://localhost:3018' + path }); await waitFor(`document.querySelector('[aria-label="Service listings"]')?.getAttribute('aria-busy') === 'false' && document.querySelectorAll('[data-marketplace-listing]').length > 0`); };
  try {
    await send('Page.enable'); await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await navigate('/marketplace?category=visa-services&service=Work%20Visa');
    await waitFor(`document.querySelector('[aria-label="Service listings"]').textContent.includes('of 32 services')`);
    assert.equal(await evaluate(`document.querySelector('main h1').textContent`), 'Explore Services');
    assert.equal(await evaluate(`document.querySelectorAll('aside select').length`), 0);
    assert.equal(await evaluate(`document.querySelectorAll('[aria-label="Search marketplace services"] input').length`), 1);
    assert.ok(await evaluate(`document.querySelector('[aria-label="Search marketplace services"]').getBoundingClientRect().height <= 54`));
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('[data-marketplace-categories]')).overflowY`), 'visible');
    assert.equal(await evaluate(`[...document.querySelectorAll('[data-marketplace-listing] h3')].every(el => el.textContent.startsWith('Work Visa'))`), true);
    assert.equal(await evaluate(`[...document.querySelectorAll('aside label')].some(el => el.textContent.trim() === 'Work Visa' && el.querySelector('input').checked)`), true);
    await snapshot('desktop-filtered.png');
    // Click a different service from the footer while already on the marketplace.
    await evaluate(`[...document.querySelectorAll('footer a')].find(el => el.textContent.trim() === 'Tourist Visa').click()`);
    await waitFor(`location.search.includes('Tourist') && document.querySelector('[aria-label="Service listings"]').textContent.includes('of 16 services')`);
    assert.equal(await evaluate(`[...document.querySelectorAll('[data-marketplace-listing] h3')].every(el => el.textContent.startsWith('Tourist Visa'))`), true);
    // Refresh keeps the footer-applied selection.
    await send('Page.reload');
    await waitFor(`document.querySelector('[aria-label="Service listings"]')?.textContent.includes('of 16 services')`);
    assert.equal(await evaluate(`[...document.querySelectorAll('aside label')].some(el => el.textContent.trim() === 'Tourist Visa' && el.querySelector('input').checked)`), true);
    await click('[aria-label="Filter services"] button');
    await waitFor(`document.querySelector('[aria-label="Service listings"]').textContent.includes('of 64 services') && location.search === ''`);
    assert.deepEqual(await evaluate(`[...document.querySelectorAll('[aria-label="Service pages"] button[aria-label^="Page "]')].map(el => el.textContent)`), ['1','2','3','8']);
    assert.equal(await evaluate(`document.querySelector('[aria-label="Previous page"]').disabled`), true);
    assert.equal(await evaluate(`document.querySelector('[aria-label="Service pages"]').textContent.includes('…')`), true);
    await click('[aria-label="Next page"]');
    await waitFor(`document.querySelector('[aria-label="Service pages"] [aria-current="page"]')?.textContent === '2'`);
    await click('[aria-label="Page 8"]');
    await waitFor(`document.querySelector('[aria-label="Service pages"] [aria-current="page"]')?.textContent === '8'`);
    assert.equal(await evaluate(`document.querySelector('[aria-label="Next page"]').disabled`), true);
    await evaluate(`history.back()`); await waitFor(`document.querySelector('[aria-label="Service pages"] [aria-current="page"]')?.textContent === '2'`);
    await snapshot('desktop-pagination.png');
    await evaluate(`[...document.querySelectorAll('aside label')].find(el => el.textContent.trim() === 'Work Visa').querySelector('input').click()`);
    await waitFor(`document.querySelector('[aria-label="Service listings"]').textContent.includes('of 32 services') && !new URLSearchParams(location.search).has('page')`);
    await evaluate(`[...document.querySelectorAll('aside label')].find(el => el.textContent.trim() === 'Tourist Visa').querySelector('input').click()`);
    await waitFor(`document.querySelector('[aria-label="Service listings"]').textContent.includes('of 48 services')`);
    // A category selection requests the same API parameter as the home page tabs.
    await click('[aria-label="Filter services"] button');
    await waitFor(`document.querySelector('[aria-label="Service listings"]').textContent.includes('of 64 services')`);
    await evaluate(`[...document.querySelectorAll('[data-marketplace-categories] label')].find(el => el.textContent.trim() === 'Immigration Services').querySelector('input').click()`);
    await waitFor(`document.querySelector('[aria-label="Service listings"]').textContent.includes('of 16 services') && document.querySelector('[aria-label="Service listings"]').getAttribute('aria-busy') === 'false'`);
    assert.equal(await evaluate(`[...document.querySelectorAll('[data-marketplace-listing] h3')].every(el => el.textContent.startsWith('Permanent Residency'))`), true);
    const apiRequests = await (await fetch('http://localhost:4901/immify/_test/requests')).json();
    assert.ok(apiRequests.requests.some(req => req.path === '/service-listings' && req.categoryName === 'Immigration'));
    assert.ok(apiRequests.requests.filter(req => req.path === '/service-categories/immigration-id').length >= 2);
    // Select Work Visa in the single MUI input, which must also update the sidebar.
    await click('[aria-label="Search marketplace services"] [aria-label="Open"]');
    await waitFor(`document.querySelector('[role="listbox"]')`);
    await evaluate(`[...document.querySelectorAll('[role="option"]')].find(el => el.textContent === 'Work Visa').click()`);
    await waitFor(`document.querySelector('[aria-label="Service listings"]').textContent.includes('of 32 services') && document.querySelector('[aria-label="Service listings"]').getAttribute('aria-busy') === 'false'`);
    assert.equal(await evaluate(`[...document.querySelectorAll('aside label')].some(el => el.textContent.trim() === 'Work Visa' && el.querySelector('input').checked)`), true);
    const serviceRequests = await (await fetch('http://localhost:4901/immify/_test/requests')).json();
    assert.ok(serviceRequests.requests.some(req => req.path === '/service-listings' && req.categoryName === 'Visa Services'));
    await snapshot('desktop-mui-search.png');
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 1300, deviceScaleFactor: 1, mobile: true });
    await snapshot('mobile.png');
    const dimensions = await evaluate(`({main:document.querySelector('main').getBoundingClientRect().width,viewport:innerWidth,aside:document.querySelector('[aria-label="Filter services"]').getBoundingClientRect().width,results:document.querySelector('[aria-label="Service listings"]').getBoundingClientRect().width})`);
    assert.ok(dimensions.aside > 0 && dimensions.aside <= dimensions.viewport);
    assert.ok(dimensions.results > 0 && dimensions.results <= dimensions.viewport);
    assert.ok(await evaluate(`document.querySelector('[aria-label="Search marketplace services"]').getBoundingClientRect().height <= 54`));
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: 'http://localhost:3018/premium-services/work-visa' });
    await waitFor(`document.readyState === 'complete' && document.querySelector('main header [aria-label="Breadcrumb"]')?.getBoundingClientRect().height > 10 && document.querySelector('main header')?.getBoundingClientRect().height > 300 && document.querySelector('main h1')?.textContent === 'Work Visa'`);
    await evaluate(`new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(true))))`);
    const breadcrumb = await evaluate(`(() => { const hero = document.querySelector('main header').getBoundingClientRect(); const crumb = document.querySelector('main header [aria-label="Breadcrumb"]').getBoundingClientRect(); return {within:crumb.top >= hero.top && crumb.bottom <= hero.bottom, left:crumb.left < innerWidth / 4}; })()`);
    assert.equal(breadcrumb.within && breadcrumb.left, true);
    await snapshot('premium-breadcrumb.png');
    assert.equal(exceptions.length, 0, 'No uncaught browser exceptions');
    console.log('PASS: footer URLs, reload/back, sidebar and MUI filters, category API requests, compact search, unscrolled categories, pagination, desktop/mobile layout, premium banner breadcrumb.');
    console.log(JSON.stringify(dimensions));
  } finally { await send('Browser.close'); socket.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
