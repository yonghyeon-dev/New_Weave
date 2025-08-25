'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Eye, Download, Copy, Search, Filter, Code, Play, Settings } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Typography from '@/components/ui/Typography';
import { cn } from '@/lib/utils';
import { AdvancedTemplateEngine, type TemplateContext } from '@/lib/advanced-template-engine';
import { advancedTemplates, sampleContext } from '@/lib/templates/advanced-templates';

interface AdvancedTemplate {
  id: string;
  name: string;
  description: string;
  category: 'invoice' | 'quote' | 'contract' | 'email' | 'report';
  template: string;
  variables: string[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  version: string;
}

interface AdvancedTemplateManagerProps {
  onTemplateSelect?: (template: AdvancedTemplate, context: TemplateContext) => void;
  className?: string;
}

const templateCategories = [
  { value: 'all', label: '전체' },
  { value: 'invoice', label: '📋 인보이스' },
  { value: 'quote', label: '💰 견적서' },
  { value: 'contract', label: '📄 계약서' },
  { value: 'email', label: '📧 이메일' },
  { value: 'report', label: '📊 리포트' }
];

export default function AdvancedTemplateManager({ onTemplateSelect, className = '' }: AdvancedTemplateManagerProps) {
  const [templates, setTemplates] = useState<AdvancedTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<AdvancedTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<AdvancedTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [templateContext, setTemplateContext] = useState<TemplateContext>(sampleContext);

  const templateEngine = AdvancedTemplateEngine.getInstance();

  useEffect(() => {
    // 기본 템플릿들 초기화
    const defaultTemplates: AdvancedTemplate[] = [
      {
        id: 'invoice-standard',
        name: '표준 인보이스',
        description: '일반적인 인보이스 양식으로 세금계산서 형태입니다',
        category: 'invoice',
        template: advancedTemplates.invoice,
        variables: ['client', 'invoice', 'project', 'user', 'payment'],
        isDefault: true,
        createdAt: new Date('2024-08-20'),
        updatedAt: new Date('2024-08-25'),
        tags: ['인보이스', '세금계산서', '기본'],
        version: '1.0'
      },
      {
        id: 'quote-professional',
        name: '전문 견적서',
        description: '프로젝트 견적을 위한 상세한 견적서 양식입니다',
        category: 'quote',
        template: advancedTemplates.quote,
        variables: ['client', 'project', 'invoice', 'user'],
        isDefault: true,
        createdAt: new Date('2024-08-20'),
        updatedAt: new Date('2024-08-25'),
        tags: ['견적서', '프로젝트', '전문'],
        version: '1.0'
      },
      {
        id: 'contract-standard',
        name: '표준 계약서',
        description: '프로젝트 수행을 위한 기본 계약서 양식입니다',
        category: 'contract',
        template: advancedTemplates.contract,
        variables: ['client', 'project', 'invoice', 'user', 'system'],
        isDefault: true,
        createdAt: new Date('2024-08-20'),
        updatedAt: new Date('2024-08-25'),
        tags: ['계약서', '프로젝트', '표준'],
        version: '1.0'
      },
      {
        id: 'reminder-email',
        name: '리마인드 이메일',
        description: '결제 리마인드를 위한 정중한 이메일 템플릿입니다',
        category: 'email',
        template: advancedTemplates.reminderEmail,
        variables: ['client', 'invoice', 'user'],
        isDefault: true,
        createdAt: new Date('2024-08-20'),
        updatedAt: new Date('2024-08-25'),
        tags: ['이메일', '리마인드', '결제'],
        version: '1.0'
      }
    ];

    setTemplates(defaultTemplates);
    setFilteredTemplates(defaultTemplates);
  }, []);

  useEffect(() => {
    // 필터링
    let filtered = templates;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(term) ||
        template.description.toLowerCase().includes(term) ||
        template.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    setFilteredTemplates(filtered);
  }, [templates, selectedCategory, searchTerm]);

  const handleTemplateClick = (template: AdvancedTemplate) => {
    setSelectedTemplate(template);
    onTemplateSelect?.(template, templateContext);
  };

  const handlePreview = (template: AdvancedTemplate) => {
    try {
      const rendered = templateEngine.render(template.template, templateContext, {
        format: 'html',
        includeStyles: true,
        escapeHtml: false
      });
      setPreviewHtml(rendered);
      setSelectedTemplate(template);
      setPreviewMode(true);
    } catch (error) {
      console.error('Template preview error:', error);
      alert('템플릿 미리보기 중 오류가 발생했습니다: ' + (error as Error).message);
    }
  };

  const handleCopyTemplate = (template: AdvancedTemplate) => {
    const newTemplate: AdvancedTemplate = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} (복사본)`,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0'
    };

    setTemplates(prev => [...prev, newTemplate]);
  };

  const handleValidateTemplate = (template: AdvancedTemplate) => {
    const validation = templateEngine.validateTemplate(template.template);
    const variables = templateEngine.extractVariables(template.template);
    
    alert(
      validation.isValid 
        ? `템플릿이 유효합니다!\n\n사용된 변수: ${variables.join(', ')}`
        : `템플릿 오류:\n${validation.errors.join('\n')}`
    );
  };

  const downloadTemplate = (format: 'html' | 'markdown' | 'text' = 'html') => {
    if (!selectedTemplate) return;

    try {
      const rendered = templateEngine.render(selectedTemplate.template, templateContext, {
        format,
        includeStyles: format === 'html',
        escapeHtml: false
      });

      const blob = new Blob([rendered], { 
        type: format === 'html' ? 'text/html' : 'text/plain' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTemplate.name}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ko-KR');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'invoice': return '📋';
      case 'quote': return '💰';
      case 'contract': return '📄';
      case 'email': return '📧';
      case 'report': return '📊';
      default: return '📄';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h1" className="mb-2">
            고급 문서 템플릿
          </Typography>
          <Typography variant="body1" className="text-txt-secondary">
            변수 치환, 조건부 로직, 반복문을 지원하는 고급 템플릿으로 전문적인 문서를 생성하세요
          </Typography>
        </div>
        <Button
          variant="primary"
          onClick={() => setEditMode(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          새 템플릿
        </Button>
      </div>

      {/* 기능 소개 */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Code className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <Typography variant="h4" className="text-blue-800 mb-2">
              고급 템플릿 기능
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
              <div>
                <strong>• 객체 속성 접근:</strong> <code>{`{{client.name}}`}</code>, <code>{`{{invoice.total}}`}</code>
              </div>
              <div>
                <strong>• 조건부 로직:</strong> <code>{`{{#if condition}}`}</code>, <code>{`{{else}}`}</code>
              </div>
              <div>
                <strong>• 반복문:</strong> <code>{`{{#each items}}`}</code>, 배열 데이터 처리
              </div>
              <div>
                <strong>• 포맷터:</strong> <code>{`{{amount | currency}}`}</code>, <code>{`{{date | date}}`}</code>
              </div>
              <div>
                <strong>• 계산 필드:</strong> <code>{`{{vat_amount}}`}</code>, <code>{`{{total_with_vat}}`}</code>
              </div>
              <div>
                <strong>• 안전한 접근:</strong> 누락 변수 표시, 오류 방지
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 필터 */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="w-5 h-5 text-txt-secondary" />
          <Typography variant="h4">필터</Typography>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-txt-primary mb-2">
              카테고리
            </label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              options={templateCategories}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-txt-primary mb-2">
              검색
            </label>
            <div className="relative">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="템플릿 이름, 설명, 태그로 검색"
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-txt-tertiary" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-txt-secondary">
          <span>총 {filteredTemplates.length}개의 템플릿</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setTemplateContext(sampleContext)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            샘플 데이터 리셋
          </Button>
        </div>
      </Card>

      {/* 템플릿 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              "p-6 cursor-pointer transition-all hover:shadow-md hover:border-weave-primary",
              selectedTemplate?.id === template.id && "ring-2 ring-weave-primary border-weave-primary"
            )}
            onClick={() => handleTemplateClick(template)}
          >
            {/* 헤더 */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="text-2xl">
                  {getCategoryIcon(template.category)}
                </div>
                <div className="flex-1">
                  <Typography variant="h4" className="mb-1 line-clamp-2">
                    {template.name}
                  </Typography>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" size="sm">
                      {templateCategories.find(c => c.value === template.category)?.label.slice(2)}
                    </Badge>
                    {template.isDefault && (
                      <Badge variant="accent" size="sm">기본</Badge>
                    )}
                    <Badge variant="outline" size="sm">
                      v{template.version}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* 설명 */}
            <Typography variant="body2" className="text-txt-secondary mb-4 line-clamp-3">
              {template.description}
            </Typography>

            {/* 태그 */}
            {template.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" size="sm">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <span className="text-xs text-txt-tertiary">
                    +{template.tags.length - 3}개
                  </span>
                )}
              </div>
            )}

            {/* 변수 정보 */}
            <div className="text-xs text-txt-tertiary mb-4">
              {template.variables.length}개 변수 • {formatDate(template.updatedAt)}
            </div>

            {/* 액션 */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreview(template);
                }}
                className="flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                미리보기
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleValidateTemplate(template);
                }}
                className="flex items-center gap-1"
              >
                <Play className="w-3 h-3" />
                검증
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyTemplate(template);
                }}
                className="flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                복사
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* 빈 상태 */}
      {filteredTemplates.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 text-txt-disabled mx-auto mb-4" />
          <Typography variant="h3" className="mb-2">
            템플릿이 없습니다
          </Typography>
          <Typography variant="body1" className="text-txt-secondary mb-6">
            검색 조건을 변경하거나 새로운 템플릿을 만들어보세요.
          </Typography>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedCategory('all');
              setSearchTerm('');
            }}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            필터 초기화
          </Button>
        </Card>
      )}

      {/* 미리보기 모달 */}
      {previewMode && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <Typography variant="h3">
                {selectedTemplate.name} - 미리보기
              </Typography>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => downloadTemplate('html')}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  HTML
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadTemplate('text')}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  텍스트
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setPreviewMode(false)}
                >
                  닫기
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}