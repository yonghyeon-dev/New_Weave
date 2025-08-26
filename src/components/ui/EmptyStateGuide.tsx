'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import Typography from './Typography';
import { 
  Plus,
  Upload,
  Search,
  FileText,
  Users,
  Calendar,
  CreditCard,
  MessageSquare,
  Settings,
  Lightbulb,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

// 빈 상태 타입 정의
export type EmptyStateType = 
  | 'documents'    // 문서 관리
  | 'invoices'     // 인보이스
  | 'clients'      // 고객 관리
  | 'payments'     // 결제
  | 'reminders'    // 리마인더
  | 'reports'      // 보고서
  | 'templates'    // 템플릿
  | 'search'       // 검색 결과
  | 'filters'      // 필터 결과
  | 'notifications'// 알림
  | 'settings'     // 설정
  | 'help';        // 도움말

// 액션 타입
export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: React.ComponentType<any>;
}

// Props 인터페이스
export interface EmptyStateGuideProps {
  type: EmptyStateType;
  title?: string;
  description?: string;
  actions?: EmptyStateAction[];
  showQuickActions?: boolean;
  showHelpLink?: boolean;
  className?: string;
}

// 타입별 기본 설정
const emptyStateConfig = {
  documents: {
    icon: FileText,
    title: '문서가 없습니다',
    description: '아직 업로드하거나 생성한 문서가 없어요. 첫 번째 문서를 추가해보세요.',
    quickActions: [
      { label: '문서 업로드', icon: Upload, variant: 'primary' as const },
      { label: '새 문서 작성', icon: Plus, variant: 'secondary' as const }
    ],
    helpText: '문서 관리 가이드 보기'
  },
  
  invoices: {
    icon: FileText,
    title: '인보이스가 없습니다',
    description: '아직 생성된 인보이스가 없어요. 고객에게 보낼 첫 번째 인보이스를 만들어보세요.',
    quickActions: [
      { label: '인보이스 생성', icon: Plus, variant: 'primary' as const },
      { label: '템플릿 선택', icon: FileText, variant: 'secondary' as const }
    ],
    helpText: '인보이스 작성 가이드 보기'
  },
  
  clients: {
    icon: Users,
    title: '등록된 고객이 없습니다',
    description: '고객 정보를 등록하면 인보이스 발행과 결제 관리가 더욱 쉬워져요.',
    quickActions: [
      { label: '고객 추가', icon: Plus, variant: 'primary' as const },
      { label: '엑셀 파일 가져오기', icon: Upload, variant: 'secondary' as const }
    ],
    helpText: '고객 관리 가이드 보기'
  },
  
  payments: {
    icon: CreditCard,
    title: '결제 내역이 없습니다',
    description: '아직 결제된 인보이스가 없어요. 첫 번째 인보이스를 발행해보세요.',
    quickActions: [
      { label: '인보이스 생성', icon: Plus, variant: 'primary' as const },
      { label: '결제 수동 등록', icon: CreditCard, variant: 'secondary' as const }
    ],
    helpText: '결제 관리 가이드 보기'
  },
  
  reminders: {
    icon: Calendar,
    title: '설정된 리마인더가 없습니다',
    description: '아직 생성한 리마인더가 없어요. + 버튼으로 추가해보세요.',
    quickActions: [
      { label: '리마인더 추가', icon: Plus, variant: 'primary' as const },
      { label: '자동 리마인더 설정', icon: Settings, variant: 'secondary' as const }
    ],
    helpText: '리마인더 설정 가이드 보기'
  },
  
  reports: {
    icon: FileText,
    title: '생성된 보고서가 없습니다',
    description: '데이터를 분석한 보고서를 생성하여 비즈니스 인사이트를 확인해보세요.',
    quickActions: [
      { label: '보고서 생성', icon: Plus, variant: 'primary' as const },
      { label: 'AI 분석 요청', icon: MessageSquare, variant: 'secondary' as const }
    ],
    helpText: '보고서 생성 가이드 보기'
  },
  
  templates: {
    icon: FileText,
    title: '저장된 템플릿이 없습니다',
    description: '자주 사용하는 양식을 템플릿으로 저장하면 업무 효율이 높아져요.',
    quickActions: [
      { label: '템플릿 생성', icon: Plus, variant: 'primary' as const },
      { label: '기본 템플릿 가져오기', icon: Upload, variant: 'secondary' as const }
    ],
    helpText: '템플릿 관리 가이드 보기'
  },
  
  search: {
    icon: Search,
    title: '검색 결과가 없습니다',
    description: '입력한 검색어와 일치하는 항목을 찾을 수 없어요. 다른 키워드로 시도해보세요.',
    quickActions: [
      { label: '검색어 수정', icon: Search, variant: 'secondary' as const },
      { label: '전체 목록 보기', icon: FileText, variant: 'ghost' as const }
    ],
    helpText: '검색 도움말 보기'
  },
  
  filters: {
    icon: Search,
    title: '필터 조건에 맞는 항목이 없습니다',
    description: '현재 설정된 필터 조건과 일치하는 결과가 없어요. 필터를 조정해보세요.',
    quickActions: [
      { label: '필터 초기화', icon: Search, variant: 'secondary' as const },
      { label: '새 항목 추가', icon: Plus, variant: 'primary' as const }
    ],
    helpText: '필터 사용법 보기'
  },
  
  notifications: {
    icon: MessageSquare,
    title: '알림이 없습니다',
    description: '새로운 알림이 도착하면 이곳에 표시됩니다.',
    quickActions: [
      { label: '알림 설정', icon: Settings, variant: 'secondary' as const }
    ],
    helpText: '알림 설정 가이드 보기'
  },
  
  settings: {
    icon: Settings,
    title: '설정이 필요합니다',
    description: '서비스를 시작하기 전에 기본 설정을 완료해주세요.',
    quickActions: [
      { label: '설정 시작', icon: ArrowRight, variant: 'primary' as const },
      { label: '나중에 하기', icon: Settings, variant: 'ghost' as const }
    ],
    helpText: '초기 설정 가이드 보기'
  },
  
  help: {
    icon: Lightbulb,
    title: '도움이 필요하신가요?',
    description: '자주 묻는 질문이나 사용 가이드를 확인해보세요.',
    quickActions: [
      { label: '가이드 보기', icon: FileText, variant: 'primary' as const },
      { label: '고객 지원', icon: MessageSquare, variant: 'secondary' as const }
    ],
    helpText: '전체 도움말 보기'
  }
};

