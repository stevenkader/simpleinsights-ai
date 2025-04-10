
/**
 * Utilities for simulating progress for document processing operations
 */

/**
 * Creates and starts a progress simulation interval
 * @returns The interval ID
 */
export const simulateProgress = (
  setProgress: (value: number) => void,
  progressIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>
): NodeJS.Timeout => {
  if (progressIntervalRef.current) {
    clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = null;
  }
  
  setProgress(0);
  let i = 0;
  
  // Progress advances slowly with a more realistic curve
  // - 0-60%: Faster for initial progress
  // - 60-90%: Slower for processing time
  // - 90-99%: Very slow for server response waiting
  const interval = setInterval(() => {
    if (i < 60) {
      i += 2; // Faster at start
    } else if (i < 90) {
      i += 1; // Medium in the middle
    } else if (i < 99) {
      i += 0.5; // Slower at end
    }
    
    setProgress(Math.min(Math.round(i), 99)); // Cap at 99% until complete
    
    if (i >= 99) {
      clearInterval(interval);
    }
  }, 1200); // Keep the slower 1200ms timing
  
  progressIntervalRef.current = interval;
  return interval;
};

/**
 * Resets progress state and clears any running interval
 */
export const resetProgress = (
  setProgress: (value: number) => void,
  progressIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>
): void => {
  setProgress(0);
  if (progressIntervalRef.current) {
    clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = null;
  }
};
