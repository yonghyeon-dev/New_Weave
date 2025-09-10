// Mock 모드: Supabase 클라이언트 제거
import type { Project } from './project-matching.service';
import type { Transaction } from './tax-transactions.service';

export interface ProjectProfitability {
  projectId: string;
  projectName: string;
  clientId?: string;
  clientName?: string;
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  budget?: number;
  totalRevenue: number;
  totalExpense: number;
  totalVat: number;
  netProfit: number;
  profitMargin: number;
  roi: number;
  transactionCount: number;
  revenueTransactions: number;
  expenseTransactions: number;
  avgTransactionValue: number;
  completionRate: number;
  budgetUtilization: number;
  lastTransactionDate?: string;
}

export interface ProfitabilityAggregates {
  totalProjects: number;
  totalRevenue: number;
  totalExpense: number;
  totalNetProfit: number;
  avgProfitMargin: number;
  avgROI: number;
  completedProjects: number;
  inProgressProjects: number;
  plannedProjects: number;
  cancelledProjects: number;
  profitableProjects: number;
  unprofitableProjects: number;
}

/**
 * 프로젝트별 수익성 계산
 */
export async function calculateProjectProfitability(
  projectId: string
): Promise<ProjectProfitability | null> {
  // Mock 모드: 모의 수익성 데이터 반환
  return generateMockProjectProfitability(projectId);
}

/**
 * 여러 프로젝트의 수익성 계산
 */
export async function calculateMultipleProjectsProfitability(
  projectIds?: string[]
): Promise<ProjectProfitability[]> {
  // Mock 모드: 모의 여러 프로젝트 수익성 데이터 반환
  const ids = projectIds || ['project-1', 'project-2', 'project-3'];
  return ids.map(id => generateMockProjectProfitability(id)).filter((p): p is ProjectProfitability => p !== null);
}

/**
 * 클라이언트별 프로젝트 수익성 계산
 */
export async function calculateClientProfitability(
  clientId: string
): Promise<ProjectProfitability[]> {
  // Mock 모드: 모의 클라이언트 프로젝트 수익성 데이터 반환
  const mockProjectIds = [`${clientId}-project-1`, `${clientId}-project-2`];
  return calculateMultipleProjectsProfitability(mockProjectIds);
}

/**
 * 전체 프로젝트 수익성 집계
 */
export async function getProjectProfitabilityAggregates(
  filters?: {
    status?: 'planning' | 'in_progress' | 'completed' | 'cancelled';
    clientId?: string;
    startDate?: string;
    endDate?: string;
  }
): Promise<ProfitabilityAggregates> {
  // Mock 모드: 모의 집계 데이터 반환
  return generateMockProfitabilityAggregates();
}

/**
 * 수익성 트렌드 분석
 */
export async function analyzeProfitabilityTrends(
  projectId: string,
  periodType: 'monthly' | 'quarterly' | 'yearly' = 'monthly'
): Promise<Array<{
  period: string;
  revenue: number;
  expense: number;
  profit: number;
  profitMargin: number;
}>> {
  // Mock 모드: 모의 트렌드 데이터 반환
  return generateMockProfitabilityTrends(projectId, periodType);
}

/**
 * 프로젝트 수익성 예측
 */
export async function predictProjectProfitability(
  projectId: string
): Promise<{
  predictedRevenue: number;
  predictedExpense: number;
  predictedProfit: number;
  confidenceLevel: number;
  riskFactors: string[];
}> {
  // Mock 모드: 모의 예측 데이터 반환
  return {
    predictedRevenue: Math.floor(Math.random() * 5000000) + 1000000,
    predictedExpense: Math.floor(Math.random() * 3000000) + 500000,
    predictedProfit: Math.floor(Math.random() * 2000000) + 200000,
    confidenceLevel: Math.floor(Math.random() * 40) + 60,
    riskFactors: [
      '시장 변동성',
      '고객사 신용도',
      '프로젝트 복잡도',
      '리소스 가용성'
    ].slice(0, Math.floor(Math.random() * 3) + 1)
  };
}

/**
 * 프로젝트 수익성 랭킹 조회
 */
