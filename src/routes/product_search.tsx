import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { URL } from '@/constants/url'

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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Search</CardTitle>
          <CardDescription>
            Search for sustainable product recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Enter a product name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch}
              disabled={loading || !query}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-4">
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
        </div>
      ) : data && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommendations for {data.data.productName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.data.storeRecommendations.map((store, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{store.storeName}</h3>
                        <Badge variant="secondary">
                          Score: {store.sustainabilityScore}/10
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Why Choose This Store:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {store.reasons.map((reason, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Sustainability Initiatives:</h4>
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
                        >
                          Visit Store
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sustainability Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {data.data.sustainabilityTips.map((tip, index) => (
                  <li key={index} className="text-muted-foreground">
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}