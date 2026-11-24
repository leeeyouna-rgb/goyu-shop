# goyu 자사몰

goyu(고유) 자사몰 정적 사이트입니다. GitHub Pages로 바로 배포됩니다.

## 페이지
- `index.html` — 메인 (쿠폰 띠배너 + 흐르는 사진 갤러리)
- `shop.html` — 상품 목록 (`?cat=harness|collar|leash` 로 카테고리 필터)
- `product.html?id=harness-a` — 상품 상세 (이미지 슬라이더, 정보 아코디언, 사이즈 선택, 장바구니)
- `brand.html` — 브랜드 소개

## 내용 바꾸기
- 상품명·컬러·가격·상세 문구·갤러리 사진: `js/data.js`
- 브랜드 문구: `brand.html`
- 사진은 `assets/` 폴더에 넣고 `data.js`의 `image` 값에 경로를 적으면 자리표시 박스 대신 표시됩니다.
- `[대괄호]` 로 된 부분은 실제 정보로 바꿔야 하는 자리입니다.

## 로컬에서 보기
```bash
python3 -m http.server 8000
```
→ http://localhost:8000
