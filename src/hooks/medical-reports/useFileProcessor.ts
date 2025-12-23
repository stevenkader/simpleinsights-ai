
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { validatePdfFile } from "@/utils/fileValidation";
import { supabase } from "@/integrations/supabase/client";

export const useFileProcessor = () => {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [fileReference, setFileReference] = useState<string>("");
  const { toast } = useToast();
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetProgress = () => {
    setProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const simulateProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    setProgress(0);
    let i = 0;
    
    // Slower progress for large context AI processing
    const interval = setInterval(() => {
      if (i < 40) {
        i += 1.5;
      } else if (i < 70) {
        i += 0.8;
      } else if (i < 90) {
        i += 0.4;
      } else if (i < 99) {
        i += 0.2;
      }
      
      setProgress(Math.min(Math.round(i), 99));
      
      if (i >= 99) {
        clearInterval(interval);
      }
    }, 800);
    
    progressIntervalRef.current = interval;
    return interval;
  };

  const handleFileChange = () => {
    setResponse("");
    resetProgress();
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    setResponse("");
    
    try {
      // Validate file
      const validation = await validatePdfFile(file);
      if (!validation.valid) {
        toast({
          title: "Invalid file",
          description: validation.error,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      
      simulateProgress();
      
      console.log("Sending file to Lovable Cloud edge function...");
      
      // Call the Lovable Cloud edge function directly
      const fetchResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-medical-report`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        }
      );
      
      if (!fetchResponse.ok) {
        const errorData = await fetchResponse.json().catch(() => ({ error: "Unknown error" }));
        console.error("Processing failed:", fetchResponse.status, errorData);
        
        if (fetchResponse.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment and try again.");
        }
        if (fetchResponse.status === 402) {
          throw new Error("Service temporarily unavailable. Please try again later.");
        }
        
        throw new Error(errorData.error || `Processing failed (${fetchResponse.status})`);
      }
      
      const data = await fetchResponse.json();
      console.log("Processing complete, response length:", data.html?.length || 0);
      
      if (!data.html) {
        throw new Error("No analysis result received from the server.");
      }
      
      setProgress(100);
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      setTimeout(() => {
        setResponse(data.html);
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error("Error processing file:", error);
      resetProgress();
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Processing failed",
        description: errorMessage,
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
    handleFileChange,
    processFile,
    resetProgress,
    setProgress,
    setResponse,
    setIsLoading
  };
};
