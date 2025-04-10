
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";
import { simulateProgress, resetProgress } from "../utils/progressUtils";
import { demoTranslationContent } from "../data/demoContent";

interface UseDocumentProcessorReturn {
  response: string;
  isLoading: boolean;
  progress: number;
  fileReference: string;
  processFile: (file: File) => Promise<void>;
  handleFileChange: () => void;
  handleDemoProcess: () => void;
  exportPDF: () => void;
}

export const useDocumentProcessor = (): UseDocumentProcessorReturn => {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [fileReference, setFileReference] = useState<string>("");
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const handleFileChange = () => {
    setResponse("");
    resetProgress(setProgress, progressIntervalRef);
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    setResponse("");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const progressInterval = simulateProgress(setProgress, progressIntervalRef);
      
      const uploadResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPLOAD_FILE}`, {
        method: "POST",
        body: formData,
        mode: "cors"
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }
      
      const fileRef = await uploadResponse.text();
      
      if (fileRef === "max_tokens") {
        resetProgress(setProgress, progressIntervalRef);
        toast({
          title: "File too large",
          description: "The file is too large to process. Please try a smaller file.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      if (fileRef === "error") {
        resetProgress(setProgress, progressIntervalRef);
        toast({
          title: "Upload failed",
          description: "The file could not be uploaded.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      setFileReference(fileRef);
      
      console.log(`Processing document with: ${API_BASE_URL}${API_ENDPOINTS.PROCESS_DOCUMENT}`);
      
      try {
        const processResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROCESS_DOCUMENT}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify({ 
            fileReference: fileRef,
            documentType: "translation"
          }),
        });
        
        if (!processResponse.ok) {
          console.error("Process response not OK:", processResponse.status);
          throw new Error(`Processing failed with status: ${processResponse.status}`);
        }
        
        const resultText = await processResponse.text();
        
        if (!resultText || 
            resultText.trim() === "" || 
            resultText.toLowerCase().includes("error") || 
            resultText.toLowerCase().includes("unavailable")) {
          console.error("Invalid response:", resultText);
          throw new Error("Translation service returned an empty or error response");
        }
        
        setProgress(100);
        resetProgress(setProgress, progressIntervalRef);
        
        setTimeout(() => {
          setResponse(resultText);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Translation API error:", error);
        resetProgress(setProgress, progressIntervalRef);
        setResponse("Translation service unavailable");
        toast({
          title: "Translation failed",
          description: "There was an error processing your translation. Please try the demo instead.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error("Error processing file:", error);
      resetProgress(setProgress, progressIntervalRef);
      
      setResponse("Translation service unavailable");
      
      toast({
        title: "Processing failed",
        description: "There was an error processing your file. Please try the demo instead.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleDemoProcess = () => {
    setIsLoading(true);
    setResponse("");
    
    simulateProgress(setProgress, progressIntervalRef);
    
    toast({
      title: "Using demo file",
      description: "Processing demo translation document",
    });
    
    // Longer demo process time for better UX
    setTimeout(() => {
      resetProgress(setProgress, progressIntervalRef);
      setProgress(100);
      setTimeout(() => {
        setResponse(demoTranslationContent);
        setIsLoading(false);
      }, 500);
    }, 3000);
  };

  const exportPDF = () => {
    toast({
      title: "Export PDF",
      description: "PDF export functionality would be implemented here",
    });
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      resetProgress(setProgress, progressIntervalRef);
    };
  }, []);

  return {
    response,
    isLoading,
    progress,
    fileReference,
    processFile,
    handleFileChange,
    handleDemoProcess,
    exportPDF
  };
};
