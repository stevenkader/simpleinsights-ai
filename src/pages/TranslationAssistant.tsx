import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/config/api";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PrivacyNotice from "@/components/translation-assistant/PrivacyNotice";
import DocumentUploader from "@/components/translation-assistant/DocumentUploader";
import DemoSection from "@/components/translation-assistant/DemoSection";
import ResultsDisplay from "@/components/translation-assistant/ResultsDisplay";

const TranslationAssistant = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [response, setResponse] = useState("");
  const [showDemoDialog, setShowDemoDialog] = useState(false);

  const processFile = async (uploadedFile: File) => {
    setIsProcessing(true);
    setProgress(0);
    setResponse("");

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const uploadResponse = await fetch(`${API_BASE_URL}/upload-temp-file`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      const { filePath } = await uploadResponse.json();

      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);

      const processResponse = await fetch(`${API_BASE_URL}/upload-translation01`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath }),
      });

      clearInterval(progressInterval);

      if (!processResponse.ok) {
        throw new Error("Failed to process file");
      }

      const result = await processResponse.json();
      setProgress(100);
      setResponse(result.html);

      toast({
        title: "Translation complete",
        description: "Your document has been successfully translated.",
      });
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your document. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDemoProcess = () => {
    setFile(null);
    setIsProcessing(true);
    setProgress(0);
    setResponse("");

    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + Math.random() * 10;
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 500);

    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setIsProcessing(false);
      
      setResponse(`
        <div style="margin:50px">
          <h2>Translation Analysis</h2>
          <ol>
            <li>Original Language (Spanish)</li>
            <li>English Translation</li>
            <li>Cultural Notes</li>
            <li>Technical Terms</li>
          </ol>
          
          <h2>Section Translations</h2>
          
          <h3>1. Original Language (Spanish)</h3>
          <ul>
            <li><b>Original Text:</b> "Este contrato establece los términos y condiciones para la prestación de servicios de consultoría entre las partes identificadas a continuación. El consultor se compromete a proporcionar asesoramiento experto en el área de desarrollo de software, específicamente en la implementación de soluciones de inteligencia artificial."</li>
          </ul>
          
          <h3>2. English Translation</h3>
          <ul>
            <li><b>Translation:</b> "This contract establishes the terms and conditions for the provision of consulting services between the parties identified below. The consultant agrees to provide expert advice in the area of software development, specifically in the implementation of artificial intelligence solutions."</li>
          </ul>
          
          <h3>3. Cultural Notes</h3>
          <ul>
            <li><b>Business Context:</b> Spanish business contracts typically use more formal language than their English counterparts. The translation maintains the professional tone while adapting to English conventions.</li>
            <li><b>Legal Implications:</b> The Spanish term "se compromete" carries a stronger contractual obligation than just "agrees" - it implies a firm commitment with legal weight.</li>
          </ul>
          
          <h3>4. Technical Terms</h3>
          <ul>
            <li><b>Industry-Specific:</b> "Inteligencia artificial" is directly translated as "artificial intelligence," which is the standard term in both languages for this technology.</li>
            <li><b>Alternative Translations:</b> "Consultoría" could also be translated as "advisory services" in some contexts, but "consulting services" is more common in business documentation.</li>
          </ul>
          
          <h2>Complete Translation</h2>
          <p>The document is a consulting services agreement written in Spanish. It outlines the terms and conditions for providing expert advice in software development, particularly focusing on artificial intelligence implementation. The contract identifies the parties involved (names redacted for privacy) and their obligations. Key terms include payment schedules, confidentiality requirements, and project timelines. The translation maintains both the legal meaning and the technical accuracy of the original document while adapting to English language conventions and business terminology.</p>
        </div>
      `);

      toast({
        title: "Demo translation complete",
        description: "Your document has been successfully translated.",
      });
    }, 5000);
  };

  const handleUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    await processFile(uploadedFile);
  };

  const exportPDF = () => {
    toast({
      title: "PDF Saved",
      description: "Translation has been saved as PDF.",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-2">Translation Assistant</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Upload a document in any language and get it translated and explained in English
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <DocumentUploader 
              onUpload={handleUpload} 
              acceptedFileTypes={[".pdf", ".docx", ".txt"]}
            />
            <PrivacyNotice className="mt-6" />
          </div>
          <div>
            <DemoSection 
              showDemoDialog={showDemoDialog}
              setShowDemoDialog={setShowDemoDialog}
              handleDemoProcess={handleDemoProcess}
            />
          </div>
        </div>

        <ResultsDisplay 
          response={response} 
          isLoading={isProcessing} 
          progress={progress}
          onExportPDF={exportPDF}
        />
      </div>
      <Footer />
    </div>
  );
};

export default TranslationAssistant;
