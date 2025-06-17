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

  // Replace with actual URL that is stored as env variable or configuration
  const postmanUrl = 'https://1a57c95a-c26f-4017-abc9-c86ac177dd4d.mock.pstmn.io'; // Replace with your actual Postman URL
  const testUrl = 'tofu-backend-gules.vercel.app'; // Example URL for testing
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Send HTTP POST request to backend
      const postResponse = await fetch(postmanUrl, {
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
      setResponse(postData.text); // Update response text
    } catch (error) {
      console.error(error);
      setResponse('An error occurred while processing your request.');
    } finally {
      setLoading(false); // Reset loading state
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
      <h1 className="text-xl font-bold">Please enter a URL below:</h1>
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
      {response && (
        <div className="mt-4 p-4 border rounded bg-muted text-muted-foreground w-96">
          <h2 className="text-lg font-bold">Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  )
}



