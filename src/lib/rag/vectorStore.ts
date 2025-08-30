/**
 * 벡터 스토어 관리 모듈
 * Pinecone 또는 Supabase Vector를 사용한 벡터 저장 및 검색
 */

import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Supabase 클라이언트 초기화 (런타임에만)
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    )
  : null;

// Gemini AI 초기화 (임베딩용)
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * 문서 청크 인터페이스
 */
export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    category?: string;
    timestamp?: Date;
    userId?: string;
    projectId?: string;
    tags?: string[];
  };
  embedding?: number[];
}

/**
 * 검색 결과 인터페이스
 */
export interface SearchResult {
  chunk: DocumentChunk;
  similarity: number;
}

/**
 * 벡터 스토어 클래스
 */
export class VectorStore {
  private embeddingModel: any;

  constructor() {
    if (genAI) {
      this.embeddingModel = genAI.getGenerativeModel({ 
        model: 'embedding-001' 
      });
    }
  }

  /**
   * 텍스트를 임베딩 벡터로 변환
   */
  async createEmbedding(text: string): Promise<number[]> {
    if (!this.embeddingModel) {
      throw new Error('임베딩 모델이 초기화되지 않았습니다.');
    }

    try {
      const result = await this.embeddingModel.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error('임베딩 생성 실패:', error);
      throw error;
    }
  }

  /**
   * 문서를 청크로 분할
   */
  splitDocument(
    content: string, 
    chunkSize: number = 500, 
    overlap: number = 50
  ): string[] {
    const chunks: string[] = [];
    const sentences = content.split(/[.!?]+/);
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > chunkSize) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          // 오버랩 처리
          const words = currentChunk.split(' ');
          currentChunk = words.slice(-Math.floor(overlap / 10)).join(' ') + ' ';
        }
      }
      currentChunk += sentence + '. ';
    }
    
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }

  /**
   * 문서 인덱싱
   */
  async indexDocument(
    content: string,
    metadata: DocumentChunk['metadata']
  ): Promise<string[]> {
    const chunks = this.splitDocument(content);
    const chunkIds: string[] = [];

    for (const chunk of chunks) {
      const embedding = await this.createEmbedding(chunk);
      
      // Supabase에 저장
      const { data, error } = await supabase!
        .from('document_embeddings')
        .insert({
          content: chunk,
          embedding,
          metadata,
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) {
        console.error('청크 저장 실패:', error);
        continue;
      }

      if (data) {
        chunkIds.push(data.id);
      }
    }

    return chunkIds;
  }

  /**
   * 유사도 검색
   */
  async search(
    query: string,
    limit: number = 5,
    filter?: Partial<DocumentChunk['metadata']>
  ): Promise<SearchResult[]> {
    // 쿼리 임베딩 생성
    const queryEmbedding = await this.createEmbedding(query);

    // Supabase RPC를 사용한 벡터 검색
    let queryBuilder = supabase!.rpc('search_documents', {
      query_embedding: queryEmbedding,
      match_count: limit,
      filter: filter ? JSON.stringify(filter) : null
    });

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('검색 실패:', error);
      return [];
    }

    return data.map((item: any) => ({
      chunk: {
        id: item.id,
        content: item.content,
        metadata: item.metadata
      },
      similarity: item.similarity
    }));
  }

  /**
   * 하이브리드 검색 (벡터 + 키워드)
   */
  async hybridSearch(
    query: string,
    keywords: string[],
    limit: number = 5
  ): Promise<SearchResult[]> {
    // 벡터 검색
    const vectorResults = await this.search(query, limit * 2);
    
    // 키워드 필터링
    const keywordFiltered = vectorResults.filter(result => {
      const content = result.chunk.content.toLowerCase();
      return keywords.some(keyword => 
        content.includes(keyword.toLowerCase())
      );
    });

    // 결과 병합 및 스코어 조정
    const finalResults = [
      ...keywordFiltered.map(r => ({ ...r, similarity: r.similarity * 1.2 })),
      ...vectorResults.filter(r => !keywordFiltered.includes(r))
    ];

    return finalResults
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  /**
   * 문서 삭제
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    const { error } = await supabase!
      .from('document_embeddings')
      .delete()
      .match({ 'metadata->>documentId': documentId });

    return !error;
  }

  /**
   * 사용자별 문서 조회
   */
  async getUserDocuments(userId: string): Promise<DocumentChunk[]> {
    const { data, error } = await supabase!
      .from('document_embeddings')
      .select('*')
      .eq('metadata->>userId', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('문서 조회 실패:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      content: item.content,
      metadata: item.metadata
    }));
  }
}

export default VectorStore;