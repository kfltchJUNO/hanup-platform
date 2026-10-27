-- ============================================================================
-- 📘 HanUp Track B & Free Trial Survey System Schema
-- Migration: 20261027_track_b_and_survey_schema.sql
-- ============================================================================

-- 1. 온보딩 및 사후 설문 로그 테이블
CREATE TABLE IF NOT EXISTS public.user_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL, -- 비회원 무료 체험자 추적용 식별자
  survey_type TEXT NOT NULL CHECK (survey_type IN ('pre_onboarding', 'post_experience')),
  selected_track TEXT CHECK (selected_track IN ('track_a', 'track_b', 'general')),
  l1_language TEXT NOT NULL,
  l1_custom_text TEXT,
  target_topik_level TEXT,
  writing_bottlenecks JSONB NOT NULL DEFAULT '[]'::jsonb, -- 선택된 객관식 항목 배열
  writing_bottlenecks_custom TEXT, -- 필수 주관식 의견
  irb_consent BOOLEAN NOT NULL DEFAULT false,
  -- 사후 설문 전용 필드
  feedback_score INT CHECK (feedback_score BETWEEN 1 AND 5),
  needed_supports JSONB DEFAULT '[]'::jsonb,
  needed_supports_custom TEXT, -- 필수 주관식 의견
  contact_info TEXT, -- 위챗 ID, 이메일 등
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Track B 학습 제출 및 텔레메트리 테이블
CREATE TABLE IF NOT EXISTS public.track_b_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  unit_number INT NOT NULL,
  selected_audience JSONB NOT NULL DEFAULT '{}'::jsonb,
  draft_text TEXT NOT NULL DEFAULT '',
  toulmin_analysis JSONB,
  devils_advocate_rebuttal TEXT,
  counter_rebuttal_text TEXT,
  keystroke_log JSONB DEFAULT '{}'::jsonb,
  revision_intent_notes TEXT,
  is_free_trial BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 1:1 과외 및 튜터 코칭 테이블
CREATE TABLE IF NOT EXISTS public.track_b_coaching (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.track_b_submissions(id) ON DELETE CASCADE,
  tutor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rhetorical_comments JSONB DEFAULT '[]'::jsonb, -- 문장별 수사적 코멘트 및 툴민 스티커 배열
  voice_memo_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책 설정
ALTER TABLE public.user_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.track_b_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.track_b_coaching ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anonymous insert with session_id') THEN
    CREATE POLICY "Allow anonymous insert with session_id" ON public.user_surveys
      FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anonymous select user_surveys') THEN
    CREATE POLICY "Allow anonymous select user_surveys" ON public.user_surveys
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anonymous insert submissions') THEN
    CREATE POLICY "Allow anonymous insert submissions" ON public.track_b_submissions
      FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read submissions for owner or session') THEN
    CREATE POLICY "Allow read submissions for owner or session" ON public.track_b_submissions
      FOR SELECT USING (auth.uid() = user_id OR session_id IS NOT NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all insert coaching') THEN
    CREATE POLICY "Allow all insert coaching" ON public.track_b_coaching
      FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all select coaching') THEN
    CREATE POLICY "Allow all select coaching" ON public.track_b_coaching
      FOR SELECT USING (true);
  END IF;
END $$;
