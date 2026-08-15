#!/usr/bin/env node
/**
 * 擋「程式碼直接 import 的套件，package.json 從沒宣告」這類地雷。
 *
 * 背景：已退役的姊妹 repo（hermesagent-download）曾經整個 build 間歇性壞掉——
 * scripts/generate-sitemap.mjs 直接 `import { globSync } from 'glob'`，但
 * glob 從沒進過 package.json，純靠其他套件的遞移依賴僥倖被裝進 node_modules。
 * npm 對未宣告套件的 hoisting 不保證，換一次 lockfile 狀態就會裝不到，
 * postbuild 直接炸 ERR_MODULE_NOT_FOUND。這支用 depcheck 掃「missing」，
 * 在同類地雷發生在這個 repo 之前先擋下來。
 *
 * 只管 missing（用了但沒宣告），不管 unused（宣告了沒用到）——
 * unused 是浪費，missing 才是會炸 build 的那種。
 *
 * astro:content / astro:assets 等是 Astro 的虛擬模組，不是 npm 套件，
 * depcheck 不認得，要手動排除。
 */
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const ASTRO_VIRTUAL_MODULES = new Set([
  'astro:content',
  'astro:assets',
  'astro:transitions',
  'astro:transitions/client',
  'astro:middleware',
]);

// depcheck exits non-zero whenever it finds *anything* (missing OR unused),
// so we always read its stdout from the caught error rather than relying on
// a clean exit — only "missing" actually matters to this check.
const depcheckBin = require.resolve('depcheck/bin/depcheck.js');
let raw;
try {
  raw = execFileSync(process.execPath, [depcheckBin, '--json'], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 32,
  });
} catch (err) {
  if (!err.stdout) throw err;
  raw = err.stdout;
}

const report = JSON.parse(raw);
const missing = Object.keys(report.missing ?? {}).filter((name) => !ASTRO_VIRTUAL_MODULES.has(name));

if (missing.length > 0) {
  console.error('這些套件被程式碼 import，但沒有宣告在 package.json：');
  for (const name of missing) {
    console.error(`  - ${name}`);
    for (const file of report.missing[name]) {
      console.error(`      ${file}`);
    }
  }
  console.error('\n加進 package.json 的 dependencies/devDependencies 再重新跑一次。');
  process.exit(1);
}

console.log('依賴完整性檢查通過：沒有 import 卻未宣告的套件。');
