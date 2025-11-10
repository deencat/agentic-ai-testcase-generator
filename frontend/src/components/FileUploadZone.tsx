/**
 * File Upload Zone Component
 * Drag-and-drop file upload for requirements (PDF, Excel)
 * 
 * Features:
 * - Drag-and-drop support (react-dropzone)
 * - Multiple file uploads (PDF, Excel)
 * - File validation (type, size)
 * - Upload status display
 * - Remove file functionality
 * - Visual feedback (hover, active, error states)
 * 
 * Week 3 Task: ✅ Implement drag-and-drop file upload
 * 
 * @component
 */

'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGenerationStore } from '@/stores/useGenerationStore';

/**
 * Accepted file types for requirements upload
 */
const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls'],
};

/**
 * Maximum file size: 10MB per file
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Maximum total upload size: 50MB
 */
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * File upload zone component
 * Handles drag-and-drop and click-to-upload for requirements files
 */
export function FileUploadZone() {
  const { files, addFiles, removeFile, uploadStatus, uploadError } = useGenerationStore();

  /**
   * Handle file drop
   */
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Check total size
      const currentSize = files.reduce((sum, f) => sum + f.size, 0);
      const newSize = acceptedFiles.reduce((sum, f) => sum + f.size, 0);
      
      if (currentSize + newSize > MAX_TOTAL_SIZE) {
        alert('Total file size exceeds 50MB limit');
        return;
      }

      // Add files to store
      addFiles(acceptedFiles);
    },
    [files, addFiles]
  );

  /**
   * Configure dropzone
   */
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
    disabled: uploadStatus === 'uploading',
  });

  /**
   * Get file icon based on file type
   */
  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    return <File className="h-5 w-5 text-green-500" />;
  };

  /**
   * Format file size for display
   */
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  /**
   * Calculate total size
   */
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <Card
        {...getRootProps()}
        className={`
          border-2 border-dashed p-8 text-center cursor-pointer transition-all
          ${isDragActive && !isDragReject ? 'border-primary bg-primary/5' : ''}
          ${isDragReject ? 'border-destructive bg-destructive/5' : 'border-border'}
          ${uploadStatus === 'uploading' ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          <div className={`
            rounded-full p-4 transition-colors
            ${isDragActive && !isDragReject ? 'bg-primary/10' : 'bg-muted'}
          `}>
            <Upload className={`
              h-8 w-8 transition-colors
              ${isDragActive && !isDragReject ? 'text-primary' : 'text-muted-foreground'}
            `} />
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">
              {isDragActive && !isDragReject
                ? 'Drop files here'
                : isDragReject
                ? 'Invalid file type'
                : 'Upload Requirements Files'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {uploadStatus === 'uploading'
                ? 'Uploading...'
                : 'Drag & drop PDF or Excel files, or click to browse'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supported: PDF, Excel (.xlsx, .xls) • Max 10MB per file • 50MB total
            </p>
          </div>
        </div>
      </Card>

      {/* Upload Error */}
      {uploadError && (
        <Card className="border-destructive bg-destructive/5 p-4">
          <p className="text-sm text-destructive">{uploadError}</p>
        </Card>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">
              Uploaded Files ({files.length})
            </h4>
            <p className="text-sm text-muted-foreground">
              Total: {formatFileSize(totalSize)} / 50MB
            </p>
          </div>

          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(file.name)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.name)}
                  disabled={uploadStatus === 'uploading'}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
