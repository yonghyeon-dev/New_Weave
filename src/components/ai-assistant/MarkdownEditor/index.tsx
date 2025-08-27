'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { 
  Download, 
  Copy, 
  CheckCircle,
  FileText,
  FileImage,
  FileCode,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { 
  exportToPDF, 
  exportToWord, 
  exportToHTML, 
  exportToText 
} from '@/utils/document-export';
import { MarkdownEditorProps } from './types';

// 동적 임포트로 SSR 문제 해결
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

export default function MarkdownEditor({
  value,
  onChange,
  defaultValue = '',
  placeholder = '마크다운을 입력하세요...',
  height = 500,
  preview = 'live',
  hideToolbar = false,
  readOnly = false,
  className = '',
  onExport,
  onCopy,
  exportOptions = {
    pdf: true,
    word: true,
    html: true,
    markdown: true,
    text: true
  }
}: MarkdownEditorProps) {
  const [content, setContent] = useState(value || defaultValue);
  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'edit' | 'live' | 'preview'>(preview);

  // 콘텐츠 변경 핸들러
  const handleChange = useCallback((val?: string) => {
    const newValue = val || '';
    setContent(newValue);
    onChange?.(newValue);
  }, [onChange]);

  // 복사 핸들러
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      onCopy?.(content);
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  // PDF 내보내기
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const filename = `document-${Date.now()}.pdf`;
      await exportToPDF(content, filename);
      onExport?.('pdf', content);
    } catch (error) {
      console.error('PDF 내보내기 실패:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Word 내보내기
  const handleExportWord = async () => {
    setIsExporting(true);
    try {
      const filename = `document-${Date.now()}.docx`;
      await exportToWord(content, filename);
      onExport?.('word', content);
    } catch (error) {
      console.error('Word 내보내기 실패:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // HTML 내보내기
  const handleExportHTML = async () => {
    setIsExporting(true);
    try {
      const filename = `document-${Date.now()}.html`;
      await exportToHTML(content, filename);
      onExport?.('html', content);
    } catch (error) {
      console.error('HTML 내보내기 실패:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // 마크다운 내보내기
  const handleExportMarkdown = () => {
    try {
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document-${Date.now()}.md`;
      a.click();
      URL.revokeObjectURL(url);
      onExport?.('markdown', content);
    } catch (error) {
      console.error('마크다운 내보내기 실패:', error);
    }
  };

  // 텍스트 내보내기
  const handleExportText = () => {
    try {
      const filename = `document-${Date.now()}.txt`;
      exportToText(content, filename);
      onExport?.('text', content);
    } catch (error) {
      console.error('텍스트 내보내기 실패:', error);
    }
  };

  // 미리보기 모드 토글
  const togglePreviewMode = () => {
    const modes: ('edit' | 'live' | 'preview')[] = ['edit', 'live', 'preview'];
    const currentIndex = modes.indexOf(previewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setPreviewMode(modes[nextIndex]);
  };

  // 전체화면 토글
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`markdown-editor-container ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-bg-primary p-4' : ''}`}>
      {/* 툴바 */}
      {!hideToolbar && (
        <div className="flex items-center justify-between mb-4 p-3 bg-bg-secondary rounded-lg">
          <div className="flex items-center gap-2">
            <Typography variant="body2" className="text-txt-secondary">
              마크다운 에디터
            </Typography>
            <button
              onClick={togglePreviewMode}
              className="p-2 text-txt-tertiary hover:text-txt-primary transition-colors"
              title={previewMode === 'edit' ? '편집 모드' : previewMode === 'live' ? '실시간 미리보기' : '미리보기 모드'}
            >
              {previewMode === 'edit' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 text-txt-tertiary hover:text-txt-primary transition-colors"
              title={isFullscreen ? '전체화면 종료' : '전체화면'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {/* 복사 버튼 */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!content}
            >
              {isCopied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  복사
                </>
              )}
            </Button>
            
            {/* 내보내기 버튼들 */}
            <div className="flex items-center gap-1">
              {exportOptions.pdf && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  disabled={!content || isExporting}
                  title="PDF로 내보내기"
                >
                  <FileImage className="w-4 h-4" />
                  <span className="ml-1 hidden sm:inline">PDF</span>
                </Button>
              )}
              
              {exportOptions.word && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportWord}
                  disabled={!content || isExporting}
                  title="Word로 내보내기"
                >
                  <FileText className="w-4 h-4" />
                  <span className="ml-1 hidden sm:inline">Word</span>
                </Button>
              )}
              
              {exportOptions.html && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportHTML}
                  disabled={!content || isExporting}
                  title="HTML로 내보내기"
                >
                  <FileCode className="w-4 h-4" />
                  <span className="ml-1 hidden sm:inline">HTML</span>
                </Button>
              )}
              
              {exportOptions.markdown && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportMarkdown}
                  disabled={!content}
                  title="마크다운으로 내보내기"
                >
                  <Download className="w-4 h-4" />
                  <span className="ml-1 hidden sm:inline">MD</span>
                </Button>
              )}
              
              {exportOptions.text && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportText}
                  disabled={!content}
                  title="텍스트로 내보내기"
                >
                  <FileText className="w-4 h-4" />
                  <span className="ml-1 hidden sm:inline">TXT</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 마크다운 에디터 */}
      <div className={`markdown-editor-wrapper ${isFullscreen ? 'h-[calc(100%-80px)]' : ''}`}>
        <MDEditor
          value={content}
          onChange={handleChange}
          preview={previewMode}
          height={isFullscreen ? '100%' : height}
          data-color-mode="light"
          textareaProps={{
            placeholder: placeholder,
            readOnly: readOnly
          }}
        />
      </div>

      {/* 로딩 오버레이 */}
      {isExporting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-3 border-weave-primary border-t-transparent rounded-full animate-spin" />
              <Typography variant="body1">문서를 내보내는 중...</Typography>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}