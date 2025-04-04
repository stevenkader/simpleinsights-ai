
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
    <h2>Medical Report Analysis</h2>
    <div class="report-section">
      <h3>Patient Information</h3>
      <ul>
        <li><strong>Name:</strong> John Doe</li>
        <li><strong>Age:</strong> 45 years</li>
        <li><strong>Gender:</strong> Male</li>
        <li><strong>Date of Birth:</strong> January 15, 1978</li>
        <li><strong>Medical Record Number:</strong> MRN12345678</li>
      </ul>
    </div>
    
    <div class="report-section">
      <h3>Clinical Summary</h3>
      <p>Patient presented with complaints of chest pain, shortness of breath, and fatigue lasting for the past 3 weeks. Symptoms worsen with physical exertion and improve with rest. Patient has a history of hypertension and type 2 diabetes mellitus diagnosed 5 years ago.</p>
    </div>
    
    <div class="report-section">
      <h3>Key Findings</h3>
      <ul>
        <li>Blood pressure elevated at 145/95 mmHg</li>
        <li>Electrocardiogram (ECG) shows ST-segment depression in leads V3-V5</li>
        <li>Cardiac enzyme levels: Troponin I slightly elevated at 0.08 ng/mL (reference range: &lt;0.04 ng/mL)</li>
        <li>Lipid panel: Total cholesterol 245 mg/dL, LDL 160 mg/dL, HDL 38 mg/dL, Triglycerides 180 mg/dL</li>
        <li>HbA1c: 7.8% (indicates suboptimal diabetes control)</li>
      </ul>
    </div>
    
    <div class="report-section">
      <h3>Diagnosis</h3>
      <p>Based on the patient's symptoms, medical history, and diagnostic test results, the diagnosis is <strong>Stable Angina</strong> most likely due to underlying coronary artery disease.</p>
    </div>
    
    <div class="report-section">
      <h3>Treatment Plan</h3>
      <ul>
        <li>Medication:
          <ul>
            <li>Aspirin 81mg daily</li>
            <li>Metoprolol 25mg twice daily</li>
            <li>Atorvastatin 40mg at bedtime</li>
            <li>Continue current diabetes and hypertension medications</li>
          </ul>
        </li>
        <li>Lifestyle modifications:
          <ul>
            <li>Low sodium, low fat diet</li>
            <li>Regular moderate exercise program (starting with 20-minute walks daily)</li>
            <li>Smoking cessation</li>
            <li>Weight reduction goal of 15 pounds over 3 months</li>
          </ul>
        </li>
      </ul>
    </div>
    
    <div class="report-section">
      <h3>Follow-up</h3>
      <ul>
        <li>Cardiology consultation within 2 weeks</li>
        <li>Stress echocardiogram scheduled for next week</li>
        <li>Return to clinic in 4 weeks for medication adjustment and progress evaluation</li>
        <li>Emergency department if chest pain becomes severe, prolonged, or unrelieved by rest</li>
      </ul>
    </div>
    
    <div class="report-section">
      <h3>Medical Terminology Explained</h3>
      <ul>
        <li><strong>Angina:</strong> Chest pain caused by reduced blood flow to the heart muscles</li>
        <li><strong>ST-segment depression:</strong> An ECG finding that suggests inadequate blood supply to the heart</li>
        <li><strong>Troponin:</strong> A protein released into the bloodstream when the heart muscle is damaged</li>
        <li><strong>HbA1c:</strong> A blood test that measures average blood sugar levels over the past 2-3 months</li>
      </ul>
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
    
    const progressInterval = simulateProgress();
    progressIntervalRef.current = progressInterval as unknown as number;
    
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
