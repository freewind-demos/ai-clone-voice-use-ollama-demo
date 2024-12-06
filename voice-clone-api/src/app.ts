import express from 'express';
import cors from 'cors';
import multer from 'multer';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({
    storage: multer.diskStorage({
        destination: path.join(__dirname, '../temp'),
        filename: (req, file, cb) => {
            cb(null, `input-${Date.now()}.wav`);
        }
    })
});

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

app.post('/api/clone-voice', upload.single('sample_audio'), async (req, res) => {
    try {
        if (!req.file || !req.body.text) {
            return res.status(400).json({ error: '缺少音频样本或文本' });
        }

        // 调用 Ollama API
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'dolphin-mixtral',  // 支持语音生成的模型
            prompt: `
                我有一段语音样本和一段文本。
                请使用这段语音样本的声音特征来朗读下面的文本：
                
                文本内容：${req.body.text}
                
                请确保生成的语音保持原始声音的特点，包括音色、语气和语调。
                请直接返回音频数据，不要返回其他文本。
                请以 WAV 格式返回音频。
            `,
            stream: false
        });

        // 假设 Ollama 返回的是 base64 编码的音频数据
        const audioBuffer = Buffer.from(response.data.response, 'base64');
        res.setHeader('Content-Type', 'audio/wav');
        res.send(audioBuffer);

    } catch (error) {
        console.error('语音克隆失败:', error);
        res.status(500).json({
            error: '语音生成失败',
            detail: error instanceof Error ? error.message : '未知错误'
        });
    }
});

export default app; 