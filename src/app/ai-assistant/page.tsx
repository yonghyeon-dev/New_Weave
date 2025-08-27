'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Typography from '@/components/ui/Typography';
import Alert from '@/components/ui/Alert';
import { 
  MessageCircle, 
  Calculator, 
  Send, 
  Bot, 
  User, 
  BookOpen, 
  AlertCircle, 
  CheckCircle,
  Cpu,
  FileText,
  Search,
  Upload,
  Download,
  FileUp,
  Copy
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'general' | 'tax' | 'document' | 'extract' | 'file';
}

interface TaxQuestion {
  id: string;
  title: string;
  category: string;
  description: string;
}

interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  fields: string[];
}

const commonQuestions: TaxQuestion[] = [
  {
    id: '1',
    title: '부가세 신고 기한은 언제인가요?',
    category: '부가세',
    description: '부가세 신고와 납부 기한에 대해 궁금합니다.'
  },
  {
    id: '2',
    title: '프리랜서 종합소득세 신고 방법',
    category: '소득세',
    description: '프리랜서로 일하는데 종합소득세를 어떻게 신고해야 하나요?'
  },
  {
    id: '3',
    title: '사업용 차량 구입 시 세금 혜택',
    category: '법인세',
    description: '법인명의로 차량을 구입할 때 받을 수 있는 세금 혜택이 있나요?'
  },
  {
    id: '4',
    title: '홈택스 전자신고 방법',
    category: '전자신고',
    description: '홈택스를 통한 전자신고 절차가 궁금합니다.'
  }
];

const quickQuestions = [
  '인보이스 작성 방법을 알려주세요',
  '클라이언트 관리 팁을 알려주세요',
  '계약서 작성할 때 주의사항은?',
  '업무 효율성을 높이는 방법은?'
];

const documentTemplates: DocumentTemplate[] = [
  {
    id: 'contract',
    name: '표준 계약서',
    category: '계약서',
    description: '서비스/제품 공급 표준 계약서',
    fields: ['계약 당사자', '계약 내용', '계약 기간', '대금', '특약사항']
  },
  {
    id: 'proposal',
    name: '사업 제안서',
    category: '제안서',
    description: '프로젝트 또는 사업 제안서',
    fields: ['제안 배경', '제안 내용', '예산', '일정', '기대효과']
  },
  {
    id: 'invoice',
    name: '세금계산서',
    category: '회계',
    description: '세금계산서 자동 생성',
    fields: ['공급자', '공급받는자', '품목', '단가', '공급가액', 'VAT']
  },
  {
    id: 'minutes',
    name: '회의록',
    category: '보고서',
    description: '회의 내용 정리 및 문서화',
    fields: ['회의 일시', '참석자', '안건', '논의사항', '결정사항']
  }
];

