'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  HelpCircle,
  Lock,
  Stethoscope,
  Bookmark,
  Target,
  Flame,
  Clock,
  Compass,
  FileText,
} from 'lucide-react';
import { useHanUp } from '../../context/HanUpContext';
import { MOCK_SERIES } from '../../mock/mockData';
import { UI_TRANSLATIONS, SUPPORTED_LANGUAGES, SupportedLanguage } from '../../lib/i18n';
import { GrowthReportModal } from '../../components/GrowthReportModal';

export default function StudentDashboardPage() {
  const { currentUser, lang, savedVocabs, submissions } = useHanUp();
  const [mounted, setMounted] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.ko;
  const langMeta = SUPPORTED_LANGUAGES[lang] || SUPPORTED_LANGUAGES.ko;

  // Line chart visible metrics filter
  const [activeMetrics, setActiveMetrics] = useState<{
    total: boolean;
    reading: boolean;
    writing: boolean;
    listening: boolean;
  }>({
    total: true,
    reading: true,
    writing: true,
    listening: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const radarLabels: Record<string, Record<SupportedLanguage, string>> = {
    vocabHanja: { ko: '한자어·어휘', en: 'Vocab & Hanja', ja: '漢字語・語彙', zh: '汉字词·词汇', vi: 'Từ Hán-Hàn', my: 'ဝေါဟာရ' },
    grammarConnective: { ko: '연결어미·문법', en: 'Connectives & Grammar', ja: '接続尾・文法', zh: '接续尾·语法', vi: 'Vĩ tố nối & Ngữ pháp', my: 'သဒ္ဒါစနစ်' },
    listeningInference: { ko: '듣기 추론', en: 'Listening Inference', ja: '聞き取り推論', zh: '听力推理', vi: 'Suy luận nghe', my: 'နားထောင်တွေးဆမှု' },
    readingSkimming: { ko: '읽기 속독', en: 'Reading Skimming', ja: '読解速読', zh: '阅读速读', vi: 'Đọc nhanh & Logic', my: 'စာဖတ်မြန်နှုန်း' },
    writing53Data: { ko: '53번 도표', en: 'Q53 Data Chart', ja: '53番 図表分析', zh: '53题图表', vi: 'Câu 53 Biểu đồ', my: 'မေးခွန်း ၅၃ ဇယား' },
    writing54Logic: { ko: '54번 논술', en: 'Q54 Essay Logic', ja: '54番 小論文', zh: '54题论述', vi: 'Câu 54 Luận văn', my: 'မေးခွန်း ၅၄ စာစီစာကုံး' },
  };

  // Radar Chart Data mapped from currentUser.skillRadar
  const radarData = [
    { subject: radarLabels.vocabHanja[lang] || radarLabels.vocabHanja.ko, score: currentUser.skillRadar.vocabHanja, fullMark: 100 },
    { subject: radarLabels.grammarConnective[lang] || radarLabels.grammarConnective.ko, score: currentUser.skillRadar.grammarConnective, fullMark: 100 },
    { subject: radarLabels.listeningInference[lang] || radarLabels.listeningInference.ko, score: currentUser.skillRadar.listeningInference, fullMark: 100 },
    { subject: radarLabels.readingSkimming[lang] || radarLabels.readingSkimming.ko, score: currentUser.skillRadar.readingSkimming, fullMark: 100 },
    { subject: radarLabels.writing53Data[lang] || radarLabels.writing53Data.ko, score: currentUser.skillRadar.writing53Data, fullMark: 100 },
    { subject: radarLabels.writing54Logic[lang] || radarLabels.writing54Logic.ko, score: currentUser.skillRadar.writing54Logic, fullMark: 100 },
  ];

  // Weakest skill calculation
  const skillEntries = [
    {
      key: 'writing54Logic',
      name: radarLabels.writing54Logic[lang] || radarLabels.writing54Logic.ko,
      val: currentUser.skillRadar.writing54Logic,
      advice: {
        ko: '중국어 직역투(-원합니다, -좋을 것 같다) 탈피 및 해라체(-선결 과제라 할 수 있다) 훈련 시급',
        en: 'Eliminate direct translation tone (-원합니다) and master academic plain style (-선결 과제라 할 수 있다).',
        ja: '直訳調の不自然な文末（-원합니다）を排し、学術的なヘラ体（-선결 과제라 할 수 있다）の習得が急務です。',
        zh: '严禁使用口语及中式直译，强化学术海拉体论述句式训练（如 -선결 과제라 할 수 있다）。',
        vi: 'Tránh các lối diễn đạt dịch sát nghĩa (-원합니다), khẩn trương luyện tập đuôi câu học thuật (-선결 과제라 할 수 있다).',
        my: 'တိုက်ရိုက်ဘာသာပြန်ဟန်များကို ရှောင်ရှားပြီး ပညာရပ်ဆိုင်ရာ 해라체 စာစီစာကုံးပုံစံကို အဓိက လေ့ကျင့်ပါ။',
      },
      link: '/study/hanup_topik/ch_writing_04',
    },
    {
      key: 'grammarConnective',
      name: radarLabels.grammarConnective[lang] || radarLabels.grammarConnective.ko,
      val: currentUser.skillRadar.grammarConnective,
      advice: {
        ko: '-는 바람에 vs -는 탓에 등 부정적 인과 연결어미 집중 연습 필요',
        en: 'Intensive practice needed for negative causal connectives such as -는 바람에 vs -는 탓에.',
        ja: '「-는 바람에」や「-는 탓에」など否定的な因果を表す接続語尾の集中対策が必要です。',
        zh: '针对消极因果接续词尾（-는 바람에, -는 탓에）进行针对性题海强化。',
        vi: 'Cần luyện tập chuyên sâu các vĩ tố nối chỉ nguyên nhân tiêu cực như -는 바람에 hay -는 탓에.',
        my: 'အဆိုးဘက် အကြောင်းပြချက်ကို ဖော်ပြသော -는 바람에 နှင့် -는 탓에 စသည့် သဒ္ဒါများကို အထူးလေ့ကျင့်ပါ။',
      },
      link: '/clinic',
    },
    {
      key: 'writing53Data',
      name: radarLabels.writing53Data[lang] || radarLabels.writing53Data.ko,
      val: currentUser.skillRadar.writing53Data,
      advice: {
        ko: '증가 원인 서술 시 ‘-에 기인한 것으로 나타났다’ 표준 템플릿 암기',
        en: 'Memorize standard academic templates like "-에 기인한 것으로 나타났다" for cause analysis in Q53.',
        ja: '53番の図表記述では「-에 기인한 것으로 나타났다」などの標準テンプレートを習得してください。',
        zh: '熟背图表归因高分句式（-에 기인한 것으로 나타났다）。',
        vi: 'Ghi nhớ mẫu câu chuẩn "-에 기인한 것으로 나타났다" khi miêu tả nguyên nhân tăng trưởng ở câu 53.',
        my: 'မေးခွန်း ၅၃ အတွက် အကြောင်းရင်းဖော်ပြချက် စံပုံစံ "-에 기인한 것으로 나타났다" ကို ကျက်မှတ်ပါ။',
      },
      link: '/study/hanup_topik/ch_writing_04',
    },
  ];

  const primaryWeakness = skillEntries[0];
  const secondaryWeakness = skillEntries[1];

  const latestScore = currentUser.scoreHistory[currentUser.scoreHistory.length - 1]?.totalScore || 186;
  const targetScore = 210; // TOPIK 5급 커트라인
  const progressToTarget = Math.min(100, Math.round((latestScore / targetScore) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Profile Banner & Target D-Day Tracker */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
          <div className="relative">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=140&q=80'}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl border-2 border-blue-500 shadow-md object-cover"
            />
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] shadow-sm">
              TOPIK {currentUser.currentTopikLevel}급
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {currentUser.name}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5 shadow-sm">
                <Target className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.targetDDay}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {t.streakDays}
              </span>
            </div>

            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2 pt-1">
              <span>{langMeta.flag} {langMeta.nativeLabel} ({langMeta.code.toUpperCase()})</span>
              <span>•</span>
              <span>{t.targetUniversity}</span>
              <span>•</span>
              <span className="text-blue-700 font-semibold">
                {t.classWeekend}
              </span>
            </p>
          </div>
        </div>

        {/* Right Metric: Target Score Achievement Bar */}
        <div className="w-full lg:w-80 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 relative z-10">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-600">
              {t.targetAchievementRate}
            </span>
            <span className="text-blue-700 font-black">{progressToTarget}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${progressToTarget}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <span>{t.currentScoreEst} {latestScore}점</span>
            <span className="font-semibold text-slate-700">{t.targetGoalLine}</span>
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="w-full mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-sm transition-all hover:scale-105"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>📄 주간 성적 향상 리포트 PDF 발급</span>
          </button>
        </div>
      </div>

      {/* 2. Visualizations Grid: Score Growth (Line) & 6-Skill Weakness Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Score Growth Line Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {t.scoreTrendTitle}
                </h2>
                <p className="text-xs text-slate-500">
                  {t.scoreTrendSubtitle}
                </p>
              </div>
            </div>

            {/* Metric Filter Toggles */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setActiveMetrics((m) => ({ ...m, total: !m.total }))}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                  activeMetrics.total
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                {t.totalScore}
              </button>
              <button
                onClick={() => setActiveMetrics((m) => ({ ...m, reading: !m.reading }))}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                  activeMetrics.reading
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                {t.readingScore}
              </button>
              <button
                onClick={() => setActiveMetrics((m) => ({ ...m, writing: !m.writing }))}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                  activeMetrics.writing
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                {t.writingScore}
              </button>
              <button
                onClick={() => setActiveMetrics((m) => ({ ...m, listening: !m.listening }))}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                  activeMetrics.listening
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                {t.listeningScore}
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentUser.scoreHistory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="weekLabel" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis domain={[30, 230]} stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                    }}
                  />
                  {/* Reference line for 5급 합격 목표선 */}
                  <ReferenceLine
                    y={210}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    label={{ value: t.targetGoalLine, fill: '#d97706', fontSize: 11, position: 'top' }}
                  />

                  {activeMetrics.total && (
                    <Line
                      type="monotone"
                      dataKey="totalScore"
                      stroke="#2563eb"
                      strokeWidth={3.5}
                      dot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                      name={t.totalScore}
                    />
                  )}
                  {activeMetrics.reading && (
                    <Line
                      type="monotone"
                      dataKey="readingScore"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#10b981' }}
                      name={t.readingScore}
                    />
                  )}
                  {activeMetrics.writing && (
                    <Line
                      type="monotone"
                      dataKey="writingScore"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#f59e0b' }}
                      name={t.writingScore}
                    />
                  )}
                  {activeMetrics.listening && (
                    <Line
                      type="monotone"
                      dataKey="listeningScore"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#8b5cf6' }}
                      name={t.listeningScore}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">차트 로딩 중...</div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>💡 주차별 꾸준한 54번 AI 첨삭 피드백 반영으로 쓰기 영역 점수가 빠르게 상승하고 있습니다.</span>
          </div>
        </div>

        {/* Right: 6-Skill Radar Chart & Urgent Weakness Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {t.radarChartTitle}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {t.radarChartSubtitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-64 w-full my-2">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="70%">
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={11} fontWeight={600} />
                    <PolarRadiusAxis domain={[0, 100]} stroke="#cbd5e1" fontSize={10} />
                    <Radar
                      name={t.mySkillScore}
                      dataKey="score"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="#8b5cf6"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">차트 로딩 중...</div>
              )}
            </div>
          </div>

          {/* Urgent Weakness Prescription Box */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span className="font-extrabold text-xs text-amber-950">
                  {t.urgentPrescription}: {primaryWeakness.name} ({primaryWeakness.val}점)
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                {t.intensiveTraining}
              </span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              {primaryWeakness.advice[lang] || primaryWeakness.advice.ko}
            </p>
            <div className="pt-1 flex items-center justify-end">
              <Link
                href={primaryWeakness.link}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-950 hover:text-amber-800 underline underline-offset-2"
              >
                <span>{t.solveClinicNow}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Multi-Series Progress Bars & Quick Study Jump */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>{t.seriesProgressHeader}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.seriesProgressSub}
            </p>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {t.chaptersCompleted}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_SERIES.map((s) => {
            const progress = currentUser.seriesProgress[s.seriesId] || 0;
            return (
              <div
                key={s.seriesId}
                className="p-5 rounded-2xl border border-slate-200/70 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-xs"
                      style={{ backgroundColor: s.accentColor }}
                    >
                      {s.badgeText}
                    </span>
                    <span className="text-xs font-black" style={{ color: s.accentColor }}>
                      {progress}%
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-2">{s.titleKo}</h3>
                  <p className="text-[11px] text-slate-500">{lang === 'zh' ? s.titleZh : s.titleKo}</p>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${progress}%`, backgroundColor: s.accentColor }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">총 {s.chaptersCount}강</span>
                  <Link
                    href={`/study/${s.seriesId}/ch_writing_04`}
                    className="font-bold inline-flex items-center gap-1 hover:underline text-blue-600"
                  >
                    <span>{t.continueStudy}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Widgets: Saved Vocabs & Daily Recommended Study Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Saved Vocab Bookmark Widget (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{t.savedVocabTitle}</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">총 {savedVocabs.length}개 저장됨</span>
          </div>

          <div className="space-y-2">
            {savedVocabs.length > 0 ? (
              savedVocabs.map((word, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>{word}</span>
                  </div>
                  <Link
                    href="/study/hanup_topik/ch_writing_04"
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    예문 확인 →
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">저장된 어휘가 없습니다.</div>
            )}
          </div>
        </div>

        {/* Daily Study Action Card (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30 inline-flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>{t.todayPrescription}</span>
            </span>
            <h3 className="text-xl font-black">
              54번 논술: "AI 발전과 윤리적 과제" 700자 실전 쓰기
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              왕웨이님의 지난 작문에서 지적된 <strong>'선결 과제'</strong> 및 <strong>'비약적 발전'</strong> 고급 어휘를 활용하여 본문 분량을 650자 이상으로 완성해 보세요.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/study/hanup_topik/ch_writing_04"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.enterStudyViewer}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/clinic"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-xs border border-white/20 transition-colors"
            >
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              <span>{t.daily3Title}</span>
            </Link>
          </div>
        </div>
      </div>

      <GrowthReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        student={currentUser}
        latestSubmission={submissions[0]}
      />
    </div>
  );
}
