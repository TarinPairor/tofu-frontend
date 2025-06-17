import { createFileRoute } from '@tanstack/react-router'
import { Input } from '@/components/ui/input' 
import { Button } from '@/components/ui/button'
import { useState } from 'react'

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
  const [response, setResponse] = useState('');
  const [result, setResult] = useState<ResultType>(null);

  // Replace with actual URL that is stored as env variable or configuration
  const postmanUrl = 'https://1a57c95a-c26f-4017-abc9-c86ac177dd4d.mock.pstmn.io'; // Replace with your actual Postman URL
  const testUrl = 'https://tofu-backend-gules.vercel.app/eval'; // Example URL for testing
  const testUrl2 = 'http://localhost:3001';
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Send HTTP POST request to backend
      const postResponse = await fetch(testUrl, {
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
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
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
      {result && !result.error && 'product' in result && (
      <div className="w-96 flex flex-col items-stretch space-y-4 mt-4">
        {/* Product Name outside the boxes */}
        <h2 className="text-lg font-bold text-center">{result.product.productName}</h2>

        {/* Sustainability Score as a Bar */}
        <div className="p-4 border rounded bg-muted text-muted-foreground">
          {/* Score title and value */}
          <div className="flex items-center mb-2">
            <span className="font-semibold">Sustainability Score:</span>
            <span className="ml-2 font-semibold">{result.analysis.sustainabilityScore}/10</span>
          </div>
          {/* Score bar */}
          <div className="flex items-center w-full space-x-1 mb-4">
            {[...Array(10)].map((_, idx) => (
              <div
                key={idx}
                className={`h-4 flex-1 rounded ${idx < result.analysis.sustainabilityScore ? 'bg-green-500' : 'bg-gray-300'}`}
                title={`Score ${idx + 1}`}
              />
            ))}
          </div>
          {/* Criticism bullet points */}
          <div>
            <span className="font-semibold">Sustainability Criticism:</span>
            <ul className="list-disc pl-5 mt-1">
              {result.analysis.sustainabilityCriticism.map(
                (
                  item: { criticism: string; citation?: string; citation_number?: number },
                  idx: number
                ) => (
                  <li key={idx} className="mb-2">
                    {item.criticism}
                    {item.citation && (
                      <span className="block text-xs text-blue-600 dark:text-blue-300">
                        [<a href={item.citation} target="_blank" rel="noopener noreferrer">
                          Reference
                        </a>]
                      </span>
                    )}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        

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
    </div>
  );
}



