'use strict';
// Isolated web layout/navigation regression checks with fictional records.
// Export first: npx expo export -p web --output-dir /tmp/maslogcare-users-web
// WEB_EXPORT_DIR=/tmp/maslogcare-users-web PLAYWRIGHT_MODULE=/path/to/playwright node scripts/verifyUsersLayout.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const build = path.resolve(process.env.WEB_EXPORT_DIR || path.join(__dirname, '../dist'));
const output = process.env.LAYOUT_OUTPUT_DIR || '/tmp/maslogcare-users-layout';
const summary = { total: 25, active: 25, staff: 0, residents: 25, requests: 0, rejected: 0, deactivated: 0,
  approved: 25, activePercent: 100, masterlist: 1408 };
const resident = { _id: 'TEST-RECORD', masterResidentId: 'TEST-1', firstName: 'Test', middleName: 'Sample',
  lastName: 'Resident', suffix: '', dateOfBirth: '1990-01-01', sex: 'male', civilStatus: 'single',
  address: 'Purok 2', barangay: 'Maslog', role: 'resident', isActive: true, linkedAccount: false };
const users = Array.from({ length: 25 }, (_, index) => ({
  id: `TEST-USER-${index + 1}`, fullname: `Test Account ${index + 1}`, email: 'fixture@example.invalid',
  role: 'resident', status: 'active', statusGroup: 'active', location: 'Purok 2', avatarUrl: null,
  lastLogin: null, createdAt: '2026-01-01T00:00:00Z', updatedAt: null, verificationId: null,
  portalAccess: { web: false, mobile: true, override: null, globalEnabled: false, eligible: true,
    revision: 1, state: 'global_blocked' },
}));
const cards = page => page.getByRole('button').filter({ has: page.getByText(/^(Total accounts|Active accounts|Rejected|Deactivated)$/) });
const bounds = async locator => locator.evaluate(element => {
  const box = element.getBoundingClientRect();
  return { top: box.top, bottom: box.bottom, left: box.left, right: box.right, width: box.width, height: box.height };
});
async function checkCards(page, width) {
  const metrics = cards(page);
  assert.equal(await metrics.count(), 4);
  const rectangles = [];
  for (const card of await metrics.all()) {
    const result = await card.evaluate(element => {
      const box = element.getBoundingClientRect();
      const overflow = [...element.querySelectorAll('div, span')].some(child => {
        const childBox = child.getBoundingClientRect();
        return childBox.width > 0 && childBox.height > 0 &&
          (childBox.bottom > box.bottom + 1 || childBox.right > box.right + 1 || childBox.left < box.left - 1);
      });
      return { top: box.top, bottom: box.bottom, left: box.left, right: box.right, height: box.height, overflow };
    });
    assert.ok(result.height > 70, 'card reserves space for its label, count and note');
    assert.equal(result.overflow, false, 'card contains its text, number, icon and note');
    assert.ok(result.left >= 0 && result.right <= width + 1, 'card fits the viewport');
    rectangles.push(result);
  }
  const first = await bounds(metrics.first());
  const columns = await metrics.first().evaluate(element => element.parentElement.parentElement.children.length);
  const rowWidth = await metrics.first().evaluate(element => element.parentElement.parentElement.getBoundingClientRect().width);
  assert.equal(columns, rowWidth >= 1280 ? 4 : 2, 'columns use available content width');
  const tabs = await bounds(page.getByRole('tab', { name: /^User accounts$/ }));
  assert.ok(tabs.top >= Math.max(...rectangles.map(rectangle => rectangle.bottom)), 'tabs follow the cards');
  assert.ok(first.height > 0);
}
async function checkPanelSeam(page, name) {
  const gap = await page.getByText(name, { exact: true }).evaluate(element => {
    let side = element;
    while (side && !(getComputedStyle(side).borderLeftWidth === '1px' && getComputedStyle(side).borderRightWidth === '1px')) side = side.parentElement;
    const top = [...document.querySelectorAll('div')].find(candidate => {
      const style = getComputedStyle(candidate);
      return style.borderTopLeftRadius === '16px' && style.borderTopWidth === '1px' &&
        style.borderRightWidth === '1px' && candidate.getBoundingClientRect().height > 0 && !candidate.innerText.trim();
    });
    if (!top || !side) throw new Error('The list panel pieces were not found');
    return side.getBoundingClientRect().top - top.getBoundingClientRect().bottom;
  });
  assert.ok(Math.abs(gap) <= 1, `panel top must touch its first row (gap=${gap}px)`);
}
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  try {
    for (const theme of ['light', 'dark']) for (const width of [320, 393, 768, 1024, 1440, 1920]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: true });
      let page;
      const errors = [];
      try {
        await context.routeWebSocket('**/*', socket => socket.close());
        await context.addInitScript(theme => {
          const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600, platform: 'web', role: 'admin' }));
          localStorage.setItem('maslogcare_current_user', JSON.stringify({ id: 'TEST-ADMIN', name: 'Test admin', role: 'admin',
            token: `test.${payload}.test`, verified: true }));
          localStorage.setItem('maslogcare_ui_theme', theme);
        }, theme);
        page = await context.newPage();
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
        await context.route('**/*', async route => {
          const request = route.request(), url = new URL(request.url());
          let json;
          if (url.pathname.endsWith('/users/summary')) json = { summary };
          else if (url.pathname.endsWith('/profile')) json = { user: { _id: 'TEST-ADMIN', permissions: { manageResidentWebAccess: true } } };
          else if (url.pathname.endsWith('/admin/resident-web-access')) json = { policy: { initialized: true, enabled: false, revision: 1 } };
          else if (url.pathname.endsWith('/admin/master-residents')) json = { records: [resident], counts: { total: 1, active: 1, inactive: 0 }, pagination: { total: 1 } };
          else if (url.pathname.endsWith('/users') && request.resourceType() !== 'document') {
            const pageNumber = Number(url.searchParams.get('page') || 1);
            json = { users: users.slice((pageNumber - 1) * 20, pageNumber * 20), pagination: { total: users.length } };
          } else if (url.hostname === '127.0.0.1') {
            const file = request.resourceType() === 'document' ? path.join(build, 'admin/users.html') : path.join(build, url.pathname);
            if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
            return route.fulfill({ contentType: file.endsWith('.js') ? 'application/javascript' : file.endsWith('.html') ? 'text/html' : undefined, body: fs.readFileSync(file) });
          } else json = { success: true, notifications: [], unreadCount: 0, data: [] };
          return route.fulfill({ json });
        });
        page.setDefaultTimeout(15000);
        await page.goto('http://127.0.0.1:8092/admin/users?section=masterlist', { waitUntil: 'domcontentloaded' });
        await page.getByText('Resident, Test Sample', { exact: true }).waitFor();
        const headerBells = await page.getByRole('button', { name: /^Open notifications/ })
          .evaluateAll(elements => elements.filter(element => element.getClientRects().length > 0).length);
        assert.equal(headerBells, width < 768 ? 0 : 1, 'only the desktop header shows a notification bell');
        if (width < 768) {
          assert.equal(await page.locator('a[href="/admin/notifications"]').isVisible(), true,
            'mobile notifications are available in the bottom navigation');
        }
        await checkCards(page, width);
        const phoneList = width < 1440;
        if (phoneList) await checkPanelSeam(page, 'Resident, Test Sample');
        await page.screenshot({ path: path.join(output, `${theme}-${width}-masterlist.png`) });
        for (let iteration = 0; iteration < 2; iteration++) {
          await page.getByRole('tab', { name: 'User accounts', exact: true }).click();
          await page.getByText('Test Account 1', { exact: true }).waitFor();
          await checkCards(page, width);
          if (phoneList) await checkPanelSeam(page, 'Test Account 1');
          await page.getByRole('tab', { name: /^Resident masterlist/ }).click();
          await page.getByText('Resident, Test Sample', { exact: true }).waitFor();
          await checkCards(page, width);
        }
        await page.getByRole('tab', { name: 'User accounts', exact: true }).click();
        await page.getByText('Test Account 1', { exact: true }).waitFor();
        if (phoneList) {
          // FlatList can unmount distant rows. Scroll its viewport instead of
          // aiming at an offscreen row that may not exist in the DOM yet.
          const scroller = await page.getByText('Test Account 1', { exact: true }).evaluateHandle(element => {
            for (let parent = element.parentElement; parent; parent = parent.parentElement) {
              if (/auto|scroll/.test(getComputedStyle(parent).overflowY) && parent.clientHeight > 0 && parent.scrollHeight > parent.clientHeight) return parent;
            }
            throw new Error('The accounts scroll viewport was not found');
          });
          // Keep scrolling as virtual row measurements settle or a tab's
          // scroll restoration runs; the footer proves both pages are loaded.
          await page.waitForFunction(element => {
            element.scrollTop = element.scrollHeight;
            return document.body.innerText.includes('25 of 25 accounts');
          }, scroller, { polling: 100 });
          await scroller.evaluate(element => element.scrollTo(0, 0));
          await page.getByText('Test Account 1', { exact: true }).waitFor();
          await scroller.evaluate(element => element.scrollTo(0, element.scrollHeight));
          await page.getByText('Test Account 25', { exact: true }).waitFor();
          await scroller.dispose();
        }
        if (width < 768) {
          await page.locator('a[href="/admin/notifications"]').click();
          await page.waitForURL('**/admin/notifications');
        }
        assert.deepEqual(errors, [], 'no runtime errors');
        console.log(`PASS ${theme}, ${width}px: card containment, tabs, panel seam, ${phoneList ? 'infinite scroll' : 'table layout'}`);
      } catch (error) {
        console.error({ width, theme, errors, body: (await page?.locator("body").innerText())?.slice(0, 1800) });
        await page?.screenshot({ path: path.join(output, "failure.png") });
        throw error;
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
