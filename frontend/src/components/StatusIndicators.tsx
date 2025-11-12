/**
 * Status Indicators Component
 * Displays LLM connection and Knowledge Base status
 * 
 * Shows:
 * - LLM provider and model name
 * - Connection status (connected/disconnected)
 * - KB enabled/disabled status
 * - KB document count
 * 
 * Week 4: Status Indicators Implementation
 * 
 * @component
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useConfigStore } from '@/stores/useConfigStore';
import { useKBStore } from '@/stores/useKBStore';
import { CheckCircle2, XCircle, Zap, BookOpen } from 'lucide-react';

/**
 * Status Indicators Component
 * 
 * @example
 * ```tsx
 * <StatusIndicators />
 * ```
 */
export function StatusIndicators() {
  // Config store state
  const { llmProvider, modelName, isConnected, kbConfig } = useConfigStore();
  
  // KB store state
  const { documents, useKnowledgeBase } = useKBStore();

  // Calculate total KB document size
  const totalKBSize = documents.reduce((sum, doc) => sum + doc.size, 0);
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LLM Status */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-600" />
            <span className="font-semibold text-sm">LLM Provider</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Badge 
              variant={isConnected ? 'default' : 'destructive'}
              className={isConnected ? 'bg-green-600' : ''}
            >
              {isConnected ? (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Disconnected
                </>
              )}
            </Badge>
            
            <Badge variant="outline" className="capitalize">
              {llmProvider}
            </Badge>
            
            <Badge variant="secondary">
              {modelName}
            </Badge>
          </div>

          {!isConnected && (
            <p className="text-xs text-muted-foreground">
              Configure and test connection in settings
            </p>
          )}
        </div>

        {/* KB Status */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-sm">Knowledge Base</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Badge 
              variant={useKnowledgeBase && documents.length > 0 ? 'default' : 'outline'}
              className={useKnowledgeBase && documents.length > 0 ? 'bg-blue-600' : ''}
            >
              {useKnowledgeBase ? (
                documents.length > 0 ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Enabled
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    No Documents
                  </>
                )
              ) : (
                'Disabled'
              )}
            </Badge>
            
            {useKnowledgeBase && (
              <>
                <Badge variant="outline">
                  {documents.length} doc{documents.length !== 1 ? 's' : ''}
                </Badge>
                
                {documents.length > 0 && (
                  <Badge variant="secondary">
                    {formatSize(totalKBSize)}
                  </Badge>
                )}
              </>
            )}
          </div>

          {useKnowledgeBase && documents.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Threshold: {(kbConfig.threshold * 100).toFixed(0)}% | Max: {kbConfig.maxDocs} docs
            </p>
          )}
          
          {useKnowledgeBase && documents.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Upload KB documents to improve quality by 40-60%
            </p>
          )}
          
          {!useKnowledgeBase && (
            <p className="text-xs text-muted-foreground">
              Enable KB for enhanced test case generation
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
