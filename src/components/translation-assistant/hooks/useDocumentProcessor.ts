
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
      
      // Step 1: Upload the file
      console.log(`Uploading file to: ${API_BASE_URL}${API_ENDPOINTS.UPLOAD_FILE}`);
      const uploadResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPLOAD_FILE}`, {
        method: "POST",
        body: formData,
        mode: "cors"
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }
      
      const fileRef = await uploadResponse.text();
      console.log("File reference received:", fileRef);
      
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
      
      // Step 2: Process the document with upload-translate01 endpoint
      const processUrl = `${API_BASE_URL}${API_ENDPOINTS.PROCESS_DOCUMENT}`;
      console.log(`Processing document with: ${processUrl}`);
      
      const processResponse = await fetch(processUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          fileReference: fileRef,
          documentType: "translation"
        }),
      });
      
      if (!processResponse.ok) {
        console.error("Process response not OK:", processResponse.status, processResponse.statusText);
        throw new Error(`Processing failed with status: ${processResponse.status}`);
      }
      
      const resultText = await processResponse.text();
      console.log("Translation result received, length:", resultText.length);
      
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
      console.error("Error processing file:", error);
      resetProgress(setProgress, progressIntervalRef);
      setProgress(100); // Set to 100 to complete the progress bar
      
      toast({
        title: "Processing failed",
        description: "There was an error processing your file. Please try the demo instead.",
        variant: "destructive",
      });
      
      setResponse("Translation service unavailable");
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
