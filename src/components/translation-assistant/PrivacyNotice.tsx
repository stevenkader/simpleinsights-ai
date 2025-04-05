
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface PrivacyNoticeProps {
  className?: string;
}

const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ className = "" }) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Lock className="mr-2 h-4 w-4" />
          Privacy Notice
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">
          Your document is processed securely and temporarily stored for analysis only. 
          We do not share or sell your data. Documents are automatically deleted after 
          processing is complete.
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default PrivacyNotice;
