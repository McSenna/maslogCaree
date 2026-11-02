'use strict';
// Fictional fixtures and intercepted HTTP only. Backend integration is tested separately.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = '/tmp/master-list-actions';
fs.mkdirSync(output, { recursive: true });
const record = (id, firstName) => ({
  _id: id, masterResidentId: `TEST-${id}`, firstName, middleName: 'Sample', lastName: 'Fixture', suffix: '',
  dateOfBirth: '1990-01-01', sex: 'female', civilStatus: 'single', barangay: 'Maslog',
  address: 'Purok 3, Test Street', role: 'resident', isActive: true, linkedAccount: false,
});
const targetName = 'Second Sample Fixture';
(async () => {
 const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
 try {
  for (const theme of ['light', 'dark']) {
   const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, hasTouch: true });
   await context.routeWebSocket('**/*', socket => socket.close());
   await context.addInitScript(theme => {
    const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now()/1000)+3600, platform: 'web', role: 'admin' }));
    localStorage.setItem('maslogcare_current_user', JSON.stringify({ id: 'TEST-ADMIN', name: 'Test admin', role: 'admin', token: `test.${payload}.test`, verified: true }));
    localStorage.setItem('maslogcare_ui_theme', theme);
   }, theme);
   let records = [record('1', 'First'), record('2', 'Second')];
   let deleteCount = 0, failure = true, pendingRelease, editedRequest;
   let pageQueries = [];
   let lastPage = false;
   const page = await context.newPage();
   const errors = [];
   page.on('pageerror', error => errors.push(error.message));
   await context.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.pathname.includes('/admin/master-residents')) {
     if (request.method() === 'PATCH') {
      editedRequest = {id:url.pathname.split('/').pop(), body:request.postDataJSON()};
      records = records.map(row => row._id === editedRequest.id ? {...row, ...editedRequest.body} : row);
      return route.fulfill({json:{record:records.find(row => row._id === editedRequest.id)}});
     }
     if (request.method() === 'DELETE') {
      deleteCount++;
      await new Promise(resolve => { pendingRelease = resolve; });
      if (failure) return route.fulfill({ status: 409, json: { message: 'This record is protected. Review its dependencies before retrying.', code: 'CONFLICT' } });
      records = records.filter(row => !url.pathname.endsWith(`/${row._id}`));
      return route.fulfill({ json: { success: true } });
     }
     pageQueries.push(Object.fromEntries(url.searchParams));
     const total = lastPage ? (records.length === 2 ? 21 : 20) : records.length;
     const shown = lastPage ? (url.searchParams.get('page') === '2' ? records.filter(row => row._id === '2') : records.filter(row => row._id === '1')) : records;
     return route.fulfill({ json: { records: shown, pagination: { total }, counts: { active: records.length, inactive: 0, total: records.length } } });
    }
    if (url.pathname.endsWith('/users/summary')) return route.fulfill({ json: { summary: { total: 0, active: 0, approved: 0, staff: 0, residents: 0, deactivated: 0, addedThisMonth: 0, masterlist: records.length, pendingRequests: 0, rejectedRequests: 0 } } });
    if (url.hostname === '127.0.0.1') {
     const file = request.resourceType() === 'document' ? path.join(root, 'dist/admin/users.html') : path.join(root, 'dist', url.pathname);
     if (fs.existsSync(file)) return route.fulfill({ contentType: file.endsWith('.js') ? 'application/javascript' : file.endsWith('.html') ? 'text/html' : undefined, body: fs.readFileSync(file) });
     return route.fulfill({ status: 404, body: '' });
    }
    return route.fulfill({ json: { success: true, notifications: [], unreadCount: 0, data: [], records: [], users: [], pagination: { total: 0 } } });
   });
   await page.goto('http://127.0.0.1:8092/admin/users?section=masterlist');
   const edit = () => page.getByRole('button', { name: `Edit ${targetName}`, exact: true });
   const remove = () => page.getByRole('button', { name: `Delete ${targetName}`, exact: true });
   await edit().waitFor();
   assert.equal(await remove().count(), 1, 'Delete exists beside Edit');
   await edit().evaluate(element => {
    window.actionBubbles = 0;
    document.addEventListener('click', () => window.actionBubbles++);
   });
   await edit().click();
   assert.equal(await page.evaluate(() => window.actionBubbles), 0, 'action does not bubble to the row');
   await page.locator('input[value="Second"]').waitFor();
   assert.equal(await page.locator('input[value="Second"]').count(), 1, 'edit preloads selected record');
   assert.equal(await page.locator('input[value="First"]').count(), 0);
   await page.locator('input[value="Second"]').fill('Edited');
   await page.getByRole('button', {name:'Save Resident',exact:true}).click();
   await page.getByRole('button', {name:'Edit Edited Sample Fixture',exact:true}).waitFor();
   assert.equal(editedRequest.id, '2', 'edit submits the selected record ID');
   assert.equal(editedRequest.body.firstName, 'Edited');
   assert.equal(records[0].firstName, 'First', 'edit leaves the other record unchanged');
   records = [record('1', 'First'), record('2', 'Second')];
   await page.reload();
   await remove().waitFor();
   await remove().click();
   const dialog = () => page.getByRole('dialog', { name: 'Delete this record?', exact: true });
   await dialog().waitFor();
   await page.waitForFunction(() => document.activeElement?.textContent === 'Cancel');
   assert.ok((await dialog().innerText()).includes(targetName));
   await dialog().getByRole('button', { name: 'Cancel', exact: true }).click();
   assert.equal(deleteCount, 0, 'cancel sends no delete request');
   assert.equal(await remove().evaluate(element => element === document.activeElement), true, 'cancel restores action focus');
   await remove().click();
   await dialog().getByRole('button', { name: 'Delete', exact: true }).click();
   await page.waitForFunction(() => !!document.querySelector('[aria-busy="true"]'));
   assert.equal(await dialog().getByRole('button', { name: 'Delete', exact: true }).isDisabled(), true);
   await page.keyboard.press('Enter');
   await page.keyboard.press('Escape');
   assert.equal(await dialog().count(), 1, 'busy dialog cannot close');
   assert.equal(deleteCount, 1, 'repeated submission is blocked');
   pendingRelease();
   await dialog().getByText(/This record is protected/).waitFor();
   assert.equal(await remove().count(), 1, 'failure keeps the row');
   failure = false;
   await dialog().getByRole('button', { name: 'Delete', exact: true }).click();
   await page.waitForFunction(() => !!document.querySelector('[aria-busy="true"]'));
   pendingRelease();
   await dialog().waitFor({ state: 'detached' });
   await remove().waitFor({ state: 'detached' });
   assert.equal(deleteCount, 2, 'retry sends one real API operation');
   assert.equal(await page.getByRole('button', { name: 'Edit First Sample Fixture', exact: true }).count(), 1, 'other record remains');
   assert.ok(pageQueries.length >= 2, 'success refetches the backend');
   // Restore fixtures for responsive render checks.
   records = [record('1', 'First with an intentionally very long name for responsive layout checking'), record('2', 'Second')];
   await page.reload();
   await edit().waitFor();
   await page.addScriptTag({ path: path.join(root, 'node_modules/axe-core/axe.min.js') });
   for (const width of [320, 375, 414, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.reload();
    await remove().waitFor();
    await page.waitForFunction(name => {
     document.querySelector(`[aria-label="Delete ${name}"]`)?.scrollIntoView({block:"center"});
     const a = document.querySelector(`[aria-label="Edit ${name}"]`)?.getBoundingClientRect();
     const b = document.querySelector(`[aria-label="Delete ${name}"]`)?.getBoundingClientRect();
     return a && b && a.width >= 44 && a.height >= 44 && b.width >= 44 && b.height >= 44 && b.x >= a.right && Math.abs(a.y-b.y) < 1 && b.right <= innerWidth;
    }, targetName);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `no overflow ${width}`);
    assert.equal(await edit().getByText('Edit', { exact: true }).count(), 0, 'Edit has no visible label');
    assert.equal(await remove().getByText('Delete', { exact: true }).count(), 0, 'Delete has no visible label');
    assert.equal(await page.locator(`[title="Delete ${targetName}"]`).count(), 1, 'Delete tooltip names record');
    await edit().focus();
    assert.ok(await edit().evaluate(element => parseInt(getComputedStyle(element).outlineWidth) >= 2), 'visible keyboard focus');
    await page.screenshot({ path: `${output}/${theme}-${width}.png`, fullPage: true });
    await remove().focus();
    await page.keyboard.press('Enter');
    await dialog().waitFor();
    await page.waitForFunction(() => {
      const sheet = document.querySelector('[role="group"][aria-label="Delete this record?"]');
      if (!sheet) return true; // Desktop modal is centered without sheet translation.
      const box = sheet.getBoundingClientRect();
      return box.top >= 0 && box.bottom <= innerHeight + 1 && box.height > 0;
    });
    await page.waitForFunction(() => document.activeElement?.textContent === 'Cancel');
    await page.keyboard.press('Tab');
    assert.equal(await dialog().getByRole('button', {name:'Delete', exact:true}).evaluate(element => element === document.activeElement), true, 'Tab reaches Delete');
    const cancelBox = await dialog().getByRole('button', {name:'Cancel', exact:true}).boundingBox();
    const deleteBox = await dialog().getByRole('button', {name:'Delete', exact:true}).boundingBox();
    assert.ok(cancelBox.width >= 44 && deleteBox.width >= 44 && deleteBox.x >= cancelBox.x + cancelBox.width, 'dialog buttons do not overlap');
    if (width === 375 || width === 1440) {
      await page.addScriptTag({ path: path.join(root, 'node_modules/axe-core/axe.min.js') });
      const issues = await page.evaluate(async () => (await axe.run('[role="dialog"]')).violations.map(v => `${v.id}: ${v.help}: ${JSON.stringify(v.nodes.map(n=>({html:n.html,target:n.target,summary:n.failureSummary})))}`));
      assert.deepEqual(issues, [], 'dialog accessibility');
    }
    await page.screenshot({ path: `${output}/${theme}-${width}-dialog.png`, fullPage: true });
    if (width === 375 || width === 1440) {
      // Browser text scaling exercises the dialog layout; physical OS scaling is separate.
      await dialog().evaluate(element => {
        for (const text of element.querySelectorAll('div,span')) {
          if (text.childElementCount || !text.textContent.trim() || text.closest('[aria-hidden="true"]')) continue;
          const look = getComputedStyle(text);
          text.style.fontSize = `${parseFloat(look.fontSize) * 1.3}px`;
          if (look.lineHeight !== 'normal') text.style.lineHeight = `${parseFloat(look.lineHeight) * 1.3}px`;
        }
      });
      assert.ok(await dialog().evaluate(element => element.scrollWidth <= element.clientWidth), 'enlarged dialog text fits');
      await page.screenshot({path:`${output}/${theme}-${width}-dialog-text130.png`,fullPage:true});
    }
    if (width === 375) {
      failure = true;
      await dialog().getByRole('button', {name:'Delete',exact:true}).click();
      await page.waitForFunction(() => !!document.querySelector('[aria-busy="true"]'));
      await page.keyboard.press('Escape');
      assert.equal(await dialog().isVisible(), true, 'phone dialog stays open while busy');
      pendingRelease();
      await dialog().getByText(/This record is protected/).waitFor();
      failure = false;
    }
    await page.keyboard.press('Escape');
    await dialog().waitFor({state:'detached'});
   }
   await page.addScriptTag({ path: path.join(root, 'node_modules/axe-core/axe.min.js') });
   const violations = await page.evaluate(async () => (await axe.run('[aria-label="Resident record actions"]')).violations.map(v => `${v.id}: ${v.help}: ${JSON.stringify(v.nodes.map(n=>({html:n.html,target:n.target,summary:n.failureSummary})))}`));
   assert.deepEqual(violations, [], 'action accessibility');
   assert.deepEqual(errors, [], 'no uncaught browser errors');
   // Deleting the last row on page 2 must retain the query and move to page 1.
   lastPage = true;
   records = [record('1', 'First'), record('2', 'Second')];
   await page.setViewportSize({width:1440, height:1000});
   await page.evaluate(() => sessionStorage.setItem('maslogcare_list_search:master-list', 'Fixture'));
   await page.goto('http://127.0.0.1:8092/admin/users?section=masterlist&mpage=2&mrole=resident&mcivil=single');
   await remove().waitFor();
   const queryStart = pageQueries.length;
   await remove().click();
   await dialog().getByRole('button', {name:'Delete',exact:true}).click();
   await page.waitForFunction(() => !!document.querySelector('[aria-busy="true"]'));
   pendingRelease();
   await page.getByRole('button', {name:'Edit First Sample Fixture',exact:true}).waitFor();
   const finalUrl = new URL(page.url());
   assert.ok(!finalUrl.searchParams.get('mpage') || finalUrl.searchParams.get('mpage') === '1', 'last page clamps');
   assert.equal(finalUrl.searchParams.get('mrole'), 'resident');
   assert.equal(finalUrl.searchParams.get('mcivil'), 'single');
   const reloaded = pageQueries.slice(queryStart);
   assert.ok(reloaded.some(query => query.page === '1'));
   assert.ok(reloaded.every(query => query.search === 'Fixture' && query.role === 'resident' && query.civilStatus === 'single'), 'search and filters survive');
   await context.close();
  }
  console.log('PASS: selected edit, cancel, failure/retry, duplicate protection, success/refetch, light/dark responsive touch targets and action accessibility');
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
