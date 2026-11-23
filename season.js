/*
  ぐるり 季節の飾り（2026-11-23）
  いまのサイトはそのままに、月ごとの飾りを上から重ねるしくみです。
  - いつどの飾りを出すかは、サイトの seasons.csv（予定表）で決まります。日本時間の今日が「開始日〜終了日」に入る飾りが出ます。
    予定表は、Googleスプレッドシート「ぐるり 季節の飾り 一覧」にも自動で写ります。
  - config.js の season で決めることもできます："auto"（予定表どおり・ふだんはこれ）／"off"（飾りなし）／"december" など。
  - 公開前の確認用に、アドレスの最後に ?season=december を付けると、その月の飾りで見られます（?season=off で飾りなし）。
  - 飾りは見た目だけのものです。押したり読んだりする邪魔をしないよう、すべて「押せない・読み上げない」設定にしています。
  - 動きを減らす設定の端末では、雪やそりは動かさず、止まった飾りだけを出します。
*/
(function () {
  'use strict';
  var CFG = window.GURURI_CONFIG || {};

  function ready(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    e.className = cls;
    e.setAttribute('aria-hidden', 'true');
    if (html) e.innerHTML = html;
    return e;
  }

  /* ───────── 12月：シティポップのクリスマス ───────── */
  function december() {
    // 1. ちらちら降る雪と、きらきら（画面全体。軽くするため、数は控えめ）
    var snow = el('div', 'x-snow');
    var n = window.innerWidth < 700 ? 18 : 30;
    var kinds = ['flake', 'flake', 'flake', 'dot', 'star'];
    for (var i = 0; i < n; i++) {
      var k = kinds[i % kinds.length];
      var f = el('i', 'x-f x-f-' + k);
      var size = k === 'dot' ? 5 + Math.random() * 5 : 10 + Math.random() * 10;
      f.style.left = (Math.random() * 100).toFixed(1) + '%';
      f.style.width = f.style.height = size.toFixed(0) + 'px';
      f.style.animationDuration = (11 + Math.random() * 12).toFixed(1) + 's, ' + (3 + Math.random() * 3).toFixed(1) + 's';
      f.style.animationDelay = (-Math.random() * 20).toFixed(1) + 's, ' + (-Math.random() * 3).toFixed(1) + 's';
      snow.appendChild(f);
    }
    document.body.appendChild(snow);

    // 2. いちばん上の見出しの帯：電球のガーランド
    var hd = document.querySelector('.hd');
    if (hd) hd.appendChild(el('div', 'x-lights'));

    // 3. 夜空をかけるそりと、またたく星（お店をさがす：アイコンの帯／ほかのページ：最初の見出しの場所）
    var hero = document.querySelector('.strip, .c-hero, .jn-hero');   // お店をさがすページは、写真の下の、アイコンが並ぶ落ち着いた帯の上を飛ぶ
    if (hero) {
      var sky = el('div', 'x-sky');
      for (var s = 0; s < 9; s++) {
        var st = el('i', 'x-tw');
        st.style.left = (6 + Math.random() * 88).toFixed(1) + '%';
        st.style.top = (6 + Math.random() * 70).toFixed(1) + '%';
        st.style.animationDelay = (-Math.random() * 3).toFixed(1) + 's';
        sky.appendChild(st);
      }
      var sl = el('div', 'x-sleigh' + (calm ? ' is-still' : ''), SLEIGH);
      sky.appendChild(sl);
      hero.appendChild(sky);
      // 帯が画面に入ったときに、そりが飛びはじめる（見ていないところで飛び終わらないように）
      if (!calm) {
        if ('IntersectionObserver' in window) {
          var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { sl.classList.add('is-go'); io.disconnect(); } }); }, { threshold: 0.6 });
          io.observe(hero);
        } else sl.classList.add('is-go');
      }
    }

    // 4. 見出しのすぐ下に、くるくる流れるリボンの帯
    var after = document.querySelector('.strip') || document.querySelector('.c-hero, .jn-hero');
    if (after && after.parentNode) {
      var msg = 'Merry Christmas & Happy Holidays <b>✦</b> ぐるり ひばりヶ丘 <b>✦</b> ';
      var rib = el('div', 'x-ribbon', '<div class="x-ribbon-in"><span>' + Array(7).join(msg) + '</span><span>' + Array(7).join(msg) + '</span></div>');
      after.parentNode.insertBefore(rib, after.nextSibling);
    }

    // 5. ページのいちばん下：雪の積もった、ひばりヶ丘の街並み
    var ft = document.querySelector('.ft');
    if (ft) ft.insertBefore(el('div', 'x-town', TOWN), ft.firstChild);
  }

  // そり（オリジナルの絵）：トナカイ2頭と、サンタさんのそり
  var SLEIGH = '<svg viewBox="0 0 260 90" xmlns="http://www.w3.org/2000/svg">'
    // 星のしっぽ
    + '<g fill="#E7B547"><circle cx="236" cy="62" r="2.2"/><circle cx="248" cy="58" r="1.6"/><circle cx="226" cy="70" r="1.4"/><path d="M252 70l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z"/></g>'
    // トナカイ1（進む向き＝左を向くように、左右を反転）
    + '<g transform="translate(85 0) scale(-1 1)"><g fill="#9A6A48"><ellipse cx="34" cy="44" rx="15" ry="8"/><path d="M45 40l8-10 5 2-6 12z"/><circle cx="58" cy="30" r="5"/><rect x="22" y="49" width="3" height="11" rx="1.5"/><rect x="40" y="49" width="3" height="11" rx="1.5"/></g>'
    + '<circle cx="63" cy="31" r="2.4" fill="#E23D3D"/><path d="M55 25l-3-8M56 21l-4-1M58 25l2-8M59 20l3-1" stroke="#6E4A33" stroke-width="1.6" stroke-linecap="round" fill="none"/></g>'
    // トナカイ2（同じく左向き）
    + '<g transform="translate(177 0) scale(-1 1)"><g fill="#B07B55"><ellipse cx="82" cy="50" rx="15" ry="8"/><path d="M93 46l8-10 5 2-6 12z"/><circle cx="106" cy="36" r="5"/><rect x="70" y="55" width="3" height="11" rx="1.5"/><rect x="88" y="55" width="3" height="11" rx="1.5"/></g>'
    + '<path d="M103 31l-3-8M104 27l-4-1M106 31l2-8M107 26l3-1" stroke="#6E4A33" stroke-width="1.6" stroke-linecap="round" fill="none"/></g>'
    // 手綱と鈴
    + '<path d="M64 44Q104 34 150 52M108 50Q130 45 150 54" stroke="#E7B547" stroke-width="1.4" fill="none"/>'
    + '<g fill="#E7B547"><circle cx="66" cy="44" r="2.6"/><circle cx="110" cy="50" r="2.6"/></g>'
    // そり
    + '<path d="M146 44h56c8 0 12 6 12 14v4h-62c-6 0-8-4-8-8z" fill="#D9413B"/>'
    + '<path d="M144 70h70c6 0 9-3 10-7" stroke="#E7B547" stroke-width="3" stroke-linecap="round" fill="none"/>'
    + '<path d="M156 62v8M200 62v8" stroke="#E7B547" stroke-width="2.4"/>'
    + '<path d="M150 50h58" stroke="#F3D27A" stroke-width="2" stroke-dasharray="3 4"/>'
    // サンタさん
    + '<circle cx="178" cy="34" r="12" fill="#D9413B"/><circle cx="178" cy="22" r="7" fill="#F6D7C3"/>'
    + '<path d="M170 23c2 7 14 7 16 0 0 6-3 11-8 11s-8-5-8-11z" fill="#fff"/>'
    + '<path d="M171 18c1-7 11-9 15-3l6 6-4 2-3-3z" fill="#D9413B"/><circle cx="191" cy="22" r="2.6" fill="#fff"/><path d="M170 18h15" stroke="#fff" stroke-width="3" stroke-linecap="round"/>'
    // プレゼントの袋
    + '<path d="M196 30c-4 6-4 14 0 16h14c3-4 2-12-3-17z" fill="#2F7A55"/><path d="M199 31c2-3 6-3 8-1" stroke="#E7B547" stroke-width="2" fill="none"/>'
    + '</svg>';

  // 雪の積もった街並み（ページのいちばん下）
  var TOWN = '<svg viewBox="0 0 1072 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">'
    + '<path d="M0 90V52h60V34l30-20 30 20v18h50V40h40v12h60V26l36-22 36 22v26h44V36h52v16h70V30l26-16 26 16v22h56V44h48v8h60V24l34-20 34 20v28h54V38h44v14h66V32l28-18 28 18v20h60v38z" fill="#4A3830"/>'
    + '<path d="M0 54h60V36l30-20 30 20v18h50V42h40v12h60V28l36-22 36 22v26h44V38h52v16h70V32l26-16 26 16v22h56V46h48v8h60V26l34-20 34 20v28h54V40h44v14h66V34l28-18 28 18v20h60" stroke="#FFFFFF" stroke-width="5" fill="none" stroke-linejoin="round"/>'
    + '<g fill="#F3D27A"><rect x="78" y="40" width="9" height="10" rx="1.5"/><rect x="304" y="34" width="10" height="11" rx="1.5"/><rect x="514" y="40" width="9" height="10" rx="1.5"/><rect x="772" y="34" width="10" height="11" rx="1.5"/><rect x="1052" y="40" width="9" height="10" rx="1.5"/><rect x="190" y="58" width="8" height="9" rx="1.5"/><rect x="640" y="58" width="8" height="9" rx="1.5"/><rect x="912" y="58" width="8" height="9" rx="1.5"/></g>'
    + '</svg>';

  var DECOR = { december: december };

  /* ───────── はじめに：どの飾りを出すか ───────── */
  // 予定表は、サイトの seasons.csv（列：id, デザインの名前, テーマ, 開始日, 終了日, 確認用のページ, メモ）。
  // 日本時間の今日が「開始日〜終了日」（その日を含む）に入る行の id の飾りを出す。どの行にも入らない日は飾りなし。
  // 同じ表を、Googleスプレッドシート「ぐるり 季節の飾り 一覧」が読み込んでいる（サイトを更新すると、シートにも出る）。
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function todayJst() {
    var d = new Date(Date.now() + (new Date().getTimezoneOffset() + 540) * 60000);
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  function normDate(v) {
    var m = String(v || '').trim().match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/);
    return m ? m[1] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[3]).slice(-2) : '';
  }
  function pickFromCsv(text) {
    var today = todayJst(), found = 'off';
    String(text || '').split(/\r?\n/).slice(1).forEach(function (line) {
      var c = line.split(',');
      var id = String(c[0] || '').trim().toLowerCase(), a = normDate(c[3]), b = normDate(c[4]);
      if (id && a && b && a <= today && today <= b) found = id;
    });
    return found;
  }
  function apply(name) {
    if (!name || name === 'off' || name === 'none' || !DECOR[name]) return;
    document.documentElement.classList.add('season', 'season-' + name);
    ready(function () { DECOR[name](); });
  }

  var q = location.search.match(/[?&]season=([a-z0-9-]+)/i);
  var fixed = q ? q[1].toLowerCase() : String(CFG.season || 'auto').toLowerCase();
  if (fixed !== 'auto') { apply(fixed); return; }
  fetch('seasons.csv', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (t) { apply(pickFromCsv(t)); })
    .catch(function () { /* 予定表が読めないときは、飾りなし（いつものサイトのまま） */ });
})();
