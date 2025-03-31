
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultsDisplayProps {
  response: string;
  isLoading: boolean;
  progress: number;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  response, 
  isLoading, 
  progress 
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
            <CardHeader>
              <CardTitle className="text-xl">Analysis Results</CardTitle>
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
