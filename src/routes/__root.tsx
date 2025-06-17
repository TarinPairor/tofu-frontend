import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export const Route = createRootRoute({
  component: () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
      setIsDarkMode(!isDarkMode);
      document.documentElement.classList.toggle('dark', !isDarkMode);
    };

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between px-4">
            <Button
              onClick={toggleDarkMode}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
        </header>
        <main className="w-full px-0 py-6">
          <Outlet />
        </main>
      </div>
    );
  },
});