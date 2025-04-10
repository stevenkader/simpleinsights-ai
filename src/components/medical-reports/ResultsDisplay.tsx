
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
      const fileName = `MedicalReport-${formattedDate}.pdf`;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Set title
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("Medical Report Analysis", margin, margin);
      
      // Set date
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Generated on: ${formattedDate}`, margin, margin + 10);
      
      // Add separator line
      pdf.setLineWidth(0.5);
      pdf.line(margin, margin + 15, pageWidth - margin, margin + 15);
      
      // Parse HTML content
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(response, 'text/html');
      
      let yPosition = margin + 25;
      const lineHeight = 5; // Reduced line height for paragraphs
      const headerLineHeight = 7; // Keep headers a bit more spaced
      const listItemLineHeight = 5; // Reduced line height for list items
      const paragraphSpacing = 2; // Less space between paragraphs
      const sectionSpacing = 10; // Space between sections (before headings)
      
      // Helper function to add text with proper formatting and page breaks
      const addFormattedText = (text: string, fontSize: number, isBold: boolean, indent: number = 0) => {
        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", isBold ? "bold" : "normal");
        
        const textLines = pdf.splitTextToSize(text.trim(), contentWidth - indent);
        
        // Check if we need a new page
        if (yPosition + (textLines.length * (isBold ? headerLineHeight : lineHeight)) > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        
        // Add each line of text
        textLines.forEach((line: string) => {
          pdf.text(line, margin + indent, yPosition);
          yPosition += isBold ? headerLineHeight : lineHeight;
        });
        
        // Only add spacing after the text block
        yPosition += paragraphSpacing;
      };
      
      // Process major sections
      const processHeadings = (tagName: string, fontSize: number) => {
        const headings = htmlDoc.querySelectorAll(tagName);
        headings.forEach((heading) => {
          // Add extra space before headings
          yPosition += sectionSpacing;
          
          const headingText = heading.textContent?.trim() || "";
          if (headingText) {
            addFormattedText(headingText, fontSize, true);
            
            // Process content after heading until next heading
            let nextElement = heading.nextElementSibling;
            while (nextElement && nextElement.tagName !== tagName && 
                   nextElement.tagName !== 'H1' && nextElement.tagName !== 'H2' && 
                   nextElement.tagName !== 'H3') {
              
              if (nextElement.tagName === 'P') {
                const paragraphText = nextElement.textContent?.trim() || "";
                if (paragraphText) {
                  addFormattedText(paragraphText, 10, false, 0);
                }
              } else if (nextElement.tagName === 'UL' || nextElement.tagName === 'OL') {
                const items = nextElement.querySelectorAll('li');
                items.forEach((item, index) => {
                  const prefix = nextElement.tagName === 'OL' ? `${index + 1}. ` : '• ';
                  const itemText = item.textContent?.trim() || "";
                  
                  // Check if item has a bold section
                  const boldText = item.querySelector('b, strong');
                  if (boldText) {
                    // Add the bold part
                    addFormattedText(`${prefix}${boldText.textContent || ""}`, 10, true, 5);
                    
                    // Add the rest of the text with additional indent
                    const remainingText = itemText.replace(boldText.textContent || "", "");
                    if (remainingText.trim()) {
                      addFormattedText(remainingText, 10, false, 10);
                    }
                  } else {
                    // Add regular list item
                    addFormattedText(`${prefix}${itemText}`, 10, false, 5);
                  }
                  
                  // Reduce space between list items
                  yPosition -= 2;
                });
                
                // Add a bit of extra space after a list
                yPosition += 5;
              }
              
              nextElement = nextElement.nextElementSibling;
            }
          }
        });
      };
      
      // Process h2 headings (main sections)
      processHeadings('h2', 14);
      
      // Process h3 headings (sub-sections)
      processHeadings('h3', 12);
      
      // Save the PDF
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
              <CardTitle className="text-xl">Medical Analysis Results</CardTitle>
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
                  prose-p:leading-tight prose-p:my-2
                  prose-li:text-slate-700 dark:prose-li:text-slate-300
                  prose-strong:text-slate-900 dark:prose-strong:text-white
                  prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5
                  prose-h2:text-xl prose-h3:text-lg prose-h2:mt-6 prose-h3:mt-4
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
