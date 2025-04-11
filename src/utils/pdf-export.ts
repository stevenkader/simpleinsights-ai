
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";

export interface PDFExportOptions {
  title: string;
  fileName: string;
  contentRef: React.RefObject<HTMLDivElement>;
  content: string;
}

export const generatePDF = async (options: PDFExportOptions): Promise<boolean> => {
  const { title, fileName, contentRef, content } = options;
  
  if (!contentRef.current || !content) return false;

  try {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    // Use the fileName directly without adding the date again (it's already in the fileName)
    const documentFileName = `${fileName}.pdf`;

    // Create PDF document with A4 format
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Add header
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, margin, margin);
    
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Generated on: ${formattedDate}`, margin, margin + 10);
    
    pdf.setLineWidth(0.5);
    pdf.line(margin, margin + 15, pageWidth - margin, margin + 15);
    
    // Parse HTML content
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(content, 'text/html');
    
    let yPosition = margin + 25;
    const lineHeight = 5; // Reduced line height for paragraphs
    const headerLineHeight = 7; // Keep headers a bit more spaced
    const paragraphSpacing = 2; // Less space between paragraphs
    const sectionSpacing = 2; // Significantly reduced space between sections (before headings)
    const listMargin = 4; // Reduced space after a list
    
    // Helper function to add text with proper formatting and page breaks
    const addFormattedText = (text: string, fontSize: number, isBold: boolean, indent: number = 0) => {
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", isBold ? "bold" : "normal");
      
      const textLines = pdf.splitTextToSize(text.trim(), contentWidth - indent);
      
      // Check if we need a new page
      if (yPosition + (textLines.length * (isBold ? headerLineHeight : lineHeight)) > pageHeight - margin) {
        addPageWithFooter();
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
    
    // Function to add footer to the current page
    const addFooterToCurrentPage = (pageNumber: number) => {
      const footerText = "SimpleInsights.ai – Legal intelligence, made simple.";
      const pageText = `Page ${pageNumber}`;
      
      // Save current text settings
      const currentFontSize = pdf.getFontSize();
      const currentFont = pdf.getFont();
      
      // Set footer style
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      
      // Add centered footer text at the bottom of the page
      const footerWidth = pdf.getTextWidth(footerText);
      const footerX = (pageWidth - footerWidth) / 2;
      pdf.setTextColor(120, 120, 120); // Gray color similar to #888
      pdf.text(footerText, footerX, pageHeight - 10);
      
      // Add page number at the bottom right
      pdf.text(pageText, pageWidth - margin - pdf.getTextWidth(pageText), pageHeight - 10);
      
      // Restore previous text settings
      pdf.setTextColor(0, 0, 0); // Reset to black
      pdf.setFontSize(currentFontSize);
      pdf.setFont(currentFont.fontName, currentFont.fontStyle);
    };
    
    // Function to add a new page with footer
    const addPageWithFooter = () => {
      // Add footer to the current page before adding a new one
      addFooterToCurrentPage(pdf.getNumberOfPages());
      
      // Add new page
      pdf.addPage();
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
                  // Extract the bold text part
                  const boldContent = boldText.textContent?.trim() || "";
                  
                  // Add the bullet point with bold section
                  addFormattedText(`${prefix}${boldContent}:`, 10, true, 5);
                  
                  // Add the rest of the text with additional indent
                  const remainingText = itemText.replace(`${boldContent}:`, "").trim();
                  if (remainingText) {
                    addFormattedText(remainingText, 10, false, 10);
                    // Small space after each bulletpoint content
                    yPosition += 0.5;
                  }
                } else {
                  // Add regular list item
                  addFormattedText(`${prefix}${itemText}`, 10, false, 5);
                  // Small space after each bulletpoint
                  yPosition += 0.5;
                }
              });
              
              // Add moderate space after a list
              yPosition += listMargin;
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
    
    // Add footer to the last page
    addFooterToCurrentPage(pdf.getNumberOfPages());
    
    // Save the PDF
    pdf.save(documentFileName);
    
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
