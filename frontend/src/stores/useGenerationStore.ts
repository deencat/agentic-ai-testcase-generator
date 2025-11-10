import { create } from 'zustand';

interface GenerationState {
  files: File[];
  textInput: string;
  isGenerating: boolean;
  progress: number;
  currentStep: string;
  addFile: (file: File) => void;
  removeFile: (fileName: string) => void;
  setTextInput: (text: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setProgress: (progress: number) => void;
  setCurrentStep: (step: string) => void;
  reset: () => void;
}

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
