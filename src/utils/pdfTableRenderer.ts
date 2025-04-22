
/**
 * Utility for table rendering into PDF.
 */

import { jsPDF } from "jspdf";
import { addPageWithFooter } from "./pdfFooter";

// Helper: Extract all relevant tables from the HTML document
function extractTables(htmlDoc: Document): HTMLTableElement[] {
  return Array.from(htmlDoc.querySelectorAll('table'));
}

// Helper: Retrieve table headers, using th elements or fallback to first tr if needed
function getTableHeaders(table: HTMLTableElement): string[] {
  const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim() || "");
  if (headers.length > 0) return headers;
  const firstRow = table.querySelector('tr');
  if (firstRow) {
    return Array.from(firstRow.querySelectorAll('td')).map(cell => cell.textContent?.trim() || "");
  }
  return [];
}

// Helper: Determine if first row is being used as headers
function isFirstRowHeader(table: HTMLTableElement): boolean {
  return table.querySelectorAll('th').length === 0 && !!table.querySelector('tr');
}

// Helper: Parse rows for table content, with color-coding support
function parseTableRows(table: HTMLTableElement, useFirstRowAsHeader: boolean): { text: string, color: string }[][] {
  let rowsSelector = useFirstRowAsHeader ? 'tr:not(:first-child)' : 'tbody tr';
  let rows = Array.from(table.querySelectorAll(rowsSelector)).map(tr => {
    return Array.from(tr.querySelectorAll('td')).map(td => {
      let cellText = td.textContent?.trim() || "";
      let cellColor = "";
      if (cellText.toLowerCase() === "low") cellColor = "#4caf50";
      else if (cellText.toLowerCase() === "medium") cellColor = "#ff9800";
      else if (cellText.toLowerCase() === "high") cellColor = "#f44336";
      return { text: cellText, color: cellColor };
    });
  });
  // If still empty, fallback to all tr for robustness
  if (rows.length === 0 && !useFirstRowAsHeader) {
    rows = Array.from(table.querySelectorAll('tr')).map(tr => {
      return Array.from(tr.querySelectorAll('td')).map(td => {
        let cellText = td.textContent?.trim() || "";
        let cellColor = "";
        if (cellText.toLowerCase() === "low") cellColor = "#4caf50";
        else if (cellText.toLowerCase() === "medium") cellColor = "#ff9800";
        else if (cellText.toLowerCase() === "high") cellColor = "#f44336";
        return { text: cellText, color: cellColor };
      });
    });
  }
  return rows;
}

// Helper: Calculate column widths by heuristics (4-column case, otherwise default split)
function calculateColumnWidths(columnCount: number, contentWidth: number): number[] {
  const columnWidths = [];
  if (columnCount === 4) {
    columnWidths.push(contentWidth * 0.2);
    columnWidths.push(contentWidth * 0.15);
    columnWidths.push(contentWidth * 0.3);
    columnWidths.push(contentWidth * 0.35);
  } else if (columnCount > 0) {
    columnWidths.push(contentWidth * 0.2);
    const rem = contentWidth * 0.8;
    const w = rem / (columnCount - 1);
    for (let i = 1; i < columnCount; i++) columnWidths.push(w);
  }
  return columnWidths;
}

