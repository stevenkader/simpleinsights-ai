
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
    
    // Improved column width calculation - more space for description columns
    const availableWidth = options.contentWidth;
    const columnWidths = [];
    
    if (columnCount === 4) {
      // Common risk analysis table format (Clause, Risk, Description, Impact)
      columnWidths.push(availableWidth * 0.2);  // Clause column - 20%
      columnWidths.push(availableWidth * 0.15); // Risk Level column - 15%
      columnWidths.push(availableWidth * 0.3);  // Description column - 30%
      columnWidths.push(availableWidth * 0.35); // Business Impact column - 35%
    } else if (columnCount > 0) {
      // Default distribution for other table formats
      // First column gets 20%, others share remaining 80%
      columnWidths.push(availableWidth * 0.2);
      const remainingWidth = availableWidth * 0.8;
      const standardColumnWidth = remainingWidth / (columnCount - 1);
      for (let i = 1; i < columnCount; i++) {
        columnWidths.push(standardColumnWidth);
      }
    }
    
    // Check if we need a new page for this table
    const estimatedTableHeight = (rows.length + 1) * (options.tableLineHeight * 3);
    if (yPosition + estimatedTableHeight > options.pageHeight - options.margin) {
      console.log(`Table ${tableIndex + 1} would overflow, adding new page`);
      options.addPageWithFooter();
      yPosition = options.margin + 15;
    }

    // Helper to draw a cell with optional background color
    const drawTableCell = (text: string, x: number, y: number, width: number, height: number, isBold: boolean, bgColor?: string) => {
      if (bgColor) {
        // Use predefined light colors for better visibility
        if (bgColor === "#4caf50") pdf.setFillColor(232, 245, 233); // lighter green
        else if (bgColor === "#ff9800") pdf.setFillColor(255, 243, 224); // lighter orange
        else if (bgColor === "#f44336") pdf.setFillColor(255, 235, 238); // lighter red
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
      
      // Ensure text breaks properly with adequate internal padding for readable text
      const internalPadding = 2;
      const cellWidth = width - (options.tableCellPadding * 2 + internalPadding * 2);
      
      // Smaller font size for better fit
      pdf.setFontSize(isBold ? 8.5 : 8);
      
      // Handle text wrapping with proper spacing
      const textLines = pdf.splitTextToSize(text, cellWidth);
      const lineHeight = 4; // Reduced line height for denser text
      
      // Calculate vertical positioning to ensure text fits and is centered
      const textHeight = textLines.length * lineHeight;
      const textY = y - height + options.tableCellPadding + 5; // Start a bit lower from the top
      
      // Render each line of text
      textLines.forEach((line: string, i: number) => {
        pdf.text(line, x + options.tableCellPadding + internalPadding, textY + (i * lineHeight));
      });
      
      return textLines.length;
    };

    // Draw table header row
    let xOffset = options.margin;
    const headerHeight = options.tableLineHeight * 2.5;
    pdf.setFillColor(240, 240, 240);
    pdf.setTextColor(50, 50, 50);
    pdf.setFontSize(8.5); // Slightly smaller font for header
    pdf.setFont("helvetica", "bold");
    
    headers.forEach((header, i) => {
      const colWidth = columnWidths[i] || 30;
      drawTableCell(header, xOffset, yPosition, colWidth, headerHeight, true, "#f5f5f5");
      xOffset += colWidth;
    });
    yPosition += headerHeight;

    // Draw table data rows
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(8); // Smaller font for data cells

    rows.forEach((row, rowIndex) => {
      xOffset = options.margin;
      
      // Calculate row height dynamically based on content length
      // Estimate 12 characters per line at font size 8 for a typical column
      const maxCharactersPerCell = row.map((cell, idx) => {
        const colWidth = columnWidths[idx] || 30;
        const charsPerLine = Math.floor(colWidth / 2); // Approximate chars per line
        const estimatedLines = Math.ceil(cell.text.length / charsPerLine);
        return Math.max(estimatedLines, 1);
      });
      
      const maxLines = Math.max(...maxCharactersPerCell, 3); // Minimum 3 lines high
      const cellHeight = Math.max(options.tableLineHeight * 2, maxLines * 5); // Dynamic height
      
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
