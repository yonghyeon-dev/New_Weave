-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 문서 임베딩 테이블
CREATE TABLE IF NOT EXISTS document_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding vector(768), -- Gemini embedding dimension
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 메타데이터 인덱스
CREATE INDEX idx_document_embeddings_metadata ON document_embeddings USING GIN (metadata);
CREATE INDEX idx_document_embeddings_created_at ON document_embeddings (created_at DESC);

-- 벡터 유사도 검색 인덱스 (IVFFlat)
CREATE INDEX idx_document_embeddings_vector ON document_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 벡터 검색 함수
CREATE OR REPLACE FUNCTION search_documents(
  query_embedding vector,
  match_count INT DEFAULT 5,
  filter JSONB DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    de.id,
    de.content,
    de.metadata,
    1 - (de.embedding <=> query_embedding) AS similarity
  FROM document_embeddings de
  WHERE 
    (filter IS NULL OR de.metadata @> filter)
  ORDER BY de.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 하이브리드 검색 함수 (벡터 + 텍스트)
CREATE OR REPLACE FUNCTION hybrid_search_documents(
  query_embedding vector,
  query_text TEXT,
  match_count INT DEFAULT 5,
  filter JSONB DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT,
  text_rank FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH vector_search AS (
    SELECT 
      de.id,
      de.content,
      de.metadata,
      1 - (de.embedding <=> query_embedding) AS vector_similarity
    FROM document_embeddings de
    WHERE 
      (filter IS NULL OR de.metadata @> filter)
    ORDER BY de.embedding <=> query_embedding
    LIMIT match_count * 2
  ),
  text_search AS (
    SELECT 
      id,
      ts_rank(to_tsvector('english', content), plainto_tsquery('english', query_text)) AS text_rank
    FROM document_embeddings
    WHERE 
      to_tsvector('english', content) @@ plainto_tsquery('english', query_text)
      AND (filter IS NULL OR metadata @> filter)
  )
  SELECT 
    vs.id,
    vs.content,
    vs.metadata,
    vs.vector_similarity * 0.7 + COALESCE(ts.text_rank, 0) * 0.3 AS similarity,
    COALESCE(ts.text_rank, 0) AS text_rank
  FROM vector_search vs
  LEFT JOIN text_search ts ON vs.id = ts.id
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- 문서 통계 테이블
CREATE TABLE IF NOT EXISTS document_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  document_count INT DEFAULT 0,
  total_chunks INT DEFAULT 0,
  total_tokens INT DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 사용자별 문서 통계 업데이트 트리거
CREATE OR REPLACE FUNCTION update_document_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- 통계 업데이트
  INSERT INTO document_stats (user_id, document_count, total_chunks)
  VALUES (
    NEW.metadata->>'userId',
    1,
    1
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    document_count = document_stats.document_count + 1,
    total_chunks = document_stats.total_chunks + 1,
    last_updated = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_document_stats
AFTER INSERT ON document_embeddings
FOR EACH ROW
EXECUTE FUNCTION update_document_stats();

-- Row Level Security (RLS)
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;

-- 사용자별 접근 정책
CREATE POLICY "Users can view own documents" ON document_embeddings
  FOR SELECT USING (metadata->>'userId' = auth.uid()::text);

CREATE POLICY "Users can insert own documents" ON document_embeddings
  FOR INSERT WITH CHECK (metadata->>'userId' = auth.uid()::text);

CREATE POLICY "Users can delete own documents" ON document_embeddings
  FOR DELETE USING (metadata->>'userId' = auth.uid()::text);

-- 인덱스 최적화
ANALYZE document_embeddings;