
import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, X } from "lucide-react";

interface DocumentUploaderProps {
  onUpload: (file: File) => void;
  acceptedFileTypes?: string[];
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onUpload,
  acceptedFileTypes = [".pdf"],
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    
    if (!acceptedFileTypes.includes(fileExtension)) {
      alert(`Invalid file type. Please upload a ${acceptedFileTypes.join(", ")} file.`);
      return;
    }
    
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Document for Translation</CardTitle>
        <CardDescription>
          Select a document in any language to translate and explain in English
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? "border-primary bg-primary/10" : "border-gray-300 dark:border-gray-700"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept={acceptedFileTypes.join(",")}
          />

          {!selectedFile ? (
            <>
              <div className="flex justify-center mb-4">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {acceptedFileTypes.join(", ")} (Max 10MB)
              </p>
              <Button onClick={handleButtonClick} variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Select Document
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary mr-2" />
                <span className="font-medium">{selectedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-8 w-8 p-0"
                  onClick={clearFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Translate Document
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
