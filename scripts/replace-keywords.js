const fs = require('fs');
const path = require('path');
const cfg = require('./config');

// 占位符保护:用绝不会出现在 markdown 正文里的标记,避免和正文「空格+数字」冲突
function makeProtector() {
  const stash = [];
  return {
    protect: (token) => `@@KEEP${stash.push(token) - 1}@@`,
    restore: (text) => text.replace(/@@KEEP(\d+)@@/g, (_, i) => stash[Number(i)]),
  };
}

function applyReplacements(text) {
  const { protect, restore } = makeProtector();

  // 移除「看源码」外部链接(github.com/aaif-goose/...),只保留链接文字。
  // 地图已提供文档相对路径导航,这些源码链接对 AI 检索无用,且会把 goose org 名带回正文。
  text = text.replace(/\[([^\]]+)\]\(https?:\/\/github\.com\/aaif-goose\/[^)]*\)/g, '$1');

  // recipe 库示例仓库 → 中性占位(没有自有配方仓库,避免指向不存在的仓库)
  text = text.replace(/[A-Za-z0-9_.-]+\/goose-recipes\b/g, 'your-org/recipes');

  // 先把 Agnes 发布仓库引用定向(owner 保留、仓库名改 agnes)
  text = text.replace(/aaif-goose\/goose\b/g, 'aaif-goose/agnes');

  // 保护外部真实地址(含 goose 的部分),不参与全局替换
  for (const kw of [...cfg.KEEP_EXTERNAL].sort((a, b) => b.length - a.length)) {
    text = text.split(kw).join(protect(kw));
  }

  // 全局大小写保留替换:GOOSE→AGNES、Goose→Agnes、goose→agnes
  text = text
    .replace(/GOOSE/g, 'AGNES')
    .replace(/Goose/g, 'Agnes')
    .replace(/goose/g, 'agnes');

  return restore(text);
}

const TRANSFORM_EXT = /\.(md|mdx|json)$/;

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function run() {
  const stagingDocs = path.join(cfg.STAGING_DIR, 'docs');
  // 整个 .staging 清掉,避免改名/旧产物残留
  fs.rmSync(cfg.STAGING_DIR, { recursive: true, force: true });

  let processed = 0;
  let copied = 0;
  for (const section of cfg.SECTIONS) {
    const srcRoot = path.join(cfg.SOURCE_DOCS, section);
    if (!fs.existsSync(srcRoot)) {
      console.warn(`[replace] section not found, skipping: ${srcRoot}`);
      continue;
    }
    for (const file of walk(srcRoot)) {
      const rel = path.relative(cfg.SOURCE_DOCS, file);
      if ((cfg.EXCLUDE || []).includes(rel)) {
        continue; // 隐藏:安装/下载/分发类
      }
      // .mdx 改名为 .md(地图 URL 用 .md);文件名里的 goose 也大小写保留替换
      const destRel = rel
        .replace(/\.mdx$/, '.md')
        .replace(/GOOSE/g, 'AGNES')
        .replace(/Goose/g, 'Agnes')
        .replace(/goose/g, 'agnes');
      const dest = path.join(stagingDocs, destRel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });

      if (TRANSFORM_EXT.test(file)) {
        fs.writeFileSync(dest, applyReplacements(fs.readFileSync(file, 'utf-8')));
        processed++;
      } else {
        fs.copyFileSync(file, dest);
        copied++;
      }
    }
  }
  console.log(`[replace] 已替换 ${processed} 个文件(md/mdx/json),原样拷贝 ${copied} 个 → ${stagingDocs}`);
}

run();
