
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

  // Improved table detection - look for both direct tables and tables within divs
  const tables = Array.from(htmlDoc.querySelectorAll('table'));
  
  // Check if we have any tables to render
  if (tables.length === 0) {
    console.log("No tables found in the document");
    return;
  }
  
  console.log(`Found ${tables.length} tables to render`);
  
  tables.forEach((table, tableIndex) => {
    console.log(`Processing table ${tableIndex + 1}`);
    yPosition += options.sectionSpacing;

    // Extract headers
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim() || "");
    console.log(`Table ${tableIndex + 1} has ${headers.length} headers`);
    
    // If no explicit headers found, try to use the first row as headers
    let useFirstRowAsHeader = false;
    if (headers.length === 0) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        useFirstRowAsHeader = true;
        const firstRowCells = Array.from(firstRow.querySelectorAll('td'));
        firstRowCells.forEach(cell => {
          headers.push(cell.textContent?.trim() || "");
        });
        console.log(`Using first row as headers, found ${headers.length} columns`);
      }
    }
    
    // Extract rows
    let rowsSelector = useFirstRowAsHeader ? 'tr:not(:first-child)' : 'tbody tr';
    let rows = Array.from(table.querySelectorAll(rowsSelector)).map(tr => {
      return Array.from(tr.querySelectorAll('td')).map(td => {
        let cellText = td.textContent?.trim() || "";
        let cellColor = "";
        
        // More robust risk level detection
        if (cellText.toLowerCase() === "low") cellColor = "#4caf50";
        else if (cellText.toLowerCase() === "medium") cellColor = "#ff9800";
        else if (cellText.toLowerCase() === "high") cellColor = "#f44336";
        
        return { text: cellText, color: cellColor };
      });
    });
    
    // If we're using the first row as header and got no rows, just use all rows
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
    
    console.log(`Table ${tableIndex + 1} has ${rows.length} rows`);

    // Calculate column widths
    const columnCount = Math.max(headers.length, ...rows.map(row => row.length));
    if (columnCount === 0) {
      console.log("No columns found in table, skipping");
      return;
    }
    
    console.log(`Table ${tableIndex + 1} has ${columnCount} columns`);
    
    // Improved column width calculation - first column gets 25%, others share remaining 75%
    const availableWidth = options.contentWidth;
    const columnWidths = [];
    if (columnCount > 0) {
      // First column (usually the clause name) gets 25% of the width
      columnWidths.push(availableWidth * 0.25);
      const remainingWidth = availableWidth * 0.75;
      const standardColumnWidth = remainingWidth / (columnCount - 1);
      for (let i = 1; i < columnCount; i++) {
        columnWidths.push(standardColumnWidth);
      }
    }
    
    // Check if we need a new page for this table
    const estimatedTableHeight = (rows.length + 1) * (options.tableLineHeight * 2.5);
    if (yPosition + estimatedTableHeight > options.pageHeight - options.margin) {
      console.log(`Table ${tableIndex + 1} would overflow, adding new page`);
      options.addPageWithFooter();
      yPosition = options.margin + 15;
    }

    // Helper to draw a cell with optional background color
    const drawTableCell = (text: string, x: number, y: number, width: number, height: number, isBold: boolean, bgColor?: string) => {
      if (bgColor) {
        // Use predefined light colors instead of calculating opacity
        if (bgColor === "#4caf50") pdf.setFillColor(220, 237, 220); // light green
        else if (bgColor === "#ff9800") pdf.setFillColor(255, 243, 224); // light orange
        else if (bgColor === "#f44336") pdf.setFillColor(253, 225, 225); // light red
        else {
          // Default fallback for other colors
          const hex = bgColor.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16) || 240;
          const g = parseInt(hex.substring(2, 4), 16) || 240;
          const b = parseInt(hex.substring(4, 6), 16) || 240;
          pdf.setFillColor(r, g, b);
        }
        
        pdf.rect(x, y - height + options.tableCellPadding, width, height, 'F');
      }
      
      // Draw cell border
      pdf.setDrawColor(180, 180, 180);
      pdf.rect(x, y - height + options.tableCellPadding, width, height, 'S');
      
      // Render text
      pdf.setFont("helvetica", isBold ? "bold" : "normal");
      const cellWidth = width - (options.tableCellPadding * 2);
      
      // Ensure text breaks properly
      const textLines = pdf.splitTextToSize(text, cellWidth);
      const lineHeight = 5.5; // Slightly reduced line height for better fit
      
      // Calculate text positioning
      const textHeight = textLines.length * lineHeight;
      // Center text vertically in the cell
      const textY = y - height + options.tableCellPadding + ((height - textHeight) / 2) + lineHeight;
      
      // Render each line of text
      textLines.forEach((line: string, i: number) => {
        pdf.text(line, x + options.tableCellPadding, textY + (i * lineHeight));
      });
      
      return textLines.length;
    };

    // Draw table header row
    let xOffset = options.margin;
    const headerHeight = options.tableLineHeight * 2;
    pdf.setFillColor(240, 240, 240);
    pdf.setTextColor(50, 50, 50);
    pdf.setFontSize(9.5); // Slightly smaller font for better fit
    pdf.setFont("helvetica", "bold");
    
    headers.forEach((header, i) => {
      const colWidth = columnWidths[i] || 30;
      drawTableCell(header, xOffset, yPosition, colWidth, headerHeight, true, "#f5f5f5");
      xOffset += colWidth;
    });
    yPosition += headerHeight;

    // Draw table data rows
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(9); // Slightly smaller font for data cells

    rows.forEach((row, rowIndex) => {
      xOffset = options.margin;
      const cellHeight = options.tableLineHeight * 2.5; // Increased height for better readability
      
      row.forEach((cell, colIndex) => {
        // Make sure we don't go out of bounds with column widths
        const colWidth = colIndex < columnWidths.length ? columnWidths[colIndex] : 30;
        
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
      
      // Check if we need a new page for the next row
      if (yPosition + cellHeight > options.pageHeight - options.margin && rowIndex < rows.length - 1) {
        options.addPageWithFooter();
        yPosition = options.margin + 15;
      }
    });

    // Add some spacing after the table
    yPosition += options.sectionSpacing * 1.5;
    console.log(`Finished rendering table ${tableIndex + 1} at position ${yPosition}`);
    
    // Update position tracker
    options.setY(yPosition);
  });
}
