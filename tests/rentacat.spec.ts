import { test, expect } from '@playwright/test';

const BASE = 'https://cs1632.appspot.com';

const catNames = (page) => page.locator('#listing li');
const catPhotos = (page) => page.locator('ol li');

async function setCookies(page, v1: string, v2: string, v3: string) {
  await page.evaluate(([a, b, c]) => {
    document.cookie = `1=${a}`;
    document.cookie = `2=${b}`;
    document.cookie = `3=${c}`;
  }, [v1, v2, v3]);
}

test.beforeEach(async ({ page }) => {
  await page.goto(BASE + '/');
  await setCookies(page, 'false', 'false', 'false');
});

test('TEST-1-RESET', async ({ page }) => {
  await setCookies(page, 'true', 'true', 'true');
  await page.getByRole('link', { name: 'Reset' }).click();
  await expect(catNames(page).nth(0)).toHaveText('ID 1. Jennyanydots');
  await expect(catNames(page).nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(catNames(page).nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-2-CATALOG', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog' }).click();
  await expect(catPhotos(page).nth(1).locator('img')).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog' }).click();
  await expect(catNames(page)).toHaveCount(3);
  await expect(catNames(page).nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-4-RENT-A-CAT', async ({ page }) => {
  await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
  await expect(page.getByRole('button', { name: 'Rent', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Return', exact: true })).toBeVisible();
});

test('TEST-5-RENT', async ({ page }) => {
  await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
  await page.locator('#rentID').fill('1');
  await page.getByRole('button', { name: 'Rent', exact: true }).click();
  await expect(catNames(page).nth(0)).toHaveText('Rented out');
  await expect(catNames(page).nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(catNames(page).nth(2)).toHaveText('ID 3. Mistoffelees');
  await expect(page.getByText('Success!', { exact: true })).toBeVisible();
});

test('TEST-6-RETURN', async ({ page }) => {
  await setCookies(page, 'false', 'true', 'true');
  await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
  await page.locator('#returnID').fill('2');
  await page.getByRole('button', { name: 'Return', exact: true }).click();
  await expect(catNames(page).nth(0)).toHaveText('ID 1. Jennyanydots');
  await expect(catNames(page).nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(catNames(page).nth(2)).toHaveText('Rented out');
  await expect(page.getByText('Success!', { exact: true })).toBeVisible();
});

test('TEST-7-FEED-A-CAT', async ({ page }) => {
  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
  await expect(page.getByRole('button', { name: 'Feed', exact: true })).toBeVisible();
});

test('TEST-8-FEED', async ({ page }) => {
  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
  await page.locator('#catnips').fill('6');
  await page.getByRole('button', { name: 'Feed', exact: true }).click();
  await expect(page.getByText('Nom, nom, nom.', { exact: true })).toBeVisible({ timeout: 10000 });
});

test('TEST-9-GREET-A-CAT', async ({ page }) => {
  await page.getByRole('link', { name: 'Greet-A-Cat' }).click();
  await expect(page.getByText('Meow!Meow!Meow!', { exact: true })).toBeVisible();
});

test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
  await page.goto(BASE + '/greet-a-cat/Jennyanydots');
  await expect(page.getByText('Meow! from Jennyanydots.', { exact: true })).toBeVisible();
});

test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {
  await setCookies(page, 'true', 'true', 'true');
  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
  await expect(page.locator('body')).toHaveScreenshot();
});


test('DEFECT1-FUN-FEED', async ({ page }) => {
  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
  await page.locator('#catnips').fill('-3');
  await page.getByRole('button', { name: 'Feed', exact: true }).click();
  await expect(page.getByText('Cat fight!', { exact: true })).toBeVisible({ timeout: 10000 });
});

test('DEFECT2-FUN-GREET-A-CAT-WITH-NAME', async ({ page }) => {
  await setCookies(page, 'true', 'false', 'false');
  await page.goto(BASE + '/greet-a-cat/Jennyanydots');
  await expect(page.getByText('Jennyanydots is not here.', { exact: true })).toBeVisible();
});

test('DEFECT3-FUN-GREET-A-CAT', async ({ page }) => {
  await setCookies(page, 'true', 'false', 'false');
  await page.getByRole('link', { name: 'Greet-A-Cat' }).click();
  await expect(page.getByText('Meow!Meow!', { exact: true })).toBeVisible();
});