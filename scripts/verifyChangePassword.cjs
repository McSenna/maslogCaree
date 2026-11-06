'use strict';
// Browser checks for the change password dialog: behaviour, every server
// answer, axe, and layout. Fictional fixtures only; every HTTP and WebSocket
// request is intercepted, so no backend runs.
// Run after `EXPO_PUBLIC_API_URL=/api npx expo export --platform web`.
// Env: PLAYWRIGHT_MODULE, CHROMIUM_PATH, DIST (export folder), SHOTS (screenshot folder).
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = process.env.DIST || path.join(root, 'dist');
const shots = process.env.SHOTS || '/tmp/change-password-screenshots';
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js', { paths: [root] }), 'utf8');
fs.mkdirSync(shots, { recursive: true });

const USER = { id: 'TEST-ADMIN', _id: 'TEST-ADMIN', name: 'Test fixture admin', fullname: 'Test fixture admin', email: 'fixture.admin@example.test', role: 'admin', verified: true, status: 'active' };
const OK = { status: 200, json: { success: true, message: 'Password changed successfully.', token: 'rotated.token.value' } };
const ANSWERS = {
  ok: OK,
  wrongCurrent: { status: 400, json: { success: false, code: 'INVALID_CREDENTIALS', message: 'Current password is incorrect.', fieldErrors: { currentPassword: 'Current password is incorrect.' } } },
  policy: { status: 400, json: { success: false, code: 'VALIDATION_ERROR', message: 'Password must contain a number.', fieldErrors: { newPassword: 'Password must contain a number.' } } },
  limited: { status: 429, headers: { 'Retry-After': '600' }, json: { success: false, code: 'RATE_LIMITED', message: 'Too many password change attempts.', retryAfter: 600 } },
  server: { status: 500, json: { success: false, code: 'INTERNAL_SERVER_ERROR', message: 'The server ran into a problem.' } },
  expired: { status: 401, json: { success: false, code: 'TOKEN_EXPIRED', message: 'Your session has expired. Please log in again.' } },
};
const VALID = { current: 'InitialPass1!', next: 'NewSecure456!' };

const results = [];
const check = async (name, fn) => {
  try {
    await fn();
    results.push(['PASS', name]);
  } catch (error) {
    results.push(['FAIL', name, error.message.split('\n')[0]]);
  }
};

const startContext = async (browser, { width, height, theme = 'light', reducedMotion = 'no-preference' }) => {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion });
  await context.routeWebSocket('**/*', (socket) => socket.close());
  await context.addInitScript(({ user, theme }) => {
    const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600, platform: 'web', role: user.role }));
    localStorage.setItem('maslogcare_current_user', JSON.stringify({ ...user, token: `test.${payload}.test` }));
    localStorage.setItem('maslogcare_ui_theme', theme);
  }, { user: USER, theme });
  const state = { answers: [], requests: [], delayMs: 0 };
  await context.route('**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname.endsWith('/api/change-password')) {
      state.requests.push(JSON.parse(request.postData() || '{}'));
      if (state.delayMs) await new Promise((resolve) => setTimeout(resolve, state.delayMs));
      const answer = state.answers.shift() || OK;
      if (answer === 'network') return route.abort('connectionreset');
      return route.fulfill({ status: answer.status, headers: answer.headers, contentType: 'application/json', body: JSON.stringify(answer.json) });
    }
    if (url.pathname.endsWith('/api/profile')) return route.fulfill({ json: { success: true, user: USER } });
    if (url.pathname.startsWith('/api/')) return route.fulfill({ json: { success: true, data: [], items: [], notifications: [], count: 0, unreadCount: 0, pagination: { total: 0 } } });
    const file = request.resourceType() === 'document' ? path.join(dist, 'admin/profile.html') : path.join(dist, url.pathname);
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      const type = file.endsWith('.js') ? 'application/javascript' : file.endsWith('.html') ? 'text/html' : file.endsWith('.css') ? 'text/css' : undefined;
      return route.fulfill({ contentType: type, body: fs.readFileSync(file) });
    }
    return route.fulfill({ status: 404, body: '' });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://127.0.0.1/admin/profile');
  // Phones show the profile as accordions; Change password lives under Account settings.
  if (width < 768) {
    const account = page.locator('[aria-expanded]').filter({ hasText: 'Account settings' }).first();
    await account.waitFor({ timeout: 30000 });
    if ((await account.getAttribute('aria-expanded')) !== 'true') await account.click();
  }
  return { context, page, state, errors };
};

const dialogOf = (page) => page.locator('[role=dialog][aria-labelledby]');
const field = (page, autocomplete, index = 0) => dialogOf(page).locator(`input[autocomplete="${autocomplete}"]`).nth(index);
const inputs = (page) => ({ current: field(page, 'current-password'), next: field(page, 'new-password', 0), confirm: field(page, 'new-password', 1) });
const submitButton = (page) => dialogOf(page).getByRole('button', { name: 'Change password', exact: true });
const opener = (page) => page.getByRole('button', { name: /^Change password/ }).first();

const open = async (page) => {
  await opener(page).click();
  await dialogOf(page).waitFor();
};
const fillValid = async (page) => {
  const f = inputs(page);
  await f.current.fill(VALID.current);
  await f.next.fill(VALID.next);
  await f.confirm.fill(VALID.next);
};
const activeAutocomplete = (page) => page.evaluate(() => document.activeElement?.getAttribute('autocomplete'));
const errorTextFor = (input) =>
  input.evaluate((el) => (el.getAttribute('aria-describedby') || '').split(' ').map((id) => document.getElementById(id)?.textContent || '').join(' '));
const runAxe = async (page, selector) => {
  await page.locator(selector).waitFor();
  await page.addScriptTag({ content: axeSource });
  return page.evaluate(async (selector) => {
    const result = await window.axe.run(document.querySelector(selector), { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] });
    return result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
  }, selector);
};
const closeAndReopen = async (page) => {
  if (!(await dialogOf(page).isVisible())) return open(page);
  await dialogOf(page).getByRole('button', { name: 'Close' }).click();
  const prompt = page.getByRole('button', { name: 'Discard', exact: true });
  if (await prompt.isVisible().catch(() => false)) await prompt.click();
  await dialogOf(page).waitFor({ state: 'detached' });
  await open(page);
};

module.exports = { startContext, dialogOf, inputs, submitButton, opener, open, fillValid, activeAutocomplete, errorTextFor, runAxe, closeAndReopen, check, results, ANSWERS, VALID, shots, assert };

if (require.main === module) {
  (async () => {
    const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
    try {
      await require('./verifyChangePasswordDesktop.cjs')(browser);
      await require('./verifyChangePasswordLayout.cjs')(browser);
    } finally {
      await browser.close();
    }
    for (const [status, name, detail] of results) console.log(`${status}  ${name}${detail ? `: ${detail}` : ''}`);
    const failed = results.filter(([status]) => status === 'FAIL').length;
    console.log(`\n${results.length - failed} passed, ${failed} failed. Screenshots in ${shots}`);
    process.exit(failed ? 1 : 0);
  })();
}
