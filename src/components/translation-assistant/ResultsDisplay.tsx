
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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

  // Create exactly the HTML structure provided
  const createResultHTML = () => {
    return `
      <section class="col-12 col-lg-8" id="resultSection">
        <div class="section-title">
          <h2>Report Area</h2>
          <button id="button" type="button" class="btn btn-primary click_savepdf">
            Save as PDF
          </button>
        </div>
        <div id="output">${response}</div>
      </section>
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
        <div 
          ref={resultSectionRef} 
          dangerouslySetInnerHTML={{ __html: createResultHTML() }} 
          onClick={(e) => {
            // Handle the Save as PDF button click
            if ((e.target as HTMLElement).classList.contains('click_savepdf') && onExportPDF) {
              e.preventDefault();
              onExportPDF();
            }
          }}
        />
      )}
    </>
  );
};

export default ResultsDisplay;
