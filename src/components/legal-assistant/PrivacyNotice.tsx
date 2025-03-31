
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyNotice: React.FC = () => {
  return (
    <Card className="mt-4 bg-amber-50 border border-amber-200">
      <CardContent className="pt-6">
        <p className="text-sm text-amber-800">
          <strong>Privacy Notice:</strong> All uploaded files are permanently removed from our servers within 1 
          hour. By uploading a document, you agree to our terms and conditions. This AI assistant provides general legal information, 
          not legal advice. Always consult with a qualified attorney for advice specific to your situation.
        </p>
      </CardContent>
    </Card>
  );
};

export default PrivacyNotice;
