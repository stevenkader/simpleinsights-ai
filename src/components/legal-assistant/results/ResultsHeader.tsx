
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import ExportButton from "./ExportButton";

interface ResultsHeaderProps {
  isPdfGenerating: boolean;
  onGeneratePDF: (type: 'plain' | 'risk') => void;
  currentTab: string;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ 
  isPdfGenerating, 
  onGeneratePDF,
  currentTab
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-xl">Analysis Results</CardTitle>
      <div className="mb-4 flex justify-end">
        <ExportButton 
          isPdfGenerating={isPdfGenerating}
          onClick={() => onGeneratePDF(currentTab as 'plain' | 'risk')}
        />
      </div>
    </CardHeader>
  );
};

export default ResultsHeader;
