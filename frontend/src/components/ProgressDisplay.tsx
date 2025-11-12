/**
 * Progress Display Component
 * Displays real-time progress updates for AI test case generation
 * 
 * Features:
 * - Multi-stage progress bar (Planner, Generator, Executor)
 * - Real-time status messages via Server-Sent Events (SSE)
 * - KB usage indicators
 * - Cancel button
 * - Estimated time remaining
 * 
 * Week 6 Implementation: ✅ Complete
 * 
 * @component
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, Loader2, BookOpen } from 'lucide-react';

/**
 * Props for ProgressDisplay component
 */
interface ProgressDisplayProps {
  /** Whether generation is in progress */
  isGenerating: boolean;
  
  /** Current progress (0-100) */
  progress: number;
  
  /** Current step/status message */
  currentStep: string;
  
  /** Whether Knowledge Base is being used */
  useKnowledgeBase: boolean;
  
  /** List of KB documents being used */
  kbDocuments: Array<{ id: string; name: string }>;
  
  /** KB-specific messages (e.g., which documents are referenced) */
  kbMessages?: string[];
  
  /** Estimated time remaining (in seconds) */
  estimatedTimeRemaining?: number;
  
  /** Callback for cancel button */
  onCancel?: () => void;
  
  /** Whether cancel is in progress */
  isCancelling?: boolean;
}

/**
 * ProgressDisplay component
 * Shows real-time generation progress with KB indicators
 */
export function ProgressDisplay({
  isGenerating,
  progress,
  currentStep,
  useKnowledgeBase,
  kbDocuments,
  kbMessages = [],
  estimatedTimeRemaining,
  onCancel,
  isCancelling = false,
}: ProgressDisplayProps) {
  if (!isGenerating) {
    return null;
  }

  /**
   * Get current agent phase based on progress
   */
  const getCurrentPhase = (): 'planner' | 'generator' | 'executor' | 'complete' => {
    if (progress >= 100) return 'complete';
    if (progress >= 66) return 'executor';
    if (progress >= 33) return 'generator';
    return 'planner';
  };

  const currentPhase = getCurrentPhase();

  /**
   * Format time remaining in human-readable format
   */
  const formatTimeRemaining = (seconds?: number): string => {
    if (!seconds || seconds <= 0) return 'Calculating...';
    
    if (seconds < 60) {
      return `~${Math.round(seconds)}s remaining`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.round(seconds % 60);
      return `~${minutes}m ${secs}s remaining`;
    }
  };

  return (
    <Card 
      id="progress-section" 
      className="border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating Test Cases
            </CardTitle>
            <CardDescription className="text-blue-700 mt-1">
              {currentStep}
            </CardDescription>
            {estimatedTimeRemaining !== undefined && (
              <p className="text-sm text-blue-600 mt-1">
                {formatTimeRemaining(estimatedTimeRemaining)}
              </p>
            )}
          </div>
          
          {/* Cancel Button */}
          {onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isCancelling}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-blue-200 rounded-full h-5 shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-5 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-3 shadow-md"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              {progress > 8 && (
                <span className="text-xs text-white font-bold drop-shadow">
                  {Math.round(progress)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Agent Phase Indicators */}
        <div className="grid grid-cols-3 gap-4">
          {/* Planner Agent */}
          <div
            className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
              currentPhase === 'planner'
                ? 'bg-blue-200 border-2 border-blue-500 scale-105'
                : progress >= 33
                ? 'bg-green-100 border border-green-400'
                : 'bg-white border border-gray-300'
            }`}
          >
            {progress >= 33 ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : currentPhase === 'planner' ? (
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            ) : (
              <div className="h-6 w-6 border-2 border-gray-400 rounded-full" />
            )}
            <div className="text-center">
              <div
                className={`text-sm font-semibold ${
                  currentPhase === 'planner'
                    ? 'text-blue-900'
                    : progress >= 33
                    ? 'text-green-700'
                    : 'text-gray-500'
                }`}
              >
                Planner
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {currentPhase === 'planner' ? 'Analyzing...' : progress >= 33 ? 'Complete' : 'Pending'}
              </div>
            </div>
          </div>

          {/* Generator Agent */}
          <div
            className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
              currentPhase === 'generator'
                ? 'bg-blue-200 border-2 border-blue-500 scale-105'
                : progress >= 66
                ? 'bg-green-100 border border-green-400'
                : 'bg-white border border-gray-300'
            }`}
          >
            {progress >= 66 ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : currentPhase === 'generator' ? (
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            ) : (
              <div className="h-6 w-6 border-2 border-gray-400 rounded-full" />
            )}
            <div className="text-center">
              <div
                className={`text-sm font-semibold ${
                  currentPhase === 'generator'
                    ? 'text-blue-900'
                    : progress >= 66
                    ? 'text-green-700'
                    : 'text-gray-500'
                }`}
              >
                Generator
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {currentPhase === 'generator' ? 'Creating...' : progress >= 66 ? 'Complete' : 'Pending'}
              </div>
            </div>
          </div>

          {/* Executor Agent */}
          <div
            className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
              currentPhase === 'executor'
                ? 'bg-blue-200 border-2 border-blue-500 scale-105'
                : progress >= 100
                ? 'bg-green-100 border border-green-400'
                : 'bg-white border border-gray-300'
            }`}
          >
            {progress >= 100 ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : currentPhase === 'executor' ? (
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            ) : (
              <div className="h-6 w-6 border-2 border-gray-400 rounded-full" />
            )}
            <div className="text-center">
              <div
                className={`text-sm font-semibold ${
                  currentPhase === 'executor'
                    ? 'text-blue-900'
                    : progress >= 100
                    ? 'text-green-700'
                    : 'text-gray-500'
                }`}
              >
                Executor
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {currentPhase === 'executor' ? 'Validating...' : progress >= 100 ? 'Complete' : 'Pending'}
              </div>
            </div>
          </div>
        </div>

        {/* KB Usage Indicator */}
        {useKnowledgeBase && kbDocuments.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-300 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-indigo-900 mb-1">
                  Knowledge Base Context Active
                </div>
                <div className="text-sm text-indigo-800">
                  Using {kbDocuments.length} document{kbDocuments.length !== 1 ? 's' : ''}:{' '}
                  <span className="font-medium">
                    {kbDocuments.map((d) => d.name).join(', ')}
                  </span>
                </div>
                
                {/* KB-specific messages */}
                {kbMessages.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {kbMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-indigo-700 bg-white/50 px-2 py-1 rounded"
                      >
                        • {msg}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Additional Status Messages */}
        {currentPhase !== 'complete' && (
          <div className="text-xs text-blue-600 text-center">
            AI agents are working on your test cases...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
