'use client';

import React, { useState, useEffect } from 'react';
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
  Languages,
} from 'lucide-react';
import { SURVEY_TRANSLATIONS, SurveyLocale } from '../lib/surveyI18n';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../lib/i18n';

export default function AiEducationSurveyModal() {
  const {
    isSurveyModalOpen,
    closeSurveyModal,
    submitSurveyResponse,
    currentUser,
    lang,
    openPaywallModal,
  } = useHanUp();

  // Local active language with seamless tab switching
  const [activeLang, setActiveLang] = useState<SupportedLanguage>(lang || 'zh');

  useEffect(() => {
    if (lang) {
      setActiveLang(lang);
    }
  }, [lang]);

  const [aiScore, setAiScore] = useState<number>(5);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([
    'reason_instant',
    'reason_comfort',
  ]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([
    'concern_scoring',
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

  const t: SurveyLocale = SURVEY_TRANSLATIONS[activeLang] || SURVEY_TRANSLATIONS.ko;

  const reasonKeys: (keyof typeof t.q2Options)[] = [
    'reason_instant',
    'reason_comfort',
    'reason_price',
    'reason_l1',
    'reason_anytime',
  ];

  const concernKeys: (keyof typeof t.q3Options)[] = [
    'concern_scoring',
    'concern_formulaic',
    'concern_empathy',
    'concern_nuance',
  ];

  const handleToggleReason = (key: string) => {
    setSelectedReasons((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleToggleConcern = (key: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
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
      preferenceReasons: selectedReasons.map((k) => t.q2Options[k as keyof typeof t.q2Options] || k),
      concernFactors: selectedConcerns.map((k) => t.q3Options[k as keyof typeof t.q3Options] || k),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-6 text-white relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t.headerBadge}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* In-Modal Language Switcher Pills */}
              <div className="flex items-center bg-white/15 backdrop-blur-md p-1 rounded-xl border border-white/20 gap-0.5">
                {(['ko', 'zh', 'en', 'ja', 'vi', 'my'] as SupportedLanguage[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setActiveLang(l)}
                    className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                      activeLang === l
                        ? 'bg-white text-indigo-900 shadow-xs font-black'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                    title={SUPPORTED_LANGUAGES[l]?.nativeLabel}
                  >
                    <span>{SUPPORTED_LANGUAGES[l]?.flag}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={closeSurveyModal}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-black mt-2 leading-snug">
            {t.title}
          </h2>
          <p className="text-xs text-blue-100 mt-1.5 leading-relaxed font-sans">
            {t.subtitle}
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
                  {t.successTitle}
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  {t.successDesc}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 max-w-md mx-auto space-y-3">
                <div className="flex items-center justify-center gap-2 text-amber-800 font-bold text-sm">
                  <Gift className="w-5 h-5 text-amber-600" />
                  <span>{t.couponNotice}</span>
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
                    <span>{copied ? t.btnCopied : t.btnCopyCode}</span>
                  </button>
                </div>
                <p className="text-[11px] text-amber-700">
                  {t.couponApplied}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={closeSurveyModal}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  {t.btnReturn}
                </button>
                <button
                  onClick={() => {
                    closeSurveyModal();
                    openPaywallModal();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <span>{t.btnBuyDiscount}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Q1: AI 학습 만족도 리커트 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{t.q1Label}</span>
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
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate px-1 font-medium">
                        {t.scoreLabels[score] || ''}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2: 선호 이유 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">
                  {t.q2Label}
                </label>
                <div className="space-y-1.5">
                  {reasonKeys.map((key) => (
                    <label
                      key={key}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 cursor-pointer text-xs text-slate-800 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedReasons.includes(key)}
                        onChange={() => handleToggleReason(key)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{t.q2Options[key]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q3: 우려 요인 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">
                  {t.q3Label}
                </label>
                <div className="space-y-1.5">
                  {concernKeys.map((key) => (
                    <label
                      key={key}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 cursor-pointer text-xs text-slate-800 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedConcerns.includes(key)}
                        onChange={() => handleToggleConcern(key)}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span>{t.q3Options[key]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q4: 인간 교사 개입 단계별 선호 모델 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>{t.q4Label}</span>
                </label>
                <div className="space-y-2 text-xs">
                  {(
                    [
                      'tier1_ai_only',
                      'tier2_ai_human_review',
                      'tier3_ai_group_lecture',
                      'tier4_human_1on1',
                    ] as const
                  ).map((tierKey) => {
                    const item = t.q4Tiers[tierKey];
                    return (
                      <label
                        key={tierKey}
                        className={`block p-3 rounded-xl border cursor-pointer transition-all ${
                          tier === tierKey
                            ? 'border-indigo-600 bg-indigo-50/60 font-semibold shadow-2xs'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="tier"
                          checked={tier === tierKey}
                          onChange={() => setTier(tierKey)}
                          className="mr-2 text-indigo-600"
                        />
                        <strong className="text-slate-900">{item.title}</strong>
                        <span className="text-slate-600 block mt-0.5 pl-5 leading-relaxed font-normal">
                          {item.desc}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Q5: 개입 단계별 최대 지불의향 (WTP) */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>{t.q5Label}</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">
                      {t.q5Tier1Title}
                    </span>
                    <select
                      value={wtp1}
                      onChange={(e) => setWtp1(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-sans"
                    >
                      <option value="$5 미만">$5 미만 (₩6,500↓ / ¥35↓)</option>
                      <option value="$5~$10">$5~$10 (₩7,000~13,000 / ¥35~70)</option>
                      <option value="$10~$15">$10~$15 (₩14,000~20,000 / ¥70~105)</option>
                      <option value="$15 이상">$15 이상 (₩20,000↑ / ¥105↑)</option>
                    </select>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">
                      {t.q5Tier2Title}
                    </span>
                    <select
                      value={wtp2}
                      onChange={(e) => setWtp2(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-sans"
                    >
                      <option value="$15 미만">$15 미만 (₩20,000↓ / ¥105↓)</option>
                      <option value="$15~$30">$15~$30 (₩20,000~40,000 / ¥105~210)</option>
                      <option value="$30~$50">$30~$50 (₩40,000~68,000 / ¥210~350)</option>
                      <option value="$50 이상">$50 이상 (₩70,000↑ / ¥350↑)</option>
                    </select>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">
                      {t.q5Tier3Title}
                    </span>
                    <select
                      value={wtp3}
                      onChange={(e) => setWtp3(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-sans"
                    >
                      <option value="$30 미만">$30 미만 (₩40,000↓ / ¥210↓)</option>
                      <option value="$30~$60">$30~$60 (₩40,000~80,000 / ¥210~420)</option>
                      <option value="$60~$100">$60~$100 (₩80,000~135,000 / ¥420~700)</option>
                      <option value="$100 이상">$100 이상 (₩140,000↑ / ¥700↑)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Q6: 자유 서술형 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>{t.q6Label}</span>
                </label>
                <textarea
                  value={openText}
                  onChange={(e) => setOpenText(e.target.value)}
                  placeholder={t.q6Placeholder}
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-sans"
                />
              </div>

              {/* IRB Privacy Notice & Submit */}
              <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.irbNotice}</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={closeSurveyModal}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    {t.btnLater}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                  >
                    {t.btnSubmit}
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
