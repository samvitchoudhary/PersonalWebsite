import { test, expect } from '@playwright/test';

test.describe('Resume iframe rendering', () => {
  test('should load resume PDF in iframe without CSP errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const cspViolations: string[] = [];

    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Capture CSP violations
    page.on('pageerror', (error) => {
      if (error.message.includes('Content Security Policy') || 
          error.message.includes('CSP') ||
          error.message.includes('frame-ancestors')) {
        cspViolations.push(error.message);
      }
    });

    // Navigate to the kitchen (home page)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take a "before" screenshot of the kitchen
    await page.screenshot({ 
      path: 'tests/screenshots/01-kitchen-home.png',
      fullPage: true 
    });

    // Find the chalkboard hotspot by its aria-label and click it
    const chalkboardHotspot = page.locator('polygon[aria-label="Chalkboard — Resume"]');
    await expect(chalkboardHotspot).toBeVisible();
    
    // Hover to trigger tooltip, then click to navigate
    await chalkboardHotspot.hover();
    await page.waitForTimeout(300); // Wait for tooltip animation
    await chalkboardHotspot.click();

    // Wait for navigation to /resume
    await page.waitForURL('**/resume', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Take a screenshot of the resume page after navigation
    await page.screenshot({ 
      path: 'tests/screenshots/02-resume-page-initial.png',
      fullPage: true 
    });

    // Give the PDF time to load
    await page.waitForTimeout(3000);

    // Take a final screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/03-resume-page-final.png',
      fullPage: true 
    });

    // Check for CSP violations
    if (cspViolations.length > 0) {
      console.error('CSP Violations detected:');
      cspViolations.forEach(v => console.error('  -', v));
    }

    // Check for console errors related to frame loading
    const frameErrors = consoleErrors.filter(e => 
      e.includes('frame') || 
      e.includes('iframe') || 
      e.includes('CSP') ||
      e.includes('refused')
    );

    if (frameErrors.length > 0) {
      console.error('Frame-related errors detected:');
      frameErrors.forEach(e => console.error('  -', e));
    }

    // Assertions
    expect(cspViolations, 'Should have no CSP violations').toHaveLength(0);
    expect(frameErrors, 'Should have no frame-related errors').toHaveLength(0);

    // Verify the iframe is present
    await expect(page.locator('iframe[title="Samvit Choudhary — Resume"]')).toBeVisible();

    console.log('✓ Resume iframe test passed - no CSP errors detected');
  });
});