export default function AIAssistant() {
  const [activeTab, setActiveTab] = useState<'document' | 'chat' | 'tax' | 'extract' | 'file'>('document');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '안녕하세요! AI 업무 비서입니다. 어떤 도움이 필요하신가요?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'general'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentFields, setDocumentFields] = useState<Record<string, string>>({});
  const [generatedDocument, setGeneratedDocument] = useState<string>('');

  const categories = ['전체', '부가세', '소득세', '법인세', '전자신고', '기타'];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: activeTab === 'tax' ? 'tax' : activeTab === 'chat' ? 'general' : activeTab
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // 모의 AI 응답
    setTimeout(() => {
      let aiResponse = '';
      
      if (activeTab === 'tax') {
        aiResponse = `
"${inputMessage}"에 대한 세무 답변입니다.

**핵심 내용:**
• 관련 법령: 소득세법 제1조, 부가가치세법 제2조
• 신고 기한: 매년 5월 31일까지
• 필요 서류: 소득금액증명원, 사업자등록증

**상세 설명:**
현재 질문하신 내용은 일반적인 세무 처리 절차에 해당합니다. 구체적인 사항은 개인의 상황에 따라 달라질 수 있으므로, 정확한 처리를 위해서는 세무사와의 개별 상담을 권장합니다.

⚠️ 본 답변은 일반적인 정보 제공을 위한 것으로, 개별 사안에 대한 전문적인 세무 상담이 필요할 수 있습니다.
        `.trim();
      } else if (activeTab === 'document') {
        aiResponse = `문서 생성과 관련된 도움을 드리겠습니다. 왼쪽 템플릿에서 원하시는 문서 유형을 선택하시거나, 구체적인 문서 작성 요청을 말씀해 주세요.`;
      } else if (activeTab === 'extract') {
        aiResponse = `정보 추출 기능입니다. PDF, 이미지, 텍스트 파일을 업로드하시면 주요 정보를 자동으로 추출해 드립니다.`;
      } else if (activeTab === 'file') {
        aiResponse = `파일 처리 기능입니다. 대용량 파일 변환이나 포맷 변경을 도와드립니다.`;
      } else {
        aiResponse = `"${inputMessage}"에 대해 도움을 드리겠습니다. 구체적으로 어떤 업무를 진행하고 계신가요?

업무와 관련된 추가적인 질문이 있으시면 언제든 말씀해 주세요.`;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: activeTab === 'tax' ? 'tax' : activeTab === 'chat' ? 'general' : activeTab
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuestionClick = (question: string) => {
    setInputMessage(question);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const message = `"${file.name}" 파일이 업로드되었습니다. 처리를 시작합니다...`;
      const uploadMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender: 'ai',
        timestamp: new Date(),
        type: activeTab === 'extract' ? 'extract' : 'file'
      };
      setMessages(prev => [...prev, uploadMessage]);
    }
  };

  const handleGenerateDocument = () => {
    const template = documentTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    // 문서 생성 로직 (실제로는 API 호출)
    let document = `【 ${template.name} 】\n\n`;
    document += `작성일자: ${new Date().toLocaleDateString('ko-KR')}\n\n`;
    document += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    template.fields.forEach(field => {
      const value = documentFields[field] || '[미입력]';
      document += `■ ${field}\n`;
      document += `${value}\n\n`;
    });
    
    document += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    document += `※ 본 문서는 AI에 의해 자동 생성되었습니다.\n`;
    document += `※ 법적 효력을 위해서는 전문가 검토가 필요할 수 있습니다.`;
    
    setGeneratedDocument(document);
  };

  const filteredMessages = messages.filter(msg => {
    if (activeTab === 'chat') return msg.type === 'general';
    if (activeTab === 'tax') return msg.type === 'tax';
    if (activeTab === 'document') return msg.type === 'document' || msg.type === 'general';
    if (activeTab === 'extract') return msg.type === 'extract' || msg.type === 'general';
    if (activeTab === 'file') return msg.type === 'file' || msg.type === 'general';
    return false;
  });

  return (
    <AppLayout>
      <div className="bg-bg-primary p-6">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-weave-primary-light rounded-lg">
                <Cpu className="w-6 h-6 text-weave-primary" />
              </div>
              <div>
                <Typography variant="h2" className="text-2xl mb-1">AI 업무비서</Typography>
                <Typography variant="body1" className="text-txt-secondary">
                  통합 AI 기반 업무 자동화 허브
                </Typography>
              </div>
            </div>

            {/* 탭 네비게이션 - 기존 스타일 유지 */}
            <div className="flex space-x-1 bg-bg-secondary rounded-lg p-1 w-fit">
              <button
                onClick={() => setActiveTab('document')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'document'
                    ? 'bg-white text-weave-primary shadow-sm'
                    : 'text-txt-secondary hover:text-txt-primary'
                }`}
              >
                <FileText className="w-4 h-4" />
                문서 생성
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'chat'
                    ? 'bg-white text-weave-primary shadow-sm'
                    : 'text-txt-secondary hover:text-txt-primary'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                AI 상담
              </button>
              <button
                onClick={() => setActiveTab('tax')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'tax'
                    ? 'bg-white text-weave-primary shadow-sm'
                    : 'text-txt-secondary hover:text-txt-primary'
                }`}
              >
                <Calculator className="w-4 h-4" />
                세무 상담
              </button>
              <button
                onClick={() => setActiveTab('extract')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'extract'
                    ? 'bg-white text-weave-primary shadow-sm'
                    : 'text-txt-secondary hover:text-txt-primary'
                }`}
              >
                <Search className="w-4 h-4" />
                정보 추출
              </button>
              <button
                onClick={() => setActiveTab('file')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'file'
                    ? 'bg-white text-weave-primary shadow-sm'
                    : 'text-txt-secondary hover:text-txt-primary'
                }`}
              >
                <Upload className="w-4 h-4" />
                파일 처리
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 메인 영역 */}
            <div className="lg:col-span-2">
              {/* 문서 생성 탭 */}
              {activeTab === 'document' && (
                <div className="space-y-6">
                  {/* 템플릿 선택 */}
                  <Card className="p-6">
                    <Typography variant="h3" className="mb-4">문서 템플릿 선택</Typography>
                    <div className="grid grid-cols-2 gap-3">
                      {documentTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`p-4 text-left rounded-lg border transition-all ${
                            selectedTemplate === template.id
                              ? 'bg-weave-primary-light border-weave-primary'
                              : 'bg-white border-border-light hover:bg-bg-secondary'
                          }`}
                        >
                          <Typography variant="body2" className="font-medium mb-1">
                            {template.name}
                          </Typography>
                          <Typography variant="body2" className="text-txt-secondary text-xs">
                            {template.description}
                          </Typography>
                          <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                            selectedTemplate === template.id
                              ? 'bg-weave-primary text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {template.category}
                          </span>
                        </button>
                      ))}
                    </div>
                  </Card>

                  {/* 선택된 템플릿 필드 입력 */}
                  {selectedTemplate && (
                    <Card className="p-6">
                      <Typography variant="h3" className="mb-4">
                        {documentTemplates.find(t => t.id === selectedTemplate)?.name} 작성
                      </Typography>
                      <div className="space-y-4">
                        {documentTemplates.find(t => t.id === selectedTemplate)?.fields.map((field) => (
                          <div key={field}>
                            <label className="block text-sm font-medium text-txt-secondary mb-2">
                              {field}
                            </label>
                            <Input
                              placeholder={`${field} 내용을 입력하세요...`}
                              className="w-full"
                              value={documentFields[field] || ''}
                              onChange={(e) => setDocumentFields(prev => ({
                                ...prev,
                                [field]: e.target.value
                              }))}
                            />
                          </div>
                        ))}
                        <div className="flex gap-3">
                          <Button onClick={() => handleGenerateDocument()}>
                            <FileText className="w-4 h-4 mr-2" />
                            문서 생성
                          </Button>
                          <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            템플릿 저장
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* 문서 프리뷰 */}
                  {generatedDocument && (
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Typography variant="h3">생성된 문서 미리보기</Typography>
                        <div className="flex gap-2">
                          <Button variant="outline">
                            <Copy className="w-4 h-4 mr-1" />
                            복사
                          </Button>
                          <Button variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            다운로드
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 bg-bg-secondary rounded-lg">
                        <Typography variant="body1" className="whitespace-pre-wrap">
                          {generatedDocument}
                        </Typography>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {/* 정보 추출 / 파일 처리 탭 */}
              {(activeTab === 'extract' || activeTab === 'file') && (
                <Card className="p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="mb-6">
                      {activeTab === 'extract' ? (
                        <FileUp className="w-16 h-16 mx-auto text-weave-primary mb-4" />
                      ) : (
                        <Upload className="w-16 h-16 mx-auto text-weave-primary mb-4" />
                      )}
                      <Typography variant="h3" className="mb-2">
                        {activeTab === 'extract' ? '파일에서 정보 추출' : '파일 처리'}
                      </Typography>
                      <Typography variant="body1" className="text-txt-secondary">
                        {activeTab === 'extract' 
                          ? 'PDF, 이미지, 텍스트 파일에서 핵심 정보를 자동으로 추출합니다'
                          : '대용량 파일 처리 및 다양한 포맷 변환을 지원합니다'}
                      </Typography>
                    </div>

                    <div className="border-2 border-dashed border-border-light rounded-lg p-8 mb-4">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileUpload}
                        accept={activeTab === 'extract' ? '.pdf,.png,.jpg,.jpeg,.txt' : '*'}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="inline-flex items-center justify-center px-4 py-2 bg-weave-primary text-white rounded-md hover:bg-weave-primary/90 transition-colors">
                          파일 선택
                        </span>
                        <Typography variant="body2" className="text-txt-tertiary mt-3">
                          또는 파일을 여기로 드래그하세요
                        </Typography>
                      </label>
                    </div>

                    {uploadedFile && (
                      <div className="p-3 bg-green-50 rounded-lg text-left">
                        <Typography variant="body2" className="text-green-800">
                          업로드된 파일: {uploadedFile.name}
                        </Typography>
                      </div>
                    )}

                    {activeTab === 'file' && (
                      <div className="flex justify-center gap-4 text-xs text-txt-tertiary mt-4">
                        <span>• 최대 100MB</span>
                        <span>• 암호화 전송</span>
                        <span>• 자동 바이러스 검사</span>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* 채팅 영역 (AI 상담, 세무 상담) */}
              {(activeTab === 'chat' || activeTab === 'tax') && (
                <Card className="flex flex-col h-[600px]">
                  {/* 채팅 메시지 영역 */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-4">
                      {filteredMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex items-start gap-3 ${
                            message.sender === 'user' ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <div className={`p-2 rounded-full ${
                            message.sender === 'user' 
                              ? 'bg-weave-primary text-white' 
                              : 'bg-gray-100'
                          }`}>
                            {message.sender === 'user' ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </div>
                          <div className={`max-w-[70%] ${
                            message.sender === 'user' ? 'text-right' : ''
                          }`}>
                            <div className={`p-3 rounded-lg ${
                              message.sender === 'user'
                                ? 'bg-weave-primary text-white'
                                : 'bg-gray-100 text-txt-primary'
                            }`}>
                              <Typography variant="body1" className={`whitespace-pre-line ${
                                message.sender === 'user' ? 'text-white' : 'text-txt-primary'
                              }`}>
                                {message.content}
                              </Typography>
                            </div>
                            <Typography variant="body2" className={`mt-1 text-txt-tertiary ${
                              message.sender === 'user' ? 'text-right' : ''
                            }`}>
                              {message.timestamp.toLocaleTimeString('ko-KR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                          </div>
                        </div>
                      ))}
                      
                      {isLoading && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-gray-100">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="p-3 rounded-lg bg-gray-100">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 입력 영역 */}
                  <div className="p-4 border-t border-border-light">
                    {activeTab === 'tax' && (
                      <div className="mb-3">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="px-3 py-2 border border-border-light rounded-lg text-sm focus:ring-2 focus:ring-weave-primary focus:border-transparent"
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Input
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder={activeTab === 'tax' ? '세무 관련 질문을 입력하세요...' : '메시지를 입력하세요...'}
                          disabled={isLoading}
                        />
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="px-4"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 빠른 질문 (AI 상담) */}
              {activeTab === 'chat' && (
                <Card className="p-6">
                  <Typography variant="h3" className="mb-4">빠른 질문</Typography>
                  <div className="space-y-3">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full text-left justify-start p-3 h-auto text-sm"
                        onClick={() => handleQuestionClick(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </Card>
              )}

              {/* 자주 묻는 세무 질문 */}
              {activeTab === 'tax' && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-weave-primary" />
                    <Typography variant="h3">자주 묻는 질문</Typography>
                  </div>
                  
                  <div className="space-y-3">
                    {commonQuestions.map((question) => (
                      <button
                        key={question.id}
                        onClick={() => handleQuestionClick(question.title)}
                        className="w-full p-3 text-left rounded-lg border border-border-light hover:bg-bg-secondary transition-colors"
                      >
                        <Typography variant="body2" className="font-medium mb-1">
                          {question.title}
                        </Typography>
                        <Typography variant="body2" className="text-txt-secondary text-xs">
                          {question.description}
                        </Typography>
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {question.category}
                        </span>
                      </button>
                    ))}
                  </div>
                </Card>
              )}

              {/* 문서 생성 가이드 */}
              {activeTab === 'document' && (
                <Card className="p-6">
                  <Typography variant="h3" className="mb-4">문서 생성 가이드</Typography>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Typography variant="body2" className="text-blue-800 font-medium mb-1">
                        1. 템플릿 선택
                      </Typography>
                      <Typography variant="body2" className="text-blue-700 text-xs">
                        왼쪽에서 원하는 문서 템플릿을 선택하세요
                      </Typography>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Typography variant="body2" className="text-blue-800 font-medium mb-1">
                        2. 필드 입력
                      </Typography>
                      <Typography variant="body2" className="text-blue-700 text-xs">
                        필요한 정보를 각 필드에 입력하세요
                      </Typography>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Typography variant="body2" className="text-blue-800 font-medium mb-1">
                        3. 문서 생성
                      </Typography>
                      <Typography variant="body2" className="text-blue-700 text-xs">
                        AI가 자동으로 문서를 생성합니다
                      </Typography>
                    </div>
                  </div>
                </Card>
              )}

              {/* 정보 추출 안내 */}
              {activeTab === 'extract' && (
                <Card className="p-6">
                  <Typography variant="h3" className="mb-4">지원 파일 형식</Typography>
                  <div className="space-y-2">
                    {['PDF 문서', '이미지 (PNG, JPG)', '텍스트 파일', 'Word 문서', 'Excel 스프레드시트'].map((format) => (
                      <div key={format} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <Typography variant="body2">{format}</Typography>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* 파일 처리 안내 */}
              {activeTab === 'file' && (
                <Card className="p-6">
                  <Typography variant="h3" className="mb-4">파일 처리 기능</Typography>
                  <div className="space-y-2">
                    {['포맷 변환', '파일 압축', '대용량 파일 분할', '메타데이터 추출', '보안 암호화'].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <Typography variant="body2">{feature}</Typography>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* 세무 일정 (세무 탭에서만) */}
              {activeTab === 'tax' && (
                <Card className="p-6">
                  <Typography variant="h3" className="mb-4">주요 세무 일정</Typography>
                  
                  <div className="space-y-3">
                    {[
                      { date: '매월 10일', event: '원천세 신고·납부' },
                      { date: '매월 25일', event: '부가세 신고·납부' },
                      { date: '5월 31일', event: '종합소득세 신고·납부' },
                      { date: '11월 30일', event: '연말정산 서류 제출' }
                    ].map((schedule, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg">
                        <div className="w-2 h-2 bg-weave-primary rounded-full flex-shrink-0" />
                        <div>
                          <Typography variant="body2" className="font-medium">
                            {schedule.date}
                          </Typography>
                          <Typography variant="body2" className="text-txt-secondary">
                            {schedule.event}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* 알림사항 */}
              <Card className="p-6">
                <Alert
                  variant="warning"
                  title="알림사항"
                >
                  {activeTab === 'tax' 
                    ? '제공되는 정보는 일반적인 세무 가이드입니다. 구체적인 사안은 세무 전문가와 상담하시기 바랍니다.'
                    : activeTab === 'document'
                    ? '생성된 문서는 법적 검토가 필요할 수 있습니다. 중요한 계약은 전문가 검토를 받으시기 바랍니다.'
                    : 'AI가 제공하는 정보는 참고용입니다. 중요한 업무 결정 시에는 전문가와 상담하시기 바랍니다.'
                  }
                </Alert>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}