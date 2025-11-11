/**
 * Dashboard Page
 * Main landing page showing overview and project status
 * 
 * Features:
 * - Backend connection status indicator
 * - File upload zone for requirements (PDF, Excel)
 * - Knowledge Base document upload zone
 * - Text input area for manual requirements
 * - Configuration drawer for LLM and KB settings
 * - Status indicators for LLM and KB
 * 
 * Week 2 Status: ✅ Complete - Basic layout
 * Week 3 Status: ✅ Complete - File upload & KB upload
 * Week 4 Status: ✅ Complete - Configuration drawer & status indicators
 * 
 * @page
 */

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileUploadZone } from '@/components/FileUploadZone';
import { KBUploadZone } from '@/components/KBUploadZone';
import { ConfigDrawer } from '@/components/ConfigDrawer';
import { StatusIndicators } from '@/components/StatusIndicators';
import { useGenerationStore } from '@/stores/useGenerationStore';
import { useKBStore } from '@/stores/useKBStore';
import { api } from '@/lib/api';
import { Settings, Loader2, Sparkles, CheckCircle, ChevronDown, ChevronUp, X } from 'lucide-react';

/**
 * Home/Dashboard page component
 * Shows backend status and project overview
 */
export default function Home() {
  // Connection status: checking -> connected/disconnected
  const [healthStatus, setHealthStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  
  // Projects list from backend (or mock data)
  const [projects, setProjects] = useState<any[]>([]);

  // Text input and generation state from store
  const { 
    textInput, 
    setTextInput, 
    files,
    isGenerating,
    setIsGenerating,
    progress,
    currentStep,
    setProgress,
    setCurrentStep,
  } = useGenerationStore();

  // KB state
  const { useKnowledgeBase, documents: kbDocuments } = useKBStore();

  // Configuration drawer state
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);

  // Generation completion state
  const [generationComplete, setGenerationComplete] = useState(false);

  // Validation errors
  const [validationError, setValidationError] = useState<string | null>(null);

  // Text input collapse state
  const [isTextInputCollapsed, setIsTextInputCollapsed] = useState(false);

  // Character limit for text input
  const MAX_TEXT_INPUT_LENGTH = 10000;

  // On mount: check API connection and load projects
  useEffect(() => {
    // Test API connection
    const checkConnection = async () => {
      const result = await api.checkHealth();
      if (result.data) {
        setHealthStatus('connected');
      } else {
        setHealthStatus('disconnected');
      }
    };

    // Fetch projects
    const loadProjects = async () => {
      const result = await api.getProjects();
      if (result.data) {
        setProjects(result.data);
      }
    };

    checkConnection();
    loadProjects();
  }, []);

  /**
   * Validate inputs before generation
   * Returns true if valid, false with error message if invalid
   */
  const validateInputs = (): boolean => {
    // Check if at least one input source is provided
    const hasFiles = files.length > 0;
    const hasTextInput = textInput.trim().length > 0;

    if (!hasFiles && !hasTextInput) {
      setValidationError('Please upload files or enter requirements text');
      return false;
    }

    // Check if KB is enabled but no documents uploaded
    if (useKnowledgeBase && kbDocuments.length === 0) {
      setValidationError('KB is enabled but no documents uploaded. Upload KB documents or disable KB.');
      return false;
    }

    setValidationError(null);
    return true;
  };

  /**
   * Handle generate button click
   * Simulates generation workflow with progress tracking
   */
  const handleGenerate = async () => {
    // Validate inputs
    if (!validateInputs()) {
      return;
    }

    // Reset completion state
    setGenerationComplete(false);

    // Start generation
    setIsGenerating(true);
    setProgress(0);
    setCurrentStep('Initializing...');

    // Simulate generation workflow (will be replaced with real SSE in Week 6)
    try {
      // Step 1: Planner Agent
      setCurrentStep('Planner Agent: Analyzing requirements...');
      await simulateProgress(0, 33, 2000);

      if (useKnowledgeBase && kbDocuments.length > 0) {
        setCurrentStep(`Planner Agent: Using ${kbDocuments.length} KB document(s) for context...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Step 2: Generator Agent
      setCurrentStep('Generator Agent: Creating test cases...');
      await simulateProgress(33, 66, 2000);

      if (useKnowledgeBase && kbDocuments.length > 0) {
        setCurrentStep('Generator Agent: Including KB-sourced field names...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Step 3: Executor Agent
      setCurrentStep('Executor Agent: Validating and refining...');
      await simulateProgress(66, 100, 2000);

      if (useKnowledgeBase && kbDocuments.length > 0) {
        setCurrentStep('Executor Agent: Calculating KB compliance score...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Completion
      setCurrentStep('Generation complete!');
      setProgress(100);
      setGenerationComplete(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationComplete(false);
        setCurrentStep('');
        setProgress(0);
      }, 3000);

    } catch (error) {
      console.error('Generation error:', error);
      setIsGenerating(false);
      setCurrentStep('Generation failed');
      setValidationError('An error occurred during generation');
    }
  };

  /**
   * Simulate smooth progress animation
   */
  const simulateProgress = async (from: number, to: number, duration: number) => {
    const steps = 20;
    const increment = (to - from) / steps;
    const delay = duration / steps;

    for (let i = 0; i <= steps; i++) {
      setProgress(Math.min(from + (increment * i), to));
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  };

  /**
   * Determine if generate button should be disabled
   */
  const isGenerateDisabled = (): boolean => {
    const hasFiles = files.length > 0;
    const hasTextInput = textInput.trim().length > 0;
    return isGenerating || (!hasFiles && !hasTextInput);
  };

  /**
   * Clear text input
   */
  const handleClearTextInput = () => {
    setTextInput('');
  };

  /**
   * Handle text input change with character limit
   */
  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_TEXT_INPUT_LENGTH) {
      setTextInput(newValue);
    }
  };

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Generate AI-powered test cases with Knowledge Base integration
            </p>
          </div>
          
          {/* Backend Connection Status Badge */}
          <div className="flex items-center gap-4">
            <Badge variant={healthStatus === 'connected' ? 'default' : 'destructive'}>
              {healthStatus === 'checking' ? 'Checking...' : 
               healthStatus === 'connected' ? '✓ Backend Connected' : '✗ Backend Disconnected'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Upload Section */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Requirements Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Requirements</CardTitle>
            <CardDescription>
              Upload PDF or Excel files containing requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploadZone />
          </CardContent>
        </Card>

        {/* Knowledge Base Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base</CardTitle>
            <CardDescription>
              Upload documentation to improve test case quality (+40-60%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KBUploadZone />
          </CardContent>
        </Card>
      </div>

      {/* Text Input Section */}
      <Card className="mb-8">
        <CardHeader className="cursor-pointer" onClick={() => setIsTextInputCollapsed(!isTextInputCollapsed)}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Or Enter Requirements Manually</CardTitle>
              <CardDescription>
                Type or paste your requirements here (alternative to file upload)
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={(e) => {
              e.stopPropagation();
              setIsTextInputCollapsed(!isTextInputCollapsed);
            }}>
              {isTextInputCollapsed ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </Button>
          </div>
        </CardHeader>
        
        {!isTextInputCollapsed && (
          <CardContent>
            <div className="space-y-2">
              <textarea
                value={textInput}
                onChange={handleTextInputChange}
                maxLength={MAX_TEXT_INPUT_LENGTH}
                className="w-full min-h-[200px] p-4 border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your requirements here...&#10;&#10;Example:&#10;- User login functionality&#10;- Password reset feature&#10;- Profile management"
              />
              
              {/* Character counter and Clear button */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {textInput.length} / {MAX_TEXT_INPUT_LENGTH} characters
                  {textInput.length >= MAX_TEXT_INPUT_LENGTH && (
                    <span className="text-orange-500 ml-2">(Maximum reached)</span>
                  )}
                </p>
                {textInput && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearTextInput}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Configuration & Generate Section */}
      <StatusIndicators />
      
      {/* Validation Error */}
      {validationError && (
        <div className="mb-4 p-4 border border-red-500 bg-red-50 rounded-lg text-red-700">
          {validationError}
        </div>
      )}

      {/* Progress Display (Week 5-6) */}
      {isGenerating && (
        <Card className="mb-8 border-blue-500 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Generating Test Cases</CardTitle>
            <CardDescription className="text-blue-700">{currentStep}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress Bar */}
            <div className="w-full bg-blue-200 rounded-full h-4 mb-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-out flex items-center justify-end pr-2"
                style={{ width: `${progress}%` }}
              >
                {progress > 10 && (
                  <span className="text-xs text-white font-semibold">
                    {Math.round(progress)}%
                  </span>
                )}
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between items-center text-sm">
              <div className={`flex items-center gap-2 ${progress >= 33 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                {progress >= 33 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 border-2 rounded-full" />}
                <span>Planner</span>
              </div>
              <div className={`flex items-center gap-2 ${progress >= 66 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                {progress >= 66 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 border-2 rounded-full" />}
                <span>Generator</span>
              </div>
              <div className={`flex items-center gap-2 ${progress >= 100 ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                {progress >= 100 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 border-2 rounded-full" />}
                <span>Executor</span>
              </div>
            </div>

            {/* KB Usage Indicator */}
            {useKnowledgeBase && kbDocuments.length > 0 && (
              <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg text-sm text-blue-800">
                📚 Using {kbDocuments.length} KB document(s): {kbDocuments.map(d => d.name).join(', ')}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Completion Message */}
      {generationComplete && (
        <div className="mb-4 p-4 border border-green-500 bg-green-50 rounded-lg text-green-700 flex items-center gap-3">
          <CheckCircle className="h-5 w-5" />
          <div>
            <div className="font-semibold">✓ Generated test cases successfully!</div>
            {useKnowledgeBase && kbDocuments.length > 0 && (
              <div className="text-sm mt-1">KB Compliance: 92% (Target: ≥80%)</div>
            )}
          </div>
        </div>
      )}
      
      <div className="flex gap-4 mb-8">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => setConfigDrawerOpen(true)}
          disabled={isGenerating}
        >
          <Settings className="h-4 w-4 mr-2" />
          Configuration
        </Button>
        <Button 
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          onClick={handleGenerate}
          disabled={isGenerateDisabled()}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : generationComplete ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Generation Complete
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Test Cases
            </>
          )}
        </Button>
      </div>

      {/* Configuration Drawer */}
      <ConfigDrawer open={configDrawerOpen} onOpenChange={setConfigDrawerOpen} />

      {/* Projects Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              {projects.length === 0 
                ? 'No projects yet. Upload files to create your first project.'
                : `You have ${projects.length} project(s)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Backend API connection: {healthStatus}</p>
                <p className="text-sm mt-2">
                  {healthStatus === 'disconnected' 
                    ? 'Make sure the FastAPI backend is running on http://localhost:8000'
                    : 'Ready to start generating test cases!'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {projects.map((project: any) => (
                  <div key={project.id} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

