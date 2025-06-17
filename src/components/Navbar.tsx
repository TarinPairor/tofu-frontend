import { Link } from '@tanstack/react-router';
import { Home, ShoppingBag, User, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import logo from './images/logo.png'; // Adjust the path as necessary
import { useState } from 'react';
import { useMobile } from '@/hooks/use-mobile';

export function Navbar() {
  const isMobile = useMobile();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  return (
    <nav className="w-full bg-background border-b">
      <div className="flex items-center justify-between px-8 h-16">
        <Button
          onClick={toggleDarkMode}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
        <div className="flex h-16 items-center px-4 w-full">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  {!isMobile && <span className="font-semibold">Home</span>}
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/product_search" className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  {!isMobile && <span className="font-semibold">Product Search</span>}
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="ml-auto flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Button>
            </Link>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[200px]">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/dashboard"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>Dashboard</span>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/login"
                            className="block w-full text-left select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <LogOut className="h-4 w-4" />
                              <span>Login</span>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <img src={logo} alt="Logo" className="h-18 w-18" />
          </div>
        </div>
      </div>
    </nav>
  );
} 