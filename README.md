# buyma order

## [notion link](https://www.notion.so/buyma-ad5fca580926462f9036506fe1fac290)


2021/08/08
개발 시작
- 개발 시작

2021/08/14
지불방식이 펀의점인 경우, 컬러 및 사이즈가 취득되지 않음.
- 지불방식이 펀의점인 경우, 테이블 행이 하나 더 생기기 때문에 분기로 수정

2021/09/18
지불방식이 銀行振込（ペイジー）인 경우, 컬러 및 사이즈가 제대로 취득되지 않음.
- 지불방식이 銀行振込（ペイジー）인 경우, 테이블 행이 하나 더 생기기 때문에 분기로 수정

2021/10/14 (2021/09/18 문제재해결)
지불방식에 따라 테이블 갯수가 달라져서, 주문일이 제대로 취득되지 않음.
- 분기로 지불방식에 따라 주문일이 제대로 처리될 수 있도록 수정.