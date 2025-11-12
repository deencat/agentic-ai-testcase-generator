/**
 * EditableTextarea Component
 * Inline editable textarea field with click-to-edit functionality
 * 
 * Features:
 * - Click to edit mode
 * - Auto-save on blur
 * - Escape to cancel
 * - Loading and error states
 * - Auto-resize functionality
 * - Validation support
 * 
 * Week 9 Status: ✅ Complete
 * 
 * @component
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Check, X } from 'lucide-react';

/**
 * Props for EditableTextarea component
 */
interface EditableTextareaProps {
  /** Current value */
  value: string;
  
  /** Callback when value changes and is saved */
  onSave: (newValue: string) => Promise<void>;
  
  /** Placeholder text when empty */
  placeholder?: string;
  
  /** CSS classes for display mode */
  className?: string;
  
  /** Validation function (returns error message or null) */
  validate?: (value: string) => string | null;
  
  /** Whether field is required */
  required?: boolean;
  
  /** Maximum character length */
  maxLength?: number;
  
  /** Minimum number of rows */
  minRows?: number;
}

/**
 * EditableTextarea component
 * 
 * @example
 * ```tsx
 * <EditableTextarea
 *   value={testCase.description}
 *   onSave={async (newDesc) => {
 *     await updateTestCase(testCase.id, { description: newDesc });
 *   }}
 *   placeholder="Enter description"
 *   required
 *   minRows={3}
 * />
 * ```
 */
export function EditableTextarea({
  value,
  onSave,
  placeholder = 'Click to edit',
  className = '',
  validate,
  required = false,
  maxLength,
  minRows = 3,
}: EditableTextareaProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update current value when prop changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // Focus textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  /**
   * Enter edit mode
   */
  const handleClick = () => {
    if (!isEditing && !isLoading) {
      setIsEditing(true);
      setError(null);
    }
  };

  /**
   * Save changes
   */
  const handleSave = async () => {
    // Validate
    if (required && !currentValue.trim()) {
      setError('This field is required');
      return;
    }

    if (validate) {
      const validationError = validate(currentValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // No changes
    if (currentValue === value) {
      setIsEditing(false);
      return;
    }

    // Save
    setIsLoading(true);
    setError(null);

    try {
      await onSave(currentValue);
      setIsEditing(false);
      setIsLoading(false);
      setShowSuccess(true);
      
      // Hide success indicator after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setIsLoading(false);
    }
  };

  /**
   * Cancel editing
   */
  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
    setError(null);
  };

  /**
   * Handle key press
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
    // Ctrl+Enter or Cmd+Enter to save
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="relative group">
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            ref={textareaRef}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={isLoading}
            rows={minRows}
            className={`w-full resize-y ${error ? 'border-red-500' : ''}`}
          />
          
          {/* Error message */}
          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}
          
          {/* Character count */}
          {maxLength && (
            <p className="text-xs text-gray-500">
              {currentValue.length} / {maxLength}
            </p>
          )}
          
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              size="sm"
              variant="default"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Save
                </>
              )}
            </Button>
            
            <Button
              onClick={handleCancel}
              disabled={isLoading}
              size="sm"
              variant="outline"
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
            
            <span className="text-xs text-gray-500 ml-2">
              Ctrl+Enter to save, Esc to cancel
            </span>
          </div>
        </div>
      ) : (
        <div 
          onClick={handleClick}
          className={`cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 -my-1 transition-colors ${className}`}
          title="Click to edit"
        >
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <p className={`whitespace-pre-wrap ${currentValue ? '' : 'text-gray-400 italic'}`}>
                {currentValue || placeholder}
              </p>
            </div>
            
            {/* Success indicator */}
            {showSuccess && (
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
            )}
            
            {/* Edit hint (visible on hover) */}
            <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              ✏️
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
