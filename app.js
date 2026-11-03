(function () {
  var CFG = window.GURURI_CONFIG || {};

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
        links: links, photo: col(r, '写真')
      };
    });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function safeUrl(u) { return /^(https?:)?\/\//i.test(u) ? u : '#'; }
  function photoSrc(p) { return /^https?:\/\//i.test(p) ? p : 'photos/' + p; }

  function card(s) {
    var st = STYLE[s.genre];
    var pic = s.photo
      ? '<img src="' + esc(photoSrc(s.photo)) + '" alt="' + esc(s.name) + 'の写真" loading="lazy">'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="' + st.fg + '" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[st.icon] + '</svg>';
    var h = '<article class="card"><div class="card-pic" style="background:' + st.bg + '">' + pic + '</div><div class="card-body">';
    h += '<p class="meta">' + esc(s.kind || s.genre) + (s.city ? '｜' + esc(s.city) : '') + '</p>';
    h += '<h3>' + esc(s.name) + '</h3>';
    if (s.sub) h += '<p class="subname">' + esc(s.sub) + '</p>';
    if (s.text) h += '<p class="text">' + esc(s.text) + '</p>';
    if (s.info.length) h += '<ul class="info">' + s.info.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>';
    if (s.tag) h += '<span class="tag">' + esc(s.tag) + '</span>';
    if (s.links.length) {
      h += '<div class="links">' + s.links.map(function (l) {
        return '<a href="' + esc(safeUrl(l.url)) + '" target="_blank" rel="noopener">' + esc(l.label) + ARROW + '</a>';
      }).join('') + '</div>';
    }
    return h + '</div></article>';
  }

  function chips(el, list, key, allLabel) {
    el.innerHTML = '';
    ['all'].concat(list).forEach(function (v) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'chip';
      b.textContent = v === 'all' ? allLabel : v;
      b.setAttribute('aria-pressed', state[key] === v ? 'true' : 'false');
      b.addEventListener('click', function () { state[key] = v; render(); });
      el.appendChild(b);
    });
  }

  function render() {
    var cities = [];
    shops.forEach(function (s) { if (s.city && cities.indexOf(s.city) < 0) cities.push(s.city); });
    var genres = GENRES.filter(function (g) { return shops.some(function (s) { return s.genre === g; }); });
    chips(document.getElementById('genre-chips'), genres, 'genre', 'すべて');
    chips(document.getElementById('area-chips'), cities, 'area', 'すべてのまち');
    var list = shops.filter(function (s) {
      return (state.genre === 'all' || s.genre === state.genre) && (state.area === 'all' || s.city === state.area);
    });
    grid.innerHTML = list.map(card).join('');
    document.getElementById('shop-count').textContent = list.length + '軒のお店（全' + shops.length + '軒）';
    document.getElementById('shop-empty').hidden = list.length > 0;
  }

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
    })
    .catch(function () {
      document.getElementById('shop-loading').textContent = 'お店の情報を読み込めませんでした。時間をおいて、もう一度開いてみてください。';
    });
})();
