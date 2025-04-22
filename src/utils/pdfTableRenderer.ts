
/**
 * Utility for table rendering into PDF.
 */

import { jsPDF } from "jspdf";
import { addPageWithFooter } from "./pdfFooter";

export function renderTablesFromHtml(
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

  const tables = htmlDoc.querySelectorAll('table');
  tables.forEach(table => {
    yPosition += options.sectionSpacing;

    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim() || "");
    const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
      return Array.from(tr.querySelectorAll('td')).map(td => {
        let cellText = td.textContent?.trim() || "";
        let cellColor = "";
        if (cellText.toLowerCase() === "low") cellColor = "#4caf50";
        else if (cellText.toLowerCase() === "medium") cellColor = "#ff9800";
        else if (cellText.toLowerCase() === "high") cellColor = "#f44336";
        return { text: cellText, color: cellColor };
      });
    });

    const columnCount = Math.max(headers.length, ...rows.map(row => row.length));
    if (columnCount === 0) return;
    const availableWidth = options.contentWidth;
    const columnWidths = [];
    if (columnCount > 0) {
      columnWidths.push(availableWidth * 0.25);
      const remainingWidth = availableWidth * 0.75;
      const standardColumnWidth = remainingWidth / (columnCount - 1);
      for (let i = 1; i < columnCount; i++) {
        columnWidths.push(standardColumnWidth);
      }
    }
    const estimatedTableHeight = (rows.length + 1) * (options.tableLineHeight * 3);
    if (yPosition + estimatedTableHeight > options.pageHeight - options.margin) {
      options.addPageWithFooter();
      yPosition = options.margin + 15;
    }

    // Helper to draw a cell with optional background color
    const drawTableCell = (text: string, x: number, y: number, width: number, height: number, isBold: boolean, bgColor?: string) => {
      if (bgColor) {
        // Convert hex color to RGB values for jsPDF (it doesn't support rgba)
        const hex = bgColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16) || 0;
        const g = parseInt(hex.substring(2, 4), 16) || 0;
        const b = parseInt(hex.substring(4, 6), 16) || 0;
        
        // Use RGB values with the setFillColor method
        pdf.setFillColor(r, g, b);
        
        // Apply a lighter opacity by adjusting the fill color
        if (bgColor === "#4caf50") pdf.setFillColor(220, 237, 220); // light green
        else if (bgColor === "#ff9800") pdf.setFillColor(255, 243, 224); // light orange
        else if (bgColor === "#f44336") pdf.setFillColor(253, 225, 225); // light red
        
        pdf.rect(x, y - height + options.tableCellPadding, width, height, 'F');
      }
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(x, y - height + options.tableCellPadding, width, height, 'S');
      pdf.setFont("helvetica", isBold ? "bold" : "normal");
      const cellWidth = width - (options.tableCellPadding * 2);
      const textLines = pdf.splitTextToSize(text, cellWidth);
      const lineHeight = 6;
      const textHeight = textLines.length * lineHeight;
      const textY = y - height + options.tableCellPadding + ((height - textHeight) / 2);
      textLines.forEach((line: string, i: number) => {
        pdf.text(line, x + options.tableCellPadding, textY + (i * lineHeight));
      });
      return textLines.length;
    };

    let xOffset = options.margin;
    const headerHeight = options.tableLineHeight * 2;
    pdf.setFillColor(240, 240, 240);
    pdf.setTextColor(50, 50, 50);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    headers.forEach((header, i) => {
      const colWidth = columnWidths[i] || 30;
      drawTableCell(header, xOffset, yPosition, colWidth, headerHeight, true, "#f5f5f5");
      xOffset += colWidth;
    });
    yPosition += headerHeight;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(9);

    rows.forEach((row, rowIndex) => {
      xOffset = options.margin;
      const cellHeight = options.tableLineHeight * 2;
      row.forEach((cell, colIndex) => {
        const colWidth = columnWidths[colIndex] || 30;
        drawTableCell(
          cell.text,
          xOffset,
          yPosition,
          colWidth,
          cellHeight,
          false,
          cell.color
        );
        xOffset += colWidth;
      });
      yPosition += cellHeight;
      if (yPosition + cellHeight > options.pageHeight - options.margin && rowIndex < rows.length - 1) {
        options.addPageWithFooter();
        yPosition = options.margin + 15;
      }
    });

    yPosition += options.sectionSpacing;
    options.setY(yPosition);
  });
}
