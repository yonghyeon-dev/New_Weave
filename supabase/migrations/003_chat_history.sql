-- 대화 세션 테이블
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  type VARCHAR(50) DEFAULT 'general', -- general, tax, rag
  summary TEXT,
  metadata JSONB DEFAULT '{}',
  is_archived BOOLEAN DEFAULT FALSE,
  is_starred BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW()
);

-- 대화 메시지 테이블
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_used INT,
  model VARCHAR(50),
  metadata JSONB DEFAULT '{}', -- 첨부파일, 계산결과 등
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 대화 태그 테이블
CREATE TABLE IF NOT EXISTS chat_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 세션-태그 연결 테이블
CREATE TABLE IF NOT EXISTS session_tags (
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES chat_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (session_id, tag_id)
);

-- 대화 북마크 테이블
CREATE TABLE IF NOT EXISTS chat_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 대화 검색 히스토리
CREATE TABLE IF NOT EXISTS chat_search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  query TEXT NOT NULL,
  results_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX idx_chat_sessions_last_message ON chat_sessions(last_message_at DESC);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_chat_bookmarks_user_id ON chat_bookmarks(user_id);

-- 전문 검색을 위한 인덱스
CREATE INDEX idx_chat_messages_content ON chat_messages USING gin(to_tsvector('korean', content));
CREATE INDEX idx_chat_sessions_title ON chat_sessions USING gin(to_tsvector('korean', title));

-- 세션 업데이트 트리거
CREATE OR REPLACE FUNCTION update_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_sessions 
  SET 
    last_message_at = NEW.created_at,
    updated_at = NOW()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_on_message
AFTER INSERT ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_session_timestamp();

-- 세션 요약 자동 생성 함수
CREATE OR REPLACE FUNCTION generate_session_title(session_id UUID)
RETURNS TEXT AS $$
DECLARE
  first_message TEXT;
BEGIN
  SELECT content INTO first_message
  FROM chat_messages
  WHERE session_id = generate_session_title.session_id
  AND role = 'user'
  ORDER BY created_at ASC
  LIMIT 1;
  
  -- 첫 메시지의 처음 50자를 제목으로 사용
  RETURN LEFT(first_message, 50);
END;
$$ LANGUAGE plpgsql;

-- 대화 검색 함수
CREATE OR REPLACE FUNCTION search_chat_history(
  p_user_id VARCHAR(255),
  p_query TEXT,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE(
  session_id UUID,
  session_title VARCHAR(255),
  message_id UUID,
  message_content TEXT,
  message_role VARCHAR(20),
  created_at TIMESTAMPTZ,
  rank REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id AS session_id,
    s.title AS session_title,
    m.id AS message_id,
    m.content AS message_content,
    m.role AS message_role,
    m.created_at,
    ts_rank(to_tsvector('korean', m.content), plainto_tsquery('korean', p_query)) AS rank
  FROM chat_sessions s
  JOIN chat_messages m ON s.id = m.session_id
  WHERE 
    s.user_id = p_user_id
    AND to_tsvector('korean', m.content) @@ plainto_tsquery('korean', p_query)
  ORDER BY rank DESC, m.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Row Level Security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_bookmarks ENABLE ROW LEVEL SECURITY;

-- 사용자별 접근 정책
CREATE POLICY "Users can view own sessions" ON chat_sessions
  FOR ALL USING (user_id = current_user_id());

CREATE POLICY "Users can view own messages" ON chat_messages
  FOR ALL USING (session_id IN (
    SELECT id FROM chat_sessions WHERE user_id = current_user_id()
  ));

CREATE POLICY "Users can manage own bookmarks" ON chat_bookmarks
  FOR ALL USING (user_id = current_user_id());

-- 통계 뷰
CREATE OR REPLACE VIEW chat_statistics AS
SELECT 
  user_id,
  COUNT(DISTINCT id) AS total_sessions,
  COUNT(DISTINCT CASE WHEN is_starred THEN id END) AS starred_sessions,
  COUNT(DISTINCT CASE WHEN is_archived THEN id END) AS archived_sessions,
  COUNT(DISTINCT DATE(created_at)) AS active_days,
  MAX(last_message_at) AS last_active
FROM chat_sessions
GROUP BY user_id;