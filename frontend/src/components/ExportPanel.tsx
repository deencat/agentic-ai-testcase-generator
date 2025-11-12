/**
 * Export Panel Component
 * Provides export functionality for generated test cases
 * 
 * Features:
 * - Format selection (Excel, Markdown)
 * - Test case selection (All/Selected)
 * - KB export options (references, compliance scores)
 * - Download buttons with loading states
 * - Success/error notifications
 * 
 * Week 10 Status: ✅ Complete - Export panel with KB options
 * 
 * @component
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useExportStore } from '@/stores/useExportStore';
import { useTestCaseStore } from '@/stores/useTestCaseStore';
import { useKBStore } from '@/stores/useKBStore';
import { Download, FileSpreadsheet, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Export notification type
 */
type NotificationType = 'success' | 'error' | null;

/**
 * ExportPanel component
 * Displays export controls and handles export operations
 */
export function ExportPanel() {
  // Store hooks
  const { 
    format, 
    setFormat, 
    isExporting, 
    setIsExporting,
    includeKBReferences,
    setIncludeKBReferences,
    includeKBScores,
    setIncludeKBScores,
  } = useExportStore();

  const { testCases } = useTestCaseStore();
  const { useKnowledgeBase } = useKBStore();

  // Local state
  const [selectedTestCases, setSelectedTestCases] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<{ type: NotificationType; message: string } | null>(null);

  /**
   * Toggle test case selection
   */
  const toggleTestCase = (id: string) => {
    setSelectedTestCases((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  /**
   * Select all test cases
   */
  const selectAll = () => {
    setSelectedTestCases(new Set(testCases.map((tc) => tc.id)));
  };

  /**
   * Clear all selections
   */
  const clearAll = () => {
    setSelectedTestCases(new Set());
  };

  /**
   * Handle export button click
   * Triggers download of test cases in selected format
   */
  const handleExport = async () => {
    // Validate selection
    if (selectedTestCases.size === 0) {
      setNotification({
        type: 'error',
        message: 'Please select at least one test case to export',
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setIsExporting(true);
    setNotification(null);

    try {
      // Get selected test cases data
      const selectedData = testCases.filter((tc) => selectedTestCases.has(tc.id));

      // Build export data with KB options
      const exportData = {
        testCases: selectedData,
        format,
        includeKBReferences: useKnowledgeBase ? includeKBReferences : false,
        includeKBScores: useKnowledgeBase ? includeKBScores : false,
      };

      // TODO: Replace with actual API call when backend endpoint is ready
      // const response = await api.exportTestCases(exportData);
      
      // Mock export logic for prototyping
      await mockExport(exportData);

      // Show success notification
      setNotification({
        type: 'success',
        message: `Successfully exported ${selectedTestCases.size} test case${selectedTestCases.size !== 1 ? 's' : ''} to ${format.toUpperCase()}${useKnowledgeBase && includeKBReferences ? ' with KB references' : ''}`,
      });

      // Auto-hide notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);

    } catch (error) {
      console.error('Export error:', error);
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Export failed. Please try again.',
      });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Mock export function for prototyping
   * Simulates file download
   */
  const mockExport = async (exportData: any): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create mock file content
        let content = '';
        let filename = '';
        let mimeType = '';

        if (exportData.format === 'excel') {
          // Mock Excel export
          content = 'Mock Excel file content (binary data would go here in production)';
          filename = `test-cases-${Date.now()}.xlsx`;
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        } else {
          // Mock Markdown export
          content = generateMockMarkdown(exportData);
          filename = `test-cases-${Date.now()}.md`;
          mimeType = 'text/markdown';
        }

        // Create blob and trigger download
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        resolve();
      }, 1500); // Simulate network delay
    });
  };

  /**
   * Generate mock Markdown content
   */
  const generateMockMarkdown = (exportData: any): string => {
    let md = '# Test Cases Export\n\n';
    md += `**Exported:** ${new Date().toLocaleString()}\n`;
    md += `**Format:** Markdown\n`;
    md += `**Total Test Cases:** ${exportData.testCases.length}\n\n`;

    if (exportData.includeKBReferences) {
      md += '**KB References:** Included\n';
    }
    if (exportData.includeKBScores) {
      md += '**KB Compliance Scores:** Included\n';
    }
    md += '\n---\n\n';

    exportData.testCases.forEach((tc: any, index: number) => {
      md += `## ${index + 1}. ${tc.title}\n\n`;
      md += `**ID:** ${tc.id}\n`;
      md += `**Category:** ${tc.category}\n`;
      md += `**Priority:** ${tc.priority}\n\n`;
      md += `**Description:** ${tc.description}\n\n`;
      
      if (tc.steps && tc.steps.length > 0) {
        md += '### Steps:\n';
        tc.steps.forEach((step: string, i: number) => {
          md += `${i + 1}. ${step}\n`;
        });
        md += '\n';
      }

      if (tc.expectedResults && tc.expectedResults.length > 0) {
        md += '### Expected Results:\n';
        tc.expectedResults.forEach((result: string, i: number) => {
          md += `${i + 1}. ${result}\n`;
        });
        md += '\n';
      }

      if (exportData.includeKBReferences && tc.kbReferences && tc.kbReferences.length > 0) {
        md += '### KB References:\n';
        tc.kbReferences.forEach((ref: string) => {
          md += `- ${ref}\n`;
        });
        md += '\n';
      }

      if (exportData.includeKBScores && tc.kbCompliant !== undefined) {
        md += `**KB Compliant:** ${tc.kbCompliant ? '✓ Yes' : '✗ No'}\n\n`;
      }

      md += '---\n\n';
    });

    return md;
  };

  // If no test cases, show message
  if (testCases.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Export Test Cases</CardTitle>
          <CardDescription>
            No test cases available to export. Generate test cases first.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Test Cases
        </CardTitle>
        <CardDescription>
          Select test cases and format to export. {testCases.length} test case{testCases.length !== 1 ? 's' : ''} available.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notification */}
        {notification && (
          <div
            className={`p-4 rounded-lg border-2 flex items-start gap-3 transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-500 text-green-800'
                : 'bg-red-50 border-red-500 text-red-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5 animate-in zoom-in duration-300" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 animate-in zoom-in duration-300" />
            )}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        )}

        {/* Test Case Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Select Test Cases</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAll}
                disabled={isExporting || selectedTestCases.size === testCases.length}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                disabled={isExporting || selectedTestCases.size === 0}
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* Selected count badge */}
          <div>
            <Badge variant={selectedTestCases.size > 0 ? 'default' : 'secondary'}>
              {selectedTestCases.size} of {testCases.length} selected
            </Badge>
          </div>

          {/* Test case checkboxes */}
          <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2 transition-all duration-200">
            {testCases.map((tc, index) => (
              <label
                key={tc.id}
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-sm animate-in fade-in slide-in-from-left"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <input
                  type="checkbox"
                  checked={selectedTestCases.has(tc.id)}
                  onChange={() => toggleTestCase(tc.id)}
                  disabled={isExporting}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 transition-all duration-150"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tc.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {tc.category} • {tc.priority}
                    {tc.kbCompliant && (
                      <span className="ml-2 text-green-600 animate-in fade-in duration-300">✓ KB</span>
                    )}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Export Format</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={format === 'excel' ? 'default' : 'outline'}
              className={`justify-start h-auto py-4 transition-all duration-300 ${
                format === 'excel' ? 'ring-2 ring-blue-500 scale-105 shadow-md' : 'hover:scale-102 hover:shadow-sm'
              }`}
              onClick={() => setFormat('excel')}
              disabled={isExporting}
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className={`h-6 w-6 transition-transform duration-300 ${format === 'excel' ? 'rotate-6' : ''}`} />
                <div className="text-left">
                  <p className="font-semibold">Excel</p>
                  <p className="text-xs opacity-80">XLSX format</p>
                </div>
              </div>
            </Button>

            <Button
              variant={format === 'markdown' ? 'default' : 'outline'}
              className={`justify-start h-auto py-4 transition-all duration-300 ${
                format === 'markdown' ? 'ring-2 ring-blue-500 scale-105 shadow-md' : 'hover:scale-102 hover:shadow-sm'
              }`}
              onClick={() => setFormat('markdown')}
              disabled={isExporting}
            >
              <div className="flex items-center gap-3">
                <FileText className={`h-6 w-6 transition-transform duration-300 ${format === 'markdown' ? 'rotate-6' : ''}`} />
                <div className="text-left">
                  <p className="font-semibold">Markdown</p>
                  <p className="text-xs opacity-80">MD format</p>
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* KB Export Options (only show if KB is enabled) */}
        {useKnowledgeBase && (
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-in fade-in slide-in-from-bottom duration-300">
            <h3 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
              📚 Knowledge Base Export Options
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer transition-all duration-200 hover:bg-blue-100 p-2 rounded">
                <input
                  type="checkbox"
                  checked={includeKBReferences}
                  onChange={(e) => setIncludeKBReferences(e.target.checked)}
                  disabled={isExporting}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 transition-all duration-150"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Include KB references
                  </p>
                  <p className="text-xs text-blue-700">
                    Add source document references as footnotes/citations
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer transition-all duration-200 hover:bg-blue-100 p-2 rounded">
                <input
                  type="checkbox"
                  checked={includeKBScores}
                  onChange={(e) => setIncludeKBScores(e.target.checked)}
                  disabled={isExporting}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 transition-all duration-150"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Include KB compliance scores
                  </p>
                  <p className="text-xs text-blue-700">
                    Show which test cases meet KB requirements
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Export Button */}
        <div className="pt-2">
          <Button
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 h-12 text-base font-semibold transition-all duration-300 hover:scale-102 hover:shadow-lg active:scale-98"
            onClick={handleExport}
            disabled={isExporting || selectedTestCases.size === 0}
          >
            {isExporting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Exporting to {format.toUpperCase()}...
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:translate-y-0.5" />
                Export {selectedTestCases.size > 0 ? `${selectedTestCases.size} ` : ''}
                to {format === 'excel' ? 'Excel' : 'Markdown'}
              </>
            )}
          </Button>

          {/* Export info */}
          {selectedTestCases.size > 0 && !isExporting && (
            <p className="text-xs text-muted-foreground text-center mt-2 animate-in fade-in duration-300">
              {format === 'excel' 
                ? 'Excel file with formatted tables and styling' 
                : 'Markdown file with structured formatting'}
              {useKnowledgeBase && includeKBReferences && ' • KB references included'}
              {useKnowledgeBase && includeKBScores && ' • KB scores included'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
