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
// import { Skeleton } from '@/components/ui/skeleton'
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { X, BarChart3, Trophy, Star, Leaf, Trash2, ShoppingCart, ExternalLink } from 'lucide-react'
import { DashboardTabs } from '../components/dashboard/Tabs'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

export default function Dashboard() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showScore, setShowScore] = useState(true)
  const [, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<TofuProduct[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [productToDelete, setProductToDelete] = useState<TofuProduct | null>(null)
  const [productToEdit, setProductToEdit] = useState<TofuProduct | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const queryClient = useQueryClient()

  const { data: productsData, refetch: refetchProducts, isLoading: isLoadingProducts } = useQuery<TofuProduct[]>({
    queryKey: ['products'],
    queryFn: () => productApi.getAllProducts()
  })

  const deleteMutation = useMutation({
    mutationFn: (productId: number) => productApi.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      refetchProducts()
      setProductToDelete(null)
    },
  })

  const editMutation = useMutation({
    mutationFn: (updatedProduct: Partial<TofuProduct>) => {
      if (!productToEdit) throw new Error('No product selected for editing')
      return productApi.updateProduct(productToEdit.id, updatedProduct)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      refetchProducts()
      setProductToEdit(null)
    },
  })

  const addProductMutation = useMutation({
    mutationFn: async (url: string) => {
      const user = cookies.getUser()
      if (!user) {
        throw new Error('User not logged in')
      }

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
      return productApi.addProduct({
        product_name: data.data.product.productName,
        sustainability_level: data.data.analysis.sustainabilityScore,
        product_link: url,
        product_image: data.data.product.image,
        product_description: data.data.product.description,
        user_id: user.id
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      refetchProducts()
      setUrl('')
      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    
    setIsLoading(true)
    addProductMutation.mutate(url)
  }

  const handleEdit = () => {
    if (!productToEdit) return
    editMutation.mutate({
      product_name: editName,
      product_description: editDescription
    })
  }

  useEffect(() => {
    if (productToEdit) {
      setEditName(productToEdit.product_name || '')
      setEditDescription(productToEdit.product_description || '')
    }
  }, [productToEdit])

  if (isLoadingProducts) {
    return <div>Loading...</div>
  }

  const getScoreMessage = (score: number) => {
    if (score < 5) {
      return {
        title: "🌱 Room for Improvement",
        description: `Your sustainability score is ${score}/10. Consider choosing more eco-friendly products to help protect our planet!`,
        color: "bg-red-50 border-red-200"
      }
    } else if (score < 8) {
      return {
        title: "🌟 Good Progress",
        description: `Your sustainability score is ${score}/10. You're making good choices!`,
        color: "bg-yellow-50 border-yellow-200"
      }
    } else {
      return {
        title: "🏆 Excellent Work",
        description: `Your sustainability score is ${score}/10. You're a sustainability champion!`,
        color: "bg-green-50 border-green-200"
      }
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-500'
    if (score >= 5) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {averageScore !== null && (
        <Card className={getScoreMessage(averageScore).color}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{getScoreMessage(averageScore).title}</h2>
                  <div className="flex gap-1">
                    {averageScore >= 8 && <Trophy className="h-5 w-5 text-yellow-500" />}
                    {averageScore >= 6 && <Star className="h-5 w-5 text-blue-500" />}
                    {averageScore >= 4 && <Leaf className="h-5 w-5 text-green-500" />}
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {getScoreMessage(averageScore).description}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowScore(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
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

      <Card className="border-2 border-gray-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-green-600" />
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800">View Shopping Cart</CardTitle>
              <CardDescription className="text-gray-600">
                Manage your sustainable shopping list
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {products?.map((product) => {
              const score = parseInt(product.sustainability_level || '0')
              return (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium">{product.product_name}</h3>
                    {product.product_description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {product.product_description}
                      </p>
                    )}
                    {product.product_link && (
                      <a 
                        href={product.product_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-700 hover:underline inline-flex items-center gap-1 mt-2"
                      >
                        View Product
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getScoreColor(score)} transition-all duration-500`}
                          style={{ width: `${score * 10}%` }}
                        />
                      </div>
                    </div>
                    <span className="font-medium">{score}/10</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => setProductToEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setProductToDelete(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

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

      <Dialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {productToDelete?.product_name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProductToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => productToDelete && deleteMutation.mutate(productToDelete.id)}
              disabled={deleteMutation.isPending}
            >
            <div className="flex items-center gap-2 text-white"> {deleteMutation.isPending ? 'Deleting...' : 'Delete'}</div>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!productToEdit} onOpenChange={() => setProductToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Product Name
              </label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Product Description
              </label>
              <Input
                id="description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Enter product description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProductToEdit(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={editMutation.isPending}
            >
              {editMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 