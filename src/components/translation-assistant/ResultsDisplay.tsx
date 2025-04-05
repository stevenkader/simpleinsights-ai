
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ResultsDisplayProps {
  response: string;
  isLoading: boolean;
  progress: number;
  onExportPDF?: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  response, 
  isLoading, 
  progress,
  onExportPDF
}) => {
  const resultSectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to results when response is available and loading is complete
    if (response && !isLoading && resultSectionRef.current) {
      // Ensure we scroll after the component is fully rendered
      const timer = setTimeout(() => {
        // Add an offset to ensure the header is visible
        const yOffset = -240; // Same value as legal assistant for consistency
        const element = resultSectionRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({ 
          top: y, 
          behavior: 'smooth'
        });
      }, 500); // Use a longer delay to ensure DOM has updated completely
      
      return () => clearTimeout(timer); // Clean up timer on unmount
    }
  }, [response, isLoading]);

  const getDemoContent = () => {
    return `
      <div id="translation-result" class="p-6">
        <h2 class="text-2xl font-bold mb-4">English Translation</h2>
        <p class="mb-3">This contract establishes the terms and conditions for the provision of consulting services between the parties identified below. The consultant agrees to provide expert advice in the area of software development, specifically in the implementation of artificial intelligence solutions.</p>
        <p class="mb-3">The document is a consulting services agreement. It outlines the terms and conditions for providing expert advice in software development, particularly focusing on artificial intelligence implementation. The contract identifies the parties involved (names redacted for privacy) and their obligations. Key terms include payment schedules, confidentiality requirements, and project timelines.</p>
      </div>
    `;
  };

  return (
    <>
      {/* Only render progress section when actually loading */}
      {isLoading && (
        <div id="progressSection" className="mb-4">
          <Card className="bg-slate-50 dark:bg-slate-900 mb-4">
            <CardHeader>
              <CardTitle className="text-xl">Processing Document</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="w-full h-4" />
              <p className="text-sm text-center mt-2">{progress}% complete</p>
            </CardContent>
          </Card>
        </div>
      )}

      {response && (
        <div id="resultSection" ref={resultSectionRef} className="animate-fade-in">
          <Card className="bg-slate-50 dark:bg-slate-900 mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Translation Result</CardTitle>
              {onExportPDF && (
                <Button variant="outline" className="ml-auto" onClick={onExportPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Save as PDF
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-p:text-slate-700 dark:prose-p:text-slate-300
                  prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-slate-100
                  max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: getDemoContent() }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ResultsDisplay;
