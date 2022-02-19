const { GoogleSpreadsheet } = require('google-spreadsheet');
const { smartStoreCrawling } = require('./smartStoreCrawling');

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
    // const sheet = doc.sheetsById[process.env.GOOGLE_PROFIT_SHEET_ID || googleProfitSheetId];
    const sheet = doc.sheetsById[process.env.GOOGLE_PROFIT_SHEET_TEST_ID];

    // rows 취득
    const rows = await sheet.getRows();

    // 해당 row번호, url을 취득
    let googleProfitObject = {}
    for (i = 1 ; i < rows.length ; i ++) {
        // 스마트 스토어 , m.스마트 스토어
        if (rows[i].productURL.match(/smartstore.naver.com/g)
            || rows[i].productURL.match(/m.smartstore.naver.com/g)) {
                smartStoreCrawling(rows[i].productURL);
            googleProfitObject.productURL = rows[i].productURL;
        }
        //shopping.naver
        if (rows[i].productURL.match(/shopping.naver.com/g)) {
            googleProfitObject.productURL = rows[i].productURL;
        }

    }
    
    return googleProfitObject;
}

module.exports.googleProfitSheet = googleProfitSheet;