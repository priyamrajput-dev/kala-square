// Built-in global WebSocket in Node 22

async function testLogin() {
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

  const consoleLogs = [];
  const pageErrors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      consoleLogs.push({
        type: msg.params.type,
        args: msg.params.args?.map(a => a.value || a.description)
      });
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      pageErrors.push(msg.params.exceptionDetails);
    }
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');

  console.log('Navigating to http://localhost:3000/admin/login...');
  await send('Page.navigate', { url: 'http://localhost:3000/admin/login' });
  await new Promise(r => setTimeout(r, 2000));

  console.log('Clicking .g-submit button...');
  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('.g-submit');
        if (btn) {
          btn.click();
          return 'clicked .g-submit';
        }
        return 'no .g-submit';
      })()
    `,
    returnByValue: true
  });
  console.log('Eval result:', evalRes.result?.value);

  // Wait 4 seconds to observe navigation and errors
  await new Promise(r => setTimeout(r, 4000));

  const currentUrl = await send('Runtime.evaluate', {
    expression: 'window.location.href',
    returnByValue: true
  });
  console.log('Current URL after login:', currentUrl.result?.value);

  const bodyText = await send('Runtime.evaluate', {
    expression: 'document.body.innerText.slice(0, 500)',
    returnByValue: true
  });
  console.log('Body text:', bodyText.result?.value);

  console.log('\n--- Console Logs ---');
  for (const log of consoleLogs) {
    console.log(`[${log.type}]`, JSON.stringify(log.args));
  }

  console.log('\n--- Page Errors ---');
  for (const err of pageErrors) {
    console.log('Error:', err.text, err.exception?.description);
  }

  await fetch(`http://localhost:9222/json/close/${target.id}`);
  process.exit(0);
}

testLogin().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
