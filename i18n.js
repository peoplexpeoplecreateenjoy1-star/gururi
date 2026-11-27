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
    'title.join': ["掲載について｜ぐるり ひばりヶ丘", "For shop owners | GURURI Hibarigaoka", "가게 등록 안내 | GURURI Hibarigaoka", "刊登說明｜GURURI Hibarigaoka"],
    'jn.kicker': ["掲載をお考えのお店の方へ", "For shops considering a listing", "등록을 생각하고 계신 가게분들께", "給考慮刊登的店家"],
    'jn.h1': ["地域の方に、<wbr>お店を知ってもらう<wbr>きっかけを。", "A way for your neighbors to discover your shop.", "이웃에게 가게를 알릴 수 있는 계기를.", "讓在地的人，有機會認識您的店。"],
    'jn.lead': ["<span class=\"nw\">ぐるり ひばりヶ丘は、</span><wbr><span class=\"nw\">ひばりヶ丘とその周りの</span><span class=\"nw\">お店に寄り添う、</span><br><span class=\"nw\">地域密着・伴走型のメディアです。</span><br><span class=\"nw\">ウェブ・SNS・ポスターの3つで、</span><br><span class=\"nw\">お店の魅力を地域の方に届けます。</span>", "GURURI Hibarigaoka is a local media that stays close to the shops in and around Hibarigaoka and walks alongside them. Through our website, social media, and posters, we share what makes your shop special with people in the area.", "GURURI Hibarigaoka는 히바리가오카와 그 주변 가게에 다가가 함께 걸어가는 지역 밀착형 미디어입니다. 웹사이트, SNS, 포스터 세 가지로 가게의 매력을 지역 분들께 전합니다.", "GURURI Hibarigaoka 是貼近雲雀丘及周邊店家、與店家一起前進的在地媒體。透過網站、社群媒體與海報三種方式，把店家的魅力傳達給在地的人。"],
    'jn.flowlink': ["掲載までの流れを見る", "See how it works", "등록 절차 보기", "查看刊登流程"],
    'jn.w.h': ["こんなお悩みは<wbr>ありませんか", "Do any of these sound familiar?", "이런 고민은 없으신가요?", "您是否有這些煩惱？"],
    'jn.w1.h': ["地域の方に、<wbr>まだ知られていない", "People nearby don’t know about you yet", "지역 분들이 아직 잘 모른다", "附近的人還不認識您的店"],
    'jn.w1.p': ["近くに住んでいても、<wbr>お店の存在を<wbr>知らない方が<wbr>多い。", "Even people who live close by often don’t know your shop is there.", "가까이 살아도 가게가 있는 줄 모르는 분이 많다.", "即使住在附近，很多人也不知道您的店。"],
    'jn.w2.h': ["自分で発信する<wbr>時間がない", "No time to post on your own", "직접 알릴 시간이 없다", "沒有時間自己宣傳"],
    'jn.w2.p': ["製造や接客で<wbr>手いっぱいで、<wbr>SNSを続けるのが<wbr>難しい。", "Making and serving keep you busy, so keeping up with social media is hard.", "제조와 접객으로 바빠서 SNS를 꾸준히 하기 어렵다.", "忙於製作與接待客人，很難持續經營社群媒體。"],
    'jn.w3.h': ["外に頼むと、<wbr>費用が高く<wbr>効果も見えにくい", "Outsourcing is costly and hard to measure", "외부에 맡기면 비용이 들고 효과도 잘 안 보인다", "委託外部費用高，效果也看不清楚"],
    'jn.w3.p': ["SNS運用の代行は<wbr>費用がかかり、<wbr>効果が分からない。", "Social media agencies cost money, and it’s hard to tell if they help.", "SNS 운영 대행은 비용이 들고 효과를 알기 어렵다.", "代操社群媒體需要費用，也不知道有沒有效果。"],
    'jn.w4.h': ["ネットだけで、<wbr>近所の方に<wbr>届くか不安", "Unsure if online posts reach your neighbors", "온라인만으로 이웃에게 닿을지 불안하다", "只靠網路，不確定能否觸及附近的人"],
    'jn.w4.p': ["発信しても、<wbr>地域の方が見て、<wbr>来店につながるのか<wbr>分からない。", "Even when you post, you can’t tell whether local people see it and come by.", "알려도 지역 분들이 보고 방문으로 이어질지 모르겠다.", "即使發布了，也不知道在地的人是否看到、是否會來店。"],
    'jn.c.h': ["ぐるりが<wbr>できること", "What GURURI can do", "구루리가 할 수 있는 것", "GURURI 能做的事"],
    'jn.c.for': ["こたえるお悩み", "Helps with", "이런 고민에", "對應的煩惱"],
    'jn.c1.h': ["ウェブページ", "Website", "웹사이트", "網站"],
    'jn.c1.p': ["お店のページが、<wbr>いつでも見られる<wbr>場所に残ります。<wbr>フォームに<wbr>5分ほど記入するだけで、<wbr>内容の更新も<wbr>月1回まで自由です。", "Your shop’s page stays where anyone can see it, anytime. Just fill in a form in about 5 minutes, and you can update it up to once a month.", "가게 페이지가 언제든 볼 수 있는 곳에 남습니다. 양식에 5분 정도 적기만 하면 되고, 내용은 한 달에 한 번까지 자유롭게 바꿀 수 있습니다.", "店家頁面會留在隨時都能看到的地方。只要花約5分鐘填寫表單，每月也可以更新一次內容。"],
    'jn.c2.h': ["SNS", "Social media", "SNS", "社群媒體"],
    'jn.c2.p': ["西武線沿線のカフェを<wbr>紹介している、<wbr><span class=\"nw\">ラテさん｜</span><span class=\"nw\">西武線カフェさんぽが、</span><wbr>ぐるりのInstagramを<wbr>運用し、<wbr>幅広い世代へ<wbr>届けます。", "ラテさん｜西武線カフェさんぽ, who introduces cafés along the Seibu Line, runs GURURI’s Instagram and reaches people of all ages.", "세이부선 연선의 카페를 소개하는 ラテさん｜西武線カフェさんぽ가 구루리 Instagram을 운영하며 폭넓은 세대에게 전합니다.", "介紹西武線沿線咖啡廳的 ラテさん｜西武線カフェさんぽ，經營 GURURI 的 Instagram，傳達給各個世代。"],
    'jn.c3.h': ["ポスター", "Posters", "포스터", "海報"],
    'jn.c3.p': ["地域のお店や学校に、<wbr>ぐるりのポスターを<wbr>掲示しています。<wbr>QRコードから、<wbr>近所の方が<wbr>ページを見てくれています。", "GURURI posters are displayed at local shops and schools. Neighbors visit the page through the QR code.", "지역 가게와 학교에 구루리 포스터를 붙이고 있습니다. QR코드로 이웃 분들이 페이지를 보고 있습니다.", "GURURI 的海報張貼在在地的店家與學校，附近的人會透過 QR 碼來看頁面。"],
    'jn.c.close': ["ウェブ・SNS・ポスターを<wbr>組み合わせることで、<wbr>ネットだけでは<wbr>届きにくい<wbr>地域の方にも、<wbr>お店を知っていただく<wbr>機会をつくります。", "By combining the website, social media, and posters, we create chances for local people—including those hard to reach online—to learn about your shop.", "웹사이트, SNS, 포스터를 함께 활용해, 온라인만으로는 닿기 어려운 지역 분들에게도 가게를 알릴 기회를 만듭니다.", "結合網站、社群媒體與海報，讓只靠網路難以觸及的在地居民，也有機會認識您的店。"],
    'jn.s.h': ["数字で見るぐるり", "GURURI in numbers", "숫자로 보는 구루리", "數字看 GURURI"],
    'jn.s.views': ["ページが<wbr>見られた回数<small>（月間）</small>", "Page views <small>(per month)</small>", "페이지 조회수 <small>(월간)</small>", "頁面瀏覽次數<small>（每月）</small>"],
    'jn.s.posters': ["ポスターの<wbr>掲示先", "Places with our posters", "포스터 게시 장소", "海報張貼地點"],
    'jn.s.followers': ["Instagramの<wbr>フォロワー", "Instagram followers", "Instagram 팔로워", "Instagram 追蹤者"],
    'jn.s.langsN': ["4言語", "4 languages", "4개 언어", "4種語言"],
    'jn.s.langs': ["海外の方にも<wbr>読めるように", "Japanese, English, Korean, and Chinese—for visitors from abroad, too", "일본어·영어·한국어·중국어로 해외 분들께도", "日文、英文、韓文、中文，也能觸及海外旅客"],
    'jn.b.h': ["お店と一緒に歩く、<wbr>伴走型のメディアです", "A media that walks alongside your shop", "가게와 함께 걷는 동행형 미디어입니다", "與店家同行的媒體"],
    'jn.b.lead': ["ぐるりは、<wbr>載せて終わりでは<wbr>ありません。<wbr>お店の声を聞きながら、<wbr>一緒に地域を<wbr>盛り上げていきたいと<wbr>考えています。", "GURURI doesn’t end at listing your shop. We listen to you and hope to liven up the neighborhood together.", "구루리는 싣고 끝이 아닙니다. 가게의 목소리를 들으며 함께 지역을 활기차게 만들고 싶습니다.", "GURURI 不是刊登完就結束。我們傾聽店家的聲音，希望一起讓在地更熱鬧。"],
    'jn.b1.h': ["お店の声から、<wbr>仕組みを作る", "Ideas from shops become features", "가게의 목소리로 기능을 만듭니다", "從店家的聲音打造機制"],
    'jn.b1.p': ["メンバーのお店からの<wbr>ご提案をきっかけに、<wbr>クーポンの機能が<wbr>生まれました。", "Our coupon feature was born from a member shop’s suggestion.", "회원 가게의 제안을 계기로 쿠폰 기능이 생겼습니다.", "優惠券功能就是因會員店家的提議而誕生。"],
    'jn.b2.h': ["いつでも相談できる<wbr>窓口", "A contact you can always reach", "언제든 상담할 수 있는 창구", "隨時可以諮詢的窗口"],
    'jn.b2.p': ["掲載の内容や、<wbr>イベントのお知らせなど、<wbr>運営窓口に<wbr>気軽にご相談いただけます。", "Feel free to talk to us about your listing, event announcements, and more.", "게재 내용이나 이벤트 안내 등, 운영 창구에 편하게 상담하실 수 있습니다.", "關於刊登內容或活動公告等，都可以輕鬆向營運窗口諮詢。"],
    'jn.b3.h': ["毎月、一緒に見直す", "Review together every month", "매달 함께 되돌아봅니다", "每月一起檢視"],
    'jn.b3.p': ["ページがどれくらい<wbr>見られたかを<wbr>もとに、<wbr>写真や紹介文を<wbr>月1回まで<wbr>見直せます。", "Based on how often your page was viewed, you can refresh your photos and text up to once a month.", "페이지가 얼마나 보였는지를 바탕으로, 사진과 소개글을 한 달에 한 번까지 다시 다듬을 수 있습니다.", "根據頁面被瀏覽的次數，每月可調整一次照片與介紹文。"],
    'jn.b4.h': ["地域とつなぐ", "Connecting with the community", "지역과 이어 줍니다", "與在地連結"],
    'jn.b4.p': ["地域のお店や学校への<wbr>ポスター掲示、<wbr>Dream Share Atelierさんとの<wbr>連携など、<wbr>お店と地域を<wbr>つなぐ場を<wbr>広げています。", "Through posters at local shops and schools and our partnership with Dream Share Atelier, we keep creating places that connect shops with the community.", "지역 가게와 학교에 포스터 게시, Dream Share Atelier와의 연계 등 가게와 지역을 잇는 자리를 넓혀 가고 있습니다.", "透過在在地店家與學校張貼海報、與 Dream Share Atelier 合作等，持續擴大連結店家與在地的場域。"],
    'jn.p.h': ["メンバー特典", "Member benefits", "회원 혜택", "會員福利"],
    'jn.p1.h': ["お試しの場", "A place to try things out", "시험해 볼 수 있는 공간", "試辦的場地"],
    'jn.p1.p': ["Dream Share Atelierの<wbr>アトリエを、<wbr>会員料金で<wbr>使えます。<wbr>教室のお試しや<wbr>試食会、<wbr>ワークショップなどに。", "Use the Dream Share Atelier studio at member rates—for trial classes, tastings, workshops, and more.", "Dream Share Atelier의 아틀리에를 회원 요금으로 이용할 수 있습니다. 체험 수업, 시식회, 워크숍 등에.", "可用會員價使用 Dream Share Atelier 的工作室，適合體驗課、試吃會、工作坊等。"],
    'jn.p2.h': ["毎月のお知らせ", "Monthly updates", "매달 소식", "每月通知"],
    'jn.p2.p': ["お店のページの<wbr>閲覧数や、<wbr>ぐるりからの<wbr>お知らせを、<wbr>メールでお届けします。", "We email you your page’s view count and news from GURURI.", "가게 페이지 조회수와 구루리 소식을 메일로 보내 드립니다.", "以電子郵件寄送店家頁面的瀏覽數與 GURURI 的消息。"],
    'jn.p3.h': ["クーポン", "Coupons", "쿠폰", "優惠券"],
    'jn.p3.p': ["出すかどうかも、<wbr>内容も、<wbr>お店が自由に<wbr>決められます。<wbr>来店のきっかけづくりに。", "Whether to offer one and what it includes are entirely up to you—a small reason for people to visit.", "낼지 말지, 내용도 가게가 자유롭게 정할 수 있습니다. 방문의 계기로.", "是否提供、內容為何，都由店家自由決定，作為來店的契機。"],
    'jn.f.h': ["掲載までの流れ", "How listing works", "게재까지의 흐름", "刊登流程"],
    'jn.f1': ["フォームに記入<small>（5分ほど）</small>", "Fill in the form <small>(about 5 min)</small>", "양식 작성 <small>(5분 정도)</small>", "填寫表單<small>（約5分鐘）</small>"],
    'jn.f2': ["運営が内容を確認", "We review it", "운영자가 내용 확인", "營運確認內容"],
    'jn.f3': ["ページに掲載", "Your page goes live", "페이지에 게재", "刊登於頁面"],
    'jn.f4': ["内容は月1回まで<wbr>更新できます", "Update up to once a month", "내용은 한 달에 한 번까지 수정 가능", "每月可更新一次內容"],
    'jn.g.h': ["ぐるりに<wbr>掲載しているお店", "The shops we feature", "구루리에 소개하는 가게", "GURURI 介紹的店家"],
    'jn.g.lead': ["ぐるり ひばりヶ丘は、<br class=\"sp-br\"><span class=\"nw\">「こんなところに、こんなすてきなお店が</span><br><span class=\"nw\">あったんだ」という出会いを</span><wbr><span class=\"nw\">大切にしています。</span><br><span class=\"nw\">そのため、</span><wbr><span class=\"nw\">次のようなお店に</span><wbr><span class=\"nw\">掲載をお願いしています。</span>", "GURURI Hibarigaoka treasures the moment of discovering “I never knew such a lovely shop was here.” That is why we ask shops like these to join us.", "구루리 히바리가오카는 \"이런 곳에 이렇게 멋진 가게가 있었구나\" 하는 만남을 소중히 여깁니다. 그래서 다음과 같은 가게에 게재를 부탁드리고 있습니다.", "GURURI Hibarigaoka 珍惜「原來這裡有這麼棒的店」的相遇，因此邀請以下這樣的店家刊登。"],
    'jn.g1.h': ["ひばりヶ丘と<wbr>その周りにあるお店", "Shops in and around Hibarigaoka", "히바리가오카와 그 주변의 가게", "位於雲雀丘及周邊的店家"],
    'jn.g1.p': ["西東京市・東久留米市・<br>新座市など、ひばりヶ丘の近くに、<br>実際に訪れることのできる<br>お店や教室があること。", "A shop or class near Hibarigaoka—in Nishitokyo, Higashikurume, Niiza and nearby—that people can actually visit.", "니시토쿄시·히가시쿠루메시·니자시 등 히바리가오카 근처에 실제로 방문할 수 있는 가게나 교실이 있을 것.", "在西東京市、東久留米市、新座市等雲雀丘附近，有可實際造訪的店舖或教室。"],
    'jn.g2.h': ["地域で営んでいる、<wbr>顔の見えるお店", "Local shops with a familiar face", "지역에서 운영하는, 얼굴이 보이는 가게", "在地經營、看得見店主的店"],
    'jn.g2.p': ["店主やお店の方の顔が見える、<br>地域に根ざしたお店。<br>全国や広い地域に展開している<br>チェーン店は、掲載していません。", "Shops rooted in the neighborhood, where you can see the people behind them. We do not feature national or large regional chains.", "가게 주인과 직원의 얼굴이 보이는, 지역에 뿌리내린 가게. 전국이나 넓은 지역에 전개하는 체인점은 게재 대상이 아닙니다.", "看得見店主與店員、扎根在地的店家。全國或大範圍展店的連鎖店不在刊登範圍內。"],
    'jn.g3.h': ["ふらりと立ち寄れる・<wbr>体験できるお店", "Places to drop by or try something", "가볍게 들를 수 있고 체험할 수 있는 가게", "可以順道走走、體驗的店"],
    'jn.g3.p': ["カフェや食事、パン・お菓子、<br>雑貨、習い事や体験の教室、<br>暮らしのお店などです。", "Cafés and restaurants, bakeries and sweets, goods, lessons and hands-on classes, everyday shops—places that are a pleasure to visit.", "카페와 식사, 빵·과자, 잡화, 배움과 체험 교실, 생활 가게 등 방문해서 즐길 수 있는 곳.", "咖啡廳與餐飲、麵包甜點、雜貨、才藝與體驗教室、生活用品店等，造訪起來令人愉快的地方。"],
    'jn.g.ask': ["当てはまるか分からないときは、<br class=\"sp-br\">お気軽にご相談ください。<br class=\"sp-br\">運営から、一店ずつお話をうかがいます。", "Not sure if this fits you? Please feel free to ask—we talk with each shop individually.", "해당되는지 잘 모르시겠다면 편하게 상담해 주세요. 운영진이 한 곳씩 이야기를 듣겠습니다.", "不確定是否符合時，歡迎隨時洽詢，我們會逐一與店家聊聊。"],
    'jn.gs.h': ["協賛というかたちで<wbr>ご一緒している会社", "Companies who support us as sponsors", "협찬이라는 형태로 함께하는 회사", "以贊助形式一同支持的企業"],
    'jn.gs.p': ["不動産、医療機関（クリニック・<br class=\"sp-br\">歯科など）、学習塾、金融・保険、<br class=\"sp-br\">士業など、<br class=\"pc-br\">お店として訪れる場所とは<br class=\"sp-br\">少し性質が違う会社・団体の<br class=\"sp-br\">皆さまとは、<br class=\"pc-br\">掲載ではなく<br class=\"sp-br\">「協賛」というかたちで、ぐるりを<br class=\"sp-br\">一緒に支えていただいています。", "Companies and organizations that are a little different from shops people visit—such as real estate, clinics and dental offices, tutoring schools, finance and insurance, and professional offices—support GURURI as sponsors rather than being featured.", "부동산, 의료기관(클리닉·치과 등), 학원, 금융·보험, 전문직 사무소 등 가게로서 방문하는 곳과는 조금 성격이 다른 회사·단체 여러분은 게재가 아닌 \"협찬\"이라는 형태로 구루리를 함께 응원해 주고 계십니다.", "不動產、醫療機構（診所、牙醫等）、補習班、金融保險、專業事務所等，與一般可造訪店家性質略有不同的企業與團體，並非以刊登，而是以「贊助」的形式一同支持 GURURI。"],
    'jn.gs.link': ["協賛について<wbr>問い合わせる", "Ask about sponsorship", "협찬 문의하기", "洽詢贊助"],
    'jn.fee.h': ["費用について", "About fees", "비용 안내", "關於費用"],
    'jn.fee.p': ["現在は、<wbr>無料で掲載いただけます。<br>今後、<wbr>有料にすることを<wbr>検討していますが、<wbr>その際は、<wbr>事前に一店ずつ<wbr>ご相談に伺います。<wbr>突然お支払いが<wbr>始まることは<wbr>ありません。", "Listing is currently free.<br>We are considering introducing a fee in the future. If we do, we will visit each shop to talk it over in advance. Payments will never start suddenly.", "현재는 무료로 게재하실 수 있습니다.<br>앞으로 유료화를 검토하고 있지만, 그때는 미리 한 곳씩 찾아뵙고 상의드립니다. 갑자기 결제가 시작되는 일은 없습니다.", "目前可免費刊登。<br>未來考慮改為收費，屆時會事先逐一拜訪店家商量，不會突然開始收費。"],
    'jn.ord.h': ["並び順と、<wbr>内容の見直しのお願い", "About the order of shops: a request to keep your listing fresh", "가게 순서와 내용 수정 부탁", "關於排列順序與內容更新的請求"],
    'jn.ord.p': ["お店の並び順は、<wbr>毎月1日に<wbr>入れ替わります。<br>新しい情報を<wbr>先にお届けするため、<wbr>内容の更新から<wbr>2か月ほどたつと、<wbr>上のほうに出る回数が<wbr>少しずつ減ります。<br>季節のメニューや<wbr>新しい写真など、<wbr>写真や紹介文の<wbr>見直しを、<wbr>どうぞよろしく<wbr>お願いいたします。<wbr>毎月のお知らせメールでも、<wbr>あらためて<wbr>お願いを<wbr>お送りしています。", "The order of shops changes on the 1st of each month.<br>To show visitors the newest information first, shops that have not updated their listing for about two months appear near the top a little less often.<br>We kindly ask you to refresh your photos and introduction from time to time, such as seasonal menus or new photos. We also include this request in our monthly email to you.", "가게의 순서는 매월 1일에 바뀝니다.<br>새로운 정보를 먼저 전하기 위해, 내용을 업데이트한 지 2개월쯤 지나면 위쪽에 나오는 횟수가 조금씩 줄어듭니다.<br>계절 메뉴나 새로운 사진 등, 사진과 소개 글의 수정을 부디 잘 부탁드립니다. 매월 보내 드리는 안내 메일에서도 다시 부탁드리고 있습니다.", "店家的排列順序，每月1日更換。<br>為了優先呈現最新資訊，內容更新後約兩個月，出現在前面的次數會逐漸減少。<br>季節菜單或新照片等，懇請您適時更新照片與介紹文。每月的通知信中，我們也會再次提出這項請求。"],
    'jn.cta.h': ["<span class=\"nw\">ぐるり ひばりヶ丘で、</span><wbr>地域の方との<wbr>新しい出会いを<wbr>広げてみませんか。", "Why not open new connections with your neighbors through GURURI Hibarigaoka?", "구루리 히바리가오카에서 지역 분들과의 새로운 만남을 넓혀 보지 않으시겠어요?", "要不要透過 GURURI Hibarigaoka，拓展與在地居民的新相遇？"],
    'jn.cta.btn': ["掲載を申し込む（無料）", "Apply to be listed (free)", "게재 신청하기 (무료)", "申請刊登（免費）"],
    'jn.cta.note': ["申し込みフォームでは<wbr>写真もお送りいただくため、<wbr>Googleアカウントでの<wbr>ログインを<wbr>お願いしています。", "The form asks for photos, so you’ll be asked to sign in with a Google account.", "신청 양식에서 사진도 보내 주셔야 해서 Google 계정 로그인이 필요합니다.", "申請表單需要上傳照片，因此需要登入 Google 帳戶。"],
    'sp.label': ["PR・協賛", "PR · Sponsor", "PR · 협찬", "PR・贊助"],
    'sp.a.h': ["ぐるりを応援して<wbr>くれている会社", "Companies supporting GURURI", "구루리를 응원해 주시는 회사", "支持 GURURI 的企業"],
    'sp.a.p': ["地域のお店と暮らしを、<wbr>一緒に応援して<wbr>くださっています。", "They support local shops and everyday life in the area, together with us.", "지역 가게와 생활을 함께 응원해 주고 있습니다.", "與我們一起支持在地的店家與生活。"],
    'sp.b.kick': ["ぐるりを応援しています", "Supporting GURURI", "구루리를 응원합니다", "支持 GURURI"],
    'sp.link': ["ウェブサイトを見る", "Visit website", "웹사이트 보기", "查看網站"],
    'more.btn': ["もっと見る（あと{n}軒）", "Show more ({n} left)", "더 보기 (남은 가게 {n}곳)", "顯示更多（還有{n}家）"],
    'title.concept': ['ぐるりについて｜ぐるり ひばりヶ丘', 'About GURURI | GURURI Hibarigaoka', '구루리 소개 | GURURI Hibarigaoka', '關於 GURURI｜GURURI Hibarigaoka'],
    'brand': ['ぐるり ひばりヶ丘', 'GURURI Hibarigaoka', 'GURURI Hibarigaoka', 'GURURI Hibarigaoka'],
    // ロゴの右に並べる地域名（ロゴの高さの約40%・文字の底をロゴにそろえる。2026-11-15・G決定）
    'brand.area': ['ひばりヶ丘', 'Hibarigaoka', 'Hibarigaoka', 'Hibarigaoka'],
    'lang.label': ['言語', 'Language', '언어', '語言'],
    'nav.menu': ['ぐるりのメニュー', 'GURURI menu', '구루리 메뉴', 'GURURI 選單'],
    'nav.shops': ['お店をさがす', 'Find shops', '가게 찾기', '尋找店家'],
    'nav.about': ['ぐるりについて', 'About GURURI', '구루리 소개', '關於 GURURI'],
    'nav.waza': ['わざのひと', 'WAZANOHITO', 'WAZANOHITO', 'WAZANOHITO'],
    'nav.join': ['掲載について', 'For shop owners', '가게 등록 안내', '刊登說明'],
    'nav.footer': ['フッター', 'Footer', '바닥글', '頁尾'],
    'nav.torimich': ['通り道（TORIMICH）', 'TORIMICH', 'TORIMICH', 'TORIMICH'],
    'menu.open': ["メニューを開く", "Open menu", "메뉴 열기", "開啟選單"],
    'menu.close': ["メニューを閉じる", "Close menu", "메뉴 닫기", "關閉選單"],
    'menu.top': ["トップ", "Home", "홈", "首頁"],
    'menu.shops': ["お店をさがす", "Find shops", "가게 찾기", "尋找店家"],
    'menu.coupons': ["クーポンのあるお店", "Shops with coupons", "쿠폰이 있는 가게", "有優惠券的店家"],
    'menu.sponsor': ["協賛について", "About sponsorship", "협찬 안내", "關於贊助"],
    'menu.contact': ["お問い合わせ", "Contact", "문의하기", "聯絡我們"],
    'menu.ig': ["ぐるりの Instagram", "GURURI on Instagram", "구루리 Instagram", "GURURI 的 Instagram"],
    'title.contact': ["お問い合わせ｜ぐるり ひばりヶ丘", "Contact | GURURI Hibarigaoka", "문의하기 | GURURI Hibarigaoka", "聯絡我們 | GURURI Hibarigaoka"],
    'ct.title': ["お問い合わせ", "Contact", "문의하기", "聯絡我們"],
    'ct.lead': ["ぐるり ひばりヶ丘への<wbr>お問い合わせの<wbr>窓口です。<br>掲載のこと、<wbr>協賛のこと、<wbr>そのほかのことも、<wbr>お気軽に<wbr>お寄せください。", "This is the contact page for GURURI Hibarigaoka.<br>Please feel free to get in touch about listing your shop, sponsorship, or anything else.", "구루리 히바리가오카 문의 창구입니다.<br>가게 등록, 협찬, 그 밖의 일도 편하게 문의해 주세요.", "這是 GURURI Hibarigaoka 的聯絡窗口。<br>無論是刊登、贊助或其他事項，都歡迎與我們聯絡。"],
    'ct.l.h': ["掲載を考えている<wbr>お店の方へ", "For shops thinking about a listing", "등록을 생각하고 계신 가게 분께", "考慮刊登的店家"],
    'ct.l.p': ["「載せてみたいけれど、<wbr>まず話を<wbr>聞いてみたい」<wbr>というご相談も<wbr>歓迎です。<wbr>掲載は無料です。", "Questions before applying are very welcome, such as \"I'd like to hear more first.\" Listing is free.", "\"먼저 이야기를 들어 보고 싶다\"는 상담도 환영합니다. 등록은 무료입니다.", "「想先聽聽說明」這樣的諮詢也非常歡迎。刊登是免費的。"],
    'ct.l.btn': ["掲載について問い合わせる", "Ask about listing", "등록에 대해 문의하기", "詢問刊登事宜"],
    'ct.s.h': ["協賛を考えている<wbr>会社・団体の方へ", "For companies and organizations thinking about sponsorship", "협찬을 생각하고 계신 회사·단체 분께", "考慮贊助的公司與團體"],
    'ct.s.p': ["協賛の内容や、<wbr>見ている方の数などを、<wbr>くわしく<wbr>ご案内します。", "We will gladly explain sponsorship in detail, including how many people visit GURURI.", "협찬 내용과 방문자 수 등을 자세히 안내해 드립니다.", "我們會詳細說明贊助內容與瀏覽人數等資訊。"],
    'ct.s.btn': ["協賛について問い合わせる", "Ask about sponsorship", "협찬에 대해 문의하기", "詢問贊助事宜"],
    'ct.o.h': ["そのほかの<wbr>お問い合わせ", "Other inquiries", "그 밖의 문의", "其他詢問"],
    'ct.o.p': ["取材のこと、<wbr>掲載している内容の<wbr>訂正、<wbr>サイトのことなど、<wbr>どうぞお気軽に。", "Interviews, corrections to listed information, questions about the site, and anything else.", "취재, 게재 내용의 정정, 사이트에 관한 일 등 무엇이든 편하게 문의해 주세요.", "採訪、刊登內容的更正、網站相關問題等，歡迎隨時聯絡。"],
    'ct.o.btn': ["問い合わせる", "Send an inquiry", "문의하기", "提出詢問"],
    'ct.note': ["お問い合わせフォーム（Googleフォーム）が開きます。<wbr>Googleアカウントへの<wbr>ログインは<wbr>いりません。<br>運営の<wbr>TORIMICH（通り道）から、<wbr>メールで<wbr>お返事します。", "An inquiry form (Google Forms) will open. You do not need to sign in to a Google account.<br>TORIMICH, the operator of GURURI, will reply by email.", "문의 양식(Google Forms)이 열립니다. Google 계정에 로그인할 필요는 없습니다.<br>운영자인 TORIMICH가 이메일로 답장을 드립니다.", "將開啟詢問表單（Google 表單）。不需要登入 Google 帳號。<br>營運方 TORIMICH 會以電子郵件回覆您。"],
    'ct.pp': ["いただいた内容は、<wbr><a href=\"privacy.html\">プライバシーポリシー</a>に沿って<wbr>大切に取り扱います。", "We handle what you send us with care, in line with our <a href=\"privacy.html\">Privacy Policy</a>.", "보내 주신 내용은 <a href=\"privacy.html\">개인정보 처리방침</a>에 따라 소중히 다룹니다.", "您提供的內容，將依照<a href=\"privacy.html\">隱私權政策</a>謹慎處理。"],
    'ct.none': ["ただいま、お問い合わせフォームを準備しています。<wbr>こちらの窓口からお願いいたします。", "Our inquiry form is being prepared. Please use this contact point for now.", "문의 양식을 준비 중입니다. 지금은 이 창구를 이용해 주세요.", "詢問表單正在準備中，目前請使用此窗口。"],

    'hero.copy': ['いつもの道に、寄り道をひとつ。', 'One small detour on your everyday path.', '늘 다니던 길에, 잠깐 들를 곳 하나.', '在熟悉的路上，多一個順道的去處。'],
    'intro.title': ['こんなお店、<br>あったんだ。', 'I never knew<br>this shop was here.', '이런 가게가<br>있었구나.', '原來這裡<br>有這樣的店。'],
    'intro.p1': ['駅から少し歩けば、<span class=\"nw\">焼きたてのパンの香り。</span>', 'A short walk from the station, the smell of fresh-baked bread.', '역에서 조금만 걸으면, 갓 구운 빵 냄새.', '從車站走幾步，就聞到剛出爐的麵包香。'],
    'intro.p2': ['ていねいに淹れたコーヒーに、<span class=\"nw\">手しごとのかばん。</span>', 'Carefully brewed coffee, and handmade bags.', '정성껏 내린 커피에, 손으로 만든 가방.', '細心沖煮的咖啡，還有手工製作的包包。'],
    'intro.p3': ['ひばりヶ丘とそのまわりのお店を、<span class=\"nw\">お店の方の言葉で</span><span class=\"nw\">つないでいます。</span>', 'Here, the shops in and around Hibarigaoka are connected through their own words.', '히바리가오카와 그 주변의 가게를, 가게 분들의 말로 이어 갑니다.', '這裡以店家自己的話，串起雲雀丘及周邊的小店。'],
    'intro.p4': ['気になる一軒を、<span class=\"nw\">見つけてみてください。</span>', 'Find the one that catches your eye.', '마음에 드는 한 곳을 찾아보세요.', '找找看讓你心動的那一家吧。'],
    'btn.shops': ['近くのお店を見てみる', 'See the shops', '가게 둘러보기', '看看附近的店'],
    'btn.concept': ['ぐるりのコンセプトを読む', 'Read about GURURI', '구루리의 콘셉트 읽기', '閱讀 GURURI 的理念'],

    'shops.title': ['お店をさがす', 'Find shops', '가게 찾기', '尋找店家'],
    'shops.count': ['{n}軒のお店（全{t}軒）', '{n} shops (of {t})', '가게 {n}곳 (전체 {t}곳)', '{n} 家店（共 {t} 家）'],
    'shops.mt': ['', 'Shop introductions are machine-translated from Japanese.', '가게 소개는 일본어를 자동 번역한 것입니다.', '店家介紹為日文自動翻譯。'],
    'chip.all': ['すべて', 'All', '전체', '全部'],
    'chip.allArea': ['すべてのまち', 'All areas', '모든 지역', '所有地區'],
    'group.genre': ['ジャンルでしぼる', 'Filter by category', '분야로 찾기', '依類別篩選'],
    'group.area': ['まちでしぼる', 'Filter by area', '지역으로 찾기', '依地區篩選'],
    'fresh.new': ['新着', 'New', 'NEW', '新上架'],
    'fresh.upd': ['更新', 'Updated', '업데이트', '已更新'],
    'share.btn': ['このお店を送る', 'Share this shop', '이 가게 공유하기', '分享這家店'],
    'share.title': ['{name}｜ぐるり ひばりヶ丘', '{name} | GURURI Hibarigaoka', '{name} | GURURI Hibarigaoka', '{name}｜GURURI Hibarigaoka'],
    'share.text': ['「{name}」、今度いっしょに行ってみない？', 'How about going to "{name}" together sometime?', '"{name}", 다음에 같이 가 볼래?', '「{name}」，下次要不要一起去看看？'],
    'share.aria': ['{name}を家族や友だちに送る', 'Share {name} with someone', '{name}을(를) 공유하기', '分享{name}'],
    'share.short': ['送る', 'Share', '공유', '分享'],
    'share.title2': ['このお店を送る', 'Share this shop', '이 가게 공유하기', '分享這家店'],
    'share.pick': ['ひとことを選んでください', 'Choose a message', '메시지를 고르세요', '選擇一句話'],
    'share.text2': ['「{name}」、よさそうなお店を見つけたよ。', 'I found a nice place: "{name}".', '"{name}", 괜찮은 가게를 찾았어.', '發現一家不錯的店：「{name}」。'],
    'share.sms': ['メッセージ', 'Messages', '메시지', '簡訊'],
    'share.mail': ['メール', 'Email', '메일', '郵件'],
    'share.copy': ['コピー', 'Copy link', '링크 복사', '複製連結'],
    'share.more': ['そのほか', 'More', '기타', '其他'],
    'share.copied': ['リンクをコピーしました。LINEやメールに貼り付けて送れます', 'Link copied. Paste it into a message to share.', '링크를 복사했습니다. 메시지에 붙여 넣어 보내세요.', '已複製連結，可以貼到訊息中分享。'],
    'share.copyThis': ['このリンクをコピーして送ってください', 'Copy this link to share', '이 링크를 복사해 보내세요', '請複製這個連結分享'],
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
    'coupon.banner.what': ['割引やサービスなどが受け取れます', 'Get discounts and little extras', '할인이나 서비스를 받을 수 있어요', '可享折扣或小小的服務'],
    'coupon.banner.p': ['クーポンのあるお店を見る', 'See shops with coupons', '쿠폰이 있는 가게 보기', '查看有優惠券的店家'],
    'group.coupon': ['クーポンでしぼる', 'Filter by coupon', '쿠폰으로 좁히기', '依優惠券篩選'],
    'coupon.close': ['閉じる', 'Close', '닫기', '關閉'],
    'search.label': ['キーワードでさがす', 'Search by keyword', '키워드로 찾기', '以關鍵字搜尋'],
    'search.ph': ['店名やキーワードでさがす', 'Search by name or keyword', '가게 이름이나 키워드로 찾기', '以店名或關鍵字搜尋'],
    'search.hint': ['例：パン、はな、コーヒー、書道（ひらがな・カタカナ・漢字でも）', 'e.g. bread, flower, coffee, calligraphy', '예: 빵, 꽃, 커피, 서예', '例：麵包、花、咖啡、書法'],
    'coupon.only': ['クーポンのあるお店を表示', 'Shops with coupons', '쿠폰 있는 가게', '有優惠券的店家'],
    'sw.on': ['オン', 'ON', '켜짐', '開'],
    'sw.off': ['オフ', 'OFF', '꺼짐', '關'],
    'scope.coupon': ['クーポンのあるお店', 'shops with coupons', '쿠폰이 있는 가게', '有優惠券的店家'],
    'scope.sep': ['・', ' / ', ' / ', '・'],
    'scope.now': ['いまは「{f}」を表示しています。', 'Now showing: {f}.', '지금은 “{f}”를 보여 드리고 있습니다.', '目前顯示「{f}」。'],
    'scope.clear': ['すべてのお店を表示', 'Show all shops', '모든 가게 보기', '顯示全部店家'],
    'scope.more': ['すべてのお店なら、「{q}」のお店がほかに{n}軒あります。', '{n} more shop(s) for “{q}” among all shops.', '모든 가게에서는 “{q}” 가게가 {n}곳 더 있습니다.', '若從全部店家搜尋，還有 {n} 家符合「{q}」。'],
    'search.ph.coupon': ['クーポンのお店からさがす', 'Search shops with coupons', '쿠폰이 있는 가게 중에서 찾기', '在有優惠券的店家中搜尋'],
    'search.widened': ['「{f}」の中には「{q}」が見つからなかったため、すべてのお店から表示しています。', 'No “{q}” in {f}, so we’re showing results from all shops.', '“{f}” 중에는 “{q}”가 없어서, 모든 가게에서 보여 드립니다.', '「{f}」中沒有符合「{q}」的店家，已改為從全部店家中顯示。'],
    'search.back': ['「{f}」だけに戻す', 'Back to {f} only', '“{f}”만 다시 보기', '只看「{f}」'],
    'empty.scope': ['いまは「{f}」の中から探しています。', 'You are searching only: {f}.', '지금은 “{f}” 중에서 찾고 있습니다.', '目前只在「{f}」中搜尋。'],
    'search.near': ['「{q}」に近いお店を表示しています。', 'Showing shops close to “{q}”.', '“{q}”와 가까운 가게를 보여 드립니다.', '為您顯示與「{q}」相近的店家。'],
    'search.try': ['こんな言葉でも、さがせます', 'You can also try', '이런 단어로도 찾을 수 있어요', '也可以試試這些關鍵字'],
    'search.wider': ['「{q}」に当てはまるお店は、これから掲載されていきます。すべてのお店から探すと、{n}軒見つかります。', 'Shops for “{q}” will be added as GURURI grows. Searching all shops finds {n}.', '“{q}”에 해당하는 가게는 앞으로 소개될 예정입니다. 모든 가게에서 찾으면 {n}곳이 있습니다.', '符合「{q}」的店家將陸續刊登。從全部店家搜尋，可找到 {n} 家。'],
    'search.all': ['すべてのお店でさがす', 'Search all shops', '모든 가게에서 찾기', '搜尋全部店家'],
    'ft.totop': ['ページのいちばん上へ戻る', 'Back to top', '맨 위로 돌아가기', '回到頁面頂端'],
    'search.clear': ['キーワードを消す', 'Clear search', '검색어 지우기', '清除搜尋'],
    'empty.q': ['「{q}」に当てはまるお店は、これから掲載されていきます。ほかの言葉でもお試しください。', 'Shops for “{q}” will be added as GURURI grows. Please try another word.', '“{q}”에 해당하는 가게는 앞으로 소개될 예정입니다. 다른 단어로도 찾아보세요.', '符合「{q}」的店家將陸續刊登，也請試試其他關鍵字。'],
    'loading': ['お店の情報を読み込んでいます…', 'Loading shops…', '가게 정보를 불러오는 중…', '正在載入店家資訊…'],
    'empty': ['この組み合わせのお店は、これから掲載されていきます。', 'Shops for this combination will be added as GURURI grows.', '이 조건의 가게는 앞으로 소개될 예정입니다.', '符合此條件的店家將陸續刊登。'],
    'error': ['お店の情報を読み込めませんでした。時間をおいて、もう一度開いてみてください。', 'We couldn’t load the shop information. Please try again in a little while.', '가게 정보를 불러오지 못했습니다. 잠시 후 다시 열어 주세요.', '無法載入店家資訊，請稍後再試一次。'],
    'map.aria': ['{name}の場所をGoogleマップで見る（{city}）', 'See where {name} is on Google Maps ({city})', '{name} 위치를 Google 지도에서 보기 ({city})', '在 Google 地圖查看 {name} 的位置（{city}）'],
    'photo.alt': ['{name}の写真', 'Photo of {name}', '{name} 사진', '{name} 的照片'],
    'photo.prev': ['前の写真', 'Previous photo', '이전 사진', '上一張照片'],
    'photo.next': ['次の写真', 'Next photo', '다음 사진', '下一張照片'],

    'ig.title': ['街のお気に入りが、<wbr>もっと見つかるように。', 'So you can find more favorite spots around town.', '동네의 단골집을 더 많이 찾을 수 있도록.', '讓你在街區找到更多心頭好。'],
    'ig.p1': ['ぐるりには、<wbr>これからも<wbr>すてきなお店が<wbr>次々と<wbr>加わっていく予定です。', 'More wonderful shops will keep joining GURURI.', '구루리에는 앞으로도 멋진 가게들이 계속 더해질 예정입니다.', 'GURURI 之後也會陸續加入更多美好的店家。'],
    'ig.p2': ['最新のお知らせは、<wbr>Instagramから<wbr>受け取れます。', 'Get the latest news on Instagram.', '최신 소식은 Instagram에서 받아 보실 수 있습니다.', '最新消息請在 Instagram 上查看。'],
    'ig.btn': ['Instagramをフォローする', 'Follow on Instagram', 'Instagram 팔로우하기', '追蹤 Instagram'],

    'waza.title': ['人と技に<wbr>目を向けたページ<br>わざのひと', 'WAZANOHITO: a page about people and their craft', '사람과 기술에 주목한 페이지 ‘WAZANOHITO’', '關注人與技藝的頁面「WAZANOHITO」'],
    'waza.p': ['ぐるりは、<wbr>人と地域に<wbr>目を向けたページです。<wbr>人と技に<wbr><span class=\"nw\">目を向けたページが、</span><wbr><span class=\"nw\">「わざのひと」です。</span><wbr>ひとつの技に<wbr>向き合っている<wbr>方たちを、<wbr>その技とともに<wbr>紹介しています。', 'GURURI looks at people and their neighborhood. WAZANOHITO looks at people and their craft, introducing people devoted to a single craft, together with that craft.', '구루리는 사람과 지역에 주목한 페이지입니다. 사람과 기술에 주목한 페이지가 ‘WAZANOHITO’입니다. 하나의 기술과 마주하고 있는 분들을 그 기술과 함께 소개합니다.', 'GURURI 是關注人與地方的頁面。關注人與技藝的頁面則是「WAZANOHITO」，介紹專注於一項技藝的人們，以及他們的技藝。'],
    'waza.btn': ['わざのひとを見る', 'See WAZANOHITO', 'WAZANOHITO 보기', '查看 WAZANOHITO'],
    'join.title': ['<span class=\"nw\">ぐるり ひばりヶ丘への</span><span class=\"nw\">掲載をご希望の</span><span class=\"nw\">お店の方へ</span>', 'For shops interested in being featured on GURURI Hibarigaoka', '구루리 히바리가오카 게재를 희망하시는 가게 분들께', '想刊登於 GURURI Hibarigaoka 的店家'],
    'join.btn': ['掲載について見る', 'Learn about listing', '게재 안내 보기', '查看刊登說明'],

    'c.hero': ['いつもの道に、<br>寄り道をひとつ。', 'One small detour<br>on your everyday path.', '늘 다니던 길에,<br>잠깐 들를 곳 하나.', '在熟悉的路上，<br>多一個順道的去處。'],
    'c.lead1': ['毎日通る道にも、<wbr>まだ扉を開けたことのない<wbr>お店があります。', 'Even on the streets you walk every day, there are shops whose doors you have never opened.', '매일 지나는 길에도 아직 문을 열어 본 적 없는 가게가 있습니다.', '即使是每天經過的路上，也有還沒推開門走進去過的店。'],
    'c.lead2': ['<span class=\"nw\">ぐるり ひばりヶ丘は、</span><wbr>そんなお店を<wbr>ひとつずつ<wbr>紹介している<wbr>ページです。', 'GURURI Hibarigaoka introduces those shops, one at a time.', '구루리 히바리가오카는 그런 가게를 하나씩 소개하는 페이지입니다.', 'GURURI Hibarigaoka 就是一間一間介紹這些店家的頁面。'],
    'c.values': ['ぐるりが<wbr>大切にしていること', 'What GURURI values', '구루리가 소중히 여기는 것', 'GURURI 重視的事'],
    'v1.h': ['お店の方の言葉で', 'In the shop’s own words', '가게 분들의 말 그대로', '用店家自己的話'],
    'v1.p': ['紹介文は、<wbr>お店の方からいただいた<wbr>言葉をそのまま<wbr>載せています。<wbr>店先で<wbr>少しお話を<wbr>聞くような<wbr>気持ちで、<wbr>読んでみてください。', 'We publish each introduction just as the shop wrote it. Read it as if you were chatting for a moment at the shop front.', '소개 글은 가게 분들께 받은 말을 그대로 싣고 있습니다. 가게 앞에서 잠깐 이야기를 듣는 기분으로 읽어 주세요.', '介紹文字直接刊登店家提供的話語。請用在店門口稍微聊上幾句的心情來閱讀。'],
    'v2.h': ['毎月、すこしずつ新しく', 'A little new, every month', '매달 조금씩 새롭게', '每個月，一點一點更新'],
    'v2.p': ['お店の情報は<wbr>毎月更新し、<wbr>あたらしく<wbr>加わったお店も<wbr>ご紹介しています。', 'Shop information is updated every month, and we introduce newly joined shops too.', '가게 정보는 매달 업데이트하며, 새로 합류한 가게도 소개합니다.', '店家資訊每月更新，也會介紹新加入的店家。'],
    'v3.h': ['垣根をこえて、となりに', 'Side by side, across boundaries', '경계를 넘어, 나란히', '跨越界線，比鄰而居'],
    'v3.p': ['カフェのとなりに、<wbr>かばん屋さん。<br>花屋さんのとなりに、<wbr>フォトスタジオ。<br>業種や市の<wbr>境目にとらわれず、<br>近くの気になるお店を<wbr>並べています。', 'A bag shop next to a café. A photo studio next to a flower shop. We place interesting nearby shops side by side, regardless of business type or city lines.', '카페 옆에 가방 가게, 꽃집 옆에 사진관. 업종이나 시의 경계에 얽매이지 않고, 가까이 있는 마음 가는 가게들을 나란히 소개합니다.', '咖啡館旁邊是包包店，花店旁邊是照相館。不拘業種或市界，把附近令人好奇的店家並排介紹。'],
    'view.h': ['目指している景色', 'The scene we hope for', '우리가 그리는 풍경', '我們嚮往的風景'],
    'view.p1': ['訪れた方が、<wbr>心から楽しんでくださること。', 'That everyone who visits truly enjoys their time.', '찾아오신 분들이 진심으로 즐거워하시는 것.', '讓來訪的人打從心底感到愉快。'],
    'view.p2': ['その時間が、<wbr>お店の力になり、', 'That this time becomes a source of strength for the shops,', '그 시간이 가게의 힘이 되고,', '讓這段時光成為店家的力量，'],
    'view.p3': ['まちの潤いに<wbr>つながっていくこと。', 'and brings richness to the town.', '마을을 풍요롭게 하는 것으로 이어지는 것.', '進而滋潤整個街區。'],
    'view.p4': ['ぐるりが<wbr>目指しているのは、<wbr>そんな景色です。', 'That is the scene GURURI hopes to see.', '구루리가 바라는 것은 그런 풍경입니다.', '這就是 GURURI 嚮往的風景。'],
    'next.h': ['これから', 'What’s next', '앞으로', '接下來'],
    'next.p1': ['いつもの道も、<wbr>はじめての道も、<wbr>ちょっと<wbr>楽しくなるように。', 'So that both your everyday streets and the ones you walk for the first time feel a little more fun.', '늘 다니던 길도, 처음 걷는 길도 조금 더 즐거워지도록.', '讓熟悉的路，和第一次走的路，都變得更有趣一點。'],
    'next.p2': ['載っているお店は、<wbr>これからも<wbr>少しずつ<wbr>増えていきます。<wbr>次の寄り道を、<wbr>楽しみに<wbr>していてください。', 'We will keep adding more shops, little by little. We hope you look forward to your next detour.', '소개하는 가게는 앞으로도 조금씩 늘어날 예정입니다. 다음 들를 곳을 기대해 주세요.', '介紹的店家今後也會一點一點增加。敬請期待下一次的順道之旅。'],
    'team.h': ['<span class=\"nw\">ぐるり ひばりヶ丘の</span><span class=\"nw\">運営者</span>', 'Who runs GURURI Hibarigaoka', '구루리 히바리가오카 운영자', 'GURURI Hibarigaoka 的營運者'],
    'team.t.role': ['地域メディア', 'Local media', '지역 미디어', '在地媒體'],
    'team.t.name': ['TORIMICH', 'TORIMICH', 'TORIMICH', 'TORIMICH'],
    'team.t.sub': ['通り道', 'Torimichi', 'Torimichi', '通り道'],
    'team.t.p': ['ひばりヶ丘を<wbr>拠点に、<wbr>地域の人と技を<wbr>伝えています。<wbr>ぐるりでは、<wbr>ウェブページの運営と<wbr>お店とのやりとりを<wbr>担当しています。', 'Based in Hibarigaoka, we share the people and crafts of the area. At GURURI, we run the website and work with the shops.', '히바리가오카를 거점으로 지역의 사람과 기술을 전하고 있습니다. 구루리에서는 웹페이지 운영과 가게와의 소통을 맡고 있습니다.', '以雲雀丘（Hibarigaoka）為據點，介紹在地的人與技藝。在 GURURI 負責網站營運與店家聯繫。'],
    'team.l.role': ['西武線沿線のカフェ紹介', 'Cafes along the Seibu Line', '세이부선 연선의 카페 소개', '西武線沿線的咖啡館介紹'],
    'team.l.name': ['<span class=\"nw\">ラテさん｜</span><span class=\"nw\">西武線カフェさんぽ</span>', '<span class=\"nw\">Latte |</span> <span class=\"nw\">Seibu-sen Cafe Sanpo</span>', '<span class=\"nw\">라테 님｜</span><span class=\"nw\">세이부선 카페 산책</span>', '<span class=\"nw\">Latte｜</span><span class=\"nw\">西武線咖啡散步</span>'],
    'team.l.link': ['ラテさん｜西武線カフェさんぽ', 'Latte | Seibu-sen Cafe Sanpo', '라테 님｜세이부선 카페 산책', 'Latte｜西武線咖啡散步'],
    'team.l.p': ['西武線沿線の<wbr>カフェを巡り、<wbr>Instagramで<wbr>紹介しています。<wbr>ぐるりでは、<wbr>SNSの運用と<wbr>広告を<wbr>担当しています。', 'Visits cafes along the Seibu Line and introduces them on Instagram. At GURURI, she handles social media and promotion.', '세이부선 연선의 카페를 찾아다니며 Instagram에서 소개하고 있습니다. 구루리에서는 SNS 운영과 홍보를 맡고 있습니다.', '走訪西武線沿線的咖啡館，並在 Instagram 上介紹。在 GURURI 負責社群經營與宣傳。'],
    'ft.op': ['運営：<span class=\"nw\">TORIMICH（通り道）</span>・<span class=\"nw\">ラテさん｜</span><span class=\"nw\">西武線カフェさんぽ</span>', 'Run by <span class=\"nw\">TORIMICH</span> and <span class=\"nw\">Latte |</span> <span class=\"nw\">Seibu-sen Cafe Sanpo</span>', '운영: <span class=\"nw\">TORIMICH</span> · <span class=\"nw\">라테 님｜</span><span class=\"nw\">세이부선 카페 산책</span>', '營運：<span class=\"nw\">TORIMICH</span>・<span class=\"nw\">Latte｜</span><span class=\"nw\">西武線咖啡散步</span>'],
    'team.t.link': ['ウェブサイト', 'Website', '웹사이트', '網站'],
    'next.p3': ['地域の学校や<wbr>お店と一緒に、<wbr>まちで過ごす時間が<wbr>もっと楽しくなる<wbr>企画も<wbr>考えています。', 'We are also planning projects with local schools and shops to make time in town even more enjoyable.', '지역 학교, 가게와 함께 마을에서 보내는 시간이 더 즐거워지는 기획도 준비하고 있습니다.', '也正在與當地學校和店家一起，構思讓在街區度過的時光更加愉快的企劃。'],
    'cta.h': ['気になるお店が<wbr>見つかったら、<br>いつもの道の途中で、<wbr><span class=\"nw\">ふらりと寄ってみてください。</span>', 'When a shop catches your eye,<br>drop by on your usual way.', '마음에 드는 가게를 찾았다면,<br>늘 다니던 길에 훌쩍 들러 보세요.', '找到感興趣的店家時，<br>就在平常的路上順道走進去看看吧。'],
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

// いちばん下のロゴを押すと、同じページのいちばん上へ戻る（2026-11-20・G指示）
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('[data-totop]');
  if (!a) return;
  e.preventDefault();
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
  // キーボードで押したときだけ、ページの先頭（ロゴ）に操作の位置を移す。
  // 指やマウスで押したときは移さない（移すと、iPhone でロゴに緑の枠が出てしまうため。2026-11-21）
  if (e.detail === 0) {
    var first = document.querySelector('header a, header button');
    if (first) first.focus({ preventScroll: true });
  }
});
