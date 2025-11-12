/**
 * Export Store
 * Manages export settings and state for test case exports
 * 
 * This store handles:
 * - Export format selection (Excel, Markdown)
 * - Export progress tracking
 * - KB reference inclusion options
 * - KB compliance score inclusion options
 * 
 * @module stores/useExportStore
 */

import { create } from 'zustand';

/**
 * State interface for export functionality
 */
interface ExportState {
  /** Selected export format */
  format: 'excel' | 'markdown';
  
  /** Whether export is in progress */
  isExporting: boolean;
  
  /** Include Knowledge Base references in export (default: true) */
  includeKBReferences: boolean;
  
  /** Include Knowledge Base compliance scores in export (default: true) */
  includeKBScores: boolean;
  
  /** Set export format */
  setFormat: (format: 'excel' | 'markdown') => void;
  
  /** Set export progress state */
  setIsExporting: (isExporting: boolean) => void;
  
  /** Toggle KB references inclusion */
  setIncludeKBReferences: (include: boolean) => void;
  
  /** Toggle KB scores inclusion */
  setIncludeKBScores: (include: boolean) => void;
  
  /** Reset to default values */
  reset: () => void;
}

/**
 * Zustand store for export state management
 * 
 * @example
 * ```tsx
 * const { format, setFormat, includeKBReferences } = useExportStore();
 * 
 * // Change format
 * setFormat('markdown');
 * 
 * // Export with KB references
 * if (includeKBReferences) {
 *   exportWithKBData();
 * }
 * ```
 */
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
