
import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ResultsDisplay from "@/components/medical-reports/ResultsDisplay";
import DocumentUploader from "@/components/legal-assistant/DocumentUploader";
import PrivacyNotice from "@/components/legal-assistant/PrivacyNotice";
import DemoSection from "@/components/medical-reports/DemoSection";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";

const MedicalReports = () => {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [showDemoDialog, setShowDemoDialog] = useState<boolean>(false);
  const [fileReference, setFileReference] = useState<string>("");
  const { toast } = useToast();
  const progressIntervalRef = useRef<number | null>(null);
  
  const demoMedicalHTML = `
    <h2>MRI Report Analysis</h2>
    
    <div class="report-section">
      <h3>Sections</h3>
      <ul>
        <li>Clinical Information</li>
        <li>Technique</li>
        <li>Findings</li>
        <li>Impression</li>
      </ul>
    </div>
    
    <div class="report-section">
      <h3>Section Summaries</h3>
      
      <h4>1. Clinical Information</h4>
      <p><strong>Medical Summary:</strong> The patient has been experiencing pain and swelling in the left medial foot and ankle, as well as plantar metatarsal pain for 5 weeks. There is no known trauma.</p>
      <p><strong>Layman's Summary:</strong> The patient has been having pain and swelling in the inside of the left foot and ankle, and pain in the ball of the foot for 5 weeks. There is no known injury that caused this.</p>
      
      <h4>2. Technique</h4>
      <p><strong>Medical Summary:</strong> The MRI was performed on the left midfoot and forefoot without contrast, using Sagittal T1 and STIR, short axis PD and STIR, long axis PD FS imaging.</p>
      <p><strong>Layman's Summary:</strong> The MRI scan was done on the middle and front part of the left foot without using any dye. Different types of imaging techniques were used to get detailed pictures of the foot.</p>
      
      <h4>3. Findings</h4>
      <p><strong>Medical Summary:</strong> The MRI shows swelling in the bone of the second toe and soft tissue swelling along the bottom of the second toe and joint. There is also a partial tear in the plantar plate of the second toe joint. Other parts of the foot appear normal.</p>
      <p><strong>Layman's Summary:</strong> The MRI shows swelling in the bone of the second toe and soft tissue swelling along the bottom of the second toe and joint. There is also a small tear in the tissue that supports the second toe joint. Other parts of the foot appear normal.</p>
      
      <h4>4. Impression</h4>
      <p><strong>Medical Summary:</strong> The MRI findings suggest a partial tear or sprain in the plantar plate of the second toe joint, along with swelling. There is also swelling within the bone of the second toe, which could be due to a bone bruise or stress-related swelling. Infection seems less likely.</p>
      <p><strong>Layman's Summary:</strong> The MRI suggests a small tear or sprain in the tissue that supports the second toe joint, along with swelling. There is also swelling within the bone of the second toe, which could be due to a bone bruise or stress-related swelling. Infection seems less likely.</p>
    </div>
    
    <div class="report-section">
      <h3>Report</h3>
      <p>The patient has been experiencing pain and swelling in the left foot and ankle, and pain in the ball of the foot for 5 weeks. An MRI scan was performed on the foot, which showed swelling in the bone of the second toe and soft tissue swelling along the bottom of the second toe and joint. There is also a small tear in the tissue that supports the second toe joint. Other parts of the foot appear normal. The swelling within the bone of the second toe could be due to a bone bruise or stress-related swelling. Infection seems less likely.</p>
    </div>
    
    <div class="report-section">
      <h3>Possible Treatments</h3>
      <p>Based on the MRI findings, possible treatments may include rest, ice, compression, and elevation (RICE) to reduce swelling and pain. Physical therapy may also be recommended to strengthen the foot and improve flexibility. In some cases, surgery may be required to repair the tear in the plantar plate. However, the exact treatment will depend on the patient's overall health and the severity of the symptoms.</p>
    </div>
  `;

  const resetProgress = () => {
    setProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const simulateProgress = () => {
    resetProgress();
    let i = 0;
    // Adjust the interval to complete in ~1 minute (60 seconds)
    // 100 increments / 60 seconds = ~1.67 increments per second
    // So we'll do an increment every 600ms
    const interval = setInterval(() => {
      i += 1;
      setProgress(i);
      if (i >= 100) {
        clearInterval(interval);
      }
    }, 600);
    
    progressIntervalRef.current = interval as unknown as number;
    return interval;
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    setResponse("");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const progressInterval = simulateProgress();
      
      const uploadResponse = await fetch(`${API_BASE_URL}/upload-temp-file`, {
        method: "POST",
        body: formData
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`HTTP error! Status: ${uploadResponse.status}`);
      }
      
      const fileRef = await uploadResponse.text();
      
      if (fileRef === "max_tokens") {
        resetProgress();
        toast({
          title: "File too large",
          description: "The file is too large to process. Please try a smaller file.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      if (fileRef === "error") {
        resetProgress();
        toast({
          title: "Upload failed",
          description: "The file could not be uploaded.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      setFileReference(fileRef);
      localStorage.setItem("fileReference", fileRef);
      
      const processResponse = await fetch(`${API_BASE_URL}/upload-medical01`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileReference: fileRef }),
      });
      
      if (!processResponse.ok) {
        throw new Error(`HTTP error! Status: ${processResponse.status}`);
      }
      
      const resultHtml = await processResponse.text();
      setProgress(100);
      
      // Important: Clear the interval when we're done
      resetProgress();
      
      // Set response and turn off loading state with a slight delay
      setTimeout(() => {
        setResponse(resultHtml);
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error("Error processing file:", error);
      resetProgress();
      toast({
        title: "Processing failed",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleDemoProcess = () => {
    setIsLoading(true);
    setResponse("");
    
    // Simulate using the demo-contract-medical001.pdf file
    const progressInterval = simulateProgress();
    progressIntervalRef.current = progressInterval as unknown as number;
    
    // Show a toast notification indicating we're using a demo file
    toast({
      title: "Using demo file",
      description: "Processing demo-contract-medical001.pdf",
    });
    
    setTimeout(() => {
      resetProgress();
      setProgress(100);
      setTimeout(() => {
        setResponse(demoMedicalHTML);
        setIsLoading(false);
      }, 500);
    }, 1500);
  };

  const exportPDF = () => {
    toast({
      title: "Export PDF",
      description: "PDF export functionality would be implemented here",
    });
  };

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      resetProgress();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Medical Report Assistant</h1>
            <p className="text-lg text-muted-foreground">
              Upload your medical reports for comprehensive AI-powered analysis
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
            />
          </div>
          
          <ResultsDisplay 
            response={response} 
            isLoading={isLoading} 
            progress={progress}
            onExportPDF={exportPDF}
          />
          <PrivacyNotice />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MedicalReports;
