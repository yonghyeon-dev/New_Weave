# AI Assistant 컴포넌트 인터페이스 설계서

## 1. 타입 정의 (Type Definitions)

### 1.1 Core Types

```typescript
// src/types/ai-assistant.ts

// 기본 응답 타입
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    processingTime?: number;
    tokenUsage?: TokenUsage;
  };
}

// 토큰 사용량
export interface TokenUsage {
  prompt: number;
  completion: number;
  total: number;
  cost?: number;
}

// 파일 정보
export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'error';
  url?: string;
}
```

### 1.2 DataExtractor Types

```typescript
// src/components/ai-assistant/DataExtractor/types.ts

export interface DataExtractorProps {
  onDataExtracted: (data: ExtractedData) => void;
  onError?: (error: Error) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // MB
  className?: string;
}

export interface ExtractedData {
  documentType: DocumentType;
  fields: ExtractedFields;
  confidence: number;
  rawText: string;
  structuredData: any;
  metadata: ExtractedMetadata;
}

export type DocumentType = 
  | 'receipt'
  | 'invoice'
  | 'tax_invoice'
  | 'contract'
  | 'business_card'
  | 'id_card'
  | 'unknown';

export interface ExtractedFields {
  // 공통 필드
  documentNumber?: string;
  date?: string;
  
  // 사업자 정보
  supplier?: BusinessEntity;
  buyer?: BusinessEntity;
  
  // 금액 정보
  items?: ExtractedItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  
  // 추가 정보
  [key: string]: any;
}

export interface BusinessEntity {
  name: string;
  businessNumber?: string;
  representative?: string;
  address?: string;
  email?: string;
  phone?: string;
}

export interface ExtractedItem {
  name: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  tax?: number;
}

export interface ExtractedMetadata {
  extractedAt: Date;
  processingTime: number;
  aiModel: string;
  confidence: {
    overall: number;
    fields: Record<string, number>;
  };
}
```

### 1.3 DocumentGenerator Types

```typescript
// src/components/ai-assistant/DocumentGenerator/types.ts

export interface DocumentGeneratorProps {
  onDocumentGenerated: (document: GeneratedDocument) => void;
  templates?: DocumentTemplate[];
  defaultTemplate?: string;
  className?: string;
}

export interface GeneratedDocument {
  id: string;
  title: string;
  content: string;
  format: DocumentFormat;
  template: string;
  metadata: DocumentMetadata;
  downloadUrl?: string;
}

export type DocumentFormat = 'markdown' | 'html' | 'pdf' | 'docx';

export interface DocumentTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  thumbnail?: string;
  fields: TemplateField[];
  content: string; // Markdown template with {{variables}}
  styles?: TemplateStyles;
  settings?: TemplateSettings;
}

export type TemplateCategory = 
  | 'quote'
  | 'contract'
  | 'proposal'
  | 'invoice'
  | 'report'
  | 'letter'
  | 'custom';

export interface TemplateField {
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
  defaultValue?: any;
  placeholder?: string;
  helpText?: string;
  validation?: ValidationRule;
  options?: SelectOption[]; // for select/radio
  dependsOn?: string; // conditional field
}

export type FieldType = 
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'url'
  | 'file';

export interface ValidationRule {
  pattern?: string; // regex
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  custom?: (value: any) => boolean | string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TemplateStyles {
  primaryColor?: string;
  fontFamily?: string;
  fontSize?: number;
  lineHeight?: number;
  customCSS?: string;
}

export interface TemplateSettings {
  showHeader?: boolean;
  showFooter?: boolean;
  showPageNumbers?: boolean;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'A4' | 'Letter' | 'Legal';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface DocumentMetadata {
  createdAt: Date;
  updatedAt?: Date;
  author: string;
  version: string;
  tags?: string[];
}
```

### 1.4 BusinessInfoLookup Types

```typescript
// src/components/ai-assistant/BusinessInfoLookup/types.ts

export interface BusinessInfoLookupProps {
  onBusinessInfoFound: (info: BusinessInfo) => void;
  onError?: (error: Error) => void;
  autoSearch?: boolean;
  className?: string;
}

export interface BusinessInfo {
  // 기본 정보
  businessNumber: string;
  taxType: string; // 일반과세자, 간이과세자 등
  
  // 회사 정보
  companyName: string;
  representative: string;
  establishmentDate?: string;
  businessType: string;
  businessItem: string;
  
  // 주소 정보
  headquarters: Address;
  businessAddress?: Address;
  
  // 상태 정보
  status: BusinessStatus;
  statusDate?: string;
  
  // 세금계산서 정보
  taxInvoiceEmail?: string;
  
  // 추가 정보
  employees?: number;
  capital?: number;
  sales?: number;
  creditRating?: string;
}

export interface Address {
  postcode: string;
  roadAddress: string;
  jibunAddress: string;
  detailAddress?: string;
  extraAddress?: string;
}

export type BusinessStatus = 
  | 'active'      // 계속사업자
  | 'closed'      // 폐업
  | 'suspended'   // 휴업
  | 'unregistered'; // 미등록

export interface BusinessValidation {
  isValid: boolean;
  validatedAt: Date;
  source: 'api' | 'manual' | 'cached';
}
```

