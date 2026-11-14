import fs from 'fs';

const BASE_URL = 'http://localhost:3000';
const VIEWPORTS = [
  { name: '320px', width: 320, height: 600 },
  { name: '375px', width: 375, height: 667 },
  { name: '390px', width: 390, height: 844 },
  { name: '430px', width: 430, height: 932 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1024px', width: 1024, height: 768 },
  { name: '1280px', width: 1280, height: 800 },
  { name: '1440px', width: 1440, height: 900 },
  { name: '1920px', width: 1920, height: 1080 },
];

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

async function checkOverflow(send, width) {
  return await evalInPage(send, `
    (() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const hasOverflow = docW > winW;
      const overflowingElements = [];

      if (hasOverflow) {
        const all = document.querySelectorAll('*');
        for (const el of all) {
          const rect = el.getBoundingClientRect();
          if (rect.right > winW + 1) {
            overflowingElements.push({
              tag: el.tagName,
              id: el.id,
              class: el.className ? (typeof el.className === 'string' ? el.className.slice(0, 50) : '') : '',
              right: Math.round(rect.right),
              width: Math.round(rect.width)
            });
          }
        }
      }

      return {
        hasOverflow,
        docW,
        winW,
        overflowCount: overflowingElements.length,
        samples: overflowingElements.slice(0, 5)
      };
    })()
  `);
}

async function auditPage(url, pageName) {
  console.log(`\n==============================================`);
  console.log(`  AUDITING: ${pageName} (${url})`);
  console.log(`==============================================`);

  const { target, ws, send } = await getCDPSession();

  for (const vp of VIEWPORTS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 1024,
    });

    await send('Page.navigate', { url });
    await sleep(2000);

    const overflowInfo = await checkOverflow(send, vp.width);
    const status = overflowInfo.hasOverflow ? 'OVERFLOW_FAIL' : 'PASS';
    console.log(`[${vp.name.padEnd(6)}] ${status} - scrollW: ${overflowInfo.docW}px vs winW: ${overflowInfo.winW}px`);

    if (overflowInfo.hasOverflow) {
      console.log(`       Overflow elements (${overflowInfo.overflowCount}):`, JSON.stringify(overflowInfo.samples));
    }

    const shotDir = '/Users/priyamrajput/.gemini/antigravity/brain/4c128deb-be56-4a4a-9f69-3fd6d5abb05c/screenshots_audit';
    if (!fs.existsSync(shotDir)) fs.mkdirSync(shotDir, { recursive: true });
    await captureScreenshot(send, `${shotDir}/${pageName}_${vp.name}.png`);
  }

  await fetch(`http://localhost:9222/json/close/${target.id}`);
}

async function main() {
  await auditPage(`${BASE_URL}/admin/artists`, 'admin_artists');
  await auditPage(`${BASE_URL}/admin/artists/new`, 'admin_artists_new');
  await auditPage(`${BASE_URL}/admin/login`, 'admin_login');
}

main().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});

