// MarkdownEditor 컴포넌트 타입 정의

export type ExportFormat = 'pdf' | 'word' | 'html' | 'markdown' | 'text';

export interface MarkdownEditorProps {
  // 값과 변경 핸들러
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  
  // 에디터 설정
  placeholder?: string;
  height?: number | string;
  preview?: 'edit' | 'live' | 'preview';
  hideToolbar?: boolean;
  readOnly?: boolean;
  
  // 스타일
  className?: string;
  
  // 내보내기 옵션
  exportOptions?: {
    pdf?: boolean;
    word?: boolean;
    html?: boolean;
    markdown?: boolean;
    text?: boolean;
  };
  
  // 이벤트 핸들러
  onExport?: (format: ExportFormat, content: string) => void;
  onCopy?: (content: string) => void;
}

export interface EditorToolbarProps {
  onBold?: () => void;
  onItalic?: () => void;
  onHeading?: (level: 1 | 2 | 3 | 4 | 5 | 6) => void;
  onLink?: () => void;
  onImage?: () => void;
  onCode?: () => void;
  onQuote?: () => void;
  onList?: (type: 'ul' | 'ol') => void;
  onTable?: () => void;
  onHorizontalRule?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export interface EditorState {
  content: string;
  selection: {
    start: number;
    end: number;
  };
  history: string[];
  historyIndex: number;
  isDirty: boolean;
}