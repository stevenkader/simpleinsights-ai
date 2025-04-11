
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DemoSection from "@/components/legal-assistant/DemoSection";
import DocumentUploader from "@/components/document-uploader/DocumentUploader";
import ResultsDisplay from "@/components/legal-assistant/ResultsDisplay";
import PrivacyNotice from "@/components/legal-assistant/PrivacyNotice";
import RiskAnalysisSection from "@/components/legal-assistant/RiskAnalysisSection";
import { useProcessingControls } from "@/components/legal-assistant/ProcessingControls";
import { useDemoProcessor } from "@/components/legal-assistant/DemoProcessor";

const LegalAssistant = () => {
  const [showDemoDialog, setShowDemoDialog] = useState<boolean>(false);
  
  const {
    response,
    isLoading,
    progress,
    fileReference,
    partyName,
    isRiskAnalysisLoading,
    isRiskAnalysis,
    setPartyName,
    resetProgress,
    handleFileChange,
    processFile,
    handleRiskAnalysis,
    setIsLoading,
    setResponse,
    setIsRiskAnalysis,
    setProgress // Make sure we have this available for the progress simulation
  } = useProcessingControls();

  const { handleDemoProcess } = useDemoProcessor({
    setIsLoading,
    setResponse,
    setPartyName,
    setIsRiskAnalysis,
    simulateProgress: () => {
      resetProgress();
      let i = 0;
      const interval = setInterval(() => {
        if (i < 60) {
          i += 2; // Faster at start
        } else if (i < 90) {
          i += 1; // Medium in the middle
        } else if (i < 99) {
          i += 0.5; // Slower at end
        }
        
        setProgress(Math.min(Math.round(i), 99)); // Cap at 99% until complete
        
        if (i >= 99) {
          clearInterval(interval);
        }
      }, 600);
      
      return interval;
    },
    resetProgress
  });

  useEffect(() => {
    return () => {
      resetProgress();
    };
  }, [resetProgress]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Legal Document Assistant</h1>
            <p className="text-lg text-muted-foreground">
              Upload your legal documents for instant AI-powered analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <DemoSection 
              showDemoDialog={showDemoDialog}
              setShowDemoDialog={setShowDemoDialog}
              handleDemoProcess={handleDemoProcess}
            />
            
            <DocumentUploader 
              isLoading={isLoading}
              onProcessFile={processFile}
              onFileChange={handleFileChange}
              title="Upload Document for Analysis"
              acceptedFileTypes={[".pdf"]}
            />
          </div>
          
          {fileReference && !isLoading && (
            <RiskAnalysisSection
              fileReference={fileReference}
              partyName={partyName}
              setPartyName={setPartyName}
              isRiskAnalysisLoading={isRiskAnalysisLoading}
              onAnalyzeRisks={handleRiskAnalysis}
            />
          )}
          
          <ResultsDisplay 
            response={response} 
            isLoading={isLoading} 
            progress={progress}
            isRiskAnalysis={isRiskAnalysis}
          />
          <PrivacyNotice />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalAssistant;
