(function () {
  var CFG = window.GURURI_CONFIG || {};
  var I18N = window.GURURI_I18N || { lang: 'ja', t: function (k) { return k; }, word: function (w) { return w; } };
  function T(k, v) { return I18N.t(k, v); }
  function W(w) { return I18N.word(w); }

  // config.js のリンク先を、data-link="..." のついたリンクに入れる
  document.querySelectorAll('[data-link]').forEach(function (a) {
    var url = CFG[a.getAttribute('data-link')];
    if (url) a.href = url;
  });

  var grid = document.getElementById('shop-grid');
  if (!grid) return;

  var GENRES = ['パン・お菓子', '食事・カフェ', '雑貨・ギフト', '教室・体験', '暮らし'];
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

  var state = { genre: 'all', area: 'all' };
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
        // 英語・韓国語・中国語の訳（「紹介文_en」などの列）。空なら日本語のまま
        tr: ['en', 'ko', 'zh'].reduce(function (o, lg) {
          o[lg] = { name: col(r, '店名_' + lg), sub: col(r, 'サブ名_' + lg), kind: col(r, '種類_' + lg), text: col(r, '紹介文_' + lg), info: col(r, 'くわしい情報_' + lg), abroadNote: col(r, 'お客様対応の備考_' + lg) };
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
    var h = '<article class="card"><div class="card-pic' + (s.photos.length > 1 ? ' is-slider' : '') + '" style="background:' + st.bg + '">' + pic + '</div><div class="card-body">';
    var mapUrl = /^https?:\/\//i.test(s.map) ? s.map
      : 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent([s.name, s.sub, s.city].filter(Boolean).join(' '));
    var place = s.city
      ? '<a class="map-link" href="' + esc(mapUrl) + '" target="_blank" rel="noopener" aria-label="' + esc(T('map.aria', { name: s.name, city: W(s.city) })) + '">' + PIN + esc(W(s.city)) + '</a>'
      : '';
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
    var list = vis.filter(function (s) {
      return (state.genre === 'all' || s.genre === state.genre) && (state.area === 'all' || s.city === state.area);
    });
    grid.innerHTML = list.map(card).join('');
    setupSliders();
    document.getElementById('shop-count').textContent = T('shops.count', { n: list.length, t: vis.length });
    var note = document.getElementById('mt-note');
    if (note) note.hidden = I18N.lang === 'ja';
    document.getElementById('shop-empty').hidden = list.length > 0;
  }

  // 写真の切り替え（約4秒ごとに、ゆっくり重ねるように切り替える。カードごとに少しずつずらす）
  var INTERVAL = 4500;
  var sliders = [];
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setupSliders() {
    sliders.forEach(function (sl) { clearTimeout(sl.timer); if (sl.io) sl.io.disconnect(); });
    sliders = [];
    grid.querySelectorAll('.card-pic.is-slider').forEach(function (box, idx) {
      var imgs = box.querySelectorAll('.slide');
      var sl = { i: 0, timer: null, visible: false, io: null };
      function show(k) {
        var prev = sl.i;
        sl.i = (k + imgs.length) % imgs.length;
        imgs.forEach(function (im, j) {
          im.classList.toggle('is-prev', j === prev && j !== sl.i);
          im.classList.toggle('is-on', j === sl.i);
          if (j === sl.i) im.removeAttribute('aria-hidden'); else im.setAttribute('aria-hidden', 'true');
        });
      }
      function schedule(delay) {
        clearTimeout(sl.timer);
        if (reduceMotion || !sl.visible || document.hidden) return;
        sl.timer = setTimeout(function () { show(sl.i + 1); schedule(INTERVAL); }, delay);
      }
      sl.schedule = schedule;
      if ('IntersectionObserver' in window) {
        sl.io = new IntersectionObserver(function (es) {
          sl.visible = es[0].isIntersecting;
          if (sl.visible) schedule(INTERVAL + (idx % 5) * 700); else clearTimeout(sl.timer);
        }, { threshold: 0.4 });
        sl.io.observe(box);
      } else { sl.visible = true; schedule(INTERVAL + (idx % 5) * 700); }
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
    })
    .catch(function () {
      var ld = document.getElementById('shop-loading'); ld.setAttribute('data-i18n', 'error'); ld.textContent = T('error');
    });
})();
