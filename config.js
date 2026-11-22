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
  sponsorContact: "https://ykt5da.s.gy/ask-torimich",
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

  // 協賛（2026-11-21、2026-11-22 改）。1社1行。今は0社なので、枠は何も表示されません。
  //   name     … サイトに表示するお名前（必須）
  //   plan     … "support"＝応援（「ぐるりを応援してくれている会社」の欄だけ）
  //              "card"   ＝応援＋協賛カード（応援の欄にも自動で載り、お店一覧の中の協賛カードにも出る）
  //   category … 業種（例："不動産" "医療・歯科" "学習塾"）。協賛カードは、同じ業種は1社まで
  //   text     … 応援の欄のひとこと（40文字まで）。4言語にするときは { ja: "…", en: "…", ko: "…", zh: "…" }
  //   cardText … 協賛カードのひとこと（80文字まで。card の会社だけ。ないときは text を使う）
  //   url      … 「ウェブサイトを見る」のリンク先（ぐるりから来たことが分かる印 utm_source=gururi&utm_medium=sponsor は自動で付きます）
  //   logo     … ロゴの画像（任意。例 "assets/sponsors/maruo.png"）。ないときは名前の1文字目を丸い枠に入れて表示
  //   start / end … 掲載開始日・終了日（"2026-12-01" の形。この日を含む）
  //   shop     … 協賛者がぐるりの掲載店でもあるときの、お店の名前（シートの「店名」と同じ）。協賛カードがお店のカードと隣り合わなくなります
  // 協賛カードの上限（sponsorCardMax）を超えたり、同じ業種が重なったりしたときは、上に書いた会社からカードに出し、残りは応援の欄だけに出します。
  // 設定を変えたら、サイトのアドレスの最後に ?check=sponsors を付けて開くと、問題があれば画面の上に黄色い帯で出ます。
  // 書き方の例（行の頭の // を外すと有効になります）：
  //   { name: "〇〇不動産 ひばりヶ丘店", plan: "card", category: "不動産", text: "ひばりヶ丘の暮らしを、これからも一緒に。", cardText: "ひばりヶ丘で40年。このまちの住まいのご相談にのってきました。", url: "https://example.com", start: "2026-12-01", end: "2027-02-28" },
  //   { name: "〇〇クリニック", plan: "support", category: "医療・歯科", text: "駅から歩いて3分の内科・小児科です。", url: "https://example.com", start: "2026-12-01", end: "2027-05-31" },
  sponsorCardMax: 2,
  sponsors: [
  ]
};
