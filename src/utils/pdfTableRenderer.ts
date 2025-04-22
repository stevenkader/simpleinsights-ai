
/**
 * Utility for table rendering into PDF.
 */

import { jsPDF } from "jspdf";
import { addPageWithFooter } from "./pdfFooter";
import { convertTableToImage } from "./htmlToImageConverter";

// Helper: Extract all relevant tables from the HTML document
function extractTables(htmlDoc: Document): HTMLTableElement[] {
  return Array.from(htmlDoc.querySelectorAll('table'));
}

/**
 * Main function to render tables from HTML to PDF
 */
export async function renderTablesFromHtml(
  pdf: jsPDF,
  htmlDoc: Document,
  options: {
    margin: number;
    contentWidth: number;
    pageWidth: number;
    pageHeight: number;
    sectionSpacing: number;
    tableLineHeight: number;
    tableCellPadding: number;
    addPageWithFooter: () => void;
    getY: () => number;
    setY: (y: number) => void;
  }
) {
  let yPosition = options.getY();
  const tables = extractTables(htmlDoc);

  if (tables.length === 0) {
    console.log("No tables found in the document");
    return;
  }
  
  console.log(`Found ${tables.length} tables to render using image conversion`);

  // Process each table by converting to image
  for (let tableIndex = 0; tableIndex < tables.length; tableIndex++) {
    const table = tables[tableIndex];
    console.log(`Processing table ${tableIndex + 1} as image`);
    yPosition += options.sectionSpacing;

    try {
      // Convert table to image
      const tableImageDataUrl = await convertTableToImage(table);
      
      // Calculate image dimensions
      const imgProps = pdf.getImageProperties(tableImageDataUrl);
      const imageWidth = options.contentWidth;
      const imageHeight = (imgProps.height * imageWidth) / imgProps.width;
      
      // Check if image will overflow page and add new page if needed
      if (yPosition + imageHeight > options.pageHeight - options.margin) {
        console.log(`Table ${tableIndex + 1} image would overflow, adding new page`);
        options.addPageWithFooter();
        yPosition = options.margin + 15;
      }
      
      // Add the image to the PDF
      pdf.addImage(
        tableImageDataUrl,
        'PNG',
        options.margin,
        yPosition,
        imageWidth,
        imageHeight
      );
      
      // Update position
      yPosition += imageHeight + options.sectionSpacing;
      console.log(`Finished rendering table ${tableIndex + 1} as image at position ${yPosition}`);
    } catch (error) {
      console.error(`Error rendering table ${tableIndex + 1} as image:`, error);
      
      // If image conversion fails, add a placeholder or error message
      pdf.setTextColor(255, 0, 0);
      pdf.setFontSize(10);
      pdf.text(
        `[Table ${tableIndex + 1} could not be rendered - please check the HTML content]`,
        options.margin,
        yPosition + 10
      );
      pdf.setTextColor(0, 0, 0);
      yPosition += 20 + options.sectionSpacing;
    }
  }
  
  // Update the final y position
  options.setY(yPosition);
}
