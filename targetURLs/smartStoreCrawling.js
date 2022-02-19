const puppeteer = require('puppeteer');
const path = require('path');

// buyma 取引ID 크롤링
async function smartStoreCrawling(url) {
    
    let browser = {};
    let page = {};

    try {
        browser = await puppeteer.launch({
        headless: false,
        args: [
            '--window-size=1920,1080',
            '--disable-notifications',
            "--no-sandbox",
            "--disable-setuid-sandbox",
        ],
        // slowMo : 1 ,
    });
    page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url);

    await page.waitForTimeout(20000); // 없으면 크롤링 안됨 .textContent.replace(/,/g, ''),
    // 取引ID 크롤링
    console.log('스마트 스토어 가격취득');
    cost = await page.evaluate(() => {
        const cost = document.querySelector('fieldset strong span:nth-of-type(2)');
        return cost;
    });
    await page.close();
    await browser.close();
    console.log('스마트 스토어 종료.');

    return cost;
    }
    catch(e) {
        console.log(e);
        await page.close();
        await browser.close();
    } 
}

module.exports.smartStoreCrawling = smartStoreCrawling;