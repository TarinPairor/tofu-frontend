import { createFileRoute } from '@tanstack/react-router'
import { Input } from '@/components/ui/input' 
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { URL } from '@/constants/url'
import { DataVerification } from '@/components/DataVerification'
import { BrandCarousel } from '@/components/brand_carousel'

export const Route = createFileRoute('/')({
  component: Index,
})

type ResultType = {
  product: {
    productName: string;
  };
  analysis: {
    sustainabilityScore: number;
    sustainabilityCriticism: Array<{
      criticism: string;
      citation?: string;
      citation_number?: number;
    }>;
    alternativeProducts: Array<{
      name: string;
      reason: string;
      product_link: string;
      citation?: string;
      citation_number?: number;
    }>;
  };
  error?: string;
} | { error: string } | null;

function Index() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType>(null);
  const [showSubScores, setShowSubScores] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const postResponse = await fetch(`${URL}/eval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
  
      if (!postResponse.ok) {
        const errorMessage = await postResponse.text();
        throw new Error(`POST request failed: ${errorMessage}`);
      }
  
      const postData = await postResponse.json();
      setResult({
        product: postData.data.product,
        analysis: postData.data.analysis,
      });
    } catch (error) {
      console.error(error);
      setResult({ error: 'An error occurred while processing your request.' });
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => {
    if (result?.error) {
      return (
        <div className="mt-4 p-4 border rounded bg-muted text-muted-foreground w-96">
          <p>{result.error}</p>
        </div>
      );
    }

    if (result && !result.error && 'product' in result) {
      return (
        <div className="w-96 flex flex-col items-stretch space-y-4 mt-4">
          <h2 className="text-lg font-bold text-center">{result.product.productName}</h2>

          <div className="p-4 border rounded bg-muted text-muted-foreground space-y-4">
            {"sustainabilityScore" in result.analysis && (
              <div className="mb-4">
                <div className="flex items-center mb-1">
                  <span className="font-semibold text-lg">Total Sustainability Score:</span>
                  <span className="ml-2 font-semibold text-lg">{result.analysis.sustainabilityScore}/10</span>
                </div>
                <div className="flex items-center w-full space-x-1 mb-2">
                  {[...Array(10)].map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-4 flex-1 rounded ${idx < Math.round(result.analysis.sustainabilityScore) ? 'bg-blue-500' : 'bg-gray-300'}`}
                      title={`Score ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              className="w-full text-left font-semibold py-2 px-3 rounded bg-accent hover:bg-accent/80 transition mb-2"
              onClick={() => setShowSubScores((prev) => !prev)}
            >
              {showSubScores ? 'Hide Sub-Scores ▲' : 'Show Sub-Scores ▼'}
            </button>
            
            {showSubScores && (
              <div className="space-y-4">
                {([
                  { label: "Materials & Sourcing", key: "sustainabilityScore_materialsAndSourcing" },
                  { label: "Production & Manufacturing", key: "sustainabilityScore_productionAndManufacturing" },
                  { label: "Distribution & Logistics", key: "sustainabilityScore_distributionAndLogistics" },
                  { label: "Product Use", key: "sustainabilityScore_productUse" },
                  { label: "End-of-Life Management", key: "sustainabilityScore_endOfLifeManagement" },
                ] as const).map(({ label, key }) => {
                  type SubScoreKey =
                    | "sustainabilityScore_materialsAndSourcing"
                    | "sustainabilityScore_productionAndManufacturing"
                    | "sustainabilityScore_distributionAndLogistics"
                    | "sustainabilityScore_productUse"
                    | "sustainabilityScore_endOfLifeManagement";
                  const analysis = result.analysis as typeof result.analysis & Partial<Record<SubScoreKey, number>>;
                  return analysis[key as SubScoreKey] !== undefined && (
                    <div key={key}>
                      <div className="flex items-center mb-1">
                        <span className="font-semibold">{label}:</span>
                        <span className="ml-2 font-semibold">{analysis[key as SubScoreKey]}/10</span>
                      </div>
                      <div className="flex items-center w-full space-x-1 mb-2">
                        {[...Array(10)].map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-4 flex-1 rounded ${idx < (analysis[key as SubScoreKey] ?? 0) ? 'bg-green-500' : 'bg-gray-300'}`}
                            title={`Score ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div>
              <span className="font-semibold">Sustainability Criticism:</span>
              <ul className="list-disc pl-5 mt-1">
                {result.analysis.sustainabilityCriticism.map(
                  (
                    item: { criticism: string; citation?: string; citation_number?: number },
                    idx: number
                  ) => {
                    const isValidCitation =
                      typeof item.citation === 'string' &&
                      (item.citation.startsWith('http://') || item.citation.startsWith('https://'));
                    return (
                      <li key={idx} className="mb-2">
                        {item.criticism}
                        {isValidCitation && (
                          <span className="block text-xs text-blue-600 dark:text-blue-300">
                            [<a href={item.citation} target="_blank" rel="noopener noreferrer">
                              Reference
                            </a>]
                          </span>
                        )}
                      </li>
                    );
                  }
                )}
              </ul>
            </div>
          </div>

          <DataVerification
            productName={result.product.productName}
            sustainabilityScore={result.analysis.sustainabilityScore}
            criticisms={result.analysis.sustainabilityCriticism}
          />

          <div className="mb-2 text-lg font-bold text-center">Alternatives</div>
          <div className="flex flex-row justify-center space-x-4">
            {result.analysis.alternativeProducts.map(
              (
                alt: {
                  name: string;
                  reason: string;
                  product_link: string;
                  citation?: string;
                  citation_number?: number;
                },
                idx: number
              ) => (
                <a
                  key={idx}
                  href={alt.product_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-4 border rounded bg-muted text-muted-foreground min-w-[180px] max-w-xs transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  <div className="font-bold mb-2">{alt.name}</div>
                  <div className="text-sm mb-2">{alt.reason}</div>
                </a>
              )
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-8">
        {loading ? (
          <h1 className="text-4xl font-bold">Loading...</h1>
        ) : (
          <>
            <h1 className="text-xl font-bold">Enter a product URL below:</h1>
            <Input
              type="text"
              placeholder="https://example.com"
              className="w-96"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button className="w-96" variant="default" onClick={handleSubmit}>
              Submit
            </Button>
            {renderResults()}
          </>
        )}
      </div>
      <div className="w-full bg-muted/50 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Explore Categories</h2>
        <BrandCarousel />
      </div>
    </div>
  );
}



