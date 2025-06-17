import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Navbar } from '../components/Navbar';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  
  return (
    <div className="bg-background">
      <Navbar />
      <div className="mt-4 pb-4"> 
        <Outlet />
      </div>
    </div>
  );
}