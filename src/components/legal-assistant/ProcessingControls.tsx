
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
    resetProgress,
    simulateProgress
  } as RiskAnalysisProps);

  const handleFileChange = () => {
    setResponse("");
    resetProgress();
    setPartyName("");
    setIsRiskAnalysis(false);
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
    setIsRiskAnalysis,
    setProgress
  };
};
