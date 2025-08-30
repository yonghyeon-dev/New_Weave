// 프로젝트 관련 타입 정의

export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ProjectMilestone {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completedDate?: string;
  isCompleted: boolean;
  progress: number; // 0-100
}

export interface ProjectBudget {
  estimated: number;
  spent: number;
  remaining: number;
  currency: string;
}

export interface ProjectTeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  joinedDate: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: 'contract' | 'proposal' | 'invoice' | 'report' | 'other';
  url: string;
  uploadedDate: string;
  uploadedBy: string;
  size: number;
}

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  assignedTo?: string;
  dueDate?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: ProjectPriority;
  createdAt: string;
  completedAt?: string;
}

export interface ProjectInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  issuedDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paidDate?: string;
}

export interface ProjectPayment {
  id: string;
  amount: number;
  date: string;
  method: 'bank_transfer' | 'credit_card' | 'cash' | 'other';
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  invoiceId?: string;
}

export interface ProjectDetail {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  clientName: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  endDate?: string;
  dueDate: string;
  completedDate?: string;
  
  // 재무 정보
  budget: ProjectBudget;
  totalRevenue: number;
  totalExpenses: number;
  profitMargin: number;
  
  // 진행률
  progress: number; // 0-100
  
  // 관련 데이터
  milestones: ProjectMilestone[];
  team: ProjectTeamMember[];
  documents: ProjectDocument[];
  tasks: ProjectTask[];
  invoices: ProjectInvoice[];
  payments: ProjectPayment[];
  
  // 태그 및 카테고리
  tags: string[];
  category?: string;
  
  // 메타데이터
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy?: string;
}

// 프로젝트 요약 정보 (리스트 뷰용)
export interface ProjectSummary {
  id: string;
  name: string;
  clientName: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  dueDate: string;
  budget: {
    estimated: number;
    spent: number;
  };
  teamSize: number;
  taskCount: {
    total: number;
    completed: number;
  };
}

// 프로젝트 통계
export interface ProjectStatistics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  averageProgress: number;
  upcomingDeadlines: number;
  overdueProjects: number;
  teamUtilization: number; // 팀 활용률 (%)
}