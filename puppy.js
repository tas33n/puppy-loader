const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const app = express();
// const port = 3000;
const port = process.env.PORT || 5001;

// Use StealthPlugin to bypass some anti-bot measures
puppeteer.use(StealthPlugin());

app.get('/api', async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    // Set the user agent to mimic a real browser
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
    );

    // Get the URL parameter from the request
    const url = req.query.url;

    if (!url) {
      return res.status(400).send('URL parameter is missing');
    }

    // Navigate to the specified URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the page to load completely (you can adjust the wait time as needed)
    await page.waitForTimeout(5000);

    // Get the HTML content of the page
    const htmlContent = await page.content();

    // Close the browser
    await browser.close();

    // Respond with the HTML content
    res.send(htmlContent);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
