'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  Calendar,
  Clock,
  Mail,
  Settings,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Typography from '@/components/ui/Typography';
import Switch from '@/components/ui/Switch';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { ReminderEngine } from '@/lib/reminder-engine';
import { 
  ReminderRule, 
  ReminderType, 
  ReminderTone,
  ConditionField,
  ConditionOperator 
} from '@/lib/types/reminder';

interface ReminderRulesManagerProps {
  onCreateRule?: () => void;
  onEditRule?: (rule: ReminderRule) => void;
  onTestRule?: (rule: ReminderRule) => void;
}

export default function ReminderRulesManager({ 
  onCreateRule, 
  onEditRule, 
  onTestRule 
}: ReminderRulesManagerProps) {
  const [rules, setRules] = useState<ReminderRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRule, setSelectedRule] = useState<ReminderRule | null>(null);
  const [filterType, setFilterType] = useState<'all' | ReminderType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const reminderEngine = ReminderEngine.getInstance();

  const loadRules = useCallback(async () => {
    setLoading(true);
    try {
      const rulesData = await reminderEngine.getRules();
      setRules(rulesData);
    } catch (error) {
      console.error('Failed to load rules:', error);
    } finally {
      setLoading(false);
    }
  }, [reminderEngine]);

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  const handleToggleRule = async (ruleId: string, enabled: boolean) => {
    try {
      await reminderEngine.updateRule(ruleId, { isEnabled: enabled });
      await loadRules();
    } catch (error) {
      console.error('Failed to toggle rule:', error);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('정말로 이 규칙을 삭제하시겠습니까?')) return;

    try {
      await reminderEngine.deleteRule(ruleId);
      await loadRules();
    } catch (error) {
      console.error('Failed to delete rule:', error);
    }
  };

  const handleDuplicateRule = async (rule: ReminderRule) => {
    try {
      const duplicatedRule = {
        ...rule,
        name: `${rule.name} (복사본)`,
        isEnabled: false
      };
      delete (duplicatedRule as any).id;
      delete (duplicatedRule as any).createdAt;
      delete (duplicatedRule as any).updatedAt;

      await reminderEngine.createRule(duplicatedRule);
      await loadRules();
    } catch (error) {
      console.error('Failed to duplicate rule:', error);
    }
  };

  const handleTestRule = async (rule: ReminderRule) => {
    try {
      const result = await reminderEngine.testReminder(rule.id, 'test-invoice-1');
      alert(`테스트 결과:\n\n${result}`);
    } catch (error) {
      console.error('Failed to test rule:', error);
      alert('테스트 중 오류가 발생했습니다.');
    }
  };

  const filteredRules = rules.filter(rule => {
    const matchesType = filterType === 'all' || rule.reminderType === filterType;
    const matchesSearch = searchTerm === '' || 
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  const getReminderTypeLabel = (type: ReminderType): string => {
    switch (type) {
      case ReminderType.GENTLE_REMINDER:
        return '정중한 리마인더';
      case ReminderType.PAYMENT_DUE:
        return '결제 기한';
      case ReminderType.OVERDUE_NOTICE:
        return '연체 통지';
      case ReminderType.FINAL_NOTICE:
        return '최종 통지';
      case ReminderType.THANK_YOU:
        return '감사 인사';
      case ReminderType.CUSTOM:
        return '사용자 정의';
      default:
        return type;
    }
  };

  const getReminderTypeIcon = (type: ReminderType): string => {
    switch (type) {
      case ReminderType.GENTLE_REMINDER:
        return '💬';
      case ReminderType.PAYMENT_DUE:
        return '⏰';
      case ReminderType.OVERDUE_NOTICE:
        return '⚠️';
      case ReminderType.FINAL_NOTICE:
        return '🚨';
      case ReminderType.THANK_YOU:
        return '🙏';
      default:
        return '📧';
    }
  };

  const getTriggerDescription = (rule: ReminderRule): string => {
    const direction = rule.triggerType === 'before' ? '전' : '후';
    return `결제 기한 ${rule.triggerDays}일 ${direction}`;
  };

  const getRepeatDescription = (rule: ReminderRule): string => {
    if (rule.repeatInterval === 0) {
      return '반복 없음';
    }
    return `${rule.repeatInterval}일마다 반복 (최대 ${rule.maxReminders}회)`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ko-KR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-weave-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h1" className="mb-2">
            리마인더 규칙 관리
          </Typography>
          <Typography variant="body1" className="text-txt-secondary">
            자동화된 리마인더 발송 규칙을 설정하고 관리합니다
          </Typography>
        </div>
        
        <Button
          variant="primary"
          onClick={onCreateRule}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          새 규칙 추가
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Settings className="w-5 h-5 text-txt-secondary" />
          <Typography variant="h4">필터</Typography>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-txt-primary mb-2">
              리마인더 유형
            </label>
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value as 'all' | ReminderType)}
              options={[
                { value: 'all', label: '전체' },
                { value: ReminderType.GENTLE_REMINDER, label: '정중한 리마인더' },
                { value: ReminderType.PAYMENT_DUE, label: '결제 기한' },
                { value: ReminderType.OVERDUE_NOTICE, label: '연체 통지' },
                { value: ReminderType.FINAL_NOTICE, label: '최종 통지' },
                { value: ReminderType.THANK_YOU, label: '감사 인사' },
                { value: ReminderType.CUSTOM, label: '사용자 정의' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-txt-primary mb-2">
              검색
            </label>
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="규칙 이름이나 설명으로 검색"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-txt-secondary">
          <span>총 {filteredRules.length}개의 규칙</span>
          <span>활성화된 규칙: {filteredRules.filter(r => r.isEnabled).length}개</span>
        </div>
      </Card>

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.map((rule) => (
          <Card
            key={rule.id}
            className={cn(
              "p-6 transition-all hover:shadow-md",
              selectedRule?.id === rule.id && "ring-2 ring-weave-primary border-weave-primary",
              !rule.isEnabled && "opacity-75"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">
                    {getReminderTypeIcon(rule.reminderType)}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <Typography variant="h4" className="line-clamp-1">
                        {rule.name}
                      </Typography>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={rule.isEnabled ? "accent" : "secondary"}
                          size="sm"
                        >
                          {rule.isEnabled ? '활성' : '비활성'}
                        </Badge>
                        <Badge variant="outline" size="sm">
                          {getReminderTypeLabel(rule.reminderType)}
                        </Badge>
                      </div>
                    </div>
                    <Typography variant="body2" className="text-txt-secondary line-clamp-2">
                      {rule.description}
                    </Typography>
                  </div>
                </div>

                {/* Rule Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-txt-secondary" />
                    <Typography variant="body2" className="text-txt-secondary">
                      {getTriggerDescription(rule)}
                    </Typography>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-txt-secondary" />
                    <Typography variant="body2" className="text-txt-secondary">
                      {getRepeatDescription(rule)}
                    </Typography>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-txt-secondary" />
                    <Typography variant="body2" className="text-txt-secondary">
                      템플릿: {rule.template.name}
                    </Typography>
                  </div>
                </div>

                {/* Conditions */}
                {rule.conditions.length > 0 && (
                  <div className="mb-4">
                    <Typography variant="body2" className="text-txt-secondary mb-2">
                      적용 조건:
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {rule.conditions.map((condition, index) => (
                        <Badge key={index} variant="outline" size="sm">
                          {condition.field === ConditionField.INVOICE_AMOUNT && '인보이스 금액'}
                          {condition.field === ConditionField.INVOICE_STATUS && '인보이스 상태'}
                          {condition.field === ConditionField.OVERDUE_DAYS && '연체일'}
                          {' '}
                          {condition.operator === ConditionOperator.EQUALS && '='}
                          {condition.operator === ConditionOperator.GREATER_THAN && '>'}
                          {condition.operator === ConditionOperator.GREATER_EQUAL && '>='}
                          {' '}
                          {condition.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-txt-tertiary">
                  <span>생성일: {formatDate(rule.createdAt)}</span>
                  <span>수정일: {formatDate(rule.updatedAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 ml-6">
                <div className="flex items-center gap-1">
                  <Typography variant="caption" className="text-txt-secondary mr-2">
                    활성화
                  </Typography>
                  <Switch
                    checked={rule.isEnabled}
                    onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTestRule(rule)}
                    className="flex items-center gap-1 justify-start"
                  >
                    <Play className="w-3 h-3" />
                    테스트
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditRule?.(rule)}
                    className="flex items-center gap-1 justify-start"
                  >
                    <Edit className="w-3 h-3" />
                    편집
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicateRule(rule)}
                    className="flex items-center gap-1 justify-start"
                  >
                    <Copy className="w-3 h-3" />
                    복사
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRule(rule.id)}
                    className="flex items-center gap-1 justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                    삭제
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredRules.length === 0 && (
        <Card className="p-12 text-center">
          <AlertTriangle className="w-16 h-16 text-txt-disabled mx-auto mb-4" />
          <Typography variant="h3" className="mb-2">
            조건에 맞는 규칙이 없습니다
          </Typography>
          <Typography variant="body1" className="text-txt-secondary mb-6">
            필터를 변경하거나 새로운 리마인더 규칙을 만들어보세요.
          </Typography>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setFilterType('all');
                setSearchTerm('');
              }}
            >
              필터 초기화
            </Button>
            <Button
              variant="primary"
              onClick={onCreateRule}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              새 규칙 추가
            </Button>
          </div>
        </Card>
      )}

      {/* Summary Stats */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <Typography variant="h4" className="mb-4 text-blue-800">
          규칙 요약
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Typography variant="h3" className="text-blue-600">
              {rules.length}
            </Typography>
            <Typography variant="body2" className="text-blue-700">
              총 규칙 수
            </Typography>
          </div>
          <div className="text-center">
            <Typography variant="h3" className="text-green-600">
              {rules.filter(r => r.isEnabled).length}
            </Typography>
            <Typography variant="body2" className="text-green-700">
              활성 규칙
            </Typography>
          </div>
          <div className="text-center">
            <Typography variant="h3" className="text-orange-600">
              {rules.filter(r => r.triggerType === 'before').length}
            </Typography>
            <Typography variant="body2" className="text-orange-700">
              사전 알림
            </Typography>
          </div>
          <div className="text-center">
            <Typography variant="h3" className="text-red-600">
              {rules.filter(r => r.triggerType === 'after').length}
            </Typography>
            <Typography variant="body2" className="text-red-700">
              연체 통지
            </Typography>
          </div>
        </div>
      </Card>
    </div>
  );
}