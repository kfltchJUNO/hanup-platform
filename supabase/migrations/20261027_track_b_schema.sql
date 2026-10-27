-- ============================================================================
-- 📘 HanUp (한업 | 韩升) Track B: Academic Argumentation Database Schema
-- Based on Chaim Perelman's New Rhetoric & Stephen Toulmin's Model of Argument
-- Migration Date: 2026-10-27
-- ============================================================================

-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Track B Curriculum Table (4 Steps, 16 Units)
CREATE TABLE IF NOT EXISTS public.track_b_curriculum (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    step INT NOT NULL CHECK (step BETWEEN 1 AND 4),
    unit_number INT NOT NULL CHECK (unit_number BETWEEN 1 AND 16),
    title TEXT NOT NULL,
    toulmin_focus TEXT[] NOT NULL DEFAULT '{}', -- e.g. ARRAY['C', 'D', 'W', 'B', 'Q', 'R']
    target_audience_pool JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of AudiencePersona
    dilemma_case JSONB NOT NULL DEFAULT '{}'::jsonb, -- DilemmaScenario, Conflict, Stakeholders
    discourse_markers JSONB NOT NULL DEFAULT '{}'::jsonb, -- Academic discourse connectives per element
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_track_b_step_unit UNIQUE (step, unit_number)
);

-- Index for speedy curriculum lookup
CREATE INDEX IF NOT EXISTS idx_track_b_curriculum_step_unit ON public.track_b_curriculum (step, unit_number);

-- 2. Track B Submissions Table (Drafts, Toulmin Tagging & Keystroke Telemetry)
CREATE TABLE IF NOT EXISTS public.track_b_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- References auth.users(id) or custom learner UID
    unit_id UUID NOT NULL REFERENCES public.track_b_curriculum(id) ON DELETE CASCADE,
    selected_audience JSONB NOT NULL DEFAULT '{}'::jsonb, -- Chosen Audience Persona
    draft_text TEXT NOT NULL DEFAULT '',
    toulmin_analysis JSONB DEFAULT NULL, -- Sentences, Scores (C, D, W, B, Q, R), Missing, Feedback
    keystroke_log JSONB DEFAULT '{}'::jsonb, -- Telemetry (pasteCount, cpm, backspaceCount, duration, events)
    revision_count INT NOT NULL DEFAULT 0,
    final_text TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_track_b_submissions_user_unit ON public.track_b_submissions (user_id, unit_id);
CREATE INDEX IF NOT EXISTS idx_track_b_submissions_created_at ON public.track_b_submissions (created_at DESC);

-- 3. Track B Coaching Table (1:1 Tutoring & Human-in-the-Loop Rhetorical Review)
CREATE TYPE public.coaching_status AS ENUM ('pending', 'reviewed');

CREATE TABLE IF NOT EXISTS public.track_b_coaching (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.track_b_submissions(id) ON DELETE CASCADE,
    tutor_id TEXT NOT NULL,
    rhetorical_comments JSONB NOT NULL DEFAULT '[]'::jsonb, -- Sentence-level sticky comments & stickers
    voice_memo_url TEXT DEFAULT NULL, -- Recorded audio feedback URL (.mp3 / .m4a)
    status public.coaching_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_track_b_coaching_submission ON public.track_b_coaching (submission_id);
CREATE INDEX IF NOT EXISTS idx_track_b_coaching_tutor_status ON public.track_b_coaching (tutor_id, status);

-- Trigger to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_track_b_submissions_updated ON public.track_b_submissions;
CREATE TRIGGER trg_track_b_submissions_updated
    BEFORE UPDATE ON public.track_b_submissions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_track_b_coaching_updated ON public.track_b_coaching;
CREATE TRIGGER trg_track_b_coaching_updated
    BEFORE UPDATE ON public.track_b_coaching
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Comment metadata for documentation
COMMENT ON TABLE public.track_b_curriculum IS 'Track B 4단계 16유닛 아카데믹 논증 쓰기 커리큘럼 명세';
COMMENT ON TABLE public.track_b_submissions IS 'Track B 학습자 제출물, 툴민 6요소 태깅 결과 및 키스트로크 텔레메트리 로그';
COMMENT ON TABLE public.track_b_coaching IS 'Track B 1:1 과외 튜터링 수사학 첨삭 및 음성 피드백';
