// 파일 처리 유틸리티 함수

export interface FileUploadResult {
  success: boolean;
  file?: {
    name: string;
    size: number;
    type: string;
    url?: string;
    base64?: string;
  };
  error?: string;
}

// 파일 크기를 사람이 읽기 쉬운 형식으로 변환
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 파일 확장자 추출
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
}

// 파일 타입 검증
export function validateFileType(file: File, acceptedTypes: string[]): boolean {
  const fileExtension = '.' + getFileExtension(file.name);
  const mimeType = file.type;
  
  // 확장자 또는 MIME 타입 체크
  return acceptedTypes.some(type => {
    if (type.startsWith('.')) {
      return fileExtension === type.toLowerCase();
    } else {
      return mimeType === type || mimeType.startsWith(type);
    }
  });
}

// 파일 크기 검증
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

// 파일을 Base64로 변환
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // data:image/png;base64,iVBORw0... 형태에서 base64 부분만 추출
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

// 파일을 Data URL로 변환 (미리보기용)
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to data URL'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

// 이미지 파일 리사이즈
export async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      // 비율 유지하며 리사이즈
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to resize image'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    // 파일을 이미지로 로드
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  });
}

// 여러 파일 업로드 처리
export async function processMultipleFiles(
  files: FileList,
  options: {
    acceptedTypes?: string[];
    maxSizeMB?: number;
    maxFiles?: number;
  } = {}
): Promise<FileUploadResult[]> {
  const {
    acceptedTypes = [],
    maxSizeMB = 10,
    maxFiles = 10
  } = options;
  
  const results: FileUploadResult[] = [];
  
  // 파일 개수 제한
  if (files.length > maxFiles) {
    return [{
      success: false,
      error: `최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`
    }];
  }
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // 파일 타입 검증
    if (acceptedTypes.length > 0 && !validateFileType(file, acceptedTypes)) {
      results.push({
        success: false,
        error: `${file.name}: 지원하지 않는 파일 형식입니다.`
      });
      continue;
    }
    
    // 파일 크기 검증
    if (!validateFileSize(file, maxSizeMB)) {
      results.push({
        success: false,
        error: `${file.name}: 파일 크기가 ${maxSizeMB}MB를 초과합니다.`
      });
      continue;
    }
    
    try {
      // 이미지 파일인 경우 리사이즈 (선택적)
      let processedFile: File | Blob = file;
      if (file.type.startsWith('image/') && maxSizeMB < 5) {
        processedFile = await resizeImage(file, 1920, 1080);
      }
      
      // Base64 변환
      const base64 = await fileToBase64(processedFile instanceof File ? processedFile : new File([processedFile], file.name, { type: file.type }));
      
      results.push({
        success: true,
        file: {
          name: file.name,
          size: processedFile instanceof Blob ? processedFile.size : file.size,
          type: file.type,
          base64
        }
      });
    } catch (error) {
      results.push({
        success: false,
        error: `${file.name}: 파일 처리 중 오류가 발생했습니다.`
      });
    }
  }
  
  return results;
}

// 드래그 앤 드롭 이벤트 처리
export function handleDragEvent(event: DragEvent): FileList | null {
  event.preventDefault();
  event.stopPropagation();
  
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    return event.dataTransfer.files;
  }
  
  return null;
}

// 클립보드에서 이미지 붙여넣기 처리
export function handlePasteEvent(event: ClipboardEvent): File | null {
  event.preventDefault();
  
  const items = event.clipboardData?.items;
  if (!items) return null;
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) {
        // 파일 이름 생성
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const extension = item.type.split('/')[1];
        return new File([file], `paste-${timestamp}.${extension}`, { type: item.type });
      }
    }
  }
  
  return null;
}

// MIME 타입에서 확장자 가져오기
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: { [key: string]: string } = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'text/plain': 'txt',
    'text/csv': 'csv'
  };
  
  return mimeToExt[mimeType] || 'file';
}

// 파일 아이콘 가져오기
export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType.includes('word')) return '📝';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
  if (mimeType.startsWith('text/')) return '📃';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.startsWith('audio/')) return '🎵';
  return '📎';
}