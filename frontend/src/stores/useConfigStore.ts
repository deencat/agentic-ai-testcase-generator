/**
 * Configuration Store
 * Manages LLM provider settings and API configuration
 * 
 * This store handles:
 * - LLM provider selection (Ollama, OpenRouter, Deepseek, Gemini)
 * - API keys and authentication
 * - Model parameters (temperature, max tokens)
 * - Connection status
 * 
 * @module stores/useConfigStore
 */

import { create } from 'zustand';

/**
 * KB Configuration interface
 */
interface KBConfig {
  /** Similarity threshold (0.0-1.0) */
  threshold: number;
  /** Maximum KB documents to use */
  maxDocs: number;
}

/**
 * State interface for LLM configuration
 */
interface ConfigState {
  /** Selected LLM provider */
  llmProvider: 'ollama' | 'openrouter' | 'deepseek' | 'gemini';
  
  /** API key for cloud providers (OpenRouter, Deepseek, Gemini) */
  apiKey: string;
  
  /** Model name to use (e.g., 'llama2', 'gpt-4', 'deepseek-chat') */
  modelName: string;
  
  /** Temperature for LLM generation (0.0-1.0) */
  temperature: number;
  
  /** Maximum tokens for LLM response */
  maxTokens: number;
  
  /** Whether LLM connection is active */
  isConnected: boolean;
  
  /** Knowledge Base configuration */
  kbConfig: KBConfig;
  
  /** Set LLM provider */
  setLlmProvider: (provider: 'ollama' | 'openrouter' | 'deepseek' | 'gemini') => void;
  
  /** Set API key */
  setApiKey: (key: string) => void;
  
  /** Set model name */
  setModelName: (name: string) => void;
  
  /** Set temperature parameter */
  setTemperature: (temp: number) => void;
  
  /** Set max tokens parameter */
  setMaxTokens: (tokens: number) => void;
  
  /** Set connection status */
  setIsConnected: (connected: boolean) => void;
  
  /** Set KB configuration */
  setKbConfig: (config: Partial<KBConfig>) => void;
  
  /** Reset all config to defaults */
  reset: () => void;
}

/**
 * Zustand store for LLM configuration state
 * 
 * @example
 * ```tsx
 * const { llmProvider, setLlmProvider, isConnected } = useConfigStore();
 * 
 * // Change provider
 * setLlmProvider('gemini');
 * 
 * // Check connection
 * if (!isConnected) {
 *   console.warn('LLM not connected');
 * }
 * ```
 */
export const useConfigStore = create<ConfigState>((set) => ({
  llmProvider: 'ollama',
  apiKey: '',
  modelName: 'llama2',
  temperature: 0.7,
  maxTokens: 2048,
  isConnected: false,
  kbConfig: {
    threshold: 0.7,
    maxDocs: 5,
  },
  setLlmProvider: (provider) => set({ llmProvider: provider }),
  setApiKey: (key) => set({ apiKey: key }),
  setModelName: (name) => set({ modelName: name }),
  setTemperature: (temp) => set({ temperature: temp }),
  setMaxTokens: (tokens) => set({ maxTokens: tokens }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  setKbConfig: (config) => set((state) => ({ 
    kbConfig: { ...state.kbConfig, ...config } 
  })),
  reset: () =>
    set({
      llmProvider: 'ollama',
      apiKey: '',
      modelName: 'llama2',
      temperature: 0.7,
      maxTokens: 2048,
      isConnected: false,
      kbConfig: {
        threshold: 0.7,
        maxDocs: 5,
      },
    }),
}));
