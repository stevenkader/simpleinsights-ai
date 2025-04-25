
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RiskAnalysisSectionProps {
  fileReference: string;
  partyName: string;
  setPartyName: (name: string) => void;
  isRiskAnalysisLoading: boolean;
  onAnalyzeRisks: () => void;
}

const RiskAnalysisSection: React.FC<RiskAnalysisSectionProps> = ({
  fileReference,
  partyName,
  setPartyName,
  isRiskAnalysisLoading,
  onAnalyzeRisks
}) => {
  const { toast } = useToast();

  const handleAnalyzeClick = () => {
    if (!partyName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please specify which party you are before requesting risk analysis.",
        variant: "destructive",
      });
      return;
    }
    
    onAnalyzeRisks();
  };

  return (
    <Card className="bg-slate-50 dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="text-xl">Risk Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex-grow">
            <Input
              placeholder="Which party are you? (e.g. Buyer, Seller, Tenant, etc.)"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              className="w-full"
              disabled={!fileReference}
            />
            {!fileReference && (
              <p className="text-sm text-muted-foreground mt-2">
                Please upload and process a document first to enable risk analysis.
              </p>
            )}
          </div>
          <Button 
            onClick={handleAnalyzeClick}
            disabled={isRiskAnalysisLoading || !partyName.trim() || !fileReference}
            className="w-full"
          >
            {isRiskAnalysisLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Risks...
              </>
            ) : (
              <>
                <AlertCircle className="mr-2 h-4 w-4" />
                Analyze Risks
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskAnalysisSection;
