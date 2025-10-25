'use client';

import {useState} from 'react';
import {Header} from '@/components/header';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {generateImage, type GenerateImageOutput} from '@/ai/flows/generate-image-flow';
import {Skeleton} from '@/components/ui/skeleton';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [generationResult, setGenerationResult] = useState<GenerateImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGenerationResult(null);

    try {
      const result = await generateImage({prompt});
      setGenerationResult(result);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold tracking-tight font-headline">AI Image Generation</CardTitle>
              <CardDescription>
                Enter a detailed description of a restaurant scene to generate a realistic image.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A modern, minimalist dining room at Azure Seafood"
                  disabled={isLoading}
                  className="text-base"
                />
                <Button onClick={handleGenerate} disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Generate Image'}
                </Button>
                {error && <p className="text-destructive text-sm text-center">{error}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full aspect-video border rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden">
                {isLoading && <Skeleton className="h-full w-full" />}
                {!isLoading && generationResult?.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={generationResult.imageUrl}
                    alt="AI generated restaurant"
                    className="w-full h-full object-cover"
                  />
                )}
                {!isLoading && !generationResult?.imageUrl && (
                  <p className="text-muted-foreground">Your generated image will appear here</p>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
