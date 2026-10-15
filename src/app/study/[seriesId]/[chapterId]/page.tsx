'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  Headphones,
  PenTool,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileCheck,
  Languages,
  Send,
  Save,
  Check,
  Bookmark,
  Volume2,
  VolumeX,
  FastForward,
  Award,
  Maximize2,
  Minimize2,
  QrCode,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Clock,
  Grid,
  FileText,
  RefreshCw,
  Camera,
  UploadCloud,
  ScanLine,
  Mic,
  Bell,
  Lock,
  Calendar,
} from 'lucide-react';
import { useHanUp } from '../../../../context/HanUpContext';
import { VocabAnnotation, WritingSubmission } from '../../../../types/hanup';
import {
  SUPPORTED_LANGUAGES,
  UI_TRANSLATIONS,
  L1_PROFILES,
} from '../../../../lib/i18n';
import { MOCK_SERIES } from '../../../../mock/mockData';
import { SoriTutorModal } from '../../../../components/SoriTutorModal';

export default function SmartStudyViewerPage() {
  const params = useParams();
  const seriesId = (params.seriesId as string) || 'hanup_topik_master';
  const chapterId = (params.chapterId as string) || 'ch_writing_04';

  const {
    authoringBlocks,
    itemBank,
    submissions,
    addSubmission,
    submitStudentRevision,
    currentUser,
    lang,
    savedVocabs,
    toggleSaveVocab,
    isVocabSaved,
    getDailyQuotaRemaining,
    consumeAiGradeQuota,
    consumeOcrQuota,
    openPaywallModal,
    openSurveyModal,
    enrollments,
    checkChapterAccess,
    markChapterCompleted,
    openNotificationModal,
    notificationSettings,
  } = useHanUp();

  const currentSeries =
    MOCK_SERIES.find((s) => s.seriesId === seriesId) || MOCK_SERIES[2];

  // Prep Curriculum Schedule (2-week drip: Day 1, 3, 7, 10)
  const prepChapterList = [
    { id: 'ch_prep_01', num: 1, title: '제1회: 하루 일과와 약속 정하기', day: 1 },
    { id: 'ch_prep_02', num: 2, title: '제2회: 쇼핑·교환과 건강 챙기기', day: 3 },
    { id: 'ch_prep_03', num: 3, title: '제3회: 교통·길 찾기와 여행 계획', day: 7 },
    { id: 'ch_prep_04', num: 4, title: '제4회: 일상 총정리 & 모의평가', day: 10 },
  ];

  const chapterIndex =
    seriesId === 'hanup_topik_prep' || chapterId.startsWith('ch_prep_')
      ? Math.max(0, prepChapterList.findIndex((c) => c.id === chapterId))
      : 0;

  const accessStatus = checkChapterAccess(seriesId, chapterId, chapterIndex);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'concept' | 'listening' | 'writing'>('concept');

  // Find block data
  const currentBlock =
    authoringBlocks.find((b) => b.chapterId === chapterId || b.blockId === chapterId) ||
    authoringBlocks.find((b) => b.seriesId === seriesId) ||
    authoringBlocks[0];

  // Prep Questions Filtering
  const readingQuestions = itemBank.filter((item) =>
    chapterId === 'ch_prep_01'
      ? item.itemId === 'item_prep_01_read_01' || item.itemId === 'item_prep_01_read_02'
      : chapterId === 'ch_prep_02'
      ? item.itemId === 'item_prep_02_read_01' || item.itemId === 'item_prep_02_read_02'
      : false
  );

  const listeningQuestions = itemBank.filter((item) =>
    chapterId === 'ch_prep_01'
      ? item.itemId === 'item_prep_01_listen_01' || item.itemId === 'item_prep_01_listen_02'
      : chapterId === 'ch_prep_02'
      ? item.itemId === 'item_prep_02_listen_01' || item.itemId === 'item_prep_02_listen_02'
      : false
  );

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showAnswerFeedback, setShowAnswerFeedback] = useState<Record<string, boolean>>({});

  // Mini Writing Task State
  const [miniWritingInput, setMiniWritingInput] = useState<string>('');
  const [miniWritingChecked, setMiniWritingChecked] = useState<boolean>(false);
  const [miniWritingFeedback, setMiniWritingFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [hasCompletedChapter2, setHasCompletedChapter2] = useState<boolean>(false);

  // Tab 1: Vocab Popover Modal State
  const [activeVocab, setActiveVocab] = useState<VocabAnnotation | null>(null);
  const [showFullZhTranslation, setShowFullZhTranslation] = useState<boolean>(true);

  // Tab 2: Audio & Dictation state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.8 | 1.0 | 1.2>(1.0);
  const [dictationInputs, setDictationInputs] = useState<Record<number, string>>({});
  const [dictationResultChecked, setDictationResultChecked] = useState<boolean>(false);
  const [showDictationHint, setShowDictationHint] = useState<boolean>(false);

  // Tab 3: Writing prompt state
  const [taskMode, setTaskMode] = useState<'topik_54' | 'topik_53'>('topik_54');

  // Real Mock Exam Timer (50 min countdown for TOPIK writing)
  const [timerSeconds, setTimerSeconds] = useState<number>(50 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [editorMode, setEditorMode] = useState<'normal' | 'grid'>('normal');

  // OCR Handwriting Scan State
  const [isOcrScanning, setIsOcrScanning] = useState<boolean>(false);
  const [ocrConfidence, setOcrConfidence] = useState<number | null>(null);
  const [ocrNotice, setOcrNotice] = useState<string | null>(null);

  // Research Corpus Variables (Typing vs OCR & IRB Consent)
  const [inputMethod, setInputMethod] = useState<'keyboard_typing' | 'handwriting_ocr'>('keyboard_typing');
  const [rawOcrText, setRawOcrText] = useState<string | undefined>(undefined);
  const [researchConsent, setResearchConsent] = useState<boolean>(true);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Sori Tutor AI Pronunciation Integration
  const [isSoriModalOpen, setIsSoriModalOpen] = useState<boolean>(false);
  const defaultSoriSentence =
    chapterId === 'ch_prep_01'
      ? '급한 일이 생겨서요'
      : chapterId === 'ch_prep_02'
      ? '길이가 좀 짧아서요'
      : '현대 사회에서 인공지능 기술은 산업 전반에서 생산성을 비약적으로 향상시키고 있다.';
  const [soriTargetSentence, setSoriTargetSentence] = useState<string>(defaultSoriSentence);

  const openSoriTutor = (sentence: string) => {
    setSoriTargetSentence(sentence);
    setIsSoriModalOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check OCR daily quota
    const allowed = consumeOcrQuota();
    if (!allowed) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setIsOcrScanning(true);
      setOcrNotice(null);

      try {
        const res = await fetch('/api/ai/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            fileName: file.name,
          }),
        });
        const data = await res.json();
        if (data.success && data.extractedText) {
          setDraftText(data.extractedText);
          setInputMethod('handwriting_ocr');
          setRawOcrText(data.extractedText);
          setOcrConfidence(data.confidence || 97.2);
          setOcrNotice(data.message || '손글씨가 인식되어 에디터에 자동 입력되었습니다.');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsOcrScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSimulateOcr = async () => {
    // Check OCR daily quota
    const allowed = consumeOcrQuota();
    if (!allowed) return;

    setIsOcrScanning(true);
    setOcrNotice(null);
    setTimeout(async () => {
      try {
        const res = await fetch('/api/ai/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: 'sample_student_handwriting.jpg',
          }),
        });
        const data = await res.json();
        if (data.success && data.extractedText) {
          setDraftText(data.extractedText);
          setInputMethod('handwriting_ocr');
          setRawOcrText(data.extractedText);
          setOcrConfidence(98.4);
          setOcrNotice('종이 원고지에 쓴 손글씨 답안이 OCR을 통해 100% 디지털 텍스트로 변환되었습니다.');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsOcrScanning(false);
      }
    }, 1200);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Find existing submission for this student and task
  const existingSubmission = submissions.find(
    (s) => s.blockId === currentBlock.blockId && s.uid === currentUser.uid
  );

  const defaultDraft =
    existingSubmission?.initialDraft ||
    `요즘 세상에서 인공지능 기술이 발전이 아주 빠릅니다. 그래서 사람들이 생활이 편해지고 생산성이 높아졌습니다. 그렇지만 나쁜 점도 아주 많습니다. 예를 들면 데이터가 편견이 있어서 사람을 차별합니다. 그리고 일자리가 없어져서 노동자들이 걱정합니다. 만약 사고가 나면 누구의 책임인지 모릅니다.
그러므로 우리는 이런 문제를 해결하기 위해서 노력해야 합니다. 정부는 법을 만들어야 하고 사람들은 기술만 믿지 말고 윤리를 생각해야 합니다. 이것이 가장 중요한 일입니다.`;

  const [draftText, setDraftText] = useState(defaultDraft);

  // Real-time 1s Debounced LocalStorage Auto-Save
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storageKey = `hanup_draft_${currentBlock.blockId}_${currentUser.uid}`;
    const saved = localStorage.getItem(storageKey);
    if (saved && saved.trim().length > 10 && !existingSubmission) {
      setDraftText(saved);
    }
  }, [currentBlock.blockId, currentUser.uid, existingSubmission]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setAutoSaveStatus('saving');
    const storageKey = `hanup_draft_${currentBlock.blockId}_${currentUser.uid}`;
    const timer = setTimeout(() => {
      localStorage.setItem(storageKey, draftText);
      setAutoSaveStatus('saved');
    }, 1000);
    return () => clearTimeout(timer);
  }, [draftText, currentBlock.blockId, currentUser.uid]);
  const [revisionText, setRevisionText] = useState(
    existingSubmission?.revisedDraft ||
      `오늘날 인공지능(AI) 기술은 산업 전반에서 비약적으로 발전하고 있다. 그 결과 인간의 삶은 더욱 편리해졌으며 사회적 생산성 또한 괄목할 만하게 향상되었다.

그러나 기술의 급속한 확산은 결코 간과할 수 없는 부작용을 야기한다. 첫째, 알고리즘의 편향성으로 인해 사회적 차별이 심화될 위험이 크다. 둘째, 자동화로 인한 일자리 감소는 노동 시장에 큰 혼란을 초래한다. 특히 자율주행차나 의료 진단 AI에서 사고가 발생할 경우 책임 소재가 불분명하여 법적 분쟁이 일어날 수 있다.

따라서 이러한 문제를 극복하기 위한 다각적인 대책이 요구된다. 정부와 사회는 엄격한 윤리적 법률을 제정해야 하며, 인류는 기술 만능주의를 경계해야 한다. 이것이야말로 인간과 기술이 조화롭게 공존하기 위한 선결 과제라 할 수 있다.`
  );

  const [isSubmittingAi, setIsSubmittingAi] = useState(false);
  const [revisionSavedNotice, setRevisionSavedNotice] = useState(false);

  const charCount = draftText.length;
  const targetChars = taskMode === 'topik_54' ? [600, 700] : [200, 300];

  // Required Keywords check
  const requiredKeywords = currentBlock.writingRubric?.requiredKeywords || [
    '비약적 발전',
    '알고리즘 편향성',
    '선결 과제',
  ];

  // Helper to convert draftText into TOPIK Manuscript Paper 20-character lines
  const parseManuscriptGrid = (text: string) => {
    const paragraphs = text.split('\n');
    const rawRows: { chars: string[] }[] = [];

    paragraphs.forEach((para) => {
      // TOPIK rule: Paragraph starts with 1 blank space indent
      const formatted = ' ' + para;
      for (let i = 0; i < formatted.length; i += 20) {
        const line = formatted.slice(i, i + 20).padEnd(20, ' ');
        rawRows.push({ chars: line.split('') });
      }
    });

    const targetMinRows = Math.max(35, rawRows.length + 3);
    while (rawRows.length < targetMinRows) {
      rawRows.push({ chars: Array(20).fill(' ') });
    }

    return rawRows.map((r, idx) => {
      const charAccum = (idx + 1) * 20;
      let targetLabel: string | undefined = undefined;
      let badgeColor = 'bg-slate-100 text-slate-500';

      if (charAccum === 200) {
        targetLabel = '200자 (53번 기준)';
        badgeColor = 'bg-amber-100 text-amber-800 font-bold';
      } else if (charAccum === 300) {
        targetLabel = '300자 (53번 상한)';
        badgeColor = 'bg-amber-200 text-amber-900 font-bold';
      } else if (charAccum === 600) {
        targetLabel = '★ 600자 (54번 최소 충족선)';
        badgeColor = 'bg-emerald-100 text-emerald-800 font-black ring-1 ring-emerald-400';
      } else if (charAccum === 700) {
        targetLabel = '★ 700자 (54번 권장 상한선)';
        badgeColor = 'bg-blue-100 text-blue-800 font-black ring-1 ring-blue-400';
      } else if (charAccum === 800) {
        targetLabel = '800자 (분량 초과 감점 주의)';
        badgeColor = 'bg-rose-100 text-rose-700 font-bold';
      }

      return { ...r, targetLabel, badgeColor, charAccum };
    });
  };

  // TTS Simulation (Web Speech API)
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const speechText =
        chapterId === 'ch_prep_01'
          ? '수진 씨, 미안해요! 오늘 4시에 만나기로 했는데 학교 앞에서 버스를 잘못 탔어요. 지금 반대 방향으로 가는 버스를 타서 다시 돌아가고 있어요. 30분 정도 늦을 것 같아요. 4시 30분까지 약속 장소인 서울역 앞 커피숍으로 갈게요! 급한 일이 생겨서요.'
          : chapterId === 'ch_prep_02'
          ? '손님, 어제 여기서 산 바지인데요. 집에서 다시 입어 보니까 길이가 좀 짧아서요. 혹시 한 치수 큰 사이즈로 교환할 수 있을까요? 영수증 여기 있어요.'
          : '현대 사회에서 인공지능 기술은 비약적으로 발전하고 있습니다. 그러나 알고리즘의 편향성과 일자리 감소라는 윤리적 문제를 해결하는 것이 선결 과제입니다.';
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = 'ko-KR';
      utterance.rate = playbackSpeed;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Submit Draft to AI (Call Real Next.js API Route `/api/ai/grade`)
  const handleAnalyzeWithAi = async () => {
    // Check AI Grading daily quota
    const allowed = consumeAiGradeQuota();
    if (!allowed) return;

    setIsSubmittingAi(true);
    try {
      const res = await fetch('/api/ai/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptTitle: currentBlock.title,
          draftText,
          targetLevel: currentUser.targetTopikLevel,
          l1: lang,
          taskType: taskMode === 'topik_54' ? 'topik_54_essay' : 'topik_53_graph',
        }),
      });

      const aiData = await res.json();
      setIsSubmittingAi(false);

      const newSub: WritingSubmission = {
        submissionId: existingSubmission ? existingSubmission.submissionId : `sub_${Date.now()}`,
        uid: currentUser.uid,
        studentName: currentUser.name,
        orgId: currentUser.orgId,
        classId: currentUser.classIds[0],
        blockId: currentBlock.blockId,
        taskType: taskMode === 'topik_54' ? 'topik_54_essay' : 'topik_53_graph',
        taskPromptTitle: currentBlock.title,
        initialDraft: draftText,
        inputMethod,
        rawOcrText: inputMethod === 'handwriting_ocr' ? rawOcrText || draftText : undefined,
        researchConsent,
        consentedAt: new Date().toISOString(),
        aiFeedback: {
          estimatedScore: aiData.estimatedScore || 35,
          estimatedLevel: aiData.estimatedLevel || 4,
          grammarAndEndingErrors: aiData.grammarAndEndingErrors || [],
          chineseTranslationToneFixes: aiData.chineseTranslationToneFixes || [],
          rhetoricAndLogicComment: aiData.rhetoricAndLogicComment || '',
          analyzedAt: aiData.analyzedAt || new Date().toISOString(),
        },
        instructorFeedback: existingSubmission?.instructorFeedback,
        revisedDraft: revisionText,
        submittedAt: new Date().toISOString(),
      };

      addSubmission(newSub);
      markChapterCompleted(seriesId, chapterId);
    } catch (err) {
      setIsSubmittingAi(false);
      console.error('AI analysis error:', err);
    }
  };

  // Submit Student Revision
  const handleSaveRevision = () => {
    if (!existingSubmission) return;
    submitStudentRevision(existingSubmission.submissionId, revisionText);
    setRevisionSavedNotice(true);
    setTimeout(() => setRevisionSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Chapter Title & Global Header Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2 flex-1 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-700">
              {currentSeries.titleKo}
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-bold text-slate-500">
              {currentBlock.chapterTitle || '제4장: 논술 54번 인공지능 발전과 윤리적 과제'}
            </span>

            {/* Course Expiry Badge */}
            {accessStatus.daysRemainingInCourse !== undefined && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black ${
                  accessStatus.daysRemainingInCourse <= 3
                    ? 'bg-rose-100 text-rose-700 border border-rose-200 animate-pulse'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                <Clock className="w-3 h-3 text-amber-600" />
                <span>수강 기한 D-{accessStatus.daysRemainingInCourse}일 (복습 2X 보장)</span>
              </span>
            )}

            {/* Notification Settings CTA Pill */}
            <button
              onClick={openNotificationModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all hover:scale-105"
              title="다음 챕터 오픈 및 복습 알림 설정"
            >
              <Bell className="w-3 h-3 text-blue-600" />
              <span>알림 {notificationSettings.webPushEnabled ? '🟢 ON' : '설정'}</span>
              {notificationSettings.marketingConsent && (
                <span className="text-[10px] text-emerald-600 font-extrabold">•쿠폰동의</span>
              )}
            </button>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {currentBlock.title}
          </h1>

          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <QrCode className="w-3.5 h-3.5 text-slate-500" />
            <span>QR Bridge DeepLink:</span>
            <span className="font-mono text-blue-600 font-semibold">{currentBlock.qrBridgeUrl}</span>
          </div>

          {/* Drip Release & Sequential Unlock Chapter Bar for TOPIK Prep */}
          {(seriesId === 'hanup_topik_prep' || chapterId.startsWith('ch_prep_')) && (
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>순차 오픈 커리큘럼 (2주 코스 • 복습 2X 보장 28일 수강):</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  🔒 선수 회차 완료 + 예정일 도달 시 자동 잠금 해제
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {prepChapterList.map((ch, idx) => {
                  const chStatus = checkChapterAccess(seriesId, ch.id, idx);
                  const isCurrent = chapterId === ch.id;

                  return (
                    <Link
                      key={ch.id}
                      href={`/study/hanup_topik_prep/${ch.id}`}
                      className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex flex-col justify-between gap-1.5 ${
                        isCurrent
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/30'
                          : chStatus.isUnlocked
                          ? 'bg-slate-50 hover:bg-blue-50 border-slate-200 text-slate-800 hover:border-blue-300'
                          : 'bg-slate-100/70 border-slate-200/60 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                            isCurrent
                              ? 'bg-white/20 text-white'
                              : chStatus.isUnlocked
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          Day {ch.day}
                        </span>
                        <span>
                          {chStatus.isCompleted ? (
                            <span className={`flex items-center gap-0.5 font-extrabold text-[11px] ${isCurrent ? 'text-emerald-200' : 'text-emerald-600'}`}>
                              <CheckCircle2 className="w-3.5 h-3.5" /> 완료
                            </span>
                          ) : chStatus.isUnlocked ? (
                            <span className={`text-[11px] font-bold ${isCurrent ? 'text-blue-100' : 'text-blue-600'}`}>
                              학습 가능
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5 text-slate-400 text-[11px]">
                              <Lock className="w-3 h-3" /> 잠김
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="font-extrabold truncate">{ch.title}</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 3 Interactive Tabs */}
        {accessStatus.isUnlocked && (
          <div className="inline-flex rounded-2xl p-1 bg-slate-100 border border-slate-200/80 shadow-inner self-start lg:self-center shrink-0">
            <button
              onClick={() => setActiveTab('concept')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'concept'
                  ? 'bg-white text-blue-700 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{UI_TRANSLATIONS[lang]?.conceptTab || 'Tab 1. 개념 & 읽기'}</span>
            </button>
            <button
              onClick={() => setActiveTab('listening')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'listening'
                  ? 'bg-white text-blue-700 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>{UI_TRANSLATIONS[lang]?.listeningTab || 'Tab 2. 듣기 & 딕테이션'}</span>
            </button>
            <button
              onClick={() => setActiveTab('writing')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'writing'
                  ? 'bg-white text-blue-700 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>{UI_TRANSLATIONS[lang]?.writingTab || 'Tab 3. 쓰기 53·54 AI 튜터'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Main Study Content Area or Locked Gate View */}
      {!accessStatus.isUnlocked ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-dashed border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900">
              {accessStatus.lockReason === 'course_expired' && '⌛ 수강 기한 만료'}
              {accessStatus.lockReason === 'prerequisite_incomplete' && '🔒 선수 회차 미완료'}
              {accessStatus.lockReason === 'drip_date_not_reached' && '🔒 순차 오픈 예정'}
              {accessStatus.lockReason === 'unpurchased' && '🔒 미등록 강좌'}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {accessStatus.lockReason === 'course_expired' && '본 강좌의 수강 유효기간이 만료되었습니다'}
              {accessStatus.lockReason === 'prerequisite_incomplete' && `제${chapterIndex}회차 선수 학습을 먼저 완료해 주세요`}
              {accessStatus.lockReason === 'drip_date_not_reached' && `${accessStatus.unlockDate || '예정일'}에 자동으로 열립니다`}
              {accessStatus.lockReason === 'unpurchased' && '수강 신청이 필요한 강좌입니다'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
              {accessStatus.lockReason === 'course_expired' &&
                '해당 코스의 28일(정규 커리큘럼의 2배 여유 보장) 수강 유효기간이 종료되었습니다. 계속해서 복습하거나 추가 AI 실시간 첨삭 및 음운 클리닉을 이용하시려면 수강권을 갱신해 주세요.'}
              {accessStatus.lockReason === 'prerequisite_incomplete' &&
                `한업의 체계적인 학습 설계를 위해, 이전 회차(제${chapterIndex}회)의 핵심 개념과 미니 쓰기 과제를 먼저 완료하셔야 본 회차가 열립니다.`}
              {accessStatus.lockReason === 'drip_date_not_reached' &&
                `학습자의 망각 곡선과 최적의 복습 주기를 고려하여 본 챕터는 ${accessStatus.unlockDate || '예정일'}에 오픈됩니다. 오픈 당일 모바일 푸시 알림과 이메일로 즉시 알려드릴게요!`}
              {accessStatus.lockReason === 'unpurchased' &&
                '한업 정규 패스를 구독하거나 단품 교재를 구매하시면 전체 회차와 무제한 AI 튜터링을 즉시 이용하실 수 있습니다.'}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {accessStatus.lockReason === 'course_expired' && (
              <button
                onClick={openPaywallModal}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>⚡ 수강권 갱신 및 기간 연장하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {accessStatus.lockReason === 'prerequisite_incomplete' && (
              <Link
                href={`/study/hanup_topik_prep/${prepChapterList[Math.max(0, chapterIndex - 1)].id}`}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>제{chapterIndex}회 학습하러 가기</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            {accessStatus.lockReason === 'drip_date_not_reached' && (
              <button
                onClick={openNotificationModal}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" />
                <span>🔔 오픈 알림 받기 설정 (푸시 & 이메일)</span>
              </button>
            )}

            {accessStatus.lockReason === 'unpurchased' && (
              <button
                onClick={openPaywallModal}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>수강 신청 및 결제하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* =========================================================================
              TAB 1: CONCEPT & MULTI-LINGUAL VOCAB TOOLTIP (INTERACTIVE WEB-BOOK)
          ========================================================================= */}
      {activeTab === 'concept' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Reading Passage (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                인터랙티브 웹북 본문 (Interactive Reader)
              </span>
              <button
                onClick={() => setShowFullZhTranslation(!showFullZhTranslation)}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>
                  {showFullZhTranslation
                    ? (lang === 'en' ? 'Hide English Guide' : lang === 'ja' ? '解説を閉じる' : lang === 'vi' ? 'Đóng hướng dẫn' : lang === 'my' ? 'ရှင်းလင်းချက် ပိတ်ရန်' : lang === 'zh' ? '收起中文解析' : '모국어 해설 접기')
                    : (lang === 'en' ? 'Show English Guide' : lang === 'ja' ? '解説を開く' : lang === 'vi' ? 'Mở hướng dẫn' : lang === 'my' ? 'ရှင်းလင်းချက် ကြည့်ရန်' : lang === 'zh' ? '展开中文解析' : '모국어 대비 해설 펼치기')}
                </span>
              </button>
            </div>

            {/* Interactive Passage with Clickable Keywords */}
            {currentBlock.blockId === 'blk_writing_04' ? (
              <div className="text-slate-900 text-sm sm:text-base leading-loose whitespace-pre-line font-sans">
                현대 사회에서 인공지능(AI) 기술은 산업 전반뿐만 아니라 일상생활에까지 깊숙이 자리 잡았습니다. 이에 따라 생산성이{' '}
                <button
                  onClick={() =>
                    setActiveVocab(currentBlock.vocabAnnotations.find((v) => v.word.includes('비약적')) || null)
                  }
                  className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-extrabold hover:bg-blue-200 transition-colors underline decoration-blue-500 decoration-2 underline-offset-2"
                >
                  비약적(飛躍的)
                </button>
                으로 증가하고 삶의 편의성이 향상된 반면, 일자리 감소와 개인정보 침해, 알고리즘{' '}
                <button
                  onClick={() =>
                    setActiveVocab(currentBlock.vocabAnnotations.find((v) => v.word.includes('편향성')) || null)
                  }
                  className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-extrabold hover:bg-blue-200 transition-colors underline decoration-blue-500 decoration-2 underline-offset-2"
                >
                  편향성(偏向性)
                </button>
                과 같은 윤리적 문제 또한 끊임없이 제기되고 있습니다.

                이러한 기술의 부작용을 극복하고 인간과의 조화로운 공존을 이룩하기 위해서는 제도적 가이드라인 마련과 윤리 의식 함양이 무엇보다도 시급한{' '}
                <button
                  onClick={() =>
                    setActiveVocab(currentBlock.vocabAnnotations.find((v) => v.word.includes('선결 과제')) || null)
                  }
                  className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-extrabold hover:bg-blue-200 transition-colors underline decoration-blue-500 decoration-2 underline-offset-2"
                >
                  선결 과제(先決課題)
                </button>
                라 할 수 있습니다.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-slate-900 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
                  {currentBlock.koContent}
                </div>
                {/* Clickable Vocab Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-slate-500">💡 본문 핵심 어휘 태그:</span>
                  {currentBlock.vocabAnnotations.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveVocab(v)}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition-all flex items-center gap-1 shadow-2xs hover:scale-105"
                    >
                      <span>🏷️</span>
                      <span>{v.word}</span>
                      <span className="text-[10px] text-blue-600 font-medium">({v.zhMeaning})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Multilingual Explanation Box */}
            {showFullZhTranslation && (
              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-slate-800 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
                  <span className="font-bold text-blue-950 flex items-center gap-1.5 text-xs sm:text-sm">
                    <span>{SUPPORTED_LANGUAGES[lang]?.flag}</span>
                    <span>
                      {lang === 'en' && '【TOPIK 54 Essay Analysis & Contrastive Guide】'}
                      {lang === 'ja' && '【TOPIK54番 論述課題の徹底解説と対照学習ガイド】'}
                      {lang === 'zh' && '【第54题大作文真题深度解析与中韩语言对比指南】'}
                      {lang === 'vi' && '【Phân tích đề thi viết TOPIK câu 54 & Hướng dẫn đối chiếu】'}
                      {lang === 'my' && '【TOPIK အမှတ် ၅၄ စာစီစာကုံး သရုပ်ခွဲလေ့လာချက်နှင့် လမ်းညွှန်】'}
                      {lang === 'ko' && '【TOPIK 54번 실전 논술 3단 구성 심층 가이드】'}
                    </span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    {SUPPORTED_LANGUAGES[lang]?.nativeLabel}
                  </span>
                </div>
                <p className="leading-relaxed text-slate-800 text-xs sm:text-sm font-sans whitespace-pre-line">
                  {currentBlock.multilingualExplanations?.[lang] || currentBlock.zhExplanation}
                </p>
              </div>
            )}

            {/* Model Answer Showcase */}
            {currentBlock.writingRubric && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    🏆 54번 650자 만점 모범 답안 (Model Answer)
                  </span>
                  <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
                    6급 수사 구조
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                  {currentBlock.writingRubric.modelAnswer}
                </div>
              </div>
            )}
            {/* Multilingual L1 Typology & Contrastive Interference Guide Card */}
            {L1_PROFILES[lang] && L1_PROFILES[lang].majorInterferenceErrors.length > 0 && (
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-indigo-200/70 pb-2">
                  <div className="flex items-center gap-2 font-bold text-indigo-900">
                    <span className="text-base">{L1_PROFILES[lang].flag}</span>
                    <span>{L1_PROFILES[lang].nativeName} 화자를 위한 한국어 대조언어학 핵심 가이드</span>
                  </div>
                  <span className="text-[10px] font-mono bg-indigo-200/60 px-2 py-0.5 rounded font-bold text-indigo-800 self-start sm:self-auto">
                    {L1_PROFILES[lang].wordOrder}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {L1_PROFILES[lang].majorInterferenceErrors.map((item, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white border border-indigo-100 shadow-2xs space-y-1.5 flex flex-col justify-between">
                      <div>
                        <div className="font-extrabold text-indigo-900 text-[11px] leading-tight">{item.type}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{item.descriptionNative}</div>
                      </div>
                      <div className="space-y-1 pt-1">
                        <div className="text-[10px] bg-rose-50 text-rose-800 px-1.5 py-0.5 rounded line-through">
                          ❌ {item.exampleWrong}
                        </div>
                        <div className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                          ⭕ {item.exampleCorrect}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reading Questions Assessment */}
            {readingQuestions.length > 0 && (
              <div className="pt-6 border-t border-slate-200/80 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>📖 TOPIK 준비편 실전 읽기 평가 ({readingQuestions.length}문항)</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">정답을 클릭하면 즉시 해설과 피드백이 제공됩니다.</span>
                </div>

                <div className="space-y-4">
                  {readingQuestions.map((q) => {
                    const isSelected = selectedAnswers[q.itemId] !== undefined;
                    const selectedIdx = selectedAnswers[q.itemId];
                    const isCorrect = selectedIdx === q.correctIndex;
                    const showFb = showAnswerFeedback[q.itemId];

                    return (
                      <div key={q.itemId} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                            [문항 {q.questionNumber}번]
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">{q.directionKo}</span>
                        </div>

                        {q.passage && (
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line">
                            {q.passage}
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, oIdx) => {
                            const isChosen = selectedIdx === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => {
                                  setSelectedAnswers((prev) => ({ ...prev, [q.itemId]: oIdx }));
                                  setShowAnswerFeedback((prev) => ({ ...prev, [q.itemId]: true }));
                                }}
                                className={`p-2.5 rounded-xl text-xs text-left font-bold border transition-all ${
                                  isChosen
                                    ? isChosen && oIdx === q.correctIndex
                                      ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400/30'
                                      : 'bg-rose-100 border-rose-500 text-rose-950 ring-2 ring-rose-400/30'
                                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                <span className="mr-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-[10px] text-slate-600 font-mono">
                                  {oIdx + 1}
                                </span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {showFb && (
                          <div className={`p-3 rounded-xl text-xs space-y-1 ${isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'}`}>
                            <div className="font-extrabold flex items-center gap-1.5">
                              {isCorrect ? '✅ 정답입니다!' : '❌ 오답입니다.'}
                              <span className="text-[11px] font-normal text-slate-600">
                                (정답: {q.correctIndex + 1}번 {q.options[q.correctIndex]})
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-slate-700">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Vocab Inspector & Bookmarking (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>핵심 어휘 다국어 툴팁 ({SUPPORTED_LANGUAGES[lang]?.flag} {SUPPORTED_LANGUAGES[lang]?.label})</span>
                </h3>
                <span className="text-[11px] text-slate-400">단어를 클릭하세요</span>
              </div>

              {/* Vocab Cards */}
              <div className="space-y-3">
                {currentBlock.vocabAnnotations.map((v, idx) => {
                  const isSaved = isVocabSaved(v.word);
                  const isSelected = activeVocab?.word === v.word;

                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveVocab(v)}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 shadow-sm ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-sm">{v.word}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-900">
                            TOPIK {v.topikLevel}급
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveVocab(v.word);
                            }}
                            className={`p-1 rounded-md transition-colors ${
                              isSaved ? 'text-amber-500 hover:text-amber-600' : 'text-slate-300 hover:text-slate-500'
                            }`}
                            title="단어장에 저장"
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Multilingual Meaning based on selected language */}
                      <div className="text-xs text-slate-700 mt-2 space-y-1">
                        <div className="font-bold text-blue-900 bg-blue-50/80 px-2.5 py-1.5 rounded-lg border border-blue-200/60 flex items-center justify-between">
                          <span>
                            {lang === 'en' && `🇺🇸 English: ${v.enMeaning}`}
                            {lang === 'ja' && `🇯🇵 日本語: ${v.jaMeaning || v.enMeaning}`}
                            {lang === 'zh' && `🇨🇳 中文: ${v.zhMeaning}`}
                            {lang === 'vi' && `🇻🇳 Tiếng Việt: ${v.viMeaning || v.enMeaning}`}
                            {lang === 'my' && `🇲🇲 မြန်မာ: ${v.myMeaning || v.enMeaning}`}
                            {lang === 'ko' && `🌐 다국어: 🇺🇸 ${v.enMeaning} | 🇨🇳 ${v.zhMeaning}`}
                          </span>
                          <span className="text-[10px] text-blue-600 font-mono uppercase">L1 Match</span>
                        </div>

                        {/* Collapsible 5-Language Cross-Reference */}
                        <div className="text-[10px] text-slate-500 pt-1 space-y-0.5 border-t border-slate-100">
                          <div className="flex flex-wrap gap-x-2 text-slate-600">
                            <span>🇺🇸 {v.enMeaning}</span>
                            <span>🇨🇳 {v.zhMeaning}</span>
                            {v.jaMeaning && <span>🇯🇵 {v.jaMeaning}</span>}
                            {v.viMeaning && <span>🇻🇳 {v.viMeaning}</span>}
                            {v.myMeaning && <span>🇲🇲 {v.myMeaning}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Tailored L1 Interference Warning Note */}
                      {(v.l1ContrastiveNotes?.[lang] || v.commonChineseErrorNote) && (
                        <div className="mt-2 text-[11px] text-rose-800 bg-rose-50 p-2.5 rounded-xl border border-rose-200/80 leading-relaxed space-y-0.5">
                          <div className="font-bold flex items-center gap-1 text-rose-900">
                            <span>⚠️ {SUPPORTED_LANGUAGES[lang]?.nativeLabel || '모국어'} 화자 감점 방지 팁:</span>
                          </div>
                          <div>{v.l1ContrastiveNotes?.[lang] || v.commonChineseErrorNote}</div>
                        </div>
                      )}

                      {/* Sori Tutor Pronunciation Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const sampleSentence = v.word.includes('비약적')
                            ? '인공지능 기술은 생산성을 비약적으로 발전시켰다.'
                            : v.word.includes('선결 과제')
                            ? '이것이야말로 조화로운 공존을 위한 선결 과제라 할 수 있다.'
                            : v.word.includes('편향성')
                            ? '알고리즘 데이터 편향성 문제를 극복해야 한다.'
                            : `${v.word}의 정확한 표준 발음과 연음을 연습합니다.`;
                          openSoriTutor(sampleSentence);
                        }}
                        className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
                      >
                        <Mic className="w-3.5 h-3.5 text-emerald-600" />
                        <span>🎙️ 소리튜터 발음·연음 교정</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Jump CTA to Writing */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md space-y-2">
              <span className="text-xs font-bold text-blue-200">개념 정리를 마쳤다면?</span>
              <h4 className="font-extrabold text-sm">54번 700자 실전 쓰기에 도전하세요</h4>
              <p className="text-[11px] text-blue-100">
                학습한 '비약적', '선결 과제'를 직접 글에 녹여내면 AI가 즉시 어휘 점수를 매겨드립니다.
              </p>
              <button
                onClick={() => setActiveTab('writing')}
                className="w-full mt-2 py-2 rounded-xl bg-white text-blue-900 font-black text-xs hover:bg-blue-50 transition-colors shadow-sm"
              >
                쓰기 & AI 튜터 탭으로 이동 →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: LISTENING & DICTATION PLAYER (TTS + FILL-IN-THE-BLANK)
      ========================================================================= */}
      {activeTab === 'listening' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8">
          {/* Audio Player Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Headphones className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                  AI 원어민 낭독 음원 (Web Speech Engine)
                </span>
                <h3 className="text-lg font-black mt-0.5">
                  {chapterId === 'ch_prep_01'
                    ? 'TOPIK I 준비편 제1회 일과·약속 듣기 & 연음 클리닉'
                    : chapterId === 'ch_prep_02'
                    ? 'TOPIK I 준비편 제2회 쇼핑·건강 듣기 & 겹받침 연음 클리닉'
                    : 'TOPIK 54번 핵심 구문 듣기 및 연음 클리닉'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {chapterId.startsWith('ch_prep_')
                    ? '재생 시간: 35초 • 발음 표준: 서울 표준어 (KOR-KR) • 발음 교정 연동'
                    : '재생 시간: 42초 • 발음 표준: 서울 표준어 (KOR-KR)'}
                </p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              {/* Speed Buttons */}
              <div className="inline-flex rounded-xl bg-slate-800 p-1 border border-slate-700 text-xs">
                {([0.8, 1.0, 1.2] as const).map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setPlaybackSpeed(rate)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      playbackSpeed === rate
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={handleToggleSpeech}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
              >
                {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingAudio ? '일시 정지' : '원어민 낭독'}</span>
              </button>

              {/* Sori Tutor Pronunciation Clinic Button */}
              <button
                onClick={() =>
                  openSoriTutor(
                    chapterId === 'ch_prep_01'
                      ? '급한 일이 생겨서요'
                      : chapterId === 'ch_prep_02'
                      ? '길이가 좀 짧아서요'
                      : '현대 사회에서 인공지능 기술은 산업 전반에서 생산성을 비약적으로 향상시키고 있다.'
                  )
                }
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                title="소리튜터 AI 발음·연음 클리닉"
              >
                <Mic className="w-4 h-4" />
                <span>
                  {chapterId === 'ch_prep_01'
                    ? '🎙️ [그판 니리 생겨서요] 교정'
                    : chapterId === 'ch_prep_02'
                    ? '🎙️ [짤바서요] 겹받침 교정'
                    : '🎙️ 소리튜터 발음·연음 교정'}
                </span>
              </button>
            </div>
          </div>

          {/* Dictation Exercise Box */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  타임스탬프 딕테이션 (빈칸 채우기 & 연음 습득)
                </h4>
                <p className="text-xs text-slate-500">
                  음원을 듣고 빈칸에 알맞은 핵심 단어를 키보드로 입력하세요.
                </p>
              </div>
              <button
                onClick={() => setShowDictationHint(!showDictationHint)}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                {showDictationHint ? '힌트 닫기' : '초성 힌트 보기'}
              </button>
            </div>

            {showDictationHint && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold">
                {chapterId === 'ch_prep_01' && (
                  <span>💡 <strong>초성 힌트:</strong> [빈칸 1: ㄱㅎ ㅇㅇ ㅅㄱㅅ (급한 일이 생겨서)], [빈칸 2: ㅈㅅㄱㅇ (제시간에)], [빈칸 3: ㅁㅈ (마중)]</span>
                )}
                {chapterId === 'ch_prep_02' && (
                  <span>💡 <strong>초성 힌트:</strong> [빈칸 1: ㅉㅇㅅㅇ (짧아서요)], [빈칸 2: ㄱㅎㅎ (교환할)], [빈칸 3: ㅇㅅㅈ (영수증)]</span>
                )}
                {!chapterId.startsWith('ch_prep_') && (
                  <span>💡 <strong>초성 힌트:</strong> [빈칸 1: ㅂㅇㅈ], [빈칸 2: ㅍㅎㅅ], [빈칸 3: ㅅㄱㄱㅈ]</span>
                )}
              </div>
            )}

            <div className="text-sm sm:text-base leading-loose text-slate-900 font-sans p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              {chapterId === 'ch_prep_01' ? (
                <div>
                  수진: "괜찮아요, 마이클 씨! 당황하지 말고 천천히 조심해서 오세요. 마침 저도{' '}
                  <input
                    type="text"
                    placeholder="[빈칸 1: 급한 일이 생겨서]"
                    value={dictationInputs[0] || ''}
                    onChange={(e) => setDictationInputs({ ...dictationInputs, 0: e.target.value })}
                    className="w-44 mx-1 px-2.5 py-1 text-center font-bold text-blue-700 border-b-2 border-blue-600 bg-blue-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {' '}서울역 안 서점에 들렀다가 커피숍으로 갈 생각이었어요. 제가 먼저 커피숍에{' '}
                  <input
                    type="text"
                    placeholder="[빈칸 2: 제시간에]"
                    value={dictationInputs[1] || ''}
                    onChange={(e) => setDictationInputs({ ...dictationInputs, 1: e.target.value })}
                    className="w-28 mx-1 px-2.5 py-1 text-center font-bold text-blue-700 border-b-2 border-blue-600 bg-blue-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {' '}도착해서 기다릴게요.{' '}
                  <input
                    type="text"
                    placeholder="[빈칸 3: 마중]"
                    value={dictationInputs[2] || ''}
                    onChange={(e) => setDictationInputs({ ...dictationInputs, 2: e.target.value })}
                    className="w-24 mx-1 px-2.5 py-1 text-center font-bold text-blue-700 border-b-2 border-blue-600 bg-blue-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {' '}안 나와도 되니까 조심해서 오세요!"
                </div>
              ) : chapterId === 'ch_prep_02' ? (
                <div>
                  손님: "저기요, 어제 여기서 산 바지인데요. 집에서 다시 입어 보니까 길이가 좀{' '}
                  <input
                    type="text"
                    placeholder="[빈칸 1: 짧아서요]"
                    value={dictationInputs[0] || ''}
                    onChange={(e) => setDictationInputs({ ...dictationInputs, 0: e.target.value })}
                    className="w-28 mx-1 px-2.5 py-1 text-center font-bold text-blue-700 border-b-2 border-blue-600 bg-blue-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  .{' '}혹시 한 치수 큰 사이즈로{' '}
                  <input
                    type="text"
                    placeholder="[빈칸 2: 교환할]"
                    value={dictationInputs[1] || ''}
                    onChange={(e) => setDictationInputs({ ...dictationInputs, 1: e.target.value })}
                    className="w-28 mx-1 px-2.5 py-1 text-center font-bold text-blue-700 border-b-2 border-blue-600 bg-blue-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {' '}수 있을까요?" 직원: "네, 손님!{' '}
                  <input
                    type="text"
                    placeholder="[빈칸 3: 영수증]"
                    value={dictationInputs[2] || ''}
                    onChange={(e) => setDictationInputs({ ...dictationInputs, 2: e.target.value })}
                    className="w-28 mx-1 px-2.5 py-1 text-center font-bold text-blue-700 border-b-2 border-blue-600 bg-blue-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {' '}을 챙겨 오셨나요?"
                </div>
              ) : (
                <div>
                  현대 사회에서 인공지능 기술은 산업 전반에서 생산성을{' '}
                  <input
                    type="text"
                    placeholder="[빈칸 1]"
                    value={dictationInputs[0] || ''}
                    onChange={(e) => setDictationInputs({ ...dictationInputs, 0: e.target.value })}
                    className="w-28 mx-1 px-2.5 py-1 text-center font-bold text-blue-700 border-b-2 border-blue-600 bg-blue-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  으로 향상시키고 있다. 그러나 데이터 편향성에 대한{' '}
                  <input
                    type="text"
                    placeholder="[빈칸 2]"
                    value={dictationInputs[1] || ''}
                    onChange={(e) => setDictationInputs({ ...dictationInputs, 1: e.target.value })}
                    className="w-28 mx-1 px-2.5 py-1 text-center font-bold text-blue-700 border-b-2 border-blue-600 bg-blue-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  을 해결하는 것이 건전한 상생의{' '}
                  <input
                    type="text"
                    placeholder="[빈칸 3]"
                    value={dictationInputs[2] || ''}
                    onChange={(e) => setDictationInputs({ ...dictationInputs, 2: e.target.value })}
                    className="w-28 mx-1 px-2.5 py-1 text-center font-bold text-blue-700 border-b-2 border-blue-600 bg-blue-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  라 할 수 있다.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                {chapterId === 'ch_prep_01'
                  ? '정답 예시: 급한 일이 생겨서, 제시간에, 마중'
                  : chapterId === 'ch_prep_02'
                  ? '정답 예시: 짧아서요, 교환할, 영수증'
                  : '정답 예시: 비약적, 편향성, 선결 과제'}
              </span>
              <button
                onClick={() => {
                  setDictationResultChecked(true);
                  markChapterCompleted(seriesId, chapterId);
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
              >
                딕테이션 채점하기
              </button>
            </div>

            {dictationResultChecked && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>축하합니다! 빈칸을 모두 확인하셨습니다.</span>
                </div>
                {chapterId === 'ch_prep_01' ? (
                  <p className="text-emerald-800">
                    • <strong>[급한 일이 생겨서]</strong>: 실제 발음 [그판 니리 생겨서] (거센소리되기 + ㄴ첨가)<br/>
                    • <strong>[제시간에]</strong>: 실제 발음 [제시가네] (연음 법칙)<br/>
                    • <strong>[마중]</strong>: 배웅의 뜻으로, '마중을 나가다' 관용 표현
                  </p>
                ) : chapterId === 'ch_prep_02' ? (
                  <p className="text-emerald-800">
                    • <strong>[짧아서요]</strong>: 실제 발음 [짤바서요] (겹받침 'ㄼ' 연음 현상)<br/>
                    • <strong>[교환할]</strong>: 물건을 다른 것으로 바꿀 때 쓰는 표준 표현<br/>
                    • <strong>[영수증]</strong>: 실제 발음 [영수쯩] (사잇소리/된소리 현상)
                  </p>
                ) : (
                  <p className="text-emerald-800">
                    • <strong>[비약적(飛躍的)]</strong>: 실제 발음 [비약쩍] (된소리되기 현상)<br/>
                    • <strong>[편향성(偏向性)]</strong>: 실제 발음 [편향썽]<br/>
                    • <strong>[선결 과제(先決課題)]</strong>: 54번 논술문 결론부 핵심 필수 어휘
                  </p>
                )}
                <div className="pt-2">
                  <button
                    onClick={() =>
                      openSoriTutor(
                        chapterId === 'ch_prep_01'
                          ? '급한 일이 생겨서요'
                          : chapterId === 'ch_prep_02'
                          ? '길이가 좀 짧아서요'
                          : '데이터 편향성을 해결하는 것이 건전한 상생의 선결 과제라 할 수 있다.'
                      )
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <Mic className="w-4 h-4" />
                    <span>🎙️ 소리튜터로 이 핵심 구문 직접 발음해보기</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Listening Questions Assessment */}
          {listeningQuestions.length > 0 && (
            <div className="pt-6 border-t border-slate-200/80 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-blue-600" />
                  <span>🎧 TOPIK 준비편 실전 듣기 평가 ({listeningQuestions.length}문항)</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">대화를 잘 듣고 물음에 답하십시오.</span>
              </div>

              <div className="space-y-4">
                {listeningQuestions.map((q) => {
                  const selectedIdx = selectedAnswers[q.itemId];
                  const isCorrect = selectedIdx === q.correctIndex;
                  const showFb = showAnswerFeedback[q.itemId];

                  return (
                    <div key={q.itemId} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-black text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-md">
                          [듣기 문항 {q.questionNumber}번]
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">{q.directionKo}</span>
                      </div>

                      {q.passage && (
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line">
                          <div className="font-bold text-slate-500 mb-1 flex items-center justify-between">
                            <span>[대화 지문 텍스트]</span>
                            <button
                              onClick={() => {
                                const sentence = q.passage?.split('\n')[0] || '';
                                openSoriTutor(sentence.replace(/^[가-힣]+:\s*/, ''));
                              }}
                              className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-1"
                            >
                              <Mic className="w-3 h-3" />
                              <span>소리튜터로 이 대화 발음하기</span>
                            </button>
                          </div>
                          {q.passage}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, oIdx) => {
                          const isChosen = selectedIdx === oIdx;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => {
                                setSelectedAnswers((prev) => ({ ...prev, [q.itemId]: oIdx }));
                                setShowAnswerFeedback((prev) => ({ ...prev, [q.itemId]: true }));
                              }}
                              className={`p-2.5 rounded-xl text-xs text-left font-bold border transition-all ${
                                isChosen
                                  ? isChosen && oIdx === q.correctIndex
                                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400/30'
                                    : 'bg-rose-100 border-rose-500 text-rose-950 ring-2 ring-rose-400/30'
                                  : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <span className="mr-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-[10px] text-slate-600 font-mono">
                                {oIdx + 1}
                              </span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {showFb && (
                        <div className={`p-3 rounded-xl text-xs space-y-1 ${isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'}`}>
                          <div className="font-extrabold flex items-center gap-1.5">
                            {isCorrect ? '✅ 정답입니다!' : '❌ 오답입니다.'}
                            <span className="text-[11px] font-normal text-slate-600">
                              (정답: {q.correctIndex + 1}번 {q.options[q.correctIndex]})
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-700">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: WRITING 53·54 & REAL-TIME AI TUTOR (HUMAN-IN-THE-LOOP CORNERSTONE)
      ========================================================================= */}
      {activeTab === 'writing' && (
        <div className="space-y-6">
          {/* ⚡ 1. Daily Quota Badge & Pro Paywall Funnel Bar */}
          {(() => {
            const quota = getDailyQuotaRemaining();
            const badgeText = quota.isUnlimited
              ? {
                  ko: '⚡ AI 첨삭 & OCR 스캔: 무제한 (Pro Pass 활성화됨)',
                  zh: '⚡ AI精批 & OCR扫描: 无限制 (Pro通行证已激活)',
                  en: '⚡ AI Grading & OCR Scans: Unlimited (Pro Pass Active)',
                  ja: '⚡ AI添削 & OCRスキャン: 無制限 (Proパス有効)',
                  vi: '⚡ Chấm AI & Quét OCR: Không giới hạn (Đã kích hoạt Pro Pass)',
                  my: '⚡ AI စစ်ဆေးခြင်းနှင့် OCR စကင်: အကန့်အသတ်မရှိ (Pro Pass)',
                }[lang] || '⚡ AI 첨삭 & OCR 스캔: 무제한 (Pro Pass 활성화됨)'
              : {
                  ko: `⚡ 오늘 남은 무료 AI 첨삭: ${quota.remainingAiGrade}/2회 | 📷 OCR 스캔: ${quota.remainingOcr}/2회 (Pro 패스 무제한)`,
                  zh: `⚡ 今日剩余免费AI精批: ${quota.remainingAiGrade}/2次 | 📷 OCR扫描: ${quota.remainingOcr}/2次 (Pro通行证无限制)`,
                  en: `⚡ Today's Free AI Grading: ${quota.remainingAiGrade}/2 | 📷 OCR Scans: ${quota.remainingOcr}/2 (Unlimited on Pro Pass)`,
                  ja: `⚡ 本日の無料AI添削残り: ${quota.remainingAiGrade}/2回 | 📷 OCRスキャン: ${quota.remainingOcr}/2回 (Proパス無制限)`,
                  vi: `⚡ Lượt chấm AI miễn phí hôm nay: ${quota.remainingAiGrade}/2 | 📷 Quét OCR: ${quota.remainingOcr}/2 (Không giới hạn trên Pro)`,
                  my: `⚡ ယနေ့ အခမဲ့ AI စစ်ဆေးခြင်း: ${quota.remainingAiGrade}/၂ ကြိမ် | 📷 OCR စကင်: ${quota.remainingOcr}/၂ ကြိမ် (Pro အကန့်အသတ်မရှိ)`,
                }[lang] || `⚡ 오늘 남은 무료 AI 첨삭: ${quota.remainingAiGrade}/2회 | 📷 OCR 스캔: ${quota.remainingOcr}/2회 (Pro 패스 무제한)`;

            return (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/80 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-blue-600 text-white shadow-xs">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </span>
                  <span className="text-xs font-black text-blue-950">
                    {badgeText}
                  </span>
                </div>
                {!quota.isUnlimited && (
                  <button
                    onClick={openPaywallModal}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs transition-all hover:scale-105 ml-auto sm:ml-0"
                  >
                    ⚡ Pro 패스 무제한 업그레이드
                  </button>
                )}
              </div>
            );
          })()}

          {/* Mini Writing Task for TOPIK Prep (1~2급 빈칸 쓰기 훈련) */}
          {(seriesId === 'hanup_topik_prep' || chapterId.startsWith('ch_prep_')) && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-2 border-emerald-300 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-xs">
                    {chapterId === 'ch_prep_01' ? '제1회 실전 미니 쓰기' : '제2회 실전 미니 쓰기'}
                  </span>
                  <h3 className="font-black text-slate-900 text-base">
                    {chapterId === 'ch_prep_01'
                      ? '문장 완성하기: 제안/약속 표현'
                      : '문장 완성하기: 이유 연결 표현 (-아/어서 vs -(으)니까)'}
                  </h3>
                </div>
                <span className="text-xs text-emerald-800 font-bold bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                  TOPIK 1~2급 핵심 출제 포인트
                </span>
              </div>

              {/* Context & Blank Sentence */}
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 text-sm sm:text-base leading-relaxed text-slate-900 space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase">
                  {chapterId === 'ch_prep_01' ? '상황: 비가 와서 만남이 취소된 후 다음 날 약속을 제안할 때' : '상황: 집들이 파티에 친구들을 초대하는 초대장을 보낼 때'}
                </div>
                <div className="p-3 bg-slate-50 rounded-xl font-medium border border-slate-200">
                  {chapterId === 'ch_prep_01' ? (
                    <div>
                      수진: "오늘 비가 많이 와서 못 만났네요. 내일은 날씨가 맑다고 해요. 우리 내일 ({' '}
                      <span className="font-bold text-emerald-700 underline decoration-emerald-500 decoration-2 px-2">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </span>{' '}
                      )?"
                    </div>
                  ) : (
                    <div>
                      "이번 주말에 저희 집에서 파티를 해요. 맛있는 한국 음식을 많이 ({' '}
                      <span className="font-bold text-emerald-700 underline decoration-emerald-500 decoration-2 px-2">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </span>{' '}
                      ) 꼭 놀러 오세요!"
                    </div>
                  )}
                </div>
              </div>

              {/* Input Form */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder={chapterId === 'ch_prep_01' ? '괄호 안에 들어갈 단어를 입력하세요 (예: 만날까요)' : '괄호 안에 들어갈 단어를 입력하세요 (예: 준비했으니까)'}
                  value={miniWritingInput}
                  onChange={(e) => {
                    setMiniWritingInput(e.target.value);
                    setMiniWritingChecked(false);
                  }}
                  className="flex-1 w-full px-4 py-3 rounded-2xl border-2 border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
                />
                <button
                  onClick={() => {
                    const trimmed = miniWritingInput.trim().replace(/[?.]/g, '');
                    setMiniWritingChecked(true);
                    if (chapterId === 'ch_prep_01') {
                      const isOk = trimmed === '만날까요' || trimmed === '만나요' || trimmed === '만날래요' || trimmed === '만날까요?';
                      setMiniWritingFeedback({
                        isCorrect: isOk,
                        text: isOk
                          ? '정답입니다! 👏 상대방의 의견을 묻거나 정중하게 제안할 때는 동사 어간에 "-(으)ㄹ까요?"를 붙여 "만날까요?"라고 합니다.'
                          : '다시 한번 생각해 보세요! 💡 힌트: "만나다" + 상대방에게 제안하는 어미 "-(으)ㄹ까요?" -> "만날까요"',
                      });
                      if (isOk) {
                        markChapterCompleted(seriesId, 'ch_prep_01');
                      }
                    } else {
                      const isOk = trimmed.includes('준비했으니까') || trimmed.includes('만들었으니까') || trimmed.includes('준비하니까') || trimmed.includes('있으니까');
                      setMiniWritingFeedback({
                        isCorrect: isOk,
                        text: isOk
                          ? '정답입니다! 👏 뒤 문장에 청유·명령문("-세요 / -ㅂ시다")이 올 때는 "-아/어서"를 쓸 수 없으며, 반드시 "-(으)니까"를 결합해야 합니다.'
                          : '틀렸습니다! 💡 힌트: 뒤 문장에 "오세요(명령/청유)"가 있으므로 "-아/어서"가 아닌 "-(으)니까"를 사용해 "준비했으니까"로 써야 합니다.',
                      });
                      if (isOk) {
                        setHasCompletedChapter2(true);
                        markChapterCompleted(seriesId, 'ch_prep_02');
                      }
                    }
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all hover:scale-105 whitespace-nowrap"
                >
                  미니 쓰기 채점하기
                </button>
              </div>

              {/* Instant Feedback */}
              {miniWritingChecked && miniWritingFeedback && (
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm font-sans space-y-1 ${
                    miniWritingFeedback.isCorrect
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                      : 'bg-rose-100 text-rose-950 border border-rose-300'
                  }`}
                >
                  <div className="font-black flex items-center gap-1.5">
                    {miniWritingFeedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
                    <span>{miniWritingFeedback.isCorrect ? '참 잘했어요! 만점 기준을 충족했습니다.' : '오답입니다.'}</span>
                  </div>
                  <p className="leading-relaxed">{miniWritingFeedback.text}</p>
                </div>
              )}

              {/* Chapter 2 Completion Banner & Survey Trigger */}
              {(chapterId === 'ch_prep_02' || hasCompletedChapter2) && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl space-y-3 border border-purple-500/40 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-400 text-slate-900 text-sm">🎉</span>
                    <h4 className="font-black text-sm sm:text-base text-amber-300">
                      《한업 TOPIK 준비편(1~2급 무료 체험판)》 전 과정(1회·2회) 완강!
                    </h4>
                  </div>
                  <p className="text-xs text-purple-200 leading-relaxed">
                    축하합니다! 제1회와 제2회의 핵심 어휘·문법·듣기·읽기·미니 쓰기를 모두 완료하셨습니다.
                    지금 1분 학술 AI 교육 요구도 설문에 참여하시면, 정규 유료 패스 <strong>20% 특별 할인 쿠폰(HANUP20WTP)</strong>이 즉시 발급됩니다.
                  </p>
                  <button
                    onClick={openSurveyModal}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <span>🎁</span>
                    <span>1분 설문조사 참여하고 20% 할인쿠폰 받기 (HANUP20WTP)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Real Mock Exam Header: Timer Bar & Mode Toggles */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-4 text-white shadow-lg flex flex-wrap items-center justify-between gap-4 border border-slate-700/80">
            {/* Left: Timer Display & Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-700 px-3.5 py-1.5 rounded-xl font-mono text-xl font-extrabold text-amber-400 shadow-inner">
                <Clock className={`w-5 h-5 ${timerSeconds < 300 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
                <span className={timerSeconds < 300 ? 'text-red-400 animate-pulse' : ''}>{formatTimer(timerSeconds)}</span>
              </div>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isTimerRunning ? '일시 정지' : '타이머 시작'}</span>
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(50 * 60);
                }}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white transition-all text-xs"
                title="50분 초기화"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                • TOPIK II 쓰기 실전 제한 시간 (50분)
              </span>
            </div>

            {/* Right: Focus Mode & Grid Switch */}
            <div className="flex items-center gap-2">
              {/* Editor Mode: Normal vs Grid */}
              <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-700 flex items-center gap-1">
                <button
                  onClick={() => setEditorMode('normal')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    editorMode === 'normal'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>줄글 에디터</span>
                </button>
                <button
                  onClick={() => setEditorMode('grid')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    editorMode === 'grid'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>원고지 격자 (20칸)</span>
                </button>
              </div>

              {/* Focus Mode Toggle */}
              <button
                onClick={() => setIsFocusMode(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-md transition-all hover:scale-105"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>집중 모드</span>
              </button>
            </div>
          </div>

          {/* Main 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Writing Draft Editor & Revision (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
              {/* Header: Task Selector & Character Count */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    TOPIK 54번 논술
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {editorMode === 'grid' ? '실제 원고지 격자 뷰어 (20칸 x N줄)' : '원고지 실전 작성'}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${
                    autoSaveStatus === 'saving'
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {autoSaveStatus === 'saving' ? '💾 저장 중...' : '💾 실시간 자동 저장됨'}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-mono font-extrabold ${
                      charCount < targetChars[0] ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  >
                    {charCount}자
                  </span>
                  <span className="text-xs text-slate-400"> / 권장 {targetChars[0]}~{targetChars[1]}자</span>
                </div>
              </div>

              {/* Prompt Instruction Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed space-y-1">
                <div className="font-bold text-slate-900">논제 제시문:</div>
                <p>
                  'AI 기술 발전의 명암과 필요한 사회적 대응'에 대해 600~700자로 글을 쓰십시오.
                  (1. 긍정적 변화 / 2. 윤리적 문제점 / 3. 극복을 위한 노력)
                </p>
              </div>

              {/* Required Keywords Tracker */}
              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-200/60 space-y-1.5">
                <span className="text-[11px] font-bold text-blue-900 block">
                  필수 제시어 사용 현황 (입력 시 자동 체크):
                </span>
                <div className="flex flex-wrap gap-2">
                  {requiredKeywords.map((kw, i) => {
                    const isIncluded = draftText.includes(kw);
                    return (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                          isIncluded
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                            : 'bg-white text-slate-500 border border-slate-200'
                        }`}
                      >
                        {isIncluded ? <Check className="w-3 h-3 text-emerald-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                        <span>{kw}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Handwriting Photo Upload & Vision OCR Bar */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/80 space-y-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                        <span>손글씨 답안지 사진 촬영 / 파일 업로드</span>
                        <span className="text-[10px] bg-purple-200/80 text-purple-900 px-1.5 py-0.5 rounded-full font-bold">AI OCR</span>
                      </h4>
                      <p className="text-[11px] text-purple-800/80">
                        종이 교재에 손으로 쓴 원고지 답안을 사진 찍으면 텍스트로 자동 인식하여 격자에 채워집니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-sm cursor-pointer transition-all hover:scale-105">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>사진 업로드</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleSimulateOcr}
                      disabled={isOcrScanning}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-bold shadow-xs transition-colors"
                      title="실제 스마트폰 사진 촬영 시뮬레이션"
                    >
                      <ScanLine className="w-3.5 h-3.5" />
                      <span>모의 촬영 테스트</span>
                    </button>
                  </div>
                </div>

                {/* OCR Processing & Preview Banner */}
                {isOcrScanning && (
                  <div className="p-3 rounded-xl bg-white border border-purple-200 flex items-center gap-3 animate-pulse">
                    <RefreshCw className="w-4 h-4 text-purple-600 animate-spin flex-shrink-0" />
                    <span className="text-xs font-bold text-purple-900">
                      AI 비전 신경망이 손글씨 원고지 필체를 해독하여 원고지 격자로 전사 중입니다...
                    </span>
                  </div>
                )}

                {ocrConfidence && !isOcrScanning && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{ocrNotice}</span>
                    </div>
                    <span className="text-[11px] font-mono font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      인식 신뢰도: {ocrConfidence}%
                    </span>
                  </div>
                )}
              </div>

              {/* Editor View: Normal Textarea vs Manuscript Grid */}
              {editorMode === 'normal' ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    학생 원문 초안 (Initial Draft):
                  </label>
                  <textarea
                    rows={10}
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    placeholder="여기에 답안을 작성하십시오. (200자 이상 작성 시 실시간 AI 첨삭이 가능합니다)"
                    className="w-full p-4 rounded-2xl border border-slate-200 text-slate-900 text-xs sm:text-sm leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                  />
                </div>
              ) : (
                /* Manuscript Grid Mode: Authentic 20-cells per row paper */
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-700">실시간 원고지 동기화 입력창:</label>
                      <span className="text-slate-400 text-[11px]">입력 즉시 아래 20칸 격자에 배치됩니다</span>
                    </div>
                    <textarea
                      rows={4}
                      value={draftText}
                      onChange={(e) => setDraftText(e.target.value)}
                      placeholder="원고지에 입력할 글을 작성하십시오..."
                      className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner font-sans"
                    />
                  </div>

                  {/* 20-column Authentic Manuscript Sheet Container */}
                  <div className="border-2 border-amber-300/80 rounded-2xl p-4 bg-[#fcfaf2] overflow-x-auto shadow-inner">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-300/70 text-xs text-amber-950 font-bold">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                        <span>TOPIK II 54번 표준 원고지 답안지 (가로 20칸 규격 • 문단 첫 칸 들여쓰기 자동)</span>
                      </div>
                      <span className="text-slate-600 font-mono text-xs font-semibold">총 {charCount}자 작성 중</span>
                    </div>

                    <div className="space-y-1.5 min-w-[620px] pb-2">
                      {parseManuscriptGrid(draftText).slice(0, 38).map((row, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-2">
                          {/* Row Index */}
                          <span
                            className={`w-6 text-[11px] font-mono text-right select-none font-semibold ${
                              (rIdx + 1) % 5 === 0 ? 'text-amber-800 font-black' : 'text-slate-400'
                            }`}
                          >
                            {rIdx + 1}
                          </span>

                          {/* 20 Cells Horizontal Grid (Strict 20-Columns) */}
                          <div
                            className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-px bg-amber-300/90 p-px rounded-xs flex-1 max-w-[600px] shadow-xs"
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(20, minmax(0, 1fr))',
                              width: '100%',
                            }}
                          >
                            {row.chars.map((char, cIdx) => (
                              <div
                                key={cIdx}
                                className={`flex items-center justify-center font-serif text-xs sm:text-sm font-semibold select-none border border-amber-200/50 ${
                                  char === ' '
                                    ? 'bg-[#fcfaf2] text-transparent'
                                    : 'bg-white text-slate-900 shadow-2xs'
                                }`}
                                style={{
                                  aspectRatio: '1 / 1',
                                }}
                              >
                                {char}
                              </div>
                            ))}
                          </div>

                          {/* Target Mark Badge / Count */}
                          <div className="w-36 text-left pl-1">
                            {row.targetLabel ? (
                              <span className={`px-2 py-0.5 rounded text-[10px] whitespace-nowrap shadow-xs ${row.badgeColor}`}>
                                {row.targetLabel}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-mono">
                                {(rIdx + 1) % 5 === 0 ? `${row.charAccum}자` : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* IRB Research Ethics Consent Notice */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={researchConsent}
                    onChange={(e) => setResearchConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                  />
                  <div className="text-[11px] leading-relaxed text-slate-700">
                    <span className="font-bold text-slate-900 block mb-0.5">
                      [학술 연구 윤리(IRB) 데이터 활용 동의 / Research Ethics Consent]
                    </span>
                    {
                      lang === 'zh'
                        ? '本人同意将本答卷及批改记录在个人信息完全匿名化的前提下，用于韩国语教育学学术研究（偏误分析与AI反馈研究）及韩升(HanUp) AI模型的升级优化。（同意即可获得免费AI深度精批报告）'
                        : lang === 'en'
                        ? 'I consent to the use of this essay and correction history, with all personal information fully anonymized, for academic research in Korean Language Education (error analysis & AI feedback) and for advancing the HanUp AI model. (Free AI feedback report provided upon consent)'
                        : lang === 'ja'
                        ? '本答案および添削履歴は、個人情報が完全に匿名化された状態で、韓国語教育学の学術研究（誤用分析およびAIフィードバック研究）ならびにHanUp AIモデルの高度化に活用されることに同意します。（同意時に無料AI添削レポートを提供）'
                        : lang === 'vi'
                        ? 'Tôi đồng ý để bài viết và lịch sử sửa lỗi này, sau khi đã ẩn danh hoàn toàn thông tin cá nhân, được sử dụng cho nghiên cứu học thuật về Giáo dục tiếng Hàn (phân tích lỗi sai & phản hồi AI) và nâng cấp mô hình HanUp AI. (Cung cấp báo cáo chấm AI miễn phí khi đồng ý)'
                        : lang === 'my'
                        ? 'ဤအဖြေလွှာနှင့် ပြင်ဆင်မှုမှတ်တမ်းအား ကိုယ်ရေးအချက်အလက်များကို လုံးဝအမည်မဖော်ဘဲ ကိုရီးယားဘာသာစကား ပညာရေးဆိုင်ရာ သုတေသနနှင့် HanUp AI မော်ဒယ် တိုးတက်စေရေးအတွက် အသုံးပြုရန် သဘောတူပါသည်။ (သဘောတူပါက အခမဲ့ AI အစီရင်ခံစာ ပံ့ပိုးပေးပါမည်)'
                        : '본 답안과 교정 이력은 개인정보가 완전히 익명화된 상태로 한국어교육학 학술 연구(오류 분석 및 AI 피드백 연구)와 한업(HanUp) AI 모델 고도화에 활용되는 것에 동의합니다. (동의 시 무료 AI 첨삭 리포트 제공)'
                    }
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">자동 로컬 백업 활성화됨</span>
                <button
                  disabled={isSubmittingAi || charCount < 30}
                  onClick={handleAnalyzeWithAi}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-105"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isSubmittingAi ? 'AI 1차 정밀 첨삭 중...' : 'AI 1차 실시간 첨삭 받기'}</span>
                </button>
              </div>

            {/* Student Revision Section (고쳐쓰기 제출 - 연구 데이터 파이프라인의 핵심) */}
            <div className="pt-6 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-black text-slate-900">
                    고쳐쓰기 수정본 (Revised Draft - 학술 코퍼스 최종 기록)
                  </h4>
                </div>
                {revisionSavedNotice && (
                  <span className="text-xs text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 저장 완료!
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                AI 1차 첨삭과 교사 2차 코멘트를 모두 반영하여 고쳐 쓴 글입니다. 한국어교육학 연구 코퍼스에 종단 수집됩니다.
              </p>
              <textarea
                rows={8}
                value={revisionText}
                onChange={(e) => setRevisionText(e.target.value)}
                placeholder="피드백을 반영한 최종 수정본을 작성하십시오..."
                className="w-full p-4 rounded-2xl border border-emerald-300 bg-emerald-50/20 text-slate-900 text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
              />
              <button
                onClick={handleSaveRevision}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
              >
                <Save className="w-3.5 h-3.5" />
                <span>최종 수정본 제출 (Save Revision to Corpus)</span>
              </button>
            </div>
          </div>

          {/* Right: AI Feedback + Instructor Feedback Display (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {existingSubmission ? (
              <>
                {/* 1. AI 1st Feedback Card */}
                <div className="bg-white rounded-3xl p-6 border border-blue-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-black text-xs">
                        AI 1차 정밀 첨삭 결과
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(existingSubmission.aiFeedback.analyzedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-blue-600">
                        {existingSubmission.aiFeedback.estimatedScore}점
                      </span>
                      <span className="text-xs text-slate-400"> / 50점 만점</span>
                    </div>
                  </div>

                  {/* Grammar & Sentence Endings */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      1. 문법 및 격식 종결어미 교정:
                    </span>
                    {existingSubmission.aiFeedback.grammarAndEndingErrors.map((err, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-rose-600 line-through font-semibold">{err.original}</span>
                          <span>→</span>
                          <span className="text-emerald-700 font-extrabold">{err.corrected}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          🌐 {
                            lang === 'en' ? (err.reasonEn || err.reasonZh) :
                            lang === 'ja' ? (err.reasonJa || err.reasonZh) :
                            lang === 'vi' ? (err.reasonVi || err.reasonZh) :
                            lang === 'my' ? (err.reasonMy || err.reasonZh) :
                            err.reasonZh
                          }
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Multilingual Translation Tone Fixes (L1 Interference) */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      2. {SUPPORTED_LANGUAGES[lang]?.nativeLabel || '모국어'} 번역투(L1 모국어 간섭) 교정:
                    </span>
                    {existingSubmission.aiFeedback.chineseTranslationToneFixes.map((tone, idx) => {
                      const tip =
                        lang === 'en' ? (tone.tipEn || tone.tipZh) :
                        lang === 'ja' ? (tone.tipJa || tone.tipZh) :
                        lang === 'vi' ? (tone.tipVi || tone.tipZh) :
                        lang === 'my' ? (tone.tipMy || tone.tipZh) :
                        tone.tipZh;

                      return (
                        <div key={idx} className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-amber-900 font-semibold">어색한 직역: "{tone.awkward}"</span>
                            <span>→</span>
                            <span className="text-blue-800 font-extrabold">"{tone.naturalKo}"</span>
                          </div>
                          <p className="text-amber-950 text-[11px] leading-relaxed">
                            💡 <strong>[{SUPPORTED_LANGUAGES[lang]?.nativeLabel || 'L1'} 지도 팁]:</strong> {tip}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Rhetoric & Structure */}
                  <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs space-y-1">
                    <span className="font-bold text-blue-950 block">3. 수사적 논증 구조 총평:</span>
                    <p className="text-blue-900 leading-relaxed font-sans">
                      {existingSubmission.aiFeedback.rhetoricAndLogicComment}
                    </p>
                  </div>
                </div>

                {/* 2. Instructor 2nd Review Card (Human-in-the-Loop) */}
                {existingSubmission.instructorFeedback ? (
                  <div className="bg-emerald-50/70 rounded-3xl p-6 border-2 border-emerald-300 shadow-sm space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-emerald-200 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs">
                          교사 2차 최종 검수 확정
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {existingSubmission.instructorFeedback.instructorName}
                        </span>
                      </div>
                      <div className="text-emerald-800 font-black text-lg">
                        최종 확정: {existingSubmission.instructorFeedback.finalScore}점
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs">
                      "{existingSubmission.instructorFeedback.teacherComment}"
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-emerald-800 pt-1">
                      <span>검수 일시: {new Date(existingSubmission.instructorFeedback.reviewedAt).toLocaleString()}</span>
                      <span className="font-bold">Human-in-the-Loop 완료 ✅</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-center text-xs text-slate-500">
                    ⏳ 담당 선생님(최민서 강사)의 2차 검수 대기 중입니다.
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3">
                <Sparkles className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">
                  아직 제출된 작문 답안이 없습니다
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  왼쪽 에디터에 54번 작문 초안을 작성한 후 [AI 1차 실시간 첨삭 받기]를 누르시면 3초 만에 문법·번역투·논증 피드백이 제공됩니다.
                </p>
              </div>
            )}
          </div>
        </div>
        </div>
      )}

      {/* Real Mock Exam Fullscreen Focus Mode */}
      {isFocusMode && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md text-white flex flex-col p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-black animate-pulse flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                실전 집중 모드 (Focus Mode)
              </span>
              <span className="text-sm font-bold text-slate-300">
                TOPIK II 제54번 논술형 실전 작성
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-4 py-1.5 rounded-xl font-mono text-2xl font-black text-amber-400">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>{formatTimer(timerSeconds)}</span>
              </div>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold"
              >
                {isTimerRunning ? '일시 정지' : '계속'}
              </button>
              <button
                onClick={() => setIsFocusMode(false)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all border border-slate-600"
              >
                <Minimize2 className="w-4 h-4" />
                <span>집중 모드 닫기</span>
              </button>
            </div>
          </div>

          {/* Focus Body */}
          <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto space-y-4 overflow-y-auto pr-2">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-amber-400">논제 제시문:</span>
              <p>
                'AI 기술 발전의 명암과 필요한 사회적 대응'에 대해 600~700자로 글을 쓰십시오.
                (1. 긍정적 변화 / 2. 윤리적 문제점 / 3. 극복을 위한 노력)
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>작성 글자 수: <strong className="text-amber-400 font-mono text-sm">{charCount}자</strong> / 600~700자</span>
              <span className="text-[11px] text-slate-500">집중 모드에서는 방해 요소가 차단됩니다</span>
            </div>

            <textarea
              rows={16}
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder="외부 알림과 방해 없이 실전 답안을 작성하십시오..."
              className="w-full flex-1 p-6 rounded-2xl bg-slate-900/60 border border-slate-700 text-slate-100 text-sm leading-loose font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-2xl"
            />

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setIsFocusMode(false);
                  handleAnalyzeWithAi();
                }}
                disabled={charCount < 30 || isSubmittingAi}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>집중 모드 종료 & AI 첨삭 제출</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <쉬어가기: 한국 대학·대학원 학업 & 캠퍼스 TIP> (필수 진도율 제외 휴식 코너) */}
      {currentSeries.hasCampusTip && (
        <div className="bg-gradient-to-r from-indigo-50/90 via-purple-50/90 to-blue-50/90 border-2 border-indigo-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                ☕
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 text-indigo-800 border border-indigo-200">
                    휴식 코너 (진도율 제외)
                  </span>
                  <span className="text-xs font-bold text-indigo-900">
                    〈쉬어가기: 한국 대학·대학원 학업 & 캠퍼스 TIP〉
                  </span>
                </div>
                <h4 className="text-base font-black text-slate-900 mt-0.5">
                  지도교수 면담 이메일 작성 예절 & 대학원 장학금 선발 꿀팁
                </h4>
              </div>
            </div>
            <span className="text-[11px] text-indigo-500 font-bold hidden sm:inline">한업 아카데믹 케어</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700">
            <div className="bg-white p-4 rounded-2xl border border-indigo-100 space-y-1.5 shadow-xs">
              <span className="font-black text-indigo-950 block">
                📧 1. 교수님 첫 이메일 제목 공식
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                <code className="text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded font-mono">[OO전공 석사과정 지원자 홍길동] 면담 요청의 건</code> 형태로 소속과 목적을 첫머리에 밝혀야 스팸함 누락을 방지할 수 있습니다.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-indigo-100 space-y-1.5 shadow-xs">
              <span className="font-black text-indigo-950 block">
                💰 2. 조교(TA/RA) 및 장학금 신청
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                학기 시작 2개월 전 학과 사무실 공지를 확인하고, TOPIK 5·6급 성적표를 학사시스템에 미리 등록해 두면 외국인 유학생 성적우수장학금(등록금 50~100%) 우선 선발 대상이 됩니다.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-indigo-100 space-y-1.5 shadow-xs">
              <span className="font-black text-indigo-950 block">
                📚 3. 학술 DB (RISS·DBpia) 인용
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                대학 도서관 웹사이트의 교외 접속(VPN/Proxy)을 로그인하면 한국교육학술정보원(RISS)과 DBpia 학술지 논문 원문을 무료 다운로드하여 54번 논술 작문 근거로 활용할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* WTP Survey Trigger Banner (체험판 2회분 완료 시 또는 수험생 설문 유도) */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shrink-0 shadow-inner">
            🎁
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950">
                연구 참여 혜택
              </span>
              <span className="text-xs text-purple-200 font-semibold">1분 소요 5문항 설문</span>
            </div>
            <h4 className="text-sm sm:text-base font-black mt-0.5">
              AI 한국어 교육 선호도 설문 참여하고 20% 특별 할인쿠폰(HANUP20WTP) 받기!
            </h4>
            <p className="text-xs text-purple-100 leading-relaxed mt-0.5">
              인간 교사 개입 단계별 지불의향(WTP) 연구에 기여해 주시면 한업 전 교재 20% 할인 쿠폰이 즉시 발급됩니다.
            </p>
          </div>
        </div>
        <button
          onClick={openSurveyModal}
          className="px-5 py-2.5 bg-white hover:bg-purple-50 text-purple-900 font-black text-xs rounded-xl shadow-md transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
        >
          설문 참여하고 20% 쿠폰 받기 →
        </button>
      </div>

      {/* Sori Tutor Pronunciation Clinic Modal (Loosely-Coupled iFrame & Simulator) */}
      <SoriTutorModal
        isOpen={isSoriModalOpen}
        onClose={() => setIsSoriModalOpen(false)}
        targetSentence={soriTargetSentence}
      />
    </div>
  );
}
