import { createFileRoute } from '@tanstack/react-router'
import { Input } from '@/components/ui/input' 
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [result, setResult] = useState(null);

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
      {result && !result.error && (
      <div className="w-96 flex flex-col items-stretch space-y-4 mt-4">
        {/* Product Name outside the boxes */}
        <h2 className="text-lg font-bold text-center">{result.product.productName}</h2>

        {/* Sustainability Score as a Bar */}
        <div className="p-4 border rounded bg-muted text-muted-foreground">
          <div className="flex items-center mb-2">
            <span className="font-semibold">Sustainability Score:</span>
            <span className="ml-2">{result.analysis.sustainabilityScore}/10</span>
          </div>
          <div className="flex items-center w-full space-x-1">
            {[...Array(10)].map((_, idx) => (
              <div
                key={idx}
                className={`h-4 flex-1 rounded ${idx < result.analysis.sustainabilityScore ? 'bg-green-500' : 'bg-gray-300'}`}
                title={`Score ${idx + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Sustainability Criticism */}
        <div className="p-4 border rounded bg-muted text-muted-foreground">
          <span className="font-semibold">Sustainability Criticism:</span>
          <ul className="list-disc pl-5">
            {result.analysis.sustainabilityCriticism.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        

        {/* Alternative Products */}
        <div className="p-4 border rounded bg-muted text-muted-foreground">
          <span className="font-semibold">Alternative Products:</span>
          <ul className="list-disc pl-5">
            {result.analysis.alternativeProducts.map(
              (alt: { name: string; reason: string }, idx: number) => (
                <li key={idx}>
                  <span className="font-semibold">{alt.name}:</span> {alt.reason}
                </li>
              )
            )}
          </ul>
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



