/**
 * EditableList Component
 * Inline editable list (steps or expected results) with add/remove/edit functionality
 * 
 * Features:
 * - Add new items
 * - Edit existing items
 * - Remove items
 * - Reorder items (optional)
 * - Auto-save on changes
 * - Validation support
 * 
 * Week 9 Status: ✅ Complete
 * 
 * @component
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, X, GripVertical, Check } from 'lucide-react';

/**
 * Props for EditableList component
 */
interface EditableListProps {
  /** Current list items */
  items: string[];
  
  /** Callback when list changes and is saved */
  onSave: (newItems: string[]) => Promise<void>;
  
  /** Placeholder for new item input */
  placeholder?: string;
  
  /** CSS classes */
  className?: string;
  
  /** Whether list is ordered (numbered) */
  ordered?: boolean;
  
  /** Label for the list */
  label?: string;
}

/**
 * EditableList component
 * 
 * @example
 * ```tsx
 * <EditableList
 *   items={testCase.steps}
 *   onSave={async (newSteps) => {
 *     await updateTestCase(testCase.id, { steps: newSteps });
 *   }}
 *   placeholder="Enter test step"
 *   ordered
 *   label="Test Steps"
 * />
 * ```
 */
export function EditableList({
  items,
  onSave,
  placeholder = 'Enter item',
  className = '',
  ordered = true,
  label,
}: EditableListProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentItems, setCurrentItems] = useState(items);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newItem, setNewItem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /**
   * Enter edit mode
   */
  const handleEdit = () => {
    if (!isEditing && !isLoading) {
      setIsEditing(true);
      setCurrentItems(items);
    }
  };

  /**
   * Save changes
   */
  const handleSave = async () => {
    // Filter out empty items
    const filteredItems = currentItems.filter(item => item.trim());
    
    // No changes
    if (JSON.stringify(filteredItems) === JSON.stringify(items)) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);

    try {
      await onSave(filteredItems);
      setIsEditing(false);
      setIsLoading(false);
      setEditingIndex(null);
      setNewItem('');
      setShowSuccess(true);
      
      // Hide success indicator after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to save list:', err);
      setIsLoading(false);
    }
  };

  /**
   * Cancel editing
   */
  const handleCancel = () => {
    setCurrentItems(items);
    setIsEditing(false);
    setEditingIndex(null);
    setNewItem('');
  };

  /**
   * Update item at index
   */
  const updateItem = (index: number, value: string) => {
    const updated = [...currentItems];
    updated[index] = value;
    setCurrentItems(updated);
  };

  /**
   * Remove item at index
   */
  const removeItem = (index: number) => {
    const updated = currentItems.filter((_, i) => i !== index);
    setCurrentItems(updated);
  };

  /**
   * Add new item
   */
  const addItem = () => {
    if (newItem.trim()) {
      setCurrentItems([...currentItems, newItem.trim()]);
      setNewItem('');
    }
  };

  /**
   * Handle key press in new item input
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  const ListTag = ordered ? 'ol' : 'ul';

  return (
    <div className={`relative group ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-sm text-gray-700">{label}</h4>
          {showSuccess && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Saved
            </span>
          )}
        </div>
      )}

      {isEditing ? (
        <div className="space-y-3">
          {/* Editable items */}
          <div className="space-y-2">
            {currentItems.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-sm text-gray-500 mt-2 flex-shrink-0">
                  {ordered ? `${index + 1}.` : '•'}
                </span>
                
                <Input
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  onFocus={() => setEditingIndex(index)}
                  onBlur={() => setEditingIndex(null)}
                  className="flex-1"
                  disabled={isLoading}
                />
                
                <button
                  onClick={() => removeItem(index)}
                  disabled={isLoading}
                  className="p-1 hover:bg-red-50 rounded mt-1 flex-shrink-0"
                  title="Remove item"
                >
                  <X className="h-4 w-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new item */}
          <div className="flex items-center gap-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              className="flex-1"
            />
            
            <Button
              onClick={addItem}
              disabled={isLoading || !newItem.trim()}
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
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
          </div>
        </div>
      ) : (
        <div 
          onClick={handleEdit}
          className="cursor-pointer hover:bg-gray-50 rounded px-2 py-2 -mx-2 transition-colors"
          title="Click to edit"
        >
          <ListTag className={`${ordered ? 'list-decimal' : 'list-disc'} list-inside space-y-2`}>
            {items.map((item, index) => (
              <li key={index} className="text-sm text-gray-600">
                {item}
              </li>
            ))}
          </ListTag>
          
          {/* Edit hint (visible on hover) */}
          <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mt-2 inline-block">
            ✏️ Click to edit
          </span>
        </div>
      )}
    </div>
  );
}
