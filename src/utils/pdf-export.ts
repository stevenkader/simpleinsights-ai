
import { jsPDF } from "jspdf";
import { cleanHtmlContent, processTextNode } from "./htmlParser";
import { createTextRenderer } from "./pdfTextRenderer";
import { renderTablesFromHtml } from "./pdfTableRenderer";
import { addFooterToCurrentPage, addPageWithFooter } from "./pdfFooter";

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
    const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp
    const documentFileName = `${fileName}-${timestamp}.pdf`;

    console.log("Starting PDF generation with jsPDF...");
    
    // Initialize the PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Header
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, margin, margin);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Generated on: ${formattedDate}`, margin, margin + 10);

    pdf.setLineWidth(0.5);
    pdf.line(margin, margin + 15, pageWidth - margin, margin + 15);

    console.log("Cleaning HTML content for parsing...");
    // Get and clean HTML content 
    const htmlContent = contentRef.current.innerHTML;
    const htmlDoc = cleanHtmlContent(htmlContent);

    // Text rendering helpers
    const lineHeight = 6;
    const headerLineHeight = 8;
    const paragraphSpacing = 4;
    const sectionSpacing = 8;
    const listMargin = 5;
    const tableCellPadding = 3;
    const tableLineHeight = 7;

    // Set initial Y position for content
    let yPosition = margin + 25;
    
    // Initialize text renderer
    console.log("Initializing text renderer...");
    const textRenderer = createTextRenderer(pdf, {
      contentWidth,
      pageHeight,
      margin,
      initialY: yPosition,
      paragraphSpacing,
      headerLineHeight,
      lineHeight,
      sectionSpacing,
      listMargin,
      addPageWithFooter: () => {
        addPageWithFooter(pdf, () => addFooterToCurrentPage(pdf, pdf.getNumberOfPages(), pageWidth, pageHeight, margin));
      }
    });

    // Process table content first so they get proper positioning
    console.log("Processing tables as images...");
    await renderTablesFromHtml(pdf, htmlDoc, {
      margin,
      contentWidth,
      pageWidth,
      pageHeight,
      sectionSpacing,
      tableLineHeight,
      tableCellPadding,
      addPageWithFooter: () => {
        addPageWithFooter(pdf, () => addFooterToCurrentPage(pdf, pdf.getNumberOfPages(), pageWidth, pageHeight, margin));
      },
      getY: textRenderer.getY,
      setY: textRenderer.setY
    });

    // Process headings, paragraphs, and lists
    console.log("Processing headings and paragraphs...");
    const processHeadings = (tagName: string, fontSize: number) => {
      const headings = htmlDoc.querySelectorAll(tagName);
      headings.forEach((heading) => {
        // Skip headings that are part of tables
        if (heading.closest('table')) return;
        
        textRenderer.incY(sectionSpacing);
        const headingText = heading.textContent?.trim() || "";
        if (headingText) {
          textRenderer.addFormattedText(headingText, fontSize, true);
          let nextElement = heading.nextElementSibling;
          while (
            nextElement &&
            !['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'TABLE'].includes(nextElement.tagName)
          ) {
            if (nextElement.tagName === 'P') {
              const paragraphText = nextElement.textContent?.trim() || "";
              if (paragraphText) {
                textRenderer.addFormattedText(paragraphText, 10, false);
              }
            }
            else if (nextElement.tagName === 'UL' || nextElement.tagName === 'OL') {
              const items = nextElement.querySelectorAll('li');
              items.forEach((item, index) => {
                const itemText = item.textContent?.trim() || "";
                if (itemText) {
                  const prefix = nextElement.tagName === 'OL' ? `${index + 1}. ` : '• ';
                  textRenderer.addFormattedText(`${prefix}${itemText}`, 10, false, 5);
                }
              });
              textRenderer.incY(listMargin);
            }
            const tempNext = nextElement.nextElementSibling;
            if (!tempNext) break;
            nextElement = tempNext;
          }
        }
      });
    };

    // Process h1 as title (excluding those in tables)
    const h1Elements = Array.from(htmlDoc.querySelectorAll('h1')).filter(h => !h.closest('table'));
    if (h1Elements.length > 0) {
      const titleText = h1Elements[0].textContent?.trim() || "";
      if (titleText) {
        textRenderer.addFormattedText(titleText, 16, true);
        textRenderer.incY(5);
      }
    }

    // Process h2/h3 elements (excluding those in tables)
    processHeadings('h2', 14);
    processHeadings('h3', 12);

    // Process standalone paragraphs (those not following h1/h2/h3 and not in tables)
    console.log("Processing standalone paragraphs...");
    const standaloneParas = Array.from(htmlDoc.querySelectorAll('p')).filter(p => {
      const prevSibling = p.previousElementSibling;
      return (!prevSibling || !['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(prevSibling.tagName)) && !p.closest('table');
    });
    
    standaloneParas.forEach(para => {
      const paraText = para.textContent?.trim() || "";
      if (paraText) {
        textRenderer.addFormattedText(paraText, 10, false);
      }
    });

    // Add footer to the last page
    console.log("Adding footer to the final page...");
    addFooterToCurrentPage(pdf, pdf.getNumberOfPages(), pageWidth, pageHeight, margin);

    // Save the PDF file
    console.log("Saving PDF document...");
    pdf.save(documentFileName);
    console.log("PDF generation completed successfully!");

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
