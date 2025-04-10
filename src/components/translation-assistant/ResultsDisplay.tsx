
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download, AlertCircle, Loader } from "lucide-react";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";

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
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const { toast } = useToast();
  
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
    if (!contentRef.current || !response) return;

    try {
      setIsPdfGenerating(true);
      toast({
        title: "Generating PDF",
        description: "Please wait while your PDF is being created...",
      });
      
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      const fileName = `TranslationReport-${formattedDate}.pdf`;

      // Create PDF document with A4 format
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Add header
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("Translation Report", margin, margin);
      
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Generated on: ${formattedDate}`, margin, margin + 10);
      
      pdf.setLineWidth(0.5);
      pdf.line(margin, margin + 15, pageWidth - margin, margin + 15);
      
      // Parse and add HTML content as text
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(cleanResponse(response), 'text/html');
      const textContent = htmlDoc.body.textContent || "";
      
      // Process the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cleanResponse(response);
      
      // Extract and process content
      let yPosition = margin + 25;
      const lineHeight = 7;
      
      // Helper to add text with proper formatting
      const addFormattedText = (text: string, fontSize: number, isBold: boolean, indent: number = 0) => {
        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", isBold ? "bold" : "normal");
        
        // Split text to fit width 
        const textLines = pdf.splitTextToSize(text, contentWidth - indent);
        
        // Check if we need a new page
        if (yPosition + (textLines.length * lineHeight) > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        
        // Add text with indentation
        textLines.forEach((line: string) => {
          pdf.text(line, margin + indent, yPosition);
          yPosition += lineHeight;
        });
        
        // Add some space after paragraphs
        yPosition += 3;
      };
      
      // Process headings
      const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading) => {
        const level = parseInt(heading.tagName.substring(1));
        const fontSize = Math.max(24 - (level * 2), 12); // h1=22, h2=20, h3=18, etc.
        addFormattedText(heading.textContent || "", fontSize, true, (level - 1) * 3);
      });
      
      // Process paragraphs
      const paragraphs = tempDiv.querySelectorAll('p');
      paragraphs.forEach((paragraph) => {
        addFormattedText(paragraph.textContent || "", 12, false);
      });
      
      // Process lists
      const lists = tempDiv.querySelectorAll('ul, ol');
      lists.forEach((list) => {
        const isOrdered = list.tagName === 'OL';
        const items = list.querySelectorAll('li');
        items.forEach((item, i) => {
          const prefix = isOrdered ? `${i + 1}. ` : '• ';
          addFormattedText(prefix + item.textContent, 12, false, 5);
        });
      });
      
      // Process any remaining text (for simple text nodes)
      if (headings.length === 0 && paragraphs.length === 0 && lists.length === 0) {
        addFormattedText(textContent, 12, false);
      }
      
      pdf.save(fileName);
      
      toast({
        title: "PDF Generated",
        description: "Your PDF has been successfully created and downloaded.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error creating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPdfGenerating(false);
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
                <Button 
                  variant="outline" 
                  className="ml-auto" 
                  onClick={generatePDF}
                  disabled={isPdfGenerating}
                >
                  {isPdfGenerating ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Save as PDF
                    </>
                  )}
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
