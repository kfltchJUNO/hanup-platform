'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Award,
  GraduationCap,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Heart,
  ChevronRight,
  BookOpen,
  FileText,
  Flame,
  UserCheck,
} from 'lucide-react';
import { HanUpLogo } from '../../../components/HanUpLogo';
import { TRACK_B_CURRICULUM } from '../../../mock/trackBCurriculumData';
import {
  TrackBCurriculumUnit,
  AudiencePersona,
  ToulminAnalysisResult,
  UserSurveyEntry,
} from '../../../types/trackB';
import { AudienceCardSelector } from '../../../components/track-b/AudienceCardSelector';
import { ToulminHighlighter } from '../../../components/track-b/ToulminHighlighter';
import { ToulminRadarChart } from '../../../components/track-b/ToulminRadarChart';
import { ManuscriptGridEditor } from '../../../components/editor/ManuscriptGridEditor';
import { PreExperienceSurveyModal } from '../../../components/survey/PreExperienceSurveyModal';
import { PostExperienceSurveyModal } from '../../../components/survey/PostExperienceSurveyModal';
import { analyzeToulminStructure } from '../../../lib/services/trackBService';

export default function TrackBTrialPage() {
  const router = useRouter();

  // Free Trial Units: Unit 1 (청중 분석) & Unit 3 (이유 찾기 실습)
  const trialUnits = [
    TRACK_B_CURRICULUM[0], // Unit 1
    TRACK_B_CURRICULUM[2], // Unit 3
  ];

  const [selectedUnitIdx, setSelectedUnitIdx] = useState<number>(0);
  const currentUnit = trialUnits[selectedUnitIdx];

  const [selectedAudience, setSelectedAudience] = useState<AudiencePersona>(
    currentUnit.targetAudiencePool[0]
  );

  // Draft Text
  const [draftText, setDraftText] = useState<string>(
    selectedUnitIdx === 0
      ? `현대 초고령 사회에서 정년 연장은 노인 빈곤 문제를 해소하고 숙련 인력을 보전하기 위해 불가피한 조치이다. 통계청 조사에 따르면 65세 이상 노인의 상대적 빈곤율은 약 40%에 달하며, 이는 OECD 국가 중 최고 수준으로 나타났다. 숙련 노동자의 생존권과 국가 생산성 유지는 청년 세대의 일시적 진입 지연보다 우선하는 보편적 가치이기 때문이다. 비록 기업의 인건비 부담 증가와 신규 채용 축소라는 반론이 제기될 수 있으나, 이는 임금피크제 도입과 청년 고용 지원 세제 혜택을 병행하는 조건 하에서 충분히 극복될 수 있다.`
      : `인간의 창작적 지시와 프롬프트 큐레이션이 개입된 생성형 AI 산출물에는 제한적 저작권이 인정되어야 한다. 미국 저작권청 및 주요국 판례 경향에 따르면 기계적 도구의 고도화가 창작자의 주체성을 소멸시키는 것은 아니다. 과거 사진술이 처음 도입되었을 때 기계적 조작에도 불구하고 독창적 구도를 예술로 인정한 역사적 선례가 있기 때문이다. 비록 무분별한 복제물 범람 우려가 있으나, 이는 인간의 실질적 수정 기여도를 입증하는 조건 하에서 해결 가능하다.`
  );

  // Analysis & Survey States
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [toulminResult, setToulminResult] = useState<ToulminAnalysisResult | null>(null);

  // Survey Modals
  const [isPreSurveyOpen, setIsPreSurveyOpen] = useState<boolean>(false);
  const [isPostSurveyOpen, setIsPostSurveyOpen] = useState<boolean>(false);
  const [hasCompletedPreSurvey, setHasCompletedPreSurvey] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const done = localStorage.getItem('hanup_pre_survey_done');
      if (done) setHasCompletedPreSurvey(true);
    }
  }, []);

  // Update audience and default draft when unit changes
  const handleSelectUnit = (idx: number) => {
    setSelectedUnitIdx(idx);
    const unit = trialUnits[idx];
    setSelectedAudience(unit.targetAudiencePool[0]);
    setToulminResult(null);

    if (idx === 0) {
      setDraftText(
        `현대 초고령 사회에서 정년 연장은 노인 빈곤 문제를 해소하고 숙련 인력을 보전하기 위해 불가피한 조치이다. 통계청 조사에 따르면 65세 이상 노인의 상대적 빈곤율은 약 40%에 달하며, 이는 OECD 국가 중 최고 수준으로 나타났다. 숙련 노동자의 생존권과 국가 생산성 유지는 청년 세대의 일시적 진입 지연보다 우선하는 보편적 가치이기 때문이다. 비록 기업의 인건비 부담 증가와 신규 채용 축소라는 반론이 제기될 수 있으나, 이는 임금피크제 도입과 청년 고용 지원 세제 혜택을 병행하는 조건 하에서 충분히 극복될 수 있다.`
      );
    } else {
      setDraftText(
        `인간의 창작적 지시와 프롬프트 큐레이션이 개입된 생성형 AI 산출물에는 제한적 저작권이 인정되어야 한다. 미국 저작권청 및 주요국 판례 경향에 따르면 기계적 도구의 고도화가 창작자의 주체성을 소멸시키는 것은 아니다. 과거 사진술이 처음 도입되었을 때 기계적 조작에도 불구하고 독창적 구도를 예술로 인정한 역사적 선례가 있기 때문이다. 비록 무분별한 복제물 범람 우려가 있으나, 이는 인간의 실질적 수정 기여도를 입증하는 조건 하에서 해결 가능하다.`
      );
    }
  };

  const handleStartTrial = () => {
    if (!hasCompletedPreSurvey) {
      setIsPreSurveyOpen(true);
    }
  };

  const handleRunTrialAnalysis = async () => {
    if (!hasCompletedPreSurvey) {
      setIsPreSurveyOpen(true);
      return;
    }

    if (!draftText.trim()) {
      alert('체험할 본문을 작성해 주십시오.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await analyzeToulminStructure(draftText, selectedAudience);
      setToulminResult(res);

      // Trigger post experience survey after 1.5 seconds
      setTimeout(() => {
        setIsPostSurveyOpen(true);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('진단 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="shrink-0">
              <HanUpLogo size="sm" showText={true} />
            </Link>
            <div className="hidden sm:block h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-black uppercase">
                무료 체험 퍼널
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                Track B 아카데믹 논증 체험관
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!hasCompletedPreSurvey && (
              <button
                type="button"
                onClick={() => setIsPreSurveyOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-all"
              >
                사전 설문 참여하고 크레딧 받기
              </button>
            )}

            <Link
              href="/track-b/1/1"
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 shadow-sm transition-all"
            >
              정규 16유닛 바로가기
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>페렐만 신수사학 × 툴민 6요소 무료 체험</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            내 글의 수사학적 완성도, 실시간 툴민 AI로 진단받으세요
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            청중에 맞춘 가치 위계 설정(Unit 01)과 정당화 이유 찾기(Unit 03) 실습을 무료로 체험할 수 있습니다.
            문장 단위 C-D-W-B-Q-R 형광펜 자동 태깅 및 6차원 레이더 지수가 즉시 제공됩니다.
          </p>
        </div>
      </div>

      {/* 3. Trial Content Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Unit Selector Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            무료 체험 유닛 선택:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto">
            {trialUnits.map((u, i) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleSelectUnit(i)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all text-left flex items-center justify-between gap-3 border ${
                  selectedUnitIdx === i
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm font-black'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                }`}
              >
                <span>
                  Unit 0{u.unitNumber}. {u.title.split(':')[0]}
                </span>
                <span className="text-[10px] opacity-75 font-mono">
                  {i === 0 ? '청중 분석' : '이유 찾기'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Audience Selector Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <AudienceCardSelector
            audiencePool={currentUnit.targetAudiencePool}
            selectedAudience={selectedAudience}
            onSelectAudience={(aud) => setSelectedAudience(aud)}
          />
        </div>

        {/* Editor & Analysis Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 20-Cell Manuscript Grid Editor (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <FileText className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    체험 원고지 에디터 (Unit 0{currentUnit.unitNumber})
                  </h3>
                  <span className="text-xs text-slate-500">
                    아래 예시문을 수정하거나 나만의 논증문을 직접 작성해 보십시오.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunTrialAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAnalyzing ? '툴민 진단 중...' : '원클릭 툴민 AI 진단'}</span>
              </button>
            </div>

            <ManuscriptGridEditor
              value={draftText}
              onChange={(text) => setDraftText(text)}
              minChars={200}
              targetMaxChars={600}
              placeholder="여기에 학술 논증문을 작성하십시오..."
            />
          </div>

          {/* Right Column: Diagnosis Results (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {toulminResult ? (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    툴민 6요소 진단 결과
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPostSurveyOpen(true)}
                    className="text-[11px] font-bold text-emerald-600 hover:underline"
                  >
                    피드백 남기기
                  </button>
                </div>

                <ToulminHighlighter sentences={toulminResult.sentences} />

                <ToulminRadarChart
                  scores={toulminResult.scores}
                  missingElements={toulminResult.missing_elements}
                  audienceFitFeedback={toulminResult.audience_fit_feedback}
                />
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-black text-sm text-slate-900">
                  원클릭 툴민 AI 진단을 실행해 보세요
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  상단의 <strong>[원클릭 툴민 AI 진단]</strong> 버튼을 누르면 문장별 툴민 형광펜 태깅과
                  청중 부합도 리포트가 즉시 표시됩니다.
                </p>
                {!hasCompletedPreSurvey && (
                  <button
                    type="button"
                    onClick={() => setIsPreSurveyOpen(true)}
                    className="mt-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-colors"
                  >
                    사전 설문 참여하고 체험 크레딧 받기
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Regular Course Funnel CTA Banner */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                정규 4단계 16유닛 완주
              </span>
              <h3 className="text-base font-black">더 깊이 있는 아카데믹 논증 훈련을 원하시나요?</h3>
            </div>
            <p className="text-xs text-indigo-200/80">
              80분 표준 세션(딜레마 ➔ 드릴 ➔ 20칸 집필 ➔ AI 악마의 대변인 반론 공박)과 1:1 박사 튜터 코칭이 제공됩니다.
            </p>
          </div>

          <Link
            href="/track-b/1/1"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-indigo-950 font-black text-xs hover:bg-indigo-50 transition-all shadow-md shrink-0"
          >
            <span>정규 1유닛부터 시작하기</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* 4. Pre-Experience Survey Modal */}
      <PreExperienceSurveyModal
        isOpen={isPreSurveyOpen}
        onClose={() => setIsPreSurveyOpen(false)}
        onComplete={(survey) => {
          setHasCompletedPreSurvey(true);
          setIsPreSurveyOpen(false);
        }}
      />

      {/* 5. Post-Experience Feedback & Lead Modal */}
      <PostExperienceSurveyModal
        isOpen={isPostSurveyOpen}
        onClose={() => setIsPostSurveyOpen(false)}
        onComplete={() => {
          setIsPostSurveyOpen(false);
        }}
      />
    </div>
  );
}
