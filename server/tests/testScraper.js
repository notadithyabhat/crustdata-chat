const puppeteer = require('puppeteer');

async function simulateNotionCopy() {
  // Launch in non-headless mode to allow clipboard interactions
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const url = 'https://crustdata.notion.site/Crustdata-Discovery-And-Enrichment-API-c66d5236e8ea40df8af114f6d447ab48#13ce4a7d95b180579f19cc25235f053b';
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.notion-page-content');

  // Expand toggle blocks so that hidden content becomes visible
  await page.evaluate(() => {
    const toggles = Array.from(document.querySelectorAll('.notion-toggle-block'));
    toggles.forEach(toggle => toggle.click());
  });
  // Wait for the toggles to finish their animations/expansions
  await page.waitForTimeout(2000);

  // Click to ensure the content element is focused
  await page.click('.notion-page-content');

  // Simulate selecting all content (Ctrl+A)
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');

  // Simulate copying the selection (Ctrl+C)
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyC');
  await page.keyboard.up('Control');

  // Allow some time for the clipboard to be updated
  await page.waitForTimeout(1000);

  // Use the Clipboard API to read the copied text
  const copiedMarkdown = await page.evaluate(async () => {
    try {
      return await navigator.clipboard.readText();
    } catch (error) {
      return 'Error reading clipboard: ' + error.message;
    }
  });

  console.log('Copied Markdown:', copiedMarkdown);

  await browser.close();
}

simulateNotionCopy();
