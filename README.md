# agnes-docs-mirror

把 `agnes-code` 仓库的文档(`documentation/docs` 下的 `getting-started` + `guides`)抽取出来、把 `goose` 关键词按规则替换为 Agnes、重新生成文档地图,产出一套**原始 markdown + 地图**,用 GitHub raw 托管,供 `agnes-doc-guide` 技能在线抓取。

> 之所以单独建这个项目:技能需要「稳定、带相对路径、返回原始 markdown」的 URL,飞书的加密分享链接做不到;GitHub raw 正好满足。

## 目录

```
agnes-docs-mirror/
├── scripts/
│   ├── config.js              # 路径 / 替换规则 / 开关(改这里)
│   ├── replace-keywords.js    # ① 源文档 → .staging/docs(替换 + .mdx→.md)
│   ├── generate-docs-map.js   # ② .staging/docs → .staging/goose-docs-map.md
│   └── build.js               # ③ .staging/* → 本项目根(docs/ + 地图)
├── docs/                      # 发布产物(脚本生成,push 上去)
├── goose-docs-map.md          # 发布产物(脚本生成,放根)
└── .staging/                  # 中间产物(gitignore)
```

## 用法

```bash
npm install
npm run build      # 等价于 replace → map → copy 三步
# 或分步:
npm run replace
npm run map
npm run copy
```

跑完后,提交并 push:`goose-docs-map.md` 在根、`docs/` 在下面。
托管基址即:`https://raw.githubusercontent.com/<owner>/agnes-docs-mirror/main`
- 地图:`<base>/goose-docs-map.md`
- 页面:`<base>/docs/guides/xxx.md`

最后把 `agnes-code` 里 `agnes-doc-guide` 技能(老版)写死的 `https://goose-docs.ai` 换成上面的 `<base>`。

## 替换规则(scripts/config.js + replace-keywords.js)

执行顺序:先处理特殊结构、保护 keep 名单,最后才做泛化的独立 `goose` 替换。

| 类别 | 处理 |
|---|---|
| Agnes 发布仓库 | `aaif-goose/goose` → `aaif-goose/agnes`(owner 保留) |
| 环境变量 | `GOOSE_*` → `AGNES_*` |
| 配置目录 | `~/.config/goose` → `~/.agnes`(注意:结构变了,非 `~/.config/agnes`) |
| hints | `.goosehints` → `.agneshints` |
| 协议 | `goose://` → `agnes://` |
| 本地目录 | `.goose` → `.agnes` |
| 散文/品牌 | 独立 `goose`/`Goose` → `Agnes` |
| **保留(不改)** | `goosed`、`goose-cli/server/mcp/bench/sdk`、`crates/goose`、`aaif-goose`、`block/goose`(源码包名/二进制/上游事实) |

## 仍需拍板的开关(scripts/config.js → options)

- `keepCliBinary`(默认 `true`):是否保留 CLI 命令里的 `goose`(如 `goose configure`)。二进制是否改名为 `agnes` 未定,默认保留以免文档教用户敲不存在的命令。
- `replaceDocsDomain`(默认 `null`):页面里 `goose-docs.ai` 链接是否替换成镜像域名。设成你的 `<base>` 即替换,留 `null` 则保留。
- `BRAND`(默认 `'Agnes'`):散文里产品名替换成的形态(大写品牌 vs 小写)。

## 同步更新

`agnes-code` 文档更新后,重跑 `npm run build` 即可重新产出,再提交 push。
源文档路径在 `scripts/config.js` 的 `SOURCE_DOCS`。
