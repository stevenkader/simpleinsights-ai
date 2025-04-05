
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ResultsDisplayProps {
  response: string;
  isLoading: boolean;
  progress: number;
  onExportPDF?: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  response, 
  isLoading, 
  progress,
  onExportPDF
}) => {
  const resultSectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to results when response is available and loading is complete
    if (response && !isLoading && resultSectionRef.current) {
      // Ensure we scroll after the component is fully rendered
      const timer = setTimeout(() => {
        // Add an offset to ensure the header is visible
        const yOffset = -240; // Same value as legal assistant for consistency
        const element = resultSectionRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({ 
          top: y, 
          behavior: 'smooth'
        });
      }, 500); // Use a longer delay to ensure DOM has updated completely
      
      return () => clearTimeout(timer); // Clean up timer on unmount
    }
  }, [response, isLoading]);

  const getDemoContent = () => {
    return `
      <section class="col-12 col-lg-8" id="resultSection">
        <div class="section-title">
          <h2>Report Area</h2>
          <button id="button" type="button" class="btn btn-primary click_savepdf">
            Save as PDF
          </button>
        </div>
        <div id="output">
          <div style="margin:50px">
            <h2>Translation Analysis</h2>
            <ol>
              <li>Original Language (Spanish)</li>
              <li>English Translation</li>
              <li>Cultural Notes</li>
              <li>Technical Terms</li>
            </ol>
            
            <h2>Section Translations</h2>
            
            <h3>1. Original Language (Spanish)</h3>
            <ul>
              <li><b>Original Text:</b> "Este contrato establece los términos y condiciones para la prestación de servicios de consultoría entre las partes identificadas a continuación. El consultor se compromete a proporcionar asesoramiento experto en el área de desarrollo de software, específicamente en la implementación de soluciones de inteligencia artificial."</li>
            </ul>
            
            <h3>2. English Translation</h3>
            <ul>
              <li><b>Translation:</b> "This contract establishes the terms and conditions for the provision of consulting services between the parties identified below. The consultant agrees to provide expert advice in the area of software development, specifically in the implementation of artificial intelligence solutions."</li>
            </ul>
            
            <h3>3. Cultural Notes</h3>
            <ul>
              <li><b>Business Context:</b> Spanish business contracts typically use more formal language than their English counterparts. The translation maintains the professional tone while adapting to English conventions.</li>
              <li><b>Legal Implications:</b> The Spanish term "se compromete" carries a stronger contractual obligation than just "agrees" - it implies a firm commitment with legal weight.</li>
            </ul>
            
            <h3>4. Technical Terms</h3>
            <ul>
              <li><b>Industry-Specific:</b> "Inteligencia artificial" is directly translated as "artificial intelligence," which is the standard term in both languages for this technology.</li>
              <li><b>Alternative Translations:</b> "Consultoría" could also be translated as "advisory services" in some contexts, but "consulting services" is more common in business documentation.</li>
            </ul>
            
            <h2>Complete Translation</h2>
            <p>The document is a consulting services agreement written in Spanish. It outlines the terms and conditions for providing expert advice in software development, particularly focusing on artificial intelligence implementation. The contract identifies the parties involved (names redacted for privacy) and their obligations. Key terms include payment schedules, confidentiality requirements, and project timelines. The translation maintains both the legal meaning and the technical accuracy of the original document while adapting to English language conventions and business terminology.</p>
          </div>
        </div>
      </section>
    `;
  };

  return (
    <>
      {/* Only render progress section when actually loading */}
      {isLoading && (
        <div id="progressSection" className="mb-4">
          <Card className="bg-slate-50 dark:bg-slate-900 mb-4">
            <CardHeader>
              <CardTitle className="text-xl">Processing Document</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="w-full h-4" />
              <p className="text-sm text-center mt-2">{progress}% complete</p>
            </CardContent>
          </Card>
        </div>
      )}

      {response && (
        <div 
          ref={resultSectionRef} 
          dangerouslySetInnerHTML={{ __html: getDemoContent() }} 
          onClick={(e) => {
            // Handle the Save as PDF button click
            if ((e.target as HTMLElement).classList.contains('click_savepdf') && onExportPDF) {
              e.preventDefault();
              onExportPDF();
            }
          }}
          className="results-container"
        />
      )}
    </>
  );
};

export default ResultsDisplay;
