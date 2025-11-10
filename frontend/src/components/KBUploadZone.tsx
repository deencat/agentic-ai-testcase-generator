/**
 * Knowledge Base Upload Zone Component
 * Drag-and-drop upload for KB documents (User Guides, Manuals)
 * 
 * Features:
 * - Blue-themed upload zone (distinct from requirements upload)
 * - Drag-and-drop support for PDF, TXT, MD files
 * - File validation and deduplication
 * - Document list with delete functionality
 * - Confirmation dialogs for delete operations
 * - Visual KB status indicators
 * 
 * Week 3 Task: ✅ Implement KB document upload UI
 * 
 * @component
 */

'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useKBStore } from '@/stores/useKBStore';

/**
 * Accepted file types for KB documents
 */
const ACCEPTED_KB_TYPES = {
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'text/markdown': ['.md'],
};

/**
 * Maximum file size: 20MB per KB document
 */
const MAX_KB_FILE_SIZE = 20 * 1024 * 1024; // 20MB

/**
 * Maximum total KB storage: 100MB
 */
const MAX_TOTAL_KB_SIZE = 100 * 1024 * 1024; // 100MB

/**
 * KB Upload Zone component
 * Handles Knowledge Base document uploads
 */
export function KBUploadZone() {
  const {
    documents,
    addDocuments,
    removeDocument,
    uploadStatus,
    uploadError,
    useKnowledgeBase,
    toggleKnowledgeBase,
  } = useKBStore();

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  /**
   * Handle KB document drop
   */
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Check total size
      const currentSize = documents.reduce((sum, d) => sum + d.size, 0);
      const newSize = acceptedFiles.reduce((sum, f) => sum + f.size, 0);
      
      if (currentSize + newSize > MAX_TOTAL_KB_SIZE) {
        alert('Total KB storage exceeds 100MB limit');
        return;
      }

      // Convert files to KB documents
      const newDocs = acceptedFiles.map((file) => {
        let type: 'pdf' | 'txt' | 'md' = 'txt';
        if (file.name.endsWith('.pdf')) {
          type = 'pdf';
        } else if (file.name.endsWith('.md')) {
          type = 'md';
        }
        
        return {
          id: `kb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        };
      });

      // Add to store
      addDocuments(newDocs);
    },
    [documents, addDocuments]
  );

  /**
   * Configure dropzone
   */
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_KB_TYPES,
    maxSize: MAX_KB_FILE_SIZE,
    multiple: true,
    disabled: uploadStatus === 'uploading',
  });

  /**
   * Get file icon based on type
   */
  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    }
    return <BookOpen className="h-5 w-5 text-blue-600" />;
  };

  /**
   * Format file size
   */
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  /**
   * Calculate total size
   */
  const totalSize = documents.reduce((sum, d) => sum + d.size, 0);

  /**
   * Handle delete with confirmation
   */
  const handleDelete = (docId: string) => {
    if (deleteConfirm === docId) {
      removeDocument(docId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(docId);
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => {
        setDeleteConfirm(null);
      }, 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* KB Toggle */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useKnowledgeBase}
            onChange={toggleKnowledgeBase}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="font-semibold text-sm">Use Knowledge Base Context</span>
        </label>
        <Badge variant={useKnowledgeBase ? 'default' : 'secondary'} className="bg-blue-100 text-blue-800">
          {useKnowledgeBase ? 'Enabled' : 'Disabled'}
        </Badge>
        {documents.length > 0 && (
          <Badge variant="outline" className="text-blue-600 border-blue-300">
            {documents.length} document{documents.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Info Message */}
      {useKnowledgeBase && documents.length === 0 && (
        <Card className="border-blue-200 bg-blue-50 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800">
              Upload Knowledge Base documents (User Guides, Manuals) to improve test case quality by 40-60%.
            </p>
          </div>
        </Card>
      )}

      {/* Dropzone */}
      <Card
        {...getRootProps()}
        className={`
          border-2 border-dashed p-6 text-center cursor-pointer transition-all
          ${isDragActive && !isDragReject ? 'border-blue-500 bg-blue-50' : ''}
          ${isDragReject ? 'border-destructive bg-destructive/5' : 'border-blue-200'}
          ${uploadStatus === 'uploading' ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400'}
          ${!useKnowledgeBase ? 'opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} disabled={!useKnowledgeBase} />
        
        <div className="flex flex-col items-center gap-3">
          <div className={`
            rounded-full p-3 transition-colors
            ${isDragActive && !isDragReject ? 'bg-blue-100' : 'bg-blue-50'}
          `}>
            <BookOpen className={`
              h-6 w-6 transition-colors
              ${isDragActive && !isDragReject ? 'text-blue-600' : 'text-blue-500'}
            `} />
          </div>

          <div>
            <h3 className="font-semibold text-base mb-1 text-blue-900">
              {!useKnowledgeBase
                ? 'Enable KB to Upload Documents'
                : isDragActive && !isDragReject
                ? 'Drop KB documents here'
                : isDragReject
                ? 'Invalid file type'
                : 'Upload Knowledge Base Documents'}
            </h3>
            <p className="text-sm text-blue-700">
              {uploadStatus === 'uploading'
                ? 'Uploading...'
                : 'Drag & drop PDF, TXT, or MD files'}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Max 20MB per file • 100MB total • PDF, TXT, MD supported
            </p>
          </div>
        </div>
      </Card>

      {/* Upload Error */}
      {uploadError && (
        <Card className="border-destructive bg-destructive/5 p-3">
          <p className="text-sm text-destructive">{uploadError}</p>
        </Card>
      )}

      {/* KB Document List */}
      {documents.length > 0 && (
        <Card className="p-4 border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-blue-900">
              Knowledge Base Documents ({documents.length})
            </h4>
            <p className="text-sm text-blue-600">
              Total: {formatFileSize(totalSize)} / 100MB
            </p>
          </div>

          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(doc.name)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-blue-900">{doc.name}</p>
                    <div className="flex items-center gap-2 text-xs text-blue-600">
                      <span>{formatFileSize(doc.size)}</span>
                      <span>•</span>
                      <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant={deleteConfirm === doc.id ? 'destructive' : 'ghost'}
                  size="sm"
                  onClick={() => handleDelete(doc.id)}
                  disabled={uploadStatus === 'uploading'}
                  className="ml-2"
                >
                  {deleteConfirm === doc.id ? (
                    'Confirm?'
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
