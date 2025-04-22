
/**
 * Utility for converting HTML tables to images.
 */
import * as htmlToImage from 'html-to-image';

/**
 * Converts an HTML table to a data URL image
 */
export async function convertTableToImage(table: HTMLTableElement): Promise<string> {
  try {
    // Clone the table to avoid modifying the original
    const tableClone = table.cloneNode(true) as HTMLTableElement;
    
    // Create a container with white background for proper rendering
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.background = 'white';
    container.style.padding = '10px';
    container.style.minWidth = '600px'; // Set a minimum width for proper rendering
    container.appendChild(tableClone);
    
    // Ensure good styling for the table clone
    tableClone.style.width = '100%';
    tableClone.style.borderCollapse = 'collapse';
    tableClone.style.fontFamily = 'Helvetica, Arial, sans-serif';
    
    // Style all cells to ensure proper rendering
    const cells = tableClone.querySelectorAll('th, td');
    cells.forEach(cell => {
      const cellElement = cell as HTMLElement;
      cellElement.style.border = '1px solid #ddd';
      cellElement.style.padding = '8px';
      cellElement.style.textAlign = 'left';
    });

    // Style header cells
    const headers = tableClone.querySelectorAll('th');
    headers.forEach(header => {
      const headerElement = header as HTMLElement;
      headerElement.style.backgroundColor = '#f2f2f2';
      headerElement.style.color = '#333';
      headerElement.style.fontWeight = 'bold';
    });

    // Add to document, capture image, then remove
    document.body.appendChild(container);
    
    // Apply special styling for risk levels if they exist
    const riskCells = tableClone.querySelectorAll('td');
    riskCells.forEach(cell => {
      const text = cell.textContent?.toLowerCase().trim() || '';
      if (text === 'low') {
        (cell as HTMLElement).style.backgroundColor = '#e8f5e9';
      } else if (text === 'medium') {
        (cell as HTMLElement).style.backgroundColor = '#fff3e0';
      } else if (text === 'high') {
        (cell as HTMLElement).style.backgroundColor = '#ffebee';
      }
    });

    // Use html-to-image to convert the table to a PNG
    const dataUrl = await htmlToImage.toPng(container, {
      quality: 1.0,
      pixelRatio: 2,
      skipAutoScale: true,
      backgroundColor: 'white'
    });
    
    document.body.removeChild(container);
    return dataUrl;
  } catch (error) {
    console.error('Error converting table to image:', error);
    throw error;
  }
}
