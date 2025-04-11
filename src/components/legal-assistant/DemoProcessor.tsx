
import React from "react";

interface DemoProcessorProps {
  onProcess: () => void;
}

const demoLegalHTML =
  `<h2>Sections</h2><ol>  <li>Parties</li>  <li>Confidential Information</li>  <li>Return of Confidential Information</li>  <li>Ownership</li>  <li>Governing Law</li>  <li>Signature and Date</li></ol><h2>Section Summaries</h2><h3>1. Parties</h3><ul>  <li><b>Legal Summary:</b> This section identifies the parties involved in the agreement, their addresses, and the effective date of the agreement.</li>  <li><b>Layman's Summary:</b> This part tells us who is making this agreement, where they live, and when the agreement starts.</li></ul><h3>2. Confidential Information</h3><ul>  <li><b>Legal Summary:</b> This section outlines the obligations of the Receiving Party to maintain the confidentiality of the information received from the Disclosing Party. It also defines what constitutes confidential information.</li>  <li><b>Layman's Summary:</b> This part explains that the person receiving the information can't share it, copy it, or change it without permission. It also explains what kind of information is considered confidential.</li></ul><h3>3. Return of Confidential Information</h3><ul>  <li><b>Legal Summary:</b> This section stipulates that all confidential information must be returned to the Disclosing Party upon termination of the agreement.</li>  <li><b>Layman's Summary:</b> This part says that when the agreement ends, all the confidential information has to be given back to the person who originally had it.</li></ul><h3>4. Ownership</h3><ul>  <li><b>Legal Summary:</b> This section states that the agreement is not transferable unless both parties provide written consent.</li>  <li><b>Layman's Summary:</b> This part says that the agreement can't be passed on to someone else unless both people involved in the agreement say it's okay in writing.</li></ul><h3>5. Governing Law</h3><ul>  <li><b>Legal Summary:</b> This section specifies the jurisdiction whose laws will govern the agreement.</li>  <li><b>Layman's Summary:</b> This part tells us which place's laws will be used to interpret the agreement.</li></ul><h3>6. Signature and Date</h3><ul>  <li><b>Legal Summary:</b> This section signifies the agreement of the parties to the terms and conditions of the agreement, demonstrated by their signatures.</li>  <li><b>Layman's Summary:</b> This part shows that both people involved agree to everything written in the agreement by signing it.</li></ul><h2>Report</h2><p>This Non-Disclosure Agreement is a contract between two parties, identified by their addresses. The agreement starts on the date specified and involves the exchange of confidential information. The party receiving the information is obligated to keep it secret and can't share, copy, or change it without permission. The agreement also defines what kind of information is considered confidential. When the agreement ends, all the confidential information has to be given back to the person who originally had it. The agreement can't be passed on to someone else unless both people involved in the agreement say it's okay in writing. The laws of a specific place will be used to interpret the agreement. Both people involved agree to everything written in the agreement by signing it.</p>`;

export const DemoProcessor: React.FC<DemoProcessorProps> = ({ onProcess }) => {
  // This component doesn't render anything by itself
  // It provides the demo HTML content and callback mechanism
  return null;
};

interface DemoProcessorOptions {
  setIsLoading: (isLoading: boolean) => void;
  setResponse: (response: string) => void;
  setPartyName: (name: string) => void;
  setIsRiskAnalysis: (isRiskAnalysis: boolean) => void;
  simulateProgress: () => number;
  resetProgress: () => void;
}

export const useDemoProcessor = (options: DemoProcessorOptions) => {
  const {
    setIsLoading,
    setResponse,
    setPartyName,
    setIsRiskAnalysis,
    simulateProgress,
    resetProgress
  } = options;

  const handleDemoProcess = () => {
    setIsLoading(true);
    setResponse("");
    setPartyName("");
    setIsRiskAnalysis(false);
    
    const progressInterval = simulateProgress();
    
    setTimeout(() => {
      clearInterval(progressInterval);
      resetProgress();
      setTimeout(() => {
        setResponse(demoLegalHTML);
        setIsLoading(false);
      }, 500);
    }, 1500);
  };

  return {
    handleDemoProcess,
    demoLegalHTML
  };
};

export default DemoProcessor;
