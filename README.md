# 我画AI猜 - 互动绘画游戏

一个基于Vue 3 + Vite开发的"我画AI猜"互动游戏，用户在绘图板上作画，AI通过多模态大模型识别并猜测内容。

## 技术栈

- 前端框架：Vue 3 (Composition API)
- 构建工具：Vite 5
- HTTP请求：Axios
- 样式：Sass/CSS3
- 核心API：HTML5 Canvas

## 功能特性

- 🎨 流畅的绘图体验，支持鼠标和触摸操作
- ✏️ 可调整画笔颜色、粗细，支持撤销、清空功能
- 🤖 集成多模态大模型（GPT-4V、Claude 3、通义千问VL等）
- ⏱️ 游戏倒计时，积分系统
- 📱 响应式设计，适配PC和移动端
- 🎮 完整的游戏流程：开始-绘画-识别-结果展示

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
复制 `.env.example` 为 `.env` 文件，并填写你的LLM API配置：
```env
# LLM API配置
VITE_LLM_API_KEY=your_api_key_here
VITE_LLM_MODEL=gpt-4-vision-preview
VITE_LLM_API_ENDPOINT=https://api.openai.com/v1/chat/completions
VITE_LLM_MAX_TOKENS=300
VITE_LLM_TEMPERATURE=0.7

# 游戏配置
VITE_GAME_DRAW_TIME=60
VITE_GAME_MAX_ROUNDS=10
```

### 3. 启动开发服务器
```bash
npm run dev
```
访问 http://localhost:3000 即可开始游戏。

### 4. 生产构建
```bash
npm run build
```

## 支持的LLM模型

理论上支持所有兼容OpenAI API格式的多模态大模型：
- OpenAI GPT-4V / GPT-4o
- Anthropic Claude 3 Opus/Sonnet
- 阿里云通义千问VL
- 百度文心一言多模态
- 其他兼容OpenAI API格式的多模态模型

## 注意事项

⚠️ **重要提示**：前端直接调用LLM API会暴露你的API密钥，这仅适用于本地开发和个人使用。如果需要部署到生产环境，请务必添加后端代理层，将API请求转发到后端，由后端调用LLM API，避免密钥泄露。

### 安全建议
- 生产环境必须使用后端代理
- 添加请求频率限制，防止API滥用
- 对用户上传的图片进行内容审核

## 项目结构
```
ai-draw-guess/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 样式、图标等资源
│   ├── components/        # Vue组件
│   │   └── Canvas/DrawingCanvas.vue  # 绘图板组件
│   ├── composables/       # 组合式函数封装
│   │   └── useGameFlow.js # 游戏流程控制
│   ├── services/          # API服务层
│   │   └── aiService.js   # AI API调用封装
│   ├── App.vue            # 根组件
│   └── main.js            # 应用入口
├── .env.example           # 环境变量示例
├── vite.config.js
├── package.json
└── README.md
```

## License
MIT
