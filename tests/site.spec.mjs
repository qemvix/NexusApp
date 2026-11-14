import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { release } from '../src/data.mjs';
const pages = ['/', '/modules/', '/guide/', '/downloads/', '/privacy/', '/changelog/', '/license/'];

test('toolkit filters and search work together and recover from no matches', async ({page}) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', {level:1})).toContainText('Less friction.');
  await expect(page.locator('.module-card:visible')).toHaveCount(13);
  await page.locator('[data-filter="cursor"]').click();
  await expect(page.locator('.module-card:visible')).toHaveCount(5);
  await page.getByRole('searchbox').fill('Glide');
  await expect(page.locator('.module-card:visible')).toHaveCount(1);
  await page.getByRole('searchbox').fill('no such tool');
  await expect(page.locator('.empty-results')).toBeVisible();
  await page.getByRole('searchbox').fill('');
  await page.locator('[data-filter="desktop"]').click();
  await expect(page.locator('.module-card:visible')).toHaveCount(4);
  await page.locator('[data-filter="productivity"]').click();
  await expect(page.locator('.module-card:visible')).toHaveCount(4);
  await expect(page.locator('.empty-results')).toBeHidden();
  expect(errors).toEqual([]);
});
test('feature dialog shows real limits, traps focus and returns focus', async ({page}) => {
  await page.goto('/');
  const opener = page.locator('.module-card [data-module="scrollflow"]');
  await opener.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', {name:'ScrollFlow', exact:true})).toBeVisible();
  await expect(dialog).toContainText('Run ScrollFlow instead of standalone Glide');
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('link')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', {name:'Close details'})).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});
test('gallery and full-size screenshot dialog show real app captures', async ({page}) => {
  await page.goto('/');
  await page.getByRole('button', {name:'Permissions', exact:true}).click();
  const image = page.locator('#gallery-image');
  await expect(image).toHaveAttribute('src', '/assets/media/nexus-permissions.png');
  await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
  await page.locator('#gallery-full').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('dialog img')).toHaveAttribute('src', '/assets/media/nexus-permissions.png');
  await page.keyboard.press('Escape');
});
test('mobile navigation works with escape and link activation', async ({page}) => {
  await page.setViewportSize({width:375,height:812});
  await page.goto('/');
  const menu = page.getByRole('button', {name:'Menu'});
  await expect(page.getByRole('navigation', {name:'Main navigation'})).toBeHidden();
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded','true');
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await menu.click();
  await page.getByRole('navigation', {name:'Main navigation'}).getByRole('link', {name:'Getting started'}).click();
  await expect(page).toHaveURL(/\/guide\/$/);
});
test('download metadata, hashes and copy control are correct', async ({page, context}) => {
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/downloads/');
  await expect(page.getByRole('link', {name:'Download installer', exact:true})).toHaveAttribute('href',release.installer);
  await expect(page.getByRole('link', {name:'Download portable ZIP', exact:true})).toHaveAttribute('href',release.portable);
  const details = page.locator('.hash-details').first();
  await details.locator('summary').click();
  const checksum = await details.locator('code').textContent();
  expect(checksum).toMatch(/^[a-f0-9]{64}$/);
  await details.getByRole('button', {name:'Copy checksum'}).click();
  await expect(page.getByRole('status')).toHaveText('Checksum copied.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(checksum);
});
test('motion illustration supports keyboard and reduced motion defaults', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const pause = page.getByRole('button', {name:'Resume preview'});
  await expect(pause).toHaveAttribute('aria-pressed','true');
  await pause.click();
  await expect(page.getByRole('button', {name:'Pause preview'})).toHaveAttribute('aria-pressed','false');
  await page.locator('#trail-intensity').fill('80');
  await expect(page.locator('#trail-value')).toHaveText('80%');
  await page.locator('canvas').focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(page.locator('.demo-hint')).toBeHidden();
});
test('static feature guide and mobile navigation work without JavaScript', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled:false, viewport:{width:375,height:812}});
  const page = await context.newPage();
  await page.goto('/modules/');
  await expect(page.locator('.module-card')).toHaveCount(13);
  await expect(page.getByRole('navigation', {name:'Main navigation'})).toBeVisible();
  await page.locator('.module-card [href="/modules/#cursorblur"]').click();
  await expect(page.locator('#cursorblur')).toBeInViewport();
  await context.close();
});
for (const route of pages) {
  test(`${route} has accessible content and fits narrow and wide screens`, async ({page}, info) => {
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({width,height:1000});
      const response = await page.goto(route);
      expect(response.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      expect(overflow, `${route} overflows at ${width}px`).toBe(false);
    }
    const audit = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(audit.violations).toEqual([]);
    expect(errors).toEqual([]);
    if (route === '/') {
      await page.screenshot({path:info.outputPath('home-desktop.png'), fullPage:true});
      await page.setViewportSize({width:375,height:812});
      await page.screenshot({path:info.outputPath('home-mobile.png'), fullPage:true});
    }
  });
}
test('unknown routes return the designed 404 page and security headers', async ({request}) => {
  const response = await request.get('/missing-page/');
  expect(response.status()).toBe(404);
  expect(response.headers()['content-security-policy']).toContain("script-src 'self'");
  expect(await response.text()).toContain('This page');
  expect((await request.post('/')).status()).toBe(405);
});
