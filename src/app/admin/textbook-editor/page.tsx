'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  Save,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Lock,
  Layers,
  Share2,
  Database,
  FileText,
  Mic,
  Languages,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';
import { useHanUp, isMasterEmail } from '../../../context/HanUpContext';
import { AuthoringBlock, VocabAnnotation } from '../../../types/hanup';
import {
  SYLLABUS_SERIES_METADATA,
  ALL_SYLLABUS_CHAPTERS,
  SyllabusChapter,
} from '../../../mock/syllabusData';

type TemplateType =
  | 'dialogue_conversation'
  | 'topik_reading_grammar'
  | 'academic_essay_writing';

export default function TextbookEditorPage() {
  const { authoringBlocks, saveAuthoringBlock, currentUser, openAuthModal } = useHanUp();
  const isMaster = isMasterEmail(currentUser.email);

  // 1. Series & Chapter Selection State (All hooks declared unconditionally before any return)
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('hanup_topik_challenge');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('ch_chal_01');

  // 2. AI Blueprint Input States (Frame, Topic, Grammar, Vocab, SoriFocus, L1 Focus)
  const [templateType, setTemplateType] = useState<TemplateType>('topik_reading_grammar');
  const [topicSituation, setTopicSituation] = useState<string>('공공시설 이용 예절과 행사 안내문 작성');
  const [grammarInput, setGrammarInput] = useState<string>('-도록 하다, -(으)ㄹ 예정이다');
  const [vocabInput, setVocabInput] = useState<string>('이용 안내, 준수 사항, 소지품 유의');
  const [soriFocusInput, setSoriFocusInput] = useState<string>(
    '공공시설에서는 기본 준수 사항을 지키도록 합시다.'
  );
  const [l1FocusInput, setL1FocusInput] = useState<string>(
    '중국어·영어권 학습자가 -도록 하다와 -(으)ㄹ 예정이다의 시제·화행 차이를 혼동하지 않도록 대조 설명'
  );

  // 3. Textbook Manuscript Editor States
  const [title, setTitle] = useState<string>('');
  const [koContent, setKoContent] = useState<string>('');
  const [zhExplanation, setZhExplanation] = useState<string>('');
  const [multilingualExplanations, setMultilingualExplanations] = useState<{
    ko?: string;
    zh?: string;
    en?: string;
    ja?: string;
    vi?: string;
    my?: string;
  }>({});
  const [activeExpLang, setActiveExpLang] = useState<'ko' | 'zh' | 'en' | 'ja' | 'vi' | 'my'>('ko');
  const [vocabList, setVocabList] = useState<VocabAnnotation[]>([]);
  const [dictationBlanksInput, setDictationBlanksInput] = useState<string>('');
  const [structureGuide, setStructureGuide] = useState<string>('');
  const [modelAnswer, setModelAnswer] = useState<string>('');
  const [targetMinChars, setTargetMinChars] = useState<number>(200);
  const [targetMaxChars, setTargetMaxChars] = useState<number>(300);

  // Inline new vocab inputs
  const [newWord, setNewWord] = useState<string>('');
  const [newZhMeaning, setNewZhMeaning] = useState<string>('');
  const [newEnMeaning, setNewEnMeaning] = useState<string>('');
  const [newErrorNote, setNewErrorNote] = useState<string>('');
  const [newTopikLevel, setNewTopikLevel] = useState<number>(4);

  // Execution & Save Status States
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiSourceNotice, setAiSourceNotice] = useState<string | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  // Derived Series & Chapters
  const currentSeriesMeta =
    SYLLABUS_SERIES_METADATA.find((s) => s.seriesId === selectedSeriesId) ||
    SYLLABUS_SERIES_METADATA[0];
  const seriesChapters = ALL_SYLLABUS_CHAPTERS.filter(
    (c) => c.seriesId === selectedSeriesId
  );
  const currentChapterMeta: SyllabusChapter =
    seriesChapters.find((c) => c.chapterId === selectedChapterId) ||
    seriesChapters[0] ||
    ALL_SYLLABUS_CHAPTERS[0];

  // Sync blueprint & existing authored block whenever chapter selection changes
  useEffect(() => {
    if (!currentChapterMeta) return;

    // Default template type by series
    const defaultTpl: TemplateType =
      currentChapterMeta.seriesId.includes('life')
        ? 'dialogue_conversation'
        : currentChapterMeta.seriesId.includes('master') ||
          currentChapterMeta.seriesId.includes('writing')
        ? 'academic_essay_writing'
        : 'topik_reading_grammar';
    setTemplateType(defaultTpl);

    // Populate AI Blueprint inputs from syllabus metadata
    setTopicSituation(
      `${currentChapterMeta.titleKo.replace(/^[0-9]+강:\s*|^제[0-9]+회:\s*/, '')} (${
        currentChapterMeta.taskType || '실전 담화 및 문형 연습'
      })`
    );
    setGrammarInput((currentChapterMeta.grammarPoints || []).join(', '));
    setVocabInput((currentChapterMeta.vocabPoints || []).join(', '));
    setSoriFocusInput(
      currentChapterMeta.soriFocus ||
        `${(currentChapterMeta.vocabPoints || ['핵심 표현'])[0]} 표현을 자연스럽게 발음해 봅시다.`
    );

    // Check if an authored block already exists for this chapterId
    const existingBlock = authoringBlocks.find(
      (b) => b.chapterId === currentChapterMeta.chapterId
    );

    if (existingBlock) {
      setTitle(existingBlock.title);
      setKoContent(existingBlock.koContent);
      setZhExplanation(existingBlock.zhExplanation);
      setMultilingualExplanations(
        existingBlock.multilingualExplanations || {
          ko: existingBlock.zhExplanation,
          zh: existingBlock.zhExplanation,
        }
      );
      setVocabList(existingBlock.vocabAnnotations || []);
      setDictationBlanksInput(
        (existingBlock.audioConfig?.dictationBlanks || []).join(', ')
      );
      setStructureGuide(existingBlock.writingRubric?.rhetoricStructureGuide || '');
      setModelAnswer(existingBlock.writingRubric?.modelAnswer || '');
      setTargetMinChars(existingBlock.writingRubric?.targetChars?.[0] || 200);
      setTargetMaxChars(existingBlock.writingRubric?.targetChars?.[1] || 300);
    } else {
      // Populate initial draft from syllabus metadata
      const gList = currentChapterMeta.grammarPoints || ['핵심 문법'];
      const vList = currentChapterMeta.vocabPoints || ['핵심 어휘'];
      setTitle(`${currentChapterMeta.titleKo} — 핵심 담화 & 문법 마스터`);
      setKoContent(
        `[${currentChapterMeta.titleKo} 기본 초안]\n\n• 대화/담화 주제: ${
          currentChapterMeta.titleKo
        }\n• 목표 문법: ${gList.join(', ')}\n• 핵심 어휘: ${vList.join(
          ', '
        )}\n• 소리튜터 발화문: "${
          currentChapterMeta.soriFocus || ''
        }"\n\n👉 좌측 [AI 교재 구성 설계]에서 문법과 대화 주제를 확인한 뒤 [✨ AI 교재 본문 자동 구성하기] 버튼을 누르면 대화문/지문, 문법 공식, 확인 문제가 자동으로 완성됩니다.`
      );
      setZhExplanation(
        `【${currentChapterMeta.titleKo}】 목표 문법: ${gList.join(' / ')} | 핵심 어휘: ${vList.join('、')}`
      );
      setMultilingualExplanations({
        ko: `【${currentChapterMeta.titleKo} 교수·학습 해설】 목표 문법(${gList.join(
          ', '
        )})과 핵심 어휘(${vList.join(', ')})를 중심으로 구성됩니다.`,
        zh: `【${currentChapterMeta.titleKo}】 목표 문법: ${gList.join(
          ' / '
        )} | 핵심 어휘: ${vList.join('、')}`,
      });
      setVocabList(
        vList.map((w, i) => ({
          word: w,
          zhMeaning: `${w} (핵심 어휘 #${i + 1})`,
          enMeaning: `Key expression: ${w}`,
          topikLevel: currentSeriesMeta.category === 'life' ? 2 : 4,
          commonChineseErrorNote: `‘${w}’ 표현의 연어 결합과 조사 사용에 유의하세요.`,
        }))
      );
      setDictationBlanksInput(vList.slice(0, 2).join(', '));
      setStructureGuide(
        `도입(상황 제시) ➔ 전개(${gList.join(', ')} 활용) ➔ 마무리(${vList.join(', ')} 결합)`
      );
      setModelAnswer(
        `${currentChapterMeta.soriFocus || ''} (${vList.join(', ')} 활용 예시 답안)`
      );
      setTargetMinChars(200);
      setTargetMaxChars(300);
    }
    setAiSourceNotice(null);
  }, [selectedChapterId, currentChapterMeta?.chapterId]);

  // Security Gate (After all hooks!)
  if (!isMaster) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-slate-900">
          Lv.4 본사 마스터 전용 교재 편집기
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          AI 교재 집필 및 커리큘럼 편집기는 승인된 공식 연구자 계정(
          <strong>ot.helper7@gmail.com</strong>)으로 로그인해야 접근하실 수 있습니다.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            메인 서재로 돌아가기
          </Link>
          <button
            onClick={openAuthModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
          >
            관리자 계정으로 로그인
          </button>
        </div>
      </div>
    );
  }

  // Handle Series Change
  const handleSelectSeries = (newSeriesId: string) => {
    setSelectedSeriesId(newSeriesId);
    const firstChap = ALL_SYLLABUS_CHAPTERS.find((c) => c.seriesId === newSeriesId);
    if (firstChap) {
      setSelectedChapterId(firstChap.chapterId);
    }
  };

  // Trigger AI Chapter Content Generation
  const handleGenerateWithAi = async () => {
    setIsGeneratingAi(true);
    setAiSourceNotice(null);
    try {
      const grammarArr = grammarInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const vocabArr = vocabInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/ai/author-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seriesId: selectedSeriesId,
          seriesTitle: currentSeriesMeta.titleKo,
          chapterId: currentChapterMeta.chapterId,
          chapterTitle: currentChapterMeta.titleKo,
          templateType,
          topicSituation,
          grammarPoints: grammarArr.length > 0 ? grammarArr : ['-아/어서', '-(으)니까'],
          vocabPoints: vocabArr.length > 0 ? vocabArr : ['핵심 표현'],
          soriFocus: soriFocusInput,
          l1Focus: l1FocusInput,
          targetLevel: currentSeriesMeta.levelText,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setTitle(d.title || `${currentChapterMeta.titleKo} — ${topicSituation}`);
        setKoContent(d.koContent || '');
        setZhExplanation(d.zhExplanation || '');
        if (d.multilingualExplanations) {
          setMultilingualExplanations(d.multilingualExplanations);
        }
        if (Array.isArray(d.vocabAnnotations)) {
          setVocabList(d.vocabAnnotations);
        }
        if (Array.isArray(d.dictationBlanks)) {
          setDictationBlanksInput(d.dictationBlanks.join(', '));
        }
        if (d.writingRubric) {
          setStructureGuide(d.writingRubric.rhetoricStructureGuide || '');
          setModelAnswer(d.writingRubric.modelAnswer || '');
          if (Array.isArray(d.writingRubric.targetChars)) {
            setTargetMinChars(d.writingRubric.targetChars[0] || 200);
            setTargetMaxChars(d.writingRubric.targetChars[1] || 300);
          }
        }
        setAiSourceNotice(
          json.source === 'gemini_ai'
            ? '✨ Gemini AI가 지정하신 틀·문법·주제에 맞춰 단원 원고를 생성했습니다. 우측에서 내용을 자유롭게 다듬은 뒤 [교재에 저장]을 눌러주세요!'
            : '✨ 표준 교재 구성 엔진이 지정하신 틀·문법·대화 주제에 맞춰 단원 본문과 문법 공식·확인 문제를 생성했습니다. 우측에서 다듬은 뒤 저장하세요!'
        );
      }
    } catch {
      setAiSourceNotice('⚠️ 원고 생성 중 일시적 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Save Current Chapter to Textbook Store & localStorage
  const handleSaveChapter = () => {
    const existing = authoringBlocks.find(
      (b) => b.chapterId === currentChapterMeta.chapterId
    );
    const blanks = dictationBlanksInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedBlock: AuthoringBlock = {
      blockId: existing?.blockId || `blk_${currentChapterMeta.chapterId}`,
      seriesId: selectedSeriesId,
      chapterId: currentChapterMeta.chapterId,
      chapterTitle: currentChapterMeta.titleKo,
      orderIndex: currentChapterMeta.chapterNumber,
      blockType:
        templateType === 'academic_essay_writing' ? 'writing_prompt' : 'reading_passage',
      title,
      koContent,
      zhExplanation: multilingualExplanations.zh || zhExplanation,
      multilingualExplanations: {
        ...multilingualExplanations,
        zh: multilingualExplanations.zh || zhExplanation,
      },
      vocabAnnotations: vocabList,
      audioConfig: {
        voiceId: 'eleven_ko_pro_kr',
        mp3Url: existing?.audioConfig?.mp3Url || '',
        dictationBlanks: blanks,
        durationSec: 35,
      },
      writingRubric: {
        targetChars: [targetMinChars, targetMaxChars],
        requiredKeywords: vocabList.map((v) => v.word),
        rhetoricStructureGuide: structureGuide,
        modelAnswer,
      },
      qrBridgeUrl: `https://hanup.ai/study/${selectedSeriesId}/${currentChapterMeta.chapterId}`,
      osmuExport: existing?.osmuExport,
      updatedAt: new Date().toISOString(),
    };

    saveAuthoringBlock(updatedBlock);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3500);
  };

  // Add Vocab Item
  const handleAddVocab = () => {
    if (!newWord.trim()) return;
    const entry: VocabAnnotation = {
      word: newWord.trim(),
      zhMeaning: newZhMeaning.trim() || newWord.trim(),
      enMeaning: newEnMeaning.trim() || newWord.trim(),
      topikLevel: newTopikLevel,
      commonChineseErrorNote:
        newErrorNote.trim() || '문맥에 맞는 조사 결합과 연어 사용에 유의하세요.',
    };
    setVocabList((prev) => [...prev, entry]);
    setNewWord('');
    setNewZhMeaning('');
    setNewEnMeaning('');
    setNewErrorNote('');
  };

  const handleRemoveVocab = (idx: number) => {
    setVocabList((prev) => prev.filter((_, i) => i !== idx));
  };

  const authoredChapterIds = new Set(authoringBlocks.map((b) => b.chapterId));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 0. Researcher Top Menu Switcher (Separating Textbook Editor vs Marketing Tool vs Research QR Hub) */}
      <div className="bg-slate-900 text-white p-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/textbook-editor"
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center gap-1.5 shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>📚 교재 편집기 (AI 커리큘럼·본문 집필)</span>
          </Link>
          <Link
            href="/admin/studio"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>📣 마케팅 추출 도구 (OSMU · 표지 · 카드뉴스)</span>
          </Link>
          <Link
            href="/admin/research"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Database className="w-4 h-4 text-purple-400" />
            <span>🔗 연구자 QR · 코퍼스 센터</span>
          </Link>
        </div>

        <Link
          href={`/study/${selectedSeriesId}/${currentChapterMeta.chapterId}`}
          target="_blank"
          className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all"
        >
          <span>현재 단원 전자책 뷰어 열기</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI 보조 한국어 교재 집필 & 커리큘럼 본문 편집 워크스테이션</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            기본 틀 · 목표 문법 · 대화 주제를 지정하면 AI가 전자책 한 차시를 완성합니다
          </h1>
          <p className="text-xs text-slate-500">
            84개 전체 커리큘럼 단원 중 원하는 차시를 선택하여 AI로 초안을 구성하고, 지문·다국어 해설·어휘·모범답안을 직접 편집해 전자책 뷰어에 즉시 반영하세요.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleSaveChapter}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>이 단원 교재에 저장 및 전자책 반영</span>
          </button>
        </div>
      </div>

      {saveSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>[{currentChapterMeta.titleKo}]</strong> 단원 원고가 성공적으로 저장되어 전자책 뷰어에 즉시 반영되었습니다!
            </span>
          </div>
          <Link
            href={`/study/${selectedSeriesId}/${currentChapterMeta.chapterId}`}
            target="_blank"
            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center gap-1 shrink-0"
          >
            <span>전자책에서 확인하기</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {aiSourceNotice && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{aiSourceNotice}</span>
        </div>
      )}

      {/* 2. Main 2-Column Workspace: Left (Curriculum & AI Blueprint) | Right (Manuscript Editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================= */}
        {/* LEFT COLUMN (5 cols): 1) 단원 선택 + 2) AI 교재 구성 설계 */}
        {/* ======================================================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card A: Series & Chapter Selector */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>STEP 1. 편집할 교재 시리즈 및 단원(차시) 선택</span>
              </h2>
              <span className="text-[11px] font-bold text-slate-400">
                전체 {ALL_SYLLABUS_CHAPTERS.length}개 단원
              </span>
            </div>

            {/* Series Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 block">
                교재 시리즈 (8종)
              </label>
              <select
                value={selectedSeriesId}
                onChange={(e) => handleSelectSeries(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {SYLLABUS_SERIES_METADATA.map((s) => (
                  <option key={s.seriesId} value={s.seriesId}>
                    [{s.category === 'topik' ? 'TOPIK' : '생활한국어'}] {s.titleKo} (총{' '}
                    {s.totalChapters}강)
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter List */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-slate-700">
                  수록 차시 목록 ({seriesChapters.length}개 단원)
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">
                  ● 초록색 배지 = 상세 본문 저장됨
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-200 divide-y divide-slate-100 bg-slate-50/60">
                {seriesChapters.map((ch) => {
                  const isSelected = ch.chapterId === selectedChapterId;
                  const isAuthored = authoredChapterIds.has(ch.chapterId);
                  return (
                    <button
                      key={ch.chapterId}
                      type="button"
                      onClick={() => setSelectedChapterId(ch.chapterId)}
                      className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-black'
                          : 'hover:bg-white text-slate-700 font-medium'
                      }`}
                    >
                      <div className="truncate flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isAuthored
                              ? isSelected
                                ? 'bg-amber-300'
                                : 'bg-emerald-500'
                              : 'bg-slate-300'
                          }`}
                        />
                        <span className="truncate">{ch.titleKo}</span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 font-bold ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : isAuthored
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200/70 text-slate-500'
                        }`}
                      >
                        {isAuthored ? '본문 완비' : '목차 설계됨'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card B: AI Blueprint & Template Prompt Generator */}
          <div className="bg-gradient-to-b from-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-indigo-800 shadow-lg space-y-4">
            <div className="border-b border-indigo-800/80 pb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                STEP 2. AI Textbook Content Blueprint
              </span>
              <h3 className="text-base font-black text-white mt-0.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>기본 틀 · 목표 문법 · 대화 주제 지정</span>
              </h3>
              <p className="text-[11px] text-indigo-200 mt-0.5 leading-relaxed">
                아래 항목을 지정하고 생성 버튼을 누르면 AI가 선택한 틀에 맞춰 지문/대화문, 문법 공식, 어휘 사전, 확인 문제를 자동으로 채워 줍니다.
              </p>
            </div>

            {/* 1. Template Frame Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-indigo-200 block">
                1. 교재 기본 틀 (Template Structure) 선택
              </label>
              <div className="grid grid-cols-1 gap-2 text-xs">
                {[
                  {
                    id: 'dialogue_conversation' as const,
                    label: '💬 실전 회화 · 대화문 틀 (생활한국어 / 프리토킹)',
                    desc: 'A/B 실전 대화문 + 목표 문법 2개 + 소리튜터 발음 + 확인 문제 2문항',
                  },
                  {
                    id: 'topik_reading_grammar' as const,
                    label: '📖 TOPIK 읽기 · 문법 대조 틀 (준비·도전·완성편)',
                    desc: 'TOPIK 실전 읽기 지문 + 목표 문법 정밀 대조 공식 + 객관식 확인 문제 2문항',
                  },
                  {
                    id: 'academic_essay_writing' as const,
                    label: '🖋️ 학술 · 논술 작문 틀 (53·54번 / 학문목적 논증)',
                    desc: '논술 제시문 + 3단 논증 구조 가이드 + 600~700자 모범답안',
                  },
                ].map((tpl) => {
                  const active = templateType === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setTemplateType(tpl.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-indigo-600/90 border-amber-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-black text-xs flex items-center justify-between">
                        <span>{tpl.label}</span>
                        {active && <Check className="w-4 h-4 text-amber-300" />}
                      </div>
                      <p className="text-[10px] text-indigo-200/90 mt-0.5">{tpl.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Topic / Dialogue Situation */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-indigo-200 block">
                2. 대화/담화 주제 및 구체적 상황
              </label>
              <input
                type="text"
                value={topicSituation}
                onChange={(e) => setTopicSituation(e.target.value)}
                placeholder="예: 카페 키오스크에서 음료 포장 주문하기 / 공공시설 안내문 작성"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* 3. Target Grammar Points */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-indigo-200 block">
                3. 목표 문법 (쉼표로 구분)
              </label>
              <input
                type="text"
                value={grammarInput}
                onChange={(e) => setGrammarInput(e.target.value)}
                placeholder="예: -아/어서, -(으)니까"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* 4. Target Vocabulary */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-indigo-200 block">
                4. 필수 포함 핵심 어휘 (쉼표로 구분)
              </label>
              <input
                type="text"
                value={vocabInput}
                onChange={(e) => setVocabInput(e.target.value)}
                placeholder="예: 교환하다, 환불하다, 영수증을 챙기다"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* 5. SoriTutor Pronunciation Sentence */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-indigo-200 block">
                5. 소리튜터(SoriTutor) 연동 핵심 발음·억양 문장
              </label>
              <input
                type="text"
                value={soriFocusInput}
                onChange={(e) => setSoriFocusInput(e.target.value)}
                placeholder="예: 급한 일이 생겨서요 [그판 니리 생겨서요]"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* 6. L1 Interference Focus */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-indigo-200 block">
                6. 외국인 학습자 모국어(L1) 간섭 주의 포인트 (선택)
              </label>
              <input
                type="text"
                value={l1FocusInput}
                onChange={(e) => setL1FocusInput(e.target.value)}
                placeholder="예: 명령/청유문 앞에서는 -아/어서 대신 -(으)니까만 결합 가능"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerateWithAi}
              disabled={isGeneratingAi}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              {isGeneratingAi ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI가 단원 원고와 문법 해설을 구성하는 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>✨ 지정한 틀과 문법·주제로 AI 교재 본문 자동 구성하기</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ======================================================= */}
        {/* RIGHT COLUMN (7 cols): 교재 본문 상세 편집기 */}
        {/* ======================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Main Passage / Dialogue / Grammar Formula Editor */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-black text-indigo-600 uppercase">
                  STEP 3. 단원 본문 · 문법 · 해설 직접 편집
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  [{currentSeriesMeta.titleKo}] {currentChapterMeta.titleKo}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleSaveChapter}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Save className="w-3.5 h-3.5" />
                <span>변경사항 저장</span>
              </button>
            </div>

            {/* Chapter Title Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 block">
                단원 표제어 (전자책 상단 타이틀)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Main Korean Textbook Content (Passage / Dialogue / Grammar / Questions) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>교재 본문 원고 (대화문/읽기 지문 + 목표 문법 공식 + 단원 확인 문제)</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {koContent.length}자
                </span>
              </div>
              <textarea
                rows={15}
                value={koContent}
                onChange={(e) => setKoContent(e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-300 bg-[#fcfaf2] text-xs sm:text-sm text-slate-900 font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Multilingual Grammar & Discourse Explanation Editor (6 Languages) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-indigo-600" />
                  <span>6개 국어 다국어 문법·담화 해설 (학생 언어 설정에 따라 전자책 우측 페이지에 표출)</span>
                </label>
                <div className="inline-flex rounded-xl bg-slate-100 p-1 gap-1 text-[11px] font-bold">
                  {(
                    [
                      { code: 'ko', label: '🇰🇷 한국어' },
                      { code: 'zh', label: '🇨🇳 중국어' },
                      { code: 'en', label: '🇺🇸 영어' },
                      { code: 'ja', label: '🇯🇵 일본어' },
                      { code: 'vi', label: '🇻🇳 베트남어' },
                      { code: 'my', label: '🇲🇲 미얀마어' },
                    ] as const
                  ).map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setActiveExpLang(l.code)}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        activeExpLang === l.code
                          ? 'bg-indigo-600 text-white font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={4}
                value={multilingualExplanations[activeExpLang] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setMultilingualExplanations((prev) => ({
                    ...prev,
                    [activeExpLang]: val,
                  }));
                  if (activeExpLang === 'zh') {
                    setZhExplanation(val);
                  }
                }}
                placeholder={`${activeExpLang.toUpperCase()} 언어권 학습자를 위한 문법 대조 및 담화 해설을 입력하세요.`}
                className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Section 2: Vocabulary & L1 Interference Dictionary Editor */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-black text-slate-900">
                단원 핵심 어휘 & 모국어(L1) 오용 주의 사전 ({vocabList.length}개)
              </h4>
              <span className="text-[11px] text-slate-500">
                전자책 본문 내 하이라이트 및 우측 단어장에 표출됩니다
              </span>
            </div>

            <div className="space-y-2.5">
              {vocabList.map((v, idx) => (
                <div
                  key={`${v.word}_${idx}`}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">{v.word}</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                        TOPIK {v.topikLevel}급
                      </span>
                      <span className="text-slate-600 font-semibold">
                        🇨🇳 {v.zhMeaning}
                      </span>
                      {v.enMeaning && (
                        <span className="text-slate-500">🇺🇸 {v.enMeaning}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200/70">
                      💡 L1 주의점: {v.commonChineseErrorNote}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVocab(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="어휘 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Vocab Row */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
              <span className="text-xs font-black text-indigo-950 block">
                + 새 핵심 어휘 직접 추가
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="한국어 어휘 (예: 준수하다)"
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  value={newZhMeaning}
                  onChange={(e) => setNewZhMeaning(e.target.value)}
                  placeholder="중국어 뜻 (예: 遵守)"
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  value={newEnMeaning}
                  onChange={(e) => setNewEnMeaning(e.target.value)}
                  placeholder="영어 뜻 (예: to abide by)"
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 text-xs">
                <input
                  type="text"
                  value={newErrorNote}
                  onChange={(e) => setNewErrorNote(e.target.value)}
                  placeholder="모국어(L1) 간섭 주의점 또는 연어 정보 (예: '규칙을 준수하다' 형태로 결합)"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddVocab}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>어휘 추가</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Writing / Speaking Practice & SoriTutor Dictation Config */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
              단원 마무리 쓰기·말하기 실습 및 모범답안 설정
            </h4>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                듣기 딕테이션 빈칸 키워드 (쉼표 구분)
              </label>
              <input
                type="text"
                value={dictationBlanksInput}
                onChange={(e) => setDictationBlanksInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                문단/발화 전개 구조 가이드
              </label>
              <input
                type="text"
                value={structureGuide}
                onChange={(e) => setStructureGuide(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                단원 모범 답안 (Model Answer)
              </label>
              <textarea
                rows={4}
                value={modelAnswer}
                onChange={(e) => setModelAnswer(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs leading-relaxed"
              />
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <Link
                href={`/study/${selectedSeriesId}/${currentChapterMeta.chapterId}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:underline"
              >
                <BookOpen className="w-4 h-4" />
                <span>이 단원 학생용 전자책 뷰어 새 창으로 미리보기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={handleSaveChapter}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>이 단원 교재에 저장 및 전자책 반영</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
