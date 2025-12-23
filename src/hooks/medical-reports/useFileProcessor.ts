
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { validatePdfFile } from "@/utils/fileValidation";

export const useFileProcessor = () => {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [fileReference, setFileReference] = useState<string>("");
  const { toast } = useToast();
  const progressIntervalRef = useRef<number | null>(null);

  const resetProgress = () => {
    setProgress(0);
    if (progressIntervalRef.current !== null) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const simulateProgress = () => {
    if (progressIntervalRef.current !== null) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    // Make it obvious to the user immediately that work started
    setProgress(1);
    let i = 1;

    // Time-based simulated progress while the request is in-flight
    const interval = window.setInterval(() => {
      if (i < 60) {
        i += 2;
      } else if (i < 90) {
        i += 1;
      } else if (i < 99) {
        i += 0.5;
      }

      setProgress(Math.min(Math.round(i), 99));

      if (i >= 99) {
        window.clearInterval(interval);
      }
    }, 600);

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
    resetProgress();

    // Start progress immediately so the UI never appears stuck at 0%
    simulateProgress();

    try {
      // Validate file
      const validation = await validatePdfFile(file);
      if (!validation.valid) {
        toast({
          title: "Invalid file",
          description: validation.error,
          variant: "destructive",
        });
        resetProgress();
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

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
      
      if (progressIntervalRef.current !== null) {
        window.clearInterval(progressIntervalRef.current);
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
