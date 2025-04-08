
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface DemoSectionProps {
  showDemoDialog: boolean;
  setShowDemoDialog: (show: boolean) => void;
  handleDemoProcess: () => void;
}

const DemoSection: React.FC<DemoSectionProps> = ({
  showDemoDialog,
  setShowDemoDialog,
  handleDemoProcess,
}) => {
  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Try Demo</CardTitle>
          <CardDescription>
            See how our document analysis works with a sample medical document
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setShowDemoDialog(true)}
            variant="outline"
            className="w-full justify-start"
          >
            <Eye className="mr-2" />
            View Demo PDF
          </Button>
          <Button 
            onClick={handleDemoProcess}
            className="w-full justify-start"
          >
            <ArrowRight className="mr-2" />
            Process Demo Document
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showDemoDialog} onOpenChange={setShowDemoDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Sample Medical Report</DialogTitle>
            <DialogDescription>
              This is an example document used to demonstrate our AI analysis capabilities
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            <iframe 
              src="/demo-contract-medical001.pdf" 
              className="w-full h-[70vh]"
              title="Demo Medical Report"
            ></iframe>
          </div>
          <DialogFooter className="sm:justify-start mt-2">
            <Button variant="outline" asChild>
              <a href="/demo-contract-medical001.pdf" download="demo-medical-report.pdf">
                <Download className="mr-2" />
                Download PDF
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DemoSection;
