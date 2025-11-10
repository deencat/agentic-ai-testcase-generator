import { create } from 'zustand';

export interface TestCase {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  steps: string[];
  expectedResults: string[];
  validationTable?: Record<string, any>;
  kbCompliant?: boolean;
  kbReferences?: string[];
}

interface TestCaseState {
  testCases: TestCase[];
  selectedTestCase: TestCase | null;
  filterCategory: string;
  filterPriority: string;
  sortBy: 'id' | 'priority' | 'category';
  setTestCases: (testCases: TestCase[]) => void;
  addTestCase: (testCase: TestCase) => void;
  updateTestCase: (id: string, updates: Partial<TestCase>) => void;
  deleteTestCase: (id: string) => void;
  setSelectedTestCase: (testCase: TestCase | null) => void;
  setFilterCategory: (category: string) => void;
  setFilterPriority: (priority: string) => void;
  setSortBy: (sortBy: 'id' | 'priority' | 'category') => void;
  reset: () => void;
}

export const useTestCaseStore = create<TestCaseState>((set) => ({
  testCases: [],
  selectedTestCase: null,
  filterCategory: 'all',
  filterPriority: 'all',
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
  setSortBy: (sortBy) => set({ sortBy }),
  reset: () =>
    set({
      testCases: [],
      selectedTestCase: null,
      filterCategory: 'all',
      filterPriority: 'all',
      sortBy: 'id',
    }),
}));
