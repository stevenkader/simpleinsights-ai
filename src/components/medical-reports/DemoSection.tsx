
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface DemoSectionProps {
  showDemoDialog: boolean;
  setShowDemoDialog: (show: boolean) => void;
  handleDemoProcess: () => void;
}

const DemoSection: React.FC<DemoSectionProps> = ({ 
  showDemoDialog, 
  setShowDemoDialog,
  handleDemoProcess 
}) => {
  return (
    <Card className="hover-card">
      <CardHeader>
        <CardTitle>Try a Demo</CardTitle>
        <CardDescription>
          See how the Medical Report Assistant works with a sample report
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Experience our AI-powered medical report analysis without uploading your own documents.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleDemoProcess}
          className="w-full"
          variant="secondary"
        >
          <FileText className="mr-2 h-4 w-4" />
          View Sample Analysis
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DemoSection;
