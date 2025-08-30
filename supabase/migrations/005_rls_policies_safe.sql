-- ==========================================
-- WEAVE ERP System - RLS Policies (Safe Version)
-- Version: 1.0.3
-- Date: 2025-08-30
-- 기존 정책을 먼저 삭제하고 다시 생성
-- ==========================================

-- ==========================================
-- 1. 기존 RLS 정책 모두 삭제
-- ==========================================

-- profiles 정책 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;

-- clients 정책 삭제
DROP POLICY IF EXISTS "Users can view own clients" ON clients;
DROP POLICY IF EXISTS "Users can create own clients" ON clients;
DROP POLICY IF EXISTS "Users can update own clients" ON clients;
DROP POLICY IF EXISTS "Users can delete own clients" ON clients;

-- projects 정책 삭제
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can create own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

-- documents 정책 삭제
DROP POLICY IF EXISTS "Users can view own documents" ON documents;
DROP POLICY IF EXISTS "Users can create own documents" ON documents;
DROP POLICY IF EXISTS "Users can update own documents" ON documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON documents;

-- invoices 정책 삭제
DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can create own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can update own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can delete own invoices" ON invoices;

-- chat_sessions 정책 삭제
DROP POLICY IF EXISTS "Users can view own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can create own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can update own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can delete own chat sessions" ON chat_sessions;

-- chat_messages 정책 삭제
DROP POLICY IF EXISTS "Users can view own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can create messages in own sessions" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete messages in own sessions" ON chat_messages;

-- notifications 정책 삭제
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;

-- reminders 정책 삭제
DROP POLICY IF EXISTS "Users can view own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can create own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can update own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can delete own reminders" ON reminders;

-- reminder_rules 정책 삭제
DROP POLICY IF EXISTS "Users can view own reminder rules" ON reminder_rules;
DROP POLICY IF EXISTS "Users can create own reminder rules" ON reminder_rules;
DROP POLICY IF EXISTS "Users can update own reminder rules" ON reminder_rules;
DROP POLICY IF EXISTS "Users can delete own reminder rules" ON reminder_rules;

-- tax_records 정책 삭제
DROP POLICY IF EXISTS "Users can view own tax records" ON tax_records;
DROP POLICY IF EXISTS "Users can create own tax records" ON tax_records;
DROP POLICY IF EXISTS "Users can update own tax records" ON tax_records;
DROP POLICY IF EXISTS "Users can delete own tax records" ON tax_records;

-- performance_metrics 정책 삭제
DROP POLICY IF EXISTS "Users can view own performance metrics" ON performance_metrics;
DROP POLICY IF EXISTS "Users can create own performance metrics" ON performance_metrics;

-- ==========================================
-- 2. RLS 활성화 (이미 활성화되어 있어도 안전)
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_records ENABLE ROW LEVEL SECURITY;

-- 테이블이 존재하는 경우에만 RLS 활성화
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') THEN
        ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reminder_rules') THEN
        ALTER TABLE reminder_rules ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'performance_metrics') THEN
        ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- ==========================================
-- 3. RLS 정책 생성
-- ==========================================

-- PROFILES 정책
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- CLIENTS 정책
CREATE POLICY "Users can view own clients" ON clients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own clients" ON clients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients" ON clients
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients" ON clients
    FOR DELETE USING (auth.uid() = user_id);

-- PROJECTS 정책
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- DOCUMENTS 정책
CREATE POLICY "Users can view own documents" ON documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own documents" ON documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON documents
    FOR DELETE USING (auth.uid() = user_id);

-- INVOICES 정책
CREATE POLICY "Users can view own invoices" ON invoices
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own invoices" ON invoices
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices" ON invoices
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices" ON invoices
    FOR DELETE USING (auth.uid() = user_id);

