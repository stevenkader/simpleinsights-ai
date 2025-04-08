
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download, AlertCircle } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ResultsDisplayProps {
  response: string;
  isLoading: boolean;
  progress: number;
  onExportPDF?: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  response, 
  isLoading, 
  progress,
  onExportPDF
}) => {
  const resultSectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to results when response is available and loading is complete
    if (response && !isLoading && resultSectionRef.current) {
      // Ensure we scroll after the component is fully rendered
      const timer = setTimeout(() => {
        // Add an offset to ensure the header is visible
        const yOffset = -240; // Same value as legal assistant for consistency
        const element = resultSectionRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({ 
          top: y, 
          behavior: 'smooth'
        });
      }, 500); // Use a longer delay to ensure DOM has updated completely
      
      return () => clearTimeout(timer); // Clean up timer on unmount
    }
  }, [response, isLoading]);

  // More refined error detection to avoid false positives
  const hasError = typeof response === 'string' && (
    response.includes('Translation service unavailable') || 
    response.includes('<!DOCTYPE html>') && response.includes('<pre>Error') || 
    response.includes('Error:') ||
    response.trim() === ''
  );

  // Function to remove "Translation of PDF" text from the response
  const cleanResponse = (html: string): string => {
    // Check if the response is a string and not empty
    if (typeof html !== 'string' || html.trim() === '') {
      return html;
    }
    
    // Remove any "Translation of PDF" headings or text
    return html.replace(/<h[1-6][^>]*>Translation of PDF<\/h[1-6]>/gi, '')
               .replace(/<p[^>]*>Translation of PDF<\/p>/gi, '')
               .replace(/Translation of PDF/g, '');
  };

  const generatePDF = async () => {
    if (!contentRef.current) return;

    try {
      // Create the filename with current date
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      const fileName = `TranslationReport-${formattedDate}.pdf`;

      // Create a new jsPDF instance
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Set title
      pdf.setFontSize(18);
      pdf.text("Translation Report", 20, 20);
      
      // Add date
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${formattedDate}`, 20, 30);
      
      // Add horizontal line
      pdf.setLineWidth(0.5);
      pdf.line(20, 35, 190, 35);
      
      // Capture the HTML content using html2canvas
      const canvas = await html2canvas(contentRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      
      // Calculate the width to fit the PDF page
      const imgWidth = 170;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');
      
      // Add the image to PDF
      pdf.addImage(imgData, 'PNG', 20, 40, imgWidth, imgHeight);
      
      // Save the PDF and trigger download automatically
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <>
      {/* Only render progress section when actually loading */}
      {isLoading && (
        <div id="progressSection" className="mb-4">
          <Card className="bg-slate-50 dark:bg-slate-900 mb-4">
            <CardHeader>
              <CardTitle className="text-xl">Processing Document</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="w-full h-4" />
              <p className="text-sm text-center mt-2">{progress}% complete</p>
            </CardContent>
          </Card>
        </div>
      )}

      {response && (
        <div id="resultSection" ref={resultSectionRef} className="animate-fade-in">
          <Card className="bg-slate-50 dark:bg-slate-900 mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Translation Result</CardTitle>
              {!hasError && (
                <Button variant="outline" className="ml-auto" onClick={generatePDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Save as PDF
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {hasError ? (
                <div className="flex items-center text-destructive gap-2 p-4 border border-destructive/20 rounded-md bg-destructive/10">
                  <AlertCircle className="h-5 w-5" />
                  <p>Translation service is currently unavailable. Please try the demo instead.</p>
                </div>
              ) : (
                <div 
                  ref={contentRef}
                  className="prose prose-p:text-slate-700 dark:prose-p:text-slate-300
                    prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-slate-100
                    max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: cleanResponse(response) }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ResultsDisplay;
