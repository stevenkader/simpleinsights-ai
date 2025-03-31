
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultsDisplayProps {
  response: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ response }) => {
  if (!response) return null;

  return (
    <Card className="bg-slate-50 dark:bg-slate-900 mb-8 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl">Analysis Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: response }}
        ></div>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