-- CHAT SESSIONS 정책
CREATE POLICY "Users can view own chat sessions" ON chat_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chat sessions" ON chat_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions" ON chat_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat sessions" ON chat_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- CHAT MESSAGES 정책
CREATE POLICY "Users can view own chat messages" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_sessions
            WHERE chat_sessions.id = chat_messages.session_id
            AND chat_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create messages in own sessions" ON chat_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_sessions
            WHERE chat_sessions.id = chat_messages.session_id
            AND chat_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete messages in own sessions" ON chat_messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM chat_sessions
            WHERE chat_sessions.id = chat_messages.session_id
            AND chat_sessions.user_id = auth.uid()
        )
    );

-- REMINDERS 정책
CREATE POLICY "Users can view own reminders" ON reminders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reminders" ON reminders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders" ON reminders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders" ON reminders
    FOR DELETE USING (auth.uid() = user_id);

-- TAX RECORDS 정책
CREATE POLICY "Users can view own tax records" ON tax_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tax records" ON tax_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tax records" ON tax_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tax records" ON tax_records
    FOR DELETE USING (auth.uid() = user_id);

-- NOTIFICATIONS 정책 (테이블이 존재하는 경우만)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') THEN
        CREATE POLICY "Users can view own notifications" ON notifications
            FOR SELECT USING (auth.uid() = user_id);
            
        CREATE POLICY "System can create notifications" ON notifications
            FOR INSERT WITH CHECK (auth.uid() = user_id);
            
        CREATE POLICY "Users can update own notifications" ON notifications
            FOR UPDATE USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can delete own notifications" ON notifications
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- REMINDER RULES 정책 (테이블이 존재하는 경우만)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reminder_rules') THEN
        CREATE POLICY "Users can view own reminder rules" ON reminder_rules
            FOR SELECT USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can create own reminder rules" ON reminder_rules
            FOR INSERT WITH CHECK (auth.uid() = user_id);
            
        CREATE POLICY "Users can update own reminder rules" ON reminder_rules
            FOR UPDATE USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can delete own reminder rules" ON reminder_rules
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- PERFORMANCE METRICS 정책 (테이블이 존재하는 경우만)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'performance_metrics') THEN
        CREATE POLICY "Users can view own performance metrics" ON performance_metrics
            FOR SELECT USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can create own performance metrics" ON performance_metrics
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- ==========================================
-- 4. 결과 확인
-- ==========================================

DO $$
DECLARE
    rec RECORD;
    policy_count INTEGER;
    total_policies INTEGER := 0;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RLS 정책 적용 결과';
    RAISE NOTICE '========================================';
    
    FOR rec IN 
        SELECT DISTINCT tablename as tbl
        FROM pg_policies 
        WHERE schemaname = 'public'
        ORDER BY tablename
    LOOP
        SELECT COUNT(*) INTO policy_count 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = rec.tbl;
        
        total_policies := total_policies + policy_count;
        RAISE NOTICE '%-20s: % 개 정책', rec.tbl, policy_count;
    END LOOP;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '총 RLS 정책: % 개', total_policies;
    RAISE NOTICE '========================================';
    
    -- RLS 활성화 상태 확인
    RAISE NOTICE '';
    RAISE NOTICE 'RLS 활성화 상태:';
    RAISE NOTICE '========================================';
    
    FOR rec IN 
        SELECT tablename as tbl, rowsecurity
        FROM pg_tables 
        WHERE schemaname = 'public'
        AND tablename IN ('profiles', 'clients', 'projects', 'documents', 
                         'invoices', 'chat_sessions', 'chat_messages', 
                         'notifications', 'reminders', 'reminder_rules', 
                         'tax_records', 'performance_metrics')
        ORDER BY tablename
    LOOP
        RAISE NOTICE '%-20s: %', rec.tbl, 
            CASE WHEN rec.rowsecurity THEN '✅ 활성화' ELSE '❌ 비활성화' END;
    END LOOP;
    
    RAISE NOTICE '========================================';
END $$;