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
        color: col.ko,
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
      '<img class="footer-symbol" src="assets/favicon.png" alt="" width="36" height="36">' +
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
  }

  // ── 상품 목록 ──
  function renderShop() {
    var cat = params.get('cat');
    var list = cat ? products.filter(function (p) { return p.cat === cat; }) : products;
    document.getElementById('grid').innerHTML = list.length ? list.map(function (p) {
      return '<a class="card" href="product.html?id=' + p.id + '">' +
        '<div class="thumb">' + thumbInner(p, 'thumb__inner') + '</div>' +
        '<div class="card__name">' + esc(p.name) + '</div>' +
        '<div class="card__en">' + esc(p.en) + '</div>' +
        '<div class="card__color">' + esc(p.color) + '</div>' +
        '<div class="card__price">' + fmtPrice(D.price) + '</div>' +
      '</a>';
    }).join('') : '<p class="empty">상품이 준비 중입니다.</p>';
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
    document.getElementById('pd-color-name').textContent = col.en + ' · ' + col.ko;

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
      return '<a href="product.html?id=' + p.cat + '-' + c.key + '" class="pd-swatch' + (on ? ' is-on' : '') + '"' + (on ? ' aria-current="true"' : '') + ' aria-label="' + c.en + ' ' + esc(c.ko) + '"><span style="background:' + c.tint + '"></span></a>';
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
      { title: '상세 정보', body: D.details[0].body },
      { title: '사이즈', body: '[사이즈표 — S · M 별 가슴둘레·목둘레 범위]\n\n' + D.details[2].body.split('\n')[0] },
      { title: '소재·관리', body: D.details[1].body + '\n' + D.details[2].body.split('\n').slice(1).join('\n') },
      { title: '배송·교환', body: D.details[3].body }
    ];
    function drawTabs() {
      document.getElementById('pd-tabs').innerHTML = tabs.map(function (t, i) {
        return '<button type="button" role="tab" id="pd-tab-' + i + '" data-i="' + i + '" aria-selected="' + (i === tab) + '"' + (i === 1 ? ' data-size' : '') + '>' + t.title + '</button>';
      }).join('');
      var panel = document.getElementById('pd-panel');
      panel.setAttribute('aria-labelledby', 'pd-tab-' + tab);
      panel.textContent = tabs[tab].body.replace(/^\*/gm, '· ');
    }
    document.getElementById('pd-tabs').onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      tab = +b.dataset.i; drawTabs();
    };
    document.querySelector('a[href="#pd-size"]').onclick = function (e) {
      e.preventDefault(); tab = 1; drawTabs();
      document.getElementById('pd-tabs').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // 세트 상품: 같은 컬러의 나머지 두 제품
    var setOrder = { harness: ['collar', 'leash'], collar: ['harness', 'leash'], leash: ['collar', 'harness'] }[p.cat];
    document.getElementById('pd-set').innerHTML = setOrder.map(function (k) {
      var o = findProduct(k + '-' + col.key);
      var oc = D.categories.filter(function (c) { return c.key === k; })[0];
      return '<a class="pd-set__item" href="product.html?id=' + o.id + '">' +
        '<div class="pd-set__img">' + (o.image ? '<img src="' + esc(o.image) + '" alt="">' : '<div style="background:' + o.tint + '"></div>') + '</div>' +
        '<div class="pd-set__text"><strong>' + esc(oc.name) + '</strong><span class="pd-set__en">' + esc(oc.en) + '</span><span>' + col.en + '</span><span>' + fmtPrice(D.price) + '</span></div></a>';
    }).join('');

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
