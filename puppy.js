const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 5001;

// Define a route to fetch and display a web page
app.get('/p', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).send('Missing URL parameter.');
    }

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.goto(url);

    // Get the HTML content of the page
    const pageContent = await page.content();

    await browser.close();

    // Display the page content in the browser
    res.send(pageContent);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching and displaying the page.');
  }
});

// Start the Express.js server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
