
import { jsPDF } from "jspdf";
import { PDFExportOptions } from "./pdf/types";
import { processTextNode, addFormattedText } from "./pdf/text-processor";
import { addPageFooter, processHeadings } from "./pdf/page-layout";

export { PDFExportOptions };

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
    
    // Get and parse HTML content
    const htmlContent = contentRef.current.innerHTML;
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlContent, 'text/html');
    
    // Remove style tags
    const styleTags = htmlDoc.querySelectorAll('style');
    styleTags.forEach(tag => tag.remove());
    
    let yPosition = margin + 25;
    const layoutOptions = {
      margin,
      contentWidth,
      pageHeight,
      lineHeight: 6,
      headerLineHeight: 8,
      paragraphSpacing: 4,
      sectionSpacing: 8,
      listMargin: 5
    };

    // Process h1 headings (title)
    const h1Elements = htmlDoc.querySelectorAll('h1');
    if (h1Elements.length > 0) {
      const titleText = h1Elements[0].textContent?.trim() || "";
      if (titleText) {
        yPosition = addFormattedText(pdf, titleText, { ...layoutOptions, fontSize: 16, isBold: true, yPosition });
        yPosition += 5;
      }
    }
    
    // Process headings
    yPosition = processHeadings(pdf, htmlDoc, 'h2', { ...layoutOptions, fontSize: 14 }, addFormattedText, yPosition);
    yPosition = processHeadings(pdf, htmlDoc, 'h3', { ...layoutOptions, fontSize: 12 }, addFormattedText, yPosition);
    
    // Process standalone paragraphs
    const standaloneParas = Array.from(htmlDoc.querySelectorAll('p')).filter(p => {
      const prevSibling = p.previousElementSibling;
      return !prevSibling || !['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(prevSibling.tagName);
    });
    
    standaloneParas.forEach(para => {
      const paraText = para.textContent?.trim() || "";
      if (paraText) {
        yPosition = addFormattedText(pdf, paraText, { ...layoutOptions, fontSize: 10, isBold: false, yPosition });
      }
    });
    
    // Add footer to each page
    for (let i = 1; i <= pdf.getNumberOfPages(); i++) {
      pdf.setPage(i);
      addPageFooter(pdf, i, pageWidth, pageHeight, margin);
    }
    
    // Save the PDF
    pdf.save(documentFileName);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
