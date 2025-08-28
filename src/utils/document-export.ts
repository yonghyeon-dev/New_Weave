import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

// 마크다운을 HTML로 변환 (간단한 변환기)
const convertMarkdownToHtml = (markdown: string): string => {
  let html = markdown;
  
  // 제목 변환
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // 굵은 글씨
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // 기울임
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // 리스트
  html = html.replace(/^\* (.+)/gim, '<li>$1</li>');
  html = html.replace(/^\- (.+)/gim, '<li>$1</li>');
  
  // 숫자 리스트
  html = html.replace(/^\d+\. (.+)/gim, '<li>$1</li>');
  
  // 줄바꿈
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  
  // 테이블 (간단한 처리)
  html = html.replace(/\|(.+)\|/g, (match, p1) => {
    const cells = p1.split('|').map((cell: string) => `<td>${cell.trim()}</td>`).join('');
    return `<tr>${cells}</tr>`;
  });
  
  return html;
};

// 마크다운을 Word 문서로 변환 (클래식 양식 적용)
export async function exportToWord(markdown: string, filename: string, title: string = '문서') {
  try {
    // html-docx-js-typescript 동적 import
    const { asBlob } = await import('html-docx-js-typescript');
    
    // 문서 번호 생성
    const docNumber = `WV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // 문서 타입에 따른 헤더 생성
    const getDocumentHeader = () => {
      const docTypeMap: { [key: string]: string } = {
        '견적서': 'QUOTATION',
        '계약서': 'CONTRACT',
        '제안서': 'PROPOSAL',
        '보고서': 'REPORT',
        '명세서': 'SPECIFICATION',
        '청구서': 'INVOICE'
      };
      
      return `
        <div style="text-align: center; margin-bottom: 40px; padding-bottom: 25px; border-bottom: 2px solid #333;">
          <div style="margin-bottom: 30px;">
            <div style="font-size: 24px; font-weight: 900; color: #2563eb; letter-spacing: 3px; margin-bottom: 5px;">WEAVE</div>
            <div style="font-size: 10pt; color: #666; letter-spacing: 0.5px;">AI 기반 비즈니스 문서 생성 플랫폼</div>
          </div>
          <h1 style="font-size: 28pt; font-weight: 700; margin: 20px 0 5px 0; color: #000; letter-spacing: 8px;">${title}</h1>
          <div style="font-size: 14pt; color: #666; letter-spacing: 2px; margin-bottom: 20px;">${docTypeMap[title] || 'DOCUMENT'}</div>
          <div style="font-size: 10pt; color: #555; text-align: center;">
            <span style="margin-right: 30px;">문서번호: ${docNumber}</span>
            <span>발행일: ${today}</span>
          </div>
        </div>
      `;
    };
    
    // 마크다운을 HTML로 변환
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            @page {
              size: A4;
              margin: 25mm;
            }
            
            body { 
              font-family: 'Malgun Gothic', 'Noto Sans KR', '맑은 고딕', sans-serif; 
              font-size: 11pt;
              line-height: 1.8;
              color: #222;
            }
            
            /* 제목 스타일 */
            h1 { 
              font-size: 18pt;
              font-weight: 700;
              margin: 30px 0 20px 0;
              color: #000;
              padding-bottom: 8px;
              border-bottom: 2px solid #333;
              page-break-after: avoid;
            }
            
            h2 { 
              font-size: 14pt;
              font-weight: 600;
              margin: 25px 0 15px 0;
              padding-bottom: 5px;
              border-bottom: 1px solid #666;
              color: #222;
              page-break-after: avoid;
            }
            
            h3 { 
              font-size: 12pt;
              font-weight: 600;
              margin: 20px 0 10px 0;
              color: #333;
              page-break-after: avoid;
            }
            
            /* 본문 스타일 */
            p { 
              margin: 10px 0;
              line-height: 1.8;
              text-align: justify;
            }
            
            /* 리스트 스타일 */
            ul, ol { 
              margin: 12px 0 12px 25px;
            }
            
            li { 
              margin: 6px 0;
              line-height: 1.6;
            }
            
            /* 테이블 스타일 */
            table { 
              border-collapse: collapse;
              width: 100%;
              margin: 25px 0;
              font-size: 10pt;
              border: 2px solid #333;
              page-break-inside: avoid;
            }
            
            th { 
              background: #f0f0f0;
              font-weight: 600;
              text-align: left;
              padding: 12px;
              border: 1px solid #666;
            }
            
            td { 
              padding: 10px 12px;
              border: 1px solid #999;
              background: white;
            }
            
            tr:nth-child(even) td {
              background: #fafafa;
            }
            
            /* 강조 텍스트 */
            strong { 
              font-weight: 600;
              color: #000;
            }
            
            em { 
              font-style: italic;
              color: #555;
            }
            
            /* 구분선 */
            hr {
              margin: 25px 0;
              border: none;
              border-top: 1px solid #666;
            }
            
            /* 서명 섹션 */
            .signature-section {
              margin-top: 60px;
              padding-top: 40px;
              border-top: 1px solid #666;
              page-break-inside: avoid;
            }
            
            .signature-box {
              margin-bottom: 40px;
            }
            
            .signature-label {
              font-size: 11pt;
              font-weight: 600;
              margin-bottom: 30px;
              color: #333;
            }
            
            .signature-line {
              width: 200px;
              border-bottom: 1px solid #333;
              margin: 20px 0 8px 0;
            }
            
            /* 푸터 */
            .doc-footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #999;
              text-align: center;
              font-size: 9pt;
              color: #666;
              line-height: 1.6;
              page-break-inside: avoid;
            }
          </style>
        </head>
        <body>
          ${getDocumentHeader()}
          <div class="document-content">
            ${convertMarkdownToHtml(markdown)}
          </div>
          <div class="signature-section">
            <table style="width: 100%; border: none;">
              <tr>
                <td style="width: 50%; border: none; padding: 0;">
                  <div class="signature-box">
                    <div class="signature-label">공급자</div>
                    <div class="signature-line"></div>
                    <div style="font-size: 9pt; color: #666;">(서명/날인)</div>
                  </div>
                </td>
                <td style="width: 50%; border: none; padding: 0;">
                  <div class="signature-box">
                    <div class="signature-label">수신자</div>
                    <div class="signature-line"></div>
                    <div style="font-size: 9pt; color: #666;">(서명/날인)</div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div class="doc-footer">
            <p><strong>WEAVE</strong> - AI Business Document Platform</p>
            <p>www.weave.co.kr | support@weave.co.kr</p>
          </div>
        </body>
      </html>
    `;

    // HTML을 Word 문서로 변환
    const docxBlob = await asBlob(htmlContent, {
      orientation: 'portrait',
      margins: { top: 720, right: 720, bottom: 720, left: 720 }
    });

    // Buffer인 경우 Blob으로 변환
    let blob: Blob;
    if (docxBlob instanceof Blob) {
      blob = docxBlob;
    } else {
      // Buffer를 Uint8Array로 변환 후 Blob 생성
      const uint8Array = new Uint8Array(docxBlob as unknown as ArrayBuffer);
      blob = new Blob([uint8Array], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
    }

    // 다운로드
    saveAs(blob, `${filename}.docx`);
    
    return true;
  } catch (error) {
    console.error('Word 내보내기 실패:', error);
    return false;
  }
}

// 인쇄 기능 추가
export function printDocument(markdown: string, title: string = '문서') {
  // 문서 번호 생성
  const docNumber = `WV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  
  // 문서 타입에 따른 헤더 생성
  const getDocumentHeader = () => {
    const docTypeMap: { [key: string]: string } = {
      '견적서': 'QUOTATION',
      '계약서': 'CONTRACT',
      '제안서': 'PROPOSAL',
      '보고서': 'REPORT',
      '명세서': 'SPECIFICATION',
      '청구서': 'INVOICE'
    };
    
    return `
      <div class="doc-header">
        <div class="company-section">
          <div class="company-logo">WEAVE</div>
          <div class="company-subtitle">AI 기반 비즈니스 문서 생성 플랫폼</div>
        </div>
        <h1 class="doc-title">${title}</h1>
        <div class="doc-title-en">${docTypeMap[title] || 'DOCUMENT'}</div>
        <div class="doc-meta">
          <div>문서번호: ${docNumber}</div>
          <div>발행일: ${today}</div>
        </div>
      </div>
    `;
  };
  
  // A4 인쇄용 스타일
  const printStyles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
      
      /* 인쇄 설정 */
      @media print {
        @page {
          size: A4;
          margin: 15mm;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body { 
          margin: 0 !important; 
          padding: 0 !important;
        }
        .document-wrapper { 
          box-shadow: none !important;
          margin: 0 !important;
        }
      }
      
      /* 기본 문서 스타일 */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Noto Sans KR', '맑은 고딕', 'Malgun Gothic', -apple-system, sans-serif;
        font-size: 11pt;
        line-height: 1.8;
        color: #222;
        background: white;
      }
      
      .document-wrapper {
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        background: white;
        padding: 25mm;
      }
      
      /* 문서 헤더 디자인 */
      .doc-header {
        text-align: center;
        margin-bottom: 40px;
        padding-bottom: 25px;
        border-bottom: 2px solid #333;
      }
      
      .company-section {
        margin-bottom: 30px;
      }
      
      .company-logo {
        font-size: 24px;
        font-weight: 900;
        color: #2563eb;
        letter-spacing: 3px;
        margin-bottom: 5px;
      }
      
      .company-subtitle {
        font-size: 10pt;
        color: #666;
        letter-spacing: 0.5px;
      }
      
      .doc-title {
        font-size: 28pt;
        font-weight: 700;
        margin: 20px 0 5px 0;
        color: #000;
        letter-spacing: 8px;
      }
      
      .doc-title-en {
        font-size: 14pt;
        color: #666;
        letter-spacing: 2px;
        margin-bottom: 20px;
      }
      
      .doc-meta {
        font-size: 10pt;
        color: #555;
        display: flex;
        justify-content: center;
        gap: 30px;
      }
      
      /* 콘텐츠 스타일 */
      h1 {
        font-size: 18pt;
        font-weight: 700;
        margin: 30px 0 20px 0;
        color: #000;
        padding-bottom: 8px;
        border-bottom: 2px solid #333;
      }
      
      h2 {
        font-size: 14pt;
        font-weight: 600;
        margin: 25px 0 15px 0;
        padding-bottom: 5px;
        border-bottom: 1px solid #666;
        color: #222;
      }
      
      h3 {
        font-size: 12pt;
        font-weight: 600;
        margin: 20px 0 10px 0;
        color: #333;
      }
      
      p {
        margin: 10px 0;
        line-height: 1.8;
        text-align: justify;
      }
      
      ul, ol {
        margin: 12px 0 12px 25px;
      }
      
      li {
        margin: 6px 0;
        line-height: 1.6;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 25px 0;
        font-size: 10pt;
        border: 2px solid #333;
      }
      
      th {
        background: #f0f0f0;
        font-weight: 600;
        text-align: left;
        padding: 12px;
        border: 1px solid #666;
      }
      
      td {
        padding: 10px 12px;
        border: 1px solid #999;
        background: white;
      }
      
      strong {
        font-weight: 600;
        color: #000;
      }
      
      /* 서명 섹션 */
      .signature-section {
        margin-top: 60px;
        display: flex;
        justify-content: space-between;
        padding-top: 40px;
        border-top: 1px solid #666;
      }
      
      .signature-box {
        width: 200px;
        text-align: center;
      }
      
      .signature-label {
        font-size: 11pt;
        font-weight: 600;
        margin-bottom: 60px;
        color: #333;
      }
      
      .signature-line {
        border-bottom: 1px solid #333;
        margin-bottom: 8px;
        height: 1px;
      }
      
      /* 푸터 */
      .doc-footer {
        margin-top: 50px;
        padding-top: 20px;
        border-top: 1px solid #999;
        text-align: center;
        font-size: 9pt;
        color: #666;
        line-height: 1.6;
      }
    </style>
  `;
  
  // HTML 변환
  const htmlContent = convertMarkdownToHtml(markdown);
  
  // 인쇄 창 열기
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          ${printStyles}
        </head>
        <body>
          <div class="document-wrapper">
            ${getDocumentHeader()}
            <div class="document-content">
              ${htmlContent}
            </div>
            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-label">공급자</div>
                <div class="signature-line"></div>
                <div class="signature-date">(서명/날인)</div>
              </div>
              <div class="signature-box">
                <div class="signature-label">수신자</div>
                <div class="signature-line"></div>
                <div class="signature-date">(서명/날인)</div>
              </div>
            </div>
            <div class="doc-footer">
              <p><strong>WEAVE</strong> - AI Business Document Platform</p>
              <p>www.weave.co.kr | support@weave.co.kr</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

