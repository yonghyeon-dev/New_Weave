-- ==========================================
-- WEAVE ERP System - Missing Tables & Seed Data
-- Version: 1.0.2
-- Date: 2025-08-30
-- Test User ID: cbccf201-63f3-4859-8839-4dee8ea20ebf
-- ==========================================

-- ==========================================
-- 1. MISSING TABLES CREATION
-- ==========================================

-- profiles 테이블 (auth.users와 연동)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    company_name TEXT,
    business_number TEXT,
    phone TEXT,
    address TEXT,
    tax_type TEXT DEFAULT '일반과세',
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- notifications 테이블
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success', 'reminder')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    action_url TEXT,
    action_label TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- reminder_rules 테이블
CREATE TABLE IF NOT EXISTS reminder_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('tax_deadline', 'project_milestone', 'invoice_payment', 'document_expiry', 'custom')),
    trigger_type TEXT NOT NULL CHECK (trigger_type IN ('date', 'event', 'condition')),
    trigger_config JSONB NOT NULL,
    notification_channels TEXT[] DEFAULT ARRAY['app'],
    tone TEXT DEFAULT 'professional' CHECK (tone IN ('professional', 'friendly', 'urgent', 'casual')),
    is_enabled BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
    repeat_interval INTEGER, -- days
    max_reminders INTEGER DEFAULT 3,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- performance_metrics 테이블
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    page_url TEXT NOT NULL,
    metrics JSONB NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_reminder_rules_user_id ON reminder_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON performance_metrics(user_id);

-- ==========================================
-- 2. SEED DATA
-- ==========================================

-- 테스트 사용자 프로필 생성/업데이트
INSERT INTO profiles (id, email, full_name, company_name, business_number, phone, address, tax_type)
VALUES (
    'cbccf201-63f3-4859-8839-4dee8ea20ebf',
    'test@example.com',
    '홍길동',
    '테크스타트업 주식회사',
    '123-45-67890',
    '010-1234-5678',
    '서울특별시 강남구 테헤란로 123 IT빌딩 5층',
    '일반과세'
) ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    company_name = EXCLUDED.company_name,
    business_number = EXCLUDED.business_number,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    tax_type = EXCLUDED.tax_type;

-- ==========================================
-- CLIENTS 데이터 (재실행 가능)
-- ==========================================

-- 기존 데이터 삭제
DELETE FROM invoices WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf';
DELETE FROM projects WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf';
DELETE FROM clients WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf';

-- 클라이언트 데이터 삽입
INSERT INTO clients (user_id, name, company, business_number, email, phone, address, contact_person, status, tax_type, metadata) VALUES
('cbccf201-63f3-4859-8839-4dee8ea20ebf', '삼성전자', '삼성전자 주식회사', '124-81-00998', 'contact@samsung.com', '02-2255-0114', '경기도 수원시 영통구 삼성로 129', '김철수 과장', 'active', '일반과세', '{"industry": "전자제품", "contract_value": 150000000}'),
('cbccf201-63f3-4859-8839-4dee8ea20ebf', 'LG전자', 'LG전자 주식회사', '107-86-14075', 'contact@lge.com', '02-3777-1114', '서울특별시 영등포구 여의대로 128', '이영희 대리', 'active', '일반과세', '{"industry": "전자제품", "contract_value": 120000000}'),
('cbccf201-63f3-4859-8839-4dee8ea20ebf', '네이버', '네이버 주식회사', '220-81-62517', 'contact@navercorp.com', '1588-3820', '경기도 성남시 분당구 불정로 6', '박민수 팀장', 'active', '일반과세', '{"industry": "IT서비스", "contract_value": 80000000}'),
('cbccf201-63f3-4859-8839-4dee8ea20ebf', '카카오', '주식회사 카카오', '120-81-47521', 'contact@kakaocorp.com', '02-6718-1234', '제주특별자치도 제주시 첨단로 242', '최지원 매니저', 'active', '일반과세', '{"industry": "IT서비스", "contract_value": 95000000}'),
('cbccf201-63f3-4859-8839-4dee8ea20ebf', '쿠팡', '쿠팡 주식회사', '120-88-00767', 'contact@coupang.com', '1577-7011', '서울특별시 송파구 송파대로 570', '정수진 부장', 'active', '일반과세', '{"industry": "이커머스", "contract_value": 200000000}');

-- ==========================================
-- PROJECTS 데이터
-- ==========================================

