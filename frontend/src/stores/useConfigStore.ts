import { create } from 'zustand';

interface ConfigState {
  llmProvider: 'ollama' | 'openrouter' | 'deepseek' | 'gemini';
  apiKey: string;
  modelName: string;
  temperature: number;
  maxTokens: number;
  isConnected: boolean;
  setLlmProvider: (provider: 'ollama' | 'openrouter' | 'deepseek' | 'gemini') => void;
  setApiKey: (key: string) => void;
  setModelName: (name: string) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
  setIsConnected: (connected: boolean) => void;
  reset: () => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  llmProvider: 'ollama',
  apiKey: '',
  modelName: 'llama2',
  temperature: 0.7,
  maxTokens: 2048,
  isConnected: false,
  setLlmProvider: (provider) => set({ llmProvider: provider }),
  setApiKey: (key) => set({ apiKey: key }),
  setModelName: (name) => set({ modelName: name }),
  setTemperature: (temp) => set({ temperature: temp }),
  setMaxTokens: (tokens) => set({ maxTokens: tokens }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  reset: () =>
    set({
      llmProvider: 'ollama',
      apiKey: '',
      modelName: 'llama2',
      temperature: 0.7,
      maxTokens: 2048,
      isConnected: false,
    }),
}));
