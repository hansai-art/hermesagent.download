// 分類 SSOT — knowledge/ 目錄結構、sync 腳本、網站導覽都以這份清單為準。
// 新增分類:這裡加一筆 + 建立 knowledge/{slug}/ 目錄,兩邊一起動。

export const CATEGORIES = [
  {
    slug: 'install',
    emoji: '🖥️',
    name: '安裝部署',
    description: 'macOS、Windows、Linux、WSL2、Docker、Serverless 的安裝與部署指南',
  },
  {
    slug: 'config',
    emoji: '⚙️',
    name: '模型與 API 設定',
    description: 'OpenRouter、Anthropic、Gemini、Ollama 與本地模型的設定教學',
  },
  {
    slug: 'skills',
    emoji: '🧩',
    name: '技能目錄',
    description: '每個 skill 一篇:用途、安裝方式、實際範例',
  },
  {
    slug: 'integrations',
    emoji: '🔌',
    name: '生態整合',
    description: 'Telegram、Slack、MCP 與其他平台的整合方式',
  },
  {
    slug: 'guides',
    emoji: '📖',
    name: '使用教學',
    description: '從入門到進階的操作教學',
  },
  {
    slug: 'troubleshoot',
    emoji: '🚑',
    name: '疑難排解',
    description: '依症狀分類的問題排除,對應上游 GitHub issues',
  },
  {
    slug: 'migrate',
    emoji: '🔄',
    name: '遷移指南',
    description: '從 OpenClaw 等其他工具搬到 Hermes Agent',
  },
  {
    slug: 'issues',
    emoji: '🐛',
    name: '精選 Issue',
    description: '上游重要 issue 的中文摘要與追蹤',
  },
  {
    slug: 'releases',
    emoji: '📰',
    name: '版本情報',
    description: '每次上游 release 的中文解讀',
  },
  {
    slug: 'concepts',
    emoji: '🧠',
    name: '核心概念',
    description: '記憶系統、學習迴圈、架構原理',
  },
  {
    slug: 'community',
    emoji: '👥',
    name: '社群',
    description: '案例分享、工作流展示、貢獻者故事',
  },
  {
    slug: 'about',
    emoji: 'ℹ️',
    name: '關於',
    description: '免責聲明、貢獻指南、網站緣起',
  },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

export function getCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug);
}
