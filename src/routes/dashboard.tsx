// import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react'
import { productApi } from '@/lib/supabase'
import type { TofuProduct } from '@/lib/supabase'
import { cookies } from '@/lib/cookies'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Pencil } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useQuery } from '@tanstack/react-query'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { X, BarChart3 } from 'lucide-react'
import { DashboardTabs } from '../components/dashboard/Tabs'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

export default function Dashboard() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<TofuProduct[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [editingProduct, setEditingProduct] = useState<TofuProduct | null>(null)
  const [editForm, setEditForm] = useState({
    product_name: '',
    sustainability_level: '',
    product_description: '',
  })
  const [showScore, setShowScore] = useState(true)

  const { data: productsData } = useQuery<TofuProduct[]>({
    queryKey: ['products'],
    queryFn: () => productApi.getAllProducts()
  })

  const [averageScore, setAverageScore] = useState<number | null>(null)

  useEffect(() => {
    if (productsData && productsData.length > 0) {
      const scores = productsData
        .map((p: TofuProduct) => parseInt(p.sustainability_level || '0'))
        .filter((score: number) => !isNaN(score))
      
      if (scores.length > 0) {
        const average = scores.reduce((a: number, b: number) => a + b, 0) / scores.length
        const roundedAverage = Math.round(average * 10) / 10
        setAverageScore(roundedAverage)
      }
    }
  }, [productsData])

  // Fetch user's products
  useEffect(() => {
    const fetchProducts = async () => {
      const user = cookies.getUser()
      if (!user) {
        setError('User not logged in')
        setLoadingProducts(false)
        return
      }

      try {
        const userProducts = await productApi.getUserProducts(user.id)
        setProducts(userProducts)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to fetch products')
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [])

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const user = cookies.getUser()
      if (!user) {
        setError('User not logged in')
        return
      }

      // Send request to backend
      const response = await fetch('https://tofu-backend-gules.vercel.app/eval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze product')
      }

      const data = await response.json()

      console.log(data)


    
      // Add product to database
      const newProduct = await productApi.addProduct({
        product_name: data.data.product.productName,
        user_id: user.id,
        sustainability_level: data.data.analysis.sustainabilityScore,
        product_link: url,
        product_image: data.data.product.image,
        product_description: data.data.product.description,
      })

    

      if (newProduct) {
        setProducts(prev => [newProduct, ...prev])
        setUrl('')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to analyze product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = (product: TofuProduct) => {
    setEditingProduct(product)
    setEditForm({
      product_name: product.product_name || '',
      sustainability_level: product.sustainability_level || '',
      product_description: product.product_description || '',
    })
  }

  const handleEditSubmit = async () => {
    if (!editingProduct) return

    try {
      const updatedProduct = await productApi.updateProduct(editingProduct.id, {
        product_name: editForm.product_name,
        sustainability_level: editForm.sustainability_level,
        product_description: editForm.product_description,
      })

      if (updatedProduct) {
        setProducts(prev =>
          prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
        )
        setEditingProduct(null)
      }
    } catch (err) {
      console.error('Error updating product:', err)
      setError('Failed to update product')
    }
  }

  const getScoreMessage = (score: number) => {
    if (score < 5) {
      return {
        title: "🌱 Room for Improvement",
        description: `Your sustainability score is ${score}/10. Consider choosing more eco-friendly products to help protect our planet!`
      }
    } else {
      return {
        title: "🌟 Great Job!",
        description: `Your sustainability score is ${score}/10. Keep up the amazing work in making eco-conscious choices!`
      }
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {showScore && averageScore !== null && (
        <Alert className={`mb-4 ${averageScore < 5 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <div className="flex justify-between items-center">
            <div>
              <AlertTitle>{getScoreMessage(averageScore).title}</AlertTitle>
              <AlertDescription>
                {getScoreMessage(averageScore).description}
              </AlertDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowScore(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      )}

      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              View Progress
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Sustainability Progress</DialogTitle>
            </DialogHeader>
            <DashboardTabs />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Enter a product URL to evaluate its sustainability</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter product URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Product'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
              <CardHeader>
          <CardTitle>Your Products</CardTitle>
          <CardDescription>
            Products you've analyzed for sustainability
          </CardDescription>
              </CardHeader>
              <CardContent>
          {loadingProducts ? (
            // Loading skeleton
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No products analyzed yet. Add your first product above!
            </p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {product.product_image && (
                        <img
                          src={product.product_image}
                          alt={product.product_name || 'Product'}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold">{product.product_name}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {product.product_description}
                        </p>
                        <div className="mt-2">
                          <span className="text-sm font-medium">
                            Sustainability Score: {product.sustainability_level}
                          </span>
                        </div>
                        <a
                          href={product.product_link || undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline mt-1 inline-block"
                        >
                          View Product
                        </a>
                      </div>
                    </div>
              </CardContent>
            </Card>
          ))}
        </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to the product details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="product_name">Product Name</Label>
              <Input
                id="product_name"
                value={editForm.product_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditForm(prev => ({ ...prev, product_name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sustainability_level">Sustainability Score</Label>
              <Input
                id="sustainability_level"
                value={editForm.sustainability_level}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditForm(prev => ({ ...prev, sustainability_level: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product_description">Description</Label>
              <Textarea
                id="product_description"
                value={editForm.product_description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setEditForm(prev => ({ ...prev, product_description: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProduct(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 