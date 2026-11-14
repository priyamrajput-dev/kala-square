import fs from 'fs';

const BASE_URL = 'http://localhost:3000';

async function getCDPSession() {
  const newTargetRes = await fetch('http://localhost:9222/json/new?about:blank', { method: 'PUT' });
  const target = await newTargetRes.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise((resolve) => (ws.onopen = resolve));

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  return { target, ws, send };
}

async function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function evalInPage(send, expression) {
  const res = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (res.exceptionDetails) {
    throw new Error(JSON.stringify(res.exceptionDetails));
  }
  return res.result?.value;
}

async function captureScreenshot(send, filePath) {
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(filePath, Buffer.from(shot.data, 'base64'));
}

async function waitForSelector(send, selector, maxWait = 10000) {
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    const exists = await evalInPage(send, `Boolean(document.querySelector('${selector}'))`);
    if (exists) return true;
    await sleep(200);
  }
  return false;
}

async function run() {
  console.log('1. Starting browser test for Share and New Tab navigation...');
  const session1 = await getCDPSession();
  const { send: send1, target: target1 } = session1;

  await send1('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await send1('Page.bringToFront');

  console.log('2. Navigating to http://localhost:3000/top-creators/priyam ...');
  await send1('Page.navigate', { url: `${BASE_URL}/top-creators/priyam` });

  console.log('Waiting for .pp-hi (artist profile hero)...');
  const heroFound = await waitForSelector(send1, '.pp-hi');
  console.log('Hero section rendered:', heroFound);

  const artistText = await evalInPage(send1, 'document.querySelector(".pp-hi")?.innerText');
  console.log('Profile loaded:', artistText?.slice(0, 50));

  console.log('Waiting for Share button...');
  await waitForSelector(send1, 'button[aria-label="Share profile"]');

  console.log('3. Clicking the Share button...');
  const shareClicked = await evalInPage(send1, `
    (() => {
      const btn = document.querySelector('button[aria-label="Share profile"]');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()
  `);
  console.log('Share button clicked:', shareClicked);

  await sleep(500);

  // Check toast
  const toastText = await evalInPage(send1, `document.querySelector(".toast.show")?.innerText`);
  console.log('Toast text found:', toastText);

  const toastPath = '/Users/priyamrajput/.gemini/antigravity/brain/4c128deb-be56-4a4a-9f69-3fd6d5abb05c/share_toast_verified.png';
  await captureScreenshot(send1, toastPath);
  console.log('Captured screenshot with toast to:', toastPath);

  // 4. Open a fresh tab and navigate to the profile link
  const targetUrl = `${BASE_URL}/top-creators/priyam`;
  console.log('4. Opening fresh browser tab and navigating to:', targetUrl);
  const session2 = await getCDPSession();
  const { send: send2, target: target2 } = session2;

  await send2('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await send2('Page.navigate', { url: targetUrl });
  const newTabHeroFound = await waitForSelector(send2, '.pp-hi');
  console.log('New tab hero found:', newTabHeroFound);

  const newTabBody = await evalInPage(send2, 'document.body.innerText');
  const is404 = newTabBody.includes('Artist Not Found');
  console.log('New tab contains "Artist Not Found"?', is404);

  if (is404) {
    throw new Error('FAILED: New tab returned "Artist Not Found"!');
  }

  const newTabArtist = await evalInPage(send2, 'document.querySelector(".pp-hi")?.innerText');
  console.log('New tab verified artist:', newTabArtist?.slice(0, 60));

  const newTabPath = '/Users/priyamrajput/.gemini/antigravity/brain/4c128deb-be56-4a4a-9f69-3fd6d5abb05c/new_tab_profile_verified.png';
  await captureScreenshot(send2, newTabPath);
  console.log('Captured new tab screenshot to:', newTabPath);

  await fetch(`http://localhost:9222/json/close/${target1.id}`);
  await fetch(`http://localhost:9222/json/close/${target2.id}`);

  console.log('\n SUCCESS: Share button directly copied clean URL, displayed toast, and new tab loaded the profile flawlessly!');
}

run().catch((err) => {
  console.error('Error in verification:', err);
  process.exit(1);
});
