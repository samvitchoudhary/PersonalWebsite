import { test, expect } from '@playwright/test';

test.describe('Comprehensive resume functionality check', () => {
  test('should verify complete resume flow without errors', async ({ page }) => {
    const allErrors: Array<{ type: string; message: string }> = [];
    
    // Capture all types of errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        allErrors.push({ type: 'console-error', message: msg.text() });
      }
    });

    page.on('pageerror', (error) => {
      allErrors.push({ type: 'page-error', message: error.message });
    });

    page.on('requestfailed', (request) => {
      allErrors.push({ 
        type: 'request-failed', 
        message: `${request.url()} - ${request.failure()?.errorText || 'unknown error'}` 
      });
    });

    // Navigate to home
    console.log('1. Navigating to home page...');
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify the chalkboard hotspot exists
    console.log('2. Checking if chalkboard hotspot exists...');
    const chalkboardHotspot = page.locator('polygon[aria-label="Chalkboard — Resume"]');
    await expect(chalkboardHotspot).toBeVisible();
    console.log('   ✓ Chalkboard hotspot found');

    // Check that the click handler is attached (via aria-label and tabIndex)
    const tabIndex = await chalkboardHotspot.getAttribute('tabindex');
    expect(tabIndex).toBe('0');
    console.log('   ✓ Click handler is properly attached (tabindex=0)');

    // Click to navigate
    console.log('3. Clicking chalkboard to navigate to resume page...');
    await chalkboardHotspot.hover();
    await page.waitForTimeout(300);
    await chalkboardHotspot.click();

    // Wait for navigation
    await page.waitForURL('**/resume', { timeout: 10000 });
    console.log('   ✓ Navigation successful');

    // Check the URL
    const currentUrl = page.url();
    expect(currentUrl).toContain('/resume');
    console.log('   ✓ URL is correct:', currentUrl);

    // Wait for page to stabilize
    await page.waitForLoadState('networkidle');

    // Check that the iframe exists
    console.log('4. Checking if resume iframe exists...');
    const iframe = page.locator('iframe[title="Samvit Choudhary — Resume"]');
    await expect(iframe).toBeVisible();
    console.log('   ✓ Resume iframe is visible');

    // Check iframe src attribute
    const iframeSrc = await iframe.getAttribute('src');
    console.log('   ✓ Iframe src:', iframeSrc);
    expect(iframeSrc).toBe('/SamvitChoudhary_Resume.pdf');

    // Verify the PDF URL is accessible
    console.log('5. Verifying PDF file is accessible...');
    const pdfResponse = await page.request.get('/SamvitChoudhary_Resume.pdf');
    expect(pdfResponse.status()).toBe(200);
    expect(pdfResponse.headers()['content-type']).toContain('pdf');
    console.log('   ✓ PDF file is accessible (HTTP 200)');
    console.log('   ✓ Content-Type is PDF');

    // Wait for PDF to load in iframe
    await page.waitForTimeout(3000);

    // Check for CSP headers on the main page
    console.log('6. Checking CSP headers...');
    const response = await page.goto(page.url());
    const headers = response?.headers() || {};
    const cspHeader = headers['content-security-policy'] || '';
    
    console.log('   CSP Header:', cspHeader);
    expect(cspHeader).toContain("frame-ancestors 'self'");
    expect(cspHeader).toContain("frame-src 'self'");
    console.log('   ✓ frame-ancestors \'self\' is present');
    console.log('   ✓ frame-src \'self\' is present');

    const xFrameOptions = headers['x-frame-options'] || '';
    console.log('   X-Frame-Options:', xFrameOptions);
    expect(xFrameOptions.toUpperCase()).toBe('SAMEORIGIN');
    console.log('   ✓ X-Frame-Options is SAMEORIGIN');

    // Check download link exists
    console.log('7. Checking download link...');
    const downloadLink = page.locator('a[download="SamvitChoudhary_Resume.pdf"]');
    await expect(downloadLink).toBeVisible();
    const downloadHref = await downloadLink.getAttribute('href');
    expect(downloadHref).toBe('/SamvitChoudhary_Resume.pdf');
    console.log('   ✓ Download link exists and points to correct file');

    // Report all errors
    console.log('\n8. Error summary:');
    
    // Filter out expected ERR_ABORTED errors for PDF files
    // These occur when the browser aborts the download to display the PDF inline in the iframe
    const unexpectedErrors = allErrors.filter(err => {
      if (err.type === 'request-failed' && 
          err.message.includes('SamvitChoudhary_Resume.pdf') && 
          err.message.includes('ERR_ABORTED')) {
        console.log(`   ⚠️  Ignoring expected ERR_ABORTED for PDF (normal browser behavior)`);
        return false;
      }
      return true;
    });
    
    if (unexpectedErrors.length > 0) {
      console.error('   ❌ Unexpected errors detected:');
      unexpectedErrors.forEach((err, i) => {
        console.error(`   ${i + 1}. [${err.type}] ${err.message}`);
      });
    } else {
      console.log('   ✓ No unexpected errors detected!');
    }

    // Final assertions
    expect(unexpectedErrors, 'Should have no unexpected errors').toHaveLength(0);

    console.log('\n✅ All checks passed! Resume functionality is working correctly.');
  });
});
