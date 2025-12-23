
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
import { validatePdfFile } from "@/utils/fileValidation";

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
    
    const interval = setInterval(() => {
      if (i < 60) {
        i += 2;
      } else if (i < 90) {
        i += 1;
      } else if (i < 99) {
        i += 0.5;
      }
      
      setProgress(Math.min(Math.round(i), 99));
      
      if (i >= 99) {
        clearInterval(interval);
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
      
      let uploadResponse;
      try {
        uploadResponse = await fetch(`${API_BASE_URL}/upload-temp-file`, {
          method: "POST",
          body: formData
        });
      } catch (networkError) {
        console.error("Network error during upload:", networkError);
        throw new Error("Unable to connect to the server. Please check your internet connection.");
      }
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text().catch(() => "Unknown error");
        console.error("Upload failed:", uploadResponse.status, errorText);
        throw new Error(`Upload failed (${uploadResponse.status}): ${errorText}`);
      }
      
      const fileRef = await uploadResponse.text();
      console.log("File uploaded, reference:", fileRef);
      
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
          description: "The file could not be uploaded to the server.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      setFileReference(fileRef);
      localStorage.setItem("fileReference", fileRef);
      
      let processResponse;
      try {
        processResponse = await fetch(`${API_BASE_URL}/upload-medical01`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileReference: fileRef }),
        });
      } catch (networkError) {
        console.error("Network error during processing:", networkError);
        throw new Error("Lost connection to server during processing.");
      }
      
      if (!processResponse.ok) {
        const errorText = await processResponse.text().catch(() => "Unknown error");
        console.error("Processing failed:", processResponse.status, errorText);
        throw new Error(`Processing failed (${processResponse.status}): ${errorText}`);
      }
      
      const resultHtml = await processResponse.text();
      console.log("Processing complete, response length:", resultHtml.length);
      
      setProgress(100);
      
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
    // Export the setter functions so they can be used in the MedicalReports component
    setProgress,
    setResponse,
    setIsLoading
  };
};
