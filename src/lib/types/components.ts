// 공통 컴포넌트 타입 정의
export type ComponentSize = 'sm' | 'md' | 'lg';
export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
export type ComponentColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// 기본 컴포넌트 Props
export interface BaseComponentProps {
  /** CSS 클래스명 */
  className?: string;
  /** 데이터 테스트 ID */
  'data-testid'?: string;
}

// HTML 요소를 확장하는 컴포넌트를 위한 기본 Props
export interface BaseHTMLProps<T = HTMLElement> extends BaseComponentProps {
  /** HTML 요소의 ID */
  id?: string;
  /** 접근성을 위한 역할 */
  role?: string;
  /** 접근성을 위한 라벨 */
  'aria-label'?: string;
  /** 접근성을 위한 설명 */
  'aria-describedby'?: string;
}

// 인터랙티브 컴포넌트를 위한 기본 Props
export interface BaseInteractiveProps extends BaseHTMLProps {
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 비활성화된 이유 (툴팁으로 표시) */
  disabledReason?: string;
}

// 폼 요소를 위한 기본 Props
export interface BaseFormProps extends BaseInteractiveProps {
  /** 필드명 */
  name?: string;
  /** 필수 입력 여부 */
  required?: boolean;
  /** 읽기 전용 여부 */
  readOnly?: boolean;
  /** 자동완성 설정 */
  autoComplete?: string;
}

// 크기가 있는 컴포넌트를 위한 Props
export interface SizedComponentProps extends BaseComponentProps {
  /** 컴포넌트 크기 */
  size?: ComponentSize;
}

// 색상이 있는 컴포넌트를 위한 Props
export interface ColoredComponentProps extends BaseComponentProps {
  /** 컴포넌트 색상 */
  color?: ComponentColor;
}

// 변형이 있는 컴포넌트를 위한 Props
export interface VariantComponentProps extends BaseComponentProps {
  /** 컴포넌트 변형 */
  variant?: ComponentVariant;
}

// 전체 너비 지원 컴포넌트를 위한 Props
export interface FullWidthComponentProps extends BaseComponentProps {
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
}

// 로딩 상태를 가진 컴포넌트를 위한 Props
export interface LoadingComponentProps extends BaseComponentProps {
  /** 로딩 상태 */
  loading?: boolean;
  /** 로딩 상태에서 표시할 텍스트 */
  loadingText?: string;
}

// 아이콘을 가진 컴포넌트를 위한 Props
export interface IconComponentProps extends BaseComponentProps {
  /** 왼쪽 아이콘 */
  leftIcon?: React.ReactNode;
  /** 오른쪽 아이콘 */
  rightIcon?: React.ReactNode;
  /** 아이콘만 표시 여부 */
  iconOnly?: boolean;
}

// 성공 상태를 가진 컴포넌트를 위한 Props
export interface SuccessComponentProps extends BaseComponentProps {
  /** 성공 상태 */
  success?: boolean;
  /** 성공 상태에서 표시할 텍스트 */
  successText?: string;
}

// 에러 상태를 가진 컴포넌트를 위한 Props
export interface ErrorComponentProps extends BaseComponentProps {
  /** 에러 메시지 */
  error?: string;
}

// 헬퍼 텍스트를 가진 컴포넌트를 위한 Props
export interface HelperTextComponentProps extends BaseComponentProps {
  /** 헬퍼 텍스트 */
  helperText?: string;
}

// 라벨을 가진 컴포넌트를 위한 Props
export interface LabelComponentProps extends BaseComponentProps {
  /** 라벨 텍스트 */
  label?: string;
}

// React 표준 Props 조합
export type ButtonElementProps = BaseInteractiveProps & 
  SizedComponentProps & 
  VariantComponentProps & 
  FullWidthComponentProps & 
  LoadingComponentProps & 
  IconComponentProps & 
  SuccessComponentProps;

export type InputElementProps = BaseFormProps & 
  SizedComponentProps & 
  FullWidthComponentProps & 
  ErrorComponentProps & 
  HelperTextComponentProps & 
  LabelComponentProps;

export type SelectElementProps = BaseFormProps & 
  SizedComponentProps & 
  FullWidthComponentProps & 
  ErrorComponentProps & 
  HelperTextComponentProps & 
  LabelComponentProps;

// 컴포넌트 상태 타입
export type ComponentState = 'idle' | 'loading' | 'success' | 'error';

// 방향 타입
export type ComponentDirection = 'horizontal' | 'vertical';

// 정렬 타입
export type ComponentAlignment = 'start' | 'center' | 'end' | 'stretch';

// 간격 타입
export type ComponentSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';