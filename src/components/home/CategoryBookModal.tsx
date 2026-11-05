'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Award,
  Globe,
  Feather,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Lock,
  Mic,
  FileText,
  ClipboardCheck,
  Gift,
  AlertCircle,
  Check,
  UserCheck,
  Volume2,
} from 'lucide-react';
import { BookCategoryData } from './FannedBookStack';
import { BookCover } from '../BookCover';
import { useHanUp } from '../../context/HanUpContext';
import { APP_CONFIG } from '../../lib/config';
import { signInWithGoogle } from '../../lib/firebase';

interface CategoryBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: BookCategoryData | null;
  onOpenSoriTutor?: (sentence: string) => void;
}

type FunnelStep =
  | 'step1_auth_and_books'
  | 'step2_pre_survey'
  | 'step3_level_test'
  | 'step4_dry_result'
  | 'step5_trial_excerpt'
  | 'step6_post_survey_coupon';

interface LevelTestQuestion {
  id: string;
  categoryLabel: string;
  question: string;
  options: string[];
  correctIndex: number;
}

const LEVEL_TEST_QUESTIONS: Record<'topik' | 'academic' | 'life', LevelTestQuestion[]> = {
  topik: [
    {
      id: 'topik_q1',
      categoryLabel: '문법 · 어휘 (Grammar)',
      question: '다음 (      )에 가장 알맞은 표현을 고르십시오.\n"갑자기 폭우가 (      ) 비행기가 제시간에 출발하지 못했다."',
      options: ['① 내리느라고', '② 내리는 바람에', '② 내리기 위해서', '④ 내리던 끝에'],
      correctIndex: 1,
    },
    {
      id: 'topik_q2',
      categoryLabel: '쓰기 53번 (도표 분석)',
      question: '그래프에서 수치가 "15%에서 48%로 세 배 이상 커진 상황"을 묘사할 때 가장 적절한 수험 표현은?',
      options: ['① 소폭 감소하였다', '② 현저히 급증하였다', '③ 보합세를 유지하였다', '④ 완만하게 하락하였다'],
      correctIndex: 1,
    },
    {
      id: 'topik_q3',
      categoryLabel: '읽기 추론 (Reading)',
      question: '다음 빈칸에 들어갈 접속 부사로 가장 알맞은 것은?\n"인공지능 기술은 기업의 생산성을 크게 높였다. (      ) 일자리 양극화라는 새로운 사회적 과제도 동시에 남겼다."',
      options: ['① 따라서', '② 반면에', '③ 왜냐하면', '④ 예컨대'],
      correctIndex: 1,
    },
  ],
  academic: [
    {
      id: 'acad_q1',
      categoryLabel: '툴민 논증 모델 (Data vs Claim)',
      question: '"통계청 조사에 따르면 65세 이상 노인의 상대적 빈곤율은 40.4%로 OECD 최고 수준이다." 이 문장은 툴민 6요소 중 무엇에 해당하는가?',
      options: ['① 핵심 주장 (Claim)', '② 객관적 실증 자료 (Data)', '③ 조건 및 한정 (Qualifier)', '④ 예상 반론 (Rebuttal)'],
      correctIndex: 1,
    },
    {
      id: 'acad_q2',
      categoryLabel: '정당화 (Warrant)',
      question: '제시된 통계 자료(D)로부터 필자의 핵심 주장(C)으로 넘어갈 때, 두 요소를 연결해 주는 보편적 원리나 가치 위계 기준을 뜻하는 요소는?',
      options: ['① 정당화 (Warrant)', '② 단순 도입 (None)', '③ 요약 결론', '④ 인용 출처'],
      correctIndex: 0,
    },
    {
      id: 'acad_q3',
      categoryLabel: '학술적 반론 제압 (Rebuttal)',
      question: '학술 소논문에서 반대 측의 예상 반론을 다루는 가장 설득력 있는 수사 전략은?',
      options: [
        '① 반대 의견은 언급하지 않고 내 주장만 반복한다.',
        '② "비록 ~라는 우려가 제기될 수 있으나, ~라는 조건 하에서 극복 가능하다"와 같이 양보 후 재반박한다.',
        '③ 상대방의 인격을 비판하는 감정적 어휘를 사용한다.',
        '④ 결론에서 주장을 완전히 포기한다.',
      ],
      correctIndex: 1,
    },
  ],
  life: [
    {
      id: 'life_q1',
      categoryLabel: '표준 발음 · 음운 규칙',
      question: '"급한 일이 생겨서요"를 자연스러운 한국어 음운 규칙(격음화·연음)에 맞게 발음한 것은?',
      options: [
        '① [급한 일이 생겨서요]',
        '② [그판 니리 생겨서요]',
        '③ [그반 이리 생겨서요]',
        '④ [급판 일리 생겨서요]',
      ],
      correctIndex: 1,
    },
    {
      id: 'life_q2',
      categoryLabel: '실전 생활 회화 (식당·카페)',
      question: '카페 카운터나 키오스크에서 음료를 매장에서 마시지 않고 밖으로 가져갈 때 쓰는 자연스러운 표현은?',
      options: ['① 배달해 주세요', '② 포장해 주세요 (가지고 갈게요)', '③ 교환해 주세요', '④ 예약해 주세요'],
      correctIndex: 1,
    },
    {
      id: 'life_q3',
      categoryLabel: '캠퍼스 화행 (공손 표현)',
      question: '대학 강의 후 교수님께 면담을 요청할 때 가장 적절한 격식 표현은?',
      options: [
        '① 교수님, 지금 시간 있어요?',
        '② 교수님, 혹시 이번 주 중 잠시 면담이 가능하신지 여쭙고 싶습니다.',
        '③ 교수님, 내일 연구실로 오세요.',
        '④ 질문할 게 있으니까 잠깐 기다려 주세요.',
      ],
      correctIndex: 1,
    },
  ],
};

