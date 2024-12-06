import { useState, useRef } from 'react';
import {
    Button,
    Input,
    Typography,
    Card,
    Space,
    Spin,
    message
} from 'antd';
import { AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';
import WaveSurfer from 'wavesurfer.js';

const { TextArea } = Input;
const { Title } = Typography;

function App() {
    const [isRecording, setIsRecording] = useState(false);
    const [sampleAudio, setSampleAudio] = useState<Blob | null>(null);
    const [targetText, setTargetText] = useState('');
    const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const wavesurferRef = useRef<WaveSurfer | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                setSampleAudio(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('录音失败:', error);
            message.error('无法访问麦克风');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const generateClonedVoice = async () => {
        if (!sampleAudio || !targetText) return;

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('sample_audio', sampleAudio);
            formData.append('text', targetText);

            const response = await fetch('http://localhost:8000/api/clone-voice', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || '服务器响应错误');
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            setGeneratedAudio(audioUrl);
            message.success('语音生成成功！');
        } catch (error) {
            console.error('生成克隆语音失败:', error);
            message.error(error instanceof Error ? error.message : '生成语音失败，请重试');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
                AI 语音克隆演示
            </Title>

            <Card title="第 1 步：录制你的声音样本" style={{ marginBottom: 24 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button
                        type="primary"
                        icon={isRecording ? <AudioMutedOutlined /> : <AudioOutlined />}
                        onClick={isRecording ? stopRecording : startRecording}
                        danger={isRecording}
                    >
                        {isRecording ? '停止录音' : '开始录音'}
                    </Button>
                    {sampleAudio && (
                        <audio controls src={URL.createObjectURL(sampleAudio)} style={{ width: '100%' }} />
                    )}
                </Space>
            </Card>

            <Card title="第 2 步：输入要转换的文本" style={{ marginBottom: 24 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <TextArea
                        rows={4}
                        value={targetText}
                        onChange={(e) => setTargetText(e.target.value)}
                        placeholder="请输入要用克隆声音朗读的文本..."
                    />
                    <Button
                        type="primary"
                        onClick={generateClonedVoice}
                        disabled={!sampleAudio || !targetText || isLoading}
                        loading={isLoading}
                    >
                        生成克隆语音
                    </Button>
                </Space>
            </Card>

            {generatedAudio && (
                <Card title="生成的克隆语音">
                    <audio controls src={generatedAudio} style={{ width: '100%' }} />
                </Card>
            )}
        </div>
    );
}

export default App;
