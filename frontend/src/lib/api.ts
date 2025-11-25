/**
 * API client utility for communicating with FastAPI backend
 * Base URL should be configured via environment variable
 * In prototyping mode, provides mock data when backend is unavailable
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Generic fetch wrapper with error handling
 * Falls back to mock data in prototyping mode
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.message || `HTTP error ${response.status}`,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    // In prototyping mode, return mock data instead of error
    if (USE_MOCK_DATA) {
      return getMockResponse<T>(endpoint, options?.method);
    }
    return {
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Mock data provider for prototyping mode
 */
function getMockResponse<T>(endpoint: string, method?: string): ApiResponse<T> {
  // Health check
  if (endpoint === '/health') {
    return { data: { status: 'ok', message: 'Mock API running' } as T };
  }

  // Projects list
  if (endpoint === '/projects' && (!method || method === 'GET')) {
    return {
      data: [
        {
          id: '1',
          name: 'CRM System Test Cases',
          description: 'Test cases for CRM user management module',
          created_at: '2025-11-01T10:00:00Z',
          test_case_count: 12,
        },
        {
          id: '2',
          name: 'Case Management Testing',
          description: 'Comprehensive test suite for case workflows',
          created_at: '2025-11-05T14:30:00Z',
          test_case_count: 8,
        },
      ] as T,
    };
  }

  // Create project
  if (endpoint === '/projects' && method === 'POST') {
    return {
      data: {
        id: '3',
        name: 'New Project',
        description: 'Mock created project',
        created_at: new Date().toISOString(),
        test_case_count: 0,
      } as T,
    };
  }

  // Config
  if (endpoint === '/config') {
    return {
      data: {
        llm_provider: 'ollama',
        model_name: 'llama2',
        temperature: 0.7,
        max_tokens: 2048,
      } as T,
    };
  }

  // Test connection
  if (endpoint === '/config/test-connection') {
    return {
      data: { status: 'connected', message: 'Mock LLM connection successful' } as T,
    };
  }

  // Default mock response
  return { data: {} as T };
}

/**
 * Health check endpoint
 */
export async function checkHealth(): Promise<ApiResponse<{ status: string }>> {
  return fetchApi<{ status: string }>('/health');
}

/**
 * Get all projects
 */
export async function getProjects(): Promise<ApiResponse<any[]>> {
  return fetchApi<any[]>('/projects');
}

/**
 * Create a new project
 */
export async function createProject(
  name: string,
  description?: string
): Promise<ApiResponse<any>> {
  return fetchApi<any>('/projects', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });
}

/**
 * Upload files
 */
export async function uploadFiles(
  projectId: string,
  files: File[]
): Promise<ApiResponse<any>> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await fetch(`${API_BASE_URL}/upload?project_id=${projectId}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.message || `HTTP error ${response.status}`,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Get configuration
 */
export async function getConfig(): Promise<ApiResponse<any>> {
  return fetchApi<any>('/config');
}

/**
 * Save configuration
 */
export async function saveConfig(config: any): Promise<ApiResponse<any>> {
  return fetchApi<any>('/config', {
    method: 'POST',
    body: JSON.stringify(config),
  });
}

/**
 * Test LLM connection
 */
export async function testConnection(): Promise<ApiResponse<any>> {
  return fetchApi<any>('/config/test-connection', {
    method: 'POST',
  });
}

/**
 * Update a test case
 */
export async function updateTestCase(
  testCaseId: string,
  updates: Partial<any>
): Promise<ApiResponse<any>> {
  return fetchApi<any>(`/test-cases/${testCaseId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

/**
 * Delete a test case
 */
export async function deleteTestCase(
  testCaseId: string
): Promise<ApiResponse<any>> {
  return fetchApi<any>(`/test-cases/${testCaseId}`, {
    method: 'DELETE',
  });
}

/**
 * Get test cases for a project
 */
export async function getTestCases(
  projectId: string
): Promise<ApiResponse<any[]>> {
  return fetchApi<any[]>(`/projects/${projectId}/test-cases`);
}

/**
 * Export test cases
 * @param exportData - Export configuration and test cases
 * @returns FileResponse for download
 */
export async function exportTestCases(exportData: {
  testCases: any[];
  format: 'excel' | 'markdown';
  includeKBReferences?: boolean;
  includeKBScores?: boolean;
}): Promise<ApiResponse<Blob>> {
  try {
    const response = await fetch(`${API_BASE_URL}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exportData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.message || `HTTP error ${response.status}`,
      };
    }

    const blob = await response.blob();
    return { data: blob };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export const api = {
  checkHealth,
  getProjects,
  createProject,
  uploadFiles,
  getConfig,
  saveConfig,
  testConnection,
  updateTestCase,
  deleteTestCase,
  getTestCases,
  exportTestCases,
};
