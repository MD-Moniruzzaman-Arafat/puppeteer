const puppeteer = require("puppeteer");

const searchGoogle = async (searchQuery) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.google.com/");

  // Wait for the search input field to be available and type the search query
  await page.waitForSelector('input[name="q"]');
  await page.type('input[name="q"]', searchQuery);
  await page.keyboard.press("Enter");

  // Wait for the results page to load and display the results
  await page.waitForNavigation({ waitUntil: "domcontentloaded" });

  // Ensure that the results have loaded
  await page.waitForSelector(".g");

  const list = await page.evaluate(() => {
    let data = [];
    const items = document.querySelectorAll(".g");
    items.forEach((item) => {
      const titleElement = item.querySelector("h3");

      if (titleElement) {
        data.push({
          title: titleElement.innerText.trim(),
        });
      }
    });
    return data;
  });

  console.log(list);

  await browser.close();
};

searchGoogle("java");
