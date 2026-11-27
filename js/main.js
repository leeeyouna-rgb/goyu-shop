(function () {
  var D = window.GOYU;
  var page = document.body.dataset.page;
  var params = new URLSearchParams(location.search);

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmtPrice(p) {
    return (typeof p === 'number' ? p.toLocaleString('ko-KR') : p) + '원';
  }

  // ── 상품 목록 (카테고리 × 컬러) ──
  var products = [];
  D.categories.forEach(function (cat) {
    D.colors.forEach(function (col) {
      products.push({
        id: cat.key + '-' + col.key,
        cat: cat.key,
        name: cat.name + ' (' + col.en + ')',
        en: cat.en,
        color: col.main[0] + ' / ' + col.inner[0],
        soon: !!col.soon,
        tint: col.tint,
        image: '' // 누끼컷 경로: 'assets/harness-a.png' 등
      });
    });
  });
  function findProduct(id) {
    return products.filter(function (p) { return p.id === id; })[0] || products[0];
  }

  // ── 장바구니 (브라우저 저장) ──
  function getCart() {
    try { return JSON.parse(localStorage.getItem('goyu-cart') || '[]'); } catch (e) { return []; }
  }
  function setCart(c) {
    try { localStorage.setItem('goyu-cart', JSON.stringify(c)); } catch (e) {}
    var el = document.getElementById('cart-count');
    if (el) el.textContent = c.length;
  }

  // ── 공통: 띠배너 · 헤더 · 푸터 ──
  function renderChrome() {
    var coupons = '';
    for (var i = 0; i < 12; i++) coupons += '<a href="#">' + esc(D.coupons[i % D.coupons.length]) + '</a>';
    var cur = params.get('cat');
    var cats = '<a href="shop.html"' + (page === 'shop' && !cur ? ' class="is-active"' : '') + '>All</a>' +
      D.categories.map(function (c) {
        return '<a href="shop.html?cat=' + c.key + '"' + (page === 'shop' && cur === c.key ? ' class="is-active"' : '') + '>' + c.label + '</a>';
      }).join('');

    document.getElementById('site-top').innerHTML =
      '<div class="marquee"><div class="marquee__track">' + coupons + '</div></div>' +
      '<header class="site-header">' +
        '<nav aria-label="카테고리">' + cats + '</nav>' +
        '<a class="logo" href="index.html" aria-label="goyu 홈"><img src="assets/logo.png" alt="goyu"></a>' +
        '<nav class="member" aria-label="회원 메뉴">' +
          '<a href="#">Login</a>' +
          '<a href="brand.html"' + (page === 'brand' ? ' class="is-active"' : '') + '>Story</a>' +
          '<a href="#">Mypage</a>' +
          '<a href="#" class="cart-link" aria-label="장바구니">' +
            '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 10.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1L21 8H6.2"/><circle cx="9.5" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/></svg>' +
            '<span class="cart-badge" id="cart-count">' + getCart().length + '</span></a>' +
        '</nav>' +
      '</header>';

    document.getElementById('site-footer').innerHTML =
      '<div class="footer-icons"><img class="footer-symbol" src="assets/favicon.png" alt="" width="36" height="36">' +
      (D.instagramUrl ? '<a class="footer-ig" href="' + esc(D.instagramUrl) + '" target="_blank" rel="noopener" aria-label="goyu 인스타그램 (새 창)">' +
        '<svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">' +
        '<g fill="#fff" stroke="#213A6B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="5" y="5" width="26" height="26" rx="8.5"/><circle cx="18" cy="18" r="6"/></g>' +
        '<circle cx="25.2" cy="10.8" r="1.9" fill="#213A6B"/></svg></a>' : '') + '</div>' +
      '<div>' + esc(D.footer.line1) + '</div>' +
      '<div>' + esc(D.footer.line2) + '</div>' +
      '<div class="links"><a href="#">AGREEMENT</a><a href="#">PRIVACY POLICY</a><a href="#">GUIDE</a><a href="#">[사업자정보확인]</a></div>';
  }

  function thumbInner(p, cls) {
    return p.image
      ? '<img class="' + cls + '" src="' + esc(p.image) + '" alt="' + esc(p.name) + '">'
      : '<div class="' + cls + '" style="background:' + p.tint + '">[누끼 제품컷]</div>';
  }

  // ── 메인 ──
  function renderMain() {
    var tiles = D.gallery.concat(D.gallery).map(function (t, i) {
      var style = 'width:' + t.w + 'px;background-color:' + t.bg + (t.image ? ';background-image:url(' + t.image + ')' : '');
      return '<a class="tile" href="shop.html" style="' + style + '"' + (i >= D.gallery.length ? ' aria-hidden="true" tabindex="-1"' : '') + '>' + (t.image ? '' : esc(t.label)) + '</a>';
    }).join('');
    document.getElementById('gallery').innerHTML = tiles;
    // 흐르는 goyu 로고도 전체 상품(All)으로
    var slogan = document.querySelector('.gallery-slogan');
    if (slogan) {
      slogan.classList.add('is-linked');
      slogan.addEventListener('click', function (e) {
        if (e.target.tagName === 'IMG') location.href = 'shop.html';
      });
    }
  }

  // ── 상품 목록 ──
  function renderShop() {
    var cat = params.get('cat');
    var list = cat ? products.filter(function (p) { return p.cat === cat; }) : products;
    document.getElementById('grid').innerHTML = list.length ? list.map(function (p) {
      return '<a class="card' + (p.soon ? ' is-soon' : '') + '" href="product.html?id=' + p.id + '">' +
        '<div class="thumb">' + thumbInner(p, 'thumb__inner') + '</div>' +
        '<div class="card__info">' +
          '<div class="card__name">' + esc(p.name) + '</div>' +
          '<div class="card__en">' + esc(p.en) + '</div>' +
          '<div class="card__price">' + (p.soon ? '<span class="card__soon">coming soon</span>' : fmtPrice(D.price)) + '</div>' +
        '</div>' +
      '</a>';
    }).join('') : '<p class="empty">상품이 준비 중입니다.</p>';
  }


  // 상세 포인트 아이콘 (선 그림)
  var ICONS = {
    y: '<path d="M8 6l8 10 8-10M16 16v11"/>',
    easy: '<rect x="5" y="10" width="22" height="12" rx="3"/><path d="M11.5 16l3 3 6-6"/>',
    pull: '<path d="M3 16h9M9 12l4 4-4 4M29 16h-9M23 12l-4 4 4 4"/>',
    web: '<rect x="4" y="9" width="24" height="14" rx="2"/><path d="M4 13.5h24M4 18.5h24"/>',
    buckle: '<rect x="3" y="9" width="13" height="14" rx="4"/><rect x="16" y="11" width="13" height="10" rx="2"/><path d="M21 14v4M25 14v4"/>',
    ring: '<path d="M11 7h6a9 9 0 0 1 0 18h-6z"/>',
    loop: '<circle cx="16" cy="16" r="8"/><path d="M2 16h5M5 14l2 2-2 2M30 16h-5M27 14l-2 2 2 2"/>',
    soft: '<path d="M16 26s-10-6-10-13a5 5 0 0 1 10-2 5 5 0 0 1 10 2c0 7-10 13-10 13z"/>',
    shield: '<path d="M16 4l10 4v7c0 6-4 11-10 13-6-2-10-7-10-13V8z"/><path d="M12 16l3 3 5-6"/>',
    hand: '<path d="M10 17V9a2 2 0 0 1 4 0v6M14 14V7a2 2 0 0 1 4 0v7M18 14V9a2 2 0 0 1 4 0v9c0 5-3 9-8 9-4 0-6-2-8-6l-2-4a2 2 0 0 1 3-2l3 3"/>',
    cushion: '<path d="M7 24c0-9 4-15 9-15s9 6 9 15M10.5 24c0-6.5 2.5-11 5.5-11s5.5 4.5 5.5 11"/>',
    short: '<path d="M3 23h26M11 23c0-6 2-9 5-9s5 3 5 9"/>',
    hook: '<path d="M12 5h8a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6h-8a6 6 0 0 1-6-6V11a6 6 0 0 1 6-6z"/><path d="M19 9v14"/>',
    rotate: '<path d="M25 11a10 10 0 1 0 1.5 8M25 4v7h-7"/>'
  };
  function pointsGrid(cat) {
    if (!cat.points) return '';
    return '<div class="pd-points pd-points--' + cat.cols + '">' + cat.points.map(function (pt) {
      return '<div class="pd-point"><svg aria-hidden="true" width="36" height="36" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[pt[0]] || '') + '</svg><span>' + esc(pt[1]) + '</span></div>';
    }).join('') + '</div>';
  }

  // 양면 컬러: 나중에 컬러가 늘면 이 목록에 추가
  var DUAL_COLORS = D.colors;
  function colorBlock() {
    var sw = DUAL_COLORS.map(function (c) {
      return '<span class="pd-dual-wrap">' + (c.soon ? '<span class="pd-colorinfo__soon">coming soon</span>' : '') + '<span class="pd-dual' + (c.soon ? ' is-soon' : '') + '" aria-hidden="true"><i style="background:' + c.main[1] + '"></i><i style="background:' + c.inner[1] + '"></i></span></span>';
    }).join('');
    var mains = DUAL_COLORS.map(function (c) { return '<span class="pd-colorinfo__val' + (c.soon ? ' is-soon' : '') + '">' + esc(c.main[0]) + '</span>'; }).join('');
    var inners = DUAL_COLORS.map(function (c) { return '<span class="pd-colorinfo__val' + (c.soon ? ' is-soon' : '') + '">' + esc(c.inner[0]) + '</span>'; }).join('');
    return '<div class="pd-colorinfo"><p class="pd-colorinfo__title">COLOR</p>' +
      '<div class="pd-colorinfo__grid" style="grid-template-columns:auto repeat(' + DUAL_COLORS.length + ',auto)">' +
      '<span class="pd-colorinfo__side">two<br>sided</span>' + sw +
      '<span class="pd-colorinfo__key">main</span>' + mains +
      '<span class="pd-colorinfo__key">inner</span>' + inners +
      '</div></div>';
  }


  function modelBlock() {
    if (!D.models) return '';
    return '<div class="pd-models"><p class="pd-colorinfo__title">MODEL INFO</p><div class="pd-models__grid">' +
      D.models.map(function (m) {
        return '<figure class="pd-model">' +
          (m.image ? '<img src="' + esc(m.image) + '" alt="모델 강아지">' : '<div class="pd-model__ph">[강아지 사진]</div>') +
          '<figcaption><strong class="pd-model__name">' + esc(m.name || '') + '</strong><span>color ' + esc(m.color) + ' / size ' + esc(m.size) + '</span>' +
          '<span>목둘레 ' + esc(m.neck) + ' / 가슴둘레 ' + esc(m.chest) + ' / 등길이 ' + esc(m.back) + ' / 몸무게 ' + esc(m.weight) + '</span></figcaption></figure>';
      }).join('') + '</div></div>';
  }

  // 사이즈 측정 위치 그림 (손그림 느낌: 테두리만 그리고 선을 살짝 흔들기)
  var INK = '#7F90AA';
  function band(tag, attrs, w) {
    return '<' + tag + ' ' + attrs + ' fill="none" stroke="' + INK + '" stroke-width="' + (w + 5) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<' + tag + ' ' + attrs + ' fill="none" stroke="#fff" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  function part(tag, attrs) {
    return '<' + tag + ' ' + attrs + ' fill="#fff" stroke="' + INK + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  function sketchSvg(id, label, drawing, marks) {
    return '<svg viewBox="0 0 480 270" role="img" aria-label="' + label + '">' +
      '<defs><filter id="' + id + '" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="3.5"/></filter></defs>' +
      '<g filter="url(#' + id + ')">' + drawing + '</g>' + marks + '</svg>';
  }
  var MARK = 'fill="none" stroke="#213A6B" stroke-width="3" stroke-dasharray="5 7" stroke-linecap="round"';
  var TXT = 'text-anchor="middle" font-size="18" font-weight="600" fill="#213A6B"';
  var MEASURE_SVG = {
    collar: sketchSvg('sk-collar', '마틴게일 목줄 측정 위치: 큰 고리 A는 목둘레, 작은 고리 B',
      band('ellipse', 'cx="200" cy="145" rx="140" ry="62"', 18) +
      band('ellipse', 'cx="365" cy="150" rx="52" ry="42"', 14) +
      part('rect', 'x="44" y="116" width="38" height="56" rx="8"') +
      part('rect', 'x="53" y="129" width="20" height="30" rx="3"') +
      '<circle cx="322" cy="111" r="9" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
      '<circle cx="322" cy="189" r="9" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M417 132h10a18 18 0 0 1 0 36h-10z" fill="none" stroke="' + INK + '" stroke-width="3.5"/>',
      '<ellipse cx="200" cy="145" rx="108" ry="40" ' + MARK + '/>' +
      '<ellipse cx="365" cy="150" rx="33" ry="25" ' + MARK + '/>' +
      '<text x="200" y="62" ' + TXT + '>A 목둘레</text><text x="405" y="92" ' + TXT + '>B</text>'),
    harness: sketchSvg('sk-harness', 'Y자 하네스 측정 위치: 가슴둘레',
      band('path', 'd="M188 104c0-32 18-62 52-62s52 30 52 62"', 18) +
      band('path', 'd="M188 104L92 214"', 18) +
      band('path', 'd="M292 104L388 214"', 18) +
      band('path', 'd="M240 104v118"', 18) +
      '<circle cx="240" cy="22" r="11" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
      part('rect', 'x="126" y="160" width="26" height="34" rx="4" transform="rotate(-48 139 177)"') +
      part('rect', 'x="326" y="160" width="26" height="34" rx="4" transform="rotate(48 339 177)"') +
      part('rect', 'x="221" y="148" width="38" height="48" rx="8"') +
      part('rect', 'x="231" y="160" width="18" height="24" rx="3"'),
      '<path d="M70 222C130 246 350 246 410 222" ' + MARK + '/>' +
      '<text x="240" y="266" ' + TXT + '>가슴둘레</text>'),
    leash: sketchSvg('sk-leash', '리쉬 측정 위치: 손잡이부터 고리까지 총길이',
      band('path', 'd="M410 95H170a55 55 0 1 0 0 110h210"', 18) +
      band('path', 'd="M170 132a18 18 0 1 0 18 18"', 9) +
      part('rect', 'x="258" y="76" width="44" height="38" rx="7"') +
      '<path d="M270 86v18M290 86v18" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/>' +
      part('rect', 'x="380" y="188" width="18" height="34" rx="3"') +
      '<path d="M398 205h16" stroke="' + INK + '" stroke-width="3.5"/>' +
      '<circle cx="428" cy="205" r="13" fill="none" stroke="' + INK + '" stroke-width="3.5"/>' +
      '<path d="M424 205a5 5 0 1 0 5-5" fill="none" stroke="' + INK + '" stroke-width="2.5"/>',
      '<path d="M100 245H440" ' + MARK + '/>' +
      '<text x="270" y="40" ' + TXT + '>총길이 2m</text>')
  };
  function sizeTable(cat) {
    var g = D.sizeGuide && D.sizeGuide[cat.key];
    if (!g) return '';
    var head = '<tr><th scope="col">SIZE</th>' + D.sizes.map(function (z) { return '<th scope="col">' + z + '</th>'; }).join('') + '</tr>';
    var body = g.rows.map(function (r) {
      return '<tr><th scope="row">' + esc(r[0]) + '</th>' + r.slice(1).map(function (v) { return '<td>' + esc(v) + '</td>'; }).join('') + '</tr>';
    }).join('');
    return '<table class="pd-size__table"><thead>' + head + '</thead><tbody>' + body + '</tbody></table>';
  }
  function sizeBlock(cat) {
    var g = D.sizeGuide && D.sizeGuide[cat.key];
    if (!g) return '';
    var head = '<tr><th scope="col">SIZE</th>' + D.sizes.map(function (z) { return '<th scope="col">' + z + '</th>'; }).join('') + '</tr>';
    var body = g.rows.map(function (r) {
      return '<tr><th scope="row">' + esc(r[0]) + '</th>' + r.slice(1).map(function (v) { return '<td>' + esc(v) + '</td>'; }).join('') + '</tr>';
    }).join('');
    return '<div class="pd-size" id="pd-size"><p class="pd-colorinfo__title">SIZE GUIDE</p>' +
      (MEASURE_SVG[cat.key] ? '<div class="pd-size__img pd-size__img--svg">' + MEASURE_SVG[cat.key] + '</div>' : '<div class="pd-size__img">[사이즈 측정 위치 이미지]</div>') +
      (g.tip ? '<p class="pd-size__pick"><span aria-hidden="true">⭐</span><strong>FIT NOTE</strong>' + esc(g.tip) + '</p>' : '') +
      '<table class="pd-size__table"><thead>' + head + '</thead><tbody>' + body + '</tbody></table>' +
      '<p class="pd-size__notes">' + esc((g.notes || D.sizeNotes).replace(/^\*/gm, '· ')) + '</p>' +
      '</div>';
  }

  function kakaoLink() {
    var url = D.kakaoUrl;
    return '<a class="pd-kakao" ' + (url ? 'href="' + esc(url) + '" target="_blank" rel="noopener"' : 'href="#" aria-disabled="true"') + '>' +
      '<span class="pd-kakao__icon" aria-hidden="true">💬</span>goyu 카카오톡 채널 바로가기' + (url ? '' : ' (주소 준비 중)') + '</a>';
  }

  // ── 상품 상세 ──
  function renderProduct() {
    var p = findProduct(params.get('id'));
    var cat = D.categories.filter(function (c) { return c.key === p.cat; })[0];
    var col = D.colors.filter(function (c) { return p.id === p.cat + '-' + c.key; })[0];
    document.title = p.name + ' | goyu';
    var slide = 0, size = null, qty = 1, tab = 0;

    var crumb = document.getElementById('crumb-cat');
    crumb.textContent = cat.label; crumb.href = 'shop.html?cat=' + cat.key;
    document.getElementById('pd-cat').textContent = cat.label;
    document.getElementById('pd-name').textContent = cat.name;
    document.getElementById('pd-en').textContent = cat.en;
    document.getElementById('pd-price').textContent = fmtPrice(D.price);
    document.getElementById('pd-color-name').textContent = col.en + ' (main ' + col.main[0] + ' / inner ' + col.inner[0] + ')' + (col.soon ? ' · coming soon' : '');

    // 이미지: 화살표로 한 장씩
    function drawGallery() {
      var sl = D.slides[slide];
      document.getElementById('pd-main').innerHTML = sl.image
        ? '<img src="' + esc(sl.image) + '" alt="' + esc(sl.label) + '">'
        : '<div class="pd-ph" style="background:' + (sl.tint || p.tint) + '">' + esc(sl.label) + '</div>';
      document.getElementById('pd-count').textContent = (slide + 1) + ' / ' + D.slides.length;
    }
    document.getElementById('prev').onclick = function () { slide = (slide + D.slides.length - 1) % D.slides.length; drawGallery(); };
    document.getElementById('next').onclick = function () { slide = (slide + 1) % D.slides.length; drawGallery(); };

    // 컬러: 같은 제품의 다른 컬러로 이동
    document.getElementById('pd-swatches').innerHTML = D.colors.map(function (c) {
      var on = c.key === col.key;
      return '<a href="product.html?id=' + p.cat + '-' + c.key + '" class="pd-swatch' + (on ? ' is-on' : '') + (c.soon ? ' is-soon' : '') + '"' + (on ? ' aria-current="true"' : '') + ' aria-label="' + c.en + (c.soon ? ' (coming soon)' : '') + '"><span style="background:linear-gradient(90deg,' + c.main[1] + ' 50%,' + c.inner[1] + ' 50%)"></span>' + (c.soon ? '<em class="pd-swatch__soon">soon</em>' : '') + '</a>';
    }).join('');

    // 사이즈 · 수량 · 합계
    function drawBuy() {
      document.getElementById('pd-sizes').innerHTML = D.sizes.map(function (z) {
        return '<button type="button" data-z="' + z + '" aria-pressed="' + (size === z) + '">' + z + '</button>';
      }).join('');
      document.getElementById('qty').textContent = qty;
      document.getElementById('qty-minus').disabled = qty <= 1;
      var total = typeof D.price === 'number' ? fmtPrice(D.price * qty) : fmtPrice(D.price) + ' × ' + qty;
      document.getElementById('pd-total').textContent = size ? total : '사이즈를 선택해 주세요';
    }
    document.getElementById('pd-sizes').onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      size = size === b.dataset.z ? null : b.dataset.z; drawBuy();
    };
    document.getElementById('qty-minus').onclick = function () { if (qty > 1) { qty--; drawBuy(); } };
    document.getElementById('qty-plus').onclick = function () { qty++; drawBuy(); };

    function needSize() {
      if (!size) { toast('사이즈를 선택해 주세요.'); return true; }
      return false;
    }
    document.getElementById('add-bag').onclick = function () {
      if (needSize()) return;
      var c = getCart();
      for (var i = 0; i < qty; i++) c.push({ id: p.id, size: size });
      setCart(c);
      toast('장바구니에 담았어요.');
    };
    document.getElementById('buy-now').onclick = function () { if (!needSize()) toast('결제 기능은 준비 중이에요.'); };
    document.getElementById('npay').onclick = function () { toast('네이버페이는 준비 중이에요.'); };

    // 상세 탭
    var tabs = [
      { title: '상세 정보', icon: '<img class="pd-tab-icon" src="assets/favicon.png" alt="">', body: cat.features || D.details[0].body },
      { title: '사이즈', icon: '📏', body: '' },
      { title: '소재·관리', icon: '🫧', body: D.details[1].body + '\n' + D.details[2].body.split('\n').slice(1).join('\n') },
      { title: '배송·교환', icon: '📦', body: D.details[3].body }
    ];
    function drawTabs() {
      document.getElementById('pd-tabs').innerHTML = tabs.map(function (t, i) {
        return '<button type="button" role="tab" id="pd-tab-' + i + '" data-i="' + i + '" aria-selected="' + (i === tab) + '"' + (i === 1 ? ' data-size' : '') + '><span class="pd-tab-emoji" aria-hidden="true">' + t.icon + '</span>' + t.title + '</button>';
      }).join('');
      var panel = document.getElementById('pd-panel');
      panel.setAttribute('aria-labelledby', 'pd-tab-' + tab);
      panel.innerHTML = '<div class="pd-panel__text">' + esc(tabs[tab].body.replace(/^\*/gm, '· ')) + '</div>' + (tab === 0 ? pointsGrid(cat) + colorBlock() + modelBlock() + sizeBlock(cat) : tab === 1 ? sizeBlock(cat) : tab === 3 ? kakaoLink() : '');
    }
    document.getElementById('pd-tabs').onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      tab = +b.dataset.i; drawTabs();
    };
    // 사이즈 가이드: 작은 사이즈표 팝업
    var sizeLink = document.querySelector('a[href="#pd-size"]');
    var pop = document.createElement('div');
    pop.className = 'pd-sizepop'; pop.id = 'pd-sizepop'; pop.hidden = true;
    pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', '사이즈표');
    pop.innerHTML = '<div class="pd-sizepop__head"><strong>SIZE GUIDE</strong><button type="button" class="pd-sizepop__close" aria-label="닫기">×</button></div>' + sizeTable(cat);
    sizeLink.parentNode.parentNode.appendChild(pop);
    sizeLink.setAttribute('aria-controls', 'pd-sizepop'); sizeLink.setAttribute('aria-expanded', 'false');
    function setPop(open) { pop.hidden = !open; sizeLink.setAttribute('aria-expanded', String(open)); }
    sizeLink.onclick = function (e) { e.preventDefault(); e.stopPropagation(); setPop(pop.hidden); };
    pop.querySelector('.pd-sizepop__close').onclick = function () { setPop(false); sizeLink.focus(); };
    pop.onclick = function (e) { e.stopPropagation(); };
    document.addEventListener('click', function (e) { if (!pop.hidden && !e.composedPath().some(function (el) { return el.id === 'pd-sizes'; })) setPop(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pop.hidden) { setPop(false); sizeLink.focus(); } });

    // 세트 상품: 같은 컬러의 나머지 두 제품
    var setOrder = { harness: ['collar', 'leash'], collar: ['harness', 'leash'], leash: ['collar', 'harness'] }[p.cat];
    document.getElementById('pd-set').innerHTML = setOrder.map(function (k) {
      var o = findProduct(k + '-' + col.key);
      var oc = D.categories.filter(function (c) { return c.key === k; })[0];
      return '<a class="pd-set__item" href="product.html?id=' + o.id + '">' +
        '<div class="pd-set__img">' + (o.image ? '<img src="' + esc(o.image) + '" alt="">' : '<div style="background:' + o.tint + '"></div>') + '</div>' +
        '<div class="pd-set__text"><strong>' + esc(oc.name) + '</strong><span class="pd-set__en">' + esc(oc.en) + '</span><span>' + col.en + '</span><span>' + fmtPrice(D.price) + '</span></div></a>';
    }).join('');

    if (col.soon) {
      // 출시 전 컬러: 구매 대신 출시 알림 받기 (카카오톡 채널)
      var npay = document.getElementById('npay'); npay.disabled = true; npay.onclick = null;
      var acts = document.querySelector('.pd-actions');
      acts.classList.add('is-notify');
      acts.innerHTML = D.kakaoUrl
        ? '<a class="pd-btn pd-btn--fill pd-notify" href="' + esc(D.kakaoUrl) + '" target="_blank" rel="noopener">COMING SOON · NOTIFY ME</a>'
        : '<button type="button" class="pd-btn pd-btn--fill pd-notify" id="notify">COMING SOON · NOTIFY ME</button>';
      var nb = document.getElementById('notify');
      if (nb) nb.onclick = function () { toast('출시 알림은 곧 카카오톡 채널로 받을 수 있어요.'); };
    }
    drawGallery(); drawBuy(); drawTabs();
  }

  var toastTimer;
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('is-show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('is-show'); }, 1800);
  }

  renderChrome();
  if (page === 'main') renderMain();
  if (page === 'shop') renderShop();
  if (page === 'product') renderProduct();
})();
