'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Badge from '@/components/ui/Badge';
import { Check } from 'lucide-react';
import { DocumentType, DOCUMENT_TYPES } from '@/types/document-workflow';

interface DocumentTypeSelectorProps {
  onSelectType: (type: DocumentType) => void;
  selectedType?: DocumentType | null;
  projectType?: string;
}

export default function DocumentTypeSelector({ 
  onSelectType,
  selectedType,
  projectType
}: DocumentTypeSelectorProps) {
  
  // 프로젝트 타입에 따른 추천 문서 종류
  const getRecommendedTypes = () => {
    switch(projectType) {
      case 'development':
        return ['proposal', 'quotation', 'contract', 'specification', 'report'];
      case 'consulting':
        return ['proposal', 'report', 'invoice'];
      case 'design':
        return ['proposal', 'quotation', 'contract'];
      case 'marketing':
        return ['proposal', 'report', 'invoice'];
      default:
        return [];
    }
  };

  const recommendedTypes = getRecommendedTypes();

  const getCategoryColor = (category: string) => {
    const colors = {
      business: 'bg-blue-50 border-blue-200',
      legal: 'bg-red-50 border-red-200',
      technical: 'bg-purple-50 border-purple-200',
      financial: 'bg-green-50 border-green-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-50 border-gray-200';
  };

  return (
    <Card className="bg-white rounded-lg border border-border-light p-6">
      <div className="mb-6">
        <Typography variant="h3" className="text-lg font-semibold text-txt-primary mb-2">
          문서 종류 선택
        </Typography>
        <Typography variant="body2" className="text-txt-secondary">
          작성하실 문서의 종류를 선택하세요
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOCUMENT_TYPES.map((type) => {
          const isRecommended = recommendedTypes.includes(type.id);
          const isSelected = selectedType?.id === type.id;
          
          return (
            <Card
              key={type.id}
              className={`border-2 ${
                isSelected 
                  ? 'border-weave-primary bg-blue-50' 
                  : `${getCategoryColor(type.category)} hover:shadow-lg`
              } transition-all cursor-pointer relative`}
              onClick={() => onSelectType(type)}
            >
              {isRecommended && (
                <Badge 
                  variant="primary" 
                  size="sm" 
                  className="absolute -top-2 -right-2"
                >
                  추천
                </Badge>
              )}
              
              <div className="p-6 text-center">
                <div className="text-4xl mb-3">{type.icon}</div>
                <Typography variant="body1" className="font-semibold text-txt-primary mb-2">
                  {type.name}
                </Typography>
                <Typography variant="body2" className="text-txt-secondary text-sm">
                  {type.description}
                </Typography>
                
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className="p-1 bg-weave-primary rounded-full">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* 카테고리 설명 */}
      <div className="mt-6 p-4 bg-bg-secondary rounded-lg">
        <Typography variant="body2" className="text-txt-secondary mb-2">
          <span className="font-semibold">문서 카테고리:</span>
        </Typography>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-200 rounded"></div>
            <Typography variant="body2" className="text-txt-tertiary text-sm">비즈니스</Typography>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-200 rounded"></div>
            <Typography variant="body2" className="text-txt-tertiary text-sm">법무</Typography>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-200 rounded"></div>
            <Typography variant="body2" className="text-txt-tertiary text-sm">기술</Typography>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <Typography variant="body2" className="text-txt-tertiary text-sm">재무</Typography>
          </div>
        </div>
      </div>
    </Card>
  );
}