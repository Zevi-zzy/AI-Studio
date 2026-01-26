# Zevi AI Studio

Zevi AI Studio 是一款专为小红书创作者打造的智能内容生产工具。它集成了灵感生成、AI 辅助写作、图文排版、素材管理等功能，帮助创作者从选题到成稿全流程提效。

## 核心功能

*   **💡 找灵感 (Inspiration)**
    *   AI 智能生成爆款选题（基于 DeepSeek 模型）。
    *   一键采纳灵感，自动生成标题和摘要。
*   **✍️ 来创作 (Creation)**
    *   **智能标题优化**：AI 润色标题，增加 Emoji 和点击欲望。
    *   **智能正文写作**：AI 扩写、润色文案，自动分段，符合小红书风格。
    *   **图文卡片**：支持多图排版和描述。
    *   **素材插入**：写作时可直接调用素材库中的金句和图片。
*   **📦 看素材 (Materials)**
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

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT
