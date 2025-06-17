import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import logo from '../components/images/logo.png';  

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
          <div className="flex h-16 items-center justify-between px-4 w-full">
            {/* Left: Button */}
            <Button
              onClick={toggleDarkMode}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
            {/* Center: Text */}
            <p className="flex-1 text-center mx-4 text-muted-foreground">
              We're ready to measure the sustainability of any online brand!
            </p>
            {/* Right: Logo */}
            <img src={logo} alt="Logo" className="h-16 w-16" />
          </div>
        </header>
        <main className="w-full px-0 py-6">
          <Outlet />
        </main>
      </div>
    );
  },
});