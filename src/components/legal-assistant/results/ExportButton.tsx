
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader } from "lucide-react";

interface ExportButtonProps {
  isPdfGenerating: boolean;
  onClick: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ isPdfGenerating, onClick }) => {
  return (
    <Button 
      variant="outline" 
      onClick={onClick}
      disabled={isPdfGenerating}
      className="border-2 border-gray-300 dark:border-gray-700"
    >
      {isPdfGenerating ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Save as PDF
        </>
      )}
    </Button>
  );
};

export default ExportButton;
