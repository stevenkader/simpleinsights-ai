
import { jsPDF } from "jspdf";

export const processTextNode = (node: Node): string => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || '';
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    
    if (element.tagName === 'STRONG' || element.tagName === 'B' || 
        element.tagName === 'EM' || element.tagName === 'I' || 
        element.tagName === 'SPAN') {
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

export const addFormattedText = (
  pdf: jsPDF,
  text: string,
  options: {
    fontSize: number;
    isBold: boolean;
    indent?: number;
    margin: number;
    yPosition: number;
    contentWidth: number;
    lineHeight: number;
    headerLineHeight: number;
    pageHeight: number;
  }
): number => {
  if (!text || text.trim() === '') return options.yPosition;
  
  const { fontSize, isBold, indent = 0 } = options;
  let { yPosition } = options;
  
  pdf.setFontSize(fontSize);
  pdf.setFont("helvetica", isBold ? "bold" : "normal");
  
  const textLines = pdf.splitTextToSize(text.trim(), options.contentWidth - indent);
  
  // Check if we need a new page
  if (yPosition + (textLines.length * (isBold ? options.headerLineHeight : options.lineHeight)) > options.pageHeight - options.margin) {
    pdf.addPage();
    yPosition = options.margin + 15;
  }
  
  // Add each line of text
  textLines.forEach((line: string) => {
    pdf.text(line, options.margin + indent, yPosition);
    yPosition += isBold ? options.headerLineHeight : options.lineHeight;
  });
  
  return yPosition;
};
