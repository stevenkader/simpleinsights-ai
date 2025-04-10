
/**
 * Utilities for simulating progress for document processing operations
 */

/**
 * Creates and starts a progress simulation interval
 * @returns The interval ID
 */
export const simulateProgress = (
  setProgress: (value: number) => void,
  progressIntervalRef: React.MutableRefObject<number | null>
): number => {
  if (progressIntervalRef.current) {
    clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = null;
  }
  
  setProgress(0);
  let i = 0;
  // Progress advances slowly to give time for the API to respond
  const interval = setInterval(() => {
    i += 1;
    setProgress(i);
    if (i >= 100) {
      clearInterval(interval);
    }
  }, 1200); // Increased from original 600ms to 1200ms for slower progress
  
  progressIntervalRef.current = interval as unknown as number;
  return interval;
};

/**
 * Resets progress state and clears any running interval
 */
export const resetProgress = (
  setProgress: (value: number) => void,
  progressIntervalRef: React.MutableRefObject<number | null>
): void => {
  setProgress(0);
  if (progressIntervalRef.current) {
    clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = null;
  }
};
