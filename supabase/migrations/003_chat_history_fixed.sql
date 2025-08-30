-- 채팅 히스토리 관련 추가 기능

-- 채팅 세션 요약 테이블
CREATE TABLE IF NOT EXISTS chat_session_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    key_topics TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(session_id)
);

-- 채팅 메시지 반응 테이블
CREATE TABLE IF NOT EXISTS chat_message_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(message_id, user_id, reaction)
);

-- 채팅 컨텍스트 문서 연결 테이블
CREATE TABLE IF NOT EXISTS chat_context_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(session_id, document_id)
);

-- RLS 정책 추가
ALTER TABLE chat_session_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_context_documents ENABLE ROW LEVEL SECURITY;

-- Chat Session Summaries 정책
CREATE POLICY "Users can view own session summaries" ON chat_session_summaries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_sessions
            WHERE chat_sessions.id = chat_session_summaries.session_id
            AND chat_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own session summaries" ON chat_session_summaries
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_sessions
            WHERE chat_sessions.id = chat_session_summaries.session_id
            AND chat_sessions.user_id = auth.uid()
        )
    );

-- Message Reactions 정책
CREATE POLICY "Users can view reactions" ON chat_message_reactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add reactions" ON chat_message_reactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own reactions" ON chat_message_reactions
    FOR DELETE USING (auth.uid() = user_id);

-- Context Documents 정책
CREATE POLICY "Users can view own context documents" ON chat_context_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_sessions
            WHERE chat_sessions.id = chat_context_documents.session_id
            AND chat_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can add context documents" ON chat_context_documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_sessions
            WHERE chat_sessions.id = chat_context_documents.session_id
            AND chat_sessions.user_id = auth.uid()
        )
    );

-- 인덱스 추가 (영어 텍스트 검색 사용)
CREATE INDEX idx_chat_messages_content ON chat_messages USING gin(to_tsvector('english', content));
CREATE INDEX idx_chat_session_summaries_summary ON chat_session_summaries USING gin(to_tsvector('english', summary));

-- 채팅 세션의 최근 메시지 가져오기 함수
CREATE OR REPLACE FUNCTION get_recent_chat_sessions(
    user_uuid UUID,
    limit_count INT DEFAULT 20
)
RETURNS TABLE(
    session_id UUID,
    title VARCHAR,
    type VARCHAR,
    last_message_at TIMESTAMPTZ,
    message_count BIGINT,
    last_message TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        cs.id as session_id,
        cs.title,
        cs.type,
        MAX(cm.created_at) as last_message_at,
        COUNT(cm.id) as message_count,
        (
            SELECT content 
            FROM chat_messages 
            WHERE session_id = cs.id 
            ORDER BY created_at DESC 
            LIMIT 1
        ) as last_message
    FROM chat_sessions cs
    LEFT JOIN chat_messages cm ON cs.id = cm.session_id
    WHERE cs.user_id = user_uuid
    GROUP BY cs.id, cs.title, cs.type
    ORDER BY MAX(cm.created_at) DESC NULLS LAST
    LIMIT limit_count;
END;
$$;

-- 채팅 메시지 검색 함수
CREATE OR REPLACE FUNCTION search_chat_messages(
    user_uuid UUID,
    search_query TEXT,
    session_uuid UUID DEFAULT NULL
)
RETURNS TABLE(
    message_id UUID,
    session_id UUID,
    content TEXT,
    role VARCHAR,
    created_at TIMESTAMPTZ,
    rank REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        cm.id as message_id,
        cm.session_id,
        cm.content,
        cm.role,
        cm.created_at,
        ts_rank(to_tsvector('english', cm.content), plainto_tsquery('english', search_query)) as rank
    FROM chat_messages cm
    INNER JOIN chat_sessions cs ON cm.session_id = cs.id
    WHERE cs.user_id = user_uuid
        AND (session_uuid IS NULL OR cm.session_id = session_uuid)
        AND to_tsvector('english', cm.content) @@ plainto_tsquery('english', search_query)
    ORDER BY rank DESC, cm.created_at DESC
    LIMIT 50;
END;
$$;