/**
 * 통합 데이터 서비스
 * 
 * YHdev(중앙관리) + h1(세무관리+플로팅메뉴) 통합
 * 핵심: 공통 클라이언트 기반으로 프로젝트-세무관리 연결
 */

import type {
  UnifiedId,
  UnifiedClient,
  UnifiedProject,
  UnifiedTaxRecord,
  UnifiedProjectTableRow,
  ProjectTaxSummary,
  ProjectTaxMapping,
  UnifiedDashboardData
} from '@/lib/types/unified-data-core';

// ============================================================================
// 🗄️ 통합 Mock 데이터
// ============================================================================

/** 공통 클라이언트 데이터 - 프로젝트와 세무관리 연결점 */
const mockClients: UnifiedClient[] = [
  {
    id: 'client-1',
    name: '김철수',
    company: '㈜테크스타트',
    email: 'kim@techstart.com',
    phone: '010-1234-5678',
    businessNumber: '123-45-67890',
    taxType: 'corporate',
    created_at: '2024-01-01T09:00:00Z',
    updated_at: '2024-12-10T09:00:00Z'
  },
  {
    id: 'client-2',
    name: '이영희',
    company: '디자인컴퍼니',
    email: 'lee@designcompany.com',
    phone: '010-2345-6789',
    businessNumber: '234-56-78901',
    taxType: 'corporate',
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z'
  },
  {
    id: 'client-3',
    name: '박민수',
    company: '이커머스플러스',
    email: 'park@ecommerce.com',
    phone: '010-3456-7890',
    businessNumber: '345-67-89012',
    taxType: 'vat_exempt',
    created_at: '2024-03-01T11:00:00Z',
    updated_at: '2024-11-30T18:00:00Z'
  }
];

/** 통합 프로젝트 데이터 - ID 체계 통일 */
const mockProjects: UnifiedProject[] = [
  {
    id: 'proj-1',  // projectId -> id 통일
    user_id: 'mock-user',
    name: '웹사이트 리뉴얼',
    description: '기업 웹사이트 전면 리뉴얼 프로젝트',
    status: 'in_progress',
    client_id: 'client-1',
    start_date: '2024-11-01',
    due_date: '2025-01-31',
    budget_estimated: 5000000,
    budget_actual: 3000000,
    progress: 65,
    payment_progress: 40,
    created_at: '2024-11-01T09:00:00Z',
    updated_at: '2024-12-10T09:00:00Z'
  },
  {
    id: 'proj-2',
    user_id: 'mock-user',
    name: '모바일 앱 개발',
    description: 'iOS/Android 하이브리드 앱 개발',
    status: 'planning',
    client_id: 'client-2',
    start_date: '2025-01-01',
    due_date: '2025-03-31',
    budget_estimated: 8000000,
    progress: 15,
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z'
  },
  {
    id: 'proj-3',
    user_id: 'mock-user',
    name: '쇼핑몰 구축',
    description: '온라인 쇼핑몰 플랫폼 구축',
    status: 'completed',
    client_id: 'client-3',
    start_date: '2024-09-01',
    due_date: '2024-11-30',
    budget_estimated: 6000000,
    budget_actual: 6500000,
    progress: 100,
    payment_progress: 85,
    created_at: '2024-09-01T09:00:00Z',
    updated_at: '2024-11-30T18:00:00Z'
  }
];

/** 통합 세무 데이터 - 프로젝트와 연결 */
const mockTaxRecords: UnifiedTaxRecord[] = [
  {
    id: 'tax-1',
    user_id: 'mock-user',
    year: 2024,
    month: 11,
    total_income: 5000000,
    total_expense: 2000000,
    vat_payable: 500000,
    project_id: 'proj-1',  // 프로젝트 연결
    client_id: 'client-1', // 클라이언트 연결
    transaction_type: 'income',
    category: '매출',
    description: '웹사이트 리뉴얼 1차 결제',
    transaction_date: '2024-11-15',
    created_at: '2024-11-15T14:00:00Z',
    updated_at: '2024-11-15T14:00:00Z'
  },
  {
    id: 'tax-2',
    user_id: 'mock-user',
    year: 2024,
    month: 12,
    total_income: 8000000,
    total_expense: 3000000,
    vat_payable: 800000,
    project_id: 'proj-2',
    client_id: 'client-2',
    transaction_type: 'income',
    category: '매출',
    description: '앱 개발 계약금',
    transaction_date: '2024-12-01',
    created_at: '2024-12-01T15:00:00Z',
    updated_at: '2024-12-01T15:00:00Z'
  },
  {
    id: 'tax-3',
    user_id: 'mock-user',
    year: 2024,
    month: 11,
    total_income: 6500000,
    total_expense: 1500000,
    vat_payable: 650000,
    project_id: 'proj-3',
    client_id: 'client-3',
    transaction_type: 'income',
    category: '매출',
    description: '쇼핑몰 구축 완료 결제',
    transaction_date: '2024-11-30',
    created_at: '2024-11-30T16:00:00Z',
    updated_at: '2024-11-30T16:00:00Z'
  }
];

