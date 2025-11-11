/**
 * Generation Store
 * Manages state for test case generation workflow
 * 
 * This store handles:
 * - File uploads (PDF, Excel)
 * - Text input for requirements
 * - Generation progress tracking
 * - Current step in AI agent workflow
 * 
 * @module stores/useGenerationStore
 */

import { create } from 'zustand';

/**
 * Upload status type
 */
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

/**
 * State interface for generation workflow
 */
interface GenerationState {
  /** Uploaded files for test case generation */
  files: File[];
  
  /** Text input for requirements (alternative to file upload) */
  textInput: string;
  
  /** Whether test case generation is in progress */
  isGenerating: boolean;
  
  /** Generation progress (0-100) */
  progress: number;
  
  /** Current step in generation workflow (e.g., "Planning", "Generating") */
  currentStep: string;
  
  /** Upload status */
  uploadStatus: UploadStatus;
  
  /** Upload error message */
  uploadError: string | null;
  
  /** KB-specific progress messages */
  kbMessages: string[];
  
  /** Estimated time remaining (seconds) */
  estimatedTimeRemaining: number | null;
  
  /** Whether cancellation is in progress */
  isCancelling: boolean;
  
  /** Number of test cases generated */
  generatedTestCasesCount: number;
  
  /** KB compliance score (0-100) */
  kbComplianceScore: number | null;
  
  /** Add a file to the upload queue */
  addFile: (file: File) => void;
  
  /** Add multiple files to the upload queue */
  addFiles: (files: File[]) => void;
  
  /** Remove a file from the upload queue by name */
  removeFile: (fileName: string) => void;
  
  /** Clear all files */
  clearFiles: () => void;
  
  /** Set upload status */
  setUploadStatus: (status: UploadStatus) => void;
  
  /** Set upload error */
  setUploadError: (error: string | null) => void;
  
  /** Update text input */
  setTextInput: (text: string) => void;
  
  /** Set generation status */
  setIsGenerating: (isGenerating: boolean) => void;
  
  /** Update generation progress */
  setProgress: (progress: number) => void;
  
  /** Update current step */
  setCurrentStep: (step: string) => void;
  
  /** Add KB message */
  addKBMessage: (message: string) => void;
  
  /** Clear KB messages */
  clearKBMessages: () => void;
  
  /** Set estimated time remaining */
  setEstimatedTimeRemaining: (seconds: number | null) => void;
  
  /** Set cancelling status */
  setIsCancelling: (isCancelling: boolean) => void;
  
  /** Set generated test cases count */
  setGeneratedTestCasesCount: (count: number) => void;
  
  /** Set KB compliance score */
  setKBComplianceScore: (score: number | null) => void;
  
  /** Reset all state to initial values */
  reset: () => void;
}

/**
 * Zustand store for generation workflow state
 * 
 * @example
 * ```tsx
 * const { files, addFile, isGenerating } = useGenerationStore();
 * 
 * // Add file
 * addFile(uploadedFile);
 * 
 * // Check status
 * if (isGenerating) {
 *   console.log('Generating test cases...');
 * }
 * ```
 */
export const useGenerationStore = create<GenerationState>((set) => ({
  files: [],
  textInput: '',
  isGenerating: false,
  progress: 0,
  currentStep: '',
  uploadStatus: 'idle',
  uploadError: null,
  kbMessages: [],
  estimatedTimeRemaining: null,
  isCancelling: false,
  generatedTestCasesCount: 0,
  kbComplianceScore: null,
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  addFiles: (newFiles) => set((state) => ({ files: [...state.files, ...newFiles] })),
  removeFile: (fileName) =>
    set((state) => ({
      files: state.files.filter((f) => f.name !== fileName),
    })),
  clearFiles: () => set({ files: [] }),
  setUploadStatus: (status) => set({ uploadStatus: status }),
  setUploadError: (error) => set({ uploadError: error }),
  setTextInput: (text) => set({ textInput: text }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setProgress: (progress) => set({ progress }),
  setCurrentStep: (step) => set({ currentStep: step }),
  addKBMessage: (message) => set((state) => ({ kbMessages: [...state.kbMessages, message] })),
  clearKBMessages: () => set({ kbMessages: [] }),
  setEstimatedTimeRemaining: (seconds) => set({ estimatedTimeRemaining: seconds }),
  setIsCancelling: (isCancelling) => set({ isCancelling }),
  setGeneratedTestCasesCount: (count) => set({ generatedTestCasesCount: count }),
  setKBComplianceScore: (score) => set({ kbComplianceScore: score }),
  reset: () =>
    set({
      files: [],
      textInput: '',
      isGenerating: false,
      progress: 0,
      currentStep: '',
      uploadStatus: 'idle',
      uploadError: null,
      kbMessages: [],
      estimatedTimeRemaining: null,
      isCancelling: false,
      generatedTestCasesCount: 0,
      kbComplianceScore: null,
    }),
}));
