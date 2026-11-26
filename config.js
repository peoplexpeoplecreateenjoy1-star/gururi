/*
  ぐるり の設定ファイル
  ここだけ書き換えれば、ページのつながり先を変えられます。
  ""（ダブルクォーテーション）の中だけを書き換えてください。
*/
window.GURURI_CONFIG = {
  // スプレッドシートを「ウェブに公開（CSV）」したときのURL。
  // 空のままだと、data/shops.csv の内容が表示されます。
  sheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTb4L2OZSQFfu-RAwg1j-pEgIUCoQcEVFIwc9Fb_vnci79DRBBWNEHPAe5cbQke9Hi3ruHSx_Z0ez3x/pub?gid=1209506581&single=true&output=csv",

  // 各ボタンのリンク先
  instagram: "https://ykt5da.s.gy/insta-gururi",
  wazanohito: "https://ykt5da.s.gy/wazanohito-explore",
  joinForm: "https://ykt5da.s.gy/google-form-access",
  // 「掲載について」ページの「協賛について問い合わせる」のリンク先（2026-11-22・G指定：TORIMICHのお問い合わせ）
  sponsorContact: "contact.html#sponsor",   // 2026-11-26：ぐるりのお問い合わせページの「協賛」のカードへ（前は通り道のお問い合わせ https://ykt5da.s.gy/ask-torimich）
  // ぐるりのお問い合わせ（contact.html）のボタンの行き先。お問い合わせフォームのスクリプト（setupContactForm）の実行ログに出る3つのリンクを貼る。
  //   listing＝掲載について／sponsor＝協賛について／other＝そのほか。空のあいだは contactFallback（通り道のお問い合わせ）へ。
  contactForms: { listing: "https://docs.google.com/forms/d/e/1FAIpQLSfdMa8aA5nn5EDFijTpxJwlCVVUxTxnHaRNCn2i6mzQHG5xKg/viewform?usp=pp_url&entry.1301850130=%E6%8E%B2%E8%BC%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6", sponsor: "https://docs.google.com/forms/d/e/1FAIpQLSfdMa8aA5nn5EDFijTpxJwlCVVUxTxnHaRNCn2i6mzQHG5xKg/viewform?usp=pp_url&entry.1301850130=%E5%8D%94%E8%B3%9B%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6", other: "https://docs.google.com/forms/d/e/1FAIpQLSfdMa8aA5nn5EDFijTpxJwlCVVUxTxnHaRNCn2i6mzQHG5xKg/viewform?usp=pp_url&entry.1301850130=%E3%81%9D%E3%81%AE%E3%81%BB%E3%81%8B" },
  contactFallback: "https://ykt5da.s.gy/ask-torimich",
  torimichHome: "https://ykt5da.s.gy/torimich-explore",
  latteInstagram: "https://ykt5da.s.gy/seibu-cafe",

  // 「わざのひと」への案内（上のメニューと、ページ下の紹介）を出すかどうか。
  // 出すときは false を true に書き換えるだけ（2026-11-20・G決定：わざのひとが整うまで隠す）
  showWazanohito: false,

  // 「掲載について」ページの「数字で見るぐるり」（2026-11-21・G決定：数字がそろうまで隠す）
  // 出すときは show を true に。数字は "" の中を書き換える（例：views: "1,200回"）。asOf は「いつの数字か」
  joinStats: {
    show: false,
    views: "",
    posters: "",
    followers: "",
    asOf: ""
  },

  // 協賛（2026-11-21、2026-11-26 改：プランは「ぐるり協賛者プラン」ひとつ）。1社1行。今は0社なので、枠は何も表示されません。
  //   協賛者は全員、3か所に出ます：①お店をさがすの写真のすぐ下の横長の帯（2社以上なら訪問ごとにランダムで1社）
  //   ②お店一覧の中の協賛カード ③ページの下の「ぐるりを応援してくれている会社」の欄（お店をさがす・ぐるりについて）
  //   name     … サイトに表示するお名前（必須）
  //   category … 業種（例："不動産" "医療・歯科" "学習塾"）。同じ業種が重なったときに気づけるように
  //   text     … 上の帯と応援の欄のひとこと（40文字まで）。4言語にするときは { ja: "…", en: "…", ko: "…", zh: "…" }
  //   cardText … 協賛カードのひとこと（80文字まで。ないときは text を使う）
  //   url      … リンク先（ぐるりから来たことが分かる印 utm_source=gururi&utm_medium=sponsor と、場所 utm_content=top／card／support は自動で付きます）
  //   logo     … ロゴの画像（任意。例 "assets/sponsors/maruo.png"）。ないときは名前の1文字目を丸い枠に入れて表示
  //   start / end … 掲載開始日・終了日（"2026-12-01" の形。この日を含む）
  //   shop     … 協賛者がぐるりの掲載店でもあるときの、お店の名前（シートの「店名」と同じ）。協賛カードがお店のカードと隣り合わなくなります
  //   （前の plan "support"／"card" は廃止。書いてあっても同じ扱い）
  // 協賛カードの枠の上限は、いまはなし（2026-11-26・G：その都度決める）。書いた会社は全員、帯・カード・応援の欄に出ます。
  // 同じ業種の会社が2社以上のときは、?check=sponsors で注意だけ出します（カードからは外しません）。
  // 設定を変えたら、サイトのアドレスの最後に ?check=sponsors を付けて開くと、問題があれば画面の上に黄色い帯で出ます。
  // 書き方の例（行の頭の // を外すと有効になります）：
  //   { name: "〇〇不動産 ひばりヶ丘店", category: "不動産", text: "ひばりヶ丘の暮らしを、これからも一緒に。", cardText: "ひばりヶ丘で40年。このまちの住まいのご相談にのってきました。", url: "https://example.com", start: "2026-12-01", end: "2027-02-28" },
  sponsorCardMax: "auto",
  // 季節の飾り（2026-11-23）。"auto"＝予定表（seasons.csv）どおり（ふだんはこれ）／"off"＝飾りを止める／"december" など＝その飾りに固定
  season: "auto",
  sponsors: [
  ]
};
