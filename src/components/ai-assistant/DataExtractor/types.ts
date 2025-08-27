import { ExtractedData } from '@/types/ai-assistant';

// DataExtractor 컴포넌트 Props
export interface DataExtractorProps {
  onDataExtracted: (data: ExtractedData) => void;
  onError?: (error: Error) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // MB
  className?: string;
}

// 파일 업로드 상태
export interface FileUploadState {
  file: File | null;
  isUploading: boolean;
  uploadProgress: number;
  preview?: string;
}

// 추출 상태
export interface ExtractionState {
  isExtracting: boolean;
  extractedData: ExtractedData | null;
  error: Error | null;
}