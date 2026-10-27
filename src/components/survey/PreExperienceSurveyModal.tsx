'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  GraduationCap,
  Globe,
  HelpCircle,
  ShieldCheck,
  Check,
  X,
  ArrowRight,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { UserSurveyEntry } from '../../types/trackB';

interface PreExperienceSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (survey: UserSurveyEntry) => void;
  defaultTrack?: 'track_a' | 'track_b';
}

export const PreExperienceSurveyModal: React.FC<PreExperienceSurveyModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  defaultTrack = 'track_b',
}) => {
  const [selectedTrack, setSelectedTrack] = useState<'track_a' | 'track_b'>(defaultTrack);
  const [l1Language, setL1Language] = useState<string>('zh-CN');
  const [l1CustomText, setL1CustomText] = useState<string>('');
  const [targetTopikLevel, setTargetTopikLevel] = useState<string>('5');
  const [bottlenecks, setBottlenecks] = useState<string[]>([
    '이유(Warrant) 연결 부재',
    '반론(Rebuttal) 방어 미숙',
  ]);
  const [bottlenecksCustom, setBottlenecksCustom] = useState<string>('');
  const [irbConsent, setIrbConsent] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleBottleneck = (item: string) => {
    setBottlenecks((prev) =>
      prev.includes(item) ? prev.filter((b) => b !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Required validation
    if (!bottlenecksCustom.trim()) {
      setValidationError('구체적인 글쓰기 고민을 1문장 이상 서술해 주십시오. (모국어 작성 가능)');
      return;
    }

    if (!irbConsent) {
      setValidationError('무료 체험 크레딧 지급 및 연구 코퍼스 활용을 위해 IRB 동의가 필요합니다.');
      return;
    }

    setIsSubmitting(true);

    const surveyData: UserSurveyEntry = {
      sessionId:
        typeof window !== 'undefined'
          ? localStorage.getItem('hanup_survey_session') ||
            `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
          : `sess_${Date.now()}`,
      surveyType: 'pre_onboarding',
      selectedTrack,
      l1Language,
      l1CustomText: l1Language === 'custom' ? l1CustomText : undefined,
      targetTopikLevel,
      writingBottlenecks: bottlenecks,
      writingBottlenecksCustom: bottlenecksCustom.trim(),
      irbConsent,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData),
      });
      const data = await res.json();
      if (data.sessionId && typeof window !== 'undefined') {
        localStorage.setItem('hanup_survey_session', data.sessionId);
        localStorage.setItem('hanup_pre_survey_done', 'true');
      }
    } catch (err) {
      console.warn('[Pre Survey] Fallback local persistence:', err);
    } finally {
      setIsSubmitting(false);
      onComplete(surveyData);
    }
  };

  const bottleneckOptions = [
    { id: 'vocab_grammar', label: '어휘·맞춤법 및 한국어 표현력 한계' },
    { id: 'length_short', label: '분량 부족 (600~700자 채우기 부담)' },
    { id: 'warrant_missing', label: '이유(Warrant) 연결 부재 (비약이 잦음)' },
    { id: 'rebuttal_weak', label: '반론(Rebuttal) 방어 미숙 (일방적 주장)' },
    { id: 'structure_logic', label: '서론-본론-결론 논리적 전개 구조 흔들림' },
  ];

  const l1Options = [
    { code: 'zh-CN', label: '중국어 (中文)' },
    { code: 'vi-VN', label: '베트남어 (Tiếng Việt)' },
    { code: 'en-US', label: '영어 (English)' },
    { code: 'ja-JP', label: '일본어 (日本語)' },
    { code: 'custom', label: '기타 언어 직접 입력' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-400/30">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base">무료 체험 사전 온보딩 설문</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  체험 크레딧 지급
                </span>
              </div>
              <p className="text-xs text-indigo-200/80">
                1분 설문 완료 시 AI 툴민 진단 및 모의평가 무료 체험권이 즉시 활성화됩니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {/* Question 1: Track Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
              학습 희망 트랙을 선택해 주십시오:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setSelectedTrack('track_a')}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedTrack === 'track_a'
                    ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-1 ring-blue-500'
                    : 'border-slate-200 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-blue-900">Track A: TOPIK 실전 고득점</span>
                  <Award className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  53번 도표(30점) & 54번 논술(50점) 원고지 실전 작성
                </p>
              </div>

              <div
                onClick={() => setSelectedTrack('track_b')}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedTrack === 'track_b'
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-sm ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-indigo-900">Track B: 아카데믹 논증 심화</span>
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  페렐만 신수사학 × 툴민 6요소 기반 학술 논증문 작성
                </p>
              </div>
            </div>
          </div>

          {/* Question 2: L1 Language */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
              모국어 (L1 Language)를 선택해 주십시오:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {l1Options.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setL1Language(opt.code)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left truncate ${
                    l1Language === opt.code
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {l1Language === 'custom' && (
              <input
                type="text"
                value={l1CustomText}
                onChange={(e) => setL1CustomText(e.target.value)}
                placeholder="모국어를 직접 입력해 주십시오 (예: ภาษาไทย, Bahasa Indonesia)"
                className="w-full mt-2 p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>

          {/* Question 3: Writing Bottlenecks & Required Subjective Note */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                평소 한국어 글쓰기에서 가장 큰 병목(어려움)은 무엇입니까? (복수 선택)
              </span>
              <span className="text-[10px] text-slate-500">객관식 + 주관식 필수</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {bottleneckOptions.map((item) => {
                const isSelected = bottlenecks.includes(item.label);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleBottleneck(item.label)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Required Subjective Input */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-900 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  [필수] 구체적인 글쓰기 고민을 적어주세요 (1문장 이상):
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {bottlenecksCustom.length}자
                </span>
              </div>
              <textarea
                rows={3}
                value={bottlenecksCustom}
                onChange={(e) => setBottlenecksCustom(e.target.value)}
                placeholder="모국어로 편하게 작성하셔도 좋습니다 (中文 / Tiếng Việt / English / 日本語 가능). 예: 54번에서 근거를 쓸 때 머릿속 생각은 많은데 어떤 문법과 연결어로 논리를 풀어야 할지 막막합니다."
                className="w-full p-3 rounded-2xl border border-slate-300 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner font-sans"
              />
            </div>
          </div>

          {/* Question 4: IRB Research Consent */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>학술 연구 코퍼스 수집 및 IRB 간이 동의</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              수집된 작문 로그(키스트로크, 툴민 6요소 진단 결과, 수사적 고민)는 한국어 논증 쓰기 교육
              연구를 위한 <strong>박사 학위 논문 연구 코퍼스</strong>로 비식별화(SHA-256) 처리되어 활용됩니다.
            </p>
            <label className="flex items-center gap-2 pt-1 border-t border-slate-800 text-xs font-bold text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={irbConsent}
                onChange={(e) => setIrbConsent(e.target.checked)}
                className="rounded text-indigo-500 focus:ring-indigo-400 w-4 h-4"
              />
              <span>[필수] 연구 목적의 작문 데이터 비식별 수집에 동의하고 무료 체험 크레딧을 받습니다.</span>
            </label>
          </div>

          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Submit CTA */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              다음에 하기
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all cursor-pointer"
            >
              <span>{isSubmitting ? '등록 중...' : '설문 완료 & 무료 체험 시작'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
