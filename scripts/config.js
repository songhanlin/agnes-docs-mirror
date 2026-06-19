const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');

module.exports = {
  // 源文档:agnes-code 仓库里的 docusaurus 文档目录
  SOURCE_DOCS: '/Users/anderson/workspace/kiwi/agnes-code/documentation/docs',

  // 只镜像这两个目录(技能的 docs-map 只收录这两类)
  SECTIONS: ['getting-started', 'guides'],

  // 排除:安装/下载/分发/厂商基础设施类(对 Agnes 多为错误事实,隐藏不镜像)。
  // 路径相对 SOURCE_DOCS,用源文件名(改名前,仍含 goose)。
  EXCLUDE: [
    'getting-started/installation.md',
    'guides/custom-distributions.md',
    'guides/updating-goose.md',
    'guides/tanzu-ai-services.md',
    'guides/tanzu-cli-testing-guide.md',
    'guides/remote-goose-server.md',
  ],

  // 中间产物(替换后的文档 + 地图),会被 build 复制到发布位置;已 gitignore
  STAGING_DIR: path.join(PROJECT_ROOT, '.staging'),

  // 发布位置 = 本项目根目录(push 后 raw 基址即此)
  PUBLISH_ROOT: PROJECT_ROOT,

  // 地图文件名(技能去抓这个名字;技能 URL 需同步指向此名)
  MAP_FILENAME: 'agnes-docs-map.md',

  // 地图标题用的品牌名
  BRAND: 'Agnes',

  // 全局大小写保留替换 goose→agnes。唯一保留:这些是真实存在的外部 GitHub 地址,
  // 换了会变成不存在的仓库(404),所以不替换其中的 goose。
  KEEP_EXTERNAL: ['aaif-goose', 'block/goose'],
};
