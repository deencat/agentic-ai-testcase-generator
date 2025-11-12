/**
 * EditableText Component
 * Inline editable text field with click-to-edit functionality
 * 
 * Features:
 * - Click to edit mode
 * - Auto-save on blur or Enter key
 * - Escape to cancel
 * - Loading and error states
 * - Validation support
 * 
 * Week 9 Status: ✅ Complete
 * 
 * @component
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2, Check, X } from 'lucide-react';

/**
 * Props for EditableText component
 */
interface EditableTextProps {
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
}

/**
 * EditableText component
 * 
 * @example
 * ```tsx
 * <EditableText
 *   value={testCase.title}
 *   onSave={async (newTitle) => {
 *     await updateTestCase(testCase.id, { title: newTitle });
 *   }}
 *   placeholder="Enter test case title"
 *   required
 *   maxLength={200}
 * />
 * ```
 */
export function EditableText({
  value,
  onSave,
  placeholder = 'Click to edit',
  className = '',
  validate,
  required = false,
  maxLength,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update current value when prop changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  /**
   * Handle blur (save on blur)
   */
  const handleBlur = () => {
    // Small delay to allow cancel button click to register
    setTimeout(() => {
      if (isEditing && !error) {
        handleSave();
      }
    }, 200);
  };

  return (
    <div className="relative group">
      {isEditing ? (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              type="text"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder={placeholder}
              maxLength={maxLength}
              disabled={isLoading}
              className={`flex-1 ${error ? 'border-red-500' : ''}`}
            />
            
            {/* Loading indicator */}
            {isLoading && (
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
            )}
            
            {/* Cancel button */}
            {!isLoading && (
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-gray-100 rounded"
                title="Cancel (Esc)"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
          
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
        </div>
      ) : (
        <div 
          onClick={handleClick}
          className={`cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 -my-1 transition-colors ${className}`}
          title="Click to edit"
        >
          <div className="flex items-center gap-2">
            <span className={currentValue ? '' : 'text-gray-400 italic'}>
              {currentValue || placeholder}
            </span>
            
            {/* Success indicator */}
            {showSuccess && (
              <Check className="h-4 w-4 text-green-600" />
            )}
            
            {/* Edit hint (visible on hover) */}
            <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              ✏️
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
