
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

interface ProcessingControlsProps {
  onProgress: (progress: number) => void;
  onFileReferenceChange: (fileRef: string) => void;
  onResponseChange: (response: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onPartyNameChange: (name: string) => void;
  onRiskAnalysisChange: (isRiskAnalysis: boolean) => void;
}

export const useProcessingControls = () => {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [fileReference, setFileReference] = useState<string>("");
  const [partyName, setPartyName] = useState<string>("");
  const [isRiskAnalysisLoading, setIsRiskAnalysisLoading] = useState<boolean>(false);
  const [isRiskAnalysis, setIsRiskAnalysis] = useState<boolean>(false);
  const { toast } = useToast();
  const progressIntervalRef = useRef<number | null>(null);

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

  const handleFileChange = () => {
    setResponse("");
    resetProgress();
    setPartyName("");
    setIsRiskAnalysis(false);
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    setResponse("");
    setIsRiskAnalysis(false);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const progressInterval = simulateProgress();
      
      const uploadResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPLOAD_FILE}`, {
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
      
      const processResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LEGAL_ANALYSIS}`, {
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
      setIsLoading(true);
      setResponse(""); // Clear existing results
      setIsRiskAnalysis(true); // Set this to true for risk analysis
      
      const progressInterval = simulateProgress();
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LEGAL_RISK_ANALYSIS}`, {
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
      setProgress(100);
      
      resetProgress();
      
      setTimeout(() => {
        setResponse(resultHtml);
        setIsLoading(false);
        setIsRiskAnalysisLoading(false);
        
        toast({
          title: "Risk Analysis Complete",
          description: "Your legal risk analysis is now available.",
        });
      }, 500);
      
    } catch (error) {
      console.error("Error generating risk analysis:", error);
      resetProgress();
      setIsLoading(false);
      setIsRiskAnalysisLoading(false);
      setIsRiskAnalysis(false);
      
      toast({
        title: "Risk Analysis Failed",
        description: "There was an error analyzing risks for your party. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
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
    // Expose the setter functions that are needed in LegalAssistant.tsx
    setIsLoading,
    setResponse,
    setIsRiskAnalysis
  };
};
