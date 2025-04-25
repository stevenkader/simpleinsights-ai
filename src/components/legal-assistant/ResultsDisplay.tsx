
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/utils/pdf-export";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const plainContentRef = useRef<HTMLDivElement>(null);
  const riskContentRef = useRef<HTMLDivElement>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("plain");
  
  const [plainContent, setPlainContent] = useState<string>("");
  const [riskContent, setRiskContent] = useState<string>("");
  
  // Prevent tab switch from causing scroll jumps by implementing a new approach
  const handleTabChange = (value: string) => {
    // Store current scroll position directly
    const scrollY = window.scrollY;
    
    // Change tab
    setCurrentTab(value);
    
    // Use setTimeout with 0ms delay to ensure the scroll restoration happens after DOM updates
    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 0);
  };
  
  useEffect(() => {
    if (response && !isLoading) {
      if (isRiskAnalysis) {
        setRiskContent(response);
        setCurrentTab("risk");
      } else {
        setPlainContent(response);
        setCurrentTab("plain");
      }
      
      if (!plainContent && !riskContent) {
        const timer = setTimeout(() => {
          if (resultSectionRef.current) {
            const yOffset = -240;
            const element = resultSectionRef.current;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            
            window.scrollTo({ 
              top: y, 
              behavior: 'smooth'
            });
          }
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [response, isLoading, isRiskAnalysis, plainContent, riskContent]);

  const handleGeneratePDF = async (type: 'plain' | 'risk') => {
    const contentRef = type === 'plain' ? plainContentRef : riskContentRef;
    const content = type === 'plain' ? plainContent : riskContent;
    
    if (!contentRef.current || !content) return;

    try {
      setIsPdfGenerating(true);
      toast({
        title: "Generating PDF",
        description: "Please wait while your PDF is being created...",
      });
      
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      const randomDigit = Math.floor(Math.random() * 10);
      
      const fileName = type === 'plain' 
        ? `LegalDocReport-Plain-${formattedDate}-${randomDigit}`
        : `LegalDocReport-Risk-${formattedDate}-${randomDigit}`;
      
      const title = type === 'plain' 
        ? "Legal Document Analysis Report"
        : "Legal Risk Analysis Report";
      
      const success = await generatePDF({
        title,
        fileName,
        contentRef,
        content: content
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

  if (isLoading && !plainContent && !riskContent) {
    return (
      <div id="progressSection" className="mb-4">
        <Card className="bg-slate-50 dark:bg-slate-900 mb-4 border-2 border-gray-300 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl">Processing Document</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="w-full h-4" />
            <p className="text-sm text-center mt-2">{progress}% complete</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!plainContent && !riskContent) {
    return null;
  }

  return (
    <div id="resultSection" ref={resultSectionRef} className="animate-fade-in">
      <Card className="bg-slate-50 dark:bg-slate-900 mb-8 border-2 border-gray-300 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={currentTab} 
            onValueChange={handleTabChange} 
            className="w-full"
          >
            <TabsList className="w-full border-2 border-gray-300 dark:border-gray-700 mb-4">
              <TabsTrigger 
                value="plain" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary font-medium"
              >
                Plain English Version
              </TabsTrigger>
              <TabsTrigger 
                value="risk" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary font-medium"
              >
                Risk Analysis
              </TabsTrigger>
            </TabsList>
            
            <div className="mb-4 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => handleGeneratePDF(currentTab as 'plain' | 'risk')}
                disabled={isPdfGenerating || (currentTab === 'plain' && !plainContent) || (currentTab === 'risk' && !riskContent)}
                className="border-2 border-gray-300 dark:border-gray-700"
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
            </div>
            
            {/* Fixed height container for consistent content positioning */}
            <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="relative">
                {/* Plain English Tab Content */}
                <div 
                  className={`p-6 ${currentTab === "plain" ? "block" : "hidden"}`}
                  style={{ minHeight: "500px" }}
                >
                  {plainContent ? (
                    <div 
                      ref={plainContentRef}
                      className="prose prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-slate-100
                        prose-p:text-slate-700 dark:prose-p:text-slate-300
                        prose-p:leading-tight prose-p:my-2
                        prose-li:text-slate-700 dark:prose-li:text-slate-300
                        prose-strong:text-slate-900 dark:prose-strong:text-white
                        prose-ul:my-2 prose-ol:my-2 prose-li:my-1
                        prose-h2:text-xl prose-h3:text-lg prose-h2:mt-4 prose-h3:mt-3
                        max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: plainContent }}
                    />
                  ) : (
                    <p className="text-muted-foreground text-center py-6">
                      No plain text analysis available yet. Upload a document to see results here.
                    </p>
                  )}
                </div>
                
                {/* Risk Analysis Tab Content */}
                <div 
                  className={`p-6 ${currentTab === "risk" ? "block" : "hidden"}`}
                  style={{ minHeight: "500px" }}
                >
                  {riskContent ? (
                    <div 
                      ref={riskContentRef}
                      className="prose prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-slate-100
                        prose-p:text-slate-700 dark:prose-p:text-slate-300
                        prose-p:leading-tight prose-p:my-2
                        prose-li:text-slate-700 dark:prose-li:text-slate-300
                        prose-strong:text-slate-900 dark:prose-strong:text-white
                        prose-ul:my-2 prose-ol:my-2 prose-li:my-1
                        prose-h2:text-xl prose-h3:text-lg prose-h2:mt-4 prose-h3:mt-3
                        max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: riskContent }}
                    />
                  ) : (
                    <p className="text-muted-foreground text-center py-6">
                      No risk analysis available yet. Use the "Analyze Risks" section to generate a risk analysis.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
