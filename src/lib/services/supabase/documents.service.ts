// Mock 데이터 서비스 - Supabase 연결 제거

// Mock 타입 정의
export interface Document {
  id: string;
  user_id: string;
  project_id?: string;
  name: string;
  type: string;
  size: number;
  url: string;
  content?: string;
  metadata?: any;
  embeddings?: number[];
  created_at: string;
  updated_at: string;
}

export type DocumentInsert = Omit<Document, 'id' | 'created_at' | 'updated_at'>;
export type DocumentUpdate = Partial<DocumentInsert>;

// Mock 데이터 저장소
let mockDocuments: Document[] = [];

export class DocumentsService {
  // Mock 문서 업로드
  async uploadDocument(
    file: File,
    userId: string,
    projectId?: string,
    metadata?: any
  ): Promise<Document> {
    // Mock 데이터 생성
    const mockDoc: Document = {
      id: `doc-${Date.now()}`,
      user_id: userId,
      project_id: projectId,
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
      url: `https://mock-storage.example.com/${file.name}`,
      metadata,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockDocuments.push(mockDoc);
    return mockDoc;
  }

  // Mock 문서 목록 조회
  async getDocuments(userId: string, projectId?: string): Promise<Document[]> {
    let filteredDocs = mockDocuments.filter(doc => doc.user_id === userId);
    
    if (projectId) {
      filteredDocs = filteredDocs.filter(doc => doc.project_id === projectId);
    }
    
    return filteredDocs.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  // Mock 문서 ID로 조회
  async getDocumentById(id: string): Promise<Document | null> {
    return mockDocuments.find(doc => doc.id === id) || null;
  }

  // Mock 문서 내용 업데이트
  async updateDocumentContent(id: string, content: string, embeddings?: number[]): Promise<Document | null> {
    const docIndex = mockDocuments.findIndex(doc => doc.id === id);
    if (docIndex === -1) return null;

    mockDocuments[docIndex] = {
      ...mockDocuments[docIndex],
      content,
      embeddings,
      updated_at: new Date().toISOString()
    };

    return mockDocuments[docIndex];
  }

  // Mock 문서 삭제
  async deleteDocument(id: string): Promise<boolean> {
    const docIndex = mockDocuments.findIndex(doc => doc.id === id);
    if (docIndex === -1) return false;

    mockDocuments.splice(docIndex, 1);
    return true;
  }

  // Mock 벡터 검색
  async searchDocuments(
    queryEmbedding: number[],
    matchThreshold: number = 0.7,
    matchCount: number = 10
  ): Promise<Document[]> {
    // Mock: 간단한 무작위 결과 반환
    return mockDocuments
      .filter(doc => doc.embeddings)
      .slice(0, matchCount);
  }

  // Mock 텍스트 검색
  async searchDocumentsByText(userId: string, query: string): Promise<Document[]> {
    return mockDocuments
      .filter(doc => 
        doc.user_id === userId && 
        (doc.name.toLowerCase().includes(query.toLowerCase()) ||
         doc.content?.toLowerCase().includes(query.toLowerCase()))
      )
      .slice(0, 20);
  }

  // Mock 문서 통계
  async getDocumentStats(userId: string) {
    const userDocs = mockDocuments.filter(doc => doc.user_id === userId);
    
    const stats = {
      total: userDocs.length,
      totalSize: 0,
      byType: {} as Record<string, number>,
      byProject: {} as Record<string, number>
    };

    userDocs.forEach(doc => {
      stats.totalSize += doc.size;
      
      const type = doc.type || 'unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;

      if (doc.project_id) {
        stats.byProject[doc.project_id] = (stats.byProject[doc.project_id] || 0) + 1;
      }
    });

    return stats;
  }

  // Mock 임베딩 생성
  async generateEmbeddings(text: string): Promise<number[]> {
    // Mock: 1536차원 랜덤 벡터 (OpenAI ada-002 형식)
    return new Array(1536).fill(0).map(() => Math.random());
  }

  // Mock 문서 처리
  async processDocument(documentId: string): Promise<Document | null> {
    const doc = await this.getDocumentById(documentId);
    
    if (!doc?.content) {
      throw new Error('Document has no content to process');
    }

    const embeddings = await this.generateEmbeddings(doc.content);
    return await this.updateDocumentContent(documentId, doc.content, embeddings);
  }

  // Mock 실시간 구독
  subscribeToChanges(userId: string, callback: (payload: any) => void) {
    // Mock: 빈 구독 객체 반환
    return {
      unsubscribe: () => {}
    };
  }
}

// 싱글톤 인스턴스
export const documentsService = new DocumentsService();