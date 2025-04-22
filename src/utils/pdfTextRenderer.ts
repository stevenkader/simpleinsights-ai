
/**
 * Utility for adding formatted headers, paragraphs, and lists to PDF.
 */

import { jsPDF } from "jspdf";
import { addPageWithFooter } from "./pdfFooter";

// Encapsulate all text rendering
export function createTextRenderer(pdf: jsPDF, options: {
  contentWidth: number;
  pageHeight: number;
  margin: number;
  initialY: number;
  paragraphSpacing: number;
  headerLineHeight: number;
  lineHeight: number;
  sectionSpacing: number;
  listMargin: number;
  addPageWithFooter: () => void;
}) {
  let yPosition = options.initialY;

  const addFormattedText = (text: string, fontSize: number, isBold: boolean, indent: number = 0) => {
    if (!text || text.trim() === '') return;
    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", isBold ? "bold" : "normal");
    const textLines = pdf.splitTextToSize(text.trim(), options.contentWidth - indent);
    if (yPosition + (textLines.length * (isBold ? options.headerLineHeight : options.lineHeight)) > options.pageHeight - options.margin) {
      options.addPageWithFooter();
      yPosition = options.margin + 15;
    }
    textLines.forEach((line: string) => {
      pdf.text(line, options.margin + indent, yPosition);
      yPosition += isBold ? options.headerLineHeight : options.lineHeight;
    });
    yPosition += options.paragraphSpacing;
  };

  const getY = () => yPosition;
  const setY = (y: number) => { yPosition = y; };
  const incY = (add: number) => { yPosition += add; };

  return {
    addFormattedText,
    getY,
    setY,
    incY,
  };
}
