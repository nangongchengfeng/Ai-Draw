# 我画AI猜 - 互动绘画游戏

一个基于Vue 3 + Vite开发的"我画AI猜"互动游戏，用户在绘图板上作画，AI通过多模态大模型识别并猜测内容。

## 功能特性

- 🎨 **流畅的绘图体验**，支持鼠标和触摸操作
- ✏️ **可调整画笔**颜色、粗细，支持撤销、清空功能
- 🤖 **AI智能评分系统**，通过多模态大模型分析画作相似度
- ⏱️ **游戏倒计时**，画得越快时间加成越高
- 🎯 **三种难度选择**
  - 简单：3轮，每轮90秒
  - 中等：5轮，每轮60秒
  - 困难：8轮，每轮30秒
- 📊 **完整的评分详情**，显示相似度、时间加成、AI评语
- 📋 **游戏历史记录**，本地存储最近20局游戏
- 🎮 **称号系统**，根据最终得分授予不同称号
- 🔄 **API重试机制**，网络错误自动重试3次
- 📱 **响应式设计**，适配PC和移动端
- 🎨 **手绘涂鸦风格**UI，轻松有趣的游戏氛围

## 技术栈

- 前端框架：Vue 3 (Composition API)
- 构建工具：Vite 5
- HTTP请求：Axios
- 样式：Sass/CSS3
- 核心API：HTML5 Canvas

## AI评分机制

游戏采用智能评分系统：

1. **相似度评分**（0-100分）：AI根据画作与目标词的匹配程度给出
2. **时间加成系数**（1.0-2.0倍）：画得越快，加成越高
3. **最终得分** = 相似度 × 时间加成（最高100分）
4. **匹配成功**：相似度 ≥ 50分即算本轮猜对

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
创建 `.env` 文件，并填写你的LLM API配置：
```env
# LLM API配置
VITE_LLM_API_KEY=your_api_key_here
VITE_LLM_MODEL=gpt-4-vision-preview
VITE_LLM_API_ENDPOINT=https://api.openai.com/v1/chat/completions
VITE_LLM_MAX_TOKENS=500
VITE_LLM_TEMPERATURE=0.7
VITE_LLM_API_TYPE=openai

# 游戏配置（可选，默认已设置）
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
- 硅基流动等第三方API提供商
- 其他兼容OpenAI API格式的多模态模型

### API类型配置

- `openai`: OpenAI兼容格式（默认）
- `aliyun`: 阿里云通义千问格式

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
│   │   └── style/
│   │       └── global.scss # 全局样式
│   ├── components/        # Vue组件
│   │   ├── Canvas/
│   │   │   └── DrawingCanvas.vue  # 绘图板组件
│   │   └── DoodleDecorations.vue  # 装饰元素
│   ├── composables/       # 组合式函数封装
│   │   └── useGameFlow.js # 游戏流程控制
│   ├── services/          # API服务层
│   │   └── aiService.js   # AI API调用封装（含重试机制）
│   ├── data/
│   │   └── wordLibrary.js # 词库
│   ├── App.vue            # 根组件
│   └── main.js            # 应用入口
├── .env                   # 环境变量
├── vite.config.js
├── package.json
└── README.md
```

## 玩家称号

- 🏆 **绘画大师**：400分及以上
- 🎨 **灵魂画手**：250-399分
- ✏️ **创意画家**：100-249分
- 🌟 **初出茅庐**：0-99分

## License
MIT
