/*
  ぐるり の言語切り替え（日本語・English・한국어・繁體中文）
  サイトの決まった文章は、ここに4つの言語で書いてあります。
  お店ごとの紹介文は、スプレッドシートの「紹介文_en」などの列から読みます。
*/
(function () {
  var LANGS = [
    { code: 'ja', html: 'ja', label: '日本語' },
    { code: 'en', html: 'en', label: 'English' },
    { code: 'ko', html: 'ko', label: '한국어' },
    { code: 'zh', html: 'zh-Hant', label: '繁體中文' }
  ];

  var D = {
    'title.index': ['ぐるり｜ひばりヶ丘の、暮らしのそばにあるお店', 'GURURI | Shops close to everyday life in Hibarigaoka', 'GURURI | 히바리가오카의 일상 가까이에 있는 가게', 'GURURI｜雲雀丘（Hibarigaoka）生活周遭的小店'],
    'title.concept': ['ぐるりについて｜いつもの道に、寄り道をひとつ。', 'About GURURI | One small detour on your everyday path', '구루리 소개 | 늘 다니던 길에, 잠깐 들를 곳 하나', '關於 GURURI｜在熟悉的路上，多一個順道的去處'],
    'brand': ['ぐるり', 'GURURI', 'GURURI', 'GURURI'],
    'lang.label': ['言語', 'Language', '언어', '語言'],
    'nav.menu': ['ぐるりのメニュー', 'GURURI menu', '구루리 메뉴', 'GURURI 選單'],
    'nav.shops': ['お店をさがす', 'Find shops', '가게 찾기', '尋找店家'],
    'nav.about': ['ぐるりについて', 'About GURURI', '구루리 소개', '關於 GURURI'],
    'nav.waza': ['わざのひと', 'WAZANOHITO', 'WAZANOHITO', 'WAZANOHITO'],
    'nav.join': ['掲載について', 'For shop owners', '가게 등록 안내', '刊登說明'],
    'nav.footer': ['フッター', 'Footer', '바닥글', '頁尾'],
    'nav.torimich': ['通り道（TORIMICH）', 'TORIMICH', 'TORIMICH', 'TORIMICH'],

    'hero.copy': ['いつもの道に、寄り道をひとつ。', 'One small detour on your everyday path.', '늘 다니던 길에, 잠깐 들를 곳 하나.', '在熟悉的路上，多一個順道的去處。'],
    'intro.title': ['ひばりヶ丘の、<br>暮らしのそばにあるお店です。', 'Shops close to everyday life<br>in Hibarigaoka.', '히바리가오카의,<br>일상 가까이에 있는 가게입니다.', '雲雀丘（Hibarigaoka）<br>生活周遭的小店。'],
    'intro.p1': ['焼きたてのパン屋さんに、お菓子屋さん、かばん屋さんまで。', 'From bakeries with fresh-baked bread to sweet shops and bag makers.', '갓 구운 빵집부터 과자 가게, 가방 가게까지.', '從剛出爐的麵包店、點心店，到包包店。'],
    'intro.p2': ['いつもの買い物の途中に、ふらりと寄れる場所ばかりです。', 'Each one is easy to drop by on your usual errands.', '평소 장 보러 가는 길에 훌쩍 들를 수 있는 곳들입니다.', '都是平日購物途中，能隨興順道走進去的地方。'],
    'intro.p3': ['紹介文は、お店の方それぞれの言葉で。', 'Each introduction comes in the shop’s own words.', '소개 글은 가게 분들의 말 그대로입니다.', '介紹文字都是店家自己的話。'],
    'intro.p4': ['月に一度、更新されます。', 'Updated once a month.', '한 달에 한 번 업데이트됩니다.', '每月更新一次。'],
    'intro.p5': ['気になるお店があれば、ぜひ足を運んでみてください。', 'If a shop catches your eye, please stop by.', '마음에 드는 가게가 있다면 꼭 들러 보세요.', '若有感興趣的店家，歡迎親自走一趟。'],
    'btn.concept': ['ぐるりのコンセプトを読む', 'Read about GURURI', '구루리의 콘셉트 읽기', '閱讀 GURURI 的理念'],

    'shops.title': ['お店をさがす', 'Find shops', '가게 찾기', '尋找店家'],
    'shops.count': ['{n}軒のお店（全{t}軒）', '{n} shops (of {t})', '가게 {n}곳 (전체 {t}곳)', '{n} 家店（共 {t} 家）'],
    'shops.mt': ['', 'Shop introductions are machine-translated from Japanese.', '가게 소개는 일본어를 자동 번역한 것입니다.', '店家介紹為日文自動翻譯。'],
    'chip.all': ['すべて', 'All', '전체', '全部'],
    'chip.allArea': ['すべてのまち', 'All areas', '모든 지역', '所有地區'],
    'group.genre': ['ジャンルでしぼる', 'Filter by category', '분야로 찾기', '依類別篩選'],
    'group.area': ['まちでしぼる', 'Filter by area', '지역으로 찾기', '依地區篩選'],
    'loading': ['お店の情報を読み込んでいます…', 'Loading shops…', '가게 정보를 불러오는 중…', '正在載入店家資訊…'],
    'empty': ['この組み合わせのお店は、まだありません。', 'No shops match this combination yet.', '이 조건에 맞는 가게가 아직 없습니다.', '目前還沒有符合條件的店家。'],
    'error': ['お店の情報を読み込めませんでした。時間をおいて、もう一度開いてみてください。', 'We couldn’t load the shop information. Please try again in a little while.', '가게 정보를 불러오지 못했습니다. 잠시 후 다시 열어 주세요.', '無法載入店家資訊，請稍後再試一次。'],
    'map.aria': ['{name}の場所をGoogleマップで見る（{city}）', 'See where {name} is on Google Maps ({city})', '{name} 위치를 Google 지도에서 보기 ({city})', '在 Google 地圖查看 {name} 的位置（{city}）'],
    'photo.alt': ['{name}の写真', 'Photo of {name}', '{name} 사진', '{name} 的照片'],

    'ig.title': ['街のお気に入りが、もっと見つかるように。', 'So you can find more favorite spots around town.', '동네의 단골집을 더 많이 찾을 수 있도록.', '讓你在街區找到更多心頭好。'],
    'ig.p1': ['ぐるりには、これからもすてきなお店が次々と加わっていく予定です。', 'More wonderful shops will keep joining GURURI.', '구루리에는 앞으로도 멋진 가게들이 계속 더해질 예정입니다.', 'GURURI 之後也會陸續加入更多美好的店家。'],
    'ig.p2': ['最新のお知らせは、Instagramから受け取れます。', 'Get the latest news on Instagram.', '최신 소식은 Instagram에서 받아 보실 수 있습니다.', '最新消息請在 Instagram 上查看。'],
    'ig.btn': ['Instagramをフォローする', 'Follow on Instagram', 'Instagram 팔로우하기', '追蹤 Instagram'],

    'waza.title': ['人と技に目を向けたページ「わざのひと」', 'WAZANOHITO: a page about people and their craft', '사람과 기술에 주목한 페이지 ‘WAZANOHITO’', '關注人與技藝的頁面「WAZANOHITO」'],
    'waza.p': ['ぐるりは、人と地域に目を向けたページです。人と技に目を向けたページが、「わざのひと」です。ひとつの技を長く磨いてきた方たちを、その技とともに紹介しています。', 'GURURI looks at people and their neighborhood. WAZANOHITO looks at people and their craft, introducing those who have long refined a single skill, together with that skill.', '구루리는 사람과 지역에 주목한 페이지입니다. 사람과 기술에 주목한 페이지가 ‘WAZANOHITO’입니다. 하나의 기술을 오랫동안 갈고닦아 온 분들을 그 기술과 함께 소개합니다.', 'GURURI 是關注人與地方的頁面。關注人與技藝的頁面則是「WAZANOHITO」，介紹長年磨練一項技藝的人們，以及他們的技藝。'],
    'waza.btn': ['わざのひとを見る', 'See WAZANOHITO', 'WAZANOHITO 보기', '查看 WAZANOHITO'],
    'join.title': ['ぐるりへの掲載をご希望のお店の方へ', 'For shops interested in being featured on GURURI', '구루리 게재를 희망하시는 가게 분들께', '想刊登於 GURURI 的店家'],
    'join.btn': ['掲載について見る', 'Learn about listing', '게재 안내 보기', '查看刊登說明'],

    'c.hero': ['いつもの道に、<br>寄り道をひとつ。', 'One small detour<br>on your everyday path.', '늘 다니던 길에,<br>잠깐 들를 곳 하나.', '在熟悉的路上，<br>多一個順道的去處。'],
    'c.lead1': ['毎日通る道にも、まだ扉を開けたことのないお店があります。', 'Even on the streets you walk every day, there are shops whose doors you have never opened.', '매일 지나는 길에도 아직 문을 열어 본 적 없는 가게가 있습니다.', '即使是每天經過的路上，也有還沒推開門走進去過的店。'],
    'c.lead2': ['ぐるりは、そんなお店をひとつずつ紹介しているページです。', 'GURURI introduces those shops, one at a time.', '구루리는 그런 가게를 하나씩 소개하는 페이지입니다.', 'GURURI 就是一間一間介紹這些店家的頁面。'],
    'c.values': ['ぐるりが大切にしていること', 'What GURURI values', '구루리가 소중히 여기는 것', 'GURURI 重視的事'],
    'v1.h': ['お店の方の言葉で', 'In the shop’s own words', '가게 분들의 말 그대로', '用店家自己的話'],
    'v1.p': ['紹介文は、お店の方からいただいた言葉をそのまま載せています。店先で少しお話を聞くような気持ちで、読んでみてください。', 'We publish each introduction just as the shop wrote it. Read it as if you were chatting for a moment at the shop front.', '소개 글은 가게 분들께 받은 말을 그대로 싣고 있습니다. 가게 앞에서 잠깐 이야기를 듣는 기분으로 읽어 주세요.', '介紹文字直接刊登店家提供的話語。請用在店門口稍微聊上幾句的心情來閱讀。'],
    'v2.h': ['毎月、すこしずつ新しく', 'A little new, every month', '매달 조금씩 새롭게', '每個月，一點一點更新'],
    'v2.p': ['お店の情報は毎月更新し、あたらしく加わったお店もご紹介しています。', 'Shop information is updated every month, and we introduce newly joined shops too.', '가게 정보는 매달 업데이트하며, 새로 합류한 가게도 소개합니다.', '店家資訊每月更新，也會介紹新加入的店家。'],
    'v3.h': ['垣根をこえて、となりに', 'Side by side, across boundaries', '경계를 넘어, 나란히', '跨越界線，比鄰而居'],
    'v3.p': ['カフェのとなりに、かばん屋さん。花屋さんのとなりに、フォトスタジオ。業種や市の境目にとらわれず、近くの気になるお店を並べています。', 'A bag shop next to a café. A photo studio next to a flower shop. We place interesting nearby shops side by side, regardless of business type or city lines.', '카페 옆에 가방 가게, 꽃집 옆에 사진관. 업종이나 시의 경계에 얽매이지 않고, 가까이 있는 마음 가는 가게들을 나란히 소개합니다.', '咖啡館旁邊是包包店，花店旁邊是照相館。不拘業種或市界，把附近令人好奇的店家並排介紹。'],
    'view.h': ['目指している景色', 'The scene we hope for', '우리가 그리는 풍경', '我們嚮往的風景'],
    'view.p1': ['訪れた方が、心から楽しんでくださること。', 'That everyone who visits truly enjoys their time.', '찾아오신 분들이 진심으로 즐거워하시는 것.', '讓來訪的人打從心底感到愉快。'],
    'view.p2': ['その時間が、お店の力になり、', 'That this time becomes a source of strength for the shops,', '그 시간이 가게의 힘이 되고,', '讓這段時光成為店家的力量，'],
    'view.p3': ['まちの潤いにつながっていくこと。', 'and brings richness to the town.', '마을을 풍요롭게 하는 것으로 이어지는 것.', '進而滋潤整個街區。'],
    'view.p4': ['ぐるりが目指しているのは、そんな景色です。', 'That is the scene GURURI hopes to see.', '구루리가 바라는 것은 그런 풍경입니다.', '這就是 GURURI 嚮往的風景。'],
    'next.h': ['これから', 'What’s next', '앞으로', '接下來'],
    'next.p1': ['はじまりは、ひばりが丘から。', 'It all starts in Hibarigaoka.', '시작은 히바리가오카에서.', '從雲雀丘（Hibarigaoka）開始。'],
    'next.p2': ['これから少しずつ、西武線沿線のまちへも広げていきます。', 'Little by little, we will expand to other towns along the Seibu Line.', '앞으로 조금씩 세이부선 연선의 마을로도 넓혀 갈 예정입니다.', '接下來會一步步擴展到西武線沿線的其他街區。'],
    'next.p3': ['地域の学校やお店と一緒に、まちで過ごす時間がもっと楽しくなる企画も考えています。', 'We are also planning projects with local schools and shops to make time in town even more enjoyable.', '지역 학교, 가게와 함께 마을에서 보내는 시간이 더 즐거워지는 기획도 준비하고 있습니다.', '也正在與當地學校和店家一起，構思讓在街區度過的時光更加愉快的企劃。'],
    'cta.h': ['気になるお店が見つかったら、<br>いつもの道の途中で、ふらりと寄ってみてください。', 'When a shop catches your eye,<br>drop by on your usual way.', '마음에 드는 가게를 찾았다면,<br>늘 다니던 길에 훌쩍 들러 보세요.', '找到感興趣的店家時，<br>就在平常的路上順道走進去看看吧。'],
    'cta.btn': ['ぐるりを見る', 'Explore GURURI', '구루리 둘러보기', '瀏覽 GURURI']
  };

  // お店の情報に出てくる言葉（シートに訳がないときに使う）
  var WORDS = {
    'パン・お菓子': ['パン・お菓子', 'Bakery & Sweets', '빵·과자', '麵包／點心'],
    '食事・カフェ': ['食事・カフェ', 'Food & Café', '식사·카페', '餐飲／咖啡'],
    '雑貨・ギフト': ['雑貨・ギフト', 'Goods & Gifts', '잡화·선물', '雜貨／禮品'],
    '教室・体験': ['教室・体験', 'Classes & Experiences', '클래스·체험', '課程／體驗'],
    '暮らし': ['暮らし', 'Daily Life', '생활', '生活'],
    '西東京市': ['西東京市', 'Nishitokyo', '니시도쿄시', '西東京市'],
    '新座市': ['新座市', 'Niiza', '니자시', '新座市'],
    '東久留米市': ['東久留米市', 'Higashikurume', '히가시쿠루메시', '東久留米市'],
    '練馬区': ['練馬区', 'Nerima', '네리마구', '練馬區'],
    '清瀬市': ['清瀬市', 'Kiyose', '기요세시', '清瀨市'],
    '現金のみ': ['現金のみ', 'Cash only', '현금만 가능', '僅收現金'],
    '公式サイト': ['公式サイト', 'Official website', '공식 사이트', '官方網站'],
    '予約サイト': ['予約サイト', 'Reservations', '예약 사이트', '預約網站'],
    '紹介ページ': ['紹介ページ', 'Feature page', '소개 페이지', '介紹頁面'],
    'くわしく見る': ['くわしく見る', 'Learn more', '자세히 보기', '查看詳情']
  };

  var IDX = { ja: 0, en: 1, ko: 2, zh: 3 };
  var KEY = 'gururi_lang';

  function pickInitial() {
    var q = (location.search.match(/[?&]lang=(ja|en|ko|zh)/) || [])[1];
    if (q) return q;
    try { var s = localStorage.getItem(KEY); if (s && IDX[s] !== undefined) return s; } catch (e) {}
    var n = (navigator.language || 'ja').toLowerCase();
    if (n.indexOf('ja') === 0) return 'ja';
    if (n.indexOf('ko') === 0) return 'ko';
    if (n.indexOf('zh') === 0) return 'zh';
    return 'en';
  }

  var lang = pickInitial();

  function t(key, vars) {
    var row = D[key];
    var s = row ? (row[IDX[lang]] || row[0]) : key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }
  function word(w) {
    var row = WORDS[w];
    return row ? row[IDX[lang]] : w;
  }

  function apply() {
    var meta = LANGS[IDX[lang]];
    document.documentElement.lang = meta.html;
    var page = document.body.getAttribute('data-page');
    if (page) document.title = t('title.' + page);
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) { el.setAttribute('alt', t(el.getAttribute('data-i18n-alt'))); });
    // 日本語以外は、英語ページ用の GURURI ロゴにする
    document.querySelectorAll('img[data-logo]').forEach(function (img) {
      var white = img.getAttribute('data-logo') === 'white';
      img.src = 'assets/' + (lang === 'ja' ? 'logo' : 'logo-en') + (white ? '-white' : '') + '.svg';
    });
    document.querySelectorAll('select.lang-select').forEach(function (sel) { sel.value = lang; });
    document.dispatchEvent(new CustomEvent('gururi:lang', { detail: lang }));
  }

  function set(code) {
    if (IDX[code] === undefined) return;
    lang = code;
    try { localStorage.setItem(KEY, code); } catch (e) {}
    apply();
  }

  window.GURURI_I18N = {
    get lang() { return lang; },
    t: t, word: word, set: set,
    suffix: function () { return lang === 'ja' ? '' : '_' + lang; }
  };

  function init() {
    document.querySelectorAll('select.lang-select').forEach(function (sel) {
      sel.innerHTML = LANGS.map(function (l) { return '<option value="' + l.code + '">' + l.label + '</option>'; }).join('');
      sel.addEventListener('change', function () { set(sel.value); });
    });
    apply();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