export async function getProjectProfitabilityRanking(
  limit: number = 10
): Promise<ProjectProfitability[]> {
  // Mock 모드: 모의 랭킹 데이터 반환
  return Array.from({ length: limit }, (_, i) => 
    generateMockProjectProfitability(`ranking-project-${i + 1}`)
  ).sort((a, b) => b.profitMargin - a.profitMargin);
}

/**
 * 수익성 벤치마킹
 */
export async function benchmarkProfitability(
  projectId: string,
  industry?: string
): Promise<{
  projectProfitability: ProjectProfitability;
  industryAverage: {
    profitMargin: number;
    roi: number;
    revenuePerProject: number;
  };
  ranking: {
    percentile: number;
    position: string; // 'top', 'above_average', 'average', 'below_average', 'bottom'
  };
}> {
  // Mock 모드: 모의 벤치마킹 데이터 반환
  const profitability = generateMockProjectProfitability(projectId);
  if (!profitability) throw new Error('Project not found');

  return {
    projectProfitability: profitability,
    industryAverage: {
      profitMargin: 15.5,
      roi: 18.2,
      revenuePerProject: 2500000
    },
    ranking: {
      percentile: Math.floor(Math.random() * 100),
      position: ['top', 'above_average', 'average', 'below_average', 'bottom'][
        Math.floor(Math.random() * 5)
      ] as any
    }
  };
}

/**
 * 모의 프로젝트 수익성 데이터 생성
 */
function generateMockProjectProfitability(projectId: string): ProjectProfitability {
  const totalRevenue = Math.floor(Math.random() * 5000000) + 1000000;
  const totalExpense = Math.floor(totalRevenue * (0.4 + Math.random() * 0.4));
  const netProfit = totalRevenue - totalExpense;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const roi = totalExpense > 0 ? (netProfit / totalExpense) * 100 : 0;

  return {
    projectId,
    projectName: `프로젝트 ${projectId}`,
    clientId: `client-${Math.floor(Math.random() * 5) + 1}`,
    clientName: `클라이언트 ${Math.floor(Math.random() * 5) + 1}`,
    status: ['planning', 'in_progress', 'completed', 'cancelled'][Math.floor(Math.random() * 4)] as any,
    startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    budget: totalRevenue * (1 + Math.random() * 0.2),
    totalRevenue,
    totalExpense,
    totalVat: Math.floor(totalRevenue * 0.1),
    netProfit,
    profitMargin,
    roi,
    transactionCount: Math.floor(Math.random() * 50) + 5,
    revenueTransactions: Math.floor(Math.random() * 20) + 3,
    expenseTransactions: Math.floor(Math.random() * 30) + 2,
    avgTransactionValue: Math.floor((totalRevenue + totalExpense) / (Math.random() * 50 + 5)),
    completionRate: Math.floor(Math.random() * 100),
    budgetUtilization: Math.floor(Math.random() * 120) + 20,
    lastTransactionDate: new Date().toISOString().split('T')[0]
  };
}

/**
 * 모의 수익성 집계 데이터 생성
 */
function generateMockProfitabilityAggregates(): ProfitabilityAggregates {
  const totalProjects = 25;
  return {
    totalProjects,
    totalRevenue: 125000000,
    totalExpense: 87500000,
    totalNetProfit: 37500000,
    avgProfitMargin: 18.5,
    avgROI: 22.3,
    completedProjects: 15,
    inProgressProjects: 7,
    plannedProjects: 2,
    cancelledProjects: 1,
    profitableProjects: 20,
    unprofitableProjects: 5
  };
}

/**
 * 모의 수익성 트렌드 데이터 생성
 */
function generateMockProfitabilityTrends(
  projectId: string,
  periodType: 'monthly' | 'quarterly' | 'yearly'
) {
  const periods = periodType === 'monthly' ? 12 : periodType === 'quarterly' ? 4 : 3;
  const trends = [];

  for (let i = 0; i < periods; i++) {
    const revenue = Math.floor(Math.random() * 1000000) + 200000;
    const expense = Math.floor(revenue * (0.4 + Math.random() * 0.4));
    const profit = revenue - expense;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

    trends.push({
      period: periodType === 'monthly' ? `2024-${String(i + 1).padStart(2, '0')}` :
               periodType === 'quarterly' ? `2024-Q${i + 1}` : `${2022 + i}`,
      revenue,
      expense,
      profit,
      profitMargin
    });
  }

  return trends;
}