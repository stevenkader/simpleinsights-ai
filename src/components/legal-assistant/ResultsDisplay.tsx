
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
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
    if (response && !isLoading && resultSectionRef.current) {
      const timer = setTimeout(() => {
        const yOffset = -240;
        const element = resultSectionRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({ 
          top: y, 
          behavior: 'smooth'
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [response, isLoading]);

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
      const fileName = `LegalDocReport-${formattedDate}.pdf`;

      // Create PDF document with A4 format
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Add header
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("Legal Document Analysis Report", margin, margin);
      
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Generated on: ${formattedDate}`, margin, margin + 10);
      
      pdf.setLineWidth(0.5);
      pdf.line(margin, margin + 15, pageWidth - margin, margin + 15);
      
      // Parse and add HTML content as text
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(response, 'text/html');
      const textContent = htmlDoc.body.textContent || "";
      
      // Process the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = response;
      
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
      const headings = tempDiv.querySelectorAll('h2');
      headings.forEach((heading) => {
        addFormattedText(heading.textContent || "", 16, true);
      });
      
      // Process sections
      const sections = tempDiv.querySelectorAll('ol');
      if (sections.length > 0) {
        const list = sections[0];
        const items = list.querySelectorAll('li');
        items.forEach((item, i) => {
          addFormattedText(`${i + 1}. ${item.textContent}`, 12, false, 5);
        });
      }
      
      // Process section summaries
      const h3Elements = tempDiv.querySelectorAll('h3');
      h3Elements.forEach((h3) => {
        addFormattedText(h3.textContent || "", 14, true, 0);
        
        let nextElement = h3.nextElementSibling;
        if (nextElement && nextElement.tagName === 'UL') {
          const items = nextElement.querySelectorAll('li');
          items.forEach((item) => {
            // Check for bold elements within list items
            const boldText = item.querySelector('b') || item.querySelector('strong');
            if (boldText) {
              addFormattedText(boldText.textContent || "", 12, true, 5);
              // Remove the bold text from the item text to avoid duplication
              const itemText = item.textContent?.replace(boldText.textContent || "", "") || "";
              addFormattedText(itemText, 12, false, 10);
            } else {
              addFormattedText(item.textContent || "", 12, false, 5);
            }
          });
        }
      });
      
      // Process final report
      const reportHeading = Array.from(tempDiv.querySelectorAll('h2')).find(el => 
        el.textContent?.includes('Report'));
      if (reportHeading) {
        addFormattedText(reportHeading.textContent || "", 16, true);
        let reportContent = '';
        let nextElement = reportHeading.nextElementSibling;
        
        while (nextElement && nextElement.tagName !== 'H2') {
          reportContent += nextElement.textContent + ' ';
          nextElement = nextElement.nextElementSibling;
        }
        
        addFormattedText(reportContent, 12, false);
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
              <CardTitle className="text-xl">Analysis Results</CardTitle>
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
            </CardHeader>
            <CardContent>
              <div 
                id="output"
                ref={contentRef}
                className="prose prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-slate-100
                  prose-p:text-slate-700 dark:prose-p:text-slate-300
                  prose-li:text-slate-700 dark:prose-li:text-slate-300
                  prose-strong:text-slate-900 dark:prose-strong:text-white
                  prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5
                  prose-h2:text-xl prose-h3:text-lg
                  max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: response }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ResultsDisplay;
