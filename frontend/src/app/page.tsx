/**
 * Dashboard Page
 * Main landing page showing overview and project status
 * 
 * Features:
 * - Backend connection status indicator
 * - File upload zone for requirements (PDF, Excel)
 * - Knowledge Base document upload zone
 * - Text input area for manual requirements
 * 
 * Week 2 Status: ✅ Complete - Basic layout
 * Week 3 Status: ✅ Complete - File upload & KB upload
 * Week 4 TODOs:
 * - Add configuration drawer
 * - Connect to backend upload API
 * 
 * @page
 */

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileUploadZone } from '@/components/FileUploadZone';
import { KBUploadZone } from '@/components/KBUploadZone';
import { useGenerationStore } from '@/stores/useGenerationStore';
import { api } from '@/lib/api';

/**
 * Home/Dashboard page component
 * Shows backend status and project overview
 */
export default function Home() {
  // Connection status: checking -> connected/disconnected
  const [healthStatus, setHealthStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  
  // Projects list from backend (or mock data)
  const [projects, setProjects] = useState<any[]>([]);

  // Text input from store
  const { textInput, setTextInput } = useGenerationStore();

  // On mount: check API connection and load projects
  useEffect(() => {
    // Test API connection
    const checkConnection = async () => {
      const result = await api.checkHealth();
      if (result.data) {
        setHealthStatus('connected');
      } else {
        setHealthStatus('disconnected');
      }
    };

    // Fetch projects
    const loadProjects = async () => {
      const result = await api.getProjects();
      if (result.data) {
        setProjects(result.data);
      }
    };

    checkConnection();
    loadProjects();
  }, []);

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Generate AI-powered test cases with Knowledge Base integration
            </p>
          </div>
          
          {/* Backend Connection Status Badge */}
          <div className="flex items-center gap-4">
            <Badge variant={healthStatus === 'connected' ? 'default' : 'destructive'}>
              {healthStatus === 'checking' ? 'Checking...' : 
               healthStatus === 'connected' ? '✓ Backend Connected' : '✗ Backend Disconnected'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Upload Section */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Requirements Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Requirements</CardTitle>
            <CardDescription>
              Upload PDF or Excel files containing requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploadZone />
          </CardContent>
        </Card>

        {/* Knowledge Base Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base</CardTitle>
            <CardDescription>
              Upload documentation to improve test case quality (+40-60%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KBUploadZone />
          </CardContent>
        </Card>
      </div>

      {/* Text Input Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Or Enter Requirements Manually</CardTitle>
          <CardDescription>
            Type or paste your requirements here (alternative to file upload)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-full min-h-[200px] p-4 border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your requirements here...&#10;&#10;Example:&#10;- User login functionality&#10;- Password reset feature&#10;- Profile management"
          />
          {textInput && (
            <p className="text-sm text-muted-foreground mt-2">
              {textInput.length} characters
            </p>
          )}
        </CardContent>
      </Card>

      {/* Configuration & Generate Section */}
      <div className="flex gap-4 mb-8">
        <Button variant="outline" className="flex-1" disabled>
          ⚙️ Configuration (Coming in Week 4)
        </Button>
        <Button className="flex-1 bg-green-600 hover:bg-green-700" disabled>
          🚀 Generate Test Cases (Coming in Week 5-6)
        </Button>
      </div>

      {/* Projects Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              {projects.length === 0 
                ? 'No projects yet. Upload files to create your first project.'
                : `You have ${projects.length} project(s)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Backend API connection: {healthStatus}</p>
                <p className="text-sm mt-2">
                  {healthStatus === 'disconnected' 
                    ? 'Make sure the FastAPI backend is running on http://localhost:8000'
                    : 'Ready to start generating test cases!'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {projects.map((project: any) => (
                  <div key={project.id} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

