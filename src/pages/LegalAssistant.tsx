
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
    setProgress,
    simulateProgress
  } = useProcessingControls();

  const { handleDemoProcess } = useDemoProcessor({
    setIsLoading,
    setResponse,
    setPartyName,
    setIsRiskAnalysis,
    simulateProgress,
    resetProgress
  });

  useEffect(() => {
    return () => {
      resetProgress();
    };
  }, [resetProgress]);

  // Wrap processFile to ensure party name is cleared
  const handleProcessFile = (file: File) => {
    setPartyName(""); // Clear party name when processing new document
    setIsRiskAnalysis(false); // Reset risk analysis state
    processFile(file);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Demystify Your Contracts: Understand and Assess Risks Instantly.
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload any contract to receive a plain-English summary and a personalized risk assessment based on your role—empowering you to make informed decisions with confidence.
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
              onProcessFile={handleProcessFile}
              onFileChange={handleFileChange}
              title="Get Plain English Version"
              acceptedFileTypes={[".pdf"]}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="bg-slate-50 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-xl">Document Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground">
                    Upload your document to get started with the analysis.
                  </p>
                </div>
              </CardContent>
            </Card>

            <RiskAnalysisSection
              fileReference={fileReference}
              partyName={partyName}
              setPartyName={setPartyName}
              isRiskAnalysisLoading={isRiskAnalysisLoading}
              onAnalyzeRisks={handleRiskAnalysis}
            />
          </div>
          
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
