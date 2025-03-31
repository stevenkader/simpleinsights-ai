
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploaderProps {
  isLoading: boolean;
  onProcessFile: (file: File) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  isLoading,
  onProcessFile,
}) => {
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  const handleProcessFile = () => {
    if (!fileInputRef.current?.files?.length) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to process",
        variant: "destructive",
      });
      return;
    }

    const file = fileInputRef.current.files[0];
    
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }

    onProcessFile(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
        <CardDescription>
          Upload your legal document for AI analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="uploadFormLegal01" className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="file-upload" className="text-sm font-medium">
              Select a PDF file:
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                name="file"
                type="file"
                ref={fileInputRef}
                accept="application/pdf"
                className="cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
            {fileName && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {fileName}
              </p>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button 
              id="processBtn"
              onClick={handleProcessFile}
              className="flex items-center gap-2"
              disabled={isLoading || !fileName}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Process Document
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
