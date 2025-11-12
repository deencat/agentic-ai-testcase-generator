/**
 * Configuration Drawer Component
 * Slide-in configuration panel for LLM and Knowledge Base settings
 * 
 * Features:
 * - LLM provider selection (Ollama, OpenRouter, Deepseek, Gemini)
 * - Model configuration (name, temperature, max tokens)
 * - API key input (masked, for cloud providers)
 * - Knowledge Base settings (threshold, max docs)
 * - Test connection button
 * - Save/Cancel actions
 * 
 * Week 4: Configuration Drawer Implementation
 * 
 * @component
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useConfigStore } from '@/stores/useConfigStore';
import { useKBStore } from '@/stores/useKBStore';
import { api } from '@/lib/api';
import { Settings, Zap, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface ConfigDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Configuration Drawer Component
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <Button onClick={() => setIsOpen(true)}>Configure</Button>
 * <ConfigDrawer open={isOpen} onOpenChange={setIsOpen} />
 * ```
 */
export function ConfigDrawer({ open, onOpenChange }: ConfigDrawerProps) {
  // Config store state
  const {
    llmProvider,
    apiKey,
    modelName,
    temperature,
    maxTokens,
    isConnected,
    kbConfig,
    setLlmProvider,
    setApiKey,
    setModelName,
    setTemperature,
    setMaxTokens,
    setIsConnected,
    setKbConfig,
  } = useConfigStore();

  // KB store state (for document count display)
  const { documents: kbDocuments } = useKBStore();

  // Local state for form (to allow cancel)
  const [localProvider, setLocalProvider] = useState(llmProvider);
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localModelName, setLocalModelName] = useState(modelName);
  const [localTemperature, setLocalTemperature] = useState(temperature);
  const [localMaxTokens, setLocalMaxTokens] = useState(maxTokens);
  const [localKbThreshold, setLocalKbThreshold] = useState(kbConfig.threshold);
  const [localKbMaxDocs, setLocalKbMaxDocs] = useState(kbConfig.maxDocs);

  // Connection testing state
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testMessage, setTestMessage] = useState('');

  // Saving state
  const [saving, setSaving] = useState(false);

  // Sync local state with store when drawer opens
  useEffect(() => {
    if (open) {
      setLocalProvider(llmProvider);
      setLocalApiKey(apiKey);
      setLocalModelName(modelName);
      setLocalTemperature(temperature);
      setLocalMaxTokens(maxTokens);
      setLocalKbThreshold(kbConfig.threshold);
      setLocalKbMaxDocs(kbConfig.maxDocs);
    }
  }, [open, llmProvider, apiKey, modelName, temperature, maxTokens, kbConfig]);

  // Load config from backend on mount
  useEffect(() => {
    const loadConfig = async () => {
      const result = await api.getConfig();
      if (result.data) {
        setLlmProvider(result.data.llm_provider || 'ollama');
        setModelName(result.data.model_name || 'llama2');
        setTemperature(result.data.temperature || 0.7);
        setMaxTokens(result.data.max_tokens || 2048);
        setApiKey(result.data.api_key || '');
        
        // KB config from backend
        if (result.data.kb_config) {
          setKbConfig({
            threshold: result.data.kb_config.threshold || 0.7,
            maxDocs: result.data.kb_config.max_docs || 5,
          });
        }
      }
    };
    
    loadConfig();
  }, [setLlmProvider, setModelName, setTemperature, setMaxTokens, setApiKey, setKbConfig]);

  /**
   * Test LLM connection with current settings
   */
  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    setTestMessage('');

    try {
      const result = await api.testConnection();
      
      if (result.data && result.data.status === 'connected') {
        setTestResult('success');
        setTestMessage(result.data.message || 'Connection successful!');
        setIsConnected(true);
      } else {
        setTestResult('error');
        setTestMessage(result.error || 'Connection failed');
        setIsConnected(false);
      }
    } catch (error) {
      setTestResult('error');
      setTestMessage('Connection test failed');
      setIsConnected(false);
    } finally {
      setTestingConnection(false);
    }
  };

  /**
   * Save configuration to backend
   */
  const handleSave = async () => {
    setSaving(true);

    try {
      const configData = {
        llm_provider: localProvider,
        model_name: localModelName,
        temperature: localTemperature,
        max_tokens: localMaxTokens,
        api_key: localApiKey,
        kb_config: {
          threshold: localKbThreshold,
          max_docs: localKbMaxDocs,
        },
      };

      const result = await api.saveConfig(configData);

      if (result.data || result.error === undefined) {
        // Update store with local values
        setLlmProvider(localProvider);
        setApiKey(localApiKey);
        setModelName(localModelName);
        setTemperature(localTemperature);
        setMaxTokens(localMaxTokens);
        setKbConfig({
          threshold: localKbThreshold,
          maxDocs: localKbMaxDocs,
        });

        onOpenChange(false);
      } else {
        alert('Failed to save configuration: ' + result.error);
      }
    } catch (error) {
      alert('Error saving configuration');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Cancel and close drawer
   */
  const handleCancel = () => {
    onOpenChange(false);
  };

  /**
   * Whether API key is required for selected provider
   */
  const requiresApiKey = localProvider !== 'ollama';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration
          </SheetTitle>
          <SheetDescription>
            Configure LLM provider and Knowledge Base settings
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* LLM Provider Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">LLM Provider</h3>
              {isConnected && (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              )}
            </div>

            {/* Provider Selection */}
            <div className="grid grid-cols-2 gap-3">
              {(['ollama', 'openrouter', 'deepseek', 'gemini'] as const).map((provider) => (
                <button
                  key={provider}
                  onClick={() => setLocalProvider(provider)}
                  className={`p-3 border-2 rounded-lg text-left transition-all ${
                    localProvider === provider
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium capitalize">{provider}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {provider === 'ollama' && 'Local LLM'}
                    {provider === 'openrouter' && 'Cloud Aggregator'}
                    {provider === 'deepseek' && 'Cloud LLM'}
                    {provider === 'gemini' && 'Google AI'}
                  </div>
                </button>
              ))}
            </div>

            {/* API Key Input (for cloud providers) */}
            {requiresApiKey && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  API Key <span className="text-red-500">*</span>
                </label>
                <Input
                  type="password"
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  placeholder={`Enter ${localProvider} API key`}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is encrypted and stored securely
                </p>
              </div>
            )}

            {/* Model Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Model Name
              </label>
              <Input
                value={localModelName}
                onChange={(e) => setLocalModelName(e.target.value)}
                placeholder={
                  localProvider === 'ollama' ? 'llama2' :
                  localProvider === 'openrouter' ? 'openai/gpt-4' :
                  localProvider === 'deepseek' ? 'deepseek-chat' :
                  'gemini-pro'
                }
              />
              <p className="text-xs text-muted-foreground">
                {localProvider === 'ollama' && 'e.g., llama2, mistral, codellama'}
                {localProvider === 'openrouter' && 'e.g., openai/gpt-4, anthropic/claude-3'}
                {localProvider === 'deepseek' && 'e.g., deepseek-chat, deepseek-coder'}
                {localProvider === 'gemini' && 'e.g., gemini-pro, gemini-1.5-pro'}
              </p>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Temperature</label>
                <span className="text-sm text-muted-foreground">{localTemperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={localTemperature}
                onChange={(e) => setLocalTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Focused (0.0)</span>
                <span>Creative (1.0)</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Tokens</label>
              <Input
                type="number"
                min="512"
                max="8192"
                step="256"
                value={localMaxTokens}
                onChange={(e) => setLocalMaxTokens(parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Maximum tokens in LLM response (512-8192)
              </p>
            </div>

            {/* Test Connection Button */}
            <Button
              onClick={handleTestConnection}
              disabled={testingConnection || (requiresApiKey && !localApiKey)}
              variant="outline"
              className="w-full"
            >
              {testingConnection ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>

            {/* Connection Test Result */}
            {testResult && (
              <div
                className={`p-3 rounded-lg border ${
                  testResult === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200'
                    : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {testResult === 'success' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">{testMessage}</span>
                </div>
              </div>
            )}
          </div>

          {/* Knowledge Base Configuration Section */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold">Knowledge Base Settings</h3>

            {/* KB Threshold */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Similarity Threshold</label>
                <span className="text-sm text-muted-foreground">{(localKbThreshold * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={localKbThreshold}
                onChange={(e) => setLocalKbThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Less Strict (0%)</span>
                <span>Very Strict (100%)</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum similarity score to include KB context (recommended: 70-80%)
              </p>
            </div>

            {/* Max KB Documents */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Documents to Use</label>
              <Input
                type="number"
                min="1"
                max="10"
                step="1"
                value={localKbMaxDocs}
                onChange={(e) => setLocalKbMaxDocs(parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of KB documents to use per generation (1-10)
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <SheetFooter className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving || (requiresApiKey && !localApiKey)}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Configuration'
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
