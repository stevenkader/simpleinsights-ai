
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
  handleDemoProcess: (demoType: string) => void;
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
          <CardTitle>Interactive Demo</CardTitle>
          <CardDescription>
            See how our document analysis works with a sample legal document
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
            onClick={() => handleDemoProcess("contract")}
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
            <DialogTitle>Sample Contract Document</DialogTitle>
            <DialogDescription>
              This is an example document used to demonstrate our AI analysis capabilities
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            <iframe 
              src="/demo-contract.pdf" 
              className="w-full h-[70vh]"
              title="Demo Contract"
            ></iframe>
          </div>
          <DialogFooter className="sm:justify-start mt-2">
            <Button variant="outline" asChild>
              <a href="/demo-contract.pdf" download="demo-contract.pdf">
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
