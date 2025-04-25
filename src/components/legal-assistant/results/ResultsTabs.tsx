
import React from "react";
import { TabsList, TabsTrigger, Tabs as RadixTabs } from "@/components/ui/tabs";
import TabContent from "./TabContent";

interface ResultsTabsProps {
  currentTab: string;
  onTabChange: (value: string) => void;
  plainContent: string;
  riskContent: string;
  plainContentRef: React.RefObject<HTMLDivElement>;
  riskContentRef: React.RefObject<HTMLDivElement>;
}

const ResultsTabs: React.FC<ResultsTabsProps> = ({
  currentTab,
  onTabChange,
  plainContent,
  riskContent,
  plainContentRef,
  riskContentRef
}) => {
  return (
    <RadixTabs 
      value={currentTab} 
      onValueChange={onTabChange} 
      className="w-full"
    >
      <TabsList className="w-full mb-4">
        <TabsTrigger value="plain" className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary font-medium">
          Plain English Version
        </TabsTrigger>
        <TabsTrigger value="risk" className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary font-medium">
          Risk Analysis
        </TabsTrigger>
      </TabsList>

      <div>
        <TabContent
          content={plainContent}
          isVisible={currentTab === "plain"}
          contentRef={plainContentRef}
          emptyMessage="No plain text analysis available yet. Upload a document to see results here."
        />
        
        <TabContent
          content={riskContent}
          isVisible={currentTab === "risk"}
          contentRef={riskContentRef}
          emptyMessage="No risk analysis available yet. Use the 'Analyze Risks' section to generate a risk analysis."
        />
      </div>
    </RadixTabs>
  );
};

export default ResultsTabs;
