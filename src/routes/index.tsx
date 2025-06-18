import { createFileRoute } from '@tanstack/react-router'
import { Input } from '@/components/ui/input' 
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { URL } from '@/constants/url'
import { DataVerification } from '@/components/DataVerification'
import { BrandCarousel } from '@/components/brand_carousel'
import TextPressure from '@/components/TextPressure'

export const Route = createFileRoute('/')({
  component: Index,
})

type ResultType = {
  product: {
    productName: string;
    // add other product fields if needed
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
    // add other analysis fields if needed
  };
  error?: string;
} | { error: string } | null;

function Index() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  // const [response, setResponse] = useState('');
  const [result, setResult] = useState<ResultType>(null);
  const [showSubScores, setShowSubScores] = useState(false);

  const subScoreDescriptions = {
    sustainabilityScore_materialsAndSourcing: "Measures the sustainability of raw materials and sourcing practices.",
    sustainabilityScore_productionAndManufacturing: "Assesses the environmental impact of production and manufacturing processes.",
    sustainabilityScore_distributionAndLogistics: "Evaluates the carbon footprint and efficiency of distribution and logistics.",
    sustainabilityScore_productUse: "Considers the sustainability of the product during its use phase.",
    sustainabilityScore_endOfLifeManagement: "Looks at how the product is disposed of, recycled, or composted at end of life.",
  };
  // Replace with actual URL that is stored as env variable or configuration
  // const postmanUrl = 'https://1a57c95a-c26f-4017-abc9-c86ac177dd4d.mock.pstmn.io'; // Replace with your actual Postman URL
  // const URL = 'https://tofu-backend-gules.vercel.app'; // Example URL for testing
  // const URL = 'http://localhost:3001';
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Send HTTP POST request to backend
      const postResponse = await fetch(`${URL}/eval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify JSON format
        },
        body: JSON.stringify({ url }), // Send URL as JSON
      });
  
      if (!postResponse.ok) {
        const errorMessage = await postResponse.text(); // Get error message from server
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-6">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 border-solid"></div>
        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Analyzing product...</h1>
        <p className="text-muted-foreground text-center">Please wait while we measure this product's sustainability.<br />This may take a few seconds.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <TextPressure
        text="Enter a product URL below:"
        flex={true}
        alpha={false}
        stroke={false}
        width={true}
        weight={true}
        italic={true}
        textColor="#ffffff"
        strokeColor="#ff0000"
        minFontSize={12}
      />
      {/* <h1 className="text-xl font-bold">Enter a product URL below:</h1> */}
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
      {result && !result.error && 'product' in result && (
      <div className="w-96 flex flex-col items-stretch space-y-4 mt-4">
        {/* Product Name outside the boxes */}
        <h2 className="text-lg font-bold text-center">{result.product.productName}</h2>

        {/* Multiple Sustainability Scores as Bars */}
        <div className="p-4 border rounded bg-muted text-muted-foreground space-y-4">
          {/* Total Sustainability Score */}
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

          {/* Expandable Sub Scores */}
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
                    <div className="flex items-center mb-1 relative group">
                      <span className="font-semibold cursor-help">
                        {label}:
                        {/* Tooltip */}
                        <span className="absolute left-1/2 z-10 mt-2 w-56 -translate-x-1/2 scale-0 rounded bg-gray-900 p-2 text-xs text-white opacity-0 shadow-lg transition-all group-hover:scale-100 group-hover:opacity-100">
                          {subScoreDescriptions[key as SubScoreKey]}
                        </span>
                      </span>
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
          {/* Criticism bullet points */}
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

        {/* Data Verification Component */}
        <DataVerification
          productName={result.product.productName}
          sustainabilityScore={result.analysis.sustainabilityScore}
          criticisms={result.analysis.sustainabilityCriticism}
        />

        {/* Alternatives Title */}
        <div className="mb-2 text-lg font-bold text-center">Alternatives</div>
        {/* Alternatives Boxes */}
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
    )}
      {result && result.error && (
        <div className="mt-4 p-4 border rounded bg-muted text-muted-foreground w-96">
          <p>{result.error}</p>
        </div>
      )}
      <div className="w-full bg-muted/50 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Explore Categories</h2>
        <BrandCarousel />
      </div>
    </div>
  );
}