/** 프로젝트-세무 매핑 관계 */
const mockProjectTaxMappings: ProjectTaxMapping[] = [
  {
    project_id: 'proj-1',
    client_id: 'client-1',
    tax_record_ids: ['tax-1'],
    business_number: '123-45-67890',
    mapping_type: 'automatic',
    created_at: '2024-11-15T14:00:00Z'
  },
  {
    project_id: 'proj-2',
    client_id: 'client-2',
    tax_record_ids: ['tax-2'],
    business_number: '234-56-78901',
    mapping_type: 'automatic',
    created_at: '2024-12-01T15:00:00Z'
  },
  {
    project_id: 'proj-3',
    client_id: 'client-3',
    tax_record_ids: ['tax-3'],
    business_number: '345-67-89012',
    mapping_type: 'manual',
    created_at: '2024-11-30T16:00:00Z'
  }
];

// ============================================================================
// 🔧 통합 데이터 서비스 클래스
// ============================================================================

export class UnifiedDataService {
  
  // --------------------------------------------------------------------------
  // 👥 클라이언트 관리 (공통 기반)
  // --------------------------------------------------------------------------
  
  async getClients(): Promise<UnifiedClient[]> {
    return [...mockClients];
  }
  
  async getClientById(id: UnifiedId): Promise<UnifiedClient | null> {
    return mockClients.find(c => c.id === id) || null;
  }
  
  async getClientByBusinessNumber(businessNumber: string): Promise<UnifiedClient | null> {
    return mockClients.find(c => c.businessNumber === businessNumber) || null;
  }
  
  // --------------------------------------------------------------------------
  // 📋 프로젝트 관리 (YHdev 기반)
  // --------------------------------------------------------------------------
  
  async getProjects(userId: string): Promise<UnifiedProject[]> {
    const projects = mockProjects.filter(p => p.user_id === userId);
    
    // 클라이언트 정보 조인
    return Promise.all(
      projects.map(async (project) => {
        const client = await this.getClientById(project.client_id);
        const taxSummary = await this.getProjectTaxSummary(project.id);
        
        return {
          ...project,
          client,
          tax_summary: taxSummary
        };
      })
    );
  }
  
  async getProjectById(id: UnifiedId): Promise<UnifiedProject | null> {
    const project = mockProjects.find(p => p.id === id);
    if (!project) return null;
    
    const client = await this.getClientById(project.client_id);
    const taxRecords = await this.getTaxRecordsByProject(id);
    const taxSummary = await this.getProjectTaxSummary(id);
    
    return {
      ...project,
      client,
      tax_records: taxRecords,
      tax_summary: taxSummary
    };
  }
  
  async getProjectsAsTableRows(): Promise<UnifiedProjectTableRow[]> {
    const projects = await this.getProjects('mock-user');
    
    return projects.map(project => ({
      id: project.id,
      no: project.id.replace('proj-', 'P'),
      name: project.name,
      client: project.client?.name || '미지정',
      status: project.status,
      progress: project.progress,
      registrationDate: project.created_at.split('T')[0],
      dueDate: project.due_date || '',
      modifiedDate: project.updated_at.split('T')[0],
      paymentProgress: project.payment_progress,
      budgetEstimated: project.budget_estimated,
      budgetActual: project.budget_actual,
      taxSummary: project.tax_summary ? {
        totalIncome: project.tax_summary.total_income,
        totalExpense: project.tax_summary.total_expense,
        netProfit: project.tax_summary.net_profit,
        vatPayable: project.tax_summary.vat_total
      } : undefined,
      hasTaxRecords: !!project.tax_records?.length
    }));
  }
  
  // --------------------------------------------------------------------------
  // 💰 세무 관리 (h1 기반 + 프로젝트 연동)
  // --------------------------------------------------------------------------
  
  async getTaxRecords(userId: string, year?: number, month?: number): Promise<UnifiedTaxRecord[]> {
    let filtered = mockTaxRecords.filter(record => record.user_id === userId);
    
    if (year) {
      filtered = filtered.filter(record => record.year === year);
    }
    
    if (month) {
      filtered = filtered.filter(record => record.month === month);
    }
    
    return filtered.sort((a, b) => b.year - a.year || b.month - a.month);
  }
  
