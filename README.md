# 泠晞 · 阅读站（静态版）

《泠晞》小说的在线阅读网站，纯静态前端，可直接部署到 GitHub Pages / Gitee Pages 等任意静态托管。

## 目录结构

```
├── index.html      # 页面
├── style.css       # 样式（含夜间模式）
├── app.js          # 逻辑（自动识别部署路径 + 读取 chapters.json + 章节 md）
├── chapters.json   # 章节清单（id / title / file）
├── chapters/       # 正文，每章一个 .md（文件名为 01.md、02.md … 纯数字）
└── README.md
```

## 部署到 GitHub Pages

1. 新建仓库，把本目录全部文件推上去：
   ```bash
   git init
   git add .
   git commit -m "initial"
   git remote add origin <你的仓库地址>
   git push -u origin main
   ```
2. 仓库 Settings → Pages → Source 选 `Deploy from a branch` → 分支 `main`，根目录 `/`，Save。
3. 等一两分钟，访问 `https://<用户名>.github.io/<仓库名>/`。

> 路径自动识别：无论部署在根域名还是 `/<仓库名>/` 子路径，前端都会自动适配，无需改代码。

## 部署到 Gitee Pages

1. 先实名认证（Gitee Pages 要求）。
2. 推送代码后：仓库 → 服务 → Gitee Pages → 部署分支 `master`（或你的分支）→ 目录 `/` → 强制 HTTPS → 启动。
3. 免费版首次人工审核（几小时~1天），通过后访问 `https://<用户名>.gitee.io/<仓库名>/`。
4. 每次更新内容后，回到 Gitee Pages 页面点「更新」。

## 新增章节

1. 在 `chapters/` 下新建纯数字文件（如 `25.md`）；
2. 在 `chapters.json` 的 `chapters` 数组追加 `{ "id": 25, "title": "标题", "file": "chapters/25.md" }`；
3. 推送即可，无需任何构建。

## 本地预览

```bash
python -m http.server 8080
# 打开 http://127.0.0.1:8080
```

（注意：直接用系统 `file://` 双击 index.html 打开会因浏览器安全限制读不了 md 文件，请用本地服务器或部署后访问。）

## 排障

- 页面打开但提示加载失败：按 F12 → Console 会打印具体失败的文件 URL，对照该路径确认仓库里文件是否在对应位置。
- 只改了正文没生效：GitHub Pages 一般几分钟内自动更新；Gitee Pages 必须手动点「更新」。
