'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Eye, Download, Copy, Search, Filter } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { DocumentTemplate, TemplateCategory, TEMPLATE_CATEGORIES } from '@/lib/types/template';
import { TemplateEngine } from '@/lib/template-engine';
import { DEFAULT_TEMPLATES } from '@/lib/templates/default-templates';
import { cn } from '@/lib/utils';

interface TemplateManagerProps {
  onTemplateSelect?: (template: DocumentTemplate) => void;
  className?: string;
}

const categoryOptions = [
  { value: 'all', label: '전체' },
  ...Object.entries(TEMPLATE_CATEGORIES).map(([key, value]) => ({
    value: key,
    label: value.label
  }))
];

export default function TemplateManager({ onTemplateSelect, className = '' }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const templateEngine = TemplateEngine.getInstance();

  useEffect(() => {
    // 기본 템플릿 등록
    DEFAULT_TEMPLATES.forEach(template => {
      templateEngine.registerTemplate(template);
    });

    // 템플릿 목록 로드
    const allTemplates = templateEngine.getAllTemplates();
    setTemplates(allTemplates);
    setFilteredTemplates(allTemplates);
  }, []);

  useEffect(() => {
    // 필터링
    let filtered = templates;

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredTemplates(filtered);
  }, [templates, selectedCategory, searchTerm]);

  const handleTemplateClick = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    onTemplateSelect?.(template);
  };

  const handlePreview = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setPreviewMode(true);
  };

  const handleCopyTemplate = (template: DocumentTemplate) => {
    const newTemplate: DocumentTemplate = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} (복사본)`,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    templateEngine.registerTemplate(newTemplate);
    setTemplates(templateEngine.getAllTemplates());
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-txt-primary">문서 템플릿</h2>
          <p className="text-txt-secondary mt-1">
            비즈니스 문서를 빠르게 생성할 수 있는 템플릿을 관리합니다
          </p>
        </div>
        <Button
          variant="primary"
          className="flex items-center space-x-2"
          onClick={() => console.log('Create new template')}
        >
          <Plus className="w-4 h-4" />
          <span>새 템플릿</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-border-light p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="w-5 h-5 text-txt-secondary" />
          <span className="text-txt-primary font-medium">필터</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-txt-secondary mb-2">
              카테고리
            </label>
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              placeholder="카테고리 선택"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-txt-secondary mb-2">
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
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={cn(
              "bg-white rounded-lg border border-border-light p-6 cursor-pointer transition-all hover:shadow-md hover:border-weave-primary",
              selectedTemplate?.id === template.id && "ring-2 ring-weave-primary border-weave-primary"
            )}
            onClick={() => handleTemplateClick(template)}
          >
            {/* Template Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-weave-primary-light rounded-lg">
                  <FileText className="w-5 h-5 text-weave-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-txt-primary line-clamp-2">
                    {template.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-bg-secondary text-txt-secondary rounded">
                      {TEMPLATE_CATEGORIES[template.category as TemplateCategory]?.icon} {' '}
                      {TEMPLATE_CATEGORIES[template.category as TemplateCategory]?.label}
                    </span>
                    {template.isDefault && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                        기본
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-txt-secondary mb-4 line-clamp-3">
              {template.description}
            </p>

            {/* Tags */}
            {template.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {template.tags.length > 3 && (
                  <span className="text-xs text-txt-tertiary">
                    +{template.tags.length - 3}개
                  </span>
                )}
              </div>
            )}

            {/* Variables Count */}
            <div className="text-xs text-txt-tertiary mb-4">
              {template.variables.length}개 변수 • 마지막 수정: {formatDate(template.updatedAt)}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreview(template);
                }}
                className="flex items-center space-x-1 text-xs"
              >
                <Eye className="w-3 h-3" />
                <span>미리보기</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyTemplate(template);
                }}
                className="flex items-center space-x-1 text-xs"
              >
                <Copy className="w-3 h-3" />
                <span>복사</span>
              </Button>

              {!template.isDefault && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Edit template', template.id);
                  }}
                  className="flex items-center space-x-1 text-xs"
                >
                  <Edit className="w-3 h-3" />
                  <span>편집</span>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="bg-white rounded-lg border border-border-light p-12 text-center">
          <FileText className="w-16 h-16 text-txt-disabled mx-auto mb-4" />
          <h3 className="text-lg font-medium text-txt-primary mb-2">
            템플릿이 없습니다
          </h3>
          <p className="text-txt-secondary mb-6">
            검색 조건을 변경하거나 새로운 템플릿을 만들어보세요.
          </p>
          <Button
            variant="primary"
            className="flex items-center space-x-2"
            onClick={() => {
              setSelectedCategory('all');
              setSearchTerm('');
            }}
          >
            <Filter className="w-4 h-4" />
            <span>필터 초기화</span>
          </Button>
        </div>
      )}

      {/* Template Preview Modal */}
      {previewMode && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <h3 className="text-lg font-semibold text-txt-primary">
                {selectedTemplate.name} - 미리보기
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    const preview = templateEngine.preview(selectedTemplate);
                    const blob = new Blob([preview], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedTemplate.name}.html`;
                    a.click();
                  }}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>다운로드</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setPreviewMode(false)}
                >
                  닫기
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: templateEngine.preview(selectedTemplate)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}