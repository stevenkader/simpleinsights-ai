import { useCallback } from "react";
import { useFileProcessor } from "@/hooks/legal-assistant/useFileProcessor";
import { useRiskAnalysis, RiskAnalysisProps } from "@/hooks/legal-assistant/useRiskAnalysis";

export const useProcessingControls = () => {
  const {
    fileReference,
    isLoading,
    progress,
    response,
    setFileReference,
    setIsLoading,
    setProgress,
    setResponse,
    resetProgress,
    simulateProgress,
    processFile
  } = useFileProcessor();

  const {
    partyName,
    isRiskAnalysisLoading,
    isRiskAnalysis,
    setPartyName,
    setIsRiskAnalysis,
    handleRiskAnalysis
  } = useRiskAnalysis({
    fileReference,
    setIsLoading,
    setResponse,
    setProgress,
    resetProgress,
    simulateProgress
  } as RiskAnalysisProps);

  const handleFileChange = useCallback(() => {
    setResponse("");
    resetProgress();
    setPartyName(""); // Clear party name
    setIsRiskAnalysis(false);
  }, [resetProgress, setResponse, setPartyName, setIsRiskAnalysis]);

  const processFile = async (file: File) => {
    setPartyName(""); // Clear party name when processing new document
    setIsRiskAnalysis(false); // Reset risk analysis state
    setIsLoading(true);
    setResponse("");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      // Start progress simulation
      simulateProgress();
      
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
      
      // Set progress to 100% to indicate completion
      setProgress(100);
      
      // Clear the interval now that we've completed
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
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
    // Expose all needed functions
    setIsLoading,
    setResponse,
    setIsRiskAnalysis,
    setProgress,
    simulateProgress
  };
};
