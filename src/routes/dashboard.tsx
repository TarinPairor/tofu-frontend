// import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createFileRoute } from '@tanstack/react-router';

interface Product {
  id: number;
  name: string;
  brand: string;
  sustainabilityScore: number;
  image: string;
  description: string;
}

const placeholderProducts: Product[] = [
  {
    id: 1,
    name: 'Organic Cotton T-Shirt',
    brand: 'EcoWear',
    sustainabilityScore: 8.5,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: 'Made from 100% organic cotton, this t-shirt is both comfortable and sustainable.'
  },
  {
    id: 2,
    name: 'Recycled Denim Jeans',
    brand: 'GreenDenim',
    sustainabilityScore: 9.0,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: 'Crafted from recycled denim, these jeans reduce waste while maintaining style.'
  },
  {
    id: 3,
    name: 'Bamboo Socks',
    brand: 'EcoSocks',
    sustainabilityScore: 7.5,
    image: 'https://images.unsplash.com/photo-1586350977771-0508ecb3e5f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: 'Sustainable bamboo fiber socks that are both comfortable and eco-friendly.'
  },
  {
    id: 4,
    name: 'Hemp Backpack',
    brand: 'NatureGear',
    sustainabilityScore: 8.0,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: 'Durable backpack made from hemp, a highly sustainable material.'
  },
  {
    id: 5,
    name: 'Recycled Polyester Jacket',
    brand: 'EcoOuterwear',
    sustainabilityScore: 7.0,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: 'Waterproof jacket made from recycled polyester, reducing plastic waste.'
  },
  {
    id: 6,
    name: 'Organic Linen Dress',
    brand: 'GreenFashion',
    sustainabilityScore: 9.5,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: 'Elegant dress made from organic linen, perfect for sustainable fashion.'
  }
];

export const Dashboard = () => {
  // const navigate = useNavigate();

  const handleProductClick = (productId: number) => {
    // TODO: Navigate to product detail page
    console.log('Product clicked:', productId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Sustainable Products</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholderProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative h-48">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Badge
                  className="absolute top-2 right-2 bg-green-500 hover:bg-green-600"
                  variant="secondary"
                >
                  {product.sustainabilityScore}/10
                </Badge>
              </div>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.brand}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{product.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Sustainable
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
}); 