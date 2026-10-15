'use client';

import React, { useState } from 'react';
import { useHanUp } from '../context/HanUpContext';
import {
  X,
  Sparkles,
  CheckCircle2,
  Gift,
  Copy,
  ChevronRight,
  ShieldCheck,
  Star,
  DollarSign,
  Users,
  MessageSquare,
} from 'lucide-react';

export default function AiEducationSurveyModal() {
  const {
    isSurveyModalOpen,
    closeSurveyModal,
    submitSurveyResponse,
    currentUser,
    lang,
    openPaywallModal,
  } = useHanUp();

  const [aiScore, setAiScore] = useState<number>(5);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([
    '즉각적인 실시간 피드백',
    '틀려도 부끄럽지 않은 심리적 편안함',
  ]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([
    '전문 시험 채점관과의 미세한 점수 차이 우려',
  ]);
  const [tier, setTier] = useState<
    'tier1_ai_only' | 'tier2_ai_human_review' | 'tier3_ai_group_lecture' | 'tier4_human_1on1'
  >('tier2_ai_human_review');
  const [wtp1, setWtp1] = useState<string>('$10~$15');
  const [wtp2, setWtp2] = useState<string>('$15~$30');
  const [wtp3, setWtp3] = useState<string>('$30~$60');
  const [openText, setOpenText] = useState<string>('');
  const [submittedCoupon, setSubmittedCoupon] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isSurveyModalOpen) return null;

  const reasonOptions = [
    '즉각적인 실시간 피드백 (대기 시간 없음)',
    '틀려도 부끄럽지 않은 심리적 편안함',
    '오프라인 학원/과외 대비 압도적인 가성비',
    '모국어(중국어/영어/베트남어 등) 맞춤 오류 분석',
    '24시간 언제 어디서나 반복 학습 가능',
  ];

  const concernOptions = [
    '전문 시험 채점관과의 미세한 점수 오차 우려',
    'AI의 획일적인 문장 첨삭 패턴 가능성',
    '인간적인 정서적 공감 및 학습 동기 부여 부족',
    '복잡하고 창의적인 논술 수사 구조 파악 한계',
  ];

  const handleToggleReason = (r: string) => {
    setSelectedReasons((prev) =>
      prev.includes(r) ? prev.filter((item) => item !== r) : [...prev, r]
    );
  };

  const handleToggleConcern = (c: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const coupon = submitSurveyResponse({
      studentUid: currentUser.uid,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      nativeLanguage: currentUser.nativeLanguage,
      aiPreferenceScore: aiScore,
      preferenceReasons: selectedReasons,
      concernFactors: selectedConcerns,
      preferredInterventionTier: tier,
      wtpTier1AiOnly: wtp1,
      wtpTier2AiHumanReview: wtp2,
      wtpTier3AiLiveCoaching: wtp3,
      openFeedbackText: openText,
    });
    setSubmittedCoupon(coupon);
  };

  const handleCopyCoupon = () => {
    if (submittedCoupon) {
      navigator.clipboard.writeText(submittedCoupon);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-6 text-white relative">
          <button
            onClick={closeSurveyModal}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Academic Research & AI Education Needs Survey</span>
          </div>
          <h2 className="text-xl font-black mt-1">
            AI 한국어 학습 경험 및 인간 교사 개입 선호도 설문
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            2회분 학습 완료 축하드립니다! 설문에 응답해주시면 연구 윤리(IRB)에 따라 익명 코퍼스로 분석되며,{' '}
            <strong className="text-amber-300 font-bold">20% 특별 할인 쿠폰</strong>이 즉시 발급됩니다.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {submittedCoupon ? (
            <div className="py-8 text-center space-y-5 animate-scale-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  설문 참여가 성공적으로 완료되었습니다!
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  귀중한 연구 데이터는 한국어 교육학 AI 모델 발전과 학술 논문 통계 분석에 소중히 활용됩니다.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 max-w-md mx-auto space-y-3">
                <div className="flex items-center justify-center gap-2 text-amber-800 font-bold text-sm">
                  <Gift className="w-5 h-5 text-amber-600" />
                  <span>약속된 20% 정기/단품 할인 쿠폰이 발급되었습니다</span>
                </div>
                <div className="flex items-center justify-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-amber-300 shadow-sm">
                  <span className="font-mono text-lg font-black text-slate-900 tracking-wider">
                    {submittedCoupon}
                  </span>
                  <button
                    onClick={handleCopyCoupon}
                    className="ml-2 inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? '복사됨!' : '코드 복사'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-amber-700">
                  결제창에 쿠폰 코드가 자동 적용되었습니다. 단품 및 Pro 패스 결제 시 20% 즉시 감면됩니다.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={closeSurveyModal}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  학습으로 돌아가기
                </button>
                <button
                  onClick={() => {
                    closeSurveyModal();
                    openPaywallModal();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <span>20% 할인가로 교재·패스 구매</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Q1: AI 학습 선호도 리커트 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>1. 전반적인 AI 한국어 피드백 만족도 및 선호도 (1~5점)</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setAiScore(score)}
                      className={`py-3 rounded-xl border text-center transition-all ${
                        aiScore === score
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-black shadow-sm ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-base font-bold">{score}점</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {score === 1
                          ? '매우 불만'
                          : score === 3
                          ? '보통'
                          : score === 5
                          ? '매우 만족'
                          : ''}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2: 선호 이유 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">
                  2. AI 피드백을 선호하는 주된 요인은 무엇인가요? (중복 선택)
                </label>
                <div className="space-y-1.5">
                  {reasonOptions.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 cursor-pointer text-xs text-slate-800"
                    >
                      <input
                        type="checkbox"
                        checked={selectedReasons.includes(opt)}
                        onChange={() => handleToggleReason(opt)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q3: 우려 요인 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">
                  3. AI 학습에서 가장 우려되거나 아쉬운 점은 무엇인가요? (중복 선택)
                </label>
                <div className="space-y-1.5">
                  {concernOptions.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 cursor-pointer text-xs text-slate-800"
                    >
                      <input
                        type="checkbox"
                        checked={selectedConcerns.includes(opt)}
                        onChange={() => handleToggleConcern(opt)}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q4: 인간 교사 개입 단계별 선호 모델 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>4. 가장 이상적이라고 생각하는 'AI + 인간 교사' 결합 모델은?</span>
                </label>
                <div className="space-y-2 text-xs">
                  <label
                    className={`block p-3 rounded-xl border cursor-pointer transition-all ${
                      tier === 'tier1_ai_only'
                        ? 'border-indigo-600 bg-indigo-50/60 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tier"
                      checked={tier === 'tier1_ai_only'}
                      onChange={() => setTier('tier1_ai_only')}
                      className="mr-2 text-indigo-600"
                    />
                    <strong>Tier 1: 순수 AI 자습형</strong> - 교사 개입 없이 AI 실시간 무제한 첨삭과 클리닉 자습
                  </label>

                  <label
                    className={`block p-3 rounded-xl border cursor-pointer transition-all ${
                      tier === 'tier2_ai_human_review'
                        ? 'border-indigo-600 bg-indigo-50/60 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tier"
                      checked={tier === 'tier2_ai_human_review'}
                      onChange={() => setTier('tier2_ai_human_review')}
                      className="mr-2 text-indigo-600"
                    />
                    <strong>Tier 2: AI 실시간 첨삭 + 인간 교사 주 1회 2차 검수 (Human-in-the-Loop)</strong> - 일상 자습은 AI로, 핵심 답안은 한국인 교사가 주 1회 직접 정밀 첨삭 및 녹음 코멘트 제공
                  </label>

                  <label
                    className={`block p-3 rounded-xl border cursor-pointer transition-all ${
                      tier === 'tier3_ai_group_lecture'
                        ? 'border-indigo-600 bg-indigo-50/60 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tier"
                      checked={tier === 'tier3_ai_group_lecture'}
                      onChange={() => setTier('tier3_ai_group_lecture')}
                      className="mr-2 text-indigo-600"
                    />
                    <strong>Tier 3: AI 자습 + 교사 격주 줌(Zoom) 소그룹 라이브 특강</strong> - AI 피드백 바탕으로 격주 60분 빈출 오답 풀이 및 질의응답
                  </label>

                  <label
                    className={`block p-3 rounded-xl border cursor-pointer transition-all ${
                      tier === 'tier4_human_1on1'
                        ? 'border-indigo-600 bg-indigo-50/60 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tier"
                      checked={tier === 'tier4_human_1on1'}
                      onChange={() => setTier('tier4_human_1on1')}
                      className="mr-2 text-indigo-600"
                    />
                    <strong>Tier 4: 인간 교사 1:1 밀착 과외 + AI 보조</strong> - 전담 한국어 전문 강사의 주 2회 화상 과외와 AI 진단 리포트 결합
                  </label>
                </div>
              </div>

              {/* Q5: 개입 단계별 최대 지불의향 (WTP) */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>5. 서비스 모델별 월 최대 지불의향 (WTP - Willingness to Pay)</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">
                      Tier 1: 순수 AI 자습형
                    </span>
                    <select
                      value={wtp1}
                      onChange={(e) => setWtp1(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    >
                      <option value="$5 미만">$5 미만 (₩6,500↓)</option>
                      <option value="$5~$10">$5~$10 (₩7,000~13,000)</option>
                      <option value="$10~$15">$10~$15 (₩14,000~20,000)</option>
                      <option value="$15 이상">$15 이상 (₩20,000↑)</option>
                    </select>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">
                      Tier 2: AI + 교사 주1회 검수
                    </span>
                    <select
                      value={wtp2}
                      onChange={(e) => setWtp2(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    >
                      <option value="$15 미만">$15 미만 (₩20,000↓)</option>
                      <option value="$15~$30">$15~$30 (₩20,000~40,000)</option>
                      <option value="$30~$50">$30~$50 (₩40,000~68,000)</option>
                      <option value="$50 이상">$50 이상 (₩70,000↑)</option>
                    </select>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">
                      Tier 3: AI + 라이브 코칭
                    </span>
                    <select
                      value={wtp3}
                      onChange={(e) => setWtp3(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    >
                      <option value="$30 미만">$30 미만 (₩40,000↓)</option>
                      <option value="$30~$60">$30~$60 (₩40,000~80,000)</option>
                      <option value="$60~$100">$60~$100 (₩80,000~135,000)</option>
                      <option value="$100 이상">$100 이상 (₩140,000↑)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Q6: 토픽 모델링용 자유 서술형 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>6. 한업(HanUp) 플랫폼 및 AI 한국어 교육에 바라는 점 (자유 서술형)</span>
                </label>
                <textarea
                  value={openText}
                  onChange={(e) => setOpenText(e.target.value)}
                  placeholder="예: 원고지 띄어쓰기뿐만 아니라 대학원 면담 이메일 템플릿도 추가되었으면 좋겠습니다. 중국어 간섭 오류 설명이 매우 유익합니다."
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              {/* IRB Privacy Notice & Submit */}
              <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>개인식별정보는 완전히 가명화/마스킹 처리되어 연구에 활용됩니다.</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={closeSurveyModal}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    나중에 하기
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-bold text-white shadow-md transition-all"
                  >
                    설문 제출 & 20% 쿠폰 받기
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
