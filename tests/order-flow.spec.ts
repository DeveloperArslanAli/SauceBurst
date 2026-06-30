import { test, expect } from '@playwright/test';

test('User can add item to cart, fill form, and place order', async ({ page }) => {
  // Go to homepage
  await page.goto('http://localhost:3000');
  await page.waitForSelector('text=Burgers');
  
  // Click first 'Add to Cart' button
  await page.getByRole('button', { name: 'Add to Cart' }).first().click();
  
  // Click the cart icon to go to cart
  await page.getByRole('link', { name: 'Cart' }).click();
  await page.waitForURL('**/cart');
  
  // Verify cart has 1 item
  await expect(page.getByText('Rs. ').first()).toBeVisible();
  
  // Fill form and submit
  await page.getByPlaceholder('Your name').fill('Playwright Tester');
  await page.getByPlaceholder('03xxxxxxxxx').fill('03211234567');
  await page.getByRole('button', { name: 'Place Order' }).click();
  
  // Wait for redirection to confirmation page
  await page.waitForURL(/\/order\/[a-f0-9-]+/, { timeout: 15000 });
  
  // Verify confirmation page content
  await expect(page.getByText('Order Received')).toBeVisible();
  await expect(page.getByText('Playwright Tester')).toBeVisible();
});