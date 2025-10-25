"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
import { analyzeImage } from '@/ai/flows/analyze-image-flow';
import { Skeleton } from './ui/skeleton';

type AnalyzeImageDialogProps = {
  imageUrl: string;
};

export function AnalyzeImageDialog({ imageUrl }: AnalyzeImageDialogProps) {
  const [question, setQuestion] = useState('What dish is this?');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAnalyze = async () => {
    if (!question) {
      setError('Please enter a question.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAnalysis('');

    try {
      const result = await analyzeImage({ imageUrl, question });
      setAnalysis(result.analysis);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
          <Sparkles className="h-4 w-4" />
          <span className="sr-only">Analyze Image</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Analyze Food Image</DialogTitle>
          <DialogDescription>
            Ask the AI anything about this food picture.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="question" className="text-right">
              Question
            </Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="col-span-3"
              disabled={isLoading}
            />
          </div>
          {isLoading && (
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
            </div>
          )}
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          {analysis && (
            <div className="p-4 bg-muted/50 rounded-md border text-sm">
                {analysis}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleAnalyze} disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Ask AI'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
