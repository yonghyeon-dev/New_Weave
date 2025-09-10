// 데이터 매퍼 - 기존 데이터와 통합 데이터 간 변환 로직
import { 
  UnifiedProject, 
  UnifiedTransaction, 
  UnifiedClient,
  DataMapper 
} from '@/lib/types/unified-data.types';
import { 
  ProjectTableRow, 
  ProjectStatus as ExistingProjectStatus 
} from '@/lib/types/project-table.types';
import { 
  Transaction as ExistingTransaction 
} from '@/lib/services/supabase/tax-transactions.service';
import { UNIFIED_CLIENTS } from '@/lib/data/unified-mock-data';

export class UnifiedDataMapper implements DataMapper {
  
  /**
   * 기존 ProjectTableRow를 UnifiedProject로 변환
   */
  projectToUnified(project: ProjectTableRow, client?: UnifiedClient): UnifiedProject {
    // 클라이언트 자동 검색 (이름 기반)
    const resolvedClient = client || UNIFIED_CLIENTS.find(c => c.name === project.client);
    
    return {
      // 기본 식별자
      id: project.no || project.id,  // no를 우선 사용, 없으면 id
      no: project.no || project.id,
      
      // 프로젝트 정보
      name: project.name,
      description: `${resolvedClient?.name || project.client}을 위한 ${project.name}`,
      
      // 클라이언트 연결
      clientId: resolvedClient?.id || `client-${project.client}`,
      clientName: project.client,
      
      // 프로젝트 상태
      status: this.mapProjectStatus(project.status),
      progress: project.progress,
      paymentProgress: project.paymentProgress,
      
      // 일정 관리
      startDate: project.registrationDate,
      dueDate: project.dueDate,
      registrationDate: project.registrationDate,
      modifiedDate: project.modifiedDate,
      
      // 재무 정보 (기본값 설정)
      totalAmount: this.calculateTotalAmount(project),
      paidAmount: this.calculatePaidAmount(project),
      remainingAmount: this.calculateRemainingAmount(project),
      
      // 문서 정보
      hasContract: project.hasContract,
      hasBilling: project.hasBilling,
      hasDocuments: project.hasDocuments,
      documentStatus: project.documentStatus,
      
      // 관련 데이터
      contract: project.contract,
      estimate: project.estimate,
      billing: project.billing,
      documents: project.documents
    };
  }

  /**
   * 기존 Transaction을 UnifiedTransaction으로 변환
   */
  transactionToUnified(
    transaction: ExistingTransaction, 
    project?: UnifiedProject, 
    client?: UnifiedClient
  ): UnifiedTransaction {
    // 클라이언트 자동 검색
    const resolvedClient = client || 
      UNIFIED_CLIENTS.find(c => c.name === transaction.supplier_name) ||
      UNIFIED_CLIENTS.find(c => c.id === transaction.client_id);

    // 프로젝트 자동 검색 (프로젝트 ID가 있는 경우)
    const resolvedProject = project;  // 외부에서 전달된 프로젝트 사용

    return {
      // 기본 식별자
      id: transaction.id,
      userId: transaction.user_id,
      
      // 거래 정보
      transactionDate: transaction.transaction_date,
      transactionType: transaction.transaction_type,
      
      // 거래처 정보
      supplierName: transaction.supplier_name,
      businessNumber: transaction.business_number,
      clientId: resolvedClient?.id || transaction.client_id,
      
      // 프로젝트 연결
      projectId: transaction.project_id,
      projectName: resolvedProject?.name,
      
      // 금액 정보 (필드명 변환)
      supplyAmount: transaction.supply_amount,
      vatAmount: transaction.vat_amount,
      withholdingTax33: transaction.withholding_tax_3_3,
      withholdingTax68: transaction.withholding_tax_6_8,
      totalAmount: transaction.total_amount,
      
      // 분류 및 설명
      category: transaction.category,
      description: transaction.description,
      status: transaction.status,
      
      // 메타데이터
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at
    };
  }

  /**
   * UnifiedProject를 기존 ProjectTableRow로 변환 (호환성)
   */
  unifiedToProject(unified: UnifiedProject): ProjectTableRow {
    return {
      id: unified.id,
      no: unified.no,
      name: unified.name,
      registrationDate: unified.registrationDate,
      client: unified.clientName,
      progress: unified.progress,
      status: unified.status as ExistingProjectStatus,
      dueDate: unified.dueDate,
      modifiedDate: unified.modifiedDate,
      paymentProgress: unified.paymentProgress,
      
      // 문서 정보
      hasContract: unified.hasContract,
      hasBilling: unified.hasBilling,
      hasDocuments: unified.hasDocuments,
      documentStatus: unified.documentStatus,
      
      // 관련 데이터
      contract: unified.contract,
      estimate: unified.estimate,
      billing: unified.billing,
      documents: unified.documents
    };
  }