### 1.5 DocumentEditor Types

```typescript
// src/components/ai-assistant/DocumentEditor/types.ts

export interface DocumentEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
  readOnly?: boolean;
  height?: number | string;
  placeholder?: string;
  toolbar?: ToolbarConfig;
  className?: string;
}

export interface ToolbarConfig {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  heading?: boolean;
  quote?: boolean;
  list?: boolean;
  link?: boolean;
  image?: boolean;
  code?: boolean;
  table?: boolean;
  divider?: boolean;
  preview?: boolean;
  fullscreen?: boolean;
  custom?: ToolbarButton[];
}

export interface ToolbarButton {
  name: string;
  icon: React.ReactNode;
  tooltip: string;
  action: (editor: any) => void;
}

export interface EditorState {
  content: string;
  cursor: CursorPosition;
  selection?: TextSelection;
  history: string[];
  historyIndex: number;
  isFullscreen: boolean;
  isPreview: boolean;
}

export interface CursorPosition {
  line: number;
  column: number;
}

export interface TextSelection {
  start: CursorPosition;
  end: CursorPosition;
  text: string;
}
```

## 2. Service Interfaces

### 2.1 AI Service

```typescript
// src/services/ai/interfaces.ts

export interface AIService {
  extractData(file: File, options?: ExtractOptions): Promise<ExtractedData>;
  generateDocument(template: string, data: any, options?: GenerateOptions): Promise<string>;
  enhanceText(text: string, options?: EnhanceOptions): Promise<string>;
  translateText(text: string, targetLang: string): Promise<string>;
}

export interface ExtractOptions {
  documentType?: DocumentType;
  language?: string;
  outputFormat?: 'json' | 'text' | 'table';
  confidence?: number; // minimum confidence threshold
}

export interface GenerateOptions {
  tone?: 'formal' | 'casual' | 'professional';
  length?: 'short' | 'medium' | 'long';
  language?: string;
  includeExample?: boolean;
}

export interface EnhanceOptions {
  action?: 'improve' | 'summarize' | 'expand' | 'simplify';
  style?: string;
  targetAudience?: string;
}
```

### 2.2 Business Service

```typescript
// src/services/business/interfaces.ts

export interface BusinessService {
  validateBusinessNumber(number: string): Promise<boolean>;
  getBusinessInfo(number: string): Promise<BusinessInfo>;
  searchBusiness(query: string): Promise<BusinessInfo[]>;
  getBusinessHistory(number: string): Promise<BusinessHistory[]>;
}

export interface BusinessHistory {
  date: string;
  event: string;
  details?: any;
}
```

### 2.3 Document Service

```typescript
// src/services/document/interfaces.ts

export interface DocumentService {
  generatePDF(content: string, options?: PDFOptions): Promise<Blob>;
  generateWord(content: string, options?: WordOptions): Promise<Blob>;
  convertFormat(file: File, targetFormat: DocumentFormat): Promise<Blob>;
  mergeDocuments(files: File[]): Promise<Blob>;
}

export interface PDFOptions {
  pageSize?: string;
  orientation?: 'portrait' | 'landscape';
  margins?: Margins;
  header?: HeaderFooter;
  footer?: HeaderFooter;
  watermark?: Watermark;
}

export interface WordOptions {
  template?: string;
  styles?: any;
  properties?: DocumentProperties;
}

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface HeaderFooter {
  text?: string;
  height?: number;
  alignment?: 'left' | 'center' | 'right';
  fontSize?: number;
}

export interface Watermark {
  text: string;
  opacity?: number;
  angle?: number;
  fontSize?: number;
}

export interface DocumentProperties {
  title?: string;
  subject?: string;
  author?: string;
  keywords?: string[];
  category?: string;
}
```

## 3. Hook Interfaces

### 3.1 Custom Hooks

```typescript
// src/hooks/ai-assistant.ts

export interface UseDataExtractor {
  extract: (file: File) => Promise<ExtractedData>;
  isExtracting: boolean;
  error: Error | null;
  data: ExtractedData | null;
  reset: () => void;
}

export interface UseDocumentGenerator {
  generate: (template: DocumentTemplate, data: any) => Promise<GeneratedDocument>;
  isGenerating: boolean;
  error: Error | null;
  document: GeneratedDocument | null;
  templates: DocumentTemplate[];
  loadTemplates: () => Promise<void>;
}

export interface UseBusinessLookup {
  lookup: (businessNumber: string) => Promise<BusinessInfo>;
  isLoading: boolean;
  error: Error | null;
  businessInfo: BusinessInfo | null;
  validate: (businessNumber: string) => boolean;
  reset: () => void;
}
```

