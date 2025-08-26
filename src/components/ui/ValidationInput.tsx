'use client';

import React, { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import Typography from './Typography';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

// 유효성 검사 타입
export type ValidationType = 
  | 'businessNumber'
  | 'email'
  | 'phone'
  | 'url'
  | 'password'
  | 'text'
  | 'number'
  | 'custom';

// 유효성 검사 결과
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Props 인터페이스
export interface ValidationInputProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
  validationType?: ValidationType;
  customValidator?: (value: string) => ValidationResult;
  mask?: string;
  showValidationIcon?: boolean;
  onChange?: (value: string, isValid: boolean) => void;
  onValidationChange?: (result: ValidationResult) => void;
}

// 유효성 검사 함수들
const validators: Record<ValidationType, (value: string) => ValidationResult> = {
  businessNumber: (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    if (!cleaned) {
      return { isValid: false, message: '하이픈 포함 10자리로 입력해주세요. (예: 123-45-67890)' };
    }
    if (cleaned.length !== 10) {
      return { isValid: false, message: `${cleaned.length}/10자리 입력됨. 전체 10자리를 입력해주세요.` };
    }
    
    // 사업자등록번호 체크섬 검증
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    const digits = cleaned.split('').map(Number);
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * weights[i];
    }
    
    const remainder = sum % 10;
    const checksum = remainder === 0 ? 0 : 10 - remainder;
    
    if (digits[9] !== checksum) {
      return { isValid: false, message: '검증 오류. 올바른 사업자등록번호를 다시 입력해주세요.' };
    }
    
    return { isValid: true, message: '유효한 사업자등록번호입니다.' };
  },
  
  email: (value: string) => {
    if (!value) {
      return { isValid: false, message: '@를 포함한 이메일을 입력해주세요. (예: name@company.com)' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { isValid: false, message: '올바른 형식: 이름@도메인.확장자로 입력해주세요.' };
    }
    return { isValid: true, message: '유효한 이메일입니다.' };
  },
  
  phone: (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    if (!cleaned) {
      return { isValid: false, message: '전화번호 10-11자리를 입력해주세요. (예: 010-1234-5678)' };
    }
    if (cleaned.length < 10 || cleaned.length > 11) {
      return { isValid: false, message: `${cleaned.length}자리 입력됨. 10-11자리로 다시 입력해주세요.` };
    }
    return { isValid: true, message: '유효한 전화번호입니다.' };
  },
  
  url: (value: string) => {
    if (!value) {
      return { isValid: false, message: 'URL을 입력해주세요.' };
    }
    try {
      new URL(value);
      return { isValid: true, message: '유효한 URL입니다.' };
    } catch {
      return { isValid: false, message: '올바른 URL 형식을 입력해주세요.' };
    }
  },
  
  password: (value: string) => {
    if (!value) {
      return { isValid: false, message: '비밀번호를 입력해주세요.' };
    }
    if (value.length < 8) {
      return { isValid: false, message: '비밀번호는 8자 이상이어야 합니다.' };
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return { isValid: false, message: '영문 대소문자와 숫자를 포함해야 합니다.' };
    }
    return { isValid: true, message: '안전한 비밀번호입니다.' };
  },
  
  number: (value: string) => {
    if (!value) {
      return { isValid: false, message: '숫자를 입력해주세요.' };
    }
    if (isNaN(Number(value))) {
      return { isValid: false, message: '올바른 숫자를 입력해주세요.' };
    }
    return { isValid: true };
  },
  
  text: (value: string) => {
    return { isValid: true };
  },
  
  custom: () => ({ isValid: true }),
};

