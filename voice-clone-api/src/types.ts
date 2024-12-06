export interface VoiceSettings {
    stability: number;
    similarity_boost: number;
}

export interface TTSRequest {
    text: string;
    model_id: string;
    voice_settings: VoiceSettings;
}

export interface VoiceResponse {
    voice_id: string;
} 