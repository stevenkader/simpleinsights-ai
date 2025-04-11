
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/utils/pdf-export";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/config/api";

interface ResultsDisplayProps {
  response: string;
  isLoading: boolean;
  progress: number;
  onExportPDF?: () => void;
  fileReference?: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  response, 
  isLoading, 
  progress,
  onExportPDF,
  fileReference
}) => {
  const resultSectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [partyName, setPartyName] = useState("");
  const [isRiskAnalysisLoading, setIsRiskAnalysisLoading] = useState(false);
  const [riskAnalysis, setRiskAnalysis] = useState<string>("");
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
      
      const success = await generatePDF({
        title: "Legal Document Analysis Report",
        fileName: "LegalDocReport",
        contentRef,
        content: riskAnalysis || response
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

  const handleRiskAnalysis = async () => {
    if (!fileReference || !partyName) {
      toast({
        title: "Missing Information",
        description: "Please specify which party you are before requesting risk analysis.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRiskAnalysisLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/upload-legal-risk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          fileReference, 
          party: partyName 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const resultHtml = await response.text();
      setRiskAnalysis(resultHtml);
      
      toast({
        title: "Risk Analysis Complete",
        description: "Your legal risk analysis is now available.",
      });
    } catch (error) {
      console.error("Error generating risk analysis:", error);
      toast({
        title: "Risk Analysis Failed",
        description: "There was an error analyzing risks for your party. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRiskAnalysisLoading(false);
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
              <CardTitle className="text-xl">Analysis Results</CardTitle>
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
              {!riskAnalysis ? (
                <>
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
                  
                  {fileReference && (
                    <div className="mt-6 border-t pt-4">
                      <h3 className="text-lg font-medium mb-3">Risk Analysis</h3>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex-grow">
                          <Input
                            placeholder="Which party are you? (e.g. Buyer, Seller, Tenant, etc.)"
                            value={partyName}
                            onChange={(e) => setPartyName(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <Button 
                          onClick={handleRiskAnalysis}
                          disabled={isRiskAnalysisLoading || !partyName.trim()}
                          className="whitespace-nowrap"
                        >
                          {isRiskAnalysisLoading ? (
                            <>
                              <Loader className="mr-2 h-4 w-4 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Display Risk Analysis
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div
                  ref={contentRef}
                  className="prose prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-slate-100
                    prose-p:text-slate-700 dark:prose-p:text-slate-300
                    prose-p:leading-tight prose-p:my-2
                    prose-li:text-slate-700 dark:prose-li:text-slate-300
                    prose-strong:text-slate-900 dark:prose-strong:text-white
                    prose-ul:my-2 prose-ol:my-2 prose-li:my-1
                    prose-h2:text-xl prose-h3:text-lg prose-h2:mt-4 prose-h3:mt-3
                    max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: riskAnalysis }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ResultsDisplay;
