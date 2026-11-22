(function () {
  var CFG = window.GURURI_CONFIG || {};
  var I18N = window.GURURI_I18N || { lang: 'ja', t: function (k) { return k; }, word: function (w) { return w; } };
  function T(k, v) { return I18N.t(k, v); }
  function W(w) { return I18N.word(w); }

  if (CFG.showWazanohito === true) document.documentElement.classList.add('show-waza');
  // config.js のリンク先を、data-link="..." のついたリンクに入れる
  document.querySelectorAll('[data-link]').forEach(function (a) {
    var url = CFG[a.getAttribute('data-link')];
    if (url) a.href = url;
  });

  // 「掲載について」ページ：数字で見るぐるり（config.js の joinStats.show が true のときだけ出す）
  var stats = document.getElementById('jn-stats'), JS = CFG.joinStats || {};
  if (stats && JS.show === true) {
    stats.querySelectorAll('[data-stat]').forEach(function (el) { var v = JS[el.getAttribute('data-stat')]; if (v) el.textContent = v; });
    stats.hidden = false;
  }
  // 「掲載を申し込む」が押された回数を GA4 で数える（イベント名 join_click）
  document.querySelectorAll('[data-track]').forEach(function (a) {
    a.addEventListener('click', function () {
      try { if (typeof gtag === 'function') gtag('event', a.getAttribute('data-track'), { link_url: a.href, page: document.body.getAttribute('data-page') || '' }); } catch (e) {}
    });
  });


  /* ───── 協賛（2026-11-21、2026-11-22 改：プラン・業種・上限・計測の印） ─────
     config.js の sponsors に1社1行。
       plan "support"＝応援（ページ下の「ぐるりを応援してくれている会社」の欄だけ）
       plan "card"   ＝応援＋協賛カード（応援の欄にも自動で載り、お店一覧の中の協賛カードにも出る）
       （古い書き方の slot "A" は support、slot "B" は card として扱う）
     協賛カードは、同時に CFG.sponsorCardMax 社まで（今は2社）・同じ業種（category）は1社まで。
       超えたときは config.js の上に書いてある会社から順に出し、残りはカードに出さない（応援の欄には出る）。
       気づけるように、ブラウザの開発者向けの表示に注意を出し、URLの末尾に ?check=sponsors を付けて開くと、画面の上にも出す。
     リンクには、ぐるりから来たことが分かる印（utm_source=gururi&utm_medium=sponsor、欄かカードかを utm_content）を自動で付ける。
     開始日より前・終了日のあとは出さない。0社なら枠ごと出さない。
     編集の独立：協賛していても、掲載店の並び順・紹介・表示は変えない。お店のカードに広告の印は付けない。
     計測：sponsor_view（枠が画面の半分以上に入ったとき、1回の表示につき1回）／sponsor_click。パラメータ sponsor_name・slot（A／B）・position（カードの何番目の枠か） */
  var SP_MAX = { A: 40, B: 80 };   // ひとことの文字数の目安（超えた分は、Aは3行・Bは4行で「…」に）
  var SP_CARD_MAX = Number(CFG.sponsorCardMax) > 0 ? Number(CFG.sponsorCardMax) : 2;
  var spIssues = [];
  function spEsc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function spToday() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function spPlan(s) {
    var p = String(s.plan || '').toLowerCase();
    if (p === 'card' || p === 'support') return p;
    return String(s.slot || 'A').toUpperCase() === 'B' ? 'card' : 'support';
  }
  // 期間内の協賛者（config.js に書いた順）
  var spAll = (Array.isArray(CFG.sponsors) ? CFG.sponsors : []).filter(function (s) {
    var today = spToday();
    if (!s || !s.name) return false;
    if (s.start && today < String(s.start)) return false;
    if (s.end && today > String(s.end)) return false;
    return true;
  });
  // 協賛カードに出す会社：上限と、同じ業種は1社まで
  var spCards = (function () {
    var out = [], cats = {};
    spAll.filter(function (s) { return spPlan(s) === 'card'; }).forEach(function (s) {
      var cat = String(s.category || '').trim();
      if (!cat) spIssues.push('「' + s.name + '」の業種（category）が空です。同じ業種の確認ができません。');
      if (cat && cats[cat]) { spIssues.push('協賛カードで同じ業種「' + cat + '」が重なっています：「' + cats[cat] + '」と「' + s.name + '」。カードには「' + cats[cat] + '」だけを出し、「' + s.name + '」は応援の欄だけに出しています。'); return; }
      if (out.length >= SP_CARD_MAX) { spIssues.push('協賛カードの上限（' + SP_CARD_MAX + '社）を超えています。「' + s.name + '」はカードに出さず、応援の欄だけに出しています。'); return; }
      if (cat) cats[cat] = s.name;
      out.push(s);
    });
    return out;
  })();
  if (spIssues.length) {
    if (window.console) spIssues.forEach(function (m) { console.warn('【ぐるり協賛】' + m); });
    if (/[?&]check=sponsors\b/.test(location.search)) (function (fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); })(function () {
      var bar = document.createElement('div');
      bar.setAttribute('role', 'alert');
      bar.style.cssText = 'position:sticky;top:0;z-index:999;background:#FFF3CD;color:#5A4300;border-bottom:2px solid #E0B200;padding:12px 16px;font-size:14px;line-height:1.7';
      bar.innerHTML = '<b>協賛の設定の確認</b><br>' + spIssues.map(spEsc).join('<br>');
      document.body.insertBefore(bar, document.body.firstChild);
    });
  } else if (/[?&]check=sponsors\b/.test(location.search) && window.console) {
    console.info('【ぐるり協賛】設定に問題はありません（応援の欄 ' + spAll.length + '社・協賛カード ' + spCards.length + '社）');
  }
  function spActive(slot) { return slot === 'B' ? spCards.slice() : spAll.slice(); }
  // リンクに、ぐるりから来たことが分かる印を付ける（すでに utm_source があるときは、そのまま）
  function spUrl(url, slot) {
    url = String(url || '');
    if (!/^https?:\/\//i.test(url) || /[?&]utm_source=/i.test(url)) return url;
    var hash = '', i = url.indexOf('#');
    if (i >= 0) { hash = url.slice(i); url = url.slice(0, i); }
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'utm_source=gururi&utm_medium=sponsor&utm_content=' + (slot === 'B' ? 'card' : 'support') + hash;
  }
  function spText(s, slot) {
    var t = slot === 'B' && s.cardText ? s.cardText : s.text;   // カードのひとことは cardText（なければ応援の欄と同じ text）
    if (t && typeof t === 'object') t = t[I18N.lang] || t.ja || '';   // 訳がなければ、どの言語の画面でも日本語
    t = String(t || '');
    if (t.length > SP_MAX[slot] && window.console) console.warn('協賛のひとことが長めです（' + s.name + '：' + t.length + '文字。目安は' + SP_MAX[slot] + '文字）');
    return t;
  }
  function spMark(s, cls) {
    if (s.logo) return '<span class="' + cls + ' has-logo"><img src="' + spEsc(s.logo) + '" alt="" loading="lazy"></span>';
    var n = String(s.name).replace(/^(株式会社|有限会社|合同会社|一般社団法人|医療法人(社団|財団)?|社会福祉法人)\s*|[（(][株有][）)]\s*/g, '').replace(/^[〇○◯\s]+/, '');
    return '<span class="' + cls + '" aria-hidden="true">' + spEsc(n.charAt(0)) + '</span>';
  }
  function spLink(s, slot, label, cls, pos) {
    return '<a class="' + cls + '" href="' + spEsc(spUrl(s.url, slot)) + '" target="_blank" rel="noopener sponsored" data-sp="' + spEsc(s.name) + '" data-slot="' + slot + '"' + (pos ? ' data-pos="' + pos + '"' : '') + '>' + spEsc(label) +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg></a>';
  }
  var spSeen = {}, spIO = null;
  function spGa(ev, el) {
    var p = { sponsor_name: el.getAttribute('data-sp'), slot: el.getAttribute('data-slot') };
    if (el.getAttribute('data-pos')) p.position = Number(el.getAttribute('data-pos'));   // 案Bの何番目の枠か（1＝最初の12枚の中）
    try { if (typeof gtag === 'function') gtag('event', ev, p); } catch (e) {}
  }
  function spWatch(root) {
    root.querySelectorAll('[data-sp-box]').forEach(function (el) {
      if (!('IntersectionObserver' in window)) return;
      if (!spIO) spIO = new IntersectionObserver(function (es) {
        es.forEach(function (x) {
          if (!x.isIntersecting) return;
          var k = x.target.getAttribute('data-slot') + '|' + x.target.getAttribute('data-sp') + '|' + (x.target.getAttribute('data-pos') || '');
          spIO.unobserve(x.target);
          if (spSeen[k]) return; spSeen[k] = true; spGa('sponsor_view', x.target);
        });
      }, { threshold: 0.5 });
      spIO.observe(el);
    });
  }
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[data-sp]'); if (a) spGa('sponsor_click', a); });
  var spOrderA = null;
  // 案A：ぐるりを応援してくれている会社
  function spRenderA() {
    var box = document.getElementById('sp-a'); if (!box) return;
    if (!spOrderA) spOrderA = spShuffle(spActive('A'));   // 並びは訪問ごとにランダム（左上ばかり目立たないように）
    var list = spOrderA;
    box.hidden = !list.length;
    if (!list.length) { box.innerHTML = ''; return; }
    box.innerHTML = '<div class="spa-in"><div class="spa-hd"><span class="sp-pr">' + spEsc(T('sp.label')) + '</span>' +
      '<h2 id="sp-a-title">' + T('sp.a.h') + '</h2><p>' + T('sp.a.p') + '</p></div><ul class="spa-grid">' +
      list.map(function (s) {
        return '<li class="spa-c" data-sp-box data-sp="' + spEsc(s.name) + '" data-slot="A">' + spMark(s, 'sp-mark') +
          '<div class="spa-tx"><h3>' + spEsc(s.name) + '</h3>' + (spText(s, 'A') ? '<p class="spa-msg">' + spEsc(spText(s, 'A')) + '</p>' : '') +
          (s.url ? spLink(s, 'A', T('sp.link'), 'sp-link') : '') + '</div></li>';
      }).join('') + '</ul></div>';
    spWatch(box);
  }
  // 案B：一覧の中の協賛カード（2026-11-21 改：12枚ずつのまとまりごとに1枠。「もっと見る」で枠も増える）
  // 1回の訪問（ページを開くたび）に、協賛者の並びをランダムに入れ替え、上の枠から順に1社ずつ入れる。
  // 同じ訪問の中で同じ協賛者は2回出ない。協賛者が枠より少ないときは、残りの枠はお店のカードになる。
  var spOrderB = null;
  function spShuffle(arr) { arr = arr.slice(); for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
  function spListB() { if (!spOrderB) spOrderB = spShuffle(spActive('B')); return spOrderB; }
  function spCardB(s, pos) {
    return '<article class="spb" data-sp-box data-sp="' + spEsc(s.name) + '" data-slot="B" data-pos="' + pos + '" aria-label="' + spEsc(T('sp.label')) + '">' +
      '<div class="spb-pic">' + spMark(s, 'spb-mark') + '<span class="sp-pr">' + spEsc(T('sp.label')) + '</span></div>' +
      '<div class="spb-body"><p class="spb-kick">' + T('sp.b.kick') + '</p><h3>' + spEsc(s.name) + '</h3>' +
      (spText(s, 'B') ? '<p class="spb-msg">' + spEsc(spText(s, 'B')) + '</p>' : '') +
      (s.url ? spLink(s, 'B', T('sp.link'), 'spb-btn', pos) : '') + '</div></article>';
  }
  spRenderA();
  document.addEventListener('gururi:lang', spRenderA);

  var grid = document.getElementById('shop-grid');
  if (!grid) return;

  var GENRES = ['パン・お菓子', '食事・カフェ', '雑貨・ギフト', '教室・体験', '暮らし'];
  /* ───────── 一覧の並び順（2026-11-14・G決定：案1と案2の組み合わせ） ─────────
     1. 新着・更新のお店がいちばん上（その中では飲食系が先、あとは新しい日付の順）
     2. 先頭は飲食系：飲食系の軒数の半分（多くても6軒＝パソコンの最初の2段）。新着・更新の飲食系も数に入れる
     3. そのあとは、上ほど飲食系がやや多く、下ほど少なくなるように、なだらかに混ぜる
        （全体では、飲食系の割合はだいたい掲載店の割合どおり）
     同じ種類のお店どうしの順は「月替わりのくじ」。同じ月なら同じ並びで、毎月1日に入れ替わる（更新の公開と同じ日）
     ※ 2026-11-14 から：ふだんはシートの「並び順」タブの順（公開用の「並び順」の列の番号）で並べる。
        毎月1日に、受付のスクリプトが下と同じルールで並び順タブを並べ替え、手で直すときはタブの行をドラッグする。
        下の自動の並びは、「並び順」の列がまだないときの予備 */
  var TOP_GENRES = ['パン・お菓子', '食事・カフェ'];
  var LEAD_MAX = 6;       // 先頭に並べる飲食系の上限
  var GRADIENT = 0.2;     // なだらかさ：上の端で＋20%、下の端で－20%
  function isTop(s) { return TOP_GENRES.indexOf(s.genre) >= 0; }
  function monthRandom() {
    var d = new Date(), seed = d.getFullYear() * 100 + (d.getMonth() + 1);
    return function () {   // mulberry32
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function orderShops(list) {
    // 「並び順」の番号があれば、その順（番号のないお店は上に。並び順タブに入れ忘れたお店に気づけるように）
    if (list.some(function (s) { return s.order; })) {
      return list.map(function (s, i) { return { s: s, i: i }; }).sort(function (a, b) {
        return (a.s.order || 0) - (b.s.order || 0) || a.i - b.i;
      }).map(function (x) { return x.s; });
    }
    // お店ごとのくじの値（同じ月は同じ値。シートの並びに左右されないよう、店名の順で配る）
    var allFood = list.filter(isTop).length;
    var rnd = monthRandom(), key = {};
    list.map(function (s) { return s.name; }).slice().sort().forEach(function (n) { key[n] = rnd(); });
    var byKey = function (a, b) { return key[b.name] - key[a.name]; };

    var fresh = list.filter(isFresh).sort(function (a, b) {
      if (isTop(a) !== isTop(b)) return isTop(a) ? -1 : 1;
      if (a.freshDate.getTime() !== b.freshDate.getTime()) return b.freshDate - a.freshDate;
      return byKey(a, b);
    });
    var food = list.filter(function (s) { return !isFresh(s) && isTop(s); }).sort(byKey);
    var other = list.filter(function (s) { return !isFresh(s) && !isTop(s); }).sort(byKey);
    var out = fresh.slice();

    // 先頭の飲食系
    var lead = Math.min(Math.ceil(allFood / 2), LEAD_MAX) - fresh.filter(isTop).length;
    while (lead-- > 0 && food.length) out.push(food.shift());

    // 残りを、上ほど飲食系が多めになるように混ぜる
    var M = food.length + other.length, r = M ? food.length / M : 0, want = 0, placed = 0;
    for (var i = 0; i < M; i++) {
      var p = r + GRADIENT * (1 - 2 * (i + 0.5) / M);
      want += Math.max(0, Math.min(1, p));
      var takeFood = food.length && (!other.length || placed < Math.round(want));
      if (takeFood) { out.push(food.shift()); placed++; } else out.push(other.shift());
    }
    return out;
  }
  var STYLE = {
    'パン・お菓子': { bg: '#E4B54A', fg: '#3A2A24', icon: 'bread' },
    '食事・カフェ': { bg: '#D46A3C', fg: '#FFFFFF', icon: 'cup' },
    '雑貨・ギフト': { bg: '#5E9A4E', fg: '#FFFFFF', icon: 'bag' },
    '教室・体験': { bg: '#8DB4D4', fg: '#3A2A24', icon: 'brush' },
    '暮らし': { bg: '#EFE3D0', fg: '#3A2A24', icon: 'home' }
  };
  var ICONS = {
    bread: '<path d="M4 11.5C4 7.5 7.6 5 12 5s8 2.5 8 6.5c0 1.1-.7 2-1.6 2.3V19H5.6v-5.2C4.7 13.5 4 12.6 4 11.5z"/><path d="M9 8.5l1 2M12 8l0 2.3M15 8.5l-1 2"/>',
    cup: '<path d="M4 10h12v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 3.5c0 1.3 1 1.3 1 2.8M12 3.5c0 1.3 1 1.3 1 2.8"/><path d="M3 21h15"/>',
    bag: '<path d="M5 9h14l-1.2 11H6.2z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/><path d="M9 13h6"/>',
    brush: '<path d="M14 4l6 6-9 9H5v-6z"/><path d="M12 6l6 6"/><path d="M5 19l-1.5 1.5"/>',
    home: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>'
  };
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

  var state = { genre: 'all', area: 'all', q: '', coupon: false };

  // キーワード検索：全角・半角、大文字・小文字、ひらがな・カタカナの違いは同じとみなす。空白で区切ると「すべてを含む」お店
  function fold(t) {
    return String(t || '').normalize('NFKC').toLowerCase()
      .replace(/[\u30a1-\u30f6]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); });
  }
  function words(q) { return fold(q).split(/[\s　]+/).filter(Boolean); }
  function haystack(s) {
    if (s._hay) return s._hay;
    var parts = [s.name, s.sub, s.kind, s.genre, s.city, s.text, s.info.join(' '), s.tag, s.abroadNote, s.coupon ? s.couponGift : ''];
    ['en', 'ko', 'zh'].forEach(function (lg) {
      var t = s.tr && s.tr[lg]; if (!t) return;
      parts.push(t.name, t.sub, t.kind, t.text, t.info, t.abroadNote);
    });
    // ジャンル・市・札・リンク名・お店の名前の訳（i18n.js）も、4つの言語で探せるようにする
    parts.push(W(s.genre), W(s.city), W(s.tag));
    if (I18N.allWords) parts.push(I18N.allWords([s.genre, s.city, s.tag]));
    if (I18N.allNames) parts.push(I18N.allNames(s.name));
    s.links.forEach(function (l) { parts.push(l.label); });
    s._hay = fold(parts.filter(Boolean).join(' '));
    return s._hay;
  }
  function matchQ(s, ws) {
    if (!ws.length) return true;
    var h = haystack(s);
    return ws.every(function (w) { return h.indexOf(w) >= 0; });
  }
  var shops = [];

  // CSV（改行やカンマを含むセルにも対応）
  function parseCSV(text) {
    var rows = [], row = [], cell = '', q = false;
    text = text.replace(/^﻿/, '');
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }

  /* ───────── 新着・更新 ─────────
     公開した日から FRESH_DAYS 日のあいだ、カードの写真に小さな札を付け、一覧の上の方に並べる */
  var FRESH_DAYS = 30;
  function freshKind(v) {
    if (/新着|新規|^new$/i.test(v)) return 'new';
    if (/更新|^update/i.test(v)) return 'upd';
    return '';
  }
  function parseDay(v) {
    var m = String(v || '').match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
    return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
  }
  function isFresh(s) {
    if (!s.fresh || !s.freshDate) return false;
    var days = (Date.now() - s.freshDate.getTime()) / 86400000;
    return days >= -1 && days < FRESH_DAYS;
  }

  function toShops(rows) {
    var head = rows.shift().map(function (h) { return h.trim(); });
    var col = function (r, name) { var i = head.indexOf(name); return i < 0 ? '' : (r[i] || '').trim(); };
    return rows.filter(function (r) {
      return col(r, '店名') && col(r, '公開') !== '非公開' && col(r, '公開') !== 'FALSE';
    }).map(function (r) {
      var links = [];
      [1, 2, 3].forEach(function (n) {
        var u = col(r, 'リンク' + n + 'のURL');
        if (u) links.push({ label: col(r, 'リンク' + n + 'の名前') || 'くわしく見る', url: u });
      });
      var genre = col(r, 'ジャンル');
      return {
        name: col(r, '店名'), sub: col(r, 'サブ名'), genre: STYLE[genre] ? genre : '暮らし',
        kind: col(r, '種類'), city: col(r, '市'), text: col(r, '紹介文'),
        info: col(r, 'くわしい情報').split(/\n/).filter(Boolean), tag: col(r, 'タグ'),
        links: links,
        // 写真は1〜5枚。改行・カンマ・読点で区切って書く
        photos: col(r, '写真').split(/[\n,、，]+/).map(function (p) { return p.trim(); }).filter(Boolean),
        // ページ冒頭の入れ替え用に選んだ写真（「トップの写真」の列）
        top: col(r, 'トップの写真').split(/[\n,、，]+/).map(function (p) { return p.trim(); }).filter(Boolean),
        // お店の場所（Googleマップ）。「地図のURL」の列が空なら、店名で地図を検索するリンクにする
        map: col(r, '地図のURL'),
        // 海外の方の対応（「可能」「不可」）。不可のお店は、日本語のときだけ表示する
        abroad: abroadOf(col(r, '海外の方の対応')),
        // お客様対応の備考（例：簡単な日本語が話せる方だと安心です）
        abroadNote: col(r, 'お客様対応の備考'),
        // クーポン（「クーポン」の列が「出す」で、特典が書いてあるお店だけ、カードにボタンを出す）
        // 新着・更新の札（受付と公開のスクリプトが、公開した日と一緒に書き込む）
        // 並び順（シートの「並び順」タブで何番目か。公開用の「並び順」の列に式で入る）
        order: (function (v) { v = parseInt(String(v).replace(/[^0-9]/g, ''), 10); return v > 0 ? v : 0; })(col(r, '並び順')),
        fresh: freshKind(col(r, '新着・更新')),
        freshDate: parseDay(col(r, '新着・更新の日')),
        coupon: /出す|あり|^yes$|^true$/i.test(col(r, 'クーポン')) && !!col(r, 'クーポンの特典'),
        couponGift: col(r, 'クーポンの特典'),
        couponCond: col(r, 'クーポンの条件'),
        // 英語・韓国語・中国語の訳（「紹介文_en」などの列）。空なら日本語のまま
        tr: ['en', 'ko', 'zh'].reduce(function (o, lg) {
          o[lg] = { name: col(r, '店名_' + lg), sub: col(r, 'サブ名_' + lg), kind: col(r, '種類_' + lg), text: col(r, '紹介文_' + lg), info: col(r, 'くわしい情報_' + lg), abroadNote: col(r, 'お客様対応の備考_' + lg),
            couponGift: col(r, 'クーポンの特典_' + lg), couponCond: col(r, 'クーポンの条件_' + lg) };
          return o;
        }, {})
      };
    });
  }

  // 「海外の方の対応」の書き方を読み取る。空欄は「まだ回答がない」として、これまでどおり全部の言語で表示する
  function abroadOf(v) {
    if (/不可|できない|×|✕|^no$/i.test(v)) return 'no';
    if (/可能|できる|○|◯|^ok$|^yes$/i.test(v)) return 'yes';
    return '';
  }
  // いまの言語で表示するお店か（日本語ならすべて、ほかの言語なら「不可」のお店を除く）
  function shownInLang(s) { return I18N.lang === 'ja' || s.abroad !== 'no'; }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function safeUrl(u) { return /^(https?:)?\/\//i.test(u) ? u : '#'; }
  function photoSrc(p) {
    // GitHubのファイル画面のURL（…/blob/main/photos/…）を貼っても表示できるようにする
    var gh = p.match(/github\.com\/[^/]+\/[^/]+\/blob\/[^/]+\/photos\/(.+)$/i);
    if (gh) return 'photos/' + gh[1];
    if (/^https?:\/\//i.test(p)) return p;
    return 'photos/' + p.replace(/^\/?photos\//, '').split('/').map(encodeURIComponent).join('/');
  }

  // Macからアップロードしたフォルダ名は、濁点・半濁点（ぺ・ブ など）が分かれた形で保存されることがある。
  // シートに書いた名前で見つからなかったら、分かれた形の名前でもう一度探す。
  function nfdSrc(src) {
    try {
      var d = decodeURIComponent(src), n = d.normalize('NFD');
      if (n === d) return null;
      return n.split('/').map(encodeURIComponent).join('/');
    } catch (e) { return null; }
  }
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG' && !t.dataset.nfd) {
      var alt = nfdSrc(t.getAttribute('src'));
      if (alt) { t.dataset.nfd = '1'; t.src = alt; }
    }
  }, true);

  var SHARE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4l7 7-7 7v-4.2c-5.2 0-8.4 1.6-11 5.2 1-5.4 4-10.3 11-11.3V4z"/></svg>';
  var PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>';

  // いまの言語の訳があれば使い、なければ日本語
  function loc(s, field) {
    var lg = I18N.lang, v = lg !== 'ja' && s.tr && s.tr[lg] ? s.tr[lg][field] : '';
    return v || s[field];
  }

  function card(s) {
    var st = STYLE[s.genre];
    var sub = loc(s, 'sub'), kind = loc(s, 'kind'), text = loc(s, 'text');
    // お店の名前：シートの「店名_en」など → i18n.js の訳 → 日本語のまま。訳したときは、元の名前を小さく添える（看板を探す手がかりに）
    var lg = I18N.lang;
    // 韓国語・中国語の名前がないときは、英語・ローマ字の名前（「店名_en」）を使う
    var nameTr = (lg !== 'ja' && s.tr && s.tr[lg] && s.tr[lg].name) || (I18N.shopName ? I18N.shopName(s.name) : '') ||
      (lg !== 'ja' && s.tr && s.tr.en && s.tr.en.name) || '';
    var shownName = nameTr || s.name;
    var infoTr = I18N.lang !== 'ja' && s.tr && s.tr[I18N.lang] ? s.tr[I18N.lang].info : '';
    var info = infoTr ? infoTr.split(/\n/).filter(Boolean) : s.info;
    var pic;
    if (!s.photos.length) {
      pic = '<svg viewBox="0 0 24 24" fill="none" stroke="' + st.fg + '" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[st.icon] + '</svg>';
    } else {
      var n = s.photos.length;
      pic = s.photos.map(function (p, i) {
        return '<img class="slide' + (i === 0 ? ' is-on' : '') + '" src="' + esc(photoSrc(p)) + '" alt="' + esc(T('photo.alt', { name: s.name })) + (n > 1 ? ' (' + (i + 1) + '/' + n + ')' : '') + '"' + (i === 0 ? '' : ' aria-hidden="true"') + ' loading="lazy">';
      }).join('');
    }
    var badge = isFresh(s) ? '<span class="fresh fresh-' + s.fresh + '">' + esc(T('fresh.' + s.fresh)) + '</span>' : '';
    var ctrl = '';
    if (s.photos.length > 1) {
      // 前後の写真ボタンと、何枚目かの点（2026-11-20・ラテさんの意見：見逃した写真をすぐ見返せるように）
      ctrl = '<button type="button" class="ph-nav ph-prev" aria-label="' + esc(T('photo.prev')) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>'
        + '<button type="button" class="ph-nav ph-next" aria-label="' + esc(T('photo.next')) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>'
        + '<span class="ph-dots" aria-hidden="true">' + s.photos.map(function (p, i) { return '<i' + (i === 0 ? ' class="is-on"' : '') + '></i>'; }).join('') + '</span>';
    }
    var h = '<article class="card" data-shop-i="' + shops.indexOf(s) + '"><div class="card-pic' + (s.photos.length > 1 ? ' is-slider' : '') + '" style="background:' + st.bg + '">' + pic + badge + ctrl + '</div><div class="card-body">';
    var mapUrl = /^https?:\/\//i.test(s.map) ? s.map
      : 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent([s.name, s.sub, s.city].filter(Boolean).join(' '));
    var place = s.city
      ? '<a class="map-link" href="' + esc(mapUrl) + '" target="_blank" rel="noopener" aria-label="' + esc(T('map.aria', { name: s.name, city: W(s.city) })) + '">' + PIN + esc(W(s.city)) + '</a>'
      : '';
    // このお店を家族や友だちに送る（2026-11-20・ラテさんの提案：「あの人と行きたいな」で誘いやすく）。カードの右上に矢印のマーク
    h += '<button type="button" class="share-ic" data-share="' + shops.indexOf(s) + '" aria-label="' + esc(T('share.aria', { name: shownName })) + '">' + SHARE + '</button>';
    h += '<p class="meta">' + esc(kind || W(s.genre)) + (place ? '｜' + place : '') + '</p>';
    h += '<h3>' + esc(shownName) + '</h3>';
    if (nameTr && nameTr !== s.name) h += '<p class="origname" lang="ja">' + esc(s.name) + '</p>';
    if (sub) h += '<p class="subname">' + esc(sub) + '</p>';
    if (text) h += '<p class="text">' + esc(text) + '</p>';
    if (info.length) h += '<ul class="info">' + info.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>';
    // お客様対応の備考は、日本語以外のときだけ出す（「歓迎」などの表示はしない）
    if (I18N.lang !== 'ja' && s.abroad !== 'no') {
      var note = loc(s, 'abroadNote');
      if (note) h += '<p class="abroad-note">' + esc(note) + '</p>';
    }
    if (s.tag) h += '<span class="tag">' + esc(W(s.tag)) + '</span>';
    if (s.coupon) {
      h += '<button type="button" class="coupon-btn" data-coupon="' + shops.indexOf(s) + '">' + TICKET +
        '<span>' + esc(T('coupon.btn')) + '</span><small>' + esc(loc(s, 'couponGift')) + '</small></button>';
    }
    if (s.links.length) {
      h += '<div class="links">' + s.links.map(function (l) {
        return '<a href="' + esc(safeUrl(l.url)) + '" target="_blank" rel="noopener">' + esc(W(l.label)) + ARROW + '</a>';
      }).join('') + '</div>';
    }
    return h + '</div></article>';
  }

  function chips(el, list, key, allLabel, label) {
    el.innerHTML = '';
    ['all'].concat(list).forEach(function (v) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'chip';
      b.textContent = v === 'all' ? allLabel : (label ? label(v) : v);
      b.setAttribute('aria-pressed', state[key] === v ? 'true' : 'false');
      b.addEventListener('click', function () { state[key] = v; render(); });
      el.appendChild(b);
    });
  }

  // 「クーポンあり」の切り替え（押すたびに、オン／オフ）
  function couponChip(show) {
    var el = document.getElementById('coupon-chips'), bn = document.getElementById('cp-banner');
    if (bn) bn.hidden = !show;
    if (!el) return;
    el.hidden = !show;
    document.getElementById('area-chips').classList.toggle('chips-last', !show);
    el.classList.toggle('chips-last', show);
    if (!show) { el.innerHTML = ''; return; }
    el.innerHTML = '<button type="button" class="chip chip-coupon" aria-pressed="' + (state.coupon ? 'true' : 'false') + '">' +
      TICKET + '<span>' + esc(T('coupon.chip')) + '</span></button>';
    el.firstChild.addEventListener('click', function () { state.coupon = !state.coupon; render(); });
  }
  // 上の「ぐるりクーポン」ボタン：クーポンありだけにして、お店のカードのところまでスクロールする
  function showCouponShops(smooth) {
    state.coupon = true; state.genre = 'all'; state.area = 'all';
    if (qIn && qIn.value) { qIn.value = ''; state.q = ''; if (qX) qX.hidden = true; }
    render();
    var target = document.getElementById('coupon-chips');
    if (!target || target.hidden) target = grid;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'auto', block: 'start' });
    try { grid.focus({ preventScroll: true }); } catch (e) {}
  }

  var BATCH = 12, FIRST_BATCHES = 2, STEP_BATCHES = 2, batches = FIRST_BATCHES, batchKey = '', shownCount = 0; // 最初も「もっと見る」も2まとまり（24枚）ずつ
  // 12枚のまとまりごとに、協賛カードを1枚（6軒目のあと）。協賛があるまとまりは、お店11軒＋協賛1枚
  function layoutTiles(list, nb) {
    var order = spListB(), out = [], idx = 0, pos = 0;
    for (var b = 0; b < nb && idx < list.length; b++) {
      var sp = order[b] || null;
      var take = sp ? BATCH - 1 : BATCH;
      var part = list.slice(idx, idx + take);
      var at = -1;
      if (sp && part.length >= 6) {
        at = 6;
        // 協賛者が掲載店でもあるときは、そのお店のカードと隣り合わないようにずらす
        var own = sp.shop ? part.findIndex(function (x) { return x.name === sp.shop; }) : -1;
        if (own >= 0 && (own === 5 || own === 6)) at = part.length >= 10 ? 9 : 3;
      } else if (sp) { take = BATCH; part = list.slice(idx, idx + take); }
      part.forEach(function (s, k) {
        if (k === at) { pos++; out.push(spCardB(sp, pos)); }
        out.push(card(s));
      });
      if (at === part.length) { pos++; out.push(spCardB(sp, pos)); }
      idx += part.length;
    }
    return { html: out.join(''), shown: idx };
  }
  var moreBtn = document.getElementById('shop-more');
  if (moreBtn) moreBtn.addEventListener('click', function () {
    var before = shownCount;
    batches += STEP_BATCHES; render();
    try { if (typeof gtag === 'function') gtag('event', 'more_click', { batch: batches / STEP_BATCHES }); } catch (e) {}
    // 足したカードの先頭へ、操作の位置を移す（キーボードや読み上げで続きから読めるように）
    var first = grid.querySelectorAll('[data-shop-i]')[before];
    if (first) { first.setAttribute('tabindex', '-1'); first.focus({ preventScroll: true }); }
  });
  // あるお店のカードを、一覧に出す（まだ「もっと見る」の先にあるときは、そこまで広げる）
  function revealShop(i) {
    var el = grid.querySelector('[data-shop-i="' + i + '"]');
    while (!el && shownCount < shops.length && batches < 50) { batches++; render(); el = grid.querySelector('[data-shop-i="' + i + '"]'); }
    return el;
  }
  function render() {
    var vis = shops.filter(shownInLang);
    var cities = [];
    vis.forEach(function (s) { if (s.city && cities.indexOf(s.city) < 0) cities.push(s.city); });
    var genres = GENRES.filter(function (g) { return vis.some(function (s) { return s.genre === g; }); });
    // 言語を切り替えて、選んでいたジャンル・まちのお店がなくなったときは「すべて」に戻す
    if (state.genre !== 'all' && genres.indexOf(state.genre) < 0) state.genre = 'all';
    if (state.area !== 'all' && cities.indexOf(state.area) < 0) state.area = 'all';
    chips(document.getElementById('genre-chips'), genres, 'genre', T('chip.all'), W);
    chips(document.getElementById('area-chips'), cities, 'area', T('chip.allArea'), W);
    // クーポンありのお店がある言語だけ、「クーポンあり」の絞り込みと、上の「ぐるりクーポン」ボタンを出す
    var anyCoupon = vis.some(function (s) { return s.coupon; });
    if (!anyCoupon) state.coupon = false;
    couponChip(anyCoupon);
    var ws = words(state.q);
    var list = vis.filter(function (s) {
      return (state.genre === 'all' || s.genre === state.genre) && (state.area === 'all' || s.city === state.area) &&
        (!state.coupon || s.coupon) && matchQ(s, ws);
    });
    list = orderShops(list);
    // 「もっと見る」：24枚ずつ。絞り込み・検索・言語が変わったら、最初の24枚に戻す
    var key = [I18N.lang, state.genre, state.area, state.coupon, state.q].join('|');
    if (key !== batchKey) { batchKey = key; batches = FIRST_BATCHES; }
    var tiles = layoutTiles(list, batches);
    grid.innerHTML = tiles.html;
    shownCount = tiles.shown;
    spWatch(grid);
    setupSliders();
    var more = document.getElementById('shop-more');
    if (more) {
      more.hidden = tiles.shown >= list.length;
      more.querySelector('span').textContent = T('more.btn', { n: list.length - tiles.shown });
    }
    document.getElementById('shop-count').textContent = T('shops.count', { n: list.length, t: vis.length });
    var note = document.getElementById('mt-note');
    if (note) note.hidden = I18N.lang === 'ja';
    var empty = document.getElementById('shop-empty');
    empty.textContent = ws.length ? T('empty.q', { q: state.q.trim() }) : T('empty');
    empty.hidden = list.length > 0;
  }

  // 検索窓：入力するたびに少し待ってから絞り込む。×で消す。?q=… でも開ける
  var qIn = document.getElementById('shop-q'), qX = document.getElementById('shop-q-x'), qTimer = null;
  if (qIn) {
    try { var q0 = new URLSearchParams(location.search).get('q'); if (q0) { qIn.value = q0; state.q = q0; } } catch (e) {}
    var sync = function () { if (qX) qX.hidden = !qIn.value; };
    sync();
    qIn.addEventListener('input', function () {
      sync(); clearTimeout(qTimer);
      qTimer = setTimeout(function () { state.q = qIn.value; if (shops.length) render(); }, 180);
    });
    qIn.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); qIn.blur(); } });
    if (qX) qX.addEventListener('click', function () {
      qIn.value = ''; state.q = ''; sync(); if (shops.length) render(); qIn.focus();
    });
  }

  // 写真の切り替え（約4秒ごとに、ゆっくり重ねるように切り替える。カードごとに少しずつずらす）
  var INTERVAL = 3200;   // 1枚を見せる時間（2026-11-20：4.5秒→3.2秒。ゆっくりすぎて複数あると気づかれにくかったため）
  var FIRST = 1800;      // 画面に入ってから、最初に切り替わるまで
  var HOLD = 12000;   // 手で動かしたあと、自動の切り替えを待つ時間
  var sliders = [];
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setupSliders() {
    sliders.forEach(function (sl) { clearTimeout(sl.timer); if (sl.io) sl.io.disconnect(); });
    sliders = [];
    grid.querySelectorAll('.card-pic.is-slider').forEach(function (box, idx) {
      var imgs = box.querySelectorAll('.slide');
      var dots = box.querySelectorAll('.ph-dots i');
      var sl = { i: 0, timer: null, visible: false, io: null, held: 0 };
      // dir：0＝自動（今までどおりふわっと重ねる）／1＝次へ（右から入る）／-1＝前へ（左から入る）
      function show(k, dir) {
        var prev = sl.i;
        sl.i = (k + imgs.length) % imgs.length;
        imgs.forEach(function (im, j) {
          im.classList.remove('from-r', 'from-l');
          im.classList.toggle('is-prev', j === prev && j !== sl.i);
          im.classList.toggle('is-on', j === sl.i);
          if (j === sl.i) im.removeAttribute('aria-hidden'); else im.setAttribute('aria-hidden', 'true');
        });
        if (dir && !reduceMotion) { void imgs[sl.i].offsetWidth; imgs[sl.i].classList.add(dir > 0 ? 'from-r' : 'from-l'); }
        dots.forEach(function (d, j) { d.classList.toggle('is-on', j === sl.i); });
      }
      function schedule(delay) {
        clearTimeout(sl.timer);
        if (reduceMotion || !sl.visible || document.hidden) return;
        sl.timer = setTimeout(function () { show(sl.i + 1, 0); schedule(INTERVAL); }, delay);
      }
      // 手で動かしたら、しばらく自動の切り替えを止めて、ゆっくり見られるようにする
      function go(dir) { show(sl.i + dir, dir); schedule(HOLD); }
      sl.schedule = schedule;
      box.querySelector('.ph-prev').addEventListener('click', function (e) { e.preventDefault(); go(-1); });
      box.querySelector('.ph-next').addEventListener('click', function (e) { e.preventDefault(); go(1); });
      // 指で左右にすべらせて切り替え（縦のスクロールはそのまま）
      var sx = null, sy = 0;
      box.addEventListener('touchstart', function (e) { if (e.touches.length !== 1) { sx = null; return; } sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
      box.addEventListener('touchend', function (e) {
        if (sx === null) return;
        var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; sx = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
      }, { passive: true });
      if ('IntersectionObserver' in window) {
        sl.io = new IntersectionObserver(function (es) {
          sl.visible = es[0].isIntersecting;
          if (sl.visible) schedule(FIRST + (idx % 3) * 400); else clearTimeout(sl.timer);
        }, { threshold: 0.4 });
        sl.io.observe(box);
      } else { sl.visible = true; schedule(FIRST + (idx % 3) * 400); }
      sliders.push(sl);
    });
  }
  document.addEventListener('visibilitychange', function () {
    sliders.forEach(function (sl) { if (document.hidden) clearTimeout(sl.timer); else sl.schedule(INTERVAL); });
  });


  // いちばん上の色のブロック：「トップの写真」に選んだ写真と色のイラストを、市松模様で入れ替える
  // 同じお店の写真が同時に並ばないように選ぶ。約4秒ごと、少しずつずらしてふわっと切り替える
  var HERO_INTERVAL = 4000;
  function startHero() {
    var wrap = document.querySelector('.tiles');
    if (!wrap) return;
    var tiles = [].slice.call(wrap.querySelectorAll('.tile'));
    var illus = tiles.map(function (t) {
      return { bg: t.style.background || t.style.backgroundColor, html: t.innerHTML };
    });
    // 「トップの写真」の列に書いた写真だけを使う（お店のカードの写真は使わない）
    var pool = shops.filter(function (s) { return s.top.length; });
    if (!pool.length) return;
    tiles.forEach(function (t, i) {
      var layer = document.createElement('div');
      layer.className = 'tile-layer is-on';
      layer.style.background = illus[i].bg;
      layer.innerHTML = illus[i].html;
      t.innerHTML = ''; t.style.background = '';
      t.appendChild(layer);
    });
    var cycle = 0, shown = [], next = null, timer = null, visible = true;

    function shuffle(a) {
      a = a.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; }
      return a;
    }
    function photoSlots() {
      var cols = getComputedStyle(wrap).gridTemplateColumns.split(' ').length || 3;
      var out = [];
      tiles.forEach(function (t, i) {
        var r = Math.floor(i / cols), c = i % cols;
        if ((r + c + cycle) % 2 === 0) out.push(i);
      });
      return out;
    }
    function swap(i, makeLayer, delay) {
      setTimeout(function () {
        var t = tiles[i];
        var old = [].slice.call(t.querySelectorAll('.tile-layer'));
        var layer = makeLayer();
        t.appendChild(layer);
        requestAnimationFrame(function () { requestAnimationFrame(function () { layer.classList.add('is-on'); }); });
        setTimeout(function () { old.forEach(function (o) { o.remove(); }); }, 1900);
      }, delay);
    }
    function step() {
      var slots = photoSlots();
      var picks = next || plan(slots.length);
      shown = picks.map(function (x) { return x.shop; });
      next = null;
      var illOrder = shuffle(illus);
      var order = shuffle(tiles.map(function (t, i) { return i; }));
      var k = 0, n = 0;
      order.forEach(function (i, idx) {
        var slot = slots.indexOf(i);
        var shop = slot >= 0 ? picks[slot] : null;
        var ill = shop ? null : illOrder[n++ % illOrder.length];
        swap(i, function () {
          var layer = document.createElement('div');
          layer.className = 'tile-layer';
          if (shop) {
            var src = shop.src;
            layer.style.background = STYLE[shop.shop.genre].bg;
            var img = new Image(); img.src = src; img.alt = ''; img.decoding = 'async';
            img.onerror = function () { if (this.dataset.nfd === '1') { this.dataset.nfd = '2'; return; } layer.innerHTML = illus[k++ % illus.length].html; };
            layer.appendChild(img);
          } else {
            layer.style.background = ill.bg;
            layer.innerHTML = ill.html;
          }
          return layer;
        }, idx * 140);
      });
      cycle++;
      // 次に出す写真だけを先に読み込んでおく（全部を一度に読み込まない）
      next = plan(photoSlots().length);
      next.forEach(function (x) { var im = new Image(); im.src = x.src; });
    }
    // いま並んでいるお店を避けて、同じお店が重ならないように選ぶ
    function plan(count) {
      var ok = pool.filter(shownInLang);
      var fresh = shuffle(ok.filter(function (s) { return shown.indexOf(s) < 0; }));
      var rest = shuffle(ok.filter(function (s) { return shown.indexOf(s) >= 0; }));
      return fresh.concat(rest).slice(0, count).map(function (sh) {
        return { shop: sh, src: photoSrc(sh.top[Math.floor(Math.random() * sh.top.length)]) };
      });
    }
    function schedule(d) {
      clearTimeout(timer);
      if (reduceMotion || !visible || document.hidden) return;
      timer = setTimeout(function () { step(); schedule(HERO_INTERVAL); }, d);
    }
    step();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible) schedule(HERO_INTERVAL); else clearTimeout(timer);
      }, { threshold: 0.2 }).observe(wrap);
    } else schedule(HERO_INTERVAL);
    document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimeout(timer); else schedule(HERO_INTERVAL); });
  }

  // 言語が切り替わったら、お店のカードと絞り込みのボタンを描き直す
  /* ───────── クーポン画面 ─────────
     お会計の前に、お店の方に見せてもらう画面。開いたときに GA4 へ coupon_open（shop_name：日本語の店名）を送る */
  var TICKET = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M14 6v12" stroke-dasharray="2 2.2"/></svg>';
  var LOCALE = { ja: 'ja-JP', en: 'en-US', ko: 'ko-KR', zh: 'zh-TW' };
  function fmtDate(d, withDay) {
    var o = { year: 'numeric', month: 'long', day: 'numeric' };
    if (withDay) o.weekday = 'short';
    try { return new Intl.DateTimeFormat(LOCALE[I18N.lang] || 'ja-JP', o).format(d); }
    catch (e) { return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate(); }
  }
  var cpBox = null, cpLastFocus = null, cpOpenIdx = -1, cpPushed = false;
  function couponHtml(s) {
    var lg = I18N.lang;
    var nameTr = (lg !== 'ja' && s.tr && s.tr[lg] && s.tr[lg].name) || (I18N.shopName ? I18N.shopName(s.name) : '') ||
      (lg !== 'ja' && s.tr && s.tr.en && s.tr.en.name) || '';
    var now = new Date();
    var end = new Date(now.getFullYear(), now.getMonth() + 1, 0);   // その月の末日
    var own = (loc(s, 'couponCond') || '').split(/\n/).map(function (l) { return l.trim(); }).filter(Boolean);
    var common = ['coupon.c1', 'coupon.c2', 'coupon.c3', 'coupon.c4', 'coupon.c5'].map(function (k) { return T(k); });
    return '<div class="cp-sheet" role="dialog" aria-modal="true" aria-labelledby="cp-shop">' +
      '<button type="button" class="cp-close" data-cp-close aria-label="' + esc(T('coupon.close')) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<div class="cp-ticket">' +
        '<div class="cp-head"><img src="assets/' + (lg === 'ja' ? 'logo-white.svg' : 'logo-en-white.svg') + '" alt="' + esc(T('brand')) + '" width="64" height="31"><span>' + esc(T('coupon.title')) + '</span></div>' +
        '<div class="cp-main">' +
          '<p class="cp-shop" id="cp-shop">' + esc(nameTr || s.name) + '</p>' +
          (nameTr && nameTr !== s.name ? '<p class="cp-orig" lang="ja">' + esc(s.name) + '</p>' : '') +
          '<p class="cp-gift">' + esc(loc(s, 'couponGift')) + '</p>' +
        '</div>' +
        '<div class="cp-tear" aria-hidden="true"></div>' +
        '<dl class="cp-dates">' +
          '<div class="cp-today"><dt>' + esc(T('coupon.today')) + '</dt><dd>' + esc(fmtDate(now, true)) + '</dd></div>' +
          '<div><dt>' + esc(T('coupon.until')) + '</dt><dd>' + esc(T('coupon.untilv', { d: fmtDate(end, false) })) + '</dd></div>' +
        '</dl>' +
        '<p class="cp-show">' + esc(T('coupon.show')) + '</p>' +
      '</div>' +
      '<div class="cp-cond"><h3>' + esc(T('coupon.cond')) + '</h3><ul>' +
        own.map(function (l) { return '<li class="cp-own">' + esc(l) + '</li>'; }).join('') +
        common.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') +
      '</ul></div>' +
    '</div>';
  }
  function openCoupon(idx, fromHistory) {
    var s = shops[idx]; if (!s || !s.coupon) return;
    if (!cpBox) {
      cpBox = document.createElement('div'); cpBox.className = 'cp-overlay'; cpBox.hidden = true;
      document.body.appendChild(cpBox);
      cpBox.addEventListener('click', function (e) {
        if (e.target === cpBox || e.target.closest('[data-cp-close]')) closeCoupon();
      });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !cpBox.hidden) closeCoupon(); });
    }
    cpOpenIdx = idx;
    cpLastFocus = document.activeElement;
    cpBox.innerHTML = couponHtml(s);
    cpBox.hidden = false;
    document.documentElement.classList.add('cp-lock');
    var x = cpBox.querySelector('.cp-close'); if (x) x.focus();
    cpPushed = false;
    if (!fromHistory) { try { history.pushState({ coupon: idx }, '', location.pathname + location.search + '#coupon=' + encodeURIComponent(s.name)); cpPushed = true; } catch (e) {} }
    // 開かれた記録（GA4）
    try { if (typeof gtag === 'function') gtag('event', 'coupon_open', { shop_name: s.name }); } catch (e) {}
  }
  function closeCoupon(fromHistory) {
    if (!cpBox || cpBox.hidden) return;
    cpBox.hidden = true; cpOpenIdx = -1;
    document.documentElement.classList.remove('cp-lock');
    // サイトの中で開いたときは「戻る」で閉じる。Instagramのストーリーなど、クーポン画面のURLから直接来たときは、
    // 「戻る」を使うとサイトから出てしまうので、URLから #coupon=… を外すだけにして、ホームの一覧を見せる
    if (!fromHistory && /^#coupon=/.test(location.hash)) {
      try { if (cpPushed) history.back(); else history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    }
    cpPushed = false;
    if (cpLastFocus && cpLastFocus.focus) cpLastFocus.focus();
  }
  var cpBanner = document.getElementById('cp-banner');
  if (cpBanner) cpBanner.addEventListener('click', function () { showCouponShops(true); });
  if (grid) grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-coupon]'); if (b) openCoupon(Number(b.getAttribute('data-coupon')));
    var sb = e.target.closest('[data-share]'); if (sb) shareShop(shops[Number(sb.getAttribute('data-share'))]);
  });

  /* ── お店を送る ──
     スマホでは、LINE・メッセージ・メールなどを選べる画面（端末の共有画面）を出す。
     その画面がない端末（パソコンなど）では、リンクをコピーして「貼り付けて送れます」と知らせる。
     送るリンクは ?shop=店名 。開いた人には、そのお店のカードまで移動して、少しのあいだ枠を光らせる */
  function shopLink(s) {
    var u = location.origin + location.pathname + '?shop=' + encodeURIComponent(s.name);
    return I18N.lang !== 'ja' ? u + '&lang=' + I18N.lang : u;
  }
  function track(method, s) { try { if (typeof gtag === 'function') gtag('event', 'share', { method: method, content_type: 'shop', item_id: s.name }); } catch (e) {} }
  function toast(msg) {
    var t = document.getElementById('gr-toast');
    if (!t) { t = document.createElement('div'); t.id = 'gr-toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('is-on');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('is-on'); }, 3200);
  }
  /* 送り先を選ぶ画面（下から出る）。LINE をいちばん先に。端末の共有画面は「そのほか」から */
  var shBox = null, shShop = null, shLastFocus = null;
  var IC = {
    line: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12 4C7 4 3 7.3 3 11.4c0 3.6 3.2 6.7 7.6 7.3.3.1.7.2.8.5.1.2.1.6 0 .8l-.1.8c0 .2-.2.9.8.5s5.3-3.1 7.2-5.4c1.3-1.4 1.9-2.9 1.9-4.5C21 7.3 17 4 12 4z"/></svg>',
    sms: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3"/><path d="M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>'
  };
  function shName(s) { return String(loc(s, 'name') || s.name).replace(/\s*\n\s*/g, ' '); }
  // 送る文は「店名｜ぐるり ひばりヶ丘」とリンクだけ（2026-11-20・G指示：決まった一言は入れず、誘う・自分用に取っておく、どちらにも使えるように）
  function shText(s) { return T('share.title', { name: shName(s) }); }
  function shareHtml(s) {
    var img = s.photos && s.photos.length ? '<img src="' + esc(photoSrc(s.photos[0])) + '" alt="">' : '<span class="sh-noimg" style="background:' + (STYLE[s.genre] ? STYLE[s.genre].bg : '#EFE8E4') + '"></span>';
    var t = function (key, ic, label, extra) { return '<button type="button" class="sh-t sh-' + key + '" data-sh="' + key + '"' + (extra || '') + '><span class="sh-ic">' + ic + '</span><span class="sh-l">' + esc(label) + '</span></button>'; };
    return '<div class="sh-sheet" role="dialog" aria-modal="true" aria-labelledby="sh-title">' +
      '<span class="sh-grip" aria-hidden="true"></span>' +
      '<div class="sh-head"><h2 id="sh-title">' + esc(T('share.title2')) + '</h2>' +
      '<button type="button" class="sh-x" data-sh-close aria-label="' + esc(T('coupon.close')) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="sh-shop">' + img + '<div><b>' + esc(shName(s)) + '</b><small>' + esc(W(s.city || '')) + '</small></div></div>' +
      '<div class="sh-row">' +
        t('line', IC.line, 'LINE') + t('sms', IC.sms, T('share.sms')) + t('mail', IC.mail, T('share.mail')) + t('copy', IC.copy, T('share.copy')) +
        (navigator.share ? t('more', IC.more, T('share.more')) : '') +
      '</div></div>';
  }
  function shareShop(s) {
    if (!s) return;
    shShop = s; shLastFocus = document.activeElement;
    if (!shBox) {
      shBox = document.createElement('div'); shBox.className = 'sh-overlay'; shBox.hidden = true;
      document.body.appendChild(shBox);
      shBox.addEventListener('click', function (e) {
        if (e.target === shBox || e.target.closest('[data-sh-close]')) return closeShare();
        var b = e.target.closest('[data-sh]'); if (b) sendVia(b.getAttribute('data-sh'));
      });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && shBox && !shBox.hidden) closeShare(); });
    }
    shBox.innerHTML = shareHtml(s);
    shBox.hidden = false;
    document.documentElement.classList.add('sh-open');
    requestAnimationFrame(function () { shBox.classList.add('is-on'); });
    var first = shBox.querySelector('.sh-line'); if (first) first.focus();
    track('open', s);
  }
  function closeShare() {
    if (!shBox || shBox.hidden) return;
    shBox.classList.remove('is-on');
    document.documentElement.classList.remove('sh-open');
    setTimeout(function () { shBox.hidden = true; }, 220);
    if (shLastFocus && shLastFocus.focus) shLastFocus.focus();
  }
  function sendVia(way) {
    var s = shShop, url = shopLink(s), text = shText(s), all = text + '\n' + url;
    if (way === 'line') { track('line', s); window.open('https://line.me/R/share?text=' + encodeURIComponent(all), '_blank', 'noopener'); return closeShare(); }
    if (way === 'sms') { track('sms', s); location.href = 'sms:?&body=' + encodeURIComponent(all); return closeShare(); }
    if (way === 'mail') { track('mail', s); location.href = 'mailto:?subject=' + encodeURIComponent(T('share.title', { name: shName(s) })) + '&body=' + encodeURIComponent(all); return closeShare(); }
    if (way === 'more' && navigator.share) {
      navigator.share({ title: text, url: url }).then(function () { track('share_sheet', s); closeShare(); }).catch(function () {});
      return;
    }
    if (way === 'copy') {
      var done = function () { track('copy', s); closeShare(); toast(T('share.copied')); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(all).then(done, function () { window.prompt(T('share.copyThis'), url); });
      else window.prompt(T('share.copyThis'), url);
    }
  }
  // ?shop=店名 で開いたとき：絞り込みを外して、そのお店のカードへ
  function openShopFromQuery() {
    var name;
    try { name = new URLSearchParams(location.search).get('shop'); } catch (e) { return; }
    if (!name) return;
    var i = shops.findIndex(function (s) { return s.name === name; });
    try { var q = new URLSearchParams(location.search); q.delete('shop'); var rest = q.toString(); history.replaceState(null, '', location.pathname + (rest ? '?' + rest : '') + location.hash); } catch (e) {}
    if (i < 0) return;
    state.genre = 'all'; state.area = 'all'; state.coupon = false;
    if (qIn && qIn.value) { qIn.value = ''; state.q = ''; if (qX) qX.hidden = true; }
    render();
    var el = revealShop(i); if (!el) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(function () {
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      el.classList.add('is-target');
      setTimeout(function () { el.classList.remove('is-target'); }, 4000);
    }, 300);
  }
  window.addEventListener('popstate', function () {
    var m = location.hash.match(/^#coupon=(.+)$/);
    if (!m) return closeCoupon(true);
    var name = decodeURIComponent(m[1]);
    var i = shops.findIndex(function (s) { return s.name === name; });
    if (i >= 0) openCoupon(i, true);
  });
  // #coupon=店名 のリンクで開いたとき（お店の一覧が読み込まれてから開く）
  // Short.io などの短いリンクを通ると「#」から後ろが消えることがあるため、?coupon=店名・?list=coupons でも開けるようにする。
  // 開いたらURLは #coupon=… / #coupons の形にそろえる（そのあとの「閉じる」などの動きは同じ）
  (function () {
    try {
      var q = new URLSearchParams(location.search), c = q.get('coupon'), l = q.get('list');
      if (!c && l !== 'coupons') return;
      q.delete('coupon'); q.delete('list');
      var rest = q.toString();
      history.replaceState(null, '', location.pathname + (rest ? '?' + rest : '') + (c ? '#coupon=' + encodeURIComponent(c) : '#coupons'));
    } catch (e) {}
  })();
  function openCouponFromHash() {
    var m = location.hash.match(/^#coupon=(.+)$/); if (!m) return;
    var name = decodeURIComponent(m[1]);
    var i = shops.findIndex(function (s) { return s.name === name; });
    if (i >= 0) openCoupon(i, true);
  }
  // 言語を切り替えたら、開いているクーポン画面もその言語にする
  document.addEventListener('gururi:lang', function () { if (cpBox && !cpBox.hidden && cpOpenIdx >= 0) cpBox.innerHTML = couponHtml(shops[cpOpenIdx]); });

  document.addEventListener('gururi:lang', function () { if (shops.length) render(); });

  function load(url) {
    return fetch(url, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    });
  }

  var primary = CFG.sheetCsvUrl ? load(CFG.sheetCsvUrl) : Promise.reject();
  primary.catch(function () { return load('data/shops.csv'); })
    .then(function (text) {
      shops = toShops(parseCSV(text));
      document.getElementById('shop-loading').hidden = true;
      render();
      startHero();
      openCouponFromHash();
      openShopFromQuery();
      // index.html#coupons で開いたときは、クーポンありのお店を出す（チラシやInstagramからのリンク用）
      if (location.hash === '#coupons' && shops.some(function (s) { return s.coupon && shownInLang(s); })) showCouponShops(false);
    })
    .catch(function () {
      var ld = document.getElementById('shop-loading'); ld.setAttribute('data-i18n', 'error'); ld.textContent = T('error');
    });
})();
