const { GoogleSpreadsheet } = require('google-spreadsheet');
const { smartStoreCrawling } = require('./smartStoreCrawling');
const { shoppingNaverCrawling } = require('./shoppingNaverCrawling');

async function googleProfitSheet() {
  // 시트 url중 값
  // Initialize the sheet - doc ID is the long id in the sheets URL
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREAD_ID || googleSpreadId);

  // GOOGLE_API_KEY로 구글API다루는 방법. 읽는것만 가능.
  // doc.useApiKey(process.env.GOOGLE_API_KEY);

  // GOOGLE_SERVICE로 구글API다루는 방법. 편집 가능.
  // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || googleServiceAccountEmail,
    private_key: process.env.GOOGLE_PRIVATE_KEY || googlePrivateKey,
  });

  // loads document properties and worksheets
  await doc.loadInfo();

  // 利益計算 시트ID로 시트취득
  const sheet = doc.sheetsById[process.env.GOOGLE_PROFIT_SHEET_ID || googleProfitSheetId];
  // const sheet = doc.sheetsById[process.env.GOOGLE_PROFIT_SHEET_TEST_ID];

  // rows 취득
  const rows = await sheet.getRows();

  // 범위 취득 (범위를 A1부터 안하면 에러 발생)
  await sheet.loadCells('A1:F' + rows.length);
  //오늘 일짜
  let today = new Date();
  //변수 초기화
  let cost = '';
  // 해당 row번호, url을 취득
  for (i = 1; i < rows.length; i++) {
    let urlCell = sheet.getCell(i + 1, 2);
    if (!urlCell.value) continue;
    // 스마트 스토어 , m.스마트 스토어
    if (
      urlCell.value.match(/smartstore.naver.com/g) ||
      urlCell.value.match(/m.smartstore.naver.com/g)
    ) {
      cost = await smartStoreCrawling(urlCell.value);
      if (!cost) continue;
      await PriceIsUpdated(sheet, cost, today);
      await sheet.saveUpdatedCells();
    }
    //shopping.naver
    if (urlCell.value.match(/shopping.naver.com/g)) {
      cost = await shoppingNaverCrawling(urlCell.value);
      if (!cost) continue;
      await PriceIsUpdated(sheet, cost, today);
    }
  }
  await sheet.saveUpdatedCells();
}

//가격이 갱신되었을 경우, 가격을 갱신 후
async function PriceIsUpdated(sheet, cost, today) {
  let priceCell = sheet.getCell(i + 1, 4);
  if (priceCell.value != Number(cost)) {
    priceCell.value = Number(cost);
    priceCell.backgroundColor = { green: 555 };
    priceCell.note =
      today.toLocaleDateString() +
      ' ' +
      priceCell.value +
      'won → ' +
      cost +
      'wonへ' +
      '値段変更があります。';
  }
}

module.exports.googleProfitSheet = googleProfitSheet;
