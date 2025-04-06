import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PrivacyNotice from "@/components/translation-assistant/PrivacyNotice";
import DocumentUploader from "@/components/document-uploader/DocumentUploader";
import DemoSection from "@/components/translation-assistant/DemoSection";
import ResultsDisplay from "@/components/translation-assistant/ResultsDisplay";

const TranslationAssistant = () => {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [showDemoDialog, setShowDemoDialog] = useState<boolean>(false);
  const [fileReference, setFileReference] = useState<string>("");
  const { toast } = useToast();
  const progressIntervalRef = useRef<number | null>(null);
  
  const demoTranslationContent = `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">Salvador Dalís Hideout, a Hut Turned into a Sensational Palace</h2>
      <p class="text-sm text-gray-500 mb-4">By Clément Ghys</p>
      <p class="text-sm text-gray-500 mb-6">Published on January 27, 2024 at 7:00 PM, modified on January 28, 2024 at 11:31 AM</p>
      <p class="text-sm text-gray-500 mb-6">Reading time: 3 min. Read in English</p>
      <p class="italic mb-6">Article reserved for subscribers</p>
      
      <p class="mb-4">In images, from the fishermans shack bought with his wife Gala, in Portlligat, Catalonia, Salvador Dalí had made an extraordinary dwelling. Today it is a museum that photographer Coco Capitán had the leisure to explore, immersing herself in the thought of the surrealist painter, to whom Quentin Dupieux dedicates a film, in theaters on February 7.</p>
      
      <p class="mb-4">In a Parisian palace, a French journalist interviews Salvador Dalí, her idol. The interview goes badly. The young woman decides to go see him at his home, in Catalonia, to snatch a little more time. She then discovers the daily eccentricity of the master, the Rolls, the same as Elvis, which rolls on the sand, the gastronomic whims, the incomprehensible aphorisms.</p>
      
      <p class="mb-4">In Daaaaaalí!, in theaters on February 7, French director Quentin Dupieux shows less the intimacy of the man born in 1904 and died in 1989 than the mythology of the artist who was, with Andy Warhol and Pablo Picasso, one of the most known of his time. The one whose flights delighted the viewers of talk shows, this tie-wearing character whose mustache defied gravity, the oddball who, in a famous advertisement, said he was "crazy about Lanvin chocolate". It is not about the man who composed canvases of complexity still studied today, the intellectual who dreamed of mixing science, philosophy, and art, nor the one who was a fervent supporter of General Franco regime...</p>
      
      <p class="mb-4">Daaaaaalí!, with Anaïs Demoustier in the role of the journalist, and a myriad of actors (Gilles Lellouche, Jonathan Cohen, Pio Marmaï, Edouard Baer, and Didier Flamand) in that of the painter, was partly shot in Spain, in Catalonia, where the artist lived for decades. The astonishing atmosphere of his hideout in Portlligat, now one of the most visited museums in the country, is recreated on screen.</p>
      
      <p class="mb-4">That is where Coco Capitán, a Spanish photographer based in London, went in the summer of 2023. At the request of the Barcelona publisher Apartamento, she, for several days, early in the morning, before the onslaught of visitors, walked through the different spaces. Her images are gathered in a book, published in November. "What strikes me is the light that bathes the places, the sun envelops everything," she describes. "We understand that he also loved the places for that. The place is ideal for a painter." He himself was proud to be the first Spaniard to see the sun rise, Portlligat being located in the easternmost part of the Iberian Peninsula.</p>
      
      <h3 class="text-xl font-semibold my-4">"A true biological structure"</h3>
      
      <p class="mb-4">This part of Catalonia, the artist frequented well before he was "Daaaaaalí". His father, a notary (as was that of Marcel Duchamp, surrealism owing much to the profession), is a bourgeois from Figueras, a few kilometers away. As a child, he roams these beaches of the Costa Brava. As an adult, he leaves for Madrid, then Paris, without ever forgetting his native region. In France, he meets Elena Ivanovna Diakonova (1894-1982), whom everyone calls Gala. Ten years his senior, she is the wife of the poet Paul Eluard and the mistress of the painter Max Ernst. They fall in love and want to settle in Cadaqués. But the Dalí family refuses for their son to show off with a divorced woman and already a mother.</p>
      
      <p class="mb-4">You have 45% of this article left to read. The rest is reserved for subscribers.</p>
    </div>
  `;

  const resetProgress = () => {
    setProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const simulateProgress = () => {
    resetProgress();
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setProgress(i);
      if (i >= 100) {
        clearInterval(interval);
      }
    }, 600);
    
    progressIntervalRef.current = interval as unknown as number;
    return interval;
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    setResponse("");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const progressInterval = simulateProgress();
      
      // Step 1: Upload the file
      const uploadResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPLOAD_FILE}`, {
        method: "POST",
        body: formData,
        // Add mode: "cors" to explicitly enable CORS
        mode: "cors"
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
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
      
      console.log(`Processing document with: ${API_BASE_URL}${API_ENDPOINTS.PROCESS_DOCUMENT}`);
      
      try {
        // Step 2: Process the document
        const processResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROCESS_DOCUMENT}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Add mode: "cors" to explicitly enable CORS
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
        
        // Improved validation of the response
        if (!resultText || 
            resultText.trim() === "" || 
            resultText.toLowerCase().includes("error") || 
            resultText.toLowerCase().includes("unavailable")) {
          console.error("Invalid response:", resultText);
          throw new Error("Translation service returned an empty or error response");
        }
        
        // Complete the progress simulation
        setProgress(100);
        resetProgress();
        
        // Set response with a slight delay to ensure UI updates properly
        setTimeout(() => {
          setResponse(resultText);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Translation API error:", error);
        resetProgress();
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
      resetProgress();
      
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
    
    const progressInterval = simulateProgress();
    progressIntervalRef.current = progressInterval as unknown as number;
    
    toast({
      title: "Using demo file",
      description: "Processing demo translation document",
    });
    
    setTimeout(() => {
      resetProgress();
      setProgress(100);
      setTimeout(() => {
        setResponse(demoTranslationContent);
        setIsLoading(false);
      }, 500);
    }, 1500);
  };

  const exportPDF = () => {
    toast({
      title: "Export PDF",
      description: "PDF export functionality would be implemented here",
    });
  };

  useEffect(() => {
    return () => {
      resetProgress();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Translation Assistant</h1>
            <p className="text-lg text-muted-foreground">
              Upload a document in any language and get it translated to English
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <DemoSection 
              showDemoDialog={showDemoDialog}
              setShowDemoDialog={setShowDemoDialog}
              handleDemoProcess={handleDemoProcess}
            />
            
            <DocumentUploader 
              isLoading={isLoading}
              onProcessFile={processFile}
              title="Upload Document for Translation"
              acceptedFileTypes={[".pdf"]}
            />
          </div>
          
          <ResultsDisplay 
            response={response} 
            isLoading={isLoading} 
            progress={progress}
            onExportPDF={exportPDF}
          />
          <PrivacyNotice />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TranslationAssistant;
