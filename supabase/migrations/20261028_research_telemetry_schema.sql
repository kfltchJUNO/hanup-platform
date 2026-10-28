-- ============================================================================
-- 📘 HanUp Track B Research Telemetry & Revision History Schema
-- Based on '논증텍스트작성 커리큘럼.md'
-- Migration: 20261028_research_telemetry_schema.sql
-- ============================================================================

-- 1. 학습자 텍스트 수정 이력 테이블 (Draft 1 -> AI 반론 -> Draft 2)
CREATE TABLE IF NOT EXISTS public.user_writing_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id INT NOT NULL, -- 1 to 16
    track_type VARCHAR(20) DEFAULT 'CORE', -- 'CORE' (Sessions 1-8) or 'ADVANCED' (Sessions 9-16)
    draft_number INT NOT NULL, -- 1 (초안) or 2 (수정본)
    content TEXT NOT NULL,
    word_count INT NOT NULL,
    toulmin_scores JSONB, -- {claim: 80, warrant: 60, ...}
    sfl_metadata JSONB,   -- {modality_ratio: {...}, engagement_tags: [...]}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_user_writing_revisions_user_session 
    ON public.user_writing_revisions (user_id, session_id, draft_number);

-- 2. AI 악마의 대변인 상호작용 및 수용/거부 로그
CREATE TABLE IF NOT EXISTS public.ai_interaction_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    revision_id UUID REFERENCES public.user_writing_revisions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ai_counter_argument TEXT NOT NULL,
    suggested_target VARCHAR(10), -- 'W', 'Q', 'C' 등
    user_action VARCHAR(20) NOT NULL CHECK (user_action IN ('ACCEPTED', 'REJECTED', 'IGNORED')),
    user_revision_note TEXT NOT NULL, -- 학생이 직접 입력한 수정 의도 메모 (필수)
    time_spent_seconds INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_ai_interaction_logs_revision 
    ON public.ai_interaction_logs (revision_id);

-- RLS Policies
ALTER TABLE public.user_writing_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interaction_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anonymous insert writing revisions') THEN
    CREATE POLICY "Allow anonymous insert writing revisions" ON public.user_writing_revisions
      FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow select writing revisions') THEN
    CREATE POLICY "Allow select writing revisions" ON public.user_writing_revisions
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anonymous insert interaction logs') THEN
    CREATE POLICY "Allow anonymous insert interaction logs" ON public.ai_interaction_logs
      FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow select interaction logs') THEN
    CREATE POLICY "Allow select interaction logs" ON public.ai_interaction_logs
      FOR SELECT USING (true);
  END IF;
END $$;
