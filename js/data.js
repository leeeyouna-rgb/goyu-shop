/*
 * goyu 상품·사이트 데이터
 * 실제 정보가 정해지면 이 파일의 [대괄호] 값과 이미지 경로만 바꾸면 됩니다.
 * image: 비워두면 회색 자리표시 박스가 나오고, 'assets/xxx.png' 처럼 넣으면 그 사진이 나옵니다.
 */
window.GOYU = {
  coupons: ['JOIN US 3,000WON COUPON', 'KAKAO CHANNEL 3,000WON COUPON'],

  footer: {
    line1: 'goyu(고유) · [사업장 주소] · [이메일]',
    line2: '[통신판매업 신고번호] · CEO [대표자명]'
  },

  // 메인 갤러리 (가로로 흐르는 사진)
  gallery: [
    { w: 400, bg: '#DCE6F2', label: '[산책 사진 1 — 하네스 착용컷]', image: '' },
    { w: 220, bg: '#EFE7DA', label: '[사진 2]', image: '' },
    { w: 540, bg: '#E3ECE4', label: '[사진 3 — 일상컷 가로]', image: '' },
    { w: 240, bg: '#F2E3E3', label: '[사진 4]', image: '' },
    { w: 420, bg: '#E6E2F0', label: '[사진 5 — 리쉬줄 디테일]', image: '' },
    { w: 300, bg: '#E9EEF5', label: '[사진 6]', image: '' }
  ],

  categories: [
    { key: 'harness', label: 'Harness', name: '고유 하네스' },
    { key: 'collar', label: 'Collar', name: '고유 마틴게일 목줄' },
    { key: 'leash', label: 'Leash', name: '고유 리쉬 2.0' }
  ],

  colors: [
    { key: 'a', en: 'COLOR A', ko: '[컬러명 A]', tint: '#DCE6F2' },
    { key: 'b', en: 'COLOR B', ko: '[컬러명 B]', tint: '#EFE7DA' },
    { key: 'c', en: 'COLOR C', ko: '[컬러명 C]', tint: '#E3ECE4' }
  ],

  price: '[가격]', // 예: 39000 (숫자로 넣으면 자동으로 39,000원 표시)

  sizes: ['XS', 'S', 'M', 'L'],

  details: [
    { title: 'PRODUCT INFO', body: '*goyu 로고를 짜 넣은 자가드 웨빙\n*[특징 2]\n*[특징 3]\n*[특징 4]' },
    { title: 'MATERIAL', body: '[소재 / 혼용률]\n[버클·D링 소재]' },
    { title: 'NOTICE', body: '[사이즈 측정 방법]\n[세탁 및 보관 안내]' },
    { title: 'RETURN/EXCHANGE', body: '[교환·반품 기간 및 배송비 안내]' }
  ],

  slides: [
    { label: '[누끼 제품컷 — 정면]', image: '' },
    { label: '[누끼 제품컷 — 측면]', image: '' },
    { label: '[자가드 웨빙 패턴 클로즈업]', image: '', tint: '#E9EEF5' },
    { label: '[착용컷]', image: '', tint: '#EFE7DA' }
  ]
};
