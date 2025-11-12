/**
 * Knowledge Base Store
 * Manages state for Knowledge Base documents
 * 
 * This store handles:
 * - KB document uploads
 * - KB document list/management
 * - KB toggle (use/don't use KB context)
 * - KB configuration (threshold, max docs)
 * 
 * Week 3 Implementation: KB document management
 * Week 4 Extension: KB configuration settings
 * 
 * @module stores/useKBStore
 */

import { create } from 'zustand';

/**
 * KB document metadata
 */
export interface KBDocument {
  id: string;
  name: string;
  type: 'pdf' | 'txt' | 'md';
  size: number;
  uploadedAt: string;
  hash?: string; // For deduplication
}

/**
 * Upload status type
 */
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

/**
 * State interface for KB management
 */
interface KBState {
  /** List of KB documents */
  documents: KBDocument[];
  
  /** Whether to use KB context for generation */
  useKnowledgeBase: boolean;
  
  /** Selected document IDs for generation */
  selectedDocumentIds: string[];
  
  /** Upload status */
  uploadStatus: UploadStatus;
  
  /** Upload error message */
  uploadError: string | null;
  
  /** KB configuration */
  config: {
    threshold: number; // Similarity threshold (0-1)
    maxDocs: number; // Max KB docs to use
  };
  
  /** Add a KB document */
  addDocument: (doc: KBDocument) => void;
  
  /** Add multiple KB documents */
  addDocuments: (docs: KBDocument[]) => void;
  
  /** Remove a KB document by ID */
  removeDocument: (docId: string) => void;
  
  /** Clear all KB documents */
  clearDocuments: () => void;
  
  /** Toggle KB usage */
  toggleKnowledgeBase: () => void;
  
  /** Set KB usage */
  setUseKnowledgeBase: (use: boolean) => void;
  
  /** Toggle document selection */
  toggleDocumentSelection: (docId: string) => void;
  
  /** Select all documents */
  selectAllDocuments: () => void;
  
  /** Deselect all documents */
  deselectAllDocuments: () => void;
  
  /** Set upload status */
  setUploadStatus: (status: UploadStatus) => void;
  
  /** Set upload error */
  setUploadError: (error: string | null) => void;
  
  /** Update KB configuration */
  setConfig: (config: Partial<KBState['config']>) => void;
  
  /** Reset all state */
  reset: () => void;
}

/**
 * Zustand store for Knowledge Base state
 * 
 * @example
 * ```tsx
 * const { documents, useKnowledgeBase, addDocument, toggleKnowledgeBase } = useKBStore();
 * 
 * // Add KB document
 * addDocument({
 *   id: '1',
 *   name: 'CRM_User_Guide.pdf',
 *   type: 'pdf',
 *   size: 1024000,
 *   uploadedAt: new Date().toISOString(),
 * });
 * 
 * // Toggle KB context
 * toggleKnowledgeBase();
 * ```
 */
export const useKBStore = create<KBState>((set) => ({
  documents: [],
  useKnowledgeBase: false,
  selectedDocumentIds: [],
  uploadStatus: 'idle',
  uploadError: null,
  config: {
    threshold: 0.7,
    maxDocs: 5,
  },
  
  addDocument: (doc) =>
    set((state) => ({
      documents: [...state.documents, doc],
      selectedDocumentIds: [...state.selectedDocumentIds, doc.id],
    })),
  
  addDocuments: (docs) =>
    set((state) => ({
      documents: [...state.documents, ...docs],
      selectedDocumentIds: [...state.selectedDocumentIds, ...docs.map(d => d.id)],
    })),
  
  removeDocument: (docId) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== docId),
      selectedDocumentIds: state.selectedDocumentIds.filter((id) => id !== docId),
    })),
  
  clearDocuments: () =>
    set({
      documents: [],
      selectedDocumentIds: [],
    }),
  
  toggleKnowledgeBase: () =>
    set((state) => ({
      useKnowledgeBase: !state.useKnowledgeBase,
    })),
  
  setUseKnowledgeBase: (use) =>
    set({
      useKnowledgeBase: use,
    }),
  
  toggleDocumentSelection: (docId) =>
    set((state) => ({
      selectedDocumentIds: state.selectedDocumentIds.includes(docId)
        ? state.selectedDocumentIds.filter((id) => id !== docId)
        : [...state.selectedDocumentIds, docId],
    })),
  
  selectAllDocuments: () =>
    set((state) => ({
      selectedDocumentIds: state.documents.map((d) => d.id),
    })),
  
  deselectAllDocuments: () =>
    set({
      selectedDocumentIds: [],
    }),
  
  setUploadStatus: (status) =>
    set({
      uploadStatus: status,
    }),
  
  setUploadError: (error) =>
    set({
      uploadError: error,
    }),
  
  setConfig: (config) =>
    set((state) => ({
      config: { ...state.config, ...config },
    })),
  
  reset: () =>
    set({
      documents: [],
      useKnowledgeBase: false,
      selectedDocumentIds: [],
      uploadStatus: 'idle',
      uploadError: null,
      config: {
        threshold: 0.7,
        maxDocs: 5,
      },
    }),
}));
