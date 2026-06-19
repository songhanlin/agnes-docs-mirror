const fs = require('fs');
const path = require('path');
const cfg = require('./config');

// 对齐 goose-docs.ai 的格式:剥掉 docusaurus frontmatter 和 import 语句,保留 JSX 与正文
function cleanDoc(md) {
  return md
    .replace(/^---\n[\s\S]*?\n---\n/, '') // 去掉开头 frontmatter
    .replace(/^import\s+.*\n/gm, '') // 去掉 MDX import 语句
    .replace(/^export\s+.*\n/gm, '') // 去掉 MDX export 语句
    .replace(/^\s+/, ''); // 去掉清理后开头多余空行
}

function publishDir(srcDir, destDir) {
  fs.rmSync(destDir, { recursive: true, force: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      publishDir(src, dest);
    } else {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      if (entry.name.endsWith('.md')) {
        fs.writeFileSync(dest, cleanDoc(fs.readFileSync(src, 'utf-8')));
      } else {
        fs.copyFileSync(src, dest);
      }
    }
  }
}

function run() {
  const stagingDocs = path.join(cfg.STAGING_DIR, 'docs');
  const stagingMap = path.join(cfg.STAGING_DIR, cfg.MAP_FILENAME);

  if (!fs.existsSync(stagingDocs) || !fs.existsSync(stagingMap)) {
    console.error('[copy] 缺少中间产物,请先运行: npm run replace && npm run map');
    process.exit(1);
  }

  const publishDocs = path.join(cfg.PUBLISH_ROOT, 'docs');
  publishDir(stagingDocs, publishDocs);

  const publishMap = path.join(cfg.PUBLISH_ROOT, cfg.MAP_FILENAME);
  fs.copyFileSync(stagingMap, publishMap);

  console.log(`[copy] 已发布(已剥离 frontmatter/import)→ ${publishDocs}`);
  console.log(`[copy] 已发布地图 → ${publishMap}`);
}

run();