## 4. Context Interfaces

### 4.1 AI Assistant Context

```typescript
// src/contexts/ai-assistant.ts

export interface AIAssistantContextType {
  // State
  activeFeature: AIFeature;
  user: UserProfile;
  settings: AISettings;
  history: AIHistory[];
  
  // Actions
  setActiveFeature: (feature: AIFeature) => void;
  updateSettings: (settings: Partial<AISettings>) => void;
  addToHistory: (item: AIHistoryItem) => void;
  clearHistory: () => void;
}

export type AIFeature = 
  | 'extract'
  | 'generate'
  | 'lookup'
  | 'chat'
  | 'all';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  defaultTemplate?: string;
  language?: string;
  theme?: 'light' | 'dark' | 'auto';
  autoSave?: boolean;
}

export interface AISettings {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  autoProcess?: boolean;
  cacheResults?: boolean;
}

export interface AIHistory {
  id: string;
  type: AIFeature;
  timestamp: Date;
  input: any;
  output: any;
  status: 'success' | 'error';
  metadata?: any;
}

export interface AIHistoryItem {
  type: AIFeature;
  input: any;
  output: any;
  status: 'success' | 'error';
  metadata?: any;
}
```

## 5. Utility Interfaces

### 5.1 File Utilities

```typescript
// src/utils/file.ts

export interface FileValidator {
  validateType(file: File, acceptedTypes: string[]): boolean;
  validateSize(file: File, maxSize: number): boolean;
  getFileExtension(filename: string): string;
  formatFileSize(bytes: number): string;
}

export interface FileProcessor {
  toBase64(file: File): Promise<string>;
  toArrayBuffer(file: File): Promise<ArrayBuffer>;
  compressImage(file: File, quality: number): Promise<Blob>;
  extractText(file: File): Promise<string>;
}
```

### 5.2 Validation Utilities

```typescript
// src/utils/validation.ts

export interface Validator {
  businessNumber(value: string): boolean;
  email(value: string): boolean;
  phone(value: string): boolean;
  url(value: string): boolean;
  date(value: string): boolean;
  required(value: any): boolean;
  minLength(value: string, min: number): boolean;
  maxLength(value: string, max: number): boolean;
  pattern(value: string, pattern: RegExp): boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}
```

## 6. Event Interfaces

### 6.1 Component Events

```typescript
// src/types/events.ts

export interface FileUploadEvent {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: Error;
}

export interface DataExtractionEvent {
  stage: 'upload' | 'processing' | 'extracting' | 'completed';
  progress: number;
  data?: ExtractedData;
  error?: Error;
}

export interface DocumentGenerationEvent {
  stage: 'preparing' | 'generating' | 'formatting' | 'completed';
  progress: number;
  document?: GeneratedDocument;
  error?: Error;
}

export interface BusinessLookupEvent {
  stage: 'validating' | 'searching' | 'fetching' | 'completed';
  businessNumber: string;
  data?: BusinessInfo;
  error?: Error;
}
```

## 7. Error Interfaces

### 7.1 Error Types

```typescript
// src/types/errors.ts

export class AIAssistantError extends Error {
  code: string;
  details?: any;
  
  constructor(message: string, code: string, details?: any) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends AIAssistantError {
  field: string;
  
  constructor(field: string, message: string) {
    super(message, 'VALIDATION_ERROR');
    this.field = field;
  }
}

export class APIError extends AIAssistantError {
  status: number;
  
  constructor(message: string, status: number, details?: any) {
    super(message, 'API_ERROR', details);
    this.status = status;
  }
}

export class FileError extends AIAssistantError {
  filename: string;
  
  constructor(filename: string, message: string) {
    super(message, 'FILE_ERROR');
    this.filename = filename;
  }
}
```

## 8. Configuration Interfaces

### 8.1 App Configuration

```typescript
// src/config/types.ts

export interface AppConfig {
  api: APIConfig;
  features: FeatureConfig;
  limits: LimitConfig;
  ui: UIConfig;
}

export interface APIConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  headers: Record<string, string>;
}

export interface FeatureConfig {
  dataExtraction: boolean;
  documentGeneration: boolean;
  businessLookup: boolean;
  aiChat: boolean;
  emailIntegration: boolean;
}

export interface LimitConfig {
  maxFileSize: number; // MB
  maxFiles: number;
  maxTokens: number;
  maxRequests: number; // per minute
}

export interface UIConfig {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  dateFormat: string;
  currency: string;
  animations: boolean;
}
```