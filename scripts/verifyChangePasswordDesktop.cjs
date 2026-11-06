'use strict';
// Behaviour and server answers on desktop web. Loaded by verifyChangePassword.cjs.
const h = require('./verifyChangePassword.cjs');
const { assert, check, ANSWERS, VALID } = h;

module.exports = async (browser) => {
  const { page, state, errors } = await h.startContext(browser, { width: 1440, height: 900 });
  const dialog = h.dialogOf(page);
  const f = h.inputs(page);
  await h.opener(page).waitFor({ timeout: 30000 });

  await check('opens as one labelled, described, modal dialog with focus in Current password', async () => {
    await h.open(page);
    const labels = await dialog.evaluate((el) => ({
      modal: el.getAttribute('aria-modal'),
      title: document.getElementById(el.getAttribute('aria-labelledby'))?.textContent,
      subtitle: document.getElementById(el.getAttribute('aria-describedby'))?.textContent,
    }));
    assert.deepEqual(labels, { modal: 'true', title: 'Change password', subtitle: 'Keep your account secure.' });
    assert.equal(await h.activeAutocomplete(page), 'current-password');
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
  });

  await check('axe finds no violations in the open dialog (light)', async () => {
    assert.deepEqual(await h.runAxe(page, '[role=dialog][aria-labelledby]'), []);
  });

  await check('autofill hints, real labels and starting masked', async () => {
    const meta = await dialog.locator('input').evaluateAll((els) =>
      els.map((el) => ({ type: el.type, auto: el.autocomplete, label: document.querySelector(`label[for="${el.id}"]`)?.textContent }))
    );
    assert.deepEqual(meta, [
      { type: 'password', auto: 'current-password', label: 'Current password' },
      { type: 'password', auto: 'new-password', label: 'New password' },
      { type: 'password', auto: 'new-password', label: 'Confirm new password' },
    ]);
  });

  await check('Tab stays inside the dialog', async () => {
    for (let i = 0; i < 14; i += 1) {
      await page.keyboard.press('Tab');
      assert.ok(await dialog.evaluate((el) => el.contains(document.activeElement)), `tab ${i}`);
    }
  });

  await check('eye toggle reveals in place: value, caret and focus kept', async () => {
    await f.current.click();
    await f.current.pressSequentially('abc 1');
    await f.current.evaluate((el) => el.setSelectionRange(2, 2));
    const eye = dialog.getByRole('button', { name: 'Show current password' });
    await eye.click();
    const after = await f.current.evaluate((el) => ({ type: el.type, value: el.value, caret: el.selectionStart, focused: document.activeElement === el }));
    assert.deepEqual(after, { type: 'text', value: 'abc 1', caret: 2, focused: true });
    const hide = dialog.getByRole('button', { name: 'Hide current password' });
    assert.equal(await hide.getAttribute('aria-pressed'), 'true');
    await hide.press('Enter');
    assert.equal(await f.current.getAttribute('type'), 'password');
    assert.equal(await f.next.getAttribute('type'), 'password', 'each field has its own toggle');
  });

  await check('checks a field on blur and re-checks on every keystroke after that', async () => {
    await f.next.click();
    await f.next.pressSequentially('short');
    await page.keyboard.press('Tab');
    assert.equal(await f.next.getAttribute('aria-invalid'), 'true');
    assert.match(await h.errorTextFor(f.next), /requirements marked below/);
    assert.ok(await dialog.locator('[aria-label="8 to 16 characters: not met"]').count());
    await f.next.fill('');
    await f.next.pressSequentially('Short9!x');
    assert.equal(await f.next.getAttribute('aria-invalid'), null);
  });

  await check('live checklist under New password follows the input', async () => {
    const met = await dialog.locator('[aria-label$=": met"]').count();
    assert.equal(met, 5);
  });

  await check('submit with empty fields shows every error, keeps the button enabled, focuses the first', async () => {
    await h.closeAndReopen(page);
    await h.submitButton(page).click();
    for (const input of [f.current, f.next, f.confirm]) assert.equal(await input.getAttribute('aria-invalid'), 'true');
    assert.equal(await h.activeAutocomplete(page), 'current-password');
    assert.equal(await h.submitButton(page).getAttribute('aria-disabled'), null);
    assert.equal(state.requests.length, 0, 'nothing sent');
  });

  await check('mismatched confirmation and reuse of the current password are caught', async () => {
    await f.current.fill(VALID.current);
    await f.next.fill(VALID.current);
    await f.confirm.fill('Different1!');
    await h.submitButton(page).click();
    assert.match(await h.errorTextFor(f.next), /different from your current one/);
    assert.match(await h.errorTextFor(f.confirm), /does not match/);
  });

  await check('Escape with typed text asks before discarding; Keep editing keeps it', async () => {
    await page.keyboard.press('Escape');
    await page.getByText('Discard changes?').waitFor();
    await page.getByRole('button', { name: 'Keep editing' }).click();
    assert.equal(await f.current.inputValue(), VALID.current);
  });

  await check('Discard clears every field and returns focus to the opener', async () => {
    await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
    await page.getByRole('button', { name: 'Discard', exact: true }).click();
    await dialog.waitFor({ state: 'detached' });
    assert.equal(await page.evaluate(() => document.activeElement?.textContent?.includes('Change password')), true);
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    await h.open(page);
    assert.equal(await f.current.inputValue(), '');
  });

  await check('closes at once with nothing typed: ×, Escape and the backdrop', async () => {
    await dialog.getByRole('button', { name: 'Close' }).click();
    await dialog.waitFor({ state: 'detached' });
    await h.open(page);
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    await h.open(page);
    await page.mouse.click(10, 10);
    await dialog.waitFor({ state: 'detached' });
    await h.open(page);
    await f.current.fill('x');
    await page.mouse.click(10, 10);
    await page.getByText('Discard changes?').waitFor();
    await page.getByRole('button', { name: 'Keep editing' }).click();
  });

  const submitWith = async (...answers) => {
    await h.closeAndReopen(page);
    state.answers = answers;
    await h.fillValid(page);
    await h.submitButton(page).click();
  };

  await check('wrong current password lands on that field, with focus, entries kept', async () => {
    await submitWith(ANSWERS.wrongCurrent);
    await page.waitForFunction(() => document.querySelector('input[autocomplete="current-password"]')?.getAttribute('aria-invalid') === 'true');
    assert.match(await h.errorTextFor(f.current), /current password is incorrect/);
    assert.equal(await h.activeAutocomplete(page), 'current-password');
    assert.equal(await f.next.inputValue(), VALID.next);
  });

  await check('server policy failure lands on New password', async () => {
    await submitWith(ANSWERS.policy);
    await page.waitForFunction(() => document.querySelectorAll('input[aria-invalid="true"]').length === 1);
    assert.match(await h.errorTextFor(f.next), /must contain a number/);
  });

  await check('429 shows the wait from Retry-After', async () => {
    await submitWith(ANSWERS.limited);
    await dialog.getByText('Too many attempts. Try again in 10 minutes.').waitFor();
  });

  await check('500 shows a banner with Try again that resends the kept entries', async () => {
    await submitWith(ANSWERS.server, h.ANSWERS.ok);
    await dialog.getByText(/server ran into a problem/).waitFor();
    assert.equal(await f.confirm.inputValue(), VALID.next);
    const sent = state.requests.length;
    await dialog.getByRole('button', { name: 'Try again' }).click();
    await dialog.waitFor({ state: 'detached' });
    assert.equal(state.requests.length, sent + 1);
  });

  await check('network loss shows the could-not-confirm banner with Try again', async () => {
    await h.open(page);
    state.answers = ['network'];
    await h.fillValid(page);
    await h.submitButton(page).click();
    await dialog.getByText(/could not confirm/).waitFor();
    assert.ok(await dialog.getByRole('button', { name: 'Try again' }).isVisible());
    assert.equal(await f.current.inputValue(), VALID.current);
  });

  await check('loading state: "Changing…", and a double click sends once', async () => {
    await h.closeAndReopen(page);
    state.delayMs = 1200;
    state.answers = [ANSWERS.ok];
    await h.fillValid(page);
    const before = state.requests.length;
    await h.submitButton(page).dblclick();
    await dialog.getByText('Changing…').waitFor();
    await dialog.waitFor({ state: 'detached', timeout: 5000 });
    state.delayMs = 0;
    assert.equal(state.requests.length, before + 1);
  });

  await check('success: dialog closes, "Password updated" toast, token rotated, only two fields sent', async () => {
    await page.getByText('Password updated').waitFor();
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('maslogcare_current_user')).token);
    assert.equal(stored, 'rotated.token.value');
    assert.deepEqual(Object.keys(state.requests.at(-1)), ['currentPassword', 'newPassword']);
  });

  await check('dark theme: axe finds no violations', async () => {
    const dark = await h.startContext(browser, { width: 1280, height: 800, theme: 'dark' });
    await h.opener(dark.page).waitFor({ timeout: 30000 });
    await h.open(dark.page);
    await h.inputs(dark.page).next.fill('ab');
    await h.submitButton(dark.page).click();
    await dark.page.screenshot({ path: `${h.shots}/desktop-1280-dark-errors.png` });
    assert.deepEqual(await h.runAxe(dark.page, '[role=dialog][aria-labelledby]'), []);
    await dark.context.close();
  });

  await check('401 signs out and leaves the profile', async () => {
    await submitWith(ANSWERS.expired);
    await page.waitForFunction(() => !localStorage.getItem('maslogcare_current_user'));
    await page.waitForFunction(() => !location.pathname.startsWith('/admin'), null, { timeout: 10000 });
  });

  await check('no page errors on desktop', async () => assert.deepEqual(errors, []));
};
