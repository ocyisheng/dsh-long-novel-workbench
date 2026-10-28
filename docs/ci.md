# GitHub 自动化配置

> 从 .github/README.md 移到这里：GitHub 会优先把 .github/README.md 当作仓库首页 README 渲染，
> 放在 .github/ 下会把根目录的 README 挡住。

- `workflows/ci.yml`：每次 push / PR 跑语法检查 + 版本 / CHANGELOG / 发布说明一致性预检（不跑自动化测试）。
- `workflows/publish.yml`：推 `v*` tag 时校验 tag 与 `package.json` 版本一致，然后发布到 npm（凭据：仓库 secret `NPM_TOKEN`）。
- `ISSUE_TEMPLATE/`：Issue 模板；`PULL_REQUEST_TEMPLATE.md`：PR 模板。