  async getTaxRecordsByProject(projectId: UnifiedId): Promise<UnifiedTaxRecord[]> {
    return mockTaxRecords.filter(record => record.project_id === projectId);
  }
  
  async getTaxRecordsByClient(clientId: UnifiedId): Promise<UnifiedTaxRecord[]> {
    return mockTaxRecords.filter(record => record.client_id === clientId);
  }
  
  async getProjectTaxSummary(projectId: UnifiedId): Promise<ProjectTaxSummary | null> {
    const taxRecords = await this.getTaxRecordsByProject(projectId);
    if (!taxRecords.length) return null;
    
    const totalIncome = taxRecords.reduce((sum, r) => sum + r.total_income, 0);
    const totalExpense = taxRecords.reduce((sum, r) => sum + r.total_expense, 0);
    const vatTotal = taxRecords.reduce((sum, r) => sum + r.vat_payable, 0);
    
    return {
      project_id: projectId,
      total_income: totalIncome,
      total_expense: totalExpense,
      net_profit: totalIncome - totalExpense,
      vat_total: vatTotal,
      tax_year: new Date().getFullYear(),
      last_updated: new Date().toISOString()
    };
  }
  
  // --------------------------------------------------------------------------
  // 🔗 프로젝트-세무 연동 관리
  // --------------------------------------------------------------------------
  
  async getProjectTaxMapping(projectId: UnifiedId): Promise<ProjectTaxMapping | null> {
    return mockProjectTaxMappings.find(m => m.project_id === projectId) || null;
  }
  
  async createProjectTaxMapping(
    projectId: UnifiedId, 
    clientId: UnifiedId, 
    taxRecordIds: UnifiedId[]
  ): Promise<ProjectTaxMapping> {
    const client = await this.getClientById(clientId);
    
    const mapping: ProjectTaxMapping = {
      project_id: projectId,
      client_id: clientId,
      tax_record_ids: taxRecordIds,
      business_number: client?.businessNumber,
      mapping_type: 'manual',
      created_at: new Date().toISOString()
    };
    
    mockProjectTaxMappings.push(mapping);
    return mapping;
  }
  
  // --------------------------------------------------------------------------
  // 📊 통합 대시보드
  // --------------------------------------------------------------------------
  
  async getDashboardData(): Promise<UnifiedDashboardData> {
    const projects = await this.getProjects('mock-user');
    const taxRecords = await this.getTaxRecords('mock-user');
    
    return {
      projects: {
        total: projects.length,
        inProgress: projects.filter(p => p.status === 'in_progress').length,
        completed: projects.filter(p => p.status === 'completed').length,
        onHold: projects.filter(p => p.status === 'on_hold').length
      },
      tax: {
        pendingReports: taxRecords.filter(r => !r.invoice_number).length,
        totalIncome: taxRecords.reduce((sum, r) => sum + r.total_income, 0),
        totalExpense: taxRecords.reduce((sum, r) => sum + r.total_expense, 0),
        vatPayable: taxRecords.reduce((sum, r) => sum + r.vat_payable, 0)
      },
      financial: {
        totalBudget: projects.reduce((sum, p) => sum + (p.budget_estimated || 0), 0),
        actualSpent: projects.reduce((sum, p) => sum + (p.budget_actual || 0), 0),
        projectedIncome: taxRecords.reduce((sum, r) => sum + r.total_income, 0)
      }
    };
  }
}

// ============================================================================
// 🚀 싱글톤 인스턴스
// ============================================================================

export const unifiedDataService = new UnifiedDataService();

// ============================================================================
// 📤 기존 서비스 호환성 래퍼
// ============================================================================

/** 기존 ProjectsService와 호환되는 래퍼 */
export class ProjectsServiceCompatible {
  async getProjects(userId: string) {
    return unifiedDataService.getProjects(userId);
  }
  
  async getProjectById(id: UnifiedId) {
    return unifiedDataService.getProjectById(id);
  }
  
  // ... 기타 메서드들도 래핑
}

/** 기존 TaxService와 호환되는 래퍼 */
export class TaxServiceCompatible {
  async getTaxRecords(userId: string, year?: number, month?: number) {
    return unifiedDataService.getTaxRecords(userId, year, month);
  }
  
  async createTaxRecord(record: Omit<UnifiedTaxRecord, 'id' | 'created_at' | 'updated_at'>) {
    const newRecord: UnifiedTaxRecord = {
      ...record,
      id: `tax-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockTaxRecords.push(newRecord);
    return newRecord;
  }
  
  // ... 기타 메서드들도 래핑
}

// 호환성 인스턴스
export const projectsService = new ProjectsServiceCompatible();
export const taxService = new TaxServiceCompatible();