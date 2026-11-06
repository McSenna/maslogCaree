'use strict';
// Layout per width: modal from the tablet breakpoint, full-screen sheet below it.
// Loaded by verifyChangePassword.cjs.
const h = require('./verifyChangePassword.cjs');
const { assert, check } = h;

const WIDTHS = [
  [320, 640], [375, 812], [414, 896], [768, 1024], [1024, 768], [1440, 900], [1920, 1080],
];

const measure = (page) =>
  h.dialogOf(page).evaluate((dialog) => {
    const card = [...dialog.querySelectorAll('div')].find((el) => el.querySelector('input') && getComputedStyle(el).overflow === 'hidden' && el.getBoundingClientRect().width > 200);
    const label = dialog.querySelector('label');
    const input = dialog.querySelector('input');
    const buttons = [...dialog.querySelectorAll('[role=button]')].filter((el) => /^(Change password|Changing…|Cancel)$/.test(el.textContent.trim()));
    const rect = (el) => el.getBoundingClientRect();
    const corners = [[2, 2], [innerWidth - 3, 2], [2, innerHeight - 3], [innerWidth - 3, innerHeight - 3]];
    return {
      cardWidth: card ? Math.round(rect(card).width) : null,
      coversScreen: corners.every(([x, y]) => dialog.contains(document.elementFromPoint(x, y)) && !document.elementFromPoint(x, y).closest('[aria-hidden=true]')),
      viewport: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      labelBeside: rect(label).right <= rect(input).left,
      buttons: buttons.map((el) => ({ text: el.textContent.trim(), top: Math.round(rect(el).top), left: Math.round(rect(el).left), width: Math.round(rect(el).width) })),
      clipped: [...dialog.querySelectorAll('input,[role=button]')].filter((el) => rect(el).right > innerWidth + 1 || rect(el).left < -1).length,
      smallTargets: [...dialog.querySelectorAll('input,[role=button]')]
        .filter((el) => el.getAttribute('tabindex') !== '-1')
        .filter((el) => rect(el).height < 44 || rect(el).width < 44).length,
    };
  });

module.exports = async (browser) => {
  for (const [width, height] of WIDTHS) {
    for (const theme of width === 375 || width === 1440 ? ['light', 'dark'] : ['light']) {
      const run = await h.startContext(browser, { width, height, theme, reducedMotion: 'reduce' });
      const { page } = run;
      await check(`${width}px ${theme}: opens without overflow, clipping or small targets`, async () => {
        await h.opener(page).waitFor({ timeout: 30000 });
        await h.open(page);
        await page.screenshot({ path: `${h.shots}/${width}-${theme}.png` });
        const m = await measure(page);
        assert.equal(m.scrollWidth <= m.viewport, true, `scrollWidth ${m.scrollWidth}`);
        assert.equal(m.clipped, 0, 'clipped controls');
        assert.equal(m.smallTargets, 0, 'targets under 44px');
        if (width >= 768) {
          assert.equal(m.labelBeside, true, 'labels beside inputs');
          assert.equal(m.cardWidth, Math.min(800, width - 32), 'card width');
          const [cancel, submit] = m.buttons;
          assert.deepEqual([cancel.text, submit.text], ['Cancel', 'Change password']);
          assert.equal(cancel.top, submit.top, 'buttons share a row');
        } else {
          assert.equal(m.labelBeside, false, 'labels above inputs');
          assert.equal(m.coversScreen, true, 'full-screen sheet');
          const [submit, cancel] = m.buttons;
          assert.deepEqual([submit.text, cancel.text], ['Change password', 'Cancel']);
          assert.ok(submit.top < cancel.top, 'primary on top');
          assert.equal(submit.width, cancel.width, 'full width, stacked');
        }
        await h.inputs(page).next.fill('ab');
        await h.submitButton(page).click();
        await page.screenshot({ path: `${h.shots}/${width}-${theme}-errors.png`, fullPage: true });
        const after = await measure(page);
        assert.equal(after.scrollWidth <= after.viewport, true, 'no overflow with errors shown');
      });
      if (width === 375) {
        await check(`375px ${theme}: axe finds no violations in the full-screen sheet`, async () => {
          assert.deepEqual(await h.runAxe(page, '[role=dialog][aria-labelledby]'), []);
        });
      }
      await check(`${width}px ${theme}: no page errors`, async () => assert.deepEqual(run.errors, []));
      await run.context.close();
    }
  }
};
