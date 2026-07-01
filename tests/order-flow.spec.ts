import { test, expect } from '@playwright/test';

test.describe('Full Order Flow', () => {
  test('User can browse menu, add item to cart, fill details, and place an online order', async ({ page }) => {
    // 1. Go to homepage
    await page.goto('http://localhost:3000');
    await page.waitForSelector('text=Featured Offers'); // Wait for homepage load
    
    // 2. Add an item to cart
    // Clicking the first 'Add to Cart' button in the "Explore Our Menu" section
    await page.locator('#menu').getByRole('button', { name: 'Add to Cart' }).first().click();
    
    // 3. Go to Cart
    await page.getByRole('link', { name: 'Cart' }).click();
    await page.waitForURL('**/cart');
    
    // 4. Verify cart has 1 item
    await expect(page.locator('text=Bacon Deluxe')).toBeVisible(); // Assuming seeded data
    
    // 5. Fill form and click Place Order
    await page.getByPlaceholder('Your name').fill('Playwright Tester');
    await page.getByPlaceholder('03xxxxxxxxx').fill('03211234567');
    await page.getByRole('button', { name: 'Place Order' }).click();
    
    // 6. Wait for order confirmation page
    await page.waitForURL(/\/order\/[a-f0-9-]+/, { timeout: 15000 });
    
    // 7. Verify confirmation page content
    await expect(page.getByText('Order Received!')).toBeVisible();
    
    // 8. Click "Place Order Online" button on the confirmation page
    await page.getByRole('button', { name: 'Place Order Online' }).click();
    
    // 9. Verify redirection back to homepage after a slight delay
    await page.waitForURL('**/', { timeout: 15000 });
    
    // 10. Verify we are back on the homepage
    await expect(page.locator('text=Taste the')).toBeVisible();
  });
});