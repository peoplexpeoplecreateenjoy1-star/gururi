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
  }
};
