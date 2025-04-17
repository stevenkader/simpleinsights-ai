
import { jsPDF } from "jspdf";

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
    
    // Get the HTML content from the div
    const htmlContent = contentRef.current.innerHTML;
    
    // Parse HTML content
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlContent, 'text/html');
    
    // Remove style tags that might interfere with processing
    const styleTags = htmlDoc.querySelectorAll('style');
    styleTags.forEach(tag => tag.remove());
    
    let yPosition = margin + 25;
    const lineHeight = 6;
    const headerLineHeight = 8;
    const paragraphSpacing = 4;
    const sectionSpacing = 8;
    const listMargin = 5;
    
    // Process text nodes and handle formatting
    const processTextNode = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        
        // Handle specific tags
        if (element.tagName === 'STRONG' || element.tagName === 'B') {
          return element.textContent || '';
        } else if (element.tagName === 'EM' || element.tagName === 'I') {
          return element.textContent || '';
        } else if (element.tagName === 'SPAN') {
          return element.textContent || '';
        } else {
          let result = '';
          for (const child of Array.from(element.childNodes)) {
            result += processTextNode(child);
          }
          return result;
        }
      }
      return '';
    };
    
    // Helper function to add text with proper formatting and page breaks
    const addFormattedText = (text: string, fontSize: number, isBold: boolean, indent: number = 0) => {
      if (!text || text.trim() === '') return;
      
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", isBold ? "bold" : "normal");
      
      const textLines = pdf.splitTextToSize(text.trim(), contentWidth - indent);
      
      // Check if we need a new page
      if (yPosition + (textLines.length * (isBold ? headerLineHeight : lineHeight)) > pageHeight - margin) {
        addPageWithFooter();
        yPosition = margin + 15; // Start a bit lower on new pages
      }
      
      // Add each line of text
      textLines.forEach((line: string) => {
        pdf.text(line, margin + indent, yPosition);
        yPosition += isBold ? headerLineHeight : lineHeight;
      });
      
      // Add spacing after the text block
      yPosition += paragraphSpacing;
    };
    
    // Function to add footer to the current page
    const addFooterToCurrentPage = (pageNumber: number) => {
      // Save current text settings
      const currentFontSize = pdf.getFontSize();
      const currentFont = pdf.getFont();
      
      // Set footer style
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      
      // Add centered footer text at the bottom of the page
      const footerText = "SimpleInsights.ai – Complex docs, made simple.";
      const pageText = `Page ${pageNumber}`;
      
      const footerWidth = pdf.getTextWidth(footerText);
      const footerX = (pageWidth - footerWidth) / 2;
      pdf.setTextColor(120, 120, 120); // Gray color
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
    
    // Process headings
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
          
          while (nextElement && 
                 !['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(nextElement.tagName)) {
            
            if (nextElement.tagName === 'P') {
              const paragraphText = nextElement.textContent?.trim() || "";
              if (paragraphText) {
                addFormattedText(paragraphText, 10, false);
              }
            } 
            else if (nextElement.tagName === 'UL' || nextElement.tagName === 'OL') {
              const items = nextElement.querySelectorAll('li');
              items.forEach((item, index) => {
                const itemText = item.textContent?.trim() || "";
                if (itemText) {
                  const prefix = nextElement.tagName === 'OL' ? `${index + 1}. ` : '• ';
                  addFormattedText(`${prefix}${itemText}`, 10, false, 5);
                }
              });
              
              // Add space after list
              yPosition += listMargin;
            }
            
            const tempNext = nextElement.nextElementSibling;
            if (!tempNext) break;
            nextElement = tempNext;
          }
        }
      });
    };
    
    // Process h1 headings (title)
    const h1Elements = htmlDoc.querySelectorAll('h1');
    if (h1Elements.length > 0) {
      const titleText = h1Elements[0].textContent?.trim() || "";
      if (titleText) {
        addFormattedText(titleText, 16, true);
        yPosition += 5; // Extra space after title
      }
    }
    
    // Process h2 headings (main sections)
    processHeadings('h2', 14);
    
    // Process h3 headings (sub-sections)
    processHeadings('h3', 12);
    
    // Process any paragraphs not under headings
    const standaloneParas = Array.from(htmlDoc.querySelectorAll('p')).filter(p => {
      const prevSibling = p.previousElementSibling;
      return !prevSibling || !['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(prevSibling.tagName);
    });
    
    standaloneParas.forEach(para => {
      const paraText = para.textContent?.trim() || "";
      if (paraText) {
        addFormattedText(paraText, 10, false);
      }
    });
    
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
