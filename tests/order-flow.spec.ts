import { test, expect } from '@playwright/test';

test.describe('Full Order Flow', () => {
  test('User can browse menu, add item to cart, fill details, and place an online order', async ({ page }) => {
    // 1. Go to homepage
    await page.goto('http://localhost:3000');
    await page.waitForSelector('text=Featured Offers', { timeout: 15000 });

    // 2. Grab the name of whatever first item is in the menu (no hardcoded seed data)
    const firstAddBtn = page.locator('#menu').getByRole('button', { name: 'Add to Cart' }).first();
    await firstAddBtn.waitFor({ state: 'visible', timeout: 10000 });

    // Capture item name from the card closest to the button
    const firstCard = firstAddBtn.locator('xpath=ancestor::div[contains(@class,"rounded-xl")]');
    const itemName = await firstCard.locator('h3').first().textContent() ?? '';

    // 3. Add item to cart
    await firstAddBtn.click();

    // 4. Navigate to Cart via the cart icon / nav link
    await page.goto('http://localhost:3000/cart');
    await page.waitForURL('**/cart', { timeout: 8000 });

    // 5. Verify the item we just added is visible in the cart
    if (itemName.trim()) {
      await expect(page.locator(`text=${itemName.trim()}`).first()).toBeVisible({ timeout: 8000 });
    } else {
      // Fallback: just check that at least one cart row exists
      await expect(page.locator('[data-testid="cart-item"], .cart-item, tr').first()).toBeVisible({ timeout: 8000 });
    }

    // 6. Fill order form and submit
    await page.getByPlaceholder('Your name').fill('Playwright Tester');
    await page.getByPlaceholder('03xxxxxxxxx').fill('03211234567');
    await page.getByRole('button', { name: 'Place Order' }).click();

    // 7. Wait for order confirmation page
    await page.waitForURL(/\/order\/[a-f0-9-]+/, { timeout: 20000 });

    // 8. Verify confirmation page content
    await expect(page.getByText('Order Received!')).toBeVisible({ timeout: 10000 });

    // 9. Verify the WhatsApp button is present (don't actually click — avoid real API call)
    await expect(page.getByRole('button', { name: 'Place Order Online' })).toBeVisible();
  });
});