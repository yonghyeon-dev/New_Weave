// 통합 목데이터 생성기 - 프로젝트와 세무관리 모듈 간 일관성 확보
import { UnifiedClient, UnifiedProject, UnifiedTransaction, ProjectStatus } from '@/lib/types/unified-data.types';

// 시드 기반 랜덤 함수 (기존 프로젝트 패턴과 동일)
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// 통합 클라이언트 목데이터
export const UNIFIED_CLIENTS: UnifiedClient[] = [
  {
    id: 'client-1',
    name: 'A개발',
    businessNumber: '123-45-67890',
    email: 'contact@adev.co.kr',
    phone: '02-1234-5678',
    type: 'company',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'client-2',
    name: 'B디자인',
    businessNumber: '234-56-78901',
    email: 'hello@bdesign.co.kr',
    phone: '02-2345-6789',
    type: 'company',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z'
  },
  {
    id: 'client-3',
    name: 'C마케팅',
    businessNumber: '345-67-89012',
    email: 'info@cmarketing.co.kr',
    phone: '02-3456-7890',
    type: 'company',
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-02-15T11:00:00Z'
  },
  {
    id: 'client-4',
    name: 'D컨설팅',
    businessNumber: '456-78-90123',
    email: 'contact@dconsulting.co.kr',
    phone: '02-4567-8901',
    type: 'company',
    createdAt: '2024-03-01T09:30:00Z',
    updatedAt: '2024-03-01T09:30:00Z'
  },
  {
    id: 'client-5',
    name: 'E업체',
    businessNumber: '567-89-01234',
    email: 'business@e-company.co.kr',
    phone: '02-5678-9012',
    type: 'company',
    createdAt: '2024-03-15T14:00:00Z',
    updatedAt: '2024-03-15T14:00:00Z'
  },
  {
    id: 'client-6',
    name: 'F자체',
    businessNumber: '678-90-12345',
    email: 'self@f-corp.co.kr',
    phone: '02-6789-0123',
    type: 'company',
    createdAt: '2024-04-01T10:30:00Z',
    updatedAt: '2024-04-01T10:30:00Z'
  },
  {
    id: 'client-7',
    name: 'A학교',
    businessNumber: '789-01-23456',
    email: 'admin@aschool.ac.kr',
    phone: '02-7890-1234',
    type: 'company',
    createdAt: '2024-04-15T15:00:00Z',
    updatedAt: '2024-04-15T15:00:00Z'
  },
  {
    id: 'client-freelancer-1',
    name: '프리랜서김개발',
    businessNumber: '',
    email: 'kim.dev@freelancer.com',
    phone: '010-1111-2222',
    type: 'freelancer',
    createdAt: '2024-05-01T09:00:00Z',
    updatedAt: '2024-05-01T09:00:00Z'
  },
  {
    id: 'client-freelancer-2',
    name: '프리랜서박디자인',
    businessNumber: '',
    email: 'park.design@freelancer.com',
    phone: '010-3333-4444',
    type: 'freelancer',
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-05-15T10:00:00Z'
  }
];

