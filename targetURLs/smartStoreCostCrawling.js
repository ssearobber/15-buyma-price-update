const puppeteer = require('puppeteer');

// buyma 取引ID 크롤링
async function smartStoreCostCrawling(url) {
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
    // 품절 확인
    const code1 = await page.$x('//script[contains(., "options")]');
    if (code1.length != 0) {
      const soldOutStringArr = await page.evaluate(
        (el) => el.innerHTML.match(/(?<=\"options\":\[)(.*?)(?=\])/g),
        code1[0],
      );
      let soldOutStringArr1 = '[' + soldOutStringArr[2] + ']';
      let soldOutObjectArr = JSON.parse(soldOutStringArr1);
      for (soldOutObject of soldOutObjectArr) {
        if (soldOutObject.stockQuantity == 0) {
          // obj.optionName1 = soldOutObject.optionName1;
          // obj.stockQuantity = soldOutObject.stockQuantity;
          obj.soldOut.push(soldOutObject);
        }
      }
    }
    // 取引ID 크롤링
    console.log('스마트 스토어 가격취득');
    let cost = '';
    cost = await page.evaluate(() => {
      let cost;
      if (!document.querySelector('fieldset strong span:nth-of-type(2)')) return cost;
      cost = document
        .querySelector('fieldset strong span:nth-of-type(2)')
        .textContent.replace(/[^0-9]/g, '');
      return cost;
    });
    await page.close();
    await browser.close();
    console.log('스마트 스토어 종료.');

    obj.cost = cost;
    return obj;
  } catch (e) {
    console.log(e);
    await page.close();
    await browser.close();
  }
}

module.exports.smartStoreCostCrawling = smartStoreCostCrawling;