// 마스킹 함수들
const maskValue = (value: string, mask?: string, type?: ValidationType): string => {
  if (!mask && !type) return value;
  
  switch (type) {
    case 'businessNumber':
      const cleaned = value.replace(/[^0-9]/g, '');
      if (cleaned.length <= 3) return cleaned;
      if (cleaned.length <= 5) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 10)}`;
      
    case 'phone':
      const phoneClean = value.replace(/[^0-9]/g, '');
      if (phoneClean.length <= 3) return phoneClean;
      if (phoneClean.length <= 7) return `${phoneClean.slice(0, 3)}-${phoneClean.slice(3)}`;
      if (phoneClean.length === 10) {
        return `${phoneClean.slice(0, 3)}-${phoneClean.slice(3, 6)}-${phoneClean.slice(6)}`;
      }
      return `${phoneClean.slice(0, 3)}-${phoneClean.slice(3, 7)}-${phoneClean.slice(7, 11)}`;
      
    default:
      return value;
  }
};

const ValidationInput = React.forwardRef<HTMLInputElement, ValidationInputProps>(
  ({
    className,
    label,
    helperText,
    fullWidth = false,
    validationType = 'text',
    customValidator,
    mask,
    showValidationIcon = true,
    onChange,
    onValidationChange,
    type: inputType = 'text',
    value: controlledValue,
    ...props
  }, ref) => {
    const [value, setValue] = useState(controlledValue?.toString() || '');
    const [validation, setValidation] = useState<ValidationResult>({ isValid: true });
    const [isTouched, setIsTouched] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // 유효성 검사 수행
    const validateValue = useCallback((val: string): ValidationResult => {
      if (customValidator) {
        return customValidator(val);
      }
      return validators[validationType](val);
    }, [customValidator, validationType]);

    // 값 변경 처리
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      
      // 마스킹 적용
      const maskedValue = maskValue(newValue, mask, validationType);
      setValue(maskedValue);
      
      // 유효성 검사
      const validationResult = validateValue(newValue);
      setValidation(validationResult);
      
      // 콜백 호출
      onChange?.(maskedValue, validationResult.isValid);
      onValidationChange?.(validationResult);
    };

    // 포커스 아웃 처리
    const handleBlur = () => {
      setIsTouched(true);
    };

    // 실제 입력 타입 결정
    const actualInputType = () => {
      if (validationType === 'password') {
        return showPassword ? 'text' : 'password';
      }
      return inputType;
    };

    // 유효성 상태에 따른 스타일
    const getValidationStyles = () => {
      if (!isTouched || validation.isValid) {
        return "border-primary-borderSecondary focus:ring-primary-border";
      }
      return "border-status-error focus:ring-status-error";
    };

    return (
      <div className={cn("space-y-2", fullWidth && "w-full")}>
        {label && (
          <label className="block text-sm font-medium text-txt-primary">
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref || inputRef}
            type={actualInputType()}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(
              "flex h-10 w-full rounded-lg border bg-primary-surface px-3 py-2 text-sm text-txt-primary placeholder:text-txt-tertiary",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-background",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-200",
              getValidationStyles(),
              showValidationIcon && isTouched && "pr-10",
              validationType === 'password' && "pr-10",
              className
            )}
            {...props}
          />
          
          {/* 비밀번호 표시/숨김 버튼 */}
          {validationType === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-txt-tertiary hover:text-txt-primary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
          
          {/* 유효성 검사 아이콘 */}
          {showValidationIcon && isTouched && validationType !== 'password' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {validation.isValid ? (
                <CheckCircle2 className="h-4 w-4 text-status-success" />
              ) : (
                <AlertCircle className="h-4 w-4 text-status-error" />
              )}
            </div>
          )}
        </div>
        
        {/* 헬프 텍스트 또는 유효성 메시지 */}
        {(helperText || (isTouched && validation.message)) && (
          <Typography
            variant="body2"
            className={cn(
              isTouched && !validation.isValid
                ? "text-status-error"
                : "text-txt-secondary"
            )}
          >
            {isTouched && validation.message ? validation.message : helperText}
          </Typography>
        )}
      </div>
    );
  }
);

ValidationInput.displayName = "ValidationInput";

export default ValidationInput;