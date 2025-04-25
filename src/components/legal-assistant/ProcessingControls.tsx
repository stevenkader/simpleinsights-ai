import { useCallback } from "react";
import { useFileProcessor } from "@/hooks/legal-assistant/useFileProcessor";
import { useRiskAnalysis, RiskAnalysisProps } from "@/hooks/legal-assistant/useRiskAnalysis";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

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
