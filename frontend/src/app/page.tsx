'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

export default function Home() {
  const [healthStatus, setHealthStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [projects, setProjects] = useState<any[]>([]);

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
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Generate AI-powered test cases with Knowledge Base integration
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={healthStatus === 'connected' ? 'default' : 'destructive'}>
              {healthStatus === 'checking' ? 'Checking...' : 
               healthStatus === 'connected' ? '✓ Backend Connected' : '✗ Backend Disconnected'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

