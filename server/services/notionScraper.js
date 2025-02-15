// server/services/notionPuppeteerScraper.js
const puppeteer = require("puppeteer");

/**
 * Fetches and extracts meaningful text from a Notion page using Puppeteer.
 * It attempts to click on expandable dropdowns to reveal hidden content.
 * @param {string} url - The URL of the Notion page.
 * @returns {Promise<string>} - The extracted clean text content.
 */
async function fetchNotionPageContent(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to the URL and wait until the network is idle.
  await page.goto(url, { waitUntil: "networkidle2" });

  // Attempt to click on expandable elements.
  await page.evaluate(() => {
    // Adjust the selector to match the toggle elements on your Notion page.
    const toggleButtons = Array.from(document.querySelectorAll('button[aria-label="Expand"], button[aria-label="Toggle"]'));
    toggleButtons.forEach((btn) => btn.click());
  });

  // Wait for a fixed amount of time (2 seconds) to allow content to expand.
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Extract the fully rendered text content.
  const content = await page.evaluate(() => document.body.innerText);

  await browser.close();
  return content;
}

module.exports = { fetchNotionPageContent };
