
import { useEffect } from "react";

interface ScrollManagerProps {
  isLoading: boolean;
  response: string;
}

export const ScrollManager: React.FC<ScrollManagerProps> = ({ isLoading, response }) => {
  useEffect(() => {
    if (isLoading) {
      const progressSection = document.getElementById('progressSection');
      if (progressSection) {
        const yOffset = -400;
        const y = progressSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (response && !isLoading) {
      const resultSection = document.getElementById('resultSection');
      if (resultSection) {
        const yOffset = -400;
        const y = resultSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }, [response, isLoading]);

  return null;
};
