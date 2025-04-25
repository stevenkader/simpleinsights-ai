import React, { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/utils/pdf-export";
import ProgressDisplay from "./results/ProgressDisplay";
import { ScrollManager } from "./results/ScrollManager";
import ResultsHeader from "./results/ResultsHeader";
import ResultsTabs from "./results/ResultsTabs";

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
          <div>
            <ResultsHeader 
              isPdfGenerating={isPdfGenerating}
              onGeneratePDF={handleGeneratePDF}
              currentTab={currentTab}
            />
            <div>
              <ResultsTabs
                currentTab={currentTab}
                onTabChange={handleTabChange}
                plainContent={plainContent}
                riskContent={riskContent}
                plainContentRef={plainContentRef}
                riskContentRef={riskContentRef}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResultsDisplay;
