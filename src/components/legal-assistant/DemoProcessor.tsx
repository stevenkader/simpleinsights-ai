
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { mockDemoResponse } from "@/components/legal-assistant/mock/mockDemoResponse";

interface DemoProcessorProps {
  setIsLoading: (isLoading: boolean) => void;
  setResponse: (response: string) => void;
  setPartyName: (partyName: string) => void;
  setIsRiskAnalysis: (isRiskAnalysis: boolean) => void;
  simulateProgress: () => NodeJS.Timeout; // Updated to NodeJS.Timeout
  resetProgress: () => void;
}

export const useDemoProcessor = ({
  setIsLoading,
  setResponse,
  setPartyName,
  setIsRiskAnalysis,
  simulateProgress,
  resetProgress
}: DemoProcessorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleDemoProcess = async (demoType: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setIsLoading(true);
    setResponse("");
    setIsRiskAnalysis(demoType === "risk");
    
    if (demoType === "risk") {
      setPartyName("Tenant");
    }
    
    try {
      const progressInterval = simulateProgress();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      clearInterval(progressInterval);
      
      // Get response based on demo type
      const responseHTML = mockDemoResponse(demoType);
      
      setResponse(responseHTML);
      setIsLoading(false);
      setIsProcessing(false);
      
      toast({
        title: "Demo Analysis Complete",
        description: "Sample document has been analyzed for demonstration purposes.",
      });
      
    } catch (error) {
      console.error("Error in demo process:", error);
      resetProgress();
      setIsLoading(false);
      setIsProcessing(false);
      
      toast({
        title: "Demo Error",
        description: "There was an error processing the sample document.",
        variant: "destructive",
      });
    }
  };

  return {
    handleDemoProcess,
    isProcessing
  };
};
