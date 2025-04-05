
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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
      <div id="translation-result" class="p-6">
        <h2 class="text-2xl font-bold mb-4">Salvador Dalís Hideout, a Hut Turned into a Sensational Palace</h2>
        <p class="text-sm text-gray-500 mb-4">By Clément Ghys</p>
        <p class="text-sm text-gray-500 mb-6">Published on January 27, 2024 at 7:00 PM, modified on January 28, 2024 at 11:31 AM</p>
        <p class="text-sm text-gray-500 mb-6">Reading time: 3 min. Read in English</p>
        <p class="italic mb-6">Article reserved for subscribers</p>
        
        <p class="mb-4">In images, from the fishermans shack bought with his wife Gala, in Portlligat, Catalonia, Salvador Dalí had made an extraordinary dwelling. Today it is a museum that photographer Coco Capitán had the leisure to explore, immersing herself in the thought of the surrealist painter, to whom Quentin Dupieux dedicates a film, in theaters on February 7.</p>
        
        <p class="mb-4">In a Parisian palace, a French journalist interviews Salvador Dalí, her idol. The interview goes badly. The young woman decides to go see him at his home, in Catalonia, to snatch a little more time. She then discovers the daily eccentricity of the master, the Rolls, the same as Elvis, which rolls on the sand, the gastronomic whims, the incomprehensible aphorisms.</p>
        
        <p class="mb-4">In Daaaaaalí!, in theaters on February 7, French director Quentin Dupieux shows less the intimacy of the man born in 1904 and died in 1989 than the mythology of the artist who was, with Andy Warhol and Pablo Picasso, one of the most known of his time. The one whose flights delighted the viewers of talk shows, this tie-wearing character whose mustache defied gravity, the oddball who, in a famous advertisement, said he was "crazy about Lanvin chocolate". It is not about the man who composed canvases of complexity still studied today, the intellectual who dreamed of mixing science, philosophy, and art, nor the one who was a fervent supporter of General Franco regime...</p>
        
        <p class="mb-4">Daaaaaalí!, with Anaïs Demoustier in the role of the journalist, and a myriad of actors (Gilles Lellouche, Jonathan Cohen, Pio Marmaï, Edouard Baer, and Didier Flamand) in that of the painter, was partly shot in Spain, in Catalonia, where the artist lived for decades. The astonishing atmosphere of his hideout in Portlligat, now one of the most visited museums in the country, is recreated on screen.</p>
        
        <p class="mb-4">That is where Coco Capitán, a Spanish photographer based in London, went in the summer of 2023. At the request of the Barcelona publisher Apartamento, she, for several days, early in the morning, before the onslaught of visitors, walked through the different spaces. Her images are gathered in a book, published in November. "What strikes me is the light that bathes the places, the sun envelops everything," she describes. "We understand that he also loved the places for that. The place is ideal for a painter." He himself was proud to be the first Spaniard to see the sun rise, Portlligat being located in the easternmost part of the Iberian Peninsula.</p>
        
        <h3 class="text-xl font-semibold my-4">"A true biological structure"</h3>
        
        <p class="mb-4">This part of Catalonia, the artist frequented well before he was "Daaaaaalí". His father, a notary (as was that of Marcel Duchamp, surrealism owing much to the profession), is a bourgeois from Figueras, a few kilometers away. As a child, he roams these beaches of the Costa Brava. As an adult, he leaves for Madrid, then Paris, without ever forgetting his native region. In France, he meets Elena Ivanovna Diakonova (1894-1982), whom everyone calls Gala. Ten years his senior, she is the wife of the poet Paul Eluard and the mistress of the painter Max Ernst. They fall in love and want to settle in Cadaqués. But the Dalí family refuses for their son to show off with a divorced woman and already a mother.</p>
        
        <p class="mb-4">You have 45% of this article left to read. The rest is reserved for subscribers.</p>
      </div>
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
        <div id="resultSection" ref={resultSectionRef} className="animate-fade-in">
          <Card className="bg-slate-50 dark:bg-slate-900 mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Translation Result</CardTitle>
              {onExportPDF && (
                <Button variant="outline" className="ml-auto" onClick={onExportPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Save as PDF
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-p:text-slate-700 dark:prose-p:text-slate-300
                  prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-slate-100
                  max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: getDemoContent() }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ResultsDisplay;
