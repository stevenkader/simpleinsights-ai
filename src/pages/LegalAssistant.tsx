
import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, FileText, ArrowRight, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const LegalAssistant = () => {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [showDemoDialog, setShowDemoDialog] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Demo analysis HTML content
  const demoLegalHTML =
    "<h2>Sections</h2><ol>  <li>Parties</li>  <li>Confidential Information</li>  <li>Return of Confidential Information</li>  <li>Ownership</li>  <li>Governing Law</li>  <li>Signature and Date</li></ol><h2>Section Summaries</h2><h3>1. Parties</h3><ul>  <li><b>Legal Summary:</b> This section identifies the parties involved in the agreement, their addresses, and the effective date of the agreement.</li>  <li><b>Layman's Summary:</b> This part tells us who is making this agreement, where they live, and when the agreement starts.</li></ul><h3>2. Confidential Information</h3><ul>  <li><b>Legal Summary:</b> This section outlines the obligations of the Receiving Party to maintain the confidentiality of the information received from the Disclosing Party. It also defines what constitutes confidential information.</li>  <li><b>Layman's Summary:</b> This part explains that the person receiving the information can't share it, copy it, or change it without permission. It also explains what kind of information is considered confidential.</li></ul><h3>3. Return of Confidential Information</h3><ul>  <li><b>Legal Summary:</b> This section stipulates that all confidential information must be returned to the Disclosing Party upon termination of the agreement.</li>  <li><b>Layman's Summary:</b> This part says that when the agreement ends, all the confidential information has to be given back to the person who originally had it.</li></ul><h3>4. Ownership</h3><ul>  <li><b>Legal Summary:</b> This section states that the agreement is not transferable unless both parties provide written consent.</li>  <li><b>Layman's Summary:</b> This part says that the agreement can't be passed on to someone else unless both people involved in the agreement say it's okay in writing.</li></ul><h3>5. Governing Law</h3><ul>  <li><b>Legal Summary:</b> This section specifies the jurisdiction whose laws will govern the agreement.</li>  <li><b>Layman's Summary:</b> This part tells us which place's laws will be used to interpret the agreement.</li></ul><h3>6. Signature and Date</h3><ul>  <li><b>Legal Summary:</b> This section signifies the agreement of the parties to the terms and conditions of the agreement, demonstrated by their signatures.</li>  <li><b>Layman's Summary:</b> This part shows that both people involved agree to everything written in the agreement by signing it.</li></ul><h2>Report</h2><p>This Non-Disclosure Agreement is a contract between two parties, identified by their addresses. The agreement starts on the date specified and involves the exchange of confidential information. The party receiving the information is obligated to keep it secret and can't share, copy, or change it without permission. The agreement also defines what kind of information is considered confidential. When the agreement ends, all the confidential information has to be given back to the person who originally had it. The agreement can't be passed on to someone else unless both people involved in the agreement say it's okay in writing. The laws of a specific place will be used to interpret the agreement. Both people involved agree to everything written in the agreement by signing it.</p> ";

  const demoTranslateHTML = 
  '<title>Salvador Dalís Hideout, a Hut Turned into a Sensational Palace</title>    <h1>Salvador Dalís Hideout, a Hut Turned into a Sensational Palace</h1>        <p>By Clément Ghys</p>    <p>Published on January 27, 2024 at 7:00 PM, modified on January 28, 2024 at 11:31 AM</p>    <p>Reading time: 3 min. Read in English</p>    <p>Article reserved for subscribers</p>    <p>In images, from the fishermans shack bought with his wife Gala, in Portlligat, Catalonia, Salvador Dalí had made an extraordinary dwelling. Today it is a museum that photographer Coco Capitán had the leisure to explore, immersing herself in the thought of the surrealist painter, to whom Quentin Dupieux dedicates a film, in theaters on February 7.</p>    <p>In a Parisian palace, a French journalist interviews Salvador Dalí, her idol. The interview goes badly. The young woman decides to go see him at his home, in Catalonia, to snatch a little more time. She then discovers the daily eccentricity of the master, the Rolls, the same as Elvis, which rolls on the sand, the gastronomic whims, the incomprehensible aphorisms.</p>    <p>In Daaaaaalí!, in theaters on February 7, French director Quentin Dupieux shows less the intimacy of the man born in 1904 and died in 1989 than the mythology of the artist who was, with Andy Warhol and Pablo Picasso, one of the most known of his time. The one whose flights delighted the viewers of talk shows, this tie-wearing character whose mustache defied gravity, the oddball who, in a famous advertisement, said he was "crazy about Lanvin chocolate". It is not about the man who composed canvases of complexity still studied today, the intellectual who dreamed of mixing science, philosophy, and art, nor the one who was a fervent supporter of General Franco regime...</p>    <p>Daaaaaalí!, with Anaïs Demoustier in the role of the journalist, and a myriad of actors (Gilles Lellouche, Jonathan Cohen, Pio Marmaï, Edouard Baer, and Didier Flamand) in that of the painter, was partly shot in Spain, in Catalonia, where the artist lived for decades. The astonishing atmosphere of his hideout in Portlligat, now one of the most visited museums in the country, is recreated on screen.</p>    <p>That is where Coco Capitán, a Spanish photographer based in London, went in the summer of 2023. At the request of the Barcelona publisher Apartamento, she, for several days, early in the morning, before the onslaught of visitors, walked through the different spaces. Her images are gathered in a book, published in November. "What strikes me is the light that bathes the places, the sun envelops everything," she describes. "We understand that he also loved the places for that. The place is ideal for a painter." He himself was proud to be the first Spaniard to see the sun rise, Portlligat being located in the easternmost part of the Iberian Peninsula.</p>    <p>"A true biological structure"</p>    <p>This part of Catalonia, the artist frequented well before he was "Daaaaaalí". His father, a notary (as was that of Marcel Duchamp, surrealism owing much to the profession), is a bourgeois from Figueras, a few kilometers away. As a child, he roams these beaches of the Costa Brava. As an adult, he leaves for Madrid, then Paris, without ever forgetting his native region. In France, he meets Elena Ivanovna Diakonova (1894-1982), whom everyone calls Gala. Ten years his senior, she is the wife of the poet Paul Eluard and the mistress of the painter Max Ernst. They fall in love and want to settle in Cadaqués. But the Dalí family refuses for their son to show off with a divorced woman and already a mother.</p>    <p>You have 45% of this article left to read. The rest is reserved for subscribers.</p>';

  const processFile = async () => {
    if (!fileInputRef.current?.files?.length) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to process",
        variant: "destructive",
      });
      return;
    }

    const file = fileInputRef.current.files[0];
    
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResponse("");
    
    try {
      // This is a placeholder for the actual file upload API call
      setTimeout(() => {
        setResponse(`Analysis of "${file.name}": ${demoLegalHTML}`);
        setIsLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error processing file:", error);
      setResponse("Sorry, there was an error processing your file. Please try again.");
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  const handleDemoProcess = () => {
    setIsLoading(true);
    setResponse("");
    setTimeout(() => {
      setResponse(demoLegalHTML);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Legal Document Assistant</h1>
            <p className="text-lg text-muted-foreground">
              Upload your legal documents for instant AI-powered analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Try Free Demo</CardTitle>
                <CardDescription>
                  See how our document analysis works with a sample legal document
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => setShowDemoDialog(true)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Eye className="mr-2" />
                  View Demo PDF
                </Button>
                <Button 
                  onClick={handleDemoProcess}
                  className="w-full justify-start"
                >
                  <ArrowRight className="mr-2" />
                  Process Demo Document
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upload Document</CardTitle>
                <CardDescription>
                  Upload your legal document for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <label htmlFor="file-upload" className="text-sm font-medium">
                      Select a PDF file:
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="file-upload"
                        type="file"
                        ref={fileInputRef}
                        accept="application/pdf"
                        className="cursor-pointer"
                        onChange={handleFileChange}
                      />
                    </div>
                    {fileName && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Selected: {fileName}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={processFile}
                      className="flex items-center gap-2"
                      disabled={isLoading || !fileName}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Process Document
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {response && (
            <Card className="bg-slate-50 dark:bg-slate-900 mb-8 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl">Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: response }}
                ></div>
              </CardContent>
            </Card>
          )}

          <Card className="mt-4 bg-amber-50 border border-amber-200">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-800">
                <strong>Privacy Notice:</strong> All uploaded files are permanently removed from our servers within 1 
                hour. By uploading a document, you agree to our terms and conditions. This AI assistant provides general legal information, 
                not legal advice. Always consult with a qualified attorney for advice specific to your situation.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />

      <Dialog open={showDemoDialog} onOpenChange={setShowDemoDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Sample Contract Document</DialogTitle>
            <DialogDescription>
              This is an example document used to demonstrate our AI analysis capabilities
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            <iframe 
              src="/demo-contract.pdf" 
              className="w-full h-[70vh]"
              title="Demo Contract"
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LegalAssistant;