// 통합 프로젝트 목데이터 생성기 (기존 프로젝트 패턴 유지)
export const generateUnifiedProjects = (): UnifiedProject[] => {
  const statuses: ProjectStatus[] = ['planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'];
  const projectTypes = ['A개발', 'B디자인', 'C마케팅', 'D컨설팅', '카페 관리', '피시방 관리', 'A교육 강의'];
  
  const baseDate = new Date(2024, 0, 1);
  const dayInterval = 7;

  const projects = Array.from({ length: 20 }, (_, i) => {
    const seed1 = i * 1234 + 5678;
    const seed2 = i * 2345 + 6789;
    const seed3 = i * 3456 + 7890;
    const seed4 = i * 4567 + 8901;
    const seed5 = i * 5678 + 9012;

    const registrationDate = new Date(
      baseDate.getTime() + 
      (i * dayInterval * 24 * 60 * 60 * 1000) + 
      (Math.floor(seededRandom(seed1) * 3) * 24 * 60 * 60 * 1000)
    );
    const dueDate = new Date(registrationDate.getTime() + Math.floor(seededRandom(seed2) * 90) * 24 * 60 * 60 * 1000);
    
    const currentDate = new Date();
    const maxModifyTime = Math.min(currentDate.getTime(), registrationDate.getTime() + 180 * 24 * 60 * 60 * 1000);
    const modifyTimeRange = maxModifyTime - registrationDate.getTime();
    const modifiedDate = new Date(registrationDate.getTime() + Math.floor(seededRandom(seed3) * modifyTimeRange));

    const progress = Math.floor(seededRandom(seed4) * 101);
    let paymentProgress = 0;
    
    if (progress >= 80) {
      paymentProgress = Math.floor(80 + seededRandom(seed5) * 21);
    } else if (progress >= 50) {
      paymentProgress = Math.floor(30 + seededRandom(seed5) * 51);
    } else if (progress >= 20) {
      paymentProgress = Math.floor(10 + seededRandom(seed5) * 31);
    } else {
      paymentProgress = Math.floor(seededRandom(seed5) * 21);
    }
    
    const statusIndex = Math.floor(seededRandom(seed1 + seed2) * statuses.length);
    if (statuses[statusIndex] === 'completed' && seededRandom(seed3 + seed4) > 0.3) {
      paymentProgress = 100;
    }

    // 클라이언트 선택 (순환)
    const clientIndex = i % UNIFIED_CLIENTS.length;
    const client = UNIFIED_CLIENTS[clientIndex];

    // 프로젝트 금액 계산
    const totalAmount = Math.floor(seededRandom(seed5 + 1000) * 10000000) + 1000000; // 100만원~1100만원
    const paidAmount = Math.floor((totalAmount * paymentProgress) / 100);
    const remainingAmount = totalAmount - paidAmount;

    // 문서 상태 생성
    const generateDocumentStatus = () => {
      const statuses = ['none', 'draft', 'completed', 'approved', 'sent'] as const;
      
      return {
        contract: {
          exists: seededRandom(seed1 + 1000) > 0.5,
          status: statuses[Math.floor(seededRandom(seed1 + 2000) * statuses.length)] as any,
          lastUpdated: modifiedDate.toISOString(),
          count: 1
        },
        invoice: {
          exists: seededRandom(seed2 + 1000) > 0.3,
          status: statuses[Math.floor(seededRandom(seed2 + 2000) * statuses.length)] as any,
          lastUpdated: modifiedDate.toISOString(),
          count: seededRandom(seed2 + 3000) > 0.7 ? Math.floor(seededRandom(seed2 + 4000) * 3) + 1 : 1
        },
        report: {
          exists: seededRandom(seed3 + 1000) > 0.6,
          status: statuses[Math.floor(seededRandom(seed3 + 2000) * statuses.length)] as any,
          lastUpdated: modifiedDate.toISOString(),
          count: seededRandom(seed3 + 3000) > 0.5 ? Math.floor(seededRandom(seed3 + 4000) * 2) + 1 : 1
        },
        estimate: {
          exists: seededRandom(seed4 + 1000) > 0.4,
          status: statuses[Math.floor(seededRandom(seed4 + 2000) * statuses.length)] as any,
          lastUpdated: modifiedDate.toISOString(),
          count: 1
        },
        etc: {
          exists: seededRandom(seed5 + 1000) > 0.7,
          status: statuses[Math.floor(seededRandom(seed5 + 2000) * statuses.length)] as any,
          lastUpdated: modifiedDate.toISOString(),
          count: seededRandom(seed5 + 3000) > 0.8 ? Math.floor(seededRandom(seed5 + 4000) * 4) + 1 : 1
        }
      };
    };

    const projectId = `WEAVE_${String(i + 1).padStart(3, '0')}`;

    return {
      id: projectId,
      no: projectId,
      name: `${projectTypes[i % projectTypes.length]} 프로젝트`,
      description: `${client.name}을 위한 ${projectTypes[i % projectTypes.length]} 프로젝트`,
      
      // 클라이언트 연결
      clientId: client.id,
      clientName: client.name,
      
      // 프로젝트 상태
      status: statuses[statusIndex],
      progress,
      paymentProgress,
      
      // 일정 관리
      startDate: registrationDate.toISOString(),
      dueDate: dueDate.toISOString(),
      registrationDate: registrationDate.toISOString(),
      modifiedDate: modifiedDate.toISOString(),
      
      // 재무 정보
      totalAmount,
      paidAmount,
      remainingAmount,
      
      // 문서 정보
      hasContract: seededRandom(seed1 + 1000) > 0.5,
      hasBilling: seededRandom(seed2 + 1000) > 0.3,
      hasDocuments: seededRandom(seed3 + 1000) > 0.4,
      documentStatus: generateDocumentStatus()
    } as UnifiedProject;
  });

  // 최신 프로젝트가 상단에 오도록 내림차순 정렬
  return projects.sort((a, b) => {
    const aNum = parseInt(a.no.split('_')[1] || '0');
    const bNum = parseInt(b.no.split('_')[1] || '0');
    return bNum - aNum;
  });
};

