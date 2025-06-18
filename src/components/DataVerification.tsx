import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { PERPLEXITY_API_KEY } from '@/constants/api';
import { useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataVerificationProps {
  productName: string;
  sustainabilityScore: number;
  criticisms: Array<{
    criticism: string;
    citation?: string;
  }>;
}

interface VerificationResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface VerificationResult {
  summary: string;
  analysis: {
    score_verification: {
      conclusion: string;
      evidence: string[];
      citations: Array<{
        source: string;
        url: string;
        relevance: string;
      }>;
    };
    criticisms_verification: Array<{
      criticism: string;
      verified: boolean;
      explanation: string;
      citations: Array<{
        source: string;
        url: string;
        relevance: string;
      }>;
    }>;
  };
  overall_conclusion: {
    summary: string;
    confidence_level: number;
    recommendations: string[];
  };
}

function cleanResponse(content: string): string {
  // Remove any thinking process tags and their content
  let cleaned = content.replace(/<think>[\s\S]*?<\/think>/g, '');
  // Remove any remaining HTML-like tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  // Remove any markdown code block markers
  cleaned = cleaned.replace(/^```json\n?|\n?```$/g, '');
  // Trim whitespace
  cleaned = cleaned.trim();
  return cleaned;
}

async function verifyData(prompt: string): Promise<VerificationResponse> {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar-reasoning-pro',
      messages: [
        {
          role: 'system',
          content: `You are a sustainability verification expert. Your task is to verify sustainability claims using academic sources and authoritative research.
          
IMPORTANT: You must respond with ONLY a valid JSON object. Do not include any other text, thinking process, or explanations outside the JSON structure.

The response must be a JSON object with this exact structure:
{
  "summary": "Brief overview of the verification process",
  "analysis": {
    "score_verification": {
      "conclusion": "Whether the sustainability score is accurate",
      "evidence": ["List of key evidence points"],
      "citations": [{"source": "Source name", "url": "Source URL", "relevance": "How this source supports the conclusion"}]
    },
    "criticisms_verification": [
      {
        "criticism": "The specific criticism being verified",
        "verified": true/false,
        "explanation": "Detailed explanation of verification",
        "citations": [{"source": "Source name", "url": "Source URL", "relevance": "How this source supports the verification"}]
      }
    ]
  },
  "overall_conclusion": {
    "summary": "Overall assessment of the product's sustainability claims",
    "confidence_level": 0-100,
    "recommendations": ["List of recommendations for improvement"]
  }
}

Remember:
1. Respond with ONLY the JSON object
2. Do not include any text before or after the JSON
3. Ensure all fields are present
4. Use proper JSON syntax with double quotes for strings
5. Include at least one citation for each verification`
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error('Failed to verify data');
  }

  return response.json();
}

export function DataVerification({ productName, sustainabilityScore, criticisms }: DataVerificationProps) {
  const [verificationData, setVerificationData] = useState<VerificationResult | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: verify, isPending, error } = useMutation({
    mutationFn: verifyData,
    onSuccess: (data) => {
      try {
        const cleanedContent = cleanResponse(data.choices[0].message.content);
        const parsedContent = JSON.parse(cleanedContent);
        
        if (!parsedContent.summary || !parsedContent.analysis || !parsedContent.overall_conclusion) {
          throw new Error('Invalid verification data structure');
        }
        
        setVerificationData(parsedContent);
      } catch (err) {
        console.error('Failed to parse verification data:', err);
        throw new Error('Invalid verification data format');
      }
    },
  });

  const handleVerify = () => {
    const prompt = `Please verify the following sustainability claims about ${productName}:
      - Sustainability Score: ${sustainabilityScore}/10
      - Criticisms: ${criticisms.map(c => c.criticism).join(', ')}
      
      Please provide academic sources and cross-reference these claims with recent research papers, 
      environmental impact studies, and industry reports. Focus on peer-reviewed sources and 
      authoritative environmental organizations.`;

    verify(prompt);
  };

  return (
    <Card className="p-4 mt-4 w-full">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Data Verification</h3>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleVerify}
              disabled={isPending}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Add Context'
              )}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={!verificationData}
                  className="flex items-center gap-2"
                >
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Verification Details</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[calc(80vh-8rem)]">
                  {verificationData && (
                    <div className="space-y-6 p-4">
                      {/* Summary */}
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">Summary</h4>
                        <p className="text-sm">{verificationData.summary}</p>
                      </div>

                      {/* Score Verification */}
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">Score Verification</h4>
                        <p className="text-sm mb-2">{verificationData.analysis.score_verification.conclusion}</p>
                        <div className="space-y-2">
                          <h5 className="font-medium">Evidence:</h5>
                          <ul className="list-disc pl-5 text-sm">
                            {verificationData.analysis.score_verification.evidence.map((evidence, idx) => (
                              <li key={idx}>{evidence}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-4">
                          <h5 className="font-medium">Sources:</h5>
                          <ul className="space-y-2 text-sm">
                            {verificationData.analysis.score_verification.citations.map((citation, idx) => (
                              <li key={idx}>
                                <a href={citation.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  {citation.source}
                                </a>
                                <p className="text-muted-foreground">{citation.relevance}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Criticisms Verification */}
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">Criticisms Verification</h4>
                        <div className="space-y-4">
                          {verificationData.analysis.criticisms_verification.map((criticism, idx) => (
                            <div key={idx} className="border-b last:border-0 pb-4 last:pb-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h5 className="font-medium">{criticism.criticism}</h5>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  criticism.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {criticism.verified ? 'Verified' : 'Not Verified'}
                                </span>
                              </div>
                              <p className="text-sm mb-2">{criticism.explanation}</p>
                              <div className="space-y-2">
                                <h6 className="font-medium text-sm">Sources:</h6>
                                <ul className="space-y-2 text-sm">
                                  {criticism.citations.map((citation, cidx) => (
                                    <li key={cidx}>
                                      <a href={citation.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {citation.source}
                                      </a>
                                      <p className="text-muted-foreground">{citation.relevance}</p>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Overall Conclusion */}
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">Overall Conclusion</h4>
                        <p className="text-sm mb-4">{verificationData.overall_conclusion.summary}</p>
                        <div className="mb-4">
                          <h5 className="font-medium mb-2">Confidence Level:</h5>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${verificationData.overall_conclusion.confidence_level}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {verificationData.overall_conclusion.confidence_level}% confidence
                          </p>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Recommendations:</h5>
                          <ul className="list-disc pl-5 text-sm">
                            {verificationData.overall_conclusion.recommendations.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error instanceof Error ? error.message : 'Failed to verify data. Please try again.'}
          </div>
        )}

        {/* Quick Summary */}
        {verificationData && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Quick Summary</h4>
            <p className="text-sm">{verificationData.summary}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-medium">Confidence:</span>
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${verificationData.overall_conclusion.confidence_level}%` }}
                ></div>
              </div>
              <span className="text-sm text-muted-foreground">
                {verificationData.overall_conclusion.confidence_level}%
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 