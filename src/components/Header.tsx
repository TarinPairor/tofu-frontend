import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { MapPin, Home, Settings, BarChart } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Home className="h-6 w-6" />
            <span className="font-bold">Home</span>
          </Link>
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <MapPin className="h-6 w-6" />
            <span className="font-bold">Accessibility Map</span>
          </Link>
          <Link to="/" className="flex items-center space-x-2">
            <BarChart className="h-6 w-6" />
            <span className="font-bold">Dashboard</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
