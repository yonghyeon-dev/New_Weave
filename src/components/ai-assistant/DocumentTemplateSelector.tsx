'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { Search, ChevronLeft, FileText, Sparkles } from 'lucide-react';
import { 
  documentCategories, 
  TemplateInfo, 
  getPopularTemplates, 
  searchTemplates 
} from '@/lib/document-categories';

interface DocumentTemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
  className?: string;
}

export default function DocumentTemplateSelector({ 
  onSelectTemplate,
  className = ''
}: DocumentTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopular, setShowPopular] = useState(true);

  // 검색 결과 또는 선택된 카테고리의 템플릿 목록
  const displayTemplates = searchQuery 
    ? searchTemplates(searchQuery)
    : selectedCategory 
      ? documentCategories.find(cat => cat.id === selectedCategory)?.templates || []
      : showPopular 
        ? getPopularTemplates()
        : [];

  const handleTemplateSelect = (template: TemplateInfo) => {
    onSelectTemplate(template.id);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowPopular(false);
    setSearchQuery('');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setShowPopular(true);
  };

  return (
    <Card className={`bg-white rounded-lg border border-border-light p-6 ${className}`}>
      {/* 헤더 */}
      <div className="mb-6">
        <Typography variant="h2" className="text-2xl mb-2">
          문서 템플릿 선택
        </Typography>
        <Typography variant="body1" className="text-txt-secondary">
          필요한 문서 템플릿을 선택하세요. AI가 맞춤형 문서를 생성해드립니다.
        </Typography>
      </div>

      {/* 검색바 */}
      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="템플릿 검색... (예: 계약서, 제안서, 견적서)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4"
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* 네비게이션 */}
      {selectedCategory && !searchQuery && (
        <button
          onClick={handleBackToCategories}
          className="mb-4 flex items-center text-sm text-txt-secondary hover:text-txt-primary"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          카테고리로 돌아가기
        </button>
      )}

      {/* 카테고리 그리드 또는 템플릿 목록 */}
      {!selectedCategory && !searchQuery ? (
        <>
          {/* 인기 템플릿 */}
          {showPopular && (
            <div className="mb-8">
              <Typography variant="h3" className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">🔥</span>
                인기 템플릿
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getPopularTemplates().map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className="p-4 border border-border-light rounded-lg hover:border-weave-primary hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Typography variant="body1" className="font-medium">
                          {template.name}
                        </Typography>
                        <Typography variant="body2" className="text-txt-tertiary mt-1">
                          {template.description}
                        </Typography>
                      </div>
                      <Badge 
                        variant={template.type === 'detailed' ? 'primary' : 'secondary'}
                        className="ml-3"
                      >
                        {template.type === 'detailed' ? '상세' : '약식'}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 카테고리 목록 */}
          <div>
            <Typography variant="h3" className="text-lg font-semibold mb-4">
              카테고리별 찾기
            </Typography>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {documentCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`p-6 rounded-xl border-2 ${category.color} hover:scale-105 transition-transform text-center`}
                >
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <Typography variant="body1" className="font-semibold mb-1">
                    {category.name}
                  </Typography>
                  <Typography variant="body2" className="text-xs opacity-75">
                    {category.templates.length}개 템플릿
                  </Typography>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* 템플릿 목록 */
        <div>
          {searchQuery && (
            <Typography variant="h3" className="text-lg font-semibold mb-4">
              "{searchQuery}" 검색 결과 ({displayTemplates.length}개)
            </Typography>
          )}
          {selectedCategory && !searchQuery && (
            <Typography variant="h3" className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">
                {documentCategories.find(cat => cat.id === selectedCategory)?.icon}
              </span>
              {documentCategories.find(cat => cat.id === selectedCategory)?.name}
            </Typography>
          )}
          
          {displayTemplates.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {displayTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="p-4 border border-border-light rounded-lg hover:border-weave-primary hover:bg-blue-50 transition-colors text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Typography variant="body1" className="font-medium group-hover:text-weave-primary flex items-center">
                        {template.name}
                        <Badge 
                          variant={template.type === 'detailed' ? 'primary' : 'secondary'}
                          className="ml-2"
                        >
                          {template.type === 'detailed' ? '상세' : '약식'}
                        </Badge>
                      </Typography>
                      <Typography variant="body2" className="text-txt-tertiary mt-1">
                        {template.description}
                      </Typography>
                    </div>
                    <FileText className="h-5 w-5 text-txt-tertiary group-hover:text-weave-primary" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-txt-tertiary">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}

      {/* AI 안내 */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <Typography variant="body1" className="font-medium text-blue-900 mb-2 flex items-center">
          <Sparkles className="w-5 h-5 mr-2" />
          AI 문서 생성 안내
        </Typography>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Gemini AI가 선택한 템플릿을 기반으로 맞춤형 문서를 생성합니다</p>
          <p>• <span className="font-medium">약식</span>: 간단한 프로젝트나 소규모 작업에 적합</p>
          <p>• <span className="font-medium">상세</span>: 큰 프로젝트나 법적 보호가 중요한 경우에 적합</p>
          <p>• 생성된 문서는 필요에 따라 편집 가능합니다</p>
        </div>
      </div>
    </Card>
  );
}