
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressDisplayProps {
  progress: number;
}

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ progress }) => {
  return (
    <div id="progressSection" className="mb-4">
      <Card className="bg-slate-50 dark:bg-slate-900 mb-4 border-2 border-gray-300 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl">Processing Document</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full h-4" />
          <p className="text-sm text-center mt-2">{progress}% complete</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDisplay;
