import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/utils/pdf-export";

interface ResultsDisplayProps {
  response: string;
  isLoading: boolean;
  progress: number;
  onExportPDF?: () => void;
  fileReference?: string;
  isRiskAnalysis?: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  response, 
  isLoading, 
  progress,
  fileReference,
  isRiskAnalysis = false
}) => {
  const resultSectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (response && !isLoading && resultSectionRef.current) {
      const timer = setTimeout(() => {
        const yOffset = -240;
        const element = resultSectionRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({ 
          top: y, 
          behavior: 'smooth'
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [response, isLoading]);

  const handleGeneratePDF = async () => {
    if (!contentRef.current || !response) return;

    try {
      setIsPdfGenerating(true);
      toast({
        title: "Generating PDF",
        description: "Please wait while your PDF is being created...",
      });
      
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      // Generate a random 1-digit number to make the filename more unique
      const randomDigit = Math.floor(Math.random() * 10);
      
      // Create different filenames based on whether it's a risk analysis or regular analysis
      const fileName = isRiskAnalysis 
        ? `LegalDocReport-Risk-${formattedDate}-${randomDigit}` 
        : `LegalDocReport-${formattedDate}-${randomDigit}`;
      
      // Create a clean copy of the HTML content without additional DOM elements
      const cleanContent = response;
      
      const success = await generatePDF({
        title: isRiskAnalysis ? "Legal Risk Analysis Report" : "Legal Document Analysis Report",
        fileName,
        contentRef,
        content: cleanContent
      });
      
      if (success) {
        toast({
          title: "PDF Generated",
          description: "Your PDF has been successfully created and downloaded.",
        });
      } else {
        throw new Error("PDF generation failed");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error creating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return (
    <>
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
              <CardTitle className="text-xl">
                {isRiskAnalysis ? "Risk Analysis Results" : "Plain English Version"}
              </CardTitle>
              <Button 
                variant="outline" 
                className="ml-auto" 
                onClick={handleGeneratePDF}
                disabled={isPdfGenerating}
              >
                {isPdfGenerating ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Save as PDF
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div 
                id="output"
                ref={contentRef}
                className="prose prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-slate-100
                  prose-p:text-slate-700 dark:prose-p:text-slate-300
                  prose-p:leading-tight prose-p:my-2
                  prose-li:text-slate-700 dark:prose-li:text-slate-300
                  prose-strong:text-slate-900 dark:prose-strong:text-white
                  prose-ul:my-2 prose-ol:my-2 prose-li:my-1
                  prose-h2:text-xl prose-h3:text-lg prose-h2:mt-4 prose-h3:mt-3
                  max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: response }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ResultsDisplay;
