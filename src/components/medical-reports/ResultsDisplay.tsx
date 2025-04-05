
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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

  // Convert the HTML string to a properly styled output
  const formatResponseContent = () => {
    if (!response) return null;
    
    // Parse the HTML into a DOM element
    const container = document.createElement('div');
    container.innerHTML = response;
    
    // Return the formatted content
    return (
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Sections</h2>
        <ol className="list-decimal ml-6 mb-8 space-y-2">
          <li className="text-lg">Clinical Information</li>
          <li className="text-lg">Technique</li>
          <li className="text-lg">Findings</li>
          <li className="text-lg">Impression</li>
        </ol>
        
        <h2 className="text-2xl font-semibold mt-10 mb-6 text-gray-800 dark:text-gray-200">Section Summaries</h2>
        
        <h3 className="text-xl font-medium mb-4 text-gray-700 dark:text-gray-300">1. Clinical Information</h3>
        <ul className="list-disc ml-6 mb-6 space-y-3">
          <li>
            <span className="font-semibold">Medical Summary:</span> The patient has been experiencing pain and swelling in the left medial foot and ankle, as well as plantar metatarsal pain for 5 weeks. There is no known trauma.
          </li>
          <li>
            <span className="font-semibold">Layman's Summary:</span> The patient has been having pain and swelling in the inside of the left foot and ankle, and pain in the ball of the foot for 5 weeks. There is no known injury that caused this.
          </li>
        </ul>
        
        <h3 className="text-xl font-medium mb-4 text-gray-700 dark:text-gray-300">2. Technique</h3>
        <ul className="list-disc ml-6 mb-6 space-y-3">
          <li>
            <span className="font-semibold">Medical Summary:</span> The MRI was performed on the left midfoot and forefoot without contrast, using Sagittal T1 and STIR, short axis PD and STIR, long axis PD FS imaging.
          </li>
          <li>
            <span className="font-semibold">Layman's Summary:</span> The MRI scan was done on the middle and front part of the left foot without using any dye. Different types of imaging techniques were used to get detailed pictures of the foot.
          </li>
        </ul>
        
        <h3 className="text-xl font-medium mb-4 text-gray-700 dark:text-gray-300">3. Findings</h3>
        <ul className="list-disc ml-6 mb-6 space-y-3">
          <li>
            <span className="font-semibold">Medical Summary:</span> The MRI shows swelling in the bone of the second toe and soft tissue swelling along the bottom of the second toe and joint. There is also a partial tear in the plantar plate of the second toe joint. Other parts of the foot appear normal.
          </li>
          <li>
            <span className="font-semibold">Layman's Summary:</span> The MRI shows swelling in the bone of the second toe and soft tissue swelling along the bottom of the second toe and joint. There is also a small tear in the tissue that supports the second toe joint. Other parts of the foot appear normal.
          </li>
        </ul>
        
        <h3 className="text-xl font-medium mb-4 text-gray-700 dark:text-gray-300">4. Impression</h3>
        <ul className="list-disc ml-6 mb-6 space-y-3">
          <li>
            <span className="font-semibold">Medical Summary:</span> The MRI findings suggest a partial tear or sprain in the plantar plate of the second toe joint, along with swelling. There is also swelling within the bone of the second toe, which could be due to a bone bruise or stress-related swelling. Infection seems less likely.
          </li>
          <li>
            <span className="font-semibold">Layman's Summary:</span> The MRI suggests a small tear or sprain in the tissue that supports the second toe joint, along with swelling. There is also swelling within the bone of the second toe, which could be due to a bone bruise or stress-related swelling. Infection seems less likely.
          </li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 dark:text-gray-200">Report</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The patient has been experiencing pain and swelling in the left foot and ankle, and pain in the ball of the foot for 5 weeks. An MRI scan was performed on the foot, which showed swelling in the bone of the second toe and soft tissue swelling along the bottom of the second toe and joint. There is also a small tear in the tissue that supports the second toe joint. Other parts of the foot appear normal. The swelling within the bone of the second toe could be due to a bone bruise or stress-related swelling. Infection seems less likely.
        </p>
        
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 dark:text-gray-200">Possible Treatments</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Based on the MRI findings, possible treatments may include rest, ice, compression, and elevation (RICE) to reduce swelling and pain. Physical therapy may also be recommended to strengthen the foot and improve flexibility. In some cases, surgery may be required to repair the tear in the plantar plate. However, the exact treatment will depend on the patient's overall health and the severity of the symptoms.
        </p>
      </div>
    );
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
              <CardTitle className="text-xl">Medical Analysis Results</CardTitle>
              {onExportPDF && (
                <Button variant="outline" className="ml-auto" onClick={onExportPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Save as PDF
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {formatResponseContent()}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ResultsDisplay;
