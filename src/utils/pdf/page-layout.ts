
import { jsPDF } from "jspdf";

export const addPageFooter = (
  pdf: jsPDF,
  pageNumber: number,
  pageWidth: number,
  pageHeight: number,
  margin: number
) => {
  const footerText = "Transform your complex documents into easily understandable insights with our user-friendly platform.";
  const pageText = `Page ${pageNumber}`;
  
  // Save current text settings
  const currentFontSize = pdf.getFontSize();
  const currentFont = pdf.getFont();
  
  // Set footer style
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  
  // Add centered footer text
  const footerWidth = pdf.getTextWidth(footerText);
  const footerX = (pageWidth - footerWidth) / 2;
  pdf.setTextColor(120, 120, 120);
  pdf.text(footerText, footerX, pageHeight - 10);
  
  // Add page number
  pdf.text(pageText, pageWidth - margin - pdf.getTextWidth(pageText), pageHeight - 10);
  
  // Restore text settings
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(currentFontSize);
  pdf.setFont(currentFont.fontName, currentFont.fontStyle);
};

export const processHeadings = (
  pdf: jsPDF,
  htmlDoc: Document,
  tagName: string,
  options: {
    fontSize: number;
    margin: number;
    contentWidth: number;
    sectionSpacing: number;
    listMargin: number;
    paragraphSpacing: number;
  },
  addFormattedText: Function,
  currentY: number
): number => {
  let yPosition = currentY;
  const headings = htmlDoc.querySelectorAll(tagName);
  
  headings.forEach((heading) => {
    yPosition += options.sectionSpacing;
    
    const headingText = heading.textContent?.trim() || "";
    if (headingText) {
      yPosition = addFormattedText(pdf, headingText, { ...options, fontSize: options.fontSize, isBold: true, yPosition });
      
      let nextElement = heading.nextElementSibling;
      
      while (nextElement && 
             !['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(nextElement.tagName)) {
        
        if (nextElement.tagName === 'P') {
          const paragraphText = nextElement.textContent?.trim() || "";
          if (paragraphText) {
            yPosition = addFormattedText(pdf, paragraphText, { ...options, fontSize: 10, isBold: false, yPosition });
          }
        } 
        else if (nextElement.tagName === 'UL' || nextElement.tagName === 'OL') {
          const items = nextElement.querySelectorAll('li');
          items.forEach((item, index) => {
            const itemText = item.textContent?.trim() || "";
            if (itemText) {
              const prefix = nextElement.tagName === 'OL' ? `${index + 1}. ` : '• ';
              yPosition = addFormattedText(
                pdf,
                `${prefix}${itemText}`,
                { ...options, fontSize: 10, isBold: false, indent: 5, yPosition }
              );
            }
          });
          
          yPosition += options.listMargin;
        }
        
        const tempNext = nextElement.nextElementSibling;
        if (!tempNext) break;
        nextElement = tempNext;
      }
    }
  });
  
  return yPosition;
};
