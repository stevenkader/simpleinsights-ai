
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ResultsDisplay from "@/components/medical-reports/ResultsDisplay";
import DocumentUploader from "@/components/document-uploader/DocumentUploader";
import PrivacyNotice from "@/components/legal-assistant/PrivacyNotice";
import DemoSection from "@/components/medical-reports/DemoSection";
import { useFileProcessor } from "@/hooks/medical-reports/useFileProcessor";
import { useEffect, useRef, useState } from "react";
import { demoMedicalReport } from "@/components/medical-reports/data/demoContent";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const MedicalReports = () => {
  const [showDemoDialog, setShowDemoDialog] = useState<boolean>(false);

  // Isolated progress bar demo (no processing)
  const [progressDemoRunning, setProgressDemoRunning] = useState(false);
  const [progressDemoValue, setProgressDemoValue] = useState(0);
  const progressDemoIntervalRef = useRef<number | null>(null);

  const { toast } = useToast();
  const {
    response,
    isLoading,
    progress,
    handleFileChange,
    processFile,
    resetProgress,
    // Now these setter functions are properly imported from the hook
    setProgress,
    setResponse,
    setIsLoading
  } = useFileProcessor();

  const startProgressDemo = () => {
    // Reset + start a simple animated progress so we can verify the UI works.
    if (progressDemoIntervalRef.current) {
      window.clearInterval(progressDemoIntervalRef.current);
      progressDemoIntervalRef.current = null;
    }

    setProgressDemoValue(0);
    setProgressDemoRunning(true);

    const intervalId = window.setInterval(() => {
      setProgressDemoValue((prev) => {
        if (prev >= 100) {
          window.clearInterval(intervalId);
          progressDemoIntervalRef.current = null;
          setProgressDemoRunning(false);
          return 100;
        }
        return Math.min(prev + 5, 100);
      });
    }, 200);

    progressDemoIntervalRef.current = intervalId;
  };

  const stopProgressDemo = () => {
    if (progressDemoIntervalRef.current) {
      window.clearInterval(progressDemoIntervalRef.current);
      progressDemoIntervalRef.current = null;
    }
    setProgressDemoRunning(false);
  };

  const handleDemoProcess = () => {
    setIsLoading(true);
    setResponse("");
    setProgress(0);
    
    toast({
      title: "Using demo file",
      description: "Processing demo-contract-medical001.pdf",
    });
    
    // Simulate progress animation
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      if (currentProgress < 60) {
        currentProgress += 2;
      } else if (currentProgress < 90) {
        currentProgress += 1;
      } else if (currentProgress < 99) {
        currentProgress += 0.5;
      }
      setProgress(Math.min(Math.round(currentProgress), 99));
      
      if (currentProgress >= 99) {
        clearInterval(progressInterval);
      }
    }, 100);
    
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setResponse(demoMedicalReport);
        setIsLoading(false);
      }, 500);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      resetProgress();
      if (progressDemoIntervalRef.current) {
        window.clearInterval(progressDemoIntervalRef.current);
        progressDemoIntervalRef.current = null;
      }
    };
  }, [resetProgress]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Make Sense of Your Medical Reports: Clear, Personalized Explanations at Your Fingertips.
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload any medical document to receive an easy-to-understand summary and personalized insights tailored to your health context—empowering you to take control of your healthcare journey.
            </p>
           </div>

           <section aria-label="Progress bar demo" className="mb-8">
             <Card>
               <CardHeader className="flex flex-row items-center justify-between gap-4">
                 <CardTitle className="text-base">Progress Bar (UI Test)</CardTitle>
                 <div className="flex items-center gap-2">
                   <Button type="button" variant="outline" onClick={startProgressDemo} disabled={progressDemoRunning}>
                     Start
                   </Button>
                   <Button type="button" variant="ghost" onClick={stopProgressDemo} disabled={!progressDemoRunning}>
                     Stop
                   </Button>
                 </div>
               </CardHeader>
               <CardContent>
                 <Progress value={progressDemoValue} />
                 <p className="mt-2 text-sm text-muted-foreground">{progressDemoValue}%</p>
               </CardContent>
             </Card>
           </section>

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
              title="Get Plain English Translation"
              acceptedFileTypes={[".pdf"]}
            />
          </div>
          
          <ResultsDisplay 
            response={response} 
            isLoading={isLoading} 
            progress={progress}
          />
          <PrivacyNotice />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MedicalReports;
