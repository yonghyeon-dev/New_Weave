'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Typography from '@/components/ui/Typography';
import { 
  MessageCircle, 
  Calculator, 
  Send, 
  Bot, 
  User, 
  BookOpen, 
  AlertCircle, 
  CheckCircle,
  Cpu
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'general' | 'tax';
}

interface TaxQuestion {
  id: string;
  title: string;
  category: string;
  description: string;
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

export default function AIConsultPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'tax'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '안녕하세요! AI 업무 비서입니다. 어떤 도움이 필요하신가요?',
      sender: 'ai',
      timestamp: new Date('2025-08-25T09:00:00'),
      type: 'general'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const categories = ['전체', '부가세', '소득세', '법인세', '전자신고', '기타'];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: activeTab === 'tax' ? 'tax' : 'general'
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

**추가 참고사항:**
- 국세청 홈택스(www.hometax.go.kr)에서 관련 양식을 다운로드할 수 있습니다.
- 세무서 방문 시 신분증과 관련 서류를 준비하시기 바랍니다.

⚠️ 본 답변은 일반적인 정보 제공을 위한 것으로, 개별 사안에 대한 전문적인 세무 상담이 필요할 수 있습니다.
        `.trim();
      } else {
        aiResponse = `"${inputMessage}"에 대해 도움을 드리겠습니다. 구체적으로 어떤 업무를 진행하고 계신가요?

업무와 관련된 추가적인 질문이 있으시면 언제든 말씀해 주세요. 더 나은 답변을 위해 상황을 자세히 설명해 주시면 도움이 됩니다.`;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: activeTab === 'tax' ? 'tax' : 'general'
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

  const filteredMessages = messages.filter(msg => 
    activeTab === 'chat' ? msg.type !== 'tax' : msg.type === 'tax'
  );

  return (
    <AppLayout>
      <div className="bg-bg-primary p-6">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-weave-primary-light rounded-lg">
                <MessageCircle className="w-6 h-6 text-weave-primary" />
              </div>
              <div>
                <Typography variant="h1" className="mb-1">AI 상담</Typography>
                <Typography variant="body1" className="text-txt-secondary">
                  AI 채팅 및 세무 상담 통합 서비스
                </Typography>
              </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex space-x-1 bg-bg-secondary rounded-lg p-1 w-fit">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'chat'
                    ? 'bg-white text-weave-primary shadow-sm'
                    : 'text-txt-secondary hover:text-txt-primary'
                }`}
              >
                <Cpu className="w-4 h-4" />
                AI 채팅
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
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 메인 채팅 영역 */}
            <div className="lg:col-span-2">
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
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 빠른 질문 */}
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

              {/* 연락처 (세무 탭에서만) */}
              {activeTab === 'tax' && (
                <Card className="p-6">
                  <Typography variant="h3" className="mb-4">전문가 연락처</Typography>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <Typography variant="body2" className="font-medium text-green-800">
                          국세청 상담센터
                        </Typography>
                      </div>
                      <Typography variant="body2" className="text-green-700">
                        ☎ 126 (평일 9:00~18:00)
                      </Typography>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <Typography variant="body2" className="font-medium text-blue-800">
                          홈택스 고객센터
                        </Typography>
                      </div>
                      <Typography variant="body2" className="text-blue-700">
                        ☎ 1588-0060
                      </Typography>
                    </div>
                  </div>
                </Card>
              )}

              {/* 알림사항 */}
              <Card className="p-6">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <Typography variant="body2" className="text-yellow-800 font-medium">
                        알림사항
                      </Typography>
                      <Typography variant="body2" className="text-yellow-700 mt-1">
                        {activeTab === 'tax' 
                          ? '제공되는 정보는 일반적인 세무 가이드입니다. 구체적인 사안은 세무 전문가와 상담하시기 바랍니다.'
                          : 'AI가 제공하는 정보는 참고용입니다. 중요한 업무 결정 시에는 전문가와 상담하시기 바랍니다.'
                        }
                      </Typography>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}