INSERT INTO projects (user_id, client_id, name, description, status, priority, start_date, due_date, budget_estimated, budget_spent, progress, metadata) VALUES
('cbccf201-63f3-4859-8839-4dee8ea20ebf', 
 (SELECT id FROM clients WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf' AND name = '삼성전자' LIMIT 1), 
 '삼성전자 스마트팩토리 시스템', 'AI 기반 생산 관리 시스템', 'in_progress', 'high', 
 '2025-08-01', '2025-12-31', 150000000, 45000000, 35, 
 '{"tech_stack": ["React", "Node.js", "PostgreSQL"]}'),

('cbccf201-63f3-4859-8839-4dee8ea20ebf', 
 (SELECT id FROM clients WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf' AND name = 'LG전자' LIMIT 1), 
 'LG전자 IoT 플랫폼', 'ThinQ 연동 스마트홈 플랫폼', 'in_progress', 'high', 
 '2025-07-15', '2025-11-30', 120000000, 60000000, 50, 
 '{"tech_stack": ["Vue.js", "Python", "MongoDB"]}'),

('cbccf201-63f3-4859-8839-4dee8ea20ebf', 
 (SELECT id FROM clients WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf' AND name = '네이버' LIMIT 1), 
 '네이버 AI 챗봇', 'Clova 기반 상담 챗봇', 'completed', 'medium', 
 '2025-03-01', '2025-07-31', 80000000, 80000000, 100, 
 '{"tech_stack": ["React", "FastAPI", "Redis"]}'),

('cbccf201-63f3-4859-8839-4dee8ea20ebf', 
 (SELECT id FROM clients WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf' AND name = '카카오' LIMIT 1), 
 '카카오 메신저 플러그인', '비즈니스 메시지 자동화', 'in_progress', 'urgent', 
 '2025-08-15', '2025-09-30', 95000000, 25000000, 25, 
 '{"tech_stack": ["Next.js", "NestJS", "MySQL"]}'),

('cbccf201-63f3-4859-8839-4dee8ea20ebf', 
 (SELECT id FROM clients WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf' AND name = '쿠팡' LIMIT 1), 
 '쿠팡 물류 최적화', '머신러닝 배송 경로 최적화', 'planning', 'high', 
 '2025-10-01', '2026-03-31', 200000000, 0, 0, 
 '{"tech_stack": ["React", "Django", "PostgreSQL"]}');

-- ==========================================
-- INVOICES 데이터
-- ==========================================

INSERT INTO invoices (user_id, project_id, client_id, invoice_number, status, issue_date, due_date, subtotal, tax, total, items, metadata) 
SELECT 
    'cbccf201-63f3-4859-8839-4dee8ea20ebf',
    p.id,
    p.client_id,
    'INV-2025-' || LPAD(row_number() OVER ()::text, 4, '0'),
    CASE 
        WHEN p.status = 'completed' THEN 'paid'
        WHEN p.status = 'in_progress' THEN 'sent'
        ELSE 'draft'
    END,
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '30 days',
    30000000,
    3000000,
    33000000,
    '[{"description": "프로젝트 개발비", "quantity": 1, "price": 30000000}]'::jsonb,
    '{}'::jsonb
FROM projects p
WHERE p.user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf'
AND p.client_id IS NOT NULL;

-- ==========================================
-- DOCUMENTS 데이터
-- ==========================================

DELETE FROM documents WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf';

INSERT INTO documents (user_id, project_id, name, type, content, metadata)
SELECT 
    'cbccf201-63f3-4859-8839-4dee8ea20ebf',
    p.id,
    p.name || ' - 제안서.pdf',
    'proposal',
    '프로젝트 제안서 내용...',
    '{"pages": 30}'::jsonb
FROM projects p
WHERE p.user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf'
LIMIT 5;

-- ==========================================
-- CHAT SESSIONS & MESSAGES 데이터
-- ==========================================

DELETE FROM chat_messages WHERE session_id IN (SELECT id FROM chat_sessions WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf');
DELETE FROM chat_sessions WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf';

WITH new_session AS (
    INSERT INTO chat_sessions (user_id, title, type, metadata)
    VALUES (
        'cbccf201-63f3-4859-8839-4dee8ea20ebf',
        '프로젝트 관리 문의',
        'general',
        '{"tags": ["project"]}'::jsonb
    )
    RETURNING id
)
INSERT INTO chat_messages (session_id, role, content)
VALUES (
    (SELECT id FROM new_session),
    'user',
    '프로젝트 일정을 효율적으로 관리하는 방법을 알려주세요.'
);

-- ==========================================
-- TAX RECORDS 데이터
-- ==========================================

DELETE FROM tax_records WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf';

INSERT INTO tax_records (user_id, business_number, tax_type, status, year, quarter, amount, filed_date, due_date) VALUES
('cbccf201-63f3-4859-8839-4dee8ea20ebf', '123-45-67890', '부가가치세', '완료', 2025, 1, 15000000, '2025-04-25', '2025-04-25'),
('cbccf201-63f3-4859-8839-4dee8ea20ebf', '123-45-67890', '부가가치세', '완료', 2025, 2, 18000000, '2025-07-25', '2025-07-25'),
('cbccf201-63f3-4859-8839-4dee8ea20ebf', '123-45-67890', '법인세', '예정', 2025, null, 45000000, null, '2026-03-31');

-- ==========================================
-- REMINDERS 데이터
-- ==========================================

DELETE FROM reminders WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf';

INSERT INTO reminders (user_id, project_id, title, description, due_date, priority, status, metadata)
SELECT 
    'cbccf201-63f3-4859-8839-4dee8ea20ebf',
    p.id,
    p.name || ' - 진행 점검',
    '프로젝트 주간 보고',
    NOW() + INTERVAL '7 days',
    'medium',
    'pending',
    '{"type": "weekly"}'::jsonb
FROM projects p
WHERE p.user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf'
AND p.status = 'in_progress'
LIMIT 3;

-- ==========================================
-- REMINDER RULES 데이터
-- ==========================================

DELETE FROM reminder_rules WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf';

INSERT INTO reminder_rules (user_id, name, description, type, trigger_type, trigger_config, is_enabled, priority) VALUES
('cbccf201-63f3-4859-8839-4dee8ea20ebf', '프로젝트 마감 알림', '마감 7일 전 알림', 'project_milestone', 'date', '{"days_before": 7}', true, 8),
('cbccf201-63f3-4859-8839-4dee8ea20ebf', '세금 신고 알림', '신고 14일 전 알림', 'tax_deadline', 'date', '{"days_before": 14}', true, 9),
('cbccf201-63f3-4859-8839-4dee8ea20ebf', '인보이스 독촉', '결제 지연시 알림', 'invoice_payment', 'condition', '{"condition": "overdue"}', true, 7);

-- ==========================================
-- NOTIFICATIONS 데이터 (최근 알림)
-- ==========================================

DELETE FROM notifications WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf';

INSERT INTO notifications (user_id, type, title, message, read, action_url) VALUES
('cbccf201-63f3-4859-8839-4dee8ea20ebf', 'info', '새 프로젝트 시작', '카카오 메신저 플러그인 프로젝트가 시작되었습니다.', false, '/projects'),
('cbccf201-63f3-4859-8839-4dee8ea20ebf', 'success', '결제 완료', '삼성전자로부터 33,000,000원이 입금되었습니다.', false, '/invoices'),
('cbccf201-63f3-4859-8839-4dee8ea20ebf', 'warning', '프로젝트 마감 임박', 'LG IoT 플랫폼 프로젝트 마감이 30일 남았습니다.', false, '/projects'),
('cbccf201-63f3-4859-8839-4dee8ea20ebf', 'reminder', '세금 신고', '3분기 부가가치세 신고 기한이 다가옵니다.', false, '/tax'),
('cbccf201-63f3-4859-8839-4dee8ea20ebf', 'info', '시스템 업데이트', 'WEAVE ERP 시스템이 업데이트되었습니다.', true, null);

-- ==========================================
-- 결과 확인
-- ==========================================

DO $$
DECLARE
    rec RECORD;
    total_count INTEGER;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'WEAVE ERP 데이터 삽입 결과';
    RAISE NOTICE '========================================';
    
    FOR rec IN 
        SELECT 'profiles' as tbl, COUNT(*) as cnt FROM profiles WHERE id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf'
        UNION ALL
        SELECT 'clients', COUNT(*) FROM clients WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf'
        UNION ALL
        SELECT 'projects', COUNT(*) FROM projects WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf'
        UNION ALL
        SELECT 'invoices', COUNT(*) FROM invoices WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf'
        UNION ALL
        SELECT 'documents', COUNT(*) FROM documents WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf'
        UNION ALL
        SELECT 'chat_sessions', COUNT(*) FROM chat_sessions WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf'
        UNION ALL
        SELECT 'tax_records', COUNT(*) FROM tax_records WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf'
        UNION ALL
        SELECT 'reminders', COUNT(*) FROM reminders WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf'
        UNION ALL
        SELECT 'reminder_rules', COUNT(*) FROM reminder_rules WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf'
        UNION ALL
        SELECT 'notifications', COUNT(*) FROM notifications WHERE user_id = 'cbccf201-63f3-4859-8839-4dee8ea20ebf'
    LOOP
        RAISE NOTICE '%-15s: % 건', rec.tbl, rec.cnt;
        total_count := total_count + rec.cnt;
    END LOOP;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '총 데이터: % 건', total_count;
    RAISE NOTICE '========================================';
END $$;