import { create } from 'zustand';

interface ExportState {
  format: 'excel' | 'markdown';
  isExporting: boolean;
  includeKBReferences: boolean;
  includeKBScores: boolean;
  setFormat: (format: 'excel' | 'markdown') => void;
  setIsExporting: (isExporting: boolean) => void;
  setIncludeKBReferences: (include: boolean) => void;
  setIncludeKBScores: (include: boolean) => void;
  reset: () => void;
}

export const useExportStore = create<ExportState>((set) => ({
  format: 'excel',
  isExporting: false,
  includeKBReferences: true,
  includeKBScores: true,
  setFormat: (format) => set({ format }),
  setIsExporting: (isExporting) => set({ isExporting }),
  setIncludeKBReferences: (include) => set({ includeKBReferences: include }),
  setIncludeKBScores: (include) => set({ includeKBScores: include }),
  reset: () =>
    set({
      format: 'excel',
      isExporting: false,
      includeKBReferences: true,
      includeKBScores: true,
    }),
}));
