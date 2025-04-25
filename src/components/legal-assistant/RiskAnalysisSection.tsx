
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

  if (!fileReference) return null;

  return (
    <Card className="bg-slate-50 dark:bg-slate-900 mb-8">
      <CardHeader>
        <CardTitle className="text-xl">Risk Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-grow">
            <Input
              placeholder="Which party are you? (e.g. Buyer, Seller, Tenant, etc.)"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              className="w-full"
            />
          </div>
          <Button 
            onClick={handleAnalyzeClick}
            disabled={isRiskAnalysisLoading || !partyName.trim()}
            className="whitespace-nowrap"
          >
            {isRiskAnalysisLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <AlertCircle className="mr-2 h-4 w-4" />
                Display Risk Analysis
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskAnalysisSection;

