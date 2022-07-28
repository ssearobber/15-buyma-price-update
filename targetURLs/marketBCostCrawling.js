const puppeteer = require('puppeteer');

// buyma 取引ID 크롤링
async function marketBCostCrawling(url) {
  let browser = {};
  let page = {};

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        // '--window-size=1920,1080',
        // '--disable-notifications',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
      // slowMo : 1 ,
    });
    page = await browser.newPage();
    // await page.setViewport({
    //     width: 1920,
    //     height: 1080,
    // });
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url);

    await page.waitForTimeout(10000); // 없으면 크롤링 안됨 .

    let obj = {};
    obj.cost = '';
    obj.soldOut = [];

    // 取引ID 크롤링
    console.log('마켓비 가격취득');
    let cost = '';
    cost = await page.evaluate(() => {
      let cost;
      if (!document.querySelector('#span_product_price_text')) return cost;
      cost = document.querySelector('#span_product_price_text').textContent.replace(/[^0-9]/g, '');
      return cost;
    });
    await page.close();
    await browser.close();
    console.log('마켓비 종료.');

    obj.cost = cost;
    return obj;
  } catch (e) {
    console.log(e);
    await page.close();
    await browser.close();
  }
}

module.exports.marketBCostCrawling = marketBCostCrawling;
