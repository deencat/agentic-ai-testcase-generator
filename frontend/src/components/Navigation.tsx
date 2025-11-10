/**
 * Navigation Component
 * Sticky top navigation bar with branding and settings access
 * 
 * Features:
 * - Sticky positioning (remains visible on scroll)
 * - Gradient branding text
 * - Settings button (opens config drawer in Week 4)
 * - Backdrop blur effect
 * - Responsive padding
 * 
 * @component
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

/**
 * Navigation bar component
 * Displays at the top of all pages
 */
export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-8">
        {/* Left side: Logo/Branding */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Test Case Generator
            </h1>
          </Link>
        </div>
        
        {/* Right side: Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
