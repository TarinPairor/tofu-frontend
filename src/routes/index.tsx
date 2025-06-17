import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<null | {
    grade: string;
    explanation: string;
  }>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // This would typically call an API to get the sustainability grade
    // For now, we'll just simulate a response
    setResult({
      grade: 'Good',
      explanation: 'This website has good sustainability practices. It uses efficient hosting, optimized images, and minimal JavaScript.'
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-zinc-900 rounded-xl p-8 mx-auto max-w-4xl shadow-2xl">
      {/* Title Section */}
      <div className="mb-12 mt-4">
        <h1 className="text-3xl font-bold text-center p-4 bg-zinc-700 text-white rounded-md">
          Sustainability
        </h1>
      </div>

      {/* URL Input Section */}
      <div className="w-full max-w-xl mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-xl font-medium text-white mb-2">URL here:</h2>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL"
              className="w-full bg-zinc-700/70 text-white border-zinc-600 focus-visible:ring-teal-500"
              required
            />
            <Button 
              type="submit" 
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-8"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>

      {/* Separator */}
      <Separator className="w-full h-0.5 bg-zinc-700 my-6" />

      {/* Results Section */}
      {result && (
        <div className="w-full max-w-xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-medium text-white">Sustainability Grade:</h2>
            <p className="text-3xl font-bold text-teal-400">{result.grade}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-medium text-white">Explanation</h2>
            <p className="text-teal-400">{result.explanation}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-medium text-white text-center">Alternatives:</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-6 rounded-full">
                link1
              </Button>
              <Button className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-6 rounded-full">
                link1
              </Button>
              <Button className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-6 rounded-full">
                link1
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
