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
  
  /** Add a file to the upload queue */
  addFile: (file: File) => void;
  
  /** Remove a file from the upload queue by name */
  removeFile: (fileName: string) => void;
  
  /** Update text input */
  setTextInput: (text: string) => void;
  
  /** Set generation status */
  setIsGenerating: (isGenerating: boolean) => void;
  
  /** Update generation progress */
  setProgress: (progress: number) => void;
  
  /** Update current step */
  setCurrentStep: (step: string) => void;
  
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
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  removeFile: (fileName) =>
    set((state) => ({
      files: state.files.filter((f) => f.name !== fileName),
    })),
  setTextInput: (text) => set({ textInput: text }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setProgress: (progress) => set({ progress }),
  setCurrentStep: (step) => set({ currentStep: step }),
  reset: () =>
    set({
      files: [],
      textInput: '',
      isGenerating: false,
      progress: 0,
      currentStep: '',
    }),
}));
