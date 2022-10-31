const { GoogleSpreadsheet } = require('google-spreadsheet');
const { smartStoreCostCrawling } = require('./smartStoreCostCrawling');
const { shoppingNaverCostCrawling } = require('./shoppingNaverCostCrawling');
const { marketBCostCrawling } = require('./marketBCostCrawling');
const { casamiaSsgCostCrawling } = require('./casamiaSsgCostCrawling');

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
  await sheet.loadCells('A1:I' + rows.length);
  //오늘 일짜
  let today = new Date();
  //변수 초기화
  let obj;
  let soldOutItem = sheet.getCell(1, 7).value; //売り切れ항목
  let priceItem = sheet.getCell(1, 8).value; //仕入原価（基本値段）항목
  // 해당 row번호, url을 취득
  for (i = 1; i < rows.length; i++) {
    let urlCell = sheet.getCell(i + 1, 5); //URL항목
    if (!urlCell.value) continue;
    // 스마트 스토어 , m.스마트 스토어
    if (
      urlCell.value.match(/smartstore.naver.com/g) ||
      urlCell.value.match(/m.smartstore.naver.com/g)
    ) {
      console.log('url : ', urlCell.value);
      obj = await smartStoreCostCrawling(urlCell.value);
      if (!obj?.cost) continue;
      if (priceItem == '仕入原価（基本値段）') await priceIsUpdated(sheet, obj.cost, today, i);
      if (soldOutItem == '売り切れ') soldOutIsUpdated(sheet, obj, today, i);
      await sheet.saveUpdatedCells();
    }
    //shopping.naver
    if (urlCell.value.match(/shopping.naver.com/g)) {
      console.log('url : ', urlCell.value);
      obj = await shoppingNaverCostCrawling(urlCell.value);
      if (!obj?.cost) continue;
      if (priceItem == '仕入原価（基本値段）') await priceIsUpdated(sheet, obj.cost, today, i);
      await sheet.saveUpdatedCells();
    }
    //marketB
    if (urlCell.value.match(/marketb.kr/g)) {
      console.log('url : ', urlCell.value);
      obj = await marketBCostCrawling(urlCell.value);
      if (!obj?.cost) continue;
      if (priceItem == '仕入原価（基本値段）') await priceIsUpdated(sheet, obj.cost, today, i);
      await sheet.saveUpdatedCells();
    }
    //casamia
    if (urlCell.value.match(/casamia.ssg.com/g)) {
      console.log('url : ', urlCell.value);
      obj = await casamiaSsgCostCrawling(urlCell.value);
      if (!obj?.cost) continue;
      if (priceItem == '仕入原価（基本値段）') await priceIsUpdated(sheet, obj.cost, today, i);
      await sheet.saveUpdatedCells();
    }
  }
  await sheet.saveUpdatedCells();
}

//가격이 갱신되었을 경우, 가격을 갱신 후
async function priceIsUpdated(sheet, cost, today, i) {
  let priceCell = sheet.getCell(i + 1, 8); //仕入原価（基本値段）항목
  if (priceCell.value != Number(cost)) {
    priceCell.note =
      today.toLocaleDateString() +
      ' ' +
      priceCell.value +
      'won → ' +
      cost +
      'wonへ' +
      '値段変更があります。';
    priceCell.value = Number(cost);
    priceCell.backgroundColor = { green: 555 };
  }
}

//품절이 갱신되었을 경우, 품절을 갱신.
async function soldOutIsUpdated(sheet, obj, today, i) {
  let soldOutCell = sheet.getCell(i + 1, 7); //売り切れ항목

  if (!obj.soldOut.length) {
    soldOutCell.value = '';
    // soldOutCell.backgroundColor = { white: 555 };
  } else {
    let stringAppend = '';
    for (soldOutObject of obj.soldOut) {
      stringAppend += '売り切れ商品 : ' + soldOutObject.optionName1 + '\n';
    }
    soldOutCell.note = today.toLocaleDateString() + ' ' + '売り切れ商品があります。';
    soldOutCell.value = stringAppend;
    soldOutCell.backgroundColor = { red: 555 };
  }
}

module.exports.googleProfitSheet = googleProfitSheet;