// 통합 거래 목데이터 생성기 (프로젝트와 연동)
export const generateUnifiedTransactions = (projects: UnifiedProject[]): UnifiedTransaction[] => {
  const transactions: UnifiedTransaction[] = [];
  
  // 각 완료된 프로젝트마다 2-4개의 거래 생성
  projects.forEach((project, projectIndex) => {
    if (project.status === 'completed' || project.status === 'in_progress') {
      const client = UNIFIED_CLIENTS.find(c => c.id === project.clientId);
      if (!client) return;

      const transactionCount = Math.floor(seededRandom(projectIndex * 1000) * 3) + 2; // 2-4개
      
      for (let i = 0; i < transactionCount; i++) {
        const seed = projectIndex * 1000 + i * 100;
        
        // 거래 날짜는 프로젝트 시작일 이후
        const projectStart = new Date(project.startDate || project.registrationDate);
        const dayOffset = Math.floor(seededRandom(seed + 1) * 30) + 1; // 1-30일 후
        const transactionDate = new Date(projectStart.getTime() + dayOffset * 24 * 60 * 60 * 1000);
        
        // 거래 유형 (매출이 더 많이 생성되도록)
        const isRevenue = seededRandom(seed + 2) > 0.3; // 70% 확률로 매출
        const transactionType = isRevenue ? '매출' : '매입';
        
        // 금액 계산
        let supplyAmount: number;
        let vatAmount: number;
        let withholdingTax33 = 0;
        let withholdingTax68 = 0;
        
        if (isRevenue) {
          // 매출: 프로젝트 총액의 일부
          supplyAmount = Math.floor((project.totalAmount || 1000000) / transactionCount);
          
          if (client.type === 'freelancer') {
            vatAmount = 0; // 프리랜서는 부가세 없음
            withholdingTax68 = Math.floor(supplyAmount * 0.088); // 8.8% 원천세
          } else {
            vatAmount = Math.floor(supplyAmount * 0.1); // 10% 부가세
            withholdingTax33 = Math.floor(supplyAmount * 0.033); // 3.3% 원천세
          }
        } else {
          // 매입: 랜덤 금액
          supplyAmount = Math.floor(seededRandom(seed + 3) * 500000) + 100000; // 10만원~60만원
          vatAmount = Math.floor(supplyAmount * 0.1);
        }
        
        const totalAmount = supplyAmount + vatAmount - withholdingTax33 - withholdingTax68;
        
        transactions.push({
          id: `trans-${projectIndex}-${i}`,
          userId: 'mock-user',
          
          // 거래 정보
          transactionDate: transactionDate.toISOString().split('T')[0],
          transactionType,
          
          // 거래처 정보
          supplierName: client.name,
          businessNumber: client.businessNumber,
          clientId: client.id,
          
          // 프로젝트 연결
          projectId: project.id,
          projectName: project.name,
          
          // 금액 정보
          supplyAmount,
          vatAmount,
          withholdingTax33,
          withholdingTax68,
          totalAmount,
          
          // 분류 및 설명
          category: isRevenue ? '서비스' : 'IT서비스',
          description: isRevenue ? 
            `${project.name} - ${i + 1}차 결제` :
            `${project.name} 관련 비용`,
          status: 'completed',
          
          // 메타데이터
          createdAt: transactionDate.toISOString(),
          updatedAt: transactionDate.toISOString()
        });
      }
    }
  });
  
  // 독립적인 거래들도 추가 (프로젝트와 무관한 일반 비용 등)
  const independentTransactions = [
    {
      id: 'trans-independent-1',
      userId: 'mock-user',
      transactionDate: '2024-12-05',
      transactionType: '매입' as const,
      supplierName: '클라우드서비스',
      businessNumber: '987-65-43210',
      supplyAmount: 300000,
      vatAmount: 30000,
      withholdingTax33: 0,
      withholdingTax68: 0,
      totalAmount: 330000,
      category: 'IT서비스',
      description: '서버 호스팅 월 이용료',
      status: 'pending',
      createdAt: '2024-12-05T10:00:00Z',
      updatedAt: '2024-12-05T10:00:00Z'
    },
    {
      id: 'trans-independent-2',
      userId: 'mock-user',
      transactionDate: '2024-12-12',
      transactionType: '매입' as const,
      supplierName: '구글코리아',
      businessNumber: '105-81-51510',
      supplyAmount: 150000,
      vatAmount: 15000,
      withholdingTax33: 0,
      withholdingTax68: 0,
      totalAmount: 165000,
      category: 'IT서비스',
      description: 'Google Workspace 구독료',
      status: 'completed',
      createdAt: '2024-12-12T10:00:00Z',
      updatedAt: '2024-12-12T10:00:00Z'
    }
  ];
  
  transactions.push(...independentTransactions);
  
  // 거래 날짜 순으로 정렬 (최신순)
  return transactions.sort((a, b) => 
    new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
  );
};

// 통합 데이터 생성 및 내보내기
export const UNIFIED_PROJECTS = generateUnifiedProjects();
export const UNIFIED_TRANSACTIONS = generateUnifiedTransactions(UNIFIED_PROJECTS);

// 편의 함수들
export const getClientById = (clientId: string): UnifiedClient | undefined => {
  return UNIFIED_CLIENTS.find(c => c.id === clientId);
};

export const getProjectById = (projectId: string): UnifiedProject | undefined => {
  return UNIFIED_PROJECTS.find(p => p.id === projectId);
};

export const getProjectsByClient = (clientId: string): UnifiedProject[] => {
  return UNIFIED_PROJECTS.filter(p => p.clientId === clientId);
};

export const getTransactionsByProject = (projectId: string): UnifiedTransaction[] => {
  return UNIFIED_TRANSACTIONS.filter(t => t.projectId === projectId);
};

export const getTransactionsByClient = (clientId: string): UnifiedTransaction[] => {
  return UNIFIED_TRANSACTIONS.filter(t => t.clientId === clientId);
};