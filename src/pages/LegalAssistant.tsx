import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DemoSection from "@/components/legal-assistant/DemoSection";
import DocumentUploader from "@/components/document-uploader/DocumentUploader";
import ResultsDisplay from "@/components/legal-assistant/ResultsDisplay";
import PrivacyNotice from "@/components/legal-assistant/PrivacyNotice";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";

const LegalAssistant = () => {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [showDemoDialog, setShowDemoDialog] = useState<boolean>(false);
  const [fileReference, setFileReference] = useState<string>("");
  const { toast } = useToast();
  const progressIntervalRef = useRef<number | null>(null);
  
  const demoLegalHTML =
    `<h2>Sections</h2><ol>  <li>Parties</li>  <li>Confidential Information</li>  <li>Return of Confidential Information</li>  <li>Ownership</li>  <li>Governing Law</li>  <li>Signature and Date</li></ol><h2>Section Summaries</h2><h3>1. Parties</h3><ul>  <li><b>Legal Summary:</b> This section identifies the parties involved in the agreement, their addresses, and the effective date of the agreement.</li>  <li><b>Layman's Summary:</b> This part tells us who is making this agreement, where they live, and when the agreement starts.</li></ul><h3>2. Confidential Information</h3><ul>  <li><b>Legal Summary:</b> This section outlines the obligations of the Receiving Party to maintain the confidentiality of the information received from the Disclosing Party. It also defines what constitutes confidential information.</li>  <li><b>Layman's Summary:</b> This part explains that the person receiving the information can't share it, copy it, or change it without permission. It also explains what kind of information is considered confidential.</li></ul><h3>3. Return of Confidential Information</h3><ul>  <li><b>Legal Summary:</b> This section stipulates that all confidential information must be returned to the Disclosing Party upon termination of the agreement.</li>  <li><b>Layman's Summary:</b> This part says that when the agreement ends, all the confidential information has to be given back to the person who originally had it.</li></ul><h3>4. Ownership</h3><ul>  <li><b>Legal Summary:</b> This section states that the agreement is not transferable unless both parties provide written consent.</li>  <li><b>Layman's Summary:</b> This part says that the agreement can't be passed on to someone else unless both people involved in the agreement say it's okay in writing.</li></ul><h3>5. Governing Law</h3><ul>  <li><b>Legal Summary:</b> This section specifies the jurisdiction whose laws will govern the agreement.</li>  <li><b>Layman's Summary:</b> This part tells us which place's laws will be used to interpret the agreement.</li></ul><h3>6. Signature and Date</h3><ul>  <li><b>Legal Summary:</b> This section signifies the agreement of the parties to the terms and conditions of the agreement, demonstrated by their signatures.</li>  <li><b>Layman's Summary:</b> This part shows that both people involved agree to everything written in the agreement by signing it.</li></ul><h2>Report</h2><p>This Non-Disclosure Agreement is a contract between two parties, identified by their addresses. The agreement starts on the date specified and involves the exchange of confidential information. The party receiving the information is obligated to keep it secret and can't share, copy, or change it without permission. The agreement also defines what kind of information is considered confidential. When the agreement ends, all the confidential information has to be given back to the person who originally had it. The agreement can't be passed on to someone else unless both people involved in the agreement say it's okay in writing. The laws of a specific place will be used to interpret the agreement. Both people involved agree to everything written in the agreement by signing it.</p>`;

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
      
      const processResponse = await fetch(`${API_BASE_URL}/upload-legal01`, {
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
      
      resetProgress();
      
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
    
    const progressInterval = simulateProgress();
    progressIntervalRef.current = progressInterval as unknown as number;
    
    setTimeout(() => {
      resetProgress();
      setProgress(100);
      setTimeout(() => {
        setResponse(demoLegalHTML);
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
              title="Upload Document for Analysis"
              acceptedFileTypes={[".pdf"]}
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

export default LegalAssistant;
