# 本地开发指南

这份文档不叫 `README.md`，所以不会出现在 GitHub 仓库首页。给你自己本地改站用。

线上地址：https://dongdong3272.github.io/personal

## 环境要求

- Node.js 18+（推荐 LTS）
- npm（随 Node 一起安装）

检查是否已安装：

```powershell
node -v
npm -v
```

如果提示找不到命令，先安装 Node.js：

- 官网：https://nodejs.org/
- 或用 winget：`winget install OpenJS.NodeJS.LTS`

装完后**重新打开终端**（或 Cursor），再检查版本。

## 第一次启动

在项目根目录 `d:\PersonalWeb\personal` 执行：

```powershell
npm install
npm run dev
```

终端会打印本地地址，一般是：

```
http://localhost:5173/personal/
```

注意：站点配置了 `base: "/personal/"`，所以本地也要带 `/personal/` 路径，不要只开 `http://localhost:5173/`。

改代码后页面会自动热更新（HMR）。

## 常用命令

| 命令 | 作用 |
|------|------|
| `npm run dev` | 本地开发服务器 |
| `npm run build` | 类型检查 + 生产构建，输出到 `dist/` |
| `npm run preview` | 预览构建结果 |
| `npm run deploy` | 构建并发布到 GitHub Pages |

## 项目结构（改内容时看这些）

```
src/
  pages/          # 各页面：Home / Library / Gallery / Cinema / Writings
  components/     # 导航、时间线、卡片等组件
  data/           # JSON 数据 + writings/ 下的随笔 (.md，可选 .pdf)
  App.tsx         # 路由
scripts/          # 本地工具（如 Word → Markdown 导入）
public/           # 静态资源，构建时原样拷贝
```

### 改内容通常改这里

- 首页信息 / 时间线 / 年度目标：`src/data/*.json`
- 随笔 / 文章：`src/data/writings/`（见下一节）
- 页面布局与样式：`src/pages/`、`src/components/`
- 图片等静态文件：放进 `public/`，代码里用 `/personal/你的文件名` 引用

## 新写一篇随笔 / Review（Word → 网站）

网站正文读的是 **Markdown（`.md`）**，不是 PDF。PDF 只是可选附件（详情页底部的 Download PDF）。

你平时仍用 Word 写、再导出 PDF 发给别人——这没问题。放到网站时，多一步：**用脚本把 `.docx` 转成 `.md`**，不用手抄。

### 推荐工作流

1. **Word 里写完**，文件名按约定起好（和以前 PDF 一样）：

   ```text
   标题@YYYY-MM-DD@Tag1,Tag2.docx
   ```

   例子：

   ```text
   我的父母-杂笔@2025-11-18@Essay,Personal.docx
   《新世纪福音战士》的时代回响与精神嬗变@2025-11-02@Anime,Review.docx
   ```

   - 标题、日期、标签会进 frontmatter，也会生成列表页上的卡片信息  
   - 多个 tag 用英文逗号分隔；尽量不要在 tag 里多空格（`Anime,Review` 比 `Anime, Review` 干净）

2. **（可选）导出 PDF**，文件名与 Word **同名**（只是扩展名不同），方便发给别人，也方便网站提供下载：

   ```text
   标题@YYYY-MM-DD@Tag1,Tag2.pdf
   ```

3. **一键导入**（在项目根目录 `d:\PersonalWeb\personal`）：

   ```powershell
   npm run writings:import -- "e:\随笔\标题@2025-11-18@Essay,Personal.docx"
   ```

   或直接：

   ```powershell
   python scripts/import-writing.py "e:\随笔\标题@2025-11-18@Essay,Personal.docx"
   ```

   脚本会：

   - 把 Word 转成 `src/data/writings/….md`（段落、标题、编号列表 / bullet 会尽量保留）
   - 若同目录下有同名 `.pdf`（或你用 `--pdf` 指定），一并拷进 `src/data/writings/`

4. **本地预览**：`npm run dev` → 打开 `/personal/writings`，点进新文章看排版。  
   列表有问题再微调 `.md`（例如某级列表在 Word 里标得不规范时，偶尔要手改两行）。

5. **上线**：`npm run deploy`

### 文件分别干什么

| 文件 | 作用 |
|------|------|
| `.md` | **必须有**——网站真正渲染的正文 |
| `.pdf` | 可选——有同名 PDF 时详情页才显示 Download PDF |
| `.docx` | 你的原稿，**不必**放进仓库；放 `e:\随笔\` 之类自己的文件夹即可 |

### 为什么不要只丢 PDF？

浏览器 PDF 阅读器和站点 UI 是两套东西（白底文档框、手机上也不好读）。Markdown 才能和站点字体、深色背景、手机排版融在一起。Word → Markdown 用脚本做；**不要指望从 PDF 自动转**（列表、标题很容易糊成一团，你已经见过）。

### 脚本小技巧

```powershell
# PDF 不在同目录时手动指定
python scripts/import-writing.py ".\draft.docx" --pdf ".\out.pdf"

# 文件名没按约定时，用参数补元数据（输出文件名仍跟 docx 的 stem）
python scripts/import-writing.py ".\draft.docx" --title "某标题" --date 2026-03-01 --tags "Essay,Personal"
```

## 本地改完要上线时

确认没问题后：

```powershell
npm run deploy
```

会执行 `build`，再用 `gh-pages` 把 `dist/` 推到 GitHub Pages。

## 常见问题

**页面空白 / 路由 404**  
打开的地址要带 `/personal/`，例如 `http://localhost:5173/personal/`。

**`node` / `npm` 找不到**  
Node 没装好，或装完没重启终端。重新开一个 PowerShell / Cursor 终端再试。

**端口被占用**  
Vite 会自动换端口；看终端输出里的 Local 地址即可。
