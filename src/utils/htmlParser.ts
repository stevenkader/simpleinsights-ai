
/**
 * Utility functions for HTML parsing and cleaning.
 */

export function cleanHtmlContent(htmlString: string): Document {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(htmlString, 'text/html');

  // Remove style tags
  const styleTags = htmlDoc.querySelectorAll('style');
  styleTags.forEach((tag) => tag.remove());

  // Improve table detection
  const tables = htmlDoc.querySelectorAll('table');
  console.log(`Parser found ${tables.length} tables in the HTML content`);
  
  // If tables are found, log detailed information about their structure
  if (tables.length > 0) {
    tables.forEach((table, i) => {
      const rows = table.querySelectorAll('tr');
      const headers = table.querySelectorAll('th');
      const cells = table.querySelectorAll('td');
      
      console.log(`Table ${i+1} details:`);
      console.log(`- ${rows.length} rows`);
      console.log(`- ${headers.length} header cells`);
      console.log(`- ${cells.length} data cells`);
      console.log(`- Structure preview: ${table.outerHTML.substring(0, 150) + '...'}`);
      
      // Fix tables with missing thead/tbody structure if needed
      if (headers.length > 0 && !table.querySelector('thead')) {
        const headerRow = Array.from(rows).find(row => row.querySelector('th'));
        if (headerRow) {
          const thead = document.createElement('thead');
          thead.appendChild(headerRow.cloneNode(true));
          table.insertBefore(thead, table.firstChild);
          headerRow.remove();
        }
      }
      
      // Ensure tbody exists
      if (!table.querySelector('tbody')) {
        const tbody = document.createElement('tbody');
        Array.from(table.querySelectorAll('tr')).forEach(row => {
          if (!row.querySelector('th')) {
            tbody.appendChild(row.cloneNode(true));
            row.remove();
          }
        });
        table.appendChild(tbody);
      }
    });
  } else {
    // Look for div structures that might be tables
    const potentialTables = htmlDoc.querySelectorAll('div[class*="table"], div[class*="grid"]');
    if (potentialTables.length > 0) {
      console.log(`Found ${potentialTables.length} potential div-based tables`);
    }
  }

  return htmlDoc;
}

/** Used in pdfTextRenderer.ts to extract plain text from nodes */
export function processTextNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || '';
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;

    // Skip table content as they'll be handled separately
    if (element.tagName === 'TABLE' || element.closest('table')) {
      return '';
    }

    if (["STRONG", "B", "EM", "I", "SPAN"].includes(element.tagName)) {
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
}
