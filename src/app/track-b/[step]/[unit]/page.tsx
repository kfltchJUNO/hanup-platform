'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Compass,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Send,
  Save,
  RotateCcw,
  Play,
  Pause,
  Layers,
  Flame,
  UserCheck,
  FileText,
  Target,
  GraduationCap,
} from 'lucide-react';
import { HanUpLogo } from '../../../../components/HanUpLogo';
import { TRACK_B_CURRICULUM } from '../../../../mock/trackBCurriculumData';
import {
  TrackBCurriculumUnit,
  AudiencePersona,
  ToulminAnalysisResult,
  DevilsAdvocateResult,
  TrackBKeystrokeLog,
  RhetoricalComment,
  ToulminSentence,
  ToulminElement,
} from '../../../../types/trackB';
import { AudienceCardSelector } from '../../../../components/track-b/AudienceCardSelector';
import { ToulminHighlighter } from '../../../../components/track-b/ToulminHighlighter';
import { ToulminRadarChart } from '../../../../components/track-b/ToulminRadarChart';
import { DevilsAdvocateModal } from '../../../../components/track-b/DevilsAdvocateModal';
import { TutorCoachingBar } from '../../../../components/track-b/TutorCoachingBar';
import { ManuscriptGridEditor } from '../../../../components/editor/ManuscriptGridEditor';
import { analyzeToulminStructure, generateDevilsAdvocate } from '../../../../lib/services/trackBService';

type SessionStage = 1 | 2 | 3 | 4;

