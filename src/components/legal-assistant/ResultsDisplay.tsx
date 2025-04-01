
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
  return (
    <>
      {(isLoading || response) && (
        <div id="progressSection" className="mb-4">
          <Card className="bg-slate-50 dark:bg-slate-900 mb-4">
            <CardHeader>
              <CardTitle className="text-xl">Processing Document</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-4 rounded-full progress-bar transition-all duration-500"
                  style={{ width: `${progress}%` }}
                >
                  {progress > 0 && `${progress}%`}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {response && (
        <div id="resultSection">
          <Card className="bg-slate-50 dark:bg-slate-900 mb-8 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Analysis Results</CardTitle>
              {onExportPDF && (
                <Button variant="outline" className="ml-auto" onClick={onExportPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Save as PDF
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div 
                id="output"
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: response }}
              ></div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ResultsDisplay;
