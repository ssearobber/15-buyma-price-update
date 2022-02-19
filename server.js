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