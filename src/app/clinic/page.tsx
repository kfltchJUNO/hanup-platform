'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lock,
  ArrowRight,
  ShieldAlert,
  Flame,
  Award,
  CreditCard,
  Check,
  X,
  HelpCircle,
  BarChart2,
  Filter,
  CheckSquare,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { useHanUp } from '../../context/HanUpContext';
import { ItemBankQuestion } from '../../types/hanup';
import { UI_TRANSLATIONS, SUPPORTED_LANGUAGES } from '../../lib/i18n';

export default function WeaknessClinicPage() {
  const {
    itemBank,
    currentUser,
    isPaywallModalOpen,
    openPaywallModal,
    closePaywallModal,
    unlockFullPack,
    lang,
    solvedItemIds,
    recordSolvedItem,
  } = useHanUp();

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.ko;
  const langMeta = SUPPORTED_LANGUAGES[lang] || SUPPORTED_LANGUAGES.ko;

  // Filter free daily 3 vs paid 120 items
  const freeQuestions = itemBank.filter((q) => q.accessTier === 'free_daily_3');
  const paidQuestions = itemBank.filter((q) => q.accessTier === 'paid_clinic_120');

  // Selected answer state: { [itemId]: selectedIndex }
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});

  // Paid pack filter by skill
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');

  const handleSelectOption = (itemId: string, optionIndex: number) => {
    if (submittedAnswers[itemId]) return; // already submitted
    setSelectedAnswers((prev) => ({ ...prev, [itemId]: optionIndex }));
  };

  const handleCheckAnswer = (itemId: string) => {
    setSubmittedAnswers((prev) => ({ ...prev, [itemId]: true }));
    recordSolvedItem(itemId);
  };

  const isUnlocked = currentUser.subscriptionTier !== 'free';

  // Count solved free questions
  const freeSolvedCount = freeQuestions.filter((q) => submittedAnswers[q.itemId]).length;

  const filteredPaidQuestions = paidQuestions.filter((q) => {
    if (selectedSkillFilter === 'all') return true;
    return q.targetSkill === selectedSkillFilter;
  });

  // Helper to render question stem with prominent underline for <u> tags and styled blanks
  const renderFormattedQuestionStem = (stem: string) => {
    // If has <u>...</u> tags
    if (stem.includes('<u>') && stem.includes('</u>')) {
      const parts = stem.split(/(<u>.*?<\/u>)/g);
      return (
        <span className="whitespace-pre-line leading-relaxed">
          {parts.map((part, index) => {
            if (part.startsWith('<u>') && part.endsWith('</u>')) {
              const inner = part.replace(/<\/?u>/g, '');
              return (
                <span
                  key={index}
                  className="underline decoration-blue-600 decoration-[3px] underline-offset-[6px] font-black text-blue-950 bg-blue-100/90 px-2 py-0.5 rounded-md shadow-xs mx-0.5 inline-block"
                >
                  {inner}
                </span>
              );
            }
            return <span key={index}>{part}</span>;
          })}
        </span>
      );
    }

    // If has (      ) blanks, style them into an interactive-like blank box
    if (stem.includes('(      )')) {
      const parts = stem.split('(\u0020\u0020\u0020\u0020\u0020\u0020)');
      return (
        <span className="whitespace-pre-line leading-relaxed">
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < parts.length - 1 && (
                <span className="inline-block w-20 text-center font-bold text-blue-600 bg-blue-50 border-b-2 border-blue-500 rounded-t px-2 py-0.5 mx-1 shadow-xs">
                  ( &nbsp;&nbsp;&nbsp;&nbsp; )
                </span>
              )}
            </React.Fragment>
          ))}
        </span>
      );
    }

    return <span className="whitespace-pre-line leading-relaxed">{stem}</span>;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>{t.clinicSubtitle}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t.clinicTitle}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {t.clinicDesc}
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
            <span>{t.freeSolvedProgress}: <strong className="text-emerald-400">{freeSolvedCount} / 3</strong></span>
            <span>•</span>
            <span>{t.pack120Status}: <strong className={isUnlocked ? 'text-emerald-400' : 'text-amber-400'}>{isUnlocked ? t.unlockedText : t.lockedText}</strong></span>
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Free Daily 3 Questions Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm shadow-xs">
              3
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t.daily3Title}
              </h2>
              <p className="text-xs text-slate-500">{t.daily3Subtitle}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {t.freeBadge}
          </span>
        </div>

        <div className="space-y-6">
          {freeQuestions.map((q, qIndex) => {
            const selected = selectedAnswers[q.itemId];
            const isSubmitted = submittedAnswers[q.itemId];
            const isCorrect = selected === q.correctIndex;
            const totalAttempts = q.liveAnalytics.totalAttempts;

            return (
              <div
                key={q.itemId}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-5 transition-shadow hover:shadow-md"
              >
                {/* Question Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-black border border-blue-200">
                      {t.questionNum} 0{qIndex + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {t.domainLabel}: <span className="text-blue-900 font-extrabold">{q.skillNameKo}</span>
                    </span>
                    <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-bold">
                      {t.difficultyLabel} Lv.{q.difficultyLevel}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.correctRateLabel}: <strong className="text-slate-800">{q.liveAnalytics.correctRate}%</strong></span>
                  </div>
                </div>

                {/* Question Stem */}
                <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                  {renderFormattedQuestionStem(q.questionStem)}
                </div>

                {/* 4 Options Grid */}
                <div className="grid grid-cols-1 gap-3 pt-1">
                  {q.options.map((option, optIdx) => {
                    const isSelected = selected === optIdx;
                    const count = q.liveAnalytics.optionSelectionCounts[optIdx];
                    const percent = Math.round((count / totalAttempts) * 100);

                    let optionStyle =
                      'border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-800 bg-white';

                    if (isSubmitted) {
                      if (optIdx === q.correctIndex) {
                        optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-bold line-through';
                      } else {
                        optionStyle = 'border-slate-200 text-slate-400 bg-slate-50/60';
                      }
                    } else if (isSelected) {
                      optionStyle = 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500/20';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(q.itemId, optIdx)}
                        className={`text-left px-4 py-3.5 rounded-2xl border text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${optionStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {optIdx + 1}
                          </span>
                          <span>{option}</span>
                        </div>

                        {/* If submitted, show live candidate selection percentage bar */}
                        {isSubmitted && (
                          <div className="flex items-center gap-2 pl-9 sm:pl-0">
                            <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${optIdx === q.correctIndex ? 'bg-emerald-500' : 'bg-slate-400'}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-mono font-semibold text-slate-500 w-12 text-right">
                              {percent}% ({count})
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Action Button & Explanations */}
                <div className="pt-2 flex flex-col gap-3">
                  {!isSubmitted ? (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{t.selectOptionAndCheck}</span>
                      <button
                        disabled={selected === undefined}
                        onClick={() => handleCheckAnswer(q.itemId)}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-105"
                      >
                        {t.checkAnswerBtn}
                      </button>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5 animate-in fade-in duration-300">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>{t.correctMsg}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-rose-700 font-extrabold text-sm">
                            <XCircle className="w-5 h-5 text-rose-600" />
                            <span>{t.wrongMsg}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 leading-relaxed shadow-xs">
                          <strong className="text-blue-700 block mb-1 font-bold">{t.koreanExp}</strong>
                          {q.explanationKo}
                        </div>
                        {lang !== 'ko' && (
                          <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200/80 text-slate-800 leading-relaxed">
                            <strong className="text-indigo-900 block mb-1 font-bold flex items-center gap-1.5">
                              <span>{langMeta.flag}</span>
                              <span>{langMeta.nativeLabel} {t.l1Exp}</span>
                            </strong>
                            {q.multilingualExplanations?.[lang] || (lang === 'zh' ? q.explanationZh : q.explanationKo)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner if all 3 completed */}
        {freeSolvedCount >= 3 && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-300" />
              <div>
                <h4 className="font-bold text-base">{t.allDailyDoneTitle}</h4>
                <p className="text-xs text-emerald-100">{t.allDailyDoneDesc}</p>
              </div>
            </div>
            {!isUnlocked && (
              <button
                onClick={openPaywallModal}
                className="px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-black text-xs shadow-md hover:bg-emerald-50 transition-all hover:scale-105"
              >
                {t.unlock120Btn}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. Paid Clinic 120 Questions (Freemium Paywall or Unlocked Explorer) */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 font-black flex items-center justify-center text-sm shadow-xs">
              120
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t.pack120Title}
              </h2>
              <p className="text-xs text-slate-500">
                {t.pack120Subtitle}
              </p>
            </div>
          </div>

          {/* Filter if unlocked */}
          {isUnlocked ? (
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedSkillFilter}
                onChange={(e) => setSelectedSkillFilter(e.target.value)}
                className="text-xs font-bold border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t.allDomains}</option>
                <option value="writing53Data">53번 도표 분석</option>
                <option value="readingSkimming">읽기 속독·논리</option>
                <option value="listeningInference">듣기 추론·연음</option>
                <option value="writing54Logic">54번 논술 수사</option>
              </select>
            </div>
          ) : (
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.freemiumLocked}</span>
            </span>
          )}
        </div>

        {/* If Locked: Freemium Teaser & Paywall CTA Banner */}
        {!isUnlocked ? (
          <div className="relative rounded-3xl border-2 border-dashed border-blue-300 bg-gradient-to-b from-blue-50/50 to-indigo-50/40 p-8 sm:p-12 text-center space-y-6 overflow-hidden shadow-sm">
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-500/30">
                <Lock className="w-7 h-7" />
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {t.unlockHeading}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.unlockPitch}
              </p>

              <div className="pt-2">
                <button
                  onClick={openPaywallModal}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t.unlockCtaBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Blurred Teaser preview behind */}
            <div className="pt-4 filter blur-[1px] opacity-60 pointer-events-none">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 text-left space-y-2">
                <span className="text-xs font-bold text-blue-600">[심화 120제 #04 미리보기] 53번 그래프 도표 서술 기출</span>
                <p className="text-xs text-slate-800">이러한 증가의 원인은 1인 가구의 증가에 기인한 것으로 나타났다...</p>
              </div>
            </div>
          </div>
        ) : (
          /* If Unlocked: Show Full Interactive Questions */
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t.passActivated}</span>
              </div>
              <span className="text-emerald-700 font-extrabold">{filteredPaidQuestions.length} {t.itemsAvailable}</span>
            </div>

            {filteredPaidQuestions.map((q, pIdx) => {
              const selected = selectedAnswers[q.itemId];
              const isSubmitted = submittedAnswers[q.itemId];
              const isCorrect = selected === q.correctIndex;

              return (
                <div
                  key={q.itemId}
                  className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-black border border-indigo-200">
                        {t.pack120Title} #{pIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{q.skillNameKo}</span>
                      <span className="text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold">
                        {t.difficultyLabel} Lv.{q.difficultyLevel}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                    {renderFormattedQuestionStem(q.questionStem)}
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 pt-1">
                    {q.options.map((option, optIdx) => {
                      const isSelected = selected === optIdx;
                      let optionStyle =
                        'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-800 bg-white';

                      if (isSubmitted) {
                        if (optIdx === q.correctIndex) {
                          optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                        } else if (isSelected && !isCorrect) {
                          optionStyle = 'border-rose-500 bg-rose-50 text-rose-900 line-through';
                        }
                      } else if (isSelected) {
                        optionStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isSubmitted}
                          onClick={() => handleSelectOption(q.itemId, optIdx)}
                          className={`text-left px-4 py-3 rounded-2xl border text-xs sm:text-sm flex items-center justify-between transition-all ${optionStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {optIdx + 1}
                            </span>
                            <span>{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    {!isSubmitted ? (
                      <button
                        disabled={selected === undefined}
                        onClick={() => handleCheckAnswer(q.itemId)}
                        className="self-end px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs"
                      >
                        {t.checkAnswerBtn}
                      </button>
                    ) : (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        <div className="text-slate-800">
                          <strong className="text-indigo-700 block mb-0.5 font-bold">{t.koreanExp}</strong>
                          {q.explanationKo}
                        </div>
                        {lang !== 'ko' && (
                          <div className="text-slate-800 pt-2 border-t border-slate-200">
                            <strong className="text-purple-700 block mb-0.5 font-bold flex items-center gap-1.5">
                              <span>{langMeta.flag}</span>
                              <span>{langMeta.nativeLabel} {t.l1Exp}</span>
                            </strong>
                            {q.multilingualExplanations?.[lang] || (lang === 'zh' ? q.explanationZh : q.explanationKo)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