const EmptyStateGuide = React.forwardRef<HTMLDivElement, EmptyStateGuideProps>(
  ({ 
    type, 
    title, 
    description, 
    actions, 
    showQuickActions = true, 
    showHelpLink = true,
    className,
    ...props 
  }, ref) => {
    const config = emptyStateConfig[type];
    const Icon = config.icon;
    
    const finalTitle = title || config.title;
    const finalDescription = description || config.description;
    const finalActions = actions || (showQuickActions ? config.quickActions : []);

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-12 px-6 text-center max-w-md mx-auto',
          className
        )}
        role="region"
        aria-label={`${type} 빈 상태 안내`}
        {...props}
      >
        {/* 아이콘 */}
        <div className="mb-4 p-3 rounded-full bg-primary-surfaceVariant">
          <Icon className="w-8 h-8 text-txt-tertiary" aria-hidden="true" />
        </div>

        {/* 제목 */}
        <Typography 
          variant="h3" 
          className="mb-2 text-txt-primary font-semibold"
        >
          {finalTitle}
        </Typography>

        {/* 설명 */}
        <Typography 
          variant="body1" 
          className="mb-6 text-txt-secondary leading-relaxed"
        >
          {finalDescription}
        </Typography>

        {/* 빠른 액션 버튼들 */}
        {finalActions.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
            {finalActions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <Button
                  key={index}
                  onClick={() => ('onClick' in action) ? action.onClick?.() : undefined}
                  variant={action.variant || 'primary'}
                  className="flex items-center gap-2 min-w-[140px]"
                >
                  {ActionIcon && <ActionIcon className="w-4 h-4" />}
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}

        {/* 도움말 링크 */}
        {showHelpLink && (
          <button
            className="flex items-center gap-2 text-weave-primary hover:text-weave-primary/80 transition-colors group"
            onClick={() => {/* TODO: 도움말 페이지 연결 */}}
          >
            <Lightbulb className="w-4 h-4" />
            <Typography variant="body2" className="font-medium">
              {config.helpText}
            </Typography>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    );
  }
);

EmptyStateGuide.displayName = 'EmptyStateGuide';

// 간단한 빈 상태 컴포넌트 (인라인용)
export interface SimpleEmptyStateProps {
  icon?: React.ComponentType<any>;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SimpleEmptyState = React.forwardRef<HTMLDivElement, SimpleEmptyStateProps>(
  ({ icon: Icon = FileText, message, actionLabel, onAction, size = 'md', className, ...props }, ref) => {
    const sizeConfig = {
      sm: { container: 'py-6', icon: 'w-6 h-6', text: 'body2' as const },
      md: { container: 'py-8', icon: 'w-8 h-8', text: 'body1' as const },
      lg: { container: 'py-12', icon: 'w-10 h-10', text: 'h4' as const }
    };

    const config = sizeConfig[size];

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center',
          config.container,
          className
        )}
        {...props}
      >
        <Icon className={cn(config.icon, 'text-txt-tertiary mb-3')} />
        <Typography variant={config.text} className="text-txt-secondary mb-4">
          {message}
        </Typography>
        {actionLabel && onAction && (
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    );
  }
);

SimpleEmptyState.displayName = 'SimpleEmptyState';

export default EmptyStateGuide;