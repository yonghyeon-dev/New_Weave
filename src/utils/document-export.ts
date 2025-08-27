// 문서 내보내기 유틸리티
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak } from 'docx';
import { saveAs } from 'file-saver';
import { marked } from 'marked';

// 한글 폰트 데이터 (Base64)
// 실제 프로덕션에서는 폰트 파일을 별도로 로드
const KOREAN_FONT_URL = '/fonts/NanumGothic-Regular.ttf';

/**
 * 마크다운을 PDF로 변환
 */
export async function exportToPDF(
  markdown: string, 
  filename: string = 'document.pdf',
  options: {
    fontSize?: number;
    lineHeight?: number;
    margin?: number;
    pageSize?: 'a4' | 'letter' | 'legal';
  } = {}
): Promise<void> {
  const {
    fontSize = 12,
    lineHeight = 1.5,
    margin = 20,
    pageSize = 'a4'
  } = options;

  try {
    // PDF 문서 생성
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: pageSize
    });

    // 페이지 크기
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const contentWidth = pageWidth - (margin * 2);
    
    // 마크다운을 HTML로 변환
    const html = await marked(markdown);
    
    // HTML을 텍스트로 정제 (임시 - 실제로는 HTML 파싱 필요)
    const text = html
      .replace(/<[^>]*>/g, '') // HTML 태그 제거
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    // 텍스트를 줄 단위로 분리
    const lines = text.split('\n');
    
    let yPosition = margin;
    const lineHeightMm = fontSize * lineHeight * 0.3528; // pt to mm

    // 각 줄을 PDF에 추가
    for (const line of lines) {
      // 페이지 넘김 확인
      if (yPosition + lineHeightMm > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      // 제목 처리 (간단한 구현)
      let currentFontSize = fontSize;
      if (line.startsWith('# ')) {
        currentFontSize = fontSize * 1.5;
        pdf.setFontSize(currentFontSize);
        pdf.text(line.substring(2), margin, yPosition);
      } else if (line.startsWith('## ')) {
        currentFontSize = fontSize * 1.3;
        pdf.setFontSize(currentFontSize);
        pdf.text(line.substring(3), margin, yPosition);
      } else if (line.startsWith('### ')) {
        currentFontSize = fontSize * 1.1;
        pdf.setFontSize(currentFontSize);
        pdf.text(line.substring(4), margin, yPosition);
      } else {
        pdf.setFontSize(fontSize);
        
        // 긴 텍스트 줄바꿈 처리
        const splitText = pdf.splitTextToSize(line, contentWidth);
        if (Array.isArray(splitText)) {
          for (const textLine of splitText) {
            if (yPosition + lineHeightMm > pageHeight - margin) {
              pdf.addPage();
              yPosition = margin;
            }
            pdf.text(textLine, margin, yPosition);
            yPosition += lineHeightMm;
          }
          continue;
        } else {
          pdf.text(line, margin, yPosition);
        }
      }
      
      yPosition += lineHeightMm * (currentFontSize / fontSize);
    }

    // PDF 저장
    pdf.save(filename);
  } catch (error) {
    console.error('PDF 생성 오류:', error);
    throw new Error('PDF 생성에 실패했습니다.');
  }
}

/**
 * 마크다운을 Word 문서로 변환
 */
export async function exportToWord(
  markdown: string,
  filename: string = 'document.docx',
  options: {
    fontSize?: number;
    fontFamily?: string;
    lineSpacing?: number;
  } = {}
): Promise<void> {
  const {
    fontSize = 11,
    fontFamily = 'Malgun Gothic',
    lineSpacing = 1.5
  } = options;

  try {
    // 마크다운을 줄 단위로 분리
    const lines = markdown.split('\n');
    const children: Paragraph[] = [];

    for (const line of lines) {
      // 빈 줄 처리
      if (line.trim() === '') {
        children.push(new Paragraph({ text: '' }));
        continue;
      }

      // 페이지 구분선 처리
      if (line.trim() === '---') {
        children.push(new Paragraph({
          children: [new PageBreak()],
        }));
        continue;
      }

      // 제목 처리
      if (line.startsWith('# ')) {
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.LEFT,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: line.substring(2),
                bold: true,
                size: fontSize * 3,
                font: fontFamily
              })
            ]
          })
        );
      } else if (line.startsWith('## ')) {
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.LEFT,
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: line.substring(3),
                bold: true,
                size: fontSize * 2.5,
                font: fontFamily
              })
            ]
          })
        );
      } else if (line.startsWith('### ')) {
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.LEFT,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: line.substring(4),
                bold: true,
                size: fontSize * 2.2,
                font: fontFamily
              })
            ]
          })
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        // 목록 항목
        children.push(
          new Paragraph({
            bullet: {
              level: 0
            },
            spacing: { after: 100, line: lineSpacing * 240 },
            children: [
              new TextRun({
                text: line.substring(2),
                size: fontSize * 2,
                font: fontFamily
              })
            ]
          })
        );
      } else if (line.match(/^\d+\. /)) {
        // 번호 목록
        const text = line.replace(/^\d+\. /, '');
        children.push(
          new Paragraph({
            numbering: {
              reference: 'default-numbering',
              level: 0
            },
            spacing: { after: 100, line: lineSpacing * 240 },
            children: [
              new TextRun({
                text: text,
                size: fontSize * 2,
                font: fontFamily
              })
            ]
          })
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        // 굵은 텍스트
        children.push(
          new Paragraph({
            spacing: { after: 100, line: lineSpacing * 240 },
            children: [
              new TextRun({
                text: line.substring(2, line.length - 2),
                bold: true,
                size: fontSize * 2,
                font: fontFamily
              })
            ]
          })
        );
      } else {
        // 일반 텍스트
        // 인라인 스타일 처리
        const textRuns: TextRun[] = [];
        let currentText = line;
        
        // 굵은 텍스트 처리
        const boldRegex = /\*\*(.*?)\*\*/g;
        const parts = currentText.split(boldRegex);
        
        parts.forEach((part, index) => {
          if (index % 2 === 0) {
            // 일반 텍스트
            if (part) {
              textRuns.push(
                new TextRun({
                  text: part,
                  size: fontSize * 2,
                  font: fontFamily
                })
              );
            }
          } else {
            // 굵은 텍스트
            textRuns.push(
              new TextRun({
                text: part,
                bold: true,
                size: fontSize * 2,
                font: fontFamily
              })
            );
          }
        });

        if (textRuns.length > 0) {
          children.push(
            new Paragraph({
              spacing: { after: 100, line: lineSpacing * 240 },
              children: textRuns
            })
          );
        } else {
          children.push(
            new Paragraph({
              spacing: { after: 100, line: lineSpacing * 240 },
              children: [
                new TextRun({
                  text: line,
                  size: fontSize * 2,
                  font: fontFamily
                })
              ]
            })
          );
        }
      }
    }

    // Word 문서 생성
    const doc = new Document({
      sections: [{
        properties: {},
        children: children
      }]
    });

    // 문서를 Blob으로 생성
    const blob = await Packer.toBlob(doc);
    
    // 파일 저장
    saveAs(blob, filename);
  } catch (error) {
    console.error('Word 문서 생성 오류:', error);
    throw new Error('Word 문서 생성에 실패했습니다.');
  }
}

