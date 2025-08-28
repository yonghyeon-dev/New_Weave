'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { 
  Search, 
  ChevronLeft, 
  FileText, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Star,
  Zap
} from 'lucide-react';
import { 
  documentCategories, 
  TemplateInfo, 
  getPopularTemplates, 
  searchTemplates 
} from '@/lib/document-categories';
import { DocumentType } from '@/types/document-workflow';
import { documentTemplates } from '@/templates/document-templates';

interface DocumentTemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
  documentType?: DocumentType | null;
  className?: string;
}

export default function DocumentTemplateSelector({ 
  onSelectTemplate,
  documentType,
  className = ''
}: DocumentTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopular, setShowPopular] = useState(true);

  // 문서 종류에 따른 템플릿 ID 매핑
  const getTemplateIdsByDocumentType = (docType: DocumentType | null | undefined) => {
    if (!docType) return null;
    
    const typeToTemplateMap: { [key: string]: string[] } = {
      'contract': ['contract-001'],
      'proposal': ['proposal-001'],
      'quotation': ['quotation-001'],
      'invoice': ['quotation-001'], // 청구서는 견적서 템플릿 사용
      'report': ['report-001'],
      'specification': ['spec-001']
    };
    
    return typeToTemplateMap[docType.id] || null;
  };

  // 검색 결과 또는 선택된 카테고리의 템플릿 목록
  let displayTemplates = searchQuery 
    ? searchTemplates(searchQuery)
    : selectedCategory 
      ? documentCategories.find(cat => cat.id === selectedCategory)?.templates || []
      : showPopular 
        ? getPopularTemplates()
        : [];

  // 문서 종류가 선택된 경우 필터링
  if (documentType) {
    const allowedTemplateIds = getTemplateIdsByDocumentType(documentType);
    if (allowedTemplateIds) {
      displayTemplates = displayTemplates.filter(template => 
        allowedTemplateIds.includes(template.id)
      );
    }
  }

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

  // 카테고리별 배경색 클래스 (일관된 색상 시스템)
  const getCategoryColor = (categoryId: string) => {
    const colors: { [key: string]: string } = {
      development: 'bg-white border-blue-200 hover:border-blue-400 hover:shadow-md',
      business: 'bg-white border-green-200 hover:border-green-400 hover:shadow-md',
      creative: 'bg-white border-purple-200 hover:border-purple-400 hover:shadow-md',
      legal: 'bg-white border-red-200 hover:border-red-400 hover:shadow-md',
      marketing: 'bg-white border-yellow-200 hover:border-yellow-400 hover:shadow-md',
      general: 'bg-white border-gray-200 hover:border-gray-400 hover:shadow-md'
    };
    return colors[categoryId] || 'bg-white border-gray-200 hover:shadow-md';
  };

  // 카테고리별 아이콘 배경색
  const getIconBgColor = (categoryId: string) => {
    const colors: { [key: string]: string } = {
      development: 'bg-blue-50',
      business: 'bg-green-50',
      creative: 'bg-purple-50',
      legal: 'bg-red-50',
      marketing: 'bg-yellow-50',
      general: 'bg-gray-50'
    };
    return colors[categoryId] || 'bg-gray-50';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 메인 카드 */}
      <Card className="bg-white rounded-lg border border-border-light p-6">
        {/* 헤더 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Typography variant="h3" className="text-xl font-semibold text-txt-primary">
                문서 템플릿 선택
              </Typography>
              {documentType && (
                <div className="mt-2">
                  <Badge variant="secondary" className="inline-flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {documentType.name} 템플릿 표시 중
                  </Badge>
                </div>
              )}
            </div>
            <Badge variant="primary" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>AI 지원</span>
            </Badge>
          </div>
          <Typography variant="body1" className="text-txt-secondary">
            {documentType 
              ? `${documentType.name} 관련 템플릿만 표시됩니다.`
              : '필요한 문서 템플릿을 선택하세요. AI가 맞춤형 문서를 생성해드립니다.'}
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
              className="w-full pl-10 pr-4 h-11"
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-txt-tertiary" />
          </div>
        </div>

        {/* 네비게이션 */}
        {selectedCategory && !searchQuery && (
          <Button
            variant="ghost"
            onClick={handleBackToCategories}
            className="mb-4 flex items-center text-sm"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            카테고리로 돌아가기
          </Button>
        )}

        {/* 카테고리 그리드 또는 템플릿 목록 */}
        {!selectedCategory && !searchQuery ? (
          <>
            {/* 인기 템플릿 */}
            {showPopular && (() => {
              // 문서 종류별 필터링된 인기 템플릿
              let popularTemplates = getPopularTemplates();
              if (documentType) {
                const allowedTemplateIds = getTemplateIdsByDocumentType(documentType);
                if (allowedTemplateIds) {
                  popularTemplates = popularTemplates.filter(template => 
                    allowedTemplateIds.includes(template.id)
                  );
                }
              }
              
              if (popularTemplates.length === 0) return null;
              
              return (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                    </div>
                    <Typography variant="h4" className="text-lg font-semibold text-txt-primary">
                      인기 템플릿
                    </Typography>
                    <Badge variant="secondary" className="ml-3">
                      자주 사용
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {popularTemplates.slice(0, 4).map((template) => (
                    <Card
                      key={template.id}
                      className="bg-white border border-border-light hover:shadow-lg hover:border-weave-primary/30 transition-all cursor-pointer group"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-bg-secondary rounded-lg group-hover:bg-weave-primary/10 transition-colors">
                              <FileText className="w-5 h-5 text-txt-primary group-hover:text-weave-primary transition-colors" />
                            </div>
                            <div className="flex-1">
                              <Typography variant="body1" className="font-medium text-txt-primary group-hover:text-weave-primary transition-colors">
                                {template.name}
                              </Typography>
                              <Typography variant="body2" className="text-txt-tertiary mt-1">
                                {template.description}
                              </Typography>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-light">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <Typography variant="body2" className="text-txt-tertiary">
                              인기 템플릿
                            </Typography>
                          </div>
                          <Badge 
                            variant={template.type === 'detailed' ? 'primary' : 'secondary'}
                            size="sm"
                          >
                            {template.type === 'detailed' ? '상세' : '약식'}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* 카테고리 목록 */}
            <div>
              <div className="flex items-center mb-4">
                <div className="p-2 bg-bg-secondary rounded-lg mr-3">
                  <FileText className="w-5 h-5 text-txt-primary" />
                </div>
                <Typography variant="h4" className="text-lg font-semibold text-txt-primary">
                  카테고리별 찾기
                </Typography>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {documentCategories.map((category) => (
                  <Card
                    key={category.id}
                    className={`border ${getCategoryColor(category.id)} transition-all cursor-pointer group`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <div className="p-6 text-center">
                      <div className={`w-16 h-16 ${getIconBgColor(category.id)} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <span className="text-3xl">{category.icon}</span>
                      </div>
                      <Typography variant="body1" className="font-semibold text-txt-primary mb-2">
                        {category.name}
                      </Typography>
                      <Typography variant="body2" className="text-txt-tertiary">
                        {category.templates.length}개 템플릿
                      </Typography>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* 템플릿 목록 */
          <div>
            {/* 검색 결과 헤더 */}
            {searchQuery && (
              <div className="mb-4">
                <Typography variant="h4" className="text-lg font-semibold text-txt-primary">
                  "{searchQuery}" 검색 결과
                </Typography>
                <Typography variant="body2" className="text-txt-tertiary mt-1">
                  {displayTemplates.length}개의 템플릿을 찾았습니다
                </Typography>
              </div>
            )}
            
            {/* 카테고리 헤더 */}
            {selectedCategory && !searchQuery && (
              <div className="flex items-center mb-4">
                <div className={`p-2 ${getIconBgColor(selectedCategory)} rounded-lg mr-3`}>
                  <span className="text-2xl">
                    {documentCategories.find(cat => cat.id === selectedCategory)?.icon}
                  </span>
                </div>
                <div>
                  <Typography variant="h4" className="text-lg font-semibold text-txt-primary">
                    {documentCategories.find(cat => cat.id === selectedCategory)?.name}
                  </Typography>
                  <Typography variant="body2" className="text-txt-tertiary">
                    {displayTemplates.length}개의 템플릿
                  </Typography>
                </div>
              </div>
            )}
            
            {/* 템플릿 리스트 */}
            {displayTemplates.length > 0 ? (
              <div className="space-y-3">
                {displayTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="bg-white border border-border-light hover:shadow-lg hover:border-weave-primary/30 transition-all cursor-pointer group"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="p-2 bg-bg-secondary rounded-lg group-hover:bg-weave-primary/10 transition-colors">
                            <FileText className="w-5 h-5 text-txt-primary group-hover:text-weave-primary transition-colors" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Typography variant="body1" className="font-medium text-txt-primary group-hover:text-weave-primary transition-colors">
                                {template.name}
                              </Typography>
                              <Badge 
                                variant={template.type === 'detailed' ? 'primary' : 'secondary'}
                                size="sm"
                              >
                                {template.type === 'detailed' ? '상세' : '약식'}
                              </Badge>
                              {template.popular && (
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              )}
                            </div>
                            <Typography variant="body2" className="text-txt-tertiary">
                              {template.description}
                            </Typography>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-txt-tertiary group-hover:text-weave-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-txt-tertiary" />
                </div>
                <Typography variant="body1" className="text-txt-tertiary mb-2">
                  검색 결과가 없습니다
                </Typography>
                <Typography variant="body2" className="text-txt-tertiary">
                  다른 키워드로 검색해보세요
                </Typography>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* AI 안내 카드 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 p-5">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-white/80 backdrop-blur rounded-lg shadow-sm">
            <Zap className="w-5 h-5 text-weave-primary" />
          </div>
          <div className="flex-1">
            <Typography variant="body1" className="font-semibold text-txt-primary mb-3">
              AI 문서 생성 안내
            </Typography>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-weave-primary mt-1">•</span>
                <Typography variant="body2" className="text-txt-secondary">
                  Gemini AI가 선택한 템플릿을 기반으로 맞춤형 문서를 생성합니다
                </Typography>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-weave-primary mt-1">•</span>
                <Typography variant="body2" className="text-txt-secondary">
                  <span className="font-medium text-txt-primary">약식</span>: 간단한 프로젝트나 소규모 작업에 적합
                </Typography>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-weave-primary mt-1">•</span>
                <Typography variant="body2" className="text-txt-secondary">
                  <span className="font-medium text-txt-primary">상세</span>: 큰 프로젝트나 법적 보호가 중요한 경우에 적합
                </Typography>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-weave-primary mt-1">•</span>
                <Typography variant="body2" className="text-txt-secondary">
                  생성된 문서는 필요에 따라 편집 가능합니다
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}