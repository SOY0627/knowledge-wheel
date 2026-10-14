# 知识转盘 🎡

一个帮助高效学习知识的前端小工具：把知识点放上转盘，随机抽取学习，支持费曼测试、苏格拉底式提问、深度讲解、概念图谱等 AI 辅助学习功能。

## 功能特性

- 🎡 **转盘随机抽题**：把知识点放上转盘，随机抽取，告别"学什么"的选择困难
- 🃏 **概念卡片**：结构化展示知识点内容与学习步骤
- 🤖 **AI 辅助学习**（可选）：深度讲解、费曼测试、苏格拉底式对话、概念图谱
  - AI 功能自带 BYOK（Bring Your Own Key）设计，API Key 仅保存在浏览器 localStorage，不经过任何服务器
  - 支持 DeepSeek / OpenAI / 智谱 的 API Key

## 技术栈

- React 18 + Vite 5
- Tailwind CSS + shadcn/ui
- framer-motion、react-router-dom

## 在线访问

🚀 **[https://soy0627.github.io/knowledge-wheel/](https://soy0627.github.io/knowledge-wheel/)**

站点由 `gh-pages` 分支托管（`npm run build` 后将 `dist/` 内容推送到该分支即可更新线上页面）。

## 本地开发

```bash
npm install
npm run dev      # 开发模式，默认 http://localhost:8080
npm run build    # 生产构建，输出到 dist/
npm run preview  # 预览生产构建
```

## License

MIT
