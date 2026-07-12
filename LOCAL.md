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
  data/           # JSON 数据（书单、电影、时间线、年度目标等）
  App.tsx         # 路由
public/           # 静态资源（图片、PDF 等），构建时原样拷贝
```

### 改内容通常改这里

- 首页信息 / 时间线 / 年度目标：`src/data/*.json`
- 页面布局与样式：`src/pages/`、`src/components/`
- 图片等静态文件：放进 `public/`，代码里用 `/personal/你的文件名` 引用

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
