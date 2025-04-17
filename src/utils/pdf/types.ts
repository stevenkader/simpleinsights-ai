
import { RefObject } from 'react';

export interface PDFExportOptions {
  title: string;
  fileName: string;
  contentRef: RefObject<HTMLDivElement>;
  content: string;
}

export interface PDFTextOptions {
  fontSize: number;
  isBold: boolean;
  indent?: number;
}
