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
      // We'll replace this with the real backend call once API details are provided
      setTimeout(() => {
        setResponse(`Analysis of "${file.name}": This is a simulated response from processing your PDF. This will be replaced with actual API responses once integrated with your backend.`);
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
      setResponse("Demo PDF Analysis: This document appears to be a standard rental agreement. Key terms include a 12-month lease period, $1,500 monthly rent, and a security deposit of $2,000. Notable clauses include restrictions on property modifications, pet policies requiring additional deposits, and terms for early termination that may require payment of remaining rent. Recommend reviewing the early termination clause as it may be more restrictive than standard agreements in your jurisdiction.");
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
                <div className="prose dark:prose-invert max-w-none">
                  <p>{response}</p>
                </div>
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
            <DialogTitle>Sample Rental Agreement</DialogTitle>
            <DialogDescription>
              This is an example document used to demonstrate our AI analysis capabilities
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            <iframe 
              src="https://drive.google.com/viewerng/viewer?embedded=true&url=https://www.courts.ca.gov/documents/California-Residential-Lease-Agreement.pdf" 
              className="w-full h-[70vh]"
              title="Demo PDF"
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LegalAssistant;
