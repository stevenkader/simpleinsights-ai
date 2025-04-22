
/**
 * Helper for adding a consistent footer to PDF pages.
 */
import { jsPDF } from "jspdf";

export function addFooterToCurrentPage(pdf: jsPDF, pageNumber: number, pageWidth: number, pageHeight: number, margin: number) {
  const currentFontSize = pdf.getFontSize();
  const currentFont = pdf.getFont();

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  const footerText = "SimpleInsights.ai – Complex docs, made simple.";
  const pageText = `Page ${pageNumber}`;
  const footerWidth = pdf.getTextWidth(footerText);
  const footerX = (pageWidth - footerWidth) / 2;
  pdf.setTextColor(120, 120, 120);
  pdf.text(footerText, footerX, pageHeight - 10);
  pdf.text(pageText, pageWidth - margin - pdf.getTextWidth(pageText), pageHeight - 10);
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(currentFontSize);
  pdf.setFont(currentFont.fontName, currentFont.fontStyle);
}

export function addPageWithFooter(pdf: jsPDF, addFooter: () => void) {
  addFooter();
  pdf.addPage();
}