/**
 * 마크다운을 HTML로 변환
 */
export async function exportToHTML(
  markdown: string,
  filename: string = 'document.html',
  options: {
    includeStyles?: boolean;
    theme?: 'light' | 'dark';
  } = {}
): Promise<void> {
  const {
    includeStyles = true,
    theme = 'light'
  } = options;

  try {
    // 마크다운을 HTML로 변환
    const content = await marked(markdown);

    // 스타일 정의
    const styles = includeStyles ? `
      <style>
        body {
          font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          background-color: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
          color: ${theme === 'dark' ? '#e0e0e0' : '#333333'};
        }
        h1, h2, h3, h4, h5, h6 {
          margin-top: 24px;
          margin-bottom: 16px;
          font-weight: 600;
          line-height: 1.25;
        }
        h1 { 
          font-size: 2em; 
          border-bottom: 1px solid ${theme === 'dark' ? '#444' : '#eee'};
          padding-bottom: 0.3em;
        }
        h2 { 
          font-size: 1.5em; 
          border-bottom: 1px solid ${theme === 'dark' ? '#444' : '#eee'};
          padding-bottom: 0.3em;
        }
        h3 { font-size: 1.25em; }
        p {
          margin-bottom: 16px;
        }
        ul, ol {
          padding-left: 2em;
          margin-bottom: 16px;
        }
        li {
          margin-bottom: 8px;
        }
        code {
          background-color: ${theme === 'dark' ? '#2d2d2d' : '#f6f8fa'};
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.9em;
        }
        pre {
          background-color: ${theme === 'dark' ? '#2d2d2d' : '#f6f8fa'};
          padding: 16px;
          border-radius: 6px;
          overflow-x: auto;
        }
        pre code {
          background-color: transparent;
          padding: 0;
        }
        blockquote {
          border-left: 4px solid ${theme === 'dark' ? '#4a4a4a' : '#dfe2e5'};
          padding-left: 16px;
          color: ${theme === 'dark' ? '#aaa' : '#6a737d'};
          margin: 0 0 16px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
        }
        th, td {
          border: 1px solid ${theme === 'dark' ? '#444' : '#dfe2e5'};
          padding: 8px 12px;
          text-align: left;
        }
        th {
          background-color: ${theme === 'dark' ? '#2d2d2d' : '#f6f8fa'};
          font-weight: 600;
        }
        hr {
          border: 0;
          height: 1px;
          background-color: ${theme === 'dark' ? '#444' : '#e1e4e8'};
          margin: 24px 0;
        }
        strong {
          font-weight: 600;
        }
        em {
          font-style: italic;
        }
      </style>
    ` : '';

    // 완전한 HTML 문서 생성
    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename.replace('.html', '')}</title>
  ${styles}
</head>
<body>
  ${content}
</body>
</html>`;

    // Blob 생성 및 저장
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    saveAs(blob, filename);
  } catch (error) {
    console.error('HTML 생성 오류:', error);
    throw new Error('HTML 생성에 실패했습니다.');
  }
}

/**
 * 텍스트 파일로 내보내기
 */
export function exportToText(
  content: string,
  filename: string = 'document.txt'
): void {
  try {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, filename);
  } catch (error) {
    console.error('텍스트 파일 생성 오류:', error);
    throw new Error('텍스트 파일 생성에 실패했습니다.');
  }
}