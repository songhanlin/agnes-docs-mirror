const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const cfg = require('./config');

// 文档目录 = 替换后的中间产物(.mdx 已改名为 .md)
const DOCS_DIR = path.join(cfg.STAGING_DIR, 'docs');
const OUTPUT_FILE = path.join(cfg.STAGING_DIR, cfg.MAP_FILENAME);

function getTitle(data, content) {
  if (data.title) return data.title;
  if (data.sidebar_label) return data.sidebar_label;
  const h1 = content.match(/^#\s+(.+)$/m);
  return h1 ? h1[1].trim() : null;
}

function getHeadings(content) {
  const lines = [];
  for (const m of content.matchAll(/^(#{2,6})\s+(.+)$/gm)) {
    const indent = '  '.repeat(m[1].length - 2);
    lines.push(`${indent}* ${m[2].trim()}`);
  }
  return lines.join('\n');
}

async function run() {
  const { globby } = await import('globby');

  const sections = [
    { name: 'Getting Started', pattern: 'getting-started/**/*.md' },
    { name: 'Guides', pattern: 'guides/**/*.md' },
  ];

  const docsBase = cfg.options.replaceDocsDomain || 'https://goose-docs.ai/';
  let output = `# ${cfg.BRAND} Documentation Map\n\n> Auto-generated. Do not edit by hand.\n\n`;

  let total = 0;
  for (const section of sections) {
    const files = await globby(section.pattern, { cwd: DOCS_DIR });
    if (!files.length) continue;
    output += `## ${section.name}\n\n`;
    for (const file of files.sort()) {
      try {
        const raw = fs.readFileSync(path.join(DOCS_DIR, file), 'utf-8');
        const { data, content } = matter(raw);
        const title = getTitle(data, content);
        if (!title) {
          console.warn(`[map] no title, skipping: ${file}`);
          continue;
        }
        const urlPath = `docs/${file}`;
        const headings = getHeadings(content);
        output += `### [${title}](${urlPath})\n\n`;
        if (headings) output += `${headings}\n\n`;
        total++;
      } catch (err) {
        console.warn(`[map] could not process ${file}, skipping`, err.message);
      }
    }
  }

  output += `---\n\n> Full docs: ${docsBase}\n`;
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, output);
  console.log(`[map] 已生成地图,收录 ${total} 个页面 → ${OUTPUT_FILE}`);
}

run();
