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
    'title.index': ['ぐるり ひばりヶ丘｜ひばりヶ丘の、暮らしのそばにあるお店', 'GURURI Hibarigaoka | Local shops close to everyday life', 'GURURI Hibarigaoka | 히바리가오카의 일상 가까이에 있는 가게', 'GURURI Hibarigaoka｜雲雀丘生活周邊的店家'],
    'title.privacy': ['プライバシーポリシー｜ぐるり ひばりヶ丘', 'Privacy Policy | GURURI Hibarigaoka', '개인정보 처리방침 | GURURI Hibarigaoka', '隱私權政策｜GURURI Hibarigaoka'],
    'nav.privacy': ['プライバシーポリシー', 'Privacy Policy', '개인정보 처리방침', '隱私權政策'],
    'pp.note': ['', '', '이 개인정보 처리방침은 일본어판과 영어판만 있습니다. 아래는 영어판입니다. 일본어판과 영어판의 의미가 다를 경우 일본어판이 우선합니다.', '本隱私權政策僅提供日文版與英文版。以下為英文版。日文版與英文版內容有出入時，以日文版為準。'],
    'title.concept': ['ぐるりについて｜ぐるり ひばりヶ丘', 'About GURURI | GURURI Hibarigaoka', '구루리 소개 | GURURI Hibarigaoka', '關於 GURURI｜GURURI Hibarigaoka'],
    'brand': ['ぐるり ひばりヶ丘', 'GURURI Hibarigaoka', 'GURURI Hibarigaoka', 'GURURI Hibarigaoka'],
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
    'coupon.btn': ['ぐるりクーポン', 'GURURI coupon', '구루리 쿠폰', 'GURURI 優惠券'],
    'coupon.title': ['クーポン', 'COUPON', '쿠폰', '優惠券'],
    'coupon.today': ['今日の日付', 'Today', '오늘 날짜', '今天日期'],
    'coupon.until': ['有効期限', 'Valid until', '유효기간', '有效期限'],
    'coupon.untilv': ['{d}まで', '{d}', '{d}까지', '至{d}'],
    'coupon.show': ['お会計の前に、この画面をお店の方に見せてください', 'Please show this screen to the staff before you pay.', '계산하기 전에 이 화면을 가게 직원에게 보여 주세요.', '結帳前，請向店家出示此畫面。'],
    'coupon.cond': ['使える条件', 'Conditions', '이용 조건', '使用條件'],
    'coupon.c1': ['1会計につき1回', 'Once per payment', '1회 계산당 1번', '每次結帳限用1次'],
    'coupon.c2': ['お会計の前に、画面をご提示ください', 'Show this screen before you pay', '계산 전에 화면을 제시해 주세요', '請於結帳前出示畫面'],
    'coupon.c3': ['ほかの割引・クーポンとの併用はできません', 'Cannot be combined with other discounts or coupons', '다른 할인·쿠폰과 함께 사용할 수 없습니다', '不可與其他折扣或優惠券併用'],
    'coupon.c4': ['有効期限：その月の末日まで', 'Valid until the last day of the month', '유효기간: 해당 월 말일까지', '有效期限：至當月最後一天'],
    'coupon.c5': ['内容は予告なく変わることがあります。お店の判断で終了することがあります', 'Details may change without notice. The shop may end this offer at its discretion', '내용은 예고 없이 변경될 수 있습니다. 가게의 판단으로 종료될 수 있습니다', '內容可能未經通知而變更，店家亦可能自行決定終止'],
    'coupon.chip': ['クーポンあり', 'With coupon', '쿠폰 있음', '有優惠券'],
    'coupon.banner.h': ['ぐるりクーポン', 'GURURI coupons', '구루리 쿠폰', 'GURURI 優惠券'],
    'coupon.banner.p': ['クーポンのあるお店を見る', 'See shops with coupons', '쿠폰이 있는 가게 보기', '查看有優惠券的店家'],
    'group.coupon': ['クーポンでしぼる', 'Filter by coupon', '쿠폰으로 좁히기', '依優惠券篩選'],
    'coupon.close': ['閉じる', 'Close', '닫기', '關閉'],
    'search.label': ['キーワードでさがす', 'Search by keyword', '키워드로 찾기', '以關鍵字搜尋'],
    'search.ph': ['店名やキーワードでさがす（例：ベーグル、書道）', 'Search by name or keyword (e.g. bagel)', '가게 이름이나 키워드로 찾기 (예: 베이글)', '以店名或關鍵字搜尋（例：貝果）'],
    'search.clear': ['キーワードを消す', 'Clear search', '검색어 지우기', '清除搜尋'],
    'empty.q': ['「{q}」に当てはまるお店は見つかりませんでした。ほかの言葉でもお試しください。', 'No shops found for “{q}”. Try another word.', '“{q}”에 해당하는 가게를 찾지 못했습니다. 다른 단어로 찾아보세요.', '找不到符合「{q}」的店家，請試試其他關鍵字。'],
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
    'waza.p': ['ぐるりは、人と地域に目を向けたページです。人と技に目を向けたページが、「わざのひと」です。ひとつの技に向き合い続けている方たちを、その技とともに紹介しています。', 'GURURI looks at people and their neighborhood. WAZANOHITO looks at people and their craft, introducing people who keep devoting themselves to a single craft, together with that craft.', '구루리는 사람과 지역에 주목한 페이지입니다. 사람과 기술에 주목한 페이지가 ‘WAZANOHITO’입니다. 하나의 기술과 꾸준히 마주하고 있는 분들을 그 기술과 함께 소개합니다.', 'GURURI 是關注人與地方的頁面。關注人與技藝的頁面則是「WAZANOHITO」，介紹持續專注於一項技藝的人們，以及他們的技藝。'],
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
    'team.h': ['ぐるりの運営者', 'Who runs GURURI', '구루리 운영자', 'GURURI 的營運者'],
    'team.t.role': ['地域メディア', 'Local media', '지역 미디어', '在地媒體'],
    'team.t.name': ['TORIMICH', 'TORIMICH', 'TORIMICH', 'TORIMICH'],
    'team.t.sub': ['通り道', 'Torimichi', 'Torimichi', '通り道'],
    'team.t.p': ['ひばりヶ丘を拠点に、地域の人と技を伝えています。ぐるりでは、ウェブページの運営とお店とのやりとりを担当しています。', 'Based in Hibarigaoka, we share the people and crafts of the area. At GURURI, we run the website and work with the shops.', '히바리가오카를 거점으로 지역의 사람과 기술을 전하고 있습니다. 구루리에서는 웹페이지 운영과 가게와의 소통을 맡고 있습니다.', '以雲雀丘（Hibarigaoka）為據點，介紹在地的人與技藝。在 GURURI 負責網站營運與店家聯繫。'],
    'team.l.role': ['西武線沿線のカフェ紹介', 'Cafes along the Seibu Line', '세이부선 연선의 카페 소개', '西武線沿線的咖啡館介紹'],
    'team.l.name': ['<span class="nw">ラテさん｜</span><span class="nw">西武線カフェさんぽ</span>', '<span class="nw">Latte |</span> <span class="nw">Seibu-sen Cafe Sanpo</span>', '<span class="nw">라테 님｜</span><span class="nw">세이부선 카페 산책</span>', '<span class="nw">Latte｜</span><span class="nw">西武線咖啡散步</span>'],
    'team.l.link': ['ラテさん｜西武線カフェさんぽ', 'Latte | Seibu-sen Cafe Sanpo', '라테 님｜세이부선 카페 산책', 'Latte｜西武線咖啡散步'],
    'team.l.p': ['西武線沿線のカフェを巡り、Instagramで紹介しています。ぐるりでは、SNSの運用と広告を担当しています。', 'Visits cafes along the Seibu Line and introduces them on Instagram. At GURURI, she handles social media and promotion.', '세이부선 연선의 카페를 찾아다니며 Instagram에서 소개하고 있습니다. 구루리에서는 SNS 운영과 홍보를 맡고 있습니다.', '走訪西武線沿線的咖啡館，並在 Instagram 上介紹。在 GURURI 負責社群經營與宣傳。'],
    'ft.op': ['運営：<span class="nw">TORIMICH（通り道）</span>・<span class="nw">ラテさん｜</span><span class="nw">西武線カフェさんぽ</span>', 'Run by <span class="nw">TORIMICH</span> and <span class="nw">Latte |</span> <span class="nw">Seibu-sen Cafe Sanpo</span>', '운영: <span class="nw">TORIMICH</span> · <span class="nw">라테 님｜</span><span class="nw">세이부선 카페 산책</span>', '營運：<span class="nw">TORIMICH</span>・<span class="nw">Latte｜</span><span class="nw">西武線咖啡散步</span>'],
    'team.t.link': ['ウェブサイト', 'Website', '웹사이트', '網站'],
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


  // お店の名前の訳（シートに「店名_en」などがあれば、そちらが優先）。キーは日本語の店名（空白・改行を除いたもの）
  var NAMES = {
    '橋本商店': ['Hashimoto Shoten', '하시모토 상점', '橋本商店'],
    'こはるびよりふぉとスタジオ': ['Koharubiyori Photo Studio', '코하루비요리 포토 스튜디오', 'Koharubiyori 照相館'],
    'じびえ': ['Jibie', '지비에', 'Jibie'],
    '墨庵ひばりがおか教室': ['Bokuan Calligraphy School, Hibarigaoka', '보쿠안 서예교실 히바리가오카', '墨庵 雲雀丘教室'],
    '米粉パンの店コイガクボ保谷店': ['Koigakubo Rice Flour Bakery, Hoya', '쌀가루 빵집 코이가쿠보 호야점', '米粉麵包店 Koigakubo 保谷店'],
    '正心道空手ひばりヶ丘道場': ['Seishindo Karate, Hibarigaoka Dojo', '세이신도 가라테 히바리가오카 도장', '正心道空手 雲雀丘道場'],
    '100円レンタカー新座ひばりが丘店': ['100 Yen Rent-a-Car, Niiza Hibarigaoka', '100엔 렌터카 니자 히바리가오카점', '100日圓租車 新座雲雀丘店'],
    '美容室マキシム': ['Hair Salon Maxime', '미용실 막심', '美容室 Maxime'],
    'こんぺい陶': ['Konpeito', '곤페이토', 'Konpeito'],
    'ブーランジェリー・ビアリッツ': ['Boulangerie Biarritz', '불랑제리 비아리츠', 'Boulangerie Biarritz'],
    '手創りかばん工房クラクフ': ['Krakow Handmade Bag Studio', '수제 가방 공방 크라쿠프', '手作包包工坊 Krakow'],
    '稲毛屋': ['Inageya', '이나게야', '稻毛屋']
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
  function shopName(ja) {
    if (lang === 'ja') return '';
    var row = NAMES[String(ja).replace(/\s+/g, '')];
    return row ? row[IDX[lang] - 1] : '';
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
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
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
    allWords: function (list) { return list.filter(Boolean).map(function (w) { return (WORDS[w] || [w]).join(' '); }).join(' '); },
    allNames: function (ja) { return (NAMES[String(ja).replace(/\s+/g, '')] || []).join(' '); },
    t: t, word: word, set: set, shopName: shopName,
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
