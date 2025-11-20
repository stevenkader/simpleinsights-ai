import { format } from "date-fns";

export interface PDFExportOptions {
  title: string;
  fileName: string;
  contentRef: React.RefObject<HTMLDivElement>;
  content: string;
  images?: Array<{ src: string; caption?: string }>;
}

export const generatePDF = async (options: PDFExportOptions): Promise<boolean> => {
  const { fileName, contentRef, images } = options;
  
  if (!contentRef.current) return false;

  try {
    const now = new Date();
    const timestamp = Math.floor(Date.now() / 1000);
    const documentFileName = `${fileName}-${timestamp}.pdf`;
    const reportTimestamp = format(now, "yyyy-MM-dd 'at' HH:mm '(local time)'");

    // Build images section HTML if images are provided
    let imagesHTML = '';
    if (images && images.length > 0) {
      const imageElements = images.map((img, index) => {
        const caption = img.caption || `Photo ${index + 1}`;
        // Determine image width class based on caption
        let widthClass = 'full-width';
        if (caption.toLowerCase().includes('ceph')) {
          widthClass = 'half-width';
        } else if (!caption.toLowerCase().includes('pano')) {
          widthClass = 'grid-image';
        }
        
        return `
          <div class="image-container ${widthClass}">
            <img src="${img.src}" alt="${caption}" />
            <p class="image-caption">${caption}</p>
          </div>
        `;
      }).join('');

      imagesHTML = `
        <div class="images-page">
          <div class="timestamp-header">Report generated: ${reportTimestamp}</div>
          <div class="images-grid">
            ${imageElements}
          </div>
        </div>
        <div class="page-break"></div>
      `;
    }

    const styledHTML = `
      <html>
        <head>
          <style>
            @page {
              margin: 0.5in;
              @bottom-center {
                content: "Page " counter(page);
                font-family: Arial, sans-serif;
                font-size: 8pt;
                color: #6B7280;
              }
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              color: #000;
              background: #fff;
            }
            .timestamp-header {
              text-align: right;
              font-size: 10pt;
              color: #374151;
              margin-bottom: 24px;
              font-weight: 500;
            }
            .images-page {
              margin-bottom: 40px;
            }
            .images-grid {
              display: flex;
              flex-wrap: wrap;
              gap: 20px;
              justify-content: flex-start;
            }
            .image-container {
              margin-bottom: 20px;
            }
            .image-container.full-width {
              width: 100%;
            }
            .image-container.half-width {
              width: 48%;
            }
            .image-container.grid-image {
              width: 48%;
            }
            .image-container img {
              width: 100%;
              height: auto;
              border: 1px solid #E5E7EB;
              border-radius: 4px;
            }
            .image-caption {
              text-align: center;
              font-size: 9pt;
              color: #6B7280;
              margin-top: 8px;
              margin-bottom: 0;
              font-weight: 500;
            }
            .page-break {
              page-break-after: always;
            }
            .content {
              margin-bottom: 40px;
            }
            .content h2 {
              font-size: 16pt;
              font-weight: 600;
              margin-top: 24px;
              margin-bottom: 12px;
              color: #000;
            }
            .content h3 {
              font-size: 13pt;
              font-weight: 600;
              margin-top: 16px;
              margin-bottom: 10px;
              color: #000;
            }
            .content p {
              margin: 8px 0;
              line-height: 1.6;
              color: #374151;
            }
            .content ul, .content ol {
              margin: 8px 0;
              padding-left: 24px;
            }
            .content li {
              margin: 6px 0;
              line-height: 1.5;
              color: #374151;
            }
            .content strong {
              font-weight: 600;
              color: #000;
            }
          </style>
        </head>
        <body>
          ${imagesHTML}
          <div class="content">
            ${contentRef.current.innerHTML}
          </div>
        </body>
      </html>
    `;
    
    // Send HTML to the backend for PDF generation
    const response = await fetch('https://simpleinsights-ai-backend.onrender.com/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: styledHTML
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
