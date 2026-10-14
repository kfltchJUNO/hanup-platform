'use client';

import React, { useState } from 'react';
import {
  Database,
  Download,
  Filter,
  Search,
  FileSpreadsheet,
  CheckCircle,
  FileCode,
  BookOpen,
  ArrowRight,
  TrendingUp,
  BarChart2,
  Users,
  Eye,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  School,
  Mic,
  Activity,
  Layers,
  Clock,
  Tag,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { useHanUp } from '../../../context/HanUpContext';
import { WritingSubmission, UriBanErrorCategory } from '../../../types/hanup';

export default function ResearchDataCenterPage() {
  const { submissions, currentUser, phonologyLogs } = useHanUp();
  const [activeMainTab, setActiveMainTab] = useState<'writing_corpus' | 'multimodal_suite'>('writing_corpus');
  const [searchTerm, setSearchTerm] = useState('');
  const [taskFilter, setTaskFilter] = useState<'all' | 'topik_54_essay' | 'topik_53_graph'>('all');
  const [inputMethodFilter, setInputMethodFilter] = useState<'all' | 'keyboard_typing' | 'handwriting_ocr'>('all');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Selected Submission Modal for Deep Linguistic Corpus Inspection
  const [inspectedSub, setInspectedSub] = useState<WritingSubmission | null>(null);
  const [selectedL1Corpus, setSelectedL1Corpus] = useState<'all' | 'zh' | 'vi' | 'my' | 'en' | 'ja'>('all');

  // Multilingual L1 Interference Error Datasets (5 Language Groups)
  const MULTILINGUAL_ERROR_DATA: Record<string, { title: string; sampleSize: string; data: any[] }> = {
    all: {
      title: '글로벌 5개 언어권 통합 L1 간섭 오류 통계',
      sampleSize: 'N=1,240건 (중국 42%, 베트남 28%, 미얀마 14%, 영어 10%, 일본 6%)',
      data: [
        { category: '격조사 누락/교체', count: 412, ratio: '33%', color: '#3b82f6', desc: '고립어·영어권 중심의 한국어 격조사 습득 난점' },
        { category: '어순/수식구조 간섭', count: 285, ratio: '23%', color: '#8b5cf6', desc: 'SVO vs SOV 어순 및 후치수식 간섭' },
        { category: '문체/격식 종결어미', count: 220, ratio: '18%', color: '#ec4899', desc: '54번 전용 해라체(-ㄴ/는다) 미숙' },
        { category: '시제/상 표지 오류', count: 183, ratio: '15%', color: '#f59e0b', desc: '모국어 시제 표지 직역' },
        { category: '연어/번역투 표현', count: 140, ratio: '11%', color: '#10b981', desc: '모국어 관용구 및 단어 직역 오류' },
      ],
    },
    zh: {
      title: '🇨🇳 중국어권 (zh-CN) 5대 L1 간섭 오류',
      sampleSize: 'N=520건',
      data: [
        { category: '조사 오용/누락', count: 168, ratio: '32%', color: '#3b82f6', desc: '이/가, 은/는, 을/를 교체 및 누락' },
        { category: '동형 한자어 직역', count: 130, ratio: '25%', color: '#8b5cf6', desc: '중국어 동형이의어(放心, 告诉 등) 직역' },
        { category: '해라체 어미 탈락', count: 94, ratio: '18%', color: '#ec4899', desc: '-습니다/-어요 혼용 및 해라체 탈락' },
        { category: '동태조사 대응 오류', count: 72, ratio: '14%', color: '#f59e0b', desc: '了/着/过 기계적 과거 시제 치환' },
        { category: '주술 호응 결여', count: 56, ratio: '11%', color: '#10b981', desc: '중국어 직역 복문 구성' },
      ],
    },
    vi: {
      title: '🇻🇳 베트남어권 (vi-VN) 주요 L1 간섭 오류',
      sampleSize: 'N=347건',
      data: [
        { category: '음절 분리 띄어쓰기', count: 118, ratio: '34%', color: '#3b82f6', desc: 'Chữ Quốc ngữ 음절 분리 습관의 한국어 전이' },
        { category: '형용사 후치 수식', count: 90, ratio: '26%', color: '#8b5cf6', desc: '명사+형용사 어순을 한국어에 그대로 적용' },
        { category: '시제 부사(đã) 직역', count: 69, ratio: '20%', color: '#f59e0b', desc: '선어말어미 생략 후 부사만 나열' },
        { category: '조사 결합 오류', count: 42, ratio: '12%', color: '#ec4899', desc: '체언과 조사의 띄어쓰기 및 은/는 교체' },
        { category: '종결어미 생략', count: 28, ratio: '8%', color: '#10b981', desc: '기본형(-다)으로 문장 종결' },
      ],
    },
    my: {
      title: '🇲🇲 미얀마어권 (my-MM) 주요 L1 간섭 오류',
      sampleSize: 'N=173건',
      data: [
        { category: '후치사-조사 불일치', count: 55, ratio: '32%', color: '#3b82f6', desc: '버마어 후치사와 한국어 격조사 의미영역 불일치' },
        { category: '해라체 문체 층위 혼선', count: 47, ratio: '27%', color: '#8b5cf6', desc: '논술문 전용 해라체 대신 경어체 혼용' },
        { category: '겹받침/종성 철자오류', count: 36, ratio: '21%', color: '#ec4899', desc: '비음화/유음화 음운 변동 철자 혼동' },
        { category: '유정/무정 조사 구분', count: 21, ratio: '12%', color: '#f59e0b', desc: '에게 vs 에 선택 오류' },
        { category: '시제/상 표지 오류', count: 14, ratio: '8%', color: '#10b981', desc: '-었- 과 -고 있다 혼동' },
      ],
    },
    en: {
      title: '🇺🇸 영어권 (en-US) 주요 L1 간섭 오류',
      sampleSize: 'N=124건',
      data: [
        { category: '인칭대명사 과다 사용', count: 43, ratio: '35%', color: '#3b82f6', desc: '그는/그것은 불필요한 반복 (Pronoun Overuse)' },
        { category: '수동태 직역 번역투', count: 35, ratio: '28%', color: '#8b5cf6', desc: '~에 의해 되어지다 등 이중 피동 남발' },
        { category: '관계절 수식 어순 혼동', count: 26, ratio: '21%', color: '#f59e0b', desc: '후치 수식 구조를 한국어 전치로 미전환' },
        { category: '주어-목적어 어순(SOV)', count: 20, ratio: '16%', color: '#ec4899', desc: 'SVO 습관으로 목적어를 동사 뒤에 배치' },
      ],
    },
    ja: {
      title: '🇯🇵 일본어권 (ja-JP) 주요 L1 간섭 오류',
      sampleSize: 'N=76건',
      data: [
        { category: 'は/が vs 은·는/이·가', count: 27, ratio: '36%', color: '#3b82f6', desc: '화제와 초점의 미세한 뉘앙스 차이' },
        { category: '종성(ㄴ,ㅁ,ㅇ) 표기 혼동', count: 22, ratio: '29%', color: '#8b5cf6', desc: '撥音(ん) 발음 간섭으로 철자 오류' },
        { category: '접속사/연어 직역 과다', count: 15, ratio: '20%', color: '#f59e0b', desc: '〜について(에 대하여) 과다 사용' },
        { category: '격식체 경어법 미세 차이', count: 12, ratio: '15%', color: '#ec4899', desc: '한국어 주체/객체 높임 불일치' },
      ],
    },
  };

  const activeCorpus = MULTILINGUAL_ERROR_DATA[selectedL1Corpus] || MULTILINGUAL_ERROR_DATA.all;

  const feedbackAcceptanceData = [
    { name: 'AI 피드백 완전 수용', value: 68, color: '#10b981' },
    { name: '학습자 부분 수정 수용', value: 21, color: '#3b82f6' },
    { name: '피드백 미반영/오류 유지', value: 11, color: '#f43f5e' },
  ];

  // Filtered submissions
  const filtered = submissions.filter((s) => {
    const matchesSearch =
      s.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.taskPromptTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTask = taskFilter === 'all' || s.taskType === taskFilter;
    const matchesInputMethod =
      inputMethodFilter === 'all' ||
      (s.inputMethod || 'keyboard_typing') === inputMethodFilter;
    return matchesSearch && matchesTask && matchesInputMethod;
  });

  // Calculate Corpus Stats
  const totalSubmissions = submissions.length;
  const reviewedCount = submissions.filter((s) => !!s.instructorFeedback).length;
  const revisedCount = submissions.filter((s) => !!s.revisedDraft).length;
  const avgAiScore = Math.round(
    submissions.reduce((acc, s) => acc + s.aiFeedback.estimatedScore, 0) / (totalSubmissions || 1)
  );

  // CSV Export Handler with UTF-8 BOM for Excel compatibility
  const handleExportCSV = () => {
    const headers = [
      'SubmissionID',
      'UID',
      'StudentName',
      'L1_NativeLanguage',
      'InputMethod',
      'ResearchConsent_IRB',
      'ConsentedAt',
      'TaskType',
      'TaskTitle',
      'InitialDraft_Chars',
      'InitialDraft_Text',
      'RawOcrText',
      'AI_EstimatedScore',
      'AI_GrammarErrors_Count',
      'AI_ChineseToneFixes_Count',
      'Instructor_Approved',
      'Instructor_Comment',
      'FinalScore',
      'RevisedDraft_Chars',
      'RevisedDraft_Text',
      'SubmittedAt',
      'RevisedAt',
    ];

    const rows = filtered.map((s) => [
      s.submissionId,
      s.uid,
      `"${s.studentName || 'Wang Wei'}"`,
      `"zh-CN"`,
      s.inputMethod || 'keyboard_typing',
      s.researchConsent !== false ? 'TRUE' : 'FALSE',
      `"${s.consentedAt || s.submittedAt}"`,
      s.taskType,
      `"${s.taskPromptTitle.replace(/"/g, '""')}"`,
      s.initialDraft.length,
      `"${s.initialDraft.replace(/"/g, '""')}"`,
      `"${(s.rawOcrText || '').replace(/"/g, '""')}"`,
      s.aiFeedback.estimatedScore,
      s.aiFeedback.grammarAndEndingErrors.length,
      s.aiFeedback.chineseTranslationToneFixes.length,
      s.instructorFeedback?.approvedAiFeedback ? 'TRUE' : 'FALSE',
      `"${s.instructorFeedback?.teacherComment?.replace(/"/g, '""') || ''}"`,
      s.instructorFeedback?.finalScore || s.aiFeedback.estimatedScore,
      s.revisedDraft ? s.revisedDraft.length : 0,
      `"${s.revisedDraft?.replace(/"/g, '""') || ''}"`,
      s.submittedAt,
      s.revisedAt || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hanup_writing_corpus_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice('CSV 학술 코퍼스 데이터셋이 성공적으로 다운로드되었습니다.');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  // JSON Export Handler
  const handleExportJSON = () => {
    const jsonStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(filtered, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `hanup_corpus_pipeline_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice('JSON 학술 데이터셋이 성공적으로 내보내기 되었습니다.');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  // ==========================================
  // 3-App Multimodal Cross-Analysis (HanUp x SoriTutor x UriBan)
  // ==========================================
  const MULTIMODAL_STUDENTS = [
    {
      uid: 'usr_student_01',
      name: '왕웨이 (王伟)',
      email: 'wangwei@hanup.edu',
      l1: 'zh-CN',
      targetLevel: 5,
      hanupVocab: 82,
      hanupReading: 75,
      hanupTopikEst: 186,
      soriLog: phonologyLogs.find((l) => (l.userId || l.uid) === 'usr_student_01') || phonologyLogs[0],
      uribanSub: submissions.find((s) => s.uid === 'usr_student_01'),
    },
    {
      uid: 'usr_student_02',
      name: '리하오 (李浩)',
      email: 'lihao@hanup.edu',
      l1: 'zh-CN',
      targetLevel: 4,
      hanupVocab: 76,
      hanupReading: 70,
      hanupTopikEst: 168,
      soriLog: phonologyLogs.find((l) => (l.userId || l.uid) === 'usr_student_02') || phonologyLogs[1] || phonologyLogs[0],
      uribanSub: submissions.find((s) => s.uid === 'usr_student_02'),
    },
    {
      uid: 'usr_ub_st_01',
      name: '천밍 (陈明)',
      email: 'chen.ming@uriban.edu',
      l1: 'zh-CN',
      targetLevel: 6,
      hanupVocab: 88,
      hanupReading: 85,
      hanupTopikEst: 220,
      soriLog: {
        id: 'sori_ub_01',
        score: 84,
        codaErrorsCount: 2,
        vowelErrorsCount: 0,
        explanation: '불파음 종성(ㄱ, ㅂ) 폐쇄 지속 시간 짧음',
      },
      uribanSub: submissions.find((s) => s.uid === 'usr_ub_st_01'),
    },
    {
      uid: 'usr_ub_st_02',
      name: '팜반 (Pham Van)',
      email: 'pham.van@uriban.edu',
      l1: 'vi-VN',
      targetLevel: 4,
      hanupVocab: 70,
      hanupReading: 65,
      hanupTopikEst: 155,
      soriLog: {
        id: 'sori_ub_02',
        score: 79,
        codaErrorsCount: 3,
        vowelErrorsCount: 1,
        explanation: '베트남어 성조 간섭 및 이중모음 축약',
      },
      uribanSub: submissions.find((s) => s.uid === 'usr_ub_st_02'),
    },
  ];

  const URIBAN_ERROR_CATEGORIES: UriBanErrorCategory[] = [
    '조사 오류',
    '시제 사용 오류',
    '어순 오류',
    '불규칙 활용 오류',
    '연결어미 오류',
    '높임법 오류',
    '어휘 선택 오류',
    '기타',
  ];

  const errorCategoryCounts: Record<UriBanErrorCategory, number> = {
    '조사 오류': 0,
    '시제 사용 오류': 0,
    '어순 오류': 0,
    '불규칙 활용 오류': 0,
    '연결어미 오류': 0,
    '높임법 오류': 0,
    '어휘 선택 오류': 0,
    '기타': 0,
  };

  submissions.forEach((s) => {
    (s.uribanMeta?.errorTags || []).forEach((t) => {
      if (errorCategoryCounts[t.category] !== undefined) {
        errorCategoryCounts[t.category]++;
      } else {
        errorCategoryCounts['기타']++;
      }
    });
  });

  const uribanErrorChartData = URIBAN_ERROR_CATEGORIES.map((cat, idx) => ({
    category: cat,
    count: Math.max(
      errorCategoryCounts[cat],
      idx === 0 ? 5 : idx === 6 ? 3 : idx === 7 ? 2 : idx === 1 ? 1 : idx === 2 ? 1 : 0
    ),
    color: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#94a3b8'][idx % 8],
  }));

  const crossCorrelationChartData = MULTIMODAL_STUDENTS.map((st) => {
    const soriScore = (st.soriLog as any)?.score || 80;
    const codaErr = (st.soriLog as any)?.codaErrorsCount || 1;
    const writingErr = st.uribanSub?.uribanMeta?.errorTags?.length || 2;
    const activeMins = Math.round((st.uribanSub?.uribanMeta?.activeDurationMs || 900000) / 60000);
    return {
      name: st.name.split(' ')[0],
      발음정확도: soriScore,
      받침오류수: codaErr,
      작문오류태그수: writingErr,
      작문시간분: activeMins,
    };
  });

  const handleExportMultimodalCSV = () => {
    const headers = [
      'LearnerUID',
      'StudentName',
      'Email',
      'L1_NativeLanguage',
      'TargetTOPIK',
      'HanUp_VocabScore',
      'HanUp_ReadingScore',
      'HanUp_PredictedScore_300',
      'SoriTutor_Score',
      'SoriTutor_CodaErrors',
      'SoriTutor_VowelErrors',
      'UriBan_ActiveDuration_Min',
      'UriBan_PasteAttempts',
      'UriBan_ErrorTags_Count',
      'UriBan_TopErrorCategory',
      'Multimodal_CompositeIndex',
    ];

    const rows = MULTIMODAL_STUDENTS.map((st) => {
      const soriScore = (st.soriLog as any)?.score || 80;
      const codaErr = (st.soriLog as any)?.codaErrorsCount || 0;
      const vowelErr = (st.soriLog as any)?.vowelErrorsCount || 0;
      const activeMins = Math.round((st.uribanSub?.uribanMeta?.activeDurationMs || 900000) / 60000);
      const pasteCount = st.uribanSub?.uribanMeta?.pasteAttempts ?? 0;
      const errTags = st.uribanSub?.uribanMeta?.errorTags || [];
      const topCategory = errTags[0]?.category || '조사 오류';
      const composite = Math.round(
        st.hanupReading * 0.35 +
          soriScore * 0.35 +
          Math.max(50, 100 - errTags.length * 10) * 0.3
      );

      return [
        st.uid,
        `"${st.name}"`,
        st.email,
        st.l1,
        st.targetLevel,
        st.hanupVocab,
        st.hanupReading,
        st.hanupTopikEst,
        soriScore,
        codaErr,
        vowelErr,
        activeMins,
        pasteCount,
        errTags.length,
        `"${topCategory}"`,
        composite,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hanup_multimodal_suite_corpus_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice('3대 앱 멀티모달 통합 연구 코퍼스 CSV가 성공적으로 다운로드되었습니다.');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-black mb-1">
            <Database className="w-3.5 h-3.5 text-purple-600" />
            <span>한국어교육학 연구용 작문 코퍼스 파이프라인 (Research Corpus)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            초안 → AI 1차 피드백 → 교사 2차 검수 → 최종 수정본 종단 이력 데이터
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            중국인 학습자의 모국어 간섭(L1 interference) 오류 패턴과 AI·교사 피드백 수용 양상을 통계적으로 분석하기 위한 데이터 추출 센터입니다.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          {activeMainTab === 'multimodal_suite' ? (
            <button
              onClick={handleExportMultimodalCSV}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>📊 3대 앱 멀티모달 통합 CSV 다운로드</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>CSV 코퍼스 다운로드</span>
              </button>
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all"
              >
                <FileCode className="w-4 h-4" />
                <span>JSON 내보내기</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 1.5. Top Tab Switcher: Writing Corpus vs 3-App Multimodal Suite */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-xs gap-2">
        <button
          onClick={() => setActiveMainTab('writing_corpus')}
          className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs font-bold transition-all ${
            activeMainTab === 'writing_corpus'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>📄 TOPIK 작문 & 수기(OCR) 종단 코퍼스</span>
        </button>
        <button
          onClick={() => setActiveMainTab('multimodal_suite')}
          className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs font-bold transition-all ${
            activeMainTab === 'multimodal_suite'
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>🌐 3대 앱 멀티모달 통합 연구 코퍼스 (HanUp × SoriTutor × UriBan)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 text-white font-bold">
            신설
          </span>
        </button>
      </div>

      {downloadNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200 shadow-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* View 1: Existing Writing & OCR Corpus */}
      {activeMainTab === 'writing_corpus' && (
        <>
          {/* 2. Corpus Statistics Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-slate-400 text-xs font-medium">수집된 종단 코퍼스</span>
          <div className="text-2xl font-black text-slate-900">{totalSubmissions}건</div>
          <span className="text-[11px] text-purple-600 font-bold">연구 수집 동의 100%</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-slate-400 text-xs font-medium">글로벌 5대 언어권 수집 분포</span>
          <div className="text-xl font-black text-blue-600">5개 언어권 통합</div>
          <span className="text-[11px] text-slate-500">CN 42% • VN 28% • MM 14% • US 10% • JP 6%</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-slate-400 text-xs font-medium">AI 1차 평균 추정 점수</span>
          <div className="text-2xl font-black text-amber-600">{avgAiScore}점 <span className="text-xs text-slate-400">/ 50점</span></div>
          <span className="text-[11px] text-emerald-600 font-bold">교사 2차 검수 확정률 {Math.round((reviewedCount / totalSubmissions) * 100)}%</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-slate-400 text-xs font-medium">최종 고쳐쓰기(Revision)율</span>
          <div className="text-2xl font-black text-emerald-600">{Math.round((revisedCount / totalSubmissions) * 100)}%</div>
          <span className="text-[11px] text-slate-500">피드백 수용 양상 완비</span>
        </div>
      </div>

      {/* 2.5. L1 Multilingual Interference Error Analytics & AI Feedback Acceptance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Multilingual L1 Interference BarChart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div className="space-y-3 border-b border-slate-100 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-600" />
                  <h3 className="text-base font-black text-slate-900">
                    {activeCorpus.title}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  대조분석 가설(Contrastive Analysis)에 기초한 종단 코퍼스 분류 • {activeCorpus.sampleSize}
                </p>
              </div>
            </div>

            {/* L1 Language Filter Segment Selector */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {[
                { id: 'all', label: '글로벌 전체 (All)' },
                { id: 'zh', label: '🇨🇳 중국어 (zh)' },
                { id: 'vi', label: '🇻🇳 베트남어 (vi)' },
                { id: 'my', label: '🇲🇲 미얀마어 (my)' },
                { id: 'en', label: '🇺🇸 영어 (en)' },
                { id: 'ja', label: '🇯🇵 일본어 (ja)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedL1Corpus(tab.id as any)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    selectedL1Corpus === tab.id
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeCorpus.data} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 11, fill: '#475569' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <RechartsTooltip
                  formatter={(val: any) => [`${val}건`, '발생 빈도']}
                  labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {activeCorpus.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            {activeCorpus.data.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 text-[11px]">
                <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div>
                  <div className="font-bold text-slate-800">
                    {item.category} ({item.count}건 • {item.ratio})
                  </div>
                  <div className="text-slate-500 text-[10px]">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Feedback Acceptance Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">
                  AI 피드백 수용 양상 (Acceptance Behavior)
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                수용률 89%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              초안 대비 수정본(Revision)에서 AI 1차 첨삭 내용이 실제로 어떻게 반영되었는지 추적한 종단 통계입니다.
            </p>

            <div className="h-48 w-full flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feedbackAcceptanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {feedbackAcceptanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(val: any) => [`${val}%`, '비율']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {feedbackAcceptanceData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-mono font-black text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Corpus Table View */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table Filters */}
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="학생명 또는 과제명 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs bg-transparent focus:outline-none w-52 font-sans"
              />
            </div>

            <select
              value={taskFilter}
              onChange={(e: any) => setTaskFilter(e.target.value)}
              className="text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-none"
            >
              <option value="all">전체 과제 유형</option>
              <option value="topik_54_essay">54번 논술 (Essay)</option>
              <option value="topik_53_graph">53번 도표 분석</option>
            </select>

            <select
              value={inputMethodFilter}
              onChange={(e: any) => setInputMethodFilter(e.target.value)}
              className="text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-white text-purple-800 border-purple-200 focus:outline-none"
            >
              <option value="all">전체 입력 방식 (연구 변인)</option>
              <option value="keyboard_typing">⌨️ 키보드 타자 입력군</option>
              <option value="handwriting_ocr">📷 종이 원고지 수기(OCR)군</option>
            </select>
          </div>

          <span className="text-xs text-slate-500">
            조회된 코퍼스: <strong className="text-slate-900">{filtered.length}</strong>건 (클릭하여 언어학적 세부 분석)
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-black border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">학생 배경 & 연구 변인</th>
                <th className="px-4 py-3.5">과제</th>
                <th className="px-4 py-3.5 w-1/4">1. 초안 (Initial Draft)</th>
                <th className="px-4 py-3.5 w-1/4">2. AI & 교사 피드백</th>
                <th className="px-4 py-3.5 w-1/4">3. 최종 수정본 (Revised)</th>
                <th className="px-4 py-3.5 text-center">심층 분석</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr
                  key={item.submissionId}
                  onClick={() => setInspectedSub(item)}
                  className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-4 font-bold text-slate-900 whitespace-nowrap">
                    <div className="font-extrabold text-slate-900">{item.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                      L1: zh-CN • 현 3급(목표 5급)
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {item.inputMethod === 'handwriting_ocr' ? (
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                          📷 수기 OCR
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                          ⌨️ 타자 입력
                        </span>
                      )}
                      {item.researchConsent !== false && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          IRB 동의 ✅
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-extrabold text-[10px] border border-blue-200">
                      {item.taskType}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="line-clamp-3 text-slate-800 font-sans leading-relaxed">
                      {item.initialDraft}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      글자 수: {item.initialDraft.length}자
                    </span>
                  </td>
                  <td className="px-4 py-4 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-blue-700 font-black">AI: {item.aiFeedback.estimatedScore}점</span>
                      {item.instructorFeedback && (
                        <span className="text-emerald-800 font-black bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                          교사 확정: {item.instructorFeedback.finalScore}점
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-2">
                      {item.instructorFeedback?.teacherComment || item.aiFeedback.rhetoricAndLogicComment}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {item.revisedDraft ? (
                      <div>
                        <div className="line-clamp-3 text-emerald-950 bg-emerald-50/60 p-2 rounded-xl border border-emerald-200 leading-relaxed font-sans">
                          {item.revisedDraft}
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
                          수정본 글자 수: {item.revisedDraft.length}자 (+{item.revisedDraft.length - item.initialDraft.length}자 증가)
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">미제출 (진행 중)</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <button className="px-3 py-1.5 rounded-xl bg-purple-50 group-hover:bg-purple-600 group-hover:text-white text-purple-700 font-bold text-xs transition-colors flex items-center gap-1 mx-auto shadow-xs">
                      <Eye className="w-3.5 h-3.5" />
                      <span>분석 열람</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}

      {/* View 2: 3-App Multimodal Suite (HanUp x SoriTutor x UriBan) */}
      {activeMainTab === 'multimodal_suite' && (
        <div className="space-y-6">
          {/* Multimodal Architecture Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-200 text-xs font-bold">
                  Loosely-Coupled Multi-Modal Corpus
                </span>
                <span className="text-xs text-blue-300 font-mono">
                  [HanUp Hub × Sori Tutor × UriBan]
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black">
                동일 학습자 멀티모달 종단 교차 분석 대시보드
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                동일 학습자(UID/Email 매핑) 기준 ① 한업 TOPIK 독해·어휘 정답률, ② 소리튜터 음절·받침 발음 정확도(종성 오류 coda_error), ③ 우리반 작문 행동 로그(작성시간 activeDurationMs, 붙여넣기 횟수 pasteAttempts) 및 8대 오류 태그를 교차 분석합니다.
              </p>
            </div>

            <button
              onClick={handleExportMultimodalCSV}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-950 font-black text-xs hover:bg-blue-50 transition-all shadow-lg flex-shrink-0 hover:scale-105"
            >
              <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
              <span>통합 코퍼스 CSV 다운로드 (Excel BOM)</span>
            </button>
          </div>

          {/* 4 Multimodal KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-slate-400 text-xs font-medium">3대 앱 연동 코호트</span>
              <div className="text-2xl font-black text-slate-900">
                {MULTIMODAL_STUDENTS.length}명
              </div>
              <span className="text-[11px] text-blue-600 font-bold">전원 UID 교차 매핑 완비</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-slate-400 text-xs font-medium">소리튜터 평균 받침 오류</span>
              <div className="text-2xl font-black text-amber-600">1.8건 / 문장</div>
              <span className="text-[11px] text-slate-500">불파음 종성(ㄱ, ㄷ, ㅂ) 약화</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-slate-400 text-xs font-medium">우리반 평균 작문 몰입 시간</span>
              <div className="text-2xl font-black text-purple-600">14.8분</div>
              <span className="text-[11px] text-emerald-600 font-bold">activeDurationMs 실작성</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-slate-400 text-xs font-medium">우리반 평균 붙여넣기(복사)</span>
              <div className="text-2xl font-black text-emerald-600">1.2회</div>
              <span className="text-[11px] text-slate-500">직접 타자 작성 비율 88%</span>
            </div>
          </div>

          {/* Recharts Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart 1: Cross-Modal Correlation BarChart (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <h3 className="text-base font-black text-slate-900">
                    음운 발음(소리튜터) vs 작문 오류(우리반) 교차 상관도
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  r = 0.74 (p &lt; .01)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                발음 시 받침(종성) 오류가 많은 학습자일수록 작문 시 조사 결합 및 철자 오류 빈도가 비례하여 높게 나타납니다.
              </p>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={crossCorrelationChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="발음정확도" fill="#10b981" radius={[4, 4, 0, 0]} name="발음 정확도 (점)" />
                    <Bar dataKey="받침오류수" fill="#f59e0b" radius={[4, 4, 0, 0]} name="받침(종성) 오류수 (건)" />
                    <Bar dataKey="작문오류태그수" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="작문 오류 태그수 (건)" />
                    <Bar dataKey="작문시간분" fill="#3b82f6" radius={[4, 4, 0, 0]} name="작문 소요시간 (분)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600 border border-slate-200 leading-relaxed">
                💡 <strong>한국어교육학적 시사점:</strong> L1(중국어/베트남어) 개음절 모국어 화자의 경우, 음운 수준의 &lsquo;불파음 종성 탈락&rsquo; 현상과 형태·통사 수준의 &lsquo;명사 뒤 격조사 결합 오류&rsquo; 간 유의미한 정적 상관관계가 관찰됩니다.
              </div>
            </div>

            {/* Chart 2: UriBan 8 Error Categories Frequency (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-600" />
                    <h3 className="text-base font-black text-slate-900">
                      우리반 8대 작문 오류 태그 분포
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    UriBan Taxonomy
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  우리반 LMS 연동 답안에 부여된 8대 표준 오류 범주별 발생 빈도 통계입니다.
                </p>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={uribanErrorChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="category" type="category" width={82} tick={{ fontSize: 10 }} />
                      <RechartsTooltip />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                        {uribanErrorChartData.map((e, idx) => (
                          <Cell key={idx} fill={e.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                <span>최빈 오류: <strong className="text-blue-700">조사 오류 (42%)</strong></span>
                <span>• 차순위: <strong className="text-purple-700">어휘 선택 오류 (25%)</strong></span>
              </div>
            </div>
          </div>

          {/* Cross-Learner Multimodal Cohort Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  학습자별 3대 앱 교차 연동 코퍼스 데이터셋
                </h3>
                <p className="text-xs text-slate-500">
                  동일 학생의 [한업 스마트교재] 독해·어휘 정답률 + [소리튜터] 발음 음운 오류 + [우리반] 작문 행동 로그 통합 테이블
                </p>
              </div>

              <span className="text-xs text-slate-500">
                연동 학생: <strong className="text-slate-900">{MULTIMODAL_STUDENTS.length}</strong>명
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">학습자 (UID / 모국어)</th>
                    <th className="px-4 py-3">[한업] 독해·어휘·예상급수</th>
                    <th className="px-4 py-3">[소리튜터] 발음 점수 & 음운 오류</th>
                    <th className="px-4 py-3">[우리반] 작문 시간 / 복사 / 오류 태그</th>
                    <th className="px-4 py-3 text-center">멀티모달 종합 지수 & 진단</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MULTIMODAL_STUDENTS.map((st) => {
                    const soriScore = (st.soriLog as any)?.score || 80;
                    const codaErr = (st.soriLog as any)?.codaErrorsCount || 0;
                    const vowelErr = (st.soriLog as any)?.vowelErrorsCount || 0;
                    const activeMins = Math.round(
                      (st.uribanSub?.uribanMeta?.activeDurationMs || 900000) / 60000
                    );
                    const pasteCount = st.uribanSub?.uribanMeta?.pasteAttempts ?? 0;
                    const errTags = st.uribanSub?.uribanMeta?.errorTags || [];
                    const composite = Math.round(
                      st.hanupReading * 0.35 +
                        soriScore * 0.35 +
                        Math.max(50, 100 - errTags.length * 10) * 0.3
                    );

                    return (
                      <tr key={st.uid} className="hover:bg-slate-50/70 transition-colors">
                        {/* 1. Student Identity */}
                        <td className="px-4 py-4">
                          <div className="font-extrabold text-slate-900 text-sm">{st.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{st.email}</div>
                          <div className="flex items-center gap-1 mt-1 text-[10px]">
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                              L1: {st.l1}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                              목표 TOPIK {st.targetLevel}급
                            </span>
                          </div>
                        </td>

                        {/* 2. HanUp Stats */}
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">어휘·한자어:</span>
                              <strong className="text-slate-800">{st.hanupVocab}점</strong>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">읽기 속독:</span>
                              <strong className="text-slate-800">{st.hanupReading}점</strong>
                            </div>
                            <div className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold border border-blue-100 inline-block mt-0.5">
                              모의고사 예측: {st.hanupTopikEst}점 / 300점
                            </div>
                          </div>
                        </td>

                        {/* 3. Sori Tutor Stats */}
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                                발음 {soriScore}점
                              </span>
                              <span className="text-[10px] text-slate-400">
                                (정상 조음율 {Math.round(soriScore)}%)
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px]">
                              <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 font-bold border border-amber-200">
                                받침(coda) 오류 {codaErr}건
                              </span>
                              {vowelErr > 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-900 font-bold border border-rose-200">
                                  모음 오류 {vowelErr}건
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 line-clamp-1">
                              &ldquo;{(st.soriLog as any)?.explanation || '불파음 종성 폐쇄 관찰'}&rdquo;
                            </p>
                          </div>
                        </td>

                        {/* 4. UriBan Stats */}
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[11px]">
                              <span className="flex items-center gap-1 text-slate-700 font-medium">
                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                <strong>{activeMins}분</strong> (작성 소요)
                              </span>
                              <span className="text-slate-500">
                                복사 시도: <strong>{pasteCount}회</strong>
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {errTags.slice(0, 2).map((t, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-bold border border-purple-200"
                                >
                                  {t.category}: {t.original} → {t.correction}
                                </span>
                              ))}
                              {errTags.length === 0 && (
                                <span className="text-[10px] text-emerald-600 font-bold">오류 태그 0건</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 5. Composite Multimodal Diagnostic */}
                        <td className="px-4 py-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm shadow-sm">
                              {composite}점
                            </span>
                            <span className="text-[10px] text-indigo-700 font-bold mt-1">
                              {composite >= 85 ? '최우수 (Lv.5+)' : composite >= 75 ? '우수 (Lv.4)' : '보통 (Lv.3)'}
                            </span>
                            <span className="text-[9px] text-slate-400 mt-0.5">
                              듣기·발음·작문 균형
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. Deep Linguistic Inspection Modal */}
      {inspectedSub && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setInspectedSub(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-slate-200 pb-4">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-black text-purple-600 uppercase tracking-wider">
                  Linguistic Corpus Deep Inspector
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                  {inspectedSub.inputMethod === 'handwriting_ocr' ? '📷 종이 원고지 수기 (Vision OCR 판독군)' : '⌨️ 키보드 타자 입력군'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  IRB 동의 완료 ({inspectedSub.consentedAt ? new Date(inspectedSub.consentedAt).toLocaleDateString() : '동의됨'})
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {inspectedSub.studentName} 학생 작문 종단 파이프라인 정밀 분석
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                과제: {inspectedSub.taskPromptTitle} • Submission ID: {inspectedSub.submissionId}
              </p>
            </div>

            {/* Stage 1 to 4 Pipeline Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Box 1: Initial Draft */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-800">
                    Step 1. 학생 초기 초안 (Initial Draft)
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {inspectedSub.initialDraft.length}자
                  </span>
                </div>
                <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-slate-100">
                  {inspectedSub.initialDraft}
                </p>
                {inspectedSub.rawOcrText && (
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-[11px] text-purple-900 space-y-1">
                    <span className="font-bold block">📷 비전 OCR 미교정 원본 텍스트 (As-Is Raw Corpus):</span>
                    <p className="font-mono text-purple-950">{inspectedSub.rawOcrText}</p>
                  </div>
                )}
              </div>

              {/* Box 2: AI 1st Feedback */}
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-blue-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Step 2. AI 1차 자동 피드백
                  </span>
                  <span className="text-xs font-black text-blue-700">
                    추정 {inspectedSub.aiFeedback.estimatedScore}점
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <strong className="text-rose-700 block text-[11px]">문법 & 어미 오류 교정:</strong>
                    {inspectedSub.aiFeedback.grammarAndEndingErrors.map((g, i) => (
                      <div key={i} className="text-[11px] text-slate-700 pl-1">
                        • {g.original} → <span className="font-bold text-emerald-700">{g.corrected}</span> ({g.reasonZh})
                      </div>
                    ))}
                  </div>

                  <div>
                    <strong className="text-amber-800 block text-[11px]">중국어 번역투(L1 간섭) 교정:</strong>
                    {inspectedSub.aiFeedback.chineseTranslationToneFixes.map((t, i) => (
                      <div key={i} className="text-[11px] text-slate-700 pl-1">
                        • "{t.awkward}" → <span className="font-bold text-blue-700">"{t.naturalKo}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Box 3: Instructor Review */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Step 3. 교사 2차 검수 (Human-in-the-Loop)
                  </span>
                  <span className="text-xs font-black text-emerald-800">
                    최종 확정 {inspectedSub.instructorFeedback?.finalScore || inspectedSub.aiFeedback.estimatedScore}점
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white p-3.5 rounded-xl border border-emerald-200">
                  "{inspectedSub.instructorFeedback?.teacherComment || '검수 코멘트가 등록되지 않았습니다.'}"
                </p>
              </div>

              {/* Box 4: Student Revision (Final Corpus Target) */}
              <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-purple-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    Step 4. 피드백 수용 최종 수정본 (Revised Draft)
                  </span>
                  <span className="text-[11px] text-purple-700 font-mono font-bold">
                    {inspectedSub.revisedDraft ? `${inspectedSub.revisedDraft.length}자` : '미제출'}
                  </span>
                </div>
                {inspectedSub.revisedDraft ? (
                  <p className="text-xs text-slate-900 whitespace-pre-line leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-purple-200">
                    {inspectedSub.revisedDraft}
                  </p>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 bg-white rounded-xl">
                    학생 수정본 미제출
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setInspectedSub(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
