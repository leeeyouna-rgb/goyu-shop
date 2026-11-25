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
        '<div class="card__color">' + esc(p.color) + '</div>' +
        '<div class="card__price">' + fmtPrice(D.price) + '</div>' +
      '</a>';
    }).join('') : '<p class="empty">상품이 준비 중입니다.</p>';
  }

  // ── 상품 상세 ──
  function renderProduct() {
    var p = findProduct(params.get('id'));
    document.title = p.name + ' | goyu';
    var slide = 0, size = null, open = D.details[0].title;

    document.getElementById('p-name').textContent = p.name;
    document.getElementById('p-color').textContent = p.color;
    document.getElementById('p-price').textContent = fmtPrice(D.price);

    function drawSlide() {
      var s = D.slides[slide];
      var el = document.getElementById('slide');
      el.style.background = s.tint || p.tint;
      el.innerHTML = s.image ? '<img src="' + esc(s.image) + '" alt="' + esc(s.label) + '" style="width:100%;height:100%;object-fit:contain">' : esc(s.label);
      document.getElementById('slide-count').textContent = (slide + 1) + ' / ' + D.slides.length;
    }
    document.getElementById('prev').onclick = function () { slide = (slide + D.slides.length - 1) % D.slides.length; drawSlide(); };
    document.getElementById('next').onclick = function () { slide = (slide + 1) % D.slides.length; drawSlide(); };

    function drawAccordion() {
      document.getElementById('accordion').innerHTML = D.details.map(function (d, i) {
        var on = open === d.title;
        return '<div class="acc-item"><button type="button" data-i="' + i + '" aria-expanded="' + on + '"><span>' + d.title + '</span><span aria-hidden="true">' + (on ? '−' : '+') + '</span></button>' +
          (on ? '<div class="acc-body">' + esc(d.body) + '</div>' : '') + '</div>';
      }).join('');
    }
    document.getElementById('accordion').onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var t = D.details[+b.dataset.i].title;
      open = open === t ? null : t; drawAccordion();
    };

    function drawSizes() {
      document.getElementById('sizes').innerHTML = D.sizes.map(function (z) {
        return '<button type="button" data-z="' + z + '" aria-pressed="' + (size === z) + '">' + z + '</button>';
      }).join('');
      var sel = document.getElementById('selected');
      if (size) {
        sel.hidden = false;
        sel.innerHTML = '<span>' + esc(p.name) + ' / ' + size + '</span><span>1 · ' + fmtPrice(D.price) + '</span>';
      } else sel.hidden = true;
      document.getElementById('total').textContent = 'TOTAL ' + (size ? fmtPrice(D.price) + ' (1개)' : '0');
    }
    document.getElementById('sizes').onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      size = size === b.dataset.z ? null : b.dataset.z; drawSizes();
    };

    function needSize() {
      if (!size) { toast('사이즈를 선택해 주세요.'); return true; }
      return false;
    }
    document.getElementById('add-bag').onclick = function () {
      if (needSize()) return;
      var c = getCart(); c.push({ id: p.id, size: size }); setCart(c);
      toast('장바구니에 담았습니다.');
    };
    document.getElementById('buy-now').onclick = function () {
      if (needSize()) return;
      toast('결제 기능은 준비 중입니다.');
    };
    document.getElementById('npay').onclick = function () { toast('네이버페이는 준비 중입니다.'); };

    var others = products.filter(function (o) { return o.id !== p.id; })
      .sort(function (a, b) { return (b.cat === p.cat) - (a.cat === p.cat); }).slice(0, 4);
    document.getElementById('others').innerHTML = others.map(function (o) {
      return '<a href="product.html?id=' + o.id + '"><div class="thumb">' +
        (o.image ? '<img class="thumb__inner" src="' + esc(o.image) + '" alt="">' : '<div class="thumb__inner" style="background:' + o.tint + '"></div>') +
        '</div><span>' + esc(o.name) + '</span><span>' + fmtPrice(D.price) + '</span></a>';
    }).join('');

    drawSlide(); drawAccordion(); drawSizes();
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
