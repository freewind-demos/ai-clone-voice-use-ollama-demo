# AI 语音克隆演示

问题：代码跑通了，但是mac air 本机跑模型太慢，长时间无法生成声音。需要使用更高级的 GPU 服务器。

这是一个基于 Ollama 的语音克隆演示项目，可以通过录制一段语音样本来克隆说话者的声音，并用克隆的声音朗读指定文本。

## 功能特点

- 🎤 实时录音功能
- 🔊 语音克隆
- 📝 文本转语音
- 🌐 支持中文
- 💻 友好的用户界面

## 环境要求

- Node.js 16+
- pnpm
- Ollama

## 安装和运行

### 1. 安装依赖

#### 安装 Ollama

1. macOS
```bash
brew install ollama  # macOS
```

#### 安装语音模型

```bash
# 启动 Ollama 服务
ollama serve

# 安装支持语音生成的模型（选择一个即可）
ollama pull dolphin-mixtral   # 支持语音生成和中文
# 或
ollama pull bakllava          # 支持语音和图像生成
# 或
ollama pull llava             # Meta 官方多模态模型
```

#### 安装前端依赖
```bash
# 安装前端依赖
pnpm install
```

### 2. 启动应用

1. 确保 Ollama 服务正在运行
```bash
# 新开一个终端
ollama serve
```

2. 启动应用
```bash
# 启动前端和后端
pnpm start
```

## 项目结构

```
ai-clone-voice-demo/
├── src/                # 前端代码
├── voice-clone-api/    # 后端代码
│   ├── src/           # TypeScript API 代码
│   └── temp/          # 临时文件目录
└── package.json
```

## 使用说明

1. 录制语音样本
   - 点击"开始录音"按钮
   - 清晰地说一段话（建议15-30秒）
   - 点击"停止录音"按钮

2. 输入要转换的文本
   - 在文本框中输入想要用克隆声音朗读的文本
   - 点击"生成克隆语音"按钮

3. 听取结果
   - 等待生成完成
   - 使用音频播放器控制播放生成的语音

## 可用的命令

- `pnpm install` - 安装依赖
- `pnpm start` - 启动前端和后端服务
- `pnpm build` - 构建项目
- `pnpm lint` - 运行代码检查

## 注意事项

- 确保麦克风正常工作且允许浏览器访问
- 录音时尽量保持环境安静，声音清晰
- 生成的语音质量取决于输入样本的质量和文本的长度
- 首次使用时模型下载可能需要一些时间
- 确保 Ollama 服务正常运行（`ollama serve`）

## License

MIT
