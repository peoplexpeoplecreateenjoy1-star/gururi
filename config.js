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

  // 協賛（2026-11-21）。1社1行。今は0社なので、枠は何も表示されません。
  //   name   … 協賛者の名前（必須）
  //   slot   … "A"＝ページ下の「ぐるりを応援してくれている会社」／"B"＝お店一覧の中の協賛カード（同時に1社。2社以上なら月替わり）
  //   text   … ひとこと（目安：Aは40文字、Bは80文字まで）。4言語にするときは { ja: "…", en: "…", ko: "…", zh: "…" }
  //   url    … 「ウェブサイトを見る」のリンク先
  //   logo   … ロゴの画像（任意。例 "assets/sponsors/maruo.png"）。ないときは名前の1文字目を丸い枠に入れて表示
  //   start / end … 掲載開始日・終了日（"2026-12-01" の形。この日を含む）
  //   shop   … 協賛者がぐるりの掲載店でもあるときの、お店の名前（シートの「店名」と同じ）。協賛カードがお店のカードと隣り合わなくなります
  // 書き方の例（行の頭の // を外すと有効になります）：
  //   { name: "〇〇不動産", slot: "A", text: "ひばりヶ丘の暮らしを、これからも一緒に。", url: "https://example.com", start: "2026-12-01", end: "2027-02-28" },
  sponsors: [
  ]
};
