/*
 * goyu 상품·사이트 데이터
 * 실제 정보가 정해지면 이 파일의 [대괄호] 값과 이미지 경로만 바꾸면 됩니다.
 * image: 비워두면 회색 자리표시 박스가 나오고, 'assets/xxx.png' 처럼 넣으면 그 사진이 나옵니다.
 */
window.GOYU = {
  coupons: ['SIGN UP GOYU · 3,000 KRW COUPON', 'GOYU KAKAO CHANNEL · 3,000 KRW COUPON'],

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
    { key: 'harness', label: 'Harness', name: '고유 하네스', en: 'goyu harness', features: '*어깨 움직임을 막지 않는 Y자 구조\n*머리를 넣고 버클만 채우면 되는 간편한 착용\n*앞으로 끌어당기는 힘을 줄여주는 설계\n*goyu가 직접 개발한 기능성 웨빙\n*몸의 곡선을 따라 둥글게 다듬은 goyu 오리지널 버클\n*오래 써도 변형이 적은 튼튼한 금속 부자재\n*goyu만의 시그니처 컬러 포인트', points: [['y','Y자 구조'],['easy','간편 착용'],['pull','당김 완화'],['web','기능성 웨빙'],['buckle','오리지널 버클'],['ring','금속 부자재']], cols: 3 },
    { key: 'collar', label: 'Collar', name: '고유 마틴게일 목줄', en: 'goyu martingale collar', features: '*당길 때만 부드럽게 조여지는 마틴게일 구조\n*목에 닿는 부담을 줄인 저자극 설계\n*머리가 쉽게 빠지지 않아 안정적인 산책\n*goyu가 직접 개발한 기능성 웨빙\n*목선을 따라 둥글게 다듬은 goyu 오리지널 버클\n*오래 써도 변형이 적은 튼튼한 금속 부자재\n*goyu만의 시그니처 컬러 포인트', points: [['loop','마틴게일 구조'],['soft','저자극 설계'],['shield','빠짐 방지'],['web','기능성 웨빙'],['buckle','오리지널 버클'],['ring','금속 부자재']], cols: 3 },
    { key: 'leash', label: 'Leash', name: '고유 리쉬 2.0', en: 'goyu leash 2.0', features: '*두 손이 자유로운 핸즈프리 사용\n*당김의 충격을 흡수해 손목을 지켜주는 EVA 폼 3중 쿠션 손잡이\n*엘리베이터·신호 대기처럼 짧게 잡아야 할 때 쓰는 보조 손잡이 (약 25cm)\n*밀어서 잠그는 이중 잠금 금속 고리\n*줄 꼬임을 막아주는 360° 회전 구조\n*goyu가 직접 개발한 기능성 웨빙\n*몸의 곡선을 따라 둥글게 다듬은 goyu 오리지널 버클\n*오래 써도 변형이 적은 튼튼한 금속 부자재\n*goyu만의 시그니처 컬러 포인트', points: [['hand','핸즈프리'],['cushion','쿠션 손잡이'],['short','보조 손잡이'],['hook','이중 잠금 고리'],['rotate','360° 회전'],['web','기능성 웨빙'],['buckle','오리지널 버클'],['ring','금속 부자재']], cols: 4 }
  ],

  // 컬러 (양면: main / inner). soon: true 는 coming soon 으로 표시
  colors: [
    { key: 'navy', en: 'NAVY', main: ['navy', '#213A6B'], inner: ['cool grey', '#C9CED6'], tint: '#E3E7ED' },
    { key: 'blue', en: 'BLUE', main: ['blue', '#418FDE'], inner: ['mint', '#A5DFD3'], tint: '#E2EEF8', soon: true },  // PMS 279 C / 572 C
    { key: 'pink', en: 'PINK', main: ['pink', '#FFB1BB'], inner: ['baby pink', '#FBE1E6'], tint: '#FCEBEE', soon: true }  // PMS 707 C / 698 C
  ],

  price: '[가격]', // 예: 39000 (숫자로 넣으면 자동으로 39,000원 표시)

  // goyu 카카오톡 채널 주소 (예: 'https://pf.kakao.com/_xxxxx')
  kakaoUrl: '',
  // goyu 인스타그램 주소 (지금은 사용하지 않음, 나중에 푸터 등에 쓸 수 있음)
  instagramUrl: 'https://www.instagram.com/goyu.dept/',

  sizes: ['S', 'M'],

  // 사이즈 가이드 (? 를 실제 제품 치수로 바꿔 주세요)
  sizeGuide: {
    harness: {
      rows: [['가슴둘레', '33~44cm', '40~51cm'], ['웨빙 폭', '25mm', '25mm'], ['무게', '73.9g', '76.6g'], ['권장 몸무게', '~7kg', '~15kg']],
      tip: 'S와 M 사이라면, 넉넉한 M을 고르시는 게 더 편안해요.'
    },
    collar: {
      rows: [['목둘레 (A)', '19~25cm', '22~28cm'], ['목둘레 (A+B)', '26~31cm', '28~34cm'], ['웨빙 폭', '25mm', '25mm'], ['무게', '34.5g', '53.6g'], ['권장 몸무게', '~8kg', '~13kg']],
      tip: '마틴게일은 딱 맞게! 실제 목둘레보다 2-3cm 작은 사이즈를 골라 주세요.'
    },
    leash: {
      rows: [['총길이', '2m', '2m'], ['웨빙 폭', '25mm', '25mm'], ['무게', '101g', '154g']],
      notes: '*표의 치수는 반려견이 아닌 제품을 잰 사이즈입니다.\n*재는 위치에 따라 1-2cm 정도 차이가 날 수 있습니다.'
    }
  },
  sizeNotes: '*표의 치수는 반려견이 아닌 제품을 잰 사이즈입니다.\n*권장 몸무게는 참고용이며, 체형에 따라 달라질 수 있습니다.\n*재는 위치에 따라 1-2cm 정도 차이가 날 수 있습니다.',

  // 상세 정보 > MODEL INFO (사진 경로와 ? 를 실제 값으로 바꿔 주세요)
  models: [
    { image: '', name: 'KAN', color: '?', size: '?', neck: '?', chest: '?', back: '?', weight: '?' },
    { image: '', name: 'MICCU', color: '?', size: '?', neck: '?', chest: '?', back: '?', weight: '?' },
    { image: '', name: 'KOI', color: '?', size: '?', neck: '?', chest: '?', back: '?', weight: '?' },
    { image: '', name: 'ONGSIM', color: '?', size: '?', neck: '?', chest: '?', back: '?', weight: '?' }
  ],

  details: [
    { title: 'PRODUCT INFO', body: '*goyu 로고를 짜 넣은 자가드 웨빙\n*[특징 2]\n*[특징 3]\n*[특징 4]' },
    { title: 'MATERIAL', body: '[소재 안내]\n*웨빙: 폴리에스터 100%\n*반사사: 폴리에스터 (유리비드 코팅)\n*버클: 플라스틱\n*D링: 금속' },
    { title: 'NOTICE', body: '[사이즈 측정 방법]\n\n[세탁 및 보관 안내]\n*중성세제를 푼 미온수에 부드럽게 손세탁해 주세요.\n*세탁기를 사용하실 경우 세탁망에 넣어 주시고, 처음 세탁하실 때는 다른 세탁물과 분리해 단독으로 세탁해 주세요.\n*건조기는 사용하지 마시고, 자연 건조해 주세요.\n*금속 부분은 물기를 닦아 보관하면 더 오래 사용하실 수 있습니다.' },
    { title: 'RETURN/EXCHANGE', body: '[배송 안내]\n*배송비 3,000원 (5만원 이상 구매 시 무료배송)\n*결제 완료 후 1-3일 이내에 출고됩니다. (주말·공휴일 제외)\n\n[교환·반품 안내]\n*상품을 받으신 날로부터 7일 이내에 신청해 주세요.\n*고객님의 단순 변심으로 교환·반품하실 경우 왕복 배송비 6,000원이 부과됩니다.\n*제주 및 도서·산간 지역은 추가 운임이 발생할 수 있습니다.\n*상품 불량이나 오배송의 경우 배송비는 goyu가 부담합니다.\n\n[교환·반품이 어려운 경우]\n*반려견이 착용하거나 사용한 흔적(털, 침, 냄새 등)이 있는 경우\n*택 제거, 세탁, 훼손 등으로 상품 가치가 떨어진 경우\n*상품 수령 후 7일이 지난 경우\n\n[구매 전 확인해 주세요]\n아래 내용은 제품 불량에 해당하지 않으니, 구매 전 상세 정보와 이미지를 함께 확인해 주세요.\n*화면 밝기나 모니터 환경에 따라 실제 색상과 조금 다르게 보일 수 있습니다.\n*봉제 마무리 과정에서 생긴 작은 실밥이나 재단 표시 자국이 남아 있을 수 있습니다.\n*제품마다 로고 패턴이 놓이는 위치가 조금씩 다를 수 있습니다.\n*제작·포장 과정에서 생긴 새 제품 냄새는 통풍이 잘 되는 곳에 두면 자연스럽게 사라집니다.\n\n[신청 방법]\n*goyu 카카오톡 채널로 주문번호와 사유를 남겨 주세요.' }
  ],

  slides: [
    { label: '[누끼 제품컷 — 정면]', image: '' },
    { label: '[누끼 제품컷 — 측면]', image: '' },
    { label: '[자가드 웨빙 패턴 클로즈업]', image: '', tint: '#E9EEF5' },
    { label: '[착용컷]', image: '', tint: '#EFE7DA' }
  ]
};