  /**
   * UnifiedTransaction을 기존 Transaction으로 변환 (호환성)
   */
  unifiedToTransaction(unified: UnifiedTransaction): ExistingTransaction {
    return {
      id: unified.id,
      user_id: unified.userId,
      
      // 거래 정보 (필드명 변환)
      transaction_date: unified.transactionDate,
      transaction_type: unified.transactionType,
      
      // 거래처 정보
      supplier_name: unified.supplierName,
      business_number: unified.businessNumber,
      
      // 프로젝트 연결
      project_id: unified.projectId,
      client_id: unified.clientId,
      
      // 금액 정보 (필드명 변환)
      supply_amount: unified.supplyAmount,
      vat_amount: unified.vatAmount,
      withholding_tax_3_3: unified.withholdingTax33,
      withholding_tax_6_8: unified.withholdingTax68,
      total_amount: unified.totalAmount,
      
      // 분류 및 설명
      category: unified.category,
      description: unified.description,
      status: unified.status,
      
      // 메타데이터
      created_at: unified.createdAt,
      updated_at: unified.updatedAt
    };
  }

  // 헬퍼 메서드들

  /**
   * 프로젝트 상태 매핑 (기존 → 통합)
   */
  private mapProjectStatus(status: ExistingProjectStatus): ExistingProjectStatus {
    // 현재는 동일한 상태 체계 사용
    return status;
  }

  /**
   * 프로젝트 총액 계산 (billing 정보 기반)
   */
  private calculateTotalAmount(project: ProjectTableRow): number | undefined {
    if (project.billing?.totalAmount) {
      return project.billing.totalAmount;
    }
    
    // 기본값: 프로젝트 규모에 따른 추정값
    const estimateByProgress = project.progress > 0 ? 
      Math.floor(project.progress * 50000) : 1000000; // 기본 100만원
    
    return estimateByProgress;
  }

  /**
   * 프로젝트 입금액 계산
   */
  private calculatePaidAmount(project: ProjectTableRow): number | undefined {
    if (project.billing?.paidAmount) {
      return project.billing.paidAmount;
    }
    
    if (project.paymentProgress && this.calculateTotalAmount(project)) {
      return Math.floor((this.calculateTotalAmount(project)! * project.paymentProgress) / 100);
    }
    
    return 0;
  }

  /**
   * 프로젝트 잔여액 계산
   */
  private calculateRemainingAmount(project: ProjectTableRow): number | undefined {
    const total = this.calculateTotalAmount(project);
    const paid = this.calculatePaidAmount(project);
    
    if (total !== undefined && paid !== undefined) {
      return total - paid;
    }
    
    return undefined;
  }

  /**
   * 클라이언트 이름으로 ID 검색
   */
  getClientIdByName(clientName: string): string | undefined {
    const client = UNIFIED_CLIENTS.find(c => c.name === clientName);
    return client?.id;
  }

  /**
   * 클라이언트 ID로 이름 검색
   */
  getClientNameById(clientId: string): string | undefined {
    const client = UNIFIED_CLIENTS.find(c => c.id === clientId);
    return client?.name;
  }

  /**
   * 일괄 프로젝트 변환
   */
  projectsToUnified(projects: ProjectTableRow[]): UnifiedProject[] {
    return projects.map(project => this.projectToUnified(project));
  }

  /**
   * 일괄 거래 변환
   */
  transactionsToUnified(
    transactions: ExistingTransaction[], 
    projectsMap?: Map<string, UnifiedProject>
  ): UnifiedTransaction[] {
    return transactions.map(transaction => {
      const project = projectsMap?.get(transaction.project_id || '');
      return this.transactionToUnified(transaction, project);
    });
  }

  /**
   * 일괄 통합 프로젝트 → 기존 형식 변환
   */
  unifiedToProjects(unified: UnifiedProject[]): ProjectTableRow[] {
    return unified.map(project => this.unifiedToProject(project));
  }

  /**
   * 일괄 통합 거래 → 기존 형식 변환
   */
  unifiedToTransactions(unified: UnifiedTransaction[]): ExistingTransaction[] {
    return unified.map(transaction => this.unifiedToTransaction(transaction));
  }
}

// 싱글톤 인스턴스
export const dataMapper = new UnifiedDataMapper();

// 편의 함수들
export const convertProjectToUnified = (project: ProjectTableRow, client?: UnifiedClient) => 
  dataMapper.projectToUnified(project, client);

export const convertTransactionToUnified = (
  transaction: ExistingTransaction, 
  project?: UnifiedProject, 
  client?: UnifiedClient
) => dataMapper.transactionToUnified(transaction, project, client);

export const convertUnifiedToProject = (unified: UnifiedProject) => 
  dataMapper.unifiedToProject(unified);

export const convertUnifiedToTransaction = (unified: UnifiedTransaction) => 
  dataMapper.unifiedToTransaction(unified);

// 타입 가드 함수들
export const isUnifiedProject = (obj: any): obj is UnifiedProject => {
  return obj && typeof obj === 'object' && 'clientId' in obj && 'clientName' in obj;
};

export const isUnifiedTransaction = (obj: any): obj is UnifiedTransaction => {
  return obj && typeof obj === 'object' && 'supplierName' in obj && 'transactionDate' in obj;
};

export const isExistingProject = (obj: any): obj is ProjectTableRow => {
  return obj && typeof obj === 'object' && 'client' in obj && !('clientId' in obj);
};

export const isExistingTransaction = (obj: any): obj is ExistingTransaction => {
  return obj && typeof obj === 'object' && 'supplier_name' in obj && 'transaction_date' in obj;
};