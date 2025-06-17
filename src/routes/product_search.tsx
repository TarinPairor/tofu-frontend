import { createFileRoute } from '@tanstack/react-router'
import { Input } from '@/components/ui/input' 
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export const Route = createFileRoute('/product_search')({
  component: ProductSearch,
})

interface StoreRecommendation {
  storeName: string;
  sustainabilityScore: number;
  reasons: string[];
  productPrice: string;
  sustainabilityInitiatives: string[];
}

interface SearchResult {
  productName: string;
  storeRecommendations: StoreRecommendation[];
  sustainabilityTips: string[];
  error?: string;
}

function ProductSearch() {
  const [productQuery, setProductQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);

  const testUrl = 'http://localhost:3001/recommend'; // Update with your actual endpoint

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: productQuery }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Request failed: ${errorMessage}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({ 
        productName: '',
        storeRecommendations: [],
        sustainabilityTips: [],
        error: 'An error occurred while searching for sustainable options.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-bold">Searching for sustainable options...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <h1 className="text-2xl font-bold">Find Sustainable Shopping Options</h1>
      <div className="w-96">
        <Input
          type="text"
          placeholder="Enter product name (e.g., cotton t-shirt)"
          value={productQuery}
          onChange={(e) => setProductQuery(e.target.value)}
          className="mb-4"
        />
        <Button className="w-full" variant="default" onClick={handleSubmit}>
          Search Sustainable Options
        </Button>
      </div>

      {result && !result.error && (
        <div className="w-full max-w-2xl space-y-6">
          <h2 className="text-xl font-bold text-center">{result.productName}</h2>

          {/* Store Recommendations */}
          <div className="space-y-4">
            {result.storeRecommendations.map((store, idx) => (
              <div key={idx} className="p-6 border rounded-lg bg-muted">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{store.storeName}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Sustainability Score:</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-4 rounded ${
                            i < Math.round(store.sustainabilityScore / 2)
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-muted-foreground mb-4">
                  <p className="font-semibold">Price: {store.productPrice}</p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Sustainability Initiatives:</p>
                  <ul className="list-disc pl-5">
                    {store.sustainabilityInitiatives.map((initiative, i) => (
                      <li key={i}>{initiative}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <p className="font-semibold">Why Shop Here:</p>
                  <ul className="list-disc pl-5">
                    {store.reasons.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Sustainability Tips */}
          <div className="p-6 border rounded-lg bg-muted">
            <h3 className="font-semibold mb-2">Sustainable Shopping Tips:</h3>
            <ul className="list-disc pl-5">
              {result.sustainabilityTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {result?.error && (
        <div className="mt-4 p-4 border rounded bg-muted text-muted-foreground w-96">
          <p>{result.error}</p>
        </div>
      )}
    </div>
  );
}