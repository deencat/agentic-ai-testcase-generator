/**
 * Dashboard Page
 * Main landing page showing overview and project status
 * 
 * Features:
 * - Backend connection status indicator
 * - Quick action cards for main features (Upload, KB, Config)
 * - Projects list with mock/real data
 * - Auto-connects to API on mount
 * 
 * Week 2 Status: ✅ Complete
 * Week 3 TODOs:
 * - Replace "Coming in Week 3" placeholders with actual upload functionality
 * - Add drag-and-drop file upload zone
 * - Add KB document upload zone
 * 
 * @page
 */

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

      {/* Quick Action Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Upload Files Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Upload PDF or Excel files to generate test cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Coming in Week 3
            </Button>
          </CardContent>
        </Card>

        {/* Knowledge Base Card */}
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base</CardTitle>
            <CardDescription>
              Upload documentation for better test case quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Coming in Week 3
            </Button>
          </CardContent>
        </Card>

        {/* Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Configure LLM settings and API keys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Coming in Week 4
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Projects Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              {projects.length === 0 
                ? 'No projects yet. Create your first project to get started.'
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

