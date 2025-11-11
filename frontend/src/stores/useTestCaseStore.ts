/**
 * Test Case Store
 * Manages test case data, filtering, and sorting
 * 
 * This store handles:
 * - Test case collection management
 * - Filtering by category, priority, KB validation
 * - Sorting by various criteria
 * - CRUD operations for test cases
 * 
 * @module stores/useTestCaseStore
 */

import { create } from 'zustand';

/**
 * Test case data structure
 */
export interface TestCase {
  /** Unique identifier */
  id: string;
  
  /** Test case title/name */
  title: string;
  
  /** Detailed description */
  description: string;
  
  /** Category (e.g., "Functional", "Integration") */
  category: string;
  
  /** Priority level */
  priority: 'high' | 'medium' | 'low';
  
  /** Test steps */
  steps: string[];
  
  /** Expected results for each step */
  expectedResults: string[];
  
  /** Cross-system validation table (optional) */
  validationTable?: Record<string, any>;
  
  /** Whether test case meets KB requirements (optional) */
  kbCompliant?: boolean;
  
  /** KB document references (optional) */
  kbReferences?: string[];
}

/**
 * State interface for test case management
 */
interface TestCaseState {
  /** All test cases in current project */
  testCases: TestCase[];
  
  /** Currently selected/focused test case */
  selectedTestCase: TestCase | null;
  
  /** Active category filter */
  filterCategory: string;
  
  /** Active priority filter */
  filterPriority: string;
  
  /** Search text for filtering */
  searchText: string;
  
  /** Sort field */
  sortBy: 'id' | 'priority' | 'category' | 'kbCompliance';
  
  /** Replace all test cases */
  setTestCases: (testCases: TestCase[]) => void;
  
  /** Add a new test case */
  addTestCase: (testCase: TestCase) => void;
  
  /** Update an existing test case */
  updateTestCase: (id: string, updates: Partial<TestCase>) => void;
  
  /** Delete a test case by ID */
  deleteTestCase: (id: string) => void;
  
  /** Set selected test case */
  setSelectedTestCase: (testCase: TestCase | null) => void;
  
  /** Set category filter */
  setFilterCategory: (category: string) => void;
  
  /** Set priority filter */
  setFilterPriority: (priority: string) => void;
  
  /** Set search text */
  setSearchText: (text: string) => void;
  
  /** Set sort criteria */
  setSortBy: (sortBy: 'id' | 'priority' | 'category' | 'kbCompliance') => void;
  
  /** Reset all state */
  reset: () => void;
}

/**
 * Zustand store for test case state management
 * 
 * @example
 * ```tsx
 * const { testCases, addTestCase, filterCategory } = useTestCaseStore();
 * 
 * // Add test case
 * addTestCase({
 *   id: '1',
 *   title: 'Login Test',
 *   category: 'Authentication',
 *   priority: 'high',
 *   // ... other fields
 * });
 * 
 * // Filter by category
 * const filtered = testCases.filter(tc => 
 *   filterCategory === 'all' || tc.category === filterCategory
 * );
 * ```
 */
export const useTestCaseStore = create<TestCaseState>((set) => ({
  testCases: [],
  selectedTestCase: null,
  filterCategory: 'all',
  filterPriority: 'all',
  searchText: '',
  sortBy: 'id',
  setTestCases: (testCases) => set({ testCases }),
  addTestCase: (testCase) =>
    set((state) => ({ testCases: [...state.testCases, testCase] })),
  updateTestCase: (id, updates) =>
    set((state) => ({
      testCases: state.testCases.map((tc) =>
        tc.id === id ? { ...tc, ...updates } : tc
      ),
    })),
  deleteTestCase: (id) =>
    set((state) => ({
      testCases: state.testCases.filter((tc) => tc.id !== id),
    })),
  setSelectedTestCase: (testCase) => set({ selectedTestCase: testCase }),
  setFilterCategory: (category) => set({ filterCategory: category }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),
  setSearchText: (text) => set({ searchText: text }),
  setSortBy: (sortBy) => set({ sortBy }),
  reset: () =>
    set({
      testCases: [],
      selectedTestCase: null,
      filterCategory: 'all',
      filterPriority: 'all',
      searchText: '',
      sortBy: 'id',
    }),
}));
