import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { URL } from '@/constants/url'
import { motion } from 'framer-motion'
import { Search, Leaf, TrendingUp, Sparkles } from 'lucide-react'

interface StoreRecommendation {
  storeName: string
  sustainabilityScore: number
  reasons: string[]
  productPrice: string
  sustainabilityInitiatives: string[]
  productLink: string
}

interface SearchResponse {
  success: boolean
  data: {
    productName: string
    storeRecommendations: StoreRecommendation[]
    sustainabilityTips: string[]
  }
}

export const Route = createFileRoute('/product_search')({
  component: ProductSearch,
})

function ProductSearch() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<SearchResponse | null>(null)

  const handleSearch = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${URL}/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: query }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to fetch recommendations')
    } finally {
      setLoading(false)
    }
  }

  const exampleProducts = [
    { name: 'Organic Cotton T-Shirt', query: 'organic cotton t-shirt' },
    { name: 'Recycled Plastic Water Bottle', query: 'recycled plastic water bottle' },
    { name: 'Bamboo Toothbrush', query: 'bamboo toothbrush' }
  ]

  return (
    <div className="container mx-auto p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4 mb-8"
      >
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Find Sustainable Products
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Discover eco-friendly alternatives and sustainable shopping options for your favorite products
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border-2 border-gray-100 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Search className="h-6 w-6 text-green-600" />
              <div>
                <CardTitle className="text-xl font-semibold text-gray-800">Product Search</CardTitle>
                <CardDescription className="text-gray-600">
                  Find sustainable alternatives for your favorite products
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for a product (e.g., 'organic cotton t-shirt')"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-12 pl-4 pr-12 text-lg border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                />
                <motion.div 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="h-6 w-6" />
                </motion.div>
              </div>

              <motion.div 
                className="flex flex-wrap gap-2 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <span className="font-medium">Try these examples:</span>
                {exampleProducts.map((product, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setQuery(product.query)}
                    className="hover:text-green-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {product.name}
                  </motion.button>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9 }}
              >
                <Button 
                  className="w-full h-12 text-lg font-medium bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg transition-all"
                  onClick={handleSearch}
                  disabled={loading || !query}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </div>
                  ) : (
                    'Find Sustainable Options'
                  )}
                </Button>
              </motion.div>
            </div>
            {error && (
              <motion.p 
                className="text-sm text-red-500 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {loading ? (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      ) : data && (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Leaf className="h-6 w-6 text-green-600" />
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    Recommendations for {data.data.productName}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.data.storeRecommendations.map((store, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{store.storeName}</h3>
                          <Badge 
                            variant="secondary"
                            className={`${
                              store.sustainabilityScore >= 8 ? 'bg-green-100 text-green-800' :
                              store.sustainabilityScore >= 5 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            Score: {store.sustainabilityScore}/10
                          </Badge>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            Why Choose This Store:
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {store.reasons.map((reason, i) => (
                              <li key={i} className="text-sm text-muted-foreground">
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-green-600" />
                            Sustainability Initiatives:
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {store.sustainabilityInitiatives.map((initiative, i) => (
                              <li key={i} className="text-sm text-muted-foreground">
                                {initiative}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            Price Range: {store.productPrice}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(store.productLink, '_blank')}
                            className="hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                          >
                            Visit Store
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Leaf className="h-6 w-6 text-green-600" />
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    Sustainability Tips
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {data.data.sustainabilityTips.map((tip, index) => (
                  <motion.li 
                    key={index} 
                    className="text-muted-foreground"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {tip}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}