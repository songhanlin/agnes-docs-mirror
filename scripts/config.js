const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');

module.exports = {
  // 源文档:agnes-code 仓库里的 docusaurus 文档目录
  SOURCE_DOCS: '/Users/anderson/workspace/kiwi/agnes-code/documentation/docs',

  // 只镜像这两个目录(技能的 docs-map 只收录这两类)
  SECTIONS: ['getting-started', 'guides'],

  // 中间产物(替换后的文档 + 地图),会被 build 复制到发布位置;已 gitignore
  STAGING_DIR: path.join(PROJECT_ROOT, '.staging'),

  // 发布位置 = 本项目根目录。push 到 GitHub 后:
  //   地图  -> raw.../<repo>/main/goose-docs-map.md
  //   页面  -> raw.../<repo>/main/docs/<path>.md
  PUBLISH_ROOT: PROJECT_ROOT,

  // 地图文件名:保持 goose-docs-map.md 与老版技能兼容(技能写死抓这个名字)
  MAP_FILENAME: 'goose-docs-map.md',

  // 品牌词:散文里的 goose/Goose 替换成什么(产品名)
  BRAND: 'Agnes',

  options: {
    // 是否保留 CLI 命令里的 goose(如 `goose configure`)。
    // 二进制是否改名为 agnes 尚未拍板,默认保留 goose,避免文档教用户敲不存在的命令。
    keepCliBinary: true,

    // goose-docs.ai 域名怎么处理:
    //   null         -> 保留 goose-docs.ai 不动
    //   '<base-url>' -> 替换成你的镜像域名(不带结尾斜杠),如 'https://raw.githubusercontent.com/<owner>/agnes-docs-mirror/main'
    replaceDocsDomain: null,
  },

  // 保留名单:这些 goose 复合词是源码 crate/包名、二进制名、上游事实引用,绝不替换
  KEEP_TOKENS: [
    'goosed',
    'goose-cli',
    'goose-server',
    'goose-mcp',
    'goose-bench',
    'goose-sdk-types',
    'goose-sdk',
    'goose-acp-macros',
    'goose-test-support',
    'goose-test',
    'goose-providers',
    'crates/goose',
    'aaif-goose',
    'block/goose',
  ],
};
