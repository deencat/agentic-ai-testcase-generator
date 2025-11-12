/**
 * TestCaseCard Component
 * Displays individual test case with expandable/collapsible functionality
 * 
 * Features:
 * - Expandable/collapsible card design
 * - KB compliance badge in header
 * - Cross-system validation table display
 * - KB references section
 * - All test case fields (title, description, steps, expected results)
 * - Color-coded status indicators
 * - Inline editing for all fields
 * 
 * Week 7 Status: ✅ Complete
 * Week 9 Status: ✅ Complete (inline editing added)
 * 
 * @component
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { TestCase, useTestCaseStore } from '@/stores/useTestCaseStore';
import { EditableText } from '@/components/EditableText';
import { EditableTextarea } from '@/components/EditableTextarea';
import { EditableList } from '@/components/EditableList';
import { updateTestCase as apiUpdateTestCase } from '@/lib/api';

/**
 * Props for TestCaseCard component
 */
interface TestCaseCardProps {
  /** Test case data */
  testCase: TestCase;
  
  /** Optional callback when card is clicked */
  onClick?: (testCase: TestCase) => void;
  
  /** Whether the card is initially expanded */
  defaultExpanded?: boolean;
}

/**
 * TestCaseCard component
 * 
 * @example
 * ```tsx
 * <TestCaseCard
 *   testCase={testCase}
 *   defaultExpanded={false}
 *   onClick={(tc) => console.log('Clicked:', tc.id)}
 * />
 * ```
 */
export function TestCaseCard({ 
  testCase, 
  onClick, 
  defaultExpanded = false 
}: TestCaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { updateTestCase } = useTestCaseStore();

  /**
   * Toggle expansion state
   */
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  /**
   * Handle card click (if onClick provided)
   */
  const handleCardClick = () => {
    if (onClick) {
      onClick(testCase);
    }
  };

  /**
   * Update test case field with optimistic update
   */
  const handleUpdate = async (field: string, value: any) => {
    // Optimistic update
    updateTestCase(testCase.id, { [field]: value });
    
    // Sync with backend
    try {
      await apiUpdateTestCase(testCase.id, { [field]: value });
    } catch (error) {
      console.error('Failed to update test case:', error);
      // Optionally revert on error
      throw error;
    }
  };

  /**
   * Get priority badge color
   */
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  /**
   * Get KB compliance badge
   */
  const getKBBadge = () => {
    if (testCase.kbCompliant === undefined) {
      return null;
    }

    return testCase.kbCompliant ? (
      <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-300">
        <CheckCircle className="h-3 w-3 mr-1" />
        KB ✓
      </Badge>
    ) : (
      <Badge variant="destructive" className="bg-orange-100 text-orange-800 border-orange-300">
        <XCircle className="h-3 w-3 mr-1" />
        KB ✗
      </Badge>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader 
        className="cursor-pointer select-none"
        onClick={handleToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <span className="text-lg font-semibold text-gray-600">{testCase.id}.</span>
                <EditableText
                  value={testCase.title}
                  onSave={async (newValue) => {
                    await handleUpdate('title', newValue);
                  }}
                  placeholder="Enter test case title"
                  required
                  maxLength={200}
                  className="text-lg font-semibold"
                />
              </div>
              
              {/* KB Badge */}
              {getKBBadge()}
              
              {/* Priority Badge */}
              <Badge className={getPriorityColor(testCase.priority)}>
                {testCase.priority.toUpperCase()}
              </Badge>
              
              {/* Category Badge */}
              <Badge variant="outline">
                {testCase.category}
              </Badge>
            </div>
            
            {/* Collapsed Preview */}
            {!isExpanded && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {testCase.description}
              </p>
            )}
          </div>
          
          {/* Expand/Collapse Icon */}
          <button 
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded"
            onClick={handleToggle}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </CardHeader>
      
      {/* Expanded Content */}
      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Description */}
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Description</h4>
            <EditableTextarea
              value={testCase.description}
              onSave={async (newValue) => {
                await handleUpdate('description', newValue);
              }}
              placeholder="Enter test case description"
              required
              minRows={2}
            />
          </div>
          
          {/* Test Steps */}
          <div>
            <EditableList
              items={testCase.steps}
              onSave={async (newItems) => {
                await handleUpdate('steps', newItems);
              }}
              placeholder="Enter test step"
              ordered
              label="Test Steps"
            />
          </div>
          
          {/* Expected Results */}
          <div>
            <EditableList
              items={testCase.expectedResults}
              onSave={async (newItems) => {
                await handleUpdate('expectedResults', newItems);
              }}
              placeholder="Enter expected result"
              ordered
              label="Expected Results"
            />
          </div>
          
          {/* Cross-System Validation Table */}
          {testCase.validationTable && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">
                Cross-System Validation
              </h4>
              <ValidationTable data={testCase.validationTable} />
            </div>
          )}
          
          {/* KB References */}
          {testCase.kbReferences && testCase.kbReferences.length > 0 && (
            <KBReferencesSection references={testCase.kbReferences} />
          )}
        </CardContent>
      )}
    </Card>
  );
}

/**
 * ValidationTable Component
 * Displays cross-system validation in horizontal format with color-coded status
 */
interface ValidationTableProps {
  data: Record<string, any>;
}

function ValidationTable({ data }: ValidationTableProps) {
  /**
   * Get status color based on validation result
   */
  const getStatusColor = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'text-green-600' : 'text-red-600';
    }
    
    const strValue = String(value).toLowerCase();
    if (strValue === 'pass' || strValue === 'valid' || strValue === 'yes') {
      return 'text-green-600';
    }
    if (strValue === 'fail' || strValue === 'invalid' || strValue === 'no') {
      return 'text-red-600';
    }
    if (strValue === 'partial' || strValue === 'warning') {
      return 'text-yellow-600';
    }
    
    return 'text-gray-600';
  };

  /**
   * Get status icon
   */
  const getStatusIcon = (value: any) => {
    const strValue = String(value).toLowerCase();
    
    if (strValue === 'pass' || strValue === 'valid' || strValue === 'yes' || value === true) {
      return <CheckCircle className="h-4 w-4" />;
    }
    if (strValue === 'fail' || strValue === 'invalid' || strValue === 'no' || value === false) {
      return <XCircle className="h-4 w-4" />;
    }
    if (strValue === 'partial' || strValue === 'warning') {
      return <AlertCircle className="h-4 w-4" />;
    }
    
    return null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {Object.keys(data).map((key) => (
              <th 
                key={key}
                className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200"
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          <tr>
            {Object.entries(data).map(([key, value]) => (
              <td 
                key={key}
                className={`px-4 py-3 text-sm border-b border-gray-200 ${getStatusColor(value)}`}
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(value)}
                  <span className="font-medium">
                    {typeof value === 'boolean' ? (value ? 'Pass' : 'Fail') : String(value)}
                  </span>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/**
 * KBReferencesSection Component
 * Displays KB document references with formatting
 */
interface KBReferencesSectionProps {
  references: string[];
}

function KBReferencesSection({ references }: KBReferencesSectionProps) {
  return (
    <div className="border-t pt-4">
      <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
        <span>📚</span>
        <span>Knowledge Base References</span>
      </h4>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
        {references.map((reference, index) => (
          <div key={index} className="text-sm text-blue-800">
            {reference}
          </div>
        ))}
      </div>
    </div>
  );
}
