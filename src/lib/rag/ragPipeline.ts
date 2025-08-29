/**
 * RAG (Retrieval-Augmented Generation) 파이프라인
 * 사용자 데이터를 기반으로 컨텍스트를 구성하고 응답 생성
 */

import VectorStore, { SearchResult } from './vectorStore';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini AI 초기화
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * RAG 설정 인터페이스
 */
export interface RAGConfig {
  maxContextChunks: number;
  minSimilarityScore: number;
  useHybridSearch: boolean;
  includeMetadata: boolean;
  contextWindow: number;
}

/**
 * 대화 메시지 인터페이스
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

/**
 * RAG 응답 인터페이스
 */
export interface RAGResponse {
  answer: string;
  sources: SearchResult[];
  confidence: number;
  processingTime: number;
}

/**
 * RAG 파이프라인 클래스
 */
export class RAGPipeline {
  private vectorStore: VectorStore;
  private config: RAGConfig;
  private model: any;

  constructor(config: Partial<RAGConfig> = {}) {
    this.vectorStore = new VectorStore();
    this.config = {
      maxContextChunks: 5,
      minSimilarityScore: 0.7,
      useHybridSearch: true,
      includeMetadata: true,
      contextWindow: 4000,
      ...config
    };

    if (genAI) {
      this.model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash-lite',
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        }
      });
    }
  }

  /**
   * 쿼리에서 키워드 추출
   */
  private extractKeywords(query: string): string[] {
    // 간단한 키워드 추출 (실제로는 더 정교한 NLP 필요)
    const stopWords = new Set(['은', '는', '이', '가', '을', '를', '의', '에', '와', '과']);
    const words = query.split(/\s+/)
      .filter(word => word.length > 1 && !stopWords.has(word));
    
    return words;
  }

  /**
   * 컨텍스트 구성
   */
  private buildContext(
    searchResults: SearchResult[],
    query: string
  ): string {
    let context = '관련 정보:\n\n';
    
    // 유사도 점수로 필터링
    const relevantResults = searchResults
      .filter(r => r.similarity >= this.config.minSimilarityScore)
      .slice(0, this.config.maxContextChunks);

    if (relevantResults.length === 0) {
      return '';
    }

    // 컨텍스트 구성
    relevantResults.forEach((result, index) => {
      context += `[정보 ${index + 1}]\n`;
      context += result.chunk.content + '\n';
      
      if (this.config.includeMetadata && result.chunk.metadata) {
        const meta = result.chunk.metadata;
        if (meta.source) context += `출처: ${meta.source}\n`;
        if (meta.category) context += `카테고리: ${meta.category}\n`;
      }
      
      context += `(관련도: ${(result.similarity * 100).toFixed(1)}%)\n\n`;
    });

    return context;
  }

  /**
   * 프롬프트 생성
   */
  private createPrompt(
    query: string,
    context: string,
    chatHistory: ChatMessage[] = []
  ): string {
    let prompt = `당신은 사용자의 데이터와 지식을 활용하여 정확하고 도움이 되는 답변을 제공하는 AI 어시스턴트입니다.

제공된 정보를 바탕으로 사용자의 질문에 답변해주세요. 
정보가 불충분한 경우, 그 사실을 명확히 알려주세요.
답변 시 출처를 명시하고, 가능한 구체적이고 실용적인 답변을 제공하세요.

`;

    // 컨텍스트 추가
    if (context) {
      prompt += context + '\n';
    } else {
      prompt += '참고할 수 있는 관련 정보가 없습니다.\n\n';
    }

    // 대화 히스토리 추가
    if (chatHistory.length > 0) {
      prompt += '이전 대화:\n';
      chatHistory.slice(-3).forEach(msg => {
        const role = msg.role === 'user' ? '사용자' : 'AI';
        prompt += `${role}: ${msg.content}\n`;
      });
      prompt += '\n';
    }

    prompt += `현재 질문: ${query}\n\n답변:`;

    return prompt;
  }

  /**
   * 응답 신뢰도 계산
   */
  private calculateConfidence(
    searchResults: SearchResult[],
    responseLength: number
  ): number {
    if (searchResults.length === 0) return 0.3;

    const avgSimilarity = searchResults
      .slice(0, this.config.maxContextChunks)
      .reduce((sum, r) => sum + r.similarity, 0) / 
      Math.min(searchResults.length, this.config.maxContextChunks);

    const hasHighQualitySources = searchResults.some(r => r.similarity > 0.85);
    const responseQuality = Math.min(responseLength / 100, 1) * 0.3;

    let confidence = avgSimilarity * 0.5 + responseQuality;
    if (hasHighQualitySources) confidence += 0.2;

    return Math.min(confidence, 1);
  }

  /**
   * RAG 기반 응답 생성
   */
  async generateResponse(
    query: string,
    userId?: string,
    chatHistory: ChatMessage[] = []
  ): Promise<RAGResponse> {
    const startTime = Date.now();

    try {
      // 1. 관련 문서 검색
      let searchResults: SearchResult[];
      
      if (this.config.useHybridSearch) {
        const keywords = this.extractKeywords(query);
        searchResults = await this.vectorStore.hybridSearch(
          query, 
          keywords, 
          this.config.maxContextChunks * 2
        );
      } else {
        searchResults = await this.vectorStore.search(
          query,
          this.config.maxContextChunks * 2,
          userId ? { userId } : undefined
        );
      }

      // 2. 컨텍스트 구성
      const context = this.buildContext(searchResults, query);

      // 3. 프롬프트 생성
      const prompt = this.createPrompt(query, context, chatHistory);

      // 4. LLM으로 응답 생성
      if (!this.model) {
        throw new Error('AI 모델이 초기화되지 않았습니다.');
      }

      const result = await this.model.generateContent(prompt);
      const answer = result.response.text();

      // 5. 신뢰도 계산
      const confidence = this.calculateConfidence(searchResults, answer.length);

      // 6. 응답 반환
      return {
        answer,
        sources: searchResults.slice(0, this.config.maxContextChunks),
        confidence,
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      console.error('RAG 응답 생성 실패:', error);
      throw error;
    }
  }

  /**
   * 스트리밍 응답 생성
   */
  async *generateStreamingResponse(
    query: string,
    userId?: string,
    chatHistory: ChatMessage[] = [],
    onSourcesFound?: (sources: SearchResult[]) => void
  ): AsyncGenerator<string, void, unknown> {
    try {
      // 1. 관련 문서 검색
      const keywords = this.extractKeywords(query);
      const searchResults = await this.vectorStore.hybridSearch(
        query, 
        keywords, 
        this.config.maxContextChunks * 2
      );

      // 소스 콜백 호출
      if (onSourcesFound) {
        onSourcesFound(searchResults.slice(0, this.config.maxContextChunks));
      }

      // 2. 컨텍스트 구성
      const context = this.buildContext(searchResults, query);

      // 3. 프롬프트 생성
      const prompt = this.createPrompt(query, context, chatHistory);

      // 4. 스트리밍 생성
      if (!this.model) {
        throw new Error('AI 모델이 초기화되지 않았습니다.');
      }

      const result = await this.model.generateContentStream(prompt);

      // 5. 스트림 반환
      for await (const chunk of result.stream) {
        yield chunk.text();
      }

    } catch (error) {
      console.error('스트리밍 응답 생성 실패:', error);
      throw error;
    }
  }

  /**
   * 문서 업로드 및 인덱싱
   */
  async uploadDocument(
    content: string,
    metadata: {
      source: string;
      category?: string;
      userId?: string;
      projectId?: string;
      tags?: string[];
    }
  ): Promise<string[]> {
    return await this.vectorStore.indexDocument(content, metadata);
  }

  /**
   * 사용자 문서 목록 조회
   */
  async getUserDocuments(userId: string) {
    return await this.vectorStore.getUserDocuments(userId);
  }

  /**
   * 문서 삭제
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    return await this.vectorStore.deleteDocument(documentId);
  }
}

export default RAGPipeline;