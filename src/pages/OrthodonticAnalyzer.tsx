import { useState, useRef, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ExportButton from "@/components/legal-assistant/results/ExportButton";
import { generatePDF } from "@/utils/pdf-export";

// Generate or retrieve session ID for usage tracking
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('ortho_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('ortho_session_id', sessionId);
  }
  return sessionId;
};

// Log usage event
const logUsageEvent = async (eventType: string, metadata?: any, errorMessage?: string) => {
  try {
    await supabase.from('orthodontic_usage_logs').insert({
      event_type: eventType,
      session_id: getSessionId(),
      metadata: metadata || null,
      error_message: errorMessage || null,
    });
  } catch (error) {
    console.error('Error logging usage:', error);
  }
};

const OrthodonticAnalyzer = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [treatmentPlan, setTreatmentPlan] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const treatmentPlanRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, HEIC, or PDF file",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setTreatmentPlan("");
    
    // Log upload event
    logUsageEvent('upload', { fileType: file.type, fileSize: file.size });
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      toast({
        title: "No image selected",
        description: "Please upload a panoramic X-ray first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setTreatmentPlan("");
    
    // Log analysis start
    logUsageEvent('analysis_start');
    
    // Start progress simulation
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    let i = 0;
    progressIntervalRef.current = setInterval(() => {
      if (i < 60) {
        i += 2;
      } else if (i < 90) {
        i += 1;
      } else if (i < 99) {
        i += 0.5;
      }
      setProgress(Math.min(Math.round(i), 99));
      if (i >= 99 && progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }, 1200);
    
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        const { data, error } = await supabase.functions.invoke('analyze-orthodontic-image', {
          body: { image: base64Image }
        });

        if (error) throw error;

        setProgress(100);
        setTimeout(() => {
          setTreatmentPlan(data.analysis);
          toast({
            title: "Analysis complete",
            description: "Your orthodontic treatment plan is ready",
          });
          setIsAnalyzing(false);
          
          // Log successful analysis
          logUsageEvent('analysis_success');
        }, 500);
      };
      reader.readAsDataURL(imageFile);
    } catch (error) {
      console.error('Error analyzing image:', error);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setProgress(0);
      
      // Log error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logUsageEvent('analysis_error', null, errorMessage);
      
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your image. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!treatmentPlan) {
      toast({
        title: "No treatment plan",
        description: "Please generate a treatment plan first",
        variant: "destructive",
      });
      return;
    }

    setIsPdfGenerating(true);
    try {
      const success = await generatePDF({
        title: "Orthodontic Treatment Plan",
        fileName: "orthodontic-treatment-plan",
        contentRef: treatmentPlanRef,
        content: treatmentPlan,
      });

      if (success) {
        toast({
          title: "PDF Generated",
          description: "Your treatment plan has been downloaded",
        });
      } else {
        throw new Error("PDF generation failed");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Export failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Orthodontic Panorex Analyzer
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload a panoramic X-ray to receive a comprehensive orthodontic evaluation and treatment plan powered by AI.
            </p>
          </div>


          {isAnalyzing && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Analyzing X-Ray</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="w-full h-4" />
                <p className="text-sm text-center mt-2 text-muted-foreground">{progress}% complete</p>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Image Viewer */}
            <Card>
              <CardHeader>
                <CardTitle>Panoramic X-Ray</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedImage ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Upload your panoramic X-ray
                    </p>
                    <label htmlFor="image-upload">
                      <Button variant="default" asChild>
                        <span>Select Image</span>
                      </Button>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept=".jpg,.jpeg,.png,.heic,.pdf"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <p className="text-xs text-muted-foreground mt-4">
                      Supported formats: JPG, PNG, PDF, HEIC
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-video bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden">
                      <img
                        src={selectedImage}
                        alt="Panoramic X-ray"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex gap-2">
                      <label htmlFor="image-upload-replace" className="flex-1">
                        <Button variant="outline" className="w-full" asChild>
                          <span>Replace Image</span>
                        </Button>
                      </label>
                      <input
                        id="image-upload-replace"
                        type="file"
                        accept=".jpg,.jpeg,.png,.heic,.pdf"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="flex-1"
                      >
                        <Scan className="mr-2 h-4 w-4" />
                        {isAnalyzing ? "Analyzing..." : "Generate Treatment Plan"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right: Treatment Plan Output */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Treatment Plan</CardTitle>
                {treatmentPlan && (
                  <ExportButton 
                    isPdfGenerating={isPdfGenerating}
                    onClick={handleGeneratePDF}
                  />
                )}
              </CardHeader>
              <CardContent>
                {!treatmentPlan ? (
                  <div className="text-center text-muted-foreground py-12">
                    <p>Upload an image and click "Generate Treatment Plan" to see the analysis</p>
                  </div>
                ) : (
                  <div 
                    ref={treatmentPlanRef}
                    className="prose prose-headings:font-semibold prose-headings:text-foreground
                    prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:my-3
                    prose-li:text-muted-foreground prose-strong:text-foreground
                    prose-ul:my-3 prose-ol:my-3 prose-li:my-1.5
                    prose-h2:text-2xl prose-h3:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-h3:mt-4 prose-h3:mb-2
                    max-w-none dark:prose-invert overflow-y-auto max-h-[600px]">
                    <div dangerouslySetInnerHTML={{ __html: treatmentPlan }} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Disclaimer:</strong> This AI-powered analysis is for informational purposes only and should not replace professional orthodontic consultation.
              </p>
              <p>
                The analysis is based solely on the radiographic image and may not capture all clinical details. Please consult with a licensed orthodontist for accurate diagnosis and treatment planning.
              </p>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrthodonticAnalyzer;
