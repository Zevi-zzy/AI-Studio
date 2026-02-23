import { test, expect } from '@playwright/test';

test.describe('Zevi Content Creator Features', () => {
  
  test.beforeEach(async ({ page }) => {
    // Go to home page before each test
    await page.goto('/');
  });

  test('AI Cover Image Generation', async ({ page }) => {
    await page.goto('/create');
    // Ensure we are in edit mode. If "Start Creation" button is present, click it.
    const startBtn = page.getByText('开始创作');
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }
    
    // Mock window.prompt
    await page.evaluate(() => {
      window.prompt = () => 'test prompt';
    });

    // Find and click generate button
    const generateBtn = page.getByText('AI 生成封面');
    await expect(generateBtn).toBeVisible();
    await generateBtn.click();

    // Verify loading state
    await expect(page.getByText('生成中...')).toBeVisible();

    // Wait for generation to complete (mock is 2s)
    await page.waitForTimeout(3000);

    // Verify image is set
    const coverImg = page.locator('img[alt="Cover"]');
    await expect(coverImg).toBeVisible();
    const src = await coverImg.getAttribute('src');
    expect(src).toContain('placehold.co');
  });

  test('AI Material Generation', async ({ page }) => {
    await page.goto('/materials');

    // Mock window.prompt
    await page.evaluate(() => {
      window.prompt = () => 'test material prompt';
    });

    // Find and click generate button
    const generateBtn = page.getByText('AI 生成图片');
    await expect(generateBtn).toBeVisible();
    await generateBtn.click();

    // Wait for generation
    await page.waitForTimeout(3000);

    // Verify new material appears
    const aiTag = page.getByText('AI生成').first();
    await expect(aiTag).toBeVisible();
  });

  test('Image Card Reordering', async ({ page }) => {
    await page.goto('/create');
    const startBtn = page.getByText('开始创作');
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }

    // Add two cards
    const addBtn = page.getByText('添加卡片');
    await addBtn.click();
    await addBtn.click();

    // Fill descriptions to identify cards
    const descriptions = page.locator('textarea[placeholder="描述这张图片..."]');
    await descriptions.nth(0).fill('Card 1');
    await descriptions.nth(1).fill('Card 2');

    // Move first card down
    const firstCard = page.locator('.border.border-gray-200').nth(0);
    await firstCard.hover();
    
    // Use evaluate to force click which is the most robust method for tricky hover elements
    await page.evaluate(() => {
        const btn = document.querySelector('.border.border-gray-200 button[title="下移"]');
        if (btn instanceof HTMLElement) btn.click();
    });

    // Wait a bit for React to process state update
    await page.waitForTimeout(500);

    // Verify order changed
    await expect(descriptions.nth(0)).toHaveValue('Card 2');
    await expect(descriptions.nth(1)).toHaveValue('Card 1');
  });

  test('Inspiration Generation and Clear History', async ({ page }) => {
    await page.goto('/inspiration');

    // Mock the API response
    await page.route('**/api/deepseek/v1/chat/completions', async route => {
      const timestamp = Date.now();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: {
              content: JSON.stringify([
                { title: `Inspiration ${timestamp}`, description: 'Desc', keywords: ['k1'] }
              ])
            }
          }]
        })
      });
    });

    // Fill keyword
    const input = page.getByPlaceholder('输入关键词...');
    await input.fill('test');
    
    // Click generate
    const generateBtn = page.getByText('生成灵感');
    await generateBtn.click();
    
    // Wait for result
    const firstResult = page.locator('.bg-white.rounded-xl').first();
    await expect(firstResult).toBeVisible();
    const firstTitle = await firstResult.locator('h3').textContent();
    
    // Click generate again
    await input.fill('test2');
    await generateBtn.click();
    
    // Wait for new result - old one should be gone
    await expect(page.locator('.bg-white.rounded-xl')).toHaveCount(1);
    
    const secondResult = page.locator('.bg-white.rounded-xl').first();
    const secondTitle = await secondResult.locator('h3').textContent();
    
    expect(secondTitle).not.toBe(firstTitle);
  });

  test('Fullscreen Preview Toggle', async ({ page }) => {
    await page.goto('/create');
    const startBtn = page.getByText('开始创作');
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }

    // Open preview
    await page.getByText('预览').click();
    
    const previewModal = page.locator('.fixed.inset-0');
    await expect(previewModal).toBeVisible();

    // Initial state: not fullscreen (rounded corners)
    const container = previewModal.locator('> div');
    await expect(container).toHaveClass(/rounded-\[2rem\]/);

    // Click fullscreen button
    const fullscreenBtn = page.locator('button[title="全屏预览"]');
    await fullscreenBtn.click();

    // Verify fullscreen state
    await expect(container).not.toHaveClass(/rounded-\[2rem\]/);
    await expect(container).toHaveClass(/w-full h-full/);

    // Exit fullscreen
    const exitBtn = page.locator('button[title="退出全屏"]');
    await exitBtn.click();

    // Verify back to normal
    await expect(container).toHaveClass(/rounded-\[2rem\]/);
  });

  test('Custom Creation Tags', async ({ page }) => {
    await page.goto('/create');
    const startBtn = page.getByText('开始创作');
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }

    const input = page.getByPlaceholder('添加分类标签...');
    const addBtn = page.getByRole('button', { name: '添加', exact: true });

    // Add tag
    await input.fill('MyTag');
    await addBtn.click();

    // Verify tag appears
    const tag = page.getByText('MyTag');
    await expect(tag).toBeVisible();

    // Remove tag
    const removeBtn = tag.locator('..').getByRole('button');
    await removeBtn.click();

    // Verify tag gone
    await expect(tag).not.toBeVisible();
  });

});