// Helper: Draw cell with content and background color (for risk coloring)
function drawTableCell(
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  isBold: boolean,
  tableCellPadding: number,
  bgColor?: string
): number {
  if (bgColor) {
    if (bgColor === "#4caf50") pdf.setFillColor(232, 245, 233);
    else if (bgColor === "#ff9800") pdf.setFillColor(255, 243, 224);
    else if (bgColor === "#f44336") pdf.setFillColor(255, 235, 238);
    else {
      const hex = bgColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) || 240;
      const g = parseInt(hex.substring(2, 4), 16) || 240;
      const b = parseInt(hex.substring(4, 6), 16) || 240;
      pdf.setFillColor(r, g, b);
    }
    pdf.rect(x, y - height + tableCellPadding, width, height, 'F');
  }
  pdf.setDrawColor(180, 180, 180);
  pdf.rect(x, y - height + tableCellPadding, width, height, 'S');
  pdf.setFont("helvetica", isBold ? "bold" : "normal");
  const internalPadding = 2;
  const cellWidth = width - (tableCellPadding * 2 + internalPadding * 2);
  pdf.setFontSize(isBold ? 8.5 : 8);
  const textLines = pdf.splitTextToSize(text, cellWidth);
  const lineHeight = 4;
  const textHeight = textLines.length * lineHeight;
  const textY = y - height + tableCellPadding + 5;
  textLines.forEach((line: string, i: number) => {
    pdf.text(line, x + tableCellPadding + internalPadding, textY + (i * lineHeight));
  });
  return textLines.length;
}

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
  const tables = extractTables(htmlDoc);

  if (tables.length === 0) {
    console.log("No tables found in the document");
    return;
  }
  console.log(`Found ${tables.length} tables to render`);

  tables.forEach((table, tableIndex) => {
    console.log(`Processing table ${tableIndex + 1}`);
    yPosition += options.sectionSpacing;

    // Headers and rows
    const useFirstRowAsHeader = isFirstRowHeader(table);
    const headers = getTableHeaders(table);
    const rows = parseTableRows(table, useFirstRowAsHeader);

    console.log(`Table ${tableIndex + 1} has ${headers.length} headers`);
    console.log(`Table ${tableIndex + 1} has ${rows.length} rows`);
    const columnCount = Math.max(headers.length, ...rows.map(row => row.length));
    if (columnCount === 0) {
      console.log("No columns found in table, skipping");
      return;
    }
    console.log(`Table ${tableIndex + 1} has ${columnCount} columns`);

    // Column widths
    const columnWidths = calculateColumnWidths(columnCount, options.contentWidth);

    // Page overflow estimation
    const estimatedTableHeight = (rows.length + 1) * (options.tableLineHeight * 3);
    if (yPosition + estimatedTableHeight > options.pageHeight - options.margin) {
      console.log(`Table ${tableIndex + 1} would overflow, adding new page`);
      options.addPageWithFooter();
      yPosition = options.margin + 15;
    }

    // Header row
    let xOffset = options.margin;
    const headerHeight = options.tableLineHeight * 2.5;
    pdf.setFillColor(240, 240, 240);
    pdf.setTextColor(50, 50, 50);
    pdf.setFontSize(8.5);
    pdf.setFont("helvetica", "bold");
    headers.forEach((header, i) => {
      const colWidth = columnWidths[i] || 30;
      drawTableCell(pdf, header, xOffset, yPosition, colWidth, headerHeight, true, options.tableCellPadding, "#f5f5f5");
      xOffset += colWidth;
    });
    yPosition += headerHeight;

    // Data rows
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(8);
    rows.forEach((row, rowIndex) => {
      xOffset = options.margin;
      // Dynamic row height based on content
      const maxCharsPerCell = row.map((cell, idx) => {
        const colWidth = columnWidths[idx] || 30;
        const charsPerLine = Math.floor(colWidth / 2);
        const lines = Math.ceil(cell.text.length / Math.max(charsPerLine, 1));
        return Math.max(lines, 1);
      });
      const maxLines = Math.max(...maxCharsPerCell, 3);
      const cellHeight = Math.max(options.tableLineHeight * 2, maxLines * 5);
      row.forEach((cell, colIndex) => {
        const colWidth = colIndex < columnWidths.length ? columnWidths[colIndex] : 30;
        drawTableCell(
          pdf,
          cell.text,
          xOffset,
          yPosition,
          colWidth,
          cellHeight,
          false,
          options.tableCellPadding,
          cell.color
        );
        xOffset += colWidth;
      });
      yPosition += cellHeight;
      // Page break for long tables
      if (yPosition + cellHeight > options.pageHeight - options.margin && rowIndex < rows.length - 1) {
        options.addPageWithFooter();
        yPosition = options.margin + 15;
      }
    });

    // Table end spacing
    yPosition += options.sectionSpacing * 1.5;
    console.log(`Finished rendering table ${tableIndex + 1} at position ${yPosition}`);
    options.setY(yPosition);
  });
}
