/**
 * TestCaseList Component
 * Displays list of test cases with filtering and sorting
 * 
 * Features:
 * - Fetch test cases from backend (mock for now)
 * - Display loading states
 * - Handle errors
 * - Empty state when no test cases
 * - Filter by category, priority, KB validation
 * - Sort by ID, priority, category, KB compliance
 * - Connect to useTestCaseStore
 * 
 * Week 7 Status: ✅ Complete
 * 
 * @component
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { TestCaseCard } from '@/components/TestCaseCard';
import { useTestCaseStore, TestCase } from '@/stores/useTestCaseStore';
import { Loader2, AlertCircle, FileText, Filter, X } from 'lucide-react';

/**
 * Props for TestCaseList component
 */
interface TestCaseListProps {
  /** Optional project ID to fetch test cases for */
  projectId?: string;
}

/**
 * TestCaseList component
 * 
 * @example
 * ```tsx
 * <TestCaseList projectId="123" />
 * ```
 */
export function TestCaseList({ projectId }: TestCaseListProps) {
  const {
    testCases,
    setTestCases,
    filterCategory,
    filterPriority,
    sortBy,
    setFilterCategory,
    setFilterPriority,
    setSortBy,
  } = useTestCaseStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showKBOnly, setShowKBOnly] = useState(false);

  /**
   * Fetch test cases from backend
   * TODO: Replace with real API call when backend endpoint is ready
   */
  const fetchTestCases = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data for prototyping
      const mockTestCases: TestCase[] = [
        {
          id: '1',
          title: 'User Login Functionality',
          description: 'Verify that users can successfully log in with valid credentials and are redirected to the dashboard.',
          category: 'Authentication',
          priority: 'high',
          steps: [
            'Navigate to the login page',
            'Enter valid username and password',
            'Click the "Login" button',
            'Verify redirection to dashboard'
          ],
          expectedResults: [
            'Login page loads successfully',
            'Credentials are accepted',
            'User is authenticated',
            'Dashboard is displayed with user information'
          ],
          validationTable: {
            'Field Validation': 'Pass',
            'Authentication': 'Pass',
            'Session Management': 'Pass',
            'Error Handling': 'Pass'
          },
          kbCompliant: true,
          kbReferences: [
            'CRM_User_Guide.pdf (Section 2.1: Login Process)',
            'Authentication_Manual.pdf (Section 3.2: User Credentials)'
          ]
        },
        {
          id: '2',
          title: 'Password Reset Flow',
          description: 'Test the password reset functionality including email verification and new password creation.',
          category: 'Authentication',
          priority: 'high',
          steps: [
            'Click "Forgot Password" link',
            'Enter registered email address',
            'Check email for reset link',
            'Click reset link and enter new password',
            'Confirm new password'
          ],
          expectedResults: [
            'Forgot password page displays',
            'Email is validated and sent',
            'Reset link is received within 5 minutes',
            'New password is accepted and validated',
            'User can log in with new password'
          ],
          validationTable: {
            'Email Validation': 'Pass',
            'Link Generation': 'Pass',
            'Password Strength': 'Pass',
            'Session Update': 'Pass'
          },
          kbCompliant: true,
          kbReferences: [
            'CRM_User_Guide.pdf (Section 2.3: Password Recovery)',
            'Security_Standards.pdf (Section 4.1: Password Policy)'
          ]
        },
        {
          id: '3',
          title: 'Create New Customer Record',
          description: 'Verify that a new customer can be created with all required fields and optional information.',
          category: 'Customer Management',
          priority: 'medium',
          steps: [
            'Navigate to Customer Management section',
            'Click "Add New Customer" button',
            'Fill in required fields (Name, Email, Phone)',
            'Fill in optional fields (Address, Company)',
            'Click "Save" button'
          ],
          expectedResults: [
            'Add Customer form displays',
            'Required fields are validated',
            'Optional fields accept data',
            'Customer record is created with unique ID',
            'Success message is displayed'
          ],
          validationTable: {
            'Field Validation': 'Pass',
            'Database Insert': 'Pass',
            'Duplicate Check': 'Partial',
            'Notification': 'Pass'
          },
          kbCompliant: false,
          kbReferences: [
            'CRM_User_Guide.pdf (Section 5.1: Customer Creation - Missing field: Tax ID)'
          ]
        },
        {
          id: '4',
          title: 'Search Customer by Name',
          description: 'Test the customer search functionality using partial name matching.',
          category: 'Search',
          priority: 'medium',
          steps: [
            'Navigate to Customer Search page',
            'Enter partial customer name in search field',
            'Click "Search" button',
            'Review search results'
          ],
          expectedResults: [
            'Search page loads correctly',
            'Partial name matching works',
            'Results are displayed in grid format',
            'Customer details can be viewed from results'
          ],
          validationTable: {
            'Search Algorithm': 'Pass',
            'Result Display': 'Pass',
            'Performance': 'Pass',
            'Pagination': 'Pass'
          },
          kbCompliant: true,
          kbReferences: [
            'CRM_User_Guide.pdf (Section 6.2: Search Functions)'
          ]
        },
        {
          id: '5',
          title: 'Export Customer List to Excel',
          description: 'Verify that customer list can be exported to Excel format with all selected columns.',
          category: 'Export',
          priority: 'low',
          steps: [
            'Navigate to Customer List page',
            'Select columns to export',
            'Click "Export to Excel" button',
            'Save the downloaded file'
          ],
          expectedResults: [
            'Export dialog displays',
            'Column selection is available',
            'Excel file is generated',
            'Downloaded file contains correct data and formatting'
          ],
          validationTable: {
            'Data Accuracy': 'Pass',
            'Formatting': 'Pass',
            'File Size': 'Pass',
            'Download Speed': 'Partial'
          },
          kbCompliant: true,
          kbReferences: [
            'CRM_User_Guide.pdf (Section 7.1: Export Features)'
          ]
        }
      ];

      setTestCases(mockTestCases);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch test cases');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load test cases on mount or when projectId changes
   */
  useEffect(() => {
    fetchTestCases();
  }, [projectId]);

  /**
   * Filter and sort test cases
   */
  const getFilteredAndSortedTestCases = () => {
    let filtered = [...testCases];

    // Filter by category
    if (filterCategory && filterCategory !== 'all') {
      filtered = filtered.filter(tc => tc.category === filterCategory);
    }

    // Filter by priority
    if (filterPriority && filterPriority !== 'all') {
      filtered = filtered.filter(tc => tc.priority === filterPriority);
    }

    // Filter by KB validation
    if (showKBOnly) {
      filtered = filtered.filter(tc => tc.kbCompliant === true);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'id':
          return a.id.localeCompare(b.id);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  };

  /**
   * Get unique categories from test cases
   */
  const getCategories = () => {
    const categories = new Set(testCases.map(tc => tc.category));
    return Array.from(categories).sort();
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setFilterCategory('all');
    setFilterPriority('all');
    setShowKBOnly(false);
  };

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = () => {
    return filterCategory !== 'all' || 
           filterPriority !== 'all' || 
           showKBOnly;
  };

  const filteredTestCases = getFilteredAndSortedTestCases();
  const categories = getCategories();

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Test Cases
                {testCases.length > 0 && (
                  <Badge variant="outline">
                    {filteredTestCases.length} of {testCases.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {isLoading 
                  ? 'Loading test cases...' 
                  : testCases.length === 0 
                  ? 'No test cases generated yet'
                  : `Viewing ${filteredTestCases.length} test case${filteredTestCases.length !== 1 ? 's' : ''}`
                }
              </CardDescription>
            </div>
            
            {testCases.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={fetchTestCases}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Refresh'
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        
        {testCases.length > 0 && (
          <CardContent>
            <div className="space-y-4">
              {/* Filter Controls */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filters:</span>
                </div>
                
                {/* Category Filter */}
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Priority Filter */}
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Sort By */}
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">ID</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* KB Filter Toggle */}
                <Button
                  variant={showKBOnly ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowKBOnly(!showKBOnly)}
                  className={showKBOnly ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  {showKBOnly ? '✓ ' : ''}KB Validated Only
                </Button>
                
                {/* Clear Filters */}
                {hasActiveFilters() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear Filters
                  </Button>
                )}
              </div>
              
              {/* Active Filters Display */}
              {hasActiveFilters() && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  {filterCategory !== 'all' && (
                    <Badge variant="secondary">
                      Category: {filterCategory}
                    </Badge>
                  )}
                  {filterPriority !== 'all' && (
                    <Badge variant="secondary">
                      Priority: {filterPriority}
                    </Badge>
                  )}
                  {showKBOnly && (
                    <Badge variant="secondary">
                      KB Validated Only
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading test cases...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Error loading test cases</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTestCases}
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && testCases.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No test cases yet</p>
              <p className="text-sm">
                Upload requirements and click "Generate Test Cases" to get started
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results After Filtering */}
      {!isLoading && !error && testCases.length > 0 && filteredTestCases.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center text-gray-500">
              <Filter className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No test cases match your filters</p>
              <p className="text-sm mb-4">
                Try adjusting your filter criteria
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Case Cards */}
      {!isLoading && !error && filteredTestCases.length > 0 && (
        <div className="space-y-4">
          {filteredTestCases.map((testCase) => (
            <TestCaseCard
              key={testCase.id}
              testCase={testCase}
              defaultExpanded={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
