// 파일 처리 유틸리티 함수

/**
 * 파일 타입 검증
 */
export function validateFileType(file: File, acceptedTypes: string[]): boolean {
  if (acceptedTypes.length === 0) return true;
  
  return acceptedTypes.some(type => {
    if (type.includes('*')) {
      // 와일드카드 처리 (예: image/*)
      const [mainType] = type.split('/');
      return file.type.startsWith(mainType);
    }
    return file.type === type;
  });
}

/**
 * 파일 크기 검증 (MB 단위)
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * 파일 확장자 추출
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.substring(lastDot + 1).toLowerCase();
}

/**
 * 파일 크기를 읽기 쉬운 형식으로 변환
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 파일을 Base64로 변환
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * 파일을 ArrayBuffer로 변환
 */
export function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = error => reject(error);
  });
}

/**
 * 이미지 파일 압축
 */
export async function compressImage(
  file: File, 
  quality: number = 0.8, 
  maxWidth: number = 1920, 
  maxHeight: number = 1920
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }
    
    img.onload = () => {
      let { width, height } = img;
      
      // 크기 조정
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 파일에서 텍스트 추출 (텍스트 파일만)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('text/')) {
      reject(new Error('Not a text file'));
      return;
    }
    
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * 이미지 미리보기 URL 생성
 */
export function createImagePreview(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return null;
  }
  return URL.createObjectURL(file);
}

/**
 * 미리보기 URL 정리 (메모리 누수 방지)
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url);
}