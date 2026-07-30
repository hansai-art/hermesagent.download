// 分析與 SEO 工具設定：集中管理三個追蹤 ID/token。
//
// 這些值都是「公開識別碼」，本來就會出現在網頁原始碼裡，不是機密：
//   - Cloudflare Web Analytics beacon token(隱私優先、無 cookie、不需同意橫幅)
//   - Google Analytics 4 measurement ID(流量、來源、行為)
//   - Google Search Console 驗證碼(搜尋排名、曝光、點擊、可提交 sitemap)
//
// 留空的項目不會渲染任何 script，不影響網站。填了才生效。
// 對應的元件：src/components/Analytics.astro。

export const ANALYTICS = {
  // Cloudflare Web Analytics - Hans 帳號 Web Analytics 的 hermesagent.download beacon
  cloudflareToken: 'b164b9e54282405fb2be5c8082ad5cf0',

  // Google Analytics 4 - hermesagent.download 資源的評估 ID
  ga4MeasurementId: 'G-DV2KV3BMZ6',

  // Google Search Console：用「HTML 標記」驗證法時貼上 content 值
  // (search.google.com/search-console → 新增資源 → HTML 標記 → 複製 content=" " 裡的字串)
  // 若改用 DNS TXT 驗證(在 aexers 的 Cloudflare DNS 加一筆)，這裡留空即可。
  googleSiteVerification: '',
};
