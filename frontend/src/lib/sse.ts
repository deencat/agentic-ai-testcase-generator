/**
 * Server-Sent Events (SSE) Utilities
 * Handles real-time communication with backend for generation progress
 * 
 * Features:
 * - EventSource connection management
 * - Progress event parsing
 * - Error handling and reconnection
 * - Connection cleanup
 * 
 * Week 6 Implementation: ✅ Complete
 * 
 * @module lib/sse
 */

/**
 * SSE Event types from backend
 */
export type SSEEventType = 
  | 'progress'
  | 'step'
  | 'kb_message'
  | 'test_case'
  | 'complete'
  | 'error';

/**
 * SSE Event data structure
 */
export interface SSEEvent {
  /** Event type */
  type: SSEEventType;
  
  /** Progress percentage (0-100) */
  progress?: number;
  
  /** Current step/status message */
  message?: string;
  
  /** KB-specific message */
  kbMessage?: string;
  
  /** Test case data */
  testCase?: any;
  
  /** Estimated time remaining (seconds) */
  estimatedTime?: number;
  
  /** Number of test cases generated */
  testCasesCount?: number;
  
  /** KB compliance score */
  kbComplianceScore?: number;
  
  /** Error message */
  error?: string;
}

/**
 * SSE Connection options
 */
export interface SSEOptions {
  /** Callback for progress events */
  onProgress?: (event: SSEEvent) => void;
  
  /** Callback for step change events */
  onStep?: (event: SSEEvent) => void;
  
  /** Callback for KB messages */
  onKBMessage?: (event: SSEEvent) => void;
  
  /** Callback for test case events */
  onTestCase?: (event: SSEEvent) => void;
  
  /** Callback for completion */
  onComplete?: (event: SSEEvent) => void;
  
  /** Callback for errors */
  onError?: (error: Error | SSEEvent) => void;
  
  /** Callback when connection opens */
  onOpen?: () => void;
}

/**
 * Create SSE connection to backend generation endpoint
 * 
 * @param projectId - Project ID for generation
 * @param options - Event handlers
 * @returns EventSource instance for cleanup
 * 
 * @example
 * ```ts
 * const eventSource = createSSEConnection('project-123', {
 *   onProgress: (event) => {
 *     console.log('Progress:', event.progress);
 *   },
 *   onComplete: (event) => {
 *     console.log('Generation complete!');
 *   },
 *   onError: (error) => {
 *     console.error('Error:', error);
 *   }
 * });
 * 
 * // Later, cleanup
 * eventSource.close();
 * ```
 */
export function createSSEConnection(
  projectId: string,
  options: SSEOptions
): EventSource {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const url = `${baseUrl}/api/v1/generate/${projectId}/stream`;
  
  const eventSource = new EventSource(url);
  
  // Connection opened
  eventSource.onopen = () => {
    console.log('[SSE] Connection opened');
    options.onOpen?.();
  };
  
  // Handle incoming messages
  eventSource.onmessage = (event) => {
    try {
      const data: SSEEvent = JSON.parse(event.data);
      
      // Route to appropriate handler based on event type
      switch (data.type) {
        case 'progress':
          options.onProgress?.(data);
          break;
          
        case 'step':
          options.onStep?.(data);
          break;
          
        case 'kb_message':
          options.onKBMessage?.(data);
          break;
          
        case 'test_case':
          options.onTestCase?.(data);
          break;
          
        case 'complete':
          options.onComplete?.(data);
          // Auto-close on completion
          eventSource.close();
          break;
          
        case 'error':
          options.onError?.(data);
          eventSource.close();
          break;
          
        default:
          console.warn('[SSE] Unknown event type:', data.type);
      }
    } catch (error) {
      console.error('[SSE] Failed to parse event data:', error);
      options.onError?.(error as Error);
    }
  };
  
  // Handle errors
  eventSource.onerror = (event) => {
    console.error('[SSE] Connection error:', event);
    
    // Check if connection is closed
    if (eventSource.readyState === EventSource.CLOSED) {
      console.log('[SSE] Connection closed');
      options.onError?.(new Error('SSE connection closed'));
    } else {
      options.onError?.(new Error('SSE connection error'));
    }
  };
  
  return eventSource;
}

/**
 * Mock SSE for testing (when backend is not available)
 * Simulates real-time progress updates
 * 
 * @param options - Event handlers
 * @returns Cleanup function
 */
export function createMockSSE(options: SSEOptions): () => void {
  let currentProgress = 0;
  let timeoutIds: NodeJS.Timeout[] = [];
  
  console.log('[SSE Mock] Starting mock generation');
  options.onOpen?.();
  
  const steps = [
    { progress: 10, message: 'Planner Agent: Analyzing requirements...', delay: 500 },
    { progress: 20, message: 'Planner Agent: Identifying test scenarios...', delay: 800 },
    { progress: 33, message: 'Planner Agent: Test plan created', delay: 600 },
    { progress: 40, message: 'Generator Agent: Creating test cases...', delay: 700 },
    { progress: 50, message: 'Generator Agent: Generating test steps...', delay: 900 },
    { progress: 66, message: 'Generator Agent: Test cases generated', delay: 600 },
    { progress: 75, message: 'Executor Agent: Validating test cases...', delay: 700 },
    { progress: 85, message: 'Executor Agent: Cross-system validation...', delay: 800 },
    { progress: 95, message: 'Executor Agent: Final refinements...', delay: 600 },
    { progress: 100, message: 'Generation complete!', delay: 500 },
  ];
  
  let stepIndex = 0;
  
  const executeStep = () => {
    if (stepIndex >= steps.length) {
      // Complete
      options.onComplete?.({
        type: 'complete',
        progress: 100,
        message: 'Generation complete!',
        testCasesCount: 12,
        kbComplianceScore: 92,
      });
      return;
    }
    
    const step = steps[stepIndex];
    
    // Progress event
    options.onProgress?.({
      type: 'progress',
      progress: step.progress,
      estimatedTime: (steps.length - stepIndex) * 2,
    });
    
    // Step event
    options.onStep?.({
      type: 'step',
      message: step.message,
      progress: step.progress,
    });
    
    // KB message at certain steps
    if (step.progress === 20) {
      options.onKBMessage?.({
        type: 'kb_message',
        kbMessage: 'Using CRM_User_Guide.pdf for field names',
      });
    } else if (step.progress === 50) {
      options.onKBMessage?.({
        type: 'kb_message',
        kbMessage: 'Referencing Case_Management_Guide.pdf for workflows',
      });
    }
    
    stepIndex++;
    const timeoutId = setTimeout(executeStep, step.delay);
    timeoutIds.push(timeoutId);
  };
  
  // Start execution
  const initialTimeoutId = setTimeout(executeStep, 100);
  timeoutIds.push(initialTimeoutId);
  
  // Return cleanup function
  return () => {
    timeoutIds.forEach((id) => clearTimeout(id));
    timeoutIds = [];
    console.log('[SSE Mock] Cleanup');
  };
}
