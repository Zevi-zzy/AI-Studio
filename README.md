# Zevi AI Studio

Zevi AI Studio 是一款专为小红书创作者打造的智能内容生产工具。它集成了灵感生成、AI 辅助写作、智能图文排版、素材管理等功能，帮助创作者从选题到成稿全流程提效。

## 核心功能

*   **💡 找灵感 (Inspiration)**
    *   AI 智能生成爆款选题（基于 DeepSeek 模型）。
    *   **无限采纳**：已采纳的灵感支持重复采纳，方便多次创作。
    *   自动生成标题和摘要，一键跳转创作。
*   **✍️ 来创作 (Creation)**
    *   **智能标题优化**：AI 润色标题，自动添加 Emoji 和点击欲望。
    *   **AI 封面生成**：基于笔记标题，智能设计极简主义封面（HTML 动态渲染转高清图片）。
    *   **智能图文卡片**：
        *   **AI 配图生成**：根据卡片描述自动生成排版精美的配图。
        *   **文案润色**：一键优化卡片描述，使其更具吸引力。
        *   **长文自动排版**：智能处理长文本显示。
    *   **智能正文写作**：AI 扩写、润色文案，自动分段。
    *   **素材插入**：写作时可直接调用素材库中的金句和图片。
*   **📦 看素材 (Materials)**
    *   **AI 素材生成**：输入描述，AI 自动生成带设计感的图片素材，并自动匹配标签。
    *   **素材管理**：上传图片、录入金句/话术。
    *   **标签筛选**：支持按类型（图片/文本）和标签快速检索素材。
*   **👤 个人中心 (Profile)**
    *   创作数据统计。
    *   已发布作品管理。

## 技术栈

*   **前端框架**: React + TypeScript + Vite
*   **UI 库**: Tailwind CSS + Lucide React
*   **状态管理**: Zustand
*   **本地存储**: IndexedDB (Dexie.js)
*   **编辑器**: Tiptap (Headless wrapper around ProseMirror)
*   **图像处理**: html2canvas (用于 DOM 转图片)
*   **AI 模型**: DeepSeek-V3 (via HTTP API)

## 快速开始

1.  克隆仓库：
    ```bash
    git clone https://github.com/Zevi-zzy/AI-Studio.git
    ```
2.  安装依赖：
    ```bash
    npm install
    ```
3.  配置环境变量：
    在根目录创建 `.env` 文件，填入您的 DeepSeek API Key：
    ```env
    VITE_DEEPSEEK_API_KEY=your_api_key_here
    ```
4.  启动开发服务器：
    ```bash
    npm run dev
    ```

## 部署

本项目支持一键部署到 Vercel。请确保在 Vercel 项目设置中配置 `VITE_DEEPSEEK_API_KEY` 环境变量。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT
