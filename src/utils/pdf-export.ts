
export interface PDFExportOptions {
  title: string;
  fileName: string;
  contentRef: React.RefObject<HTMLDivElement>;
  content: string;
}

export const generatePDF = async (options: PDFExportOptions): Promise<boolean> => {
  const { fileName, contentRef } = options;
  
  if (!contentRef.current) return false;

  try {
    const today = new Date();
    const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp
    const documentFileName = `${fileName}-${timestamp}.pdf`;

    // Get the HTML content from the div
    const htmlContent = contentRef.current.innerHTML;
    
    // Send HTML to the backend for PDF generation
    const response = await fetch('https://simpleinsights-ai-backend.onrender.com/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: htmlContent
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error("PDF generation failed: " + errText);
    }

    // Get the PDF blob and create a download link
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = documentFileName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
