
/**
 * Utility functions for HTML parsing and cleaning.
 */

export function cleanHtmlContent(htmlString: string): Document {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(htmlString, 'text/html');

  // Remove style tags
  const styleTags = htmlDoc.querySelectorAll('style');
  styleTags.forEach((tag) => tag.remove());

  return htmlDoc;
}

/** Used in pdfTextRenderer.ts to extract plain text from nodes */
export function processTextNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || '';
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;

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
