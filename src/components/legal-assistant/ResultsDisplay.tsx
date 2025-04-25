
import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/utils/pdf-export";
import ProgressDisplay from "./results/ProgressDisplay";
import { ScrollManager } from "./results/ScrollManager";
import TabContent from "./results/TabContent";
import ExportButton from "./results/ExportButton";

interface ResultsDisplayProps {
  response: string;
  isLoading: boolean;
  progress: number;
  fileReference?: string;
  isRiskAnalysis?: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  response, 
  isLoading, 
  progress,
  isRiskAnalysis = false
}) => {
  const plainContentRef = useRef<HTMLDivElement>(null);
  const riskContentRef = useRef<HTMLDivElement>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [currentTab, setCurrentTab] = useState("plain");
  const [plainContent, setPlainContent] = useState<string>("");
  const [riskContent, setRiskContent] = useState<string>("");
  const { toast } = useToast();
  
  const handleTabChange = (value: string) => {
    const scrollY = window.scrollY;
    setCurrentTab(value);
    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 0);
  };

  React.useEffect(() => {
    if (response && !isLoading) {
      if (isRiskAnalysis) {
        setRiskContent(response);
        setCurrentTab("risk");
      } else {
        setPlainContent(response);
        setCurrentTab("plain");
      }
    }
  }, [response, isLoading, isRiskAnalysis]);

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
        content
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

  if (!plainContent && !riskContent && !isLoading) {
    return null;
  }

  return (
    <>
      <ScrollManager isLoading={isLoading} response={response} />
      
      {isLoading && !plainContent && !riskContent && (
        <ProgressDisplay progress={progress} />
      )}

      {response && (
        <div id="resultSection" className="animate-fade-in">
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
                  <TabsTrigger value="plain" className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary font-medium">
                    Plain English Version
                  </TabsTrigger>
                  <TabsTrigger value="risk" className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary font-medium">
                    Risk Analysis
                  </TabsTrigger>
                </TabsList>
                
                <div className="mb-4 flex justify-end">
                  <ExportButton 
                    isPdfGenerating={isPdfGenerating}
                    onClick={() => handleGeneratePDF(currentTab as 'plain' | 'risk')}
                  />
                </div>
                
                <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="relative">
                    <TabContent
                      content={plainContent}
                      isVisible={currentTab === "plain"}
                      contentRef={plainContentRef}
                      emptyMessage="No plain text analysis available yet. Upload a document to see results here."
                    />
                    
                    <TabContent
                      content={riskContent}
                      isVisible={currentTab === "risk"}
                      contentRef={riskContentRef}
                      emptyMessage="No risk analysis available yet. Use the 'Analyze Risks' section to generate a risk analysis."
                    />
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ResultsDisplay;
