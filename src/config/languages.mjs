// 語言 SSOT — sync 腳本與網站都從這裡讀取啟用語言。
// 新增語言時:在這裡加一筆,並建立 knowledge/{code}/ 目錄(翻譯 cascade 見 docs/editorial/)。
// zh-TW 是本源語言,內容直接放在 knowledge/ 根層分類目錄下。

export const LANGUAGES = [
  { code: 'zh-TW', name: '繁體中文', default: true },
  // { code: 'en', name: 'English', default: false },  // Phase 4 之後再開
];

export const ENABLED_LANGUAGE_CODES = LANGUAGES.map((l) => l.code);
export const DEFAULT_LANGUAGE = LANGUAGES.find((l) => l.default);
