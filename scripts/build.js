const fs = require('fs');
const path = require('path');
const cfg = require('./config');

function run() {
  const stagingDocs = path.join(cfg.STAGING_DIR, 'docs');
  const stagingMap = path.join(cfg.STAGING_DIR, cfg.MAP_FILENAME);

  if (!fs.existsSync(stagingDocs) || !fs.existsSync(stagingMap)) {
    console.error('[copy] 缺少中间产物,请先运行: npm run replace && npm run map');
    process.exit(1);
  }

  // 发布 docs/(先清掉旧的,保证删除的源文件不残留)
  const publishDocs = path.join(cfg.PUBLISH_ROOT, 'docs');
  fs.rmSync(publishDocs, { recursive: true, force: true });
  fs.cpSync(stagingDocs, publishDocs, { recursive: true });

  // 发布地图到项目根
  const publishMap = path.join(cfg.PUBLISH_ROOT, cfg.MAP_FILENAME);
  fs.copyFileSync(stagingMap, publishMap);

  const count = countFiles(publishDocs);
  console.log(`[copy] 已发布 ${count} 个页面 → ${publishDocs}`);
  console.log(`[copy] 已发布地图 → ${publishMap}`);
  console.log('[copy] 现在可以提交并 push 本项目,raw 地址即文档基址。');
}

function countFiles(dir) {
  let n = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) n += countFiles(path.join(dir, entry.name));
    else if (entry.name.endsWith('.md')) n++;
  }
  return n;
}

run();