export default function TrackBUnitPage() {
  const params = useParams();
  const router = useRouter();

  const stepParam = Number(params.step) || 1;
  const unitParam = Number(params.unit) || 1;

  // Find curriculum unit
  const currentUnit: TrackBCurriculumUnit =
    TRACK_B_CURRICULUM.find(
      (u) => u.step === stepParam && u.unitNumber === unitParam
    ) ||
    TRACK_B_CURRICULUM.find((u) => u.unitNumber === unitParam) ||
    TRACK_B_CURRICULUM[0];

  // 1. Session Stage (1: 딜레마 15분 -> 2: 드릴 20분 -> 3: 집필 25분 -> 4: AI반론 20분)
  const [currentStage, setCurrentStage] = useState<SessionStage>(1);

  // 80-minute Countdown Timer (4800 seconds total)
  const [sessionSeconds, setSessionSeconds] = useState<number>(80 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Selected Target Audience
  const [selectedAudience, setSelectedAudience] = useState<AudiencePersona>(
    currentUnit.targetAudiencePool[0]
  );

  // Draft Text & Telemetry
  const [draftText, setDraftText] = useState<string>(
    `현대 초고령 사회에서 정년 연장은 노인 빈곤 문제를 해소하고 숙련 인력을 보전하기 위해 불가피한 조치이다. 통계청 조사에 따르면 65세 이상 노인의 상대적 빈곤율은 약 40%에 달하며, 이는 OECD 국가 중 최고 수준으로 나타났다. 숙련 노동자의 생존권과 국가 생산성 유지는 청년 세대의 일시적 진입 지연보다 우선하는 보편적 가치이기 때문이다. 비록 기업의 인건비 부담 증가와 신규 채용 축소라는 반론이 제기될 수 있으나, 이는 임금피크제 도입과 청년 고용 지원 세제 혜택을 병행하는 조건 하에서 충분히 극복될 수 있다.`
  );
  const [keystrokeLog, setKeystrokeLog] = useState<TrackBKeystrokeLog | null>(null);

  // Stage 3 Toulmin Analysis States
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [toulminResult, setToulminResult] = useState<ToulminAnalysisResult | null>(null);
  const [selectedSentenceIdx, setSelectedSentenceIdx] = useState<number | null>(null);
  const [selectedSentenceText, setSelectedSentenceText] = useState<string | null>(null);

  // Stage 4 Devil's Advocate States
  const [isDevilsModalOpen, setIsDevilsModalOpen] = useState<boolean>(false);
  const [isDevilsLoading, setIsDevilsLoading] = useState<boolean>(false);
  const [devilsResult, setDevilsResult] = useState<DevilsAdvocateResult | null>(null);
  const [counterRebuttalText, setCounterRebuttalText] = useState<string>('');
  const [hasCompletedStage4, setHasCompletedStage4] = useState<boolean>(false);

  // 1:1 Tutor Coaching Bar
  const [isInstructorMode, setIsInstructorMode] = useState<boolean>(false);
  const [rhetoricalComments, setRhetoricalComments] = useState<RhetoricalComment[]>([
    {
      id: 'cmt_mock_01',
      sentenceIdx: 2,
      sentenceText: '숙련 노동자의 생존권과 국가 생산성 유지는...',
      element: 'W',
      comment: '정당화(W)에서 청중이 반발할 수 있는 가치 위계를 매우 대담하게 설정했습니다. 이 부분에 대한 보강이 필요합니다.',
      createdAt: new Date().toISOString(),
    },
  ]);

  // Stage 2: Drill Practice State
  const [drillAnswers, setDrillAnswers] = useState<Record<string, string>>({});
  const [drillChecked, setDrillChecked] = useState<boolean>(false);

  // Timer Effect
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setSessionSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Sync Audience if unit changes
  useEffect(() => {
    if (currentUnit.targetAudiencePool.length > 0) {
      setSelectedAudience(currentUnit.targetAudiencePool[0]);
    }
    setToulminResult(null);
    setDevilsResult(null);
    setCounterRebuttalText('');
    setHasCompletedStage4(false);
  }, [currentUnit.id]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Run Toulmin Analysis
  const handleRunAnalysis = async () => {
    if (!draftText.trim()) {
      alert('분석할 본문을 먼저 작성해 주십시오.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await analyzeToulminStructure(draftText, selectedAudience);
      setToulminResult(res);
    } catch (err) {
      console.error(err);
      alert('툴민 분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run Devil's Advocate
  const handleOpenDevilsAdvocate = async () => {
    setIsDevilsModalOpen(true);
    if (!devilsResult) {
      setIsDevilsLoading(true);
      try {
        const claimSentence =
          toulminResult?.sentences.find((s) => s.element === 'C')?.text ||
          '정년 연장은 국가 생산성을 위해 필수적이다.';
        const warrantSentence =
          toulminResult?.sentences.find((s) => s.element === 'W')?.text ||
          '숙련 인력 유지가 청년 일자리보다 우선하는 보편적 가치이기 때문이다.';

        const result = await generateDevilsAdvocate(
          claimSentence,
          warrantSentence,
          selectedAudience
        );
        setDevilsResult(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsDevilsLoading(false);
      }
    }
  };

  const handleConfirmCounterRebuttal = (counterText: string) => {
    setCounterRebuttalText(counterText);
    setHasCompletedStage4(true);

    // Append counter rebuttal to draft if desired
    setDraftText((prev) => `${prev}\n\n[재반박(Counter-Rebuttal)]\n${counterText}`);
  };

  const handleAddComment = (commentData: {
    sentenceIdx: number;
    sentenceText: string;
    element: ToulminElement;
    comment: string;
  }) => {
    const newComment: RhetoricalComment = {
      id: `cmt_${Date.now()}`,
      sentenceIdx: commentData.sentenceIdx,
      sentenceText: commentData.sentenceText,
      element: commentData.element,
      comment: commentData.comment,
      createdAt: new Date().toISOString(),
    };
    setRhetoricalComments((prev) => [newComment, ...prev]);
  };

  const handleDeleteComment = (commentId: string) => {
    setRhetoricalComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  // Sub-stage titles and recommended time
  const stageMetas = [
    { num: 1, title: '1단계: 딜레마 사례 분석', minutes: 15, desc: '청중 설정 및 가치 충돌 파악' },
    { num: 2, title: '2단계: 툴민 드릴 훈련', minutes: 20, desc: '학술 담화 표지 및 6요소 연결' },
    { num: 3, title: '3단계: 20칸 원고지 집필', minutes: 25, desc: '초안 작성 & 툴민 자동 진단' },
    { num: 4, title: '4단계: AI 악마의 반론', minutes: 20, desc: '가치 공박에 맞선 재반박 완결' },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 pb-16 font-sans">
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/onboarding" className="shrink-0">
              <HanUpLogo size="sm" showText={true} />
            </Link>
            <div className="hidden sm:block h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-black uppercase tracking-wider">
                Track B
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-800 truncate max-w-[280px] sm:max-w-md">
                Unit {currentUnit.unitNumber}. {currentUnit.title}
              </span>
            </div>
          </div>

          {/* Unit Switcher & 80-min Timer */}
          <div className="flex items-center gap-3">
            {/* Unit Navigator Dropdown */}
            <select
              value={currentUnit.unitNumber}
              onChange={(e) => {
                const target = TRACK_B_CURRICULUM.find(
                  (u) => u.unitNumber === Number(e.target.value)
                );
                if (target) router.push(`/track-b/${target.step}/${target.unitNumber}`);
              }}
              className="hidden md:block text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {TRACK_B_CURRICULUM.map((u) => (
                <option key={u.id} value={u.unitNumber}>
                  Unit {u.unitNumber}: {u.title.slice(0, 24)}...
                </option>
              ))}
            </select>

            {/* Session Timer */}
            <div className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-2xl text-xs font-mono shadow-sm">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">{formatTimer(sessionSeconds)}</span>
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="ml-1 text-slate-400 hover:text-white"
                title={isTimerRunning ? '타이머 일시정지' : '타이머 재개'}
              >
                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>

            {/* Instructor Mode Switch */}
            <button
              type="button"
              onClick={() => setIsInstructorMode(!isInstructorMode)}
              className={`hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isInstructorMode
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isInstructorMode ? '튜터 코칭 중' : '교사 코칭 뷰'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Stepper Header Bar (80-min Standard 4-Stages) */}
      <div className="bg-slate-900 text-white px-4 py-3 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
            {stageMetas.map((st) => {
              const isActive = currentStage === st.num;
              const isPast = currentStage > st.num;

              return (
                <button
                  key={st.num}
                  type="button"
                  onClick={() => setCurrentStage(st.num as SessionStage)}
                  className={`flex flex-col text-left p-2.5 rounded-2xl transition-all border ${
                    isActive
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                      : isPast
                      ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-200">
                      {st.minutes}분 세션
                    </span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <span className="font-black text-xs mt-1 truncate">{st.title}</span>
                  <span className="text-[10px] opacity-75 truncate">{st.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Main Stage Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* ========================================================= */}
        {/* Stage 1: 딜레마 사례 분석 & 청중 설정 (15분) */}
        {/* ========================================================= */}
        {currentStage === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Dilemma Case Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl">
                    <Compass className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-xs font-black text-amber-800 uppercase tracking-wider">
                      아카데믹 딜레마 시나리오
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      {currentUnit.dilemmaCase.title}
                    </h2>
                  </div>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
                  수사학적 유형: <strong>{currentUnit.dilemmaCase.perelmanDilemmaType}</strong>
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm leading-relaxed text-slate-800 font-sans">
                {currentUnit.dilemmaCase.scenario}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/60 space-y-1">
                  <strong className="text-rose-950 font-black block">
                    ⚖️ 핵심 가치 충돌 (Core Conflict):
                  </strong>
                  <p className="text-rose-900 leading-relaxed font-sans">
                    {currentUnit.dilemmaCase.coreConflict}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 space-y-1">
                  <strong className="text-blue-950 font-black block">
                    👥 주요 이해관계자 (Stakeholders):
                  </strong>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentUnit.dilemmaCase.stakeholders.map((sh, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-lg bg-white border border-blue-200 text-blue-900 font-bold"
                      >
                        {sh}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Audience Card Selector */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <AudienceCardSelector
                audiencePool={currentUnit.targetAudiencePool}
                selectedAudience={selectedAudience}
                onSelectAudience={(aud) => setSelectedAudience(aud)}
              />
            </div>

            {/* Next Stage Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStage(2)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all cursor-pointer"
              >
                <span>청중 설정 완료 ➔ 2단계 툴민 드릴 훈련하기</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* Stage 2: 툴민 수사학 드릴 훈련 (20분) */}
        {/* ========================================================= */}
        {currentStage === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Discourse Markers Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-black text-sm text-slate-900">
                      Unit {currentUnit.unitNumber} 공략: 학술 담화 표지(Discourse Markers)
                    </h3>
                    <p className="text-xs text-slate-500">
                      문장 성분에 따라 적절한 연결 표지를 사용하여 툴민 6요소를 정교하게 엮어내십시오.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {(Object.entries(currentUnit.discourseMarkers) as [string, string[]][]).map(([elemKey, markers]) => (
                  <div
                    key={elemKey}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5"
                  >
                    <span className="font-black text-slate-800 uppercase tracking-wider block text-[11px]">
                      {elemKey.toUpperCase()} 담화 표지:
                    </span>
                    <ul className="space-y-1 text-slate-600">
                      {markers.map((m: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span>&ldquo;{m}&rdquo;</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Drill Practice */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-500" />
                  <span>실전 드릴: 정당화(Warrant)와 자료(Data) 잇기</span>
                </h3>
                <span className="text-xs text-slate-500">
                  선택한 청중 [{selectedAudience.role}]을 설득할 가장 적절한 정당화를 선택하십시오.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-2 text-xs">
                <strong className="text-amber-950 font-bold block">
                  [제시된 자료 D]: &ldquo;통계청 조사에 따르면 65세 이상 노인의 상대적 빈곤율은 40%에 달한다.&rdquo;
                </strong>
                <p className="text-amber-900 leading-relaxed font-sans">
                  청중의 거부감(&ldquo;{selectedAudience.frictionFactor}&rdquo;)을 최소화하면서 주장 C로 건너갈 수 있는 가장 강력한 정당화(W) 문장은?
                </p>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  {
                    id: 'drill_opt_1',
                    text: 'A. 노인 빈곤은 전적으로 국가의 책임이므로 기업이 희생을 감수해야 한다.',
                    isCorrect: false,
                    feedback: '기업 및 관료 청중의 저항을 유발하는 일방적 당위론입니다.',
                  },
                  {
                    id: 'drill_opt_2',
                    text: 'B. 숙련 인력을 경제활동에 유지시키는 것이 노인 복지 재정 지출을 절감하고 내수를 진작시키는 가장 효율적인 선결 과제이기 때문이다.',
                    isCorrect: true,
                    feedback: '재정 건전성과 기업 생산성을 동시에 고려한 페렐만식 가치 위계 정당화입니다.',
                  },
                  {
                    id: 'drill_opt_3',
                    text: 'C. 청년들은 다른 신산업 분야로 진출하면 되므로 기성세대의 정년을 먼저 보장해야 한다.',
                    isCorrect: false,
                    feedback: '세대 간 갈등을 촉발하는 부적절한 논증입니다.',
                  },
                ].map((opt) => {
                  const isChosen = drillAnswers['drill_1'] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => {
                        setDrillAnswers((prev) => ({ ...prev, drill_1: opt.id }));
                        setDrillChecked(true);
                      }}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-1 ${
                        isChosen
                          ? opt.isCorrect
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-rose-500 bg-rose-50'
                          : 'border-slate-200 bg-slate-50 hover:bg-white'
                      }`}
                    >
                      <span className="font-medium text-slate-800">{opt.text}</span>
                      {drillChecked && isChosen && (
                        <p
                          className={`text-[11px] font-bold ${
                            opt.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {opt.isCorrect ? '✓ 정답: ' : '✗ 오답: '} {opt.feedback}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStage(1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl font-bold text-xs text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>1단계로 돌아가기</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStage(3)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all cursor-pointer"
              >
                <span>드릴 완료 ➔ 3단계 20칸 원고지 집필하기</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* Stage 3: 20칸 원고지 집필 & 실시간 툴민 진단 (25분) */}
        {/* ========================================================= */}
        {currentStage === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
            {/* Left Column: 20-Cell Manuscript Grid Editor (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                      <FileText className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="font-black text-sm text-slate-900">
                        20칸 표준 원고지 논증문 집필실
                      </h3>
                      <span className="text-xs text-slate-500">
                        청중 [{selectedAudience.role}]을 설득하는 툴민 6요소를 모두 포함하여 작성하십시오.
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAnalyzing ? '툴민 진단 중...' : '툴민 6요소 AI 진단'}</span>
                  </button>
                </div>

                {/* Reusable Manuscript Grid Editor with 500ms Debounced Telemetry */}
                <ManuscriptGridEditor
                  value={draftText}
                  onChange={(text) => setDraftText(text)}
                  onTelemetryChange={(telemetry) => setKeystrokeLog(telemetry)}
                  minChars={300}
                  targetMaxChars={800}
                  placeholder="여기에 학술 논증문을 작성하십시오..."
                />
              </div>

              {/* Stepper Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStage(2)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl font-bold text-xs text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>2단계 드릴로 가기</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenDevilsAdvocate}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs text-white bg-rose-600 hover:bg-rose-500 shadow-md transition-all cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-rose-200" />
                  <span>4단계: AI 악마의 대변인 반론 공박 관문 열기</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Toulmin Tagging & Radar Analysis & Coaching Bar (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Highlighted Sentence Canvas */}
              {toulminResult ? (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      문장별 툴민 형광펜 태깅 결과
                    </span>
                    <span className="text-[11px] text-slate-400">문장 클릭 시 첨삭 가능</span>
                  </div>

                  <ToulminHighlighter
                    sentences={toulminResult.sentences}
                    selectedSentenceIndex={selectedSentenceIdx}
                    onSentenceClick={(sentence, idx) => {
                      setSelectedSentenceIdx(idx);
                      setSelectedSentenceText(sentence.text);
                    }}
                  />

                  {/* Radar Chart */}
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
                    아직 툴민 AI 진단이 실행되지 않았습니다
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    왼쪽 원고지에 글을 작성한 후 상단의 <strong>[툴민 6요소 AI 진단]</strong> 버튼을 누르면
                    문장별 형광펜 태깅과 6차원 레이더 차트가 렌더링됩니다.
                  </p>
                </div>
              )}

              {/* Tutor Coaching Floating Bar */}
              <TutorCoachingBar
                selectedSentenceIndex={selectedSentenceIdx}
                selectedSentenceText={selectedSentenceText}
                currentElement={
                  selectedSentenceIdx !== null && toulminResult?.sentences[selectedSentenceIdx]
                    ? toulminResult.sentences[selectedSentenceIdx].element
                    : 'C'
                }
                comments={rhetoricalComments}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
                isInstructorMode={isInstructorMode}
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* Stage 4: AI 악마의 대변인 반론 & 재반박 완결 (20분) */}
        {/* ========================================================= */}
        {currentStage === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Stage 4 Banner */}
            <div className="p-6 bg-gradient-to-r from-rose-900 via-rose-800 to-indigo-950 text-white rounded-3xl shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2.5 bg-rose-500/20 text-rose-300 rounded-2xl border border-rose-400/30">
                    <Flame className="w-6 h-6 text-rose-400 animate-pulse" />
                  </span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black">
                      4단계: 악마의 대변인 (Devil&apos;s Advocate) 공박 &amp; 재반박 완결
                    </h2>
                    <p className="text-xs text-rose-200/80">
                      페렐만 신수사학의 가치 위계 충돌을 돌파하고 진정한 보편 청중의 동의를 획득하십시오.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenDevilsAdvocate}
                  className="px-4 py-2 rounded-xl bg-white text-rose-900 font-black text-xs hover:bg-rose-50 transition-all shadow-md cursor-pointer"
                >
                  반론 모달 다시 열기
                </button>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Final Draft with Counter-Rebuttal */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    최종 완성된 학술 논증 텍스트
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    {hasCompletedStage4 ? '재반박 통합 완료' : '재반박 대기 중'}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#fcfaf2] border border-amber-200/80 text-sm leading-relaxed text-slate-900 whitespace-pre-wrap font-sans">
                  {draftText}
                </div>

                {/* Telemetry Summary */}
                {keystrokeLog && (
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5 font-mono">
                    <span className="font-bold text-slate-700 block">
                      🔬 학술 논문 심사용 작문 텔레메트리 (Keystroke Telemetry Log):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 text-[11px]">
                      <div>타자 속도: <strong>{keystrokeLog.cpm} CPM</strong></div>
                      <div>수정 횟수: <strong>{keystrokeLog.backspaceCount}회</strong></div>
                      <div>붙여넣기: <strong>{keystrokeLog.pasteCount}회</strong></div>
                      <div>소요 시간: <strong>{Math.round(keystrokeLog.activeDurationMs / 1000)}초</strong></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Devil's Rebuttal Summary & Coaching */}
              <div className="lg:col-span-5 space-y-5">
                {devilsResult && (
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                    <span className="text-xs font-black text-rose-950 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-rose-600" />
                      악마의 대변인 비판 요약:
                    </span>
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-xs text-rose-900 leading-relaxed font-sans">
                      {devilsResult.rebuttalText}
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <strong>결정적 질문:</strong> {devilsResult.criticalQuestion}
                    </div>
                  </div>
                )}

                {/* Tutor Coaching List */}
                <TutorCoachingBar
                  selectedSentenceIndex={selectedSentenceIdx}
                  selectedSentenceText={selectedSentenceText}
                  comments={rhetoricalComments}
                  onAddComment={handleAddComment}
                  onDeleteComment={handleDeleteComment}
                  isInstructorMode={isInstructorMode}
                />
              </div>
            </div>

            {/* Complete Unit & Next Unit CTA */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStage(3)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl font-bold text-xs text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>3단계 원고지로 돌아가기</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const nextUnit = TRACK_B_CURRICULUM.find(
                    (u) => u.unitNumber === currentUnit.unitNumber + 1
                  );
                  if (nextUnit) {
                    router.push(`/track-b/${nextUnit.step}/${nextUnit.unitNumber}`);
                  } else {
                    alert('축하합니다! Track B 모든 16유닛의 아카데믹 논증 과정을 완수하셨습니다.');
                    router.push('/dashboard');
                  }
                }}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
              >
                <span>
                  {currentUnit.unitNumber < 16
                    ? `Unit ${currentUnit.unitNumber + 1}로 계속하기`
                    : '16유닛 전 과정 완수 (대시보드로 이동)'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 4. Devil's Advocate Interactive Modal */}
      <DevilsAdvocateModal
        isOpen={isDevilsModalOpen}
        onClose={() => setIsDevilsModalOpen(false)}
        selectedAudience={selectedAudience}
        claim={
          toulminResult?.sentences.find((s) => s.element === 'C')?.text ||
          '정년 연장은 국가 생산성을 위해 필수적이다.'
        }
        warrant={
          toulminResult?.sentences.find((s) => s.element === 'W')?.text ||
          '숙련 인력 유지가 청년 일자리보다 우선하는 보편적 가치이기 때문이다.'
        }
        devilsResult={devilsResult}
        isLoading={isDevilsLoading}
        onRegenerate={() => {
          setDevilsResult(null);
          handleOpenDevilsAdvocate();
        }}
        onSubmitCounterRebuttal={handleConfirmCounterRebuttal}
      />
    </div>
  );
}
