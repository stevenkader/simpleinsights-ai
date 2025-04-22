
import { jsPDF } from "jspdf";

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
    
    // Get the HTML content from the div
    const htmlContent = contentRef.current.innerHTML;
    
    // Parse HTML content
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlContent, 'text/html');
    
    // Remove style tags that might interfere with processing
    const styleTags = htmlDoc.querySelectorAll('style');
    styleTags.forEach(tag => tag.remove());
    
    let yPosition = margin + 25;
    const lineHeight = 6;
    const headerLineHeight = 8;
    const paragraphSpacing = 4;
    const sectionSpacing = 8;
    const listMargin = 5;
    const tableCellPadding = 3;
    const tableLineHeight = 7;
    
    // Process text nodes and handle formatting
    const processTextNode = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        
        // Handle specific tags
        if (element.tagName === 'STRONG' || element.tagName === 'B') {
          return element.textContent || '';
        } else if (element.tagName === 'EM' || element.tagName === 'I') {
          return element.textContent || '';
        } else if (element.tagName === 'SPAN') {
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
    
    // Helper function to add text with proper formatting and page breaks
    const addFormattedText = (text: string, fontSize: number, isBold: boolean, indent: number = 0) => {
      if (!text || text.trim() === '') return;
      
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", isBold ? "bold" : "normal");
      
      const textLines = pdf.splitTextToSize(text.trim(), contentWidth - indent);
      
      // Check if we need a new page
      if (yPosition + (textLines.length * (isBold ? headerLineHeight : lineHeight)) > pageHeight - margin) {
        addPageWithFooter();
        yPosition = margin + 15; // Start a bit lower on new pages
      }
      
      // Add each line of text
      textLines.forEach((line: string) => {
        pdf.text(line, margin + indent, yPosition);
        yPosition += isBold ? headerLineHeight : lineHeight;
      });
      
      // Add spacing after the text block
      yPosition += paragraphSpacing;
    };
    
    // Function to add footer to the current page
    const addFooterToCurrentPage = (pageNumber: number) => {
      // Save current text settings
      const currentFontSize = pdf.getFontSize();
      const currentFont = pdf.getFont();
      
      // Set footer style
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      
      // Add centered footer text at the bottom of the page
      const footerText = "SimpleInsights.ai – Complex docs, made simple.";
      const pageText = `Page ${pageNumber}`;
      
      const footerWidth = pdf.getTextWidth(footerText);
      const footerX = (pageWidth - footerWidth) / 2;
      pdf.setTextColor(120, 120, 120); // Gray color
      pdf.text(footerText, footerX, pageHeight - 10);
      
      // Add page number at the bottom right
      pdf.text(pageText, pageWidth - margin - pdf.getTextWidth(pageText), pageHeight - 10);
      
      // Restore previous text settings
      pdf.setTextColor(0, 0, 0); // Reset to black
      pdf.setFontSize(currentFontSize);
      pdf.setFont(currentFont.fontName, currentFont.fontStyle);
    };
    
    // Function to add a new page with footer
    const addPageWithFooter = () => {
      // Add footer to the current page before adding a new one
      addFooterToCurrentPage(pdf.getNumberOfPages());
      
      // Add new page
      pdf.addPage();
    };
    
    // Process tables - NEW FUNCTION
    const processTables = () => {
      const tables = htmlDoc.querySelectorAll('table');
      
      tables.forEach(table => {
        // Add extra space before table
        yPosition += sectionSpacing;
        
        // Get table headers
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim() || "");
        
        // Get table rows
        const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
          return Array.from(tr.querySelectorAll('td')).map(td => {
            // Check for risk level colors
            let cellText = td.textContent?.trim() || "";
            let cellColor = "";
            
            // Try to detect risk levels by text content
            if (cellText.toLowerCase() === "low") {
              cellColor = "#4caf50"; // Green for low risk
            } else if (cellText.toLowerCase() === "medium") {
              cellColor = "#ff9800"; // Orange for medium risk
            } else if (cellText.toLowerCase() === "high") {
              cellColor = "#f44336"; // Red for high risk
            }
            
            return { text: cellText, color: cellColor };
          });
        });
        
        // Calculate column widths based on content
        const columnCount = Math.max(headers.length, ...rows.map(row => row.length));
        
        // If no columns, skip this table
        if (columnCount === 0) return;
        
        // Estimate comfortable column widths with margins
        const availableWidth = contentWidth;
        const columnWidths = [];
        
        // Simple algorithm: first column gets 25% (for labels), divide rest equally
        if (columnCount > 0) {
          columnWidths.push(availableWidth * 0.25); // First column (usually for labels/clause names)
          
          const remainingWidth = availableWidth * 0.75;
          const standardColumnWidth = remainingWidth / (columnCount - 1);
          
          // Add remaining column widths
          for (let i = 1; i < columnCount; i++) {
            columnWidths.push(standardColumnWidth);
          }
        }
        
        // Check if we need a new page for the table
        const estimatedTableHeight = (rows.length + 1) * (tableLineHeight * 3); // Rough estimate including headers
        if (yPosition + estimatedTableHeight > pageHeight - margin) {
          addPageWithFooter();
          yPosition = margin + 15;
        }
        
        // Helper to draw a cell with optional background color
        const drawTableCell = (text: string, x: number, y: number, width: number, height: number, isBold: boolean, bgColor?: string) => {
          // Draw background if specified
          if (bgColor) {
            pdf.setFillColor(bgColor);
            pdf.rect(x, y - height + tableCellPadding, width, height, 'F');
          }
          
          // Draw borders
          pdf.setDrawColor(200, 200, 200);
          pdf.rect(x, y - height + tableCellPadding, width, height, 'S');
          
          // Add text
          pdf.setFont("helvetica", isBold ? "bold" : "normal");
          
          // Split text to fit in cell
          const cellWidth = width - (tableCellPadding * 2);
          const textLines = pdf.splitTextToSize(text, cellWidth);
          
          // Center text vertically in cell
          const textHeight = textLines.length * lineHeight;
          const textY = y - height + tableCellPadding + ((height - textHeight) / 2);
          
          // Add each line of text
          textLines.forEach((line: string, i: number) => {
            pdf.text(line, x + tableCellPadding, textY + (i * lineHeight));
          });
          
          return textLines.length;
        };
        
        // Draw table headers
        let xOffset = margin;
        const headerHeight = tableLineHeight * 2;
        
        // Set header background and text style
        pdf.setFillColor(240, 240, 240);
        pdf.setTextColor(50, 50, 50);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        
        // Draw header cells
        headers.forEach((header, i) => {
          const colWidth = columnWidths[i] || 30; // Default 30mm if not specified
          drawTableCell(header, xOffset, yPosition, colWidth, headerHeight, true, "#f5f5f5");
          xOffset += colWidth;
        });
        
        yPosition += headerHeight;
        
        // Draw data rows
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(9);
        
        rows.forEach((row, rowIndex) => {
          xOffset = margin;
          let maxLines = 1;
          const cellHeight = tableLineHeight * 2;
          
          // First pass: draw cell backgrounds/borders and get line counts
          row.forEach((cell, colIndex) => {
            const colWidth = columnWidths[colIndex] || 30;
            
            // Convert color hex to RGB for the cell background if present
            let bgColor;
            if (cell.color) {
              const hex = cell.color.replace('#', '');
              const r = parseInt(hex.substring(0, 2), 16);
              const g = parseInt(hex.substring(2, 4), 16);
              const b = parseInt(hex.substring(4, 6), 16);
              bgColor = [r, g, b];
              pdf.setFillColor(r, g, b, 0.2); // Use light version of the color
            }
            
            const lines = drawTableCell(
              cell.text, 
              xOffset, 
              yPosition, 
              colWidth, 
              cellHeight, 
              false,
              bgColor ? `rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, 0.2)` : undefined
            );
            
            maxLines = Math.max(maxLines, lines);
            xOffset += colWidth;
          });
          
          // Move to next row
          yPosition += cellHeight;
          
          // Check if we need a new page
          if (yPosition + cellHeight > pageHeight - margin && rowIndex < rows.length - 1) {
            addPageWithFooter();
            yPosition = margin + 15;
          }
        });
        
        // Add space after table
        yPosition += sectionSpacing;
      });
    };
    
    // Process headings
    const processHeadings = (tagName: string, fontSize: number) => {
      const headings = htmlDoc.querySelectorAll(tagName);
      
      headings.forEach((heading) => {
        // Add extra space before headings
        yPosition += sectionSpacing;
        
        const headingText = heading.textContent?.trim() || "";
        if (headingText) {
          addFormattedText(headingText, fontSize, true);
          
          // Process content after heading until next heading
          let nextElement = heading.nextElementSibling;
          
          while (nextElement && 
                 !['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'TABLE'].includes(nextElement.tagName)) {
            
            if (nextElement.tagName === 'P') {
              const paragraphText = nextElement.textContent?.trim() || "";
              if (paragraphText) {
                addFormattedText(paragraphText, 10, false);
              }
            } 
            else if (nextElement.tagName === 'UL' || nextElement.tagName === 'OL') {
              const items = nextElement.querySelectorAll('li');
              items.forEach((item, index) => {
                const itemText = item.textContent?.trim() || "";
                if (itemText) {
                  const prefix = nextElement.tagName === 'OL' ? `${index + 1}. ` : '• ';
                  addFormattedText(`${prefix}${itemText}`, 10, false, 5);
                }
              });
              
              // Add space after list
              yPosition += listMargin;
            }
            
            const tempNext = nextElement.nextElementSibling;
            if (!tempNext) break;
            nextElement = tempNext;
          }
        }
      });
    };
    
    // Process h1 headings (title)
    const h1Elements = htmlDoc.querySelectorAll('h1');
    if (h1Elements.length > 0) {
      const titleText = h1Elements[0].textContent?.trim() || "";
      if (titleText) {
        addFormattedText(titleText, 16, true);
        yPosition += 5; // Extra space after title
      }
    }
    
    // Process h2 headings (main sections)
    processHeadings('h2', 14);
    
    // Process h3 headings (sub-sections)
    processHeadings('h3', 12);
    
    // Process tables
    processTables();
    
    // Process any paragraphs not under headings
    const standaloneParas = Array.from(htmlDoc.querySelectorAll('p')).filter(p => {
      const prevSibling = p.previousElementSibling;
      return !prevSibling || !['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(prevSibling.tagName);
    });
    
    standaloneParas.forEach(para => {
      const paraText = para.textContent?.trim() || "";
      if (paraText) {
        addFormattedText(paraText, 10, false);
      }
    });
    
    // Add footer to the last page
    addFooterToCurrentPage(pdf.getNumberOfPages());
    
    // Save the PDF
    pdf.save(documentFileName);
    
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
