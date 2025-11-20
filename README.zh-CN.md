<img src="icon.png" alt="Beautiful JSON Formatter" width="128" />


# 美观 JSON 格式化器

在 Chrome 中自动检测并将 JSON 格式化为美观、可交互的树状视图。

中文 | [English](README.md)

## 功能
- 自动检测 JSON 响应并渲染交互式树状视图
- 对象/数组可折叠，闭合括号独立成行
- 随深度对齐的行号显示在左侧边栏
- 工具栏：原始/格式化切换、行号开关、复制 JSON
- 默认深色主题

## 工作原理
- 内容脚本在所有页面上运行，检测到 JSON 时激活（`manifest.json:13-17`，`content.js:222-227`）。
- 替换页面主体为格式化视图，并加入工具栏（`content.js:230-251`）。
- UI 行为由原生 JS 构建，样式通过 CSS 变量实现（`content.js:160-219`，`styles.css:1-20`）。

## 安装（加载未打包）
1. 在 Chrome 地址栏打开 `chrome://extensions`
2. 开启 `开发者模式`
3. 点击 `加载已解压的扩展程序`
4. 选择本项目文件夹
5. 访问返回 JSON 的地址（如 `https://api.github.com`）即可看到格式化效果

## 使用
- 切换 `Show Raw` 在原始 JSON 与格式化视图间切换（`content.js:170-176`）
- 切换 `Line Numbers` 显示/隐藏行号（`content.js:189-197`）
- 点击 `Copy JSON` 复制美化后的 JSON（`content.js:206-215`）

## 开发
- Manifest v3 定义了一个内容脚本及样式（`manifest.json:2`，`manifest.json:13-17`）
- 通过 `test.html` 可快速预览，无需加载扩展（`test.html:1-33`）
- 核心渲染包括折叠器与逐行编号（`content.js:39-120`，`content.js:150-158`）
- 样式使用 CSS 变量，并基于深度计算行号位置（`styles.css:1-20`，`styles.css:60-86`）

## 打包
- 压缩包含 `manifest.json`、`content.js`、`styles.css`、图标 的文件夹以便分发
- 开发阶段可直接使用未打包加载

## 权限与隐私
- 作为内容脚本运行在 `<all_urls>`（`manifest.json:13`）
- 不发起网络请求、不收集数据；所有处理均在浏览器本地完成

## 兼容性
- 面向 Chrome Manifest V3
- 适用于支持 MV3 的 Chromium 浏览器

## 许可证
MIT。可自由使用、修改与分发。