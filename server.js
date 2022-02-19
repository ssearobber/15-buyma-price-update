const { googleProfitSheet } = require('./targetURLs/googleProfitSheet');
require('dotenv').config();

// 비동기용 asyncForEach 함수 생성
Array.prototype.asyncForEach = async function (callback) {
	for (let index = 0; index < this.length; index++) {
		await callback(this[index], index, this);
	}
};

// 해당 스마트스토어의 가격을 크롤링
try {
  googleProfitSheet();
} catch (error) {
  console.log(error);
}



// then(transactionIDArray => 
//   {
//     // 受注가 없다면 프로그램 종료
//     if (transactionIDArray.length === 0) process.exit();

//     // 구글 스프레드 시트(利益計算)에서  url
//     transactionIDArray.asyncForEach(async (transactionIDObject) => {

//       await googleOrderSheet(transactionIDObject.productURL);
//     })
//   }).catch(e => console.log(e));
// smartStorePriceCrawling();