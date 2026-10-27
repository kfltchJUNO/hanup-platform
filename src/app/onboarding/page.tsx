'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Check,
  ChevronRight,
  Layers,
  GraduationCap,
  Users,
  Compass,
} from 'lucide-react';
import { HanUpLogo } from '../../components/HanUpLogo';
import { TOULMIN_ELEMENT_METAS, ToulminElement } from '../../types/trackB';

export default function OnboardingPage() {
  const router = useRouter();

  // Track Selection State
  const [selectedTrack, setSelectedTrack] = useState<'track_a' | 'track_b'>('track_b');

  // Track A specific
  const [topikTargetLevel, setTopikTargetLevel] = useState<number>(5);

  // Track B: Toulmin Familiarity Likert Scale (1~5)
  const [toulminRatings, setToulminRatings] = useState<Record<ToulminElement, number>>({
    C: 3,
    D: 3,
    W: 2,
    B: 2,
    Q: 2,
    R: 2,
    NONE: 3,
  });

  const [audienceFamiliarity, setAudienceFamiliarity] = useState<number>(3);
  const [irbConsent, setIrbConsent] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRatingChange = (elem: ToulminElement, val: number) => {
    setToulminRatings((prev) => ({ ...prev, [elem]: val }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    if (selectedTrack === 'track_b') {
      if (!irbConsent) {
        alert('Track B 아카데믹 논증 트랙은 연구 윤리 및 효과성 검증을 위해 IRB 연구 동의가 필요합니다.');
        setIsSubmitting(false);
        return;
      }

      // Save onboarding preferences to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'hanup_track_b_onboarding',
          JSON.stringify({
            selectedTrack: 'track_b',
            toulminRatings,
            audienceFamiliarity,
            irbConsent,
            completedAt: new Date().toISOString(),
          })
        );
      }

      router.push('/track-b/1/1');
    } else {
      // Track A -> TOPIK Study
      router.push('/study/hanup_topik_master/ch_writing_04');
    }
  };

  const elements: ToulminElement[] = ['C', 'D', 'W', 'B', 'Q', 'R'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header / Brand */}
        <div className="text-center space-y-3">
          <div className="inline-block">
            <HanUpLogo size="lg" showText={true} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            맞춤형 학습 트랙 선택 및 사전 진단
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            학습자의 목표에 맞는 트랙을 선택해 주십시오. TOPIK 합격 시험 트랙(Track A)과
            대학·대학원 학술 논증 쓰기 심화 트랙(Track B)이 지원됩니다.
          </p>
        </div>

        {/* 1. Track Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Track A Card */}
          <div
            onClick={() => setSelectedTrack('track_a')}
            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer space-y-4 relative ${
              selectedTrack === 'track_a'
                ? 'border-blue-600 bg-white shadow-xl shadow-blue-500/10 ring-4 ring-blue-500/10'
                : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white'
            }`}
          >
            {selectedTrack === 'track_a' && (
              <span className="absolute top-4 right-4 text-blue-600">
                <CheckCircle2 className="w-6 h-6 fill-blue-600 text-white" />
              </span>
            )}
            <div className="p-3 w-fit rounded-2xl bg-blue-100 text-blue-700">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                  수험 트랙
                </span>
                <h3 className="font-black text-base text-slate-900">Track A: TOPIK 합격 집중</h3>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                TOPIK II 3~6급 고득점 달성을 위한 실전 수험 코스입니다. 53번 도표 분석(30점) 및
                54번 700자 논술(50점) 공식 템플릿과 소리튜터 발음 교정이 제공됩니다.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span>53·54번 200자 원고지 실전 모의고사</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span>AI 공인 채점 기준 루브릭 80점 환산</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span>모바일 손글씨 사진 OCR 자동 인식</span>
              </li>
            </ul>
          </div>

          {/* Track B Card */}
          <div
            onClick={() => setSelectedTrack('track_b')}
            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer space-y-4 relative ${
              selectedTrack === 'track_b'
                ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-500/10 ring-4 ring-indigo-500/10'
                : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white'
            }`}
          >
            {selectedTrack === 'track_b' && (
              <span className="absolute top-4 right-4 text-indigo-600">
                <CheckCircle2 className="w-6 h-6 fill-indigo-600 text-white" />
              </span>
            )}
            <div className="p-3 w-fit rounded-2xl bg-indigo-100 text-indigo-700">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase">
                  학술·대학원 트랙
                </span>
                <h3 className="font-black text-base text-slate-900">
                  Track B: 아카데믹 논증 심화 (4단계 16유닛)
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                샤임 페렐만(Chaïm Perelman)의 신수사학(청중론, 가치 위계, 개념 분리)과
                스티븐 툴민(Stephen Toulmin)의 6요소를 활용하여 학술 논문 및 고난도 논증문을 완성합니다.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-indigo-600" />
                <span>C-D-W-B-Q-R 툴민 6요소 실시간 자동 태깅 &amp; 레이더</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-indigo-600" />
                <span>페렐만식 &apos;악마의 대변인&apos; AI 가치 충돌 반론 &amp; 재반박</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-indigo-600" />
                <span>1:1 과외 코칭 및 박사학위 논문 실증 연구 참여</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 2. Track B Diagnostic Survey Section */}
        {selectedTrack === 'track_b' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                <Layers className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-black text-base text-slate-900">
                  Track B 사전 진단: 툴민 6요소 인지도 &amp; 연구 동의
                </h3>
                <p className="text-xs text-slate-500">
                  논증 6대 요소에 대해 평소 얼마나 이해하고 글쓰기에 활용하고 계신지 체크해 주십시오. (1점: 전혀 모름 ~ 5점: 능숙히 활용)
                </p>
              </div>
            </div>

            {/* Toulmin Likert Scale Grid */}
            <div className="space-y-4">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                1. 툴민 논증 6요소 사전 친숙도 (1~5점 척도):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {elements.map((elem) => {
                  const meta = TOULMIN_ELEMENT_METAS[elem];
                  const currentVal = toulminRatings[elem] || 3;

                  return (
                    <div
                      key={elem}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] ${meta.colorClass.badge}`}>
                            {elem}
                          </span>
                          <span className="font-bold text-xs text-slate-900">
                            {meta.nameKo}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-black text-indigo-600">
                          {currentVal}점
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {meta.descriptionKo}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button
                            key={score}
                            type="button"
                            onClick={() => handleRatingChange(elem, score)}
                            className={`w-8 h-7 rounded-lg text-xs font-bold transition-all ${
                              currentVal === score
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audience Awareness Question */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-indigo-950 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-700" />
                  2. 페렐만 청중 수사 인식:
                </span>
                <span className="font-mono font-bold text-indigo-700">
                  {audienceFamiliarity}점
                </span>
              </div>
              <p className="text-xs text-indigo-900/80 leading-relaxed">
                &ldquo;글을 쓸 때 나의 의견에 반대하는 잠재적 청중의 가치관(Value)과 거부감(Friction)을 고려하여 수사적 양보나 단어 선택을 전략적으로 조절하십니까?&rdquo;
              </p>
              <div className="flex items-center justify-between pt-1">
                {[
                  { val: 1, label: '전혀 고려 안 함' },
                  { val: 2, label: '가끔 의식함' },
                  { val: 3, label: '보통' },
                  { val: 4, label: '자주 고려함' },
                  { val: 5, label: '완벽히 전략 반영' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setAudienceFamiliarity(item.val)}
                    className={`px-2 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                      audienceFamiliarity === item.val
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-indigo-200/60 hover:bg-indigo-50'
                    }`}
                  >
                    {item.val}. {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. IRB Academic Research Consent */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>학술 실증 연구 윤리 및 데이터 수집 동의 (IRB Approval)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                본 트랙에서의 학습 과정(키스트로크 텔레메트리, 문장별 툴민 태깅, 악마의 대변인과의 수사적 협상 로그)은
                외국인을 위한 한국어 학술 논증 쓰기 교육 효과성 검증을 위한 <strong>박사 학위 논문 연구 코퍼스</strong>로 활용됩니다.
                모든 개인식별정보(이름, 이메일)는 SHA-256 단방향 암호화 비식별 처리됩니다.
              </p>

              <label className="flex items-center gap-2.5 pt-2 border-t border-slate-800 text-xs font-bold text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={irbConsent}
                  onChange={(e) => setIrbConsent(e.target.checked)}
                  className="rounded text-indigo-500 focus:ring-indigo-400 w-4 h-4"
                />
                <span>[필수] 학술 연구 목적의 작문 텔레메트리 비식별 수집 및 분석에 동의합니다.</span>
              </label>
            </div>
          </div>
        )}

        {/* Track A Target Level Selector if selected */}
        {selectedTrack === 'track_a' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-black text-slate-800 block">
              목표 TOPIK 급수 선택:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 5, 6].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setTopikTargetLevel(lvl)}
                  className={`py-3 rounded-2xl font-black text-sm transition-all ${
                    topikTargetLevel === lvl
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lvl}급
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <span>
              {selectedTrack === 'track_b'
                ? 'Track B: 1유닛 딜레마 세션 시작하기'
                : 'Track A: TOPIK 쓰기 학습 시작하기'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