export const CategoryBookModal: React.FC<CategoryBookModalProps> = ({
  isOpen,
  onClose,
  category,
  onOpenSoriTutor,
}) => {
  const { switchRole, isLoggedIn, currentUser, loginAsCustomUser } = useHanUp();

  const [step, setStep] = useState<FunnelStep>('step1_auth_and_books');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Step 2: Pre-Survey States
  const [l1Lang, setL1Lang] = useState<string>('zh');
  const [l1Custom, setL1Custom] = useState<string>('');
  const [targetLevel, setTargetLevel] = useState<string>('TOPIK 4~5급 / 중고급');
  const [bottlenecks, setBottlenecks] = useState<string[]>(['쓰기·논리 전개 막막함']);
  const [bottleneckCustom, setBottleneckCustom] = useState<string>('');
  const [irbConsent, setIrbConsent] = useState<boolean>(true);
  const [surveyError, setSurveyError] = useState<string | null>(null);

  // Step 3: Level Test States
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [testError, setTestError] = useState<string | null>(null);

  // Step 5: Trial Excerpt States
  const [trialPracticeAnswer, setTrialPracticeAnswer] = useState<string>('');
  const [trialPracticeChecked, setTrialPracticeChecked] = useState<boolean>(false);

  // Step 6: Post-Survey & Coupon States
  const [satisfactionScore, setSatisfactionScore] = useState<number>(5);
  const [neededFeatures, setNeededFeatures] = useState<string[]>(['정밀 원고지 첨삭', '체계적인 커리큘럼 교재']);
  const [postCustomOpinion, setPostCustomOpinion] = useState<string>('');
  const [couponContactEmail, setCouponContactEmail] = useState<string>(currentUser?.email || '');
  const [isCouponReserved, setIsCouponReserved] = useState<boolean>(false);
  const [postSurveyError, setPostSurveyError] = useState<string | null>(null);

  // Reset funnel when category changes or modal opens
  useEffect(() => {
    if (isOpen && category) {
      setStep('step1_auth_and_books');
      setAnswers({});
      setTestError(null);
      setSurveyError(null);
      setTrialPracticeAnswer('');
      setTrialPracticeChecked(false);
      setIsCouponReserved(false);
      setPostSurveyError(null);
    }
  }, [isOpen, category?.key]);

  useEffect(() => {
    if (isLoggedIn && currentUser?.email && currentUser.email !== 'student@hanup.com') {
      setCouponContactEmail(currentUser.email);
    }
  }, [isLoggedIn, currentUser]);

  if (!isOpen || !category) return null;

  const questions = LEVEL_TEST_QUESTIONS[category.key] || LEVEL_TEST_QUESTIONS.topik;

  // Google Login Handler
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.user) {
        loginAsCustomUser({
          email: result.user.email || 'google_student@gmail.com',
          name: result.user.displayName || '구글 학습자',
        });
      } else {
        // Fallback when popup is closed or Firebase key is not configured
        loginAsCustomUser({
          email: 'student.google@gmail.com',
          name: 'Google 학습자',
        });
      }
      setStep('step2_pre_survey');
    } catch {
      loginAsCustomUser({
        email: 'student.google@gmail.com',
        name: 'Google 학습자',
      });
      setStep('step2_pre_survey');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Toggle Bottleneck Selection
  const toggleBottleneck = (item: string) => {
    setBottlenecks((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Toggle Needed Feature Selection
  const toggleNeededFeature = (item: string) => {
    setNeededFeatures((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Submit Pre-Survey
  const handleCompletePreSurvey = async () => {
    if (bottlenecks.length === 0) {
      setSurveyError('학습 고민 항목을 최소 1개 이상 선택해 주세요.');
      return;
    }
    if (!bottleneckCustom.trim()) {
      setSurveyError('현재 겪고 있는 구체적인 한국어 학습 고민을 한 줄 이상 적어 주세요.');
      return;
    }
    setSurveyError(null);

    try {
      const sessionId = localStorage.getItem('hanup_session_id') || `sess_${Date.now()}`;
      localStorage.setItem('hanup_session_id', sessionId);
      localStorage.setItem('hanup_pre_survey_done', 'true');

      fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          surveyType: 'pre_onboarding',
          selectedTrack: category.key === 'academic' ? 'track_b' : category.key === 'topik' ? 'track_a' : 'general',
          l1Language: l1Lang,
          l1CustomText: l1Custom,
          targetTopikLevel: targetLevel,
          writingBottlenecks: bottlenecks,
          writingBottlenecksCustom: bottleneckCustom,
          irbConsent,
        }),
      }).catch(() => {});
    } catch {
      // ignore network error
    }

    setStep('step3_level_test');
  };

  // Submit Level Test (Dry Rule-Based Evaluation, Zero AI API Call)
  const handleCompleteLevelTest = () => {
    if (Object.keys(answers).length < questions.length) {
      setTestError(`모든 문항(${questions.length}문항)의 답안을 선택해 주십시오.`);
      return;
    }
    setTestError(null);
    setStep('step4_dry_result');
  };

  // Calculate Dry Score
  const correctCount = questions.reduce((acc, q) => {
    return acc + (answers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);
  const accuracyPercent = Math.round((correctCount / questions.length) * 100);

  const recommendedBookIndex =
    correctCount <= 1 ? 0 : correctCount === 2 ? 1 : 2;
  const recommendedBook = category.books[recommendedBookIndex] || category.books[0];

  // Submit Post-Experience Survey & Reserve Coupon
  const handleCompletePostSurvey = async () => {
    if (!postCustomOpinion.trim()) {
      setPostSurveyError('무료 1차시 체험 소감이나 바라는 점을 간단히 입력해 주십시오.');
      return;
    }
    if (!couponContactEmail.trim()) {
      setPostSurveyError('할인 쿠폰을 지급받을 이메일 또는 연락처(위챗 ID 등)를 입력해 주십시오.');
      return;
    }
    setPostSurveyError(null);

    try {
      const sessionId = localStorage.getItem('hanup_session_id') || `sess_${Date.now()}`;
      fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          surveyType: 'post_experience',
          selectedTrack: category.key === 'academic' ? 'track_b' : category.key === 'topik' ? 'track_a' : 'general',
          l1Language: l1Lang,
          writingBottlenecks: neededFeatures,
          irbConsent,
          feedbackScore: satisfactionScore,
          neededSupports: neededFeatures,
          neededSupportsCustom: postCustomOpinion,
          contactInfo: couponContactEmail,
        }),
      }).catch(() => {});
    } catch {
      // ignore
    }

    setIsCouponReserved(true);
  };

  // Step Indicator Metadata
  const stepBadges = [
    { key: 'step1_auth_and_books', num: 1, label: '교재 확인·로그인' },
    { key: 'step2_pre_survey', num: 2, label: '기초 설문' },
    { key: 'step3_level_test', num: 3, label: '레벨 테스트' },
    { key: 'step4_dry_result', num: 4, label: '요약 결과' },
    { key: 'step5_trial_excerpt', num: 5, label: '1차시 무료체험' },
    { key: 'step6_post_survey_coupon', num: 6, label: '설문·쿠폰예약' },
  ];

  const currentStepIndex = stepBadges.findIndex((s) => s.key === step);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* ===================================================== */}
        {/* 1. Modal Top Header & Progress Stepper */}
        {/* ===================================================== */}
        <div className="px-5 sm:px-7 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border-b border-slate-700 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-white/10 rounded-2xl border border-white/20 text-white shrink-0">
                {category.icon === 'award' && <Award className="w-5 h-5 text-blue-400" />}
                {category.icon === 'globe' && <Globe className="w-5 h-5 text-emerald-400" />}
                {category.icon === 'feather' && <Feather className="w-5 h-5 text-purple-400" />}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-[10px] font-black uppercase tracking-wider">
                    {category.badgeKo}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {category.titleKo}
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                  {category.subtitleKo}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 6-Step Progress Bar */}
          <div className="grid grid-cols-6 gap-1.5 pt-1">
            {stepBadges.map((s, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isDone = idx < currentStepIndex;
              return (
                <div
                  key={s.key}
                  className={`px-2 py-1.5 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 border-indigo-400 text-white font-black shadow-sm'
                      : isDone
                      ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300 font-bold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 font-medium'
                  }`}
                >
                  <div className="text-[10px] truncate">
                    {isDone ? '✓ ' : `${s.num}. `}
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================== */}
        {/* 2. Modal Body Content by Funnel Step */}
        {/* ===================================================== */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 bg-slate-50/70 space-y-6">
          {/* ----------------------------------------------------- */}
          {/* STEP 1: 교재 라인업 확인 & 구글 아이디 로그인 유도 */}
          {/* ----------------------------------------------------- */}
          {step === 'step1_auth_and_books' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Google Login Prompt Box */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-indigo-200 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>STEP 1. 학습 계정 연동 및 진단 시작</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">
                      Google 아이디로 시작하고 무료 레벨 테스트와 1차시 체험을 진행하세요
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      로그인 후 설문 및 레벨 테스트를 완료하면 <strong>1차시 무료 체험</strong>과 함께 <strong>얼리버드 할인 쿠폰</strong>이 계정에 자동 예약됩니다.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0 sm:w-64">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isGoogleLoading}
                      className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer"
                    >
                      <span className="w-5 h-5 rounded-full bg-white text-slate-900 font-black text-xs flex items-center justify-center">
                        G
                      </span>
                      <span>
                        {isGoogleLoading
                          ? 'Google 연동 중...'
                          : isLoggedIn
                          ? 'Google 계정으로 계속하기'
                          : 'Google 아이디로 3초 시작'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep('step2_pre_survey')}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      비회원으로 먼저 설문·레벨테스트 진행하기 →
                    </button>
                  </div>
                </div>
              </div>

              {/* Free-Talk SoriTutor Notice Banner (Only for 'life' category) */}
              {category.key === 'life' && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Mic className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-950 font-black block">
                        🎙️ 프리토킹(회화) 트랙 안내: 교재는 한업에서, 실전 발화는 소리튜터(SoriTutor)에서!
                      </strong>
                      <p className="text-emerald-800 mt-0.5 leading-relaxed">
                        한업에서 상황별 회화 교재를 보며 표현을 익히고, 실시간 음성 발화·억양 교정·프리토킹은 전용 음성 AI 앱인 <strong>소리튜터(SoriTutor)</strong>로 직접 유입되어 훈련합니다. (프리토킹 심화 시나리오 추가 예정)
                      </p>
                    </div>
                  </div>
                  <a
                    href={APP_CONFIG.soriTutorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <span>소리튜터 바로가기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Curriculum Textbooks List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>[{category.titleKo}] 수록 교재 라인업 (총 {category.books.length}권)</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    설문 및 레벨 테스트 후 내 수준에 맞는 교재의 1차시를 무료로 체험합니다
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.books.map((book, index) => (
                    <div
                      key={book.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex gap-4 items-center"
                    >
                      <div className="shrink-0">
                        <BookCover styleData={book.coverStyle} size="xs" interactive={false} />
                      </div>
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-black text-[10px]">
                            {book.targetLevelText}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Vol.{index + 1}
                          </span>
                        </div>
                        <h5 className="font-black text-sm text-slate-900 truncate">
                          {book.titleKo}
                        </h5>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                          {book.subtitleKo}
                        </p>
                        <div className="pt-1 flex flex-wrap gap-1">
                          {book.highlights.slice(0, 2).map((h, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 truncate max-w-full"
                            >
                              • {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------- */}
          {/* STEP 2: 사전 기초 설문조사 */}
          {/* ----------------------------------------------------- */}
          {step === 'step2_pre_survey' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-indigo-600 uppercase">
                  STEP 2. 맞춤형 학습 설계를 위한 기초 설문
                </span>
                <h4 className="text-lg font-black text-slate-900 mt-0.5">
                  학습자님의 모국어와 현재 가장 큰 고민을 알려주세요
                </h4>
              </div>

              {/* Q1. L1 Language */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 block">
                  1. 모국어 (Native Language / L1)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
                  {[
                    { code: 'zh', label: '🇨🇳 중국어' },
                    { code: 'vi', label: '🇻🇳 베트남어' },
                    { code: 'en', label: '🇺🇸 영어' },
                    { code: 'ja', label: '🇯🇵 일본어' },
                    { code: 'my', label: '🇲🇲 미얀마어' },
                    { code: 'other', label: '🌐 기타' },
                  ].map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setL1Lang(item.code)}
                      className={`py-2.5 px-3 rounded-xl font-bold border text-center transition-all cursor-pointer ${
                        l1Lang === item.code
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                {l1Lang === 'other' && (
                  <input
                    type="text"
                    value={l1Custom}
                    onChange={(e) => setL1Custom(e.target.value)}
                    placeholder="모국어를 직접 입력해 주세요 (예: 러시아어, 몽골어 등)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                )}
              </div>

              {/* Q2. Target Level */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 block">
                  2. 현재 목표 급수 또는 학습 과정
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    'TOPIK 1~2급 (초급)',
                    'TOPIK 3~4급 (중급)',
                    'TOPIK 5~6급 (고급)',
                    '대학·대학원 논문/회화',
                  ].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setTargetLevel(lvl)}
                      className={`py-2.5 px-3 rounded-xl font-bold border text-center transition-all cursor-pointer ${
                        targetLevel === lvl
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3. Bottlenecks (Objective + Mandatory Subjective) */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 block">
                  3. 한국어 학습에서 가장 어려운 점은 무엇인가요? (복수 선택 가능)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    '쓰기·논리 전개 막막함',
                    '어휘 및 문법 표현 부족',
                    '반론 및 학술적 근거 제시 어려움',
                    '정확한 발음·억양 및 프리토킹 두려움',
                  ].map((b) => {
                    const active = bottlenecks.includes(b);
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => toggleBottleneck(b)}
                        className={`p-3 rounded-xl border text-left font-bold flex items-center justify-between transition-all cursor-pointer ${
                          active
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-950'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <span>{b}</span>
                        {active && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    ✍️ 구체적인 고민이나 달성하고 싶은 목표를 직접 적어 주세요 (필수):
                  </label>
                  <textarea
                    rows={2}
                    value={bottleneckCustom}
                    onChange={(e) => {
                      setBottleneckCustom(e.target.value);
                      if (surveyError) setSurveyError(null);
                    }}
                    placeholder="예: TOPIK 54번 논술에서 600자 채우기가 힘들어요 / 대학원 발표와 소논문 서론 작성이 막막합니다."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* IRB Consent */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={irbConsent}
                  onChange={(e) => setIrbConsent(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600"
                />
                <span className="text-slate-600 leading-relaxed">
                  <strong>[학술 연구 및 커리큘럼 고도화 동의]</strong> 응답하신 설문 및 레벨 테스트 데이터는 익명 처리되어 한국어 교육 연구 및 맞춤형 교재 개선 목적으로만 안전하게 활용됩니다.
                </span>
              </label>

              {surveyError && (
                <p className="text-xs font-bold text-rose-600">⚠️ {surveyError}</p>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('step1_auth_and_books')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  ← 이전으로
                </button>
                <button
                  type="button"
                  onClick={handleCompletePreSurvey}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>설문 저장 ➔ 3문항 레벨 테스트 시작하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------- */}
          {/* STEP 3: 트랙별 객관식 레벨 테스트 (3문항) */}
          {/* ----------------------------------------------------- */}
          {step === 'step3_level_test' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-indigo-600 uppercase">
                    STEP 3. [{category.titleKo}] 기초 레벨 테스트
                  </span>
                  <h4 className="text-lg font-black text-slate-900 mt-0.5">
                    다음 3문항을 읽고 가장 알맞은 답을 고르십시오
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-xs">
                  {Object.keys(answers).length} / {questions.length} 응답
                </span>
              </div>

              <div className="space-y-5">
                {questions.map((q, qIdx) => (
                  <div
                    key={q.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-black text-[10px]">
                        문항 {qIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-indigo-700">
                        {q.categoryLabel}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-slate-900 whitespace-pre-line leading-relaxed">
                      {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[q.id] === oIdx;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => {
                              setAnswers((prev) => ({ ...prev, [q.id]: oIdx }));
                              if (testError) setTestError(null);
                            }}
                            className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {testError && (
                <p className="text-xs font-bold text-rose-600">⚠️ {testError}</p>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('step2_pre_survey')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  ← 설문으로
                </button>
                <button
                  type="button"
                  onClick={handleCompleteLevelTest}
                  className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>제출하고 레벨 테스트 요약 결과 확인하기</span>
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------- */}
          {/* STEP 4: 건조한 레벨 테스트 요약 결과 (AI 호출 없음) */}
          {/* ----------------------------------------------------- */}
          {step === 'step4_dry_result' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Dry Score Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-800 text-[10px] font-black uppercase">
                      STEP 4. 레벨 테스트 정오답 요약표 (Rule-Based Summary)
                    </span>
                    <h4 className="text-lg font-black text-slate-900 mt-1">
                      기초 레벨 테스트 채점 요약 결과
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2.5 rounded-2xl">
                    <div className="text-xs text-slate-400">총점:</div>
                    <div className="text-base font-mono font-black text-amber-400">
                      {correctCount} / {questions.length} 정답 ({accuracyPercent}%)
                    </div>
                  </div>
                </div>

                {/* Dry Question-by-Question Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-black">
                        <th className="py-2.5 px-4">문항 번호</th>
                        <th className="py-2.5 px-4">평가 영역</th>
                        <th className="py-2.5 px-4">선택 답안</th>
                        <th className="py-2.5 px-4">정답 여부</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {questions.map((q, idx) => {
                        const userChoice = answers[q.id];
                        const isCorrect = userChoice === q.correctIndex;
                        return (
                          <tr key={q.id}>
                            <td className="py-3 px-4 font-mono font-bold text-slate-800">
                              Q{idx + 1}
                            </td>
                            <td className="py-3 px-4 text-slate-700 font-medium">
                              {q.categoryLabel}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600">
                              {userChoice !== undefined ? `${userChoice + 1}번` : '-'}
                            </td>
                            <td className="py-3 px-4 font-black">
                              {isCorrect ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  정답 (O)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                                  오답 (X)
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Recommended Textbook Match */}
                <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-indigo-700 uppercase">
                      정답률 기반 권장 시작 교재
                    </span>
                    <h5 className="text-sm sm:text-base font-black text-slate-900">
                      권장 커리큘럼: 《{recommendedBook.titleKo}》 ({recommendedBook.targetLevelText})
                    </h5>
                    <p className="text-xs text-slate-600">
                      {recommendedBook.subtitleKo}
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-800 font-black text-xs shrink-0">
                    1차시 무료 체험 가능
                  </span>
                </div>

                {/* Locked Detailed Analysis Notice (As explicitly requested by user) */}
                <div className="relative rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100/80 p-5 overflow-hidden">
                  {/* Blurred Mock Background */}
                  <div className="blur-xs select-none pointer-events-none opacity-40 space-y-2 text-xs">
                    <div className="h-4 bg-slate-300 rounded w-1/3" />
                    <div className="h-3 bg-slate-300 rounded w-3/4" />
                    <div className="h-3 bg-slate-300 rounded w-2/3" />
                  </div>

                  {/* Overlay Notice */}
                  <div className=" inset-0 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/95 p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs sm:text-sm font-black text-slate-900">
                          상세 오답 원인 분석 및 영역별 정밀 진단 리포트 안내
                        </h5>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          위 표는 AI 호출 없이 정오답 여부만 판별한 기초 요약 결과입니다. <strong>문항별 심층 해설, L1(모국어) 간섭 오류 진단 및 개인 맞춤형 약점 처방 리포트는 정규 커리큘럼(교재 구매) 진행 시 구체적으로 표출</strong>됩니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA to Step 5 (Free Trial Lesson 1 Excerpt) */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('step3_level_test')}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                  >
                    ← 다시 풀기
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('step5_trial_excerpt')}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>무료 회차 (1차시 일부) 지금 바로 체험하기 ➔</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------- */}
          {/* STEP 5: 무료 회차 (1차시 일부) 체험 진행 */}
          {/* ----------------------------------------------------- */}
          {step === 'step5_trial_excerpt' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                    STEP 5. 무료 회차 (1차시 핵심 파트) 체험
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                    《{recommendedBook.titleKo}》 1차시 맛보기 실습
                  </h4>
                </div>

                <Link
                  href={recommendedBook.link}
                  onClick={() => {
                    switchRole('student');
                  }}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors shrink-0"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>전체 전자책 뷰어(새 창)로도 열기</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Track-Specific 1st Lesson Excerpt Content */}
              {category.key === 'topik' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-[#fcfaf2] border border-amber-200/90 space-y-3">
                    <div className="text-xs font-black text-amber-900 flex items-center justify-between">
                      <span>📖 [교재 1차시 발췌] 읽기·쓰기 핵심 인과 표현 공식</span>
                      <span className="font-mono text-[11px]">p. 12</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                      TOPIK 읽기와 쓰기 53번에서는 <strong>원인과 결과</strong>를 연결하는 문형이 매회 출제됩니다. 부정적이거나 예상치 못한 결과에는 <strong>&lsquo;-는 바람에&rsquo;</strong>를, 공손한 이유 설명에는 <strong>&lsquo;-아서/어서요&rsquo;</strong>를, 격식 있는 보고서나 도표 분석에서는 <strong>&lsquo;-(으)로 인하여 / -에 기인하다&rsquo;</strong>를 사용합니다.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <strong className="font-black text-slate-900 block">
                      ✍️ [1차시 확인 실습] 다음 도표 설명 문장의 빈칸에 들어갈 알맞은 표현을 골라 보세요:
                    </strong>
                    <p className="p-3 rounded-xl bg-white border border-slate-200 text-slate-800 font-medium">
                      &ldquo;1인 가구 비중이 급증함( ______ ) 소포장 간편식 매출액이 2배 이상 증가한 것으로 나타났다.&rdquo;
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {['① 에 따라', '② 는 반면에'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setTrialPracticeAnswer(opt);
                            setTrialPracticeChecked(true);
                          }}
                          className={`p-3 rounded-xl border font-bold text-left cursor-pointer ${
                            trialPracticeAnswer === opt
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {trialPracticeChecked && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold">
                        ✓ 확인 완료: 앞선 변화가 뒤 결과의 원인이 되므로 &lsquo;에 따라&rsquo;가 정답입니다!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {category.key === 'academic' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-[#fcfaf2] border border-amber-200/90 space-y-3">
                    <div className="text-xs font-black text-amber-900 flex items-center justify-between">
                      <span>📖 [교재 1차시 발췌] Unit 01. 정년 연장 vs 청년 고용 가치 위계</span>
                      <span className="font-mono text-[11px]">Step 1 • Unit 01</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                      학술 논증에서는 단순히 통계 자료(Data)만 나열해서는 설득력이 생기지 않습니다. 독자(청중)가 중시하는 가치에 맞추어 <strong>왜 그 자료가 나의 주장(Claim)을 뒷받침하는지 설명하는 정당화(Warrant)</strong> 문장이 반드시 포함되어야 합니다.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <strong className="font-black text-slate-900 block">
                      ✍️ [1차시 확인 실습] 보수적 재정 관료 청중을 설득하기 위해 자료(D)와 주장(C)을 잇는 가장 적절한 정당화(W)를 선택해 보세요:
                    </strong>
                    <div className="space-y-2">
                      {[
                        'A. 숙련 고령 인력을 노동시장에 유지하는 것이 국가 복지 재정 지출을 줄이는 가장 비용 효율적인 방안이기 때문이다.',
                        'B. 모든 기업은 조건 없이 희생을 감수해야 마땅하기 때문이다.',
                      ].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setTrialPracticeAnswer(opt);
                            setTrialPracticeChecked(true);
                          }}
                          className={`w-full p-3 rounded-xl border font-bold text-left cursor-pointer ${
                            trialPracticeAnswer === opt
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {trialPracticeChecked && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold">
                        ✓ 확인 완료: 청중의 핵심 가치(재정 건전성 및 비용 효율성)에 부합하는 A 문장이 강력한 정당화(W)가 됩니다!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {category.key === 'life' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-[#fcfaf2] border border-amber-200/90 space-y-3">
                    <div className="text-xs font-black text-amber-900 flex items-center justify-between">
                      <span>📖 [한업 회화 교재 1차시 표출] 실전 표현 & 발음 가이드</span>
                      <span className="font-mono text-[11px]">소리튜터 연동</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-amber-200 space-y-2">
                      <div className="text-sm sm:text-base font-black text-slate-900">
                        &ldquo;급한 일이 생겨서요.&rdquo; ➔ 발음: <span className="text-emerald-700">[그판 니리 생겨서요]</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        • 음운 포인트: 받침 &lsquo;ㅂ&rsquo;과 &lsquo;ㅎ&rsquo;이 만나 거센소리 <strong>[ㅍ]</strong>으로 축약되고, &lsquo;일이&rsquo;가 연음되어 자연스럽게 이어집니다.
                      </p>
                    </div>
                  </div>

                  {/* Direct SoriTutor Inflow Box */}
                  <div className="p-5 rounded-2xl bg-emerald-950 text-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                        <Mic className="w-4 h-4" />
                        소리튜터 (SoriTutor) 프리토킹 · 발음 엔진 연동
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 text-[10px] font-bold">
                        프리토킹 심화 추가예정
                      </span>
                    </div>
                    <p className="text-xs text-emerald-100/90 leading-relaxed">
                      한업 교재에 표출된 문장을 확인하셨나요? 이제 아래 버튼을 눌러 <strong>소리튜터(SoriTutor)</strong>에서 마이크로 직접 발음하고 프리토킹 피드백을 받아보세요.
                    </p>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      {onOpenSoriTutor && (
                        <button
                          type="button"
                          onClick={() => {
                            onOpenSoriTutor('급한 일이 생겨서요 [그판 니리 생겨서요]');
                            setTrialPracticeChecked(true);
                          }}
                          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>모달 내 소리튜터 발음 시뮬레이터 열기</span>
                        </button>
                      )}
                      <a
                        href={`${APP_CONFIG.soriTutorUrl}/?sentence=${encodeURIComponent('급한 일이 생겨서요')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setTrialPracticeChecked(true)}
                        className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20"
                      >
                        <span>소리튜터 웹앱으로 유입하여 연습하기</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Button to Step 6 (Post-Experience Survey & Coupon) */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep('step4_dry_result')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  ← 결과 요약으로
                </button>

                <button
                  type="button"
                  onClick={() => setStep('step6_post_survey_coupon')}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Gift className="w-4 h-4" />
                  <span>1차시 체험 완료! 설문 참여하고 할인 쿠폰 안내받기 ➔</span>
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------- */}
          {/* STEP 6: 체험 관련 설문조사 진행 ➔ 쿠폰 지급예정 안내 (이탈 방지) */}
          {/* ----------------------------------------------------- */}
          {step === 'step6_post_survey_coupon' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5 animate-in fade-in duration-150">
              {!isCouponReserved ? (
                <>
                  <div className="border-b border-slate-100 pb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                      STEP 6. 무료 회차 체험 설문조사 & 혜택 안내
                    </span>
                    <h4 className="text-lg font-black text-slate-900 mt-1">
                      1차시 무료 체험은 어떠셨나요? 짧은 설문 완료 시 할인 쿠폰이 지급 예약됩니다!
                    </h4>
                  </div>

                  {/* 1. Satisfaction Score */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-800 block">
                      1. 오늘 체험한 커리큘럼 및 1차시 맛보기의 전반적인 만족도 (1~5점)
                    </label>
                    <div className="grid grid-cols-5 gap-2 text-xs">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => setSatisfactionScore(score)}
                          className={`py-2.5 rounded-xl font-black border transition-all cursor-pointer ${
                            satisfactionScore === score
                              ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                          }`}
                        >
                          {'★'.repeat(score)} ({score}점)
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Needed Features + Subjective Opinion */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-800 block">
                      2. 본 커리큘럼(교재) 정식 학습 시 가장 기대되는 점은? (복수 선택)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        '정밀 원고지 첨삭',
                        '체계적인 커리큘럼 교재',
                        '소리튜터 발음·프리토킹 연동',
                        '1:1 튜터 피드백 및 약점 보완',
                      ].map((item) => {
                        const active = neededFeatures.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleNeededFeature(item)}
                            className={`p-3 rounded-xl border text-left font-bold flex items-center justify-between cursor-pointer ${
                              active
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-950'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span>{item}</span>
                            {active && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        ✍️ 오늘 1차시 체험 소감이나 추가로 바라는 점을 적어 주세요 (필수):
                      </label>
                      <textarea
                        rows={2}
                        value={postCustomOpinion}
                        onChange={(e) => {
                          setPostCustomOpinion(e.target.value);
                          if (postSurveyError) setPostSurveyError(null);
                        }}
                        placeholder="예: 교재 설명이 깔끔해서 이해하기 쉬웠어요. 정식 교재로 끝까지 공부해보고 싶습니다."
                        className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* 3. Contact Info for Coupon Notification */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-800 block">
                      3. 할인 쿠폰 및 정식 교재 안내를 지급받을 이메일 또는 위챗(WeChat) ID (필수)
                    </label>
                    <input
                      type="text"
                      value={couponContactEmail}
                      onChange={(e) => {
                        setCouponContactEmail(e.target.value);
                        if (postSurveyError) setPostSurveyError(null);
                      }}
                      placeholder="예: student@gmail.com 또는 WeChat ID"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {postSurveyError && (
                    <p className="text-xs font-bold text-rose-600">⚠️ {postSurveyError}</p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep('step5_trial_excerpt')}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                    >
                      ← 1차시 체험으로
                    </button>

                    <button
                      type="button"
                      onClick={handleCompletePostSurvey}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Gift className="w-4 h-4" />
                      <span>설문 제출하고 할인 쿠폰 지급 안내 확인하기</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Coupon Scheduled / Retention Screen (이탈 방지 쿠폰 지급예정 안내) */
                <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                    <Gift className="w-8 h-8" />
                  </div>

                  <div className="space-y-2 max-w-lg mx-auto">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                      ✓ 체험 설문 완료 & 혜택 지급 예정 등록됨
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                      참여해 주셔서 감사합니다! 특별 할인 쿠폰 지급이 예약되었습니다.
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      입력해 주신 연락처(<strong>{couponContactEmail}</strong>)로 정규 커리큘럼(교재 구매) 진행 시 사용할 수 있는 <strong>20% 특별 얼리버드 할인 쿠폰</strong>이 우선 지급될 예정입니다.
                    </p>
                  </div>

                  <div className="max-w-md mx-auto p-4 rounded-2xl bg-amber-50/90 border-2 border-dashed border-amber-300 space-y-1.5 text-xs">
                    <div className="text-[10px] font-mono font-bold text-amber-800 uppercase">
                      SCHEDULED COUPON BENEFIT
                    </div>
                    <div className="text-base font-black text-slate-900">
                      [{category.titleKo}] 정규 교재 20% 할인권 (지급 예정)
                    </div>
                    <p className="text-[11px] text-amber-900">
                      ※ 정식 교재 결제 시 레벨 테스트 문항별 상세 해설과 1:1 맞춤형 취약점 리포트가 전체 공개됩니다.
                    </p>
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href={recommendedBook.link}
                      onClick={() => {
                        switchRole('student');
                        onClose();
                      }}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>《{recommendedBook.titleKo}》 1차시 전체 전자책 펼쳐보기</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {category.key === 'life' && (
                      <a
                        href={APP_CONFIG.soriTutorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
                      >
                        <Mic className="w-4 h-4" />
                        <span>소리튜터(SoriTutor)로 이동하기</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer"
                    >
                      메인 화면으로 돌아가기
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
