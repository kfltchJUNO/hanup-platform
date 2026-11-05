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
import { TRACK_B_CURRICULUM } from '../../../mock/trackBCurriculumData';

type TemplateType =
  | 'dialogue_conversation'
  | 'topik_reading_grammar'
  | 'academic_essay_writing';

export default function TextbookEditorPage() {
  const { authoringBlocks, saveAuthoringBlock, currentUser, openAuthModal } = useHanUp();
  const isMaster = isMasterEmail(currentUser.email);

  // 1. Series & Chapter Selection State (All hooks declared unconditionally before any return)
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'topik' | 'academic' | 'life'>('all');
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('hanup_topik_prep');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('ch_prep_01');
  const [customChapters, setCustomChapters] = useState<SyllabusChapter[]>([]);
  const [showAddChapterForm, setShowAddChapterForm] = useState<boolean>(false);
  const [newChapterTitleInput, setNewChapterTitleInput] = useState<string>('');
  const [newChapterGrammarInput, setNewChapterGrammarInput] = useState<string>('');
  const [newChapterVocabInput, setNewChapterVocabInput] = useState<string>('');

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

  // Load any researcher-added custom chapters from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('hanup_custom_chapters_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setCustomChapters(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const allCombinedChapters = [...ALL_SYLLABUS_CHAPTERS, ...customChapters];

  const filteredSeriesList = SYLLABUS_SERIES_METADATA.filter((s) =>
    categoryFilter === 'all' ? true : s.category === categoryFilter
  );

  // Derived Series & Chapters
  const currentSeriesMeta =
    SYLLABUS_SERIES_METADATA.find((s) => s.seriesId === selectedSeriesId) ||
    SYLLABUS_SERIES_METADATA[0];
  const seriesChapters = allCombinedChapters.filter(
    (c) => c.seriesId === selectedSeriesId
  );
  const currentChapterMeta: SyllabusChapter =
    seriesChapters.find((c) => c.chapterId === selectedChapterId) ||
    seriesChapters[0] ||
    allCombinedChapters[0];

  // Sync blueprint & existing authored block whenever chapter selection changes
  useEffect(() => {
    if (!currentChapterMeta) return;

    // Default template type by series
    const defaultTpl: TemplateType =
      currentChapterMeta.seriesId.includes('life')
        ? 'dialogue_conversation'
        : currentChapterMeta.seriesId.includes('track_b') ||
          currentChapterMeta.seriesId.includes('master') ||
          currentChapterMeta.seriesId.includes('writing')
        ? 'academic_essay_writing'
        : 'topik_reading_grammar';
    setTemplateType(defaultTpl);

    // Populate AI Blueprint inputs from syllabus metadata
    setTopicSituation(
      `${currentChapterMeta.titleKo.replace(/^[0-9]+강:\s*|^제[0-9]+회:\s*|^Unit\s*[0-9]+:\s*/i, '')} (${
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
    } else if (currentChapterMeta.chapterId.startsWith('ch_acad_')) {
      // Synthesize directly from TRACK_B_CURRICULUM (Unit 01 ~ Unit 16)
      const unitNum = currentChapterMeta.chapterNumber;
      const trackUnit =
        TRACK_B_CURRICULUM.find((u) => u.unitNumber === unitNum) ||
        TRACK_B_CURRICULUM[0];

      const dm = trackUnit.discourseMarkers;
      const audSummary = trackUnit.targetAudiencePool
        .map(
          (a, idx) =>
            `  ${idx + 1}) [${a.role}] 핵심 가치: ${a.coreValue} / 우려 요인: ${a.frictionFactor}`
        )
        .join('\n');

      const acadPassage = `[KAP 학문목적 아카데믹 논증 — ${trackUnit.stepTitle}]
■ 단원 주제: ${trackUnit.title}
■ 딜레마 안건: ${trackUnit.dilemmaCase.title}

[1. 논증 딜레마 시나리오 (Dilemma Scenario)]
${trackUnit.dilemmaCase.scenario}

• 핵심 가치 충돌: ${trackUnit.dilemmaCase.coreConflict}
• 주요 이해관계자: ${trackUnit.dilemmaCase.stakeholders.join(', ')}

[2. 설득 대상 청중 페르소나 (Target Audience Personas)]
${audSummary}

[3. 툴민(Toulmin) 6요소 학술 담화 표지 공식]
• 주장(Claim): ${dm.claim.join(' / ')}
• 근거(Data): ${dm.data.join(' / ')}
• 보증(Warrant): ${dm.warrant.join(' / ')}
• 보강(Backing): ${dm.backing.join(' / ')}
• 한정(Qualifier): ${dm.qualifier.join(' / ')}
• 반박 및 재반박(Rebuttal): ${dm.rebuttal.join(' / ')}

[4. 학술 논증 작성 과제]
위 딜레마 상황에서 특정 청중 페르소나를 설득하기 위해 툴민 논증 모형(${trackUnit.toulminFocus.join(
        ' → '
      )})과 학술 담화 표지를 활용하여 600~700자 분량의 학술 논증 에세이를 작성하시오.`;

      const acadModelEssay = `${trackUnit.dilemmaCase.title}를 둘러싼 작금의 논쟁은 단순한 정책 선택을 넘어 ‘${trackUnit.dilemmaCase.coreConflict}’라는 근본적 가치 위계의 충돌을 내포한다. ${dm.data[0]} 현행 제도의 경직성은 이해관계자 간의 갈등을 심화시키고 있다. ${dm.warrant[0]}. 또한 ${dm.backing[0]} 보더라도 제도적 전환의 정당성은 충분히 입증된다. ${dm.rebuttal[0]}, ${dm.qualifier[0]} 단계적 보완책을 병행한다면 부작용을 최소화할 수 있다. 따라서 ${dm.claim[0]}.`;

      setTitle(`[학문목적 논증 Unit ${unitNum < 10 ? `0${unitNum}` : unitNum}] ${trackUnit.title}`);
      setKoContent(acadPassage);
      setZhExplanation(
        `【KAP 学术论证写作 Unit ${unitNum}】\n• 议题：${trackUnit.dilemmaCase.title}\n• 核心冲突：${trackUnit.dilemmaCase.coreConflict}\n• 图尔敏论证要素：${trackUnit.toulminFocus.join(', ')}`
      );
      setMultilingualExplanations({
        ko: `【학문목적 논증 글쓰기 Unit ${unitNum} 해설】\n• 핵심 갈등: ${trackUnit.dilemmaCase.coreConflict}\n• 초점 요소: 툴민(Toulmin) 모형 [${trackUnit.toulminFocus.join(', ')}] 및 페렐만 신수사학 청중 설득 전략`,
        zh: `【KAP 学术论证写作 Unit ${unitNum}】\n• 议题：${trackUnit.dilemmaCase.title}\n• 核心价值冲突：${trackUnit.dilemmaCase.coreConflict}\n• 重点句型：${dm.claim[0]} / ${dm.warrant[0]}`,
        en: `【Academic Argumentation Unit ${unitNum}】\n• Dilemma: ${trackUnit.dilemmaCase.title}\n• Core Conflict: ${trackUnit.dilemmaCase.coreConflict}\n• Toulmin Focus: ${trackUnit.toulminFocus.join(', ')}`,
      });
      setVocabList(
        (currentChapterMeta.vocabPoints || ['가치 위계', '실증 지표', '비례성 원칙']).map(
          (w, i) => ({
            word: w,
            zhMeaning: `${w} (学术核心术语 #${i + 1})`,
            enMeaning: `Academic key term: ${w}`,
            topikLevel: 6,
            commonChineseErrorNote: `학술 논증 텍스트에서 ‘${w}’는 객관적 논거(Data/Warrant)와 함께 격식체 평서형으로 결합해야 합니다.`,
          })
        )
      );
      setDictationBlanksInput((currentChapterMeta.vocabPoints || []).slice(0, 2).join(', '));
      setStructureGuide(
        `1문단(딜레마 쟁점 및 핵심 가치 정의) ➔ 2문단(실증 근거 Data & 논리 보증 Warrant·Backing) ➔ 3문단(예상 반론 수용 Rebuttal & 한정 조건 Qualifier 기반 최종 제언 Claim)`
      );
      setModelAnswer(acadModelEssay);
      setTargetMinChars(600);
      setTargetMaxChars(700);
    } else {
      // Populate rich structured draft from syllabus metadata (for TOPIK prep 1~12 & Life Korean)
      const gList = currentChapterMeta.grammarPoints || ['-아/어서', '-(으)니까'];
      const vList = currentChapterMeta.vocabPoints || ['핵심 어휘'];
      const g1 = gList[0] || '-아/어서';
      const g2 = gList[1] || '-(으)니까';
      const v1 = vList[0] || '핵심 표현';
      const v2 = vList[1] || v1;
      const v3 = vList[2] || v2;

      setTitle(`${currentChapterMeta.titleKo} — 핵심 담화 & 문법 마스터`);
      setKoContent(
        `[단원 핵심 지문 및 실전 담화 — ${currentChapterMeta.titleKo}]
민수: 지영 씨, 오늘 ‘${currentChapterMeta.titleKo.replace(/^[0-9]+강:\s*|^제[0-9]+회:\s*/, '')}’ 관련해서 미리 준비해야 할 게 있을까요?
지영: 네, 우선 ${v1}부터 확인해야 해요. 그리고 ${v2}도 미리 챙겨 두면 훨씬 수월해요.
민수: 아, 맞아요! 지난번에는 미리 확인하지 않아서 조금 당황했거든요.
지영: 맞아요. ${currentChapterMeta.soriFocus || `${v3}까지 꼼꼼하게 확인해 둡시다.`}

[목표 문법 공식 & 의미 대조]
1. ${g1}
  • 의미: 앞 문장이 뒤 문장의 이유·원인이나 순차적 조건이 됨을 나타냅니다.
  • 예문: ${v1} 중요하기 때문에 ${g1} 미리 확인해 두었습니다.

2. ${g2}
  • 의미: 상황의 근거·목적·전환 조건을 제시하며 대화 상대에게 제안하거나 설명할 때 자주 쓰입니다.
  • 예문: 이번 주에는 ${v2} 일정이 있으니까 (${g2}) 늦지 않게 준비합시다.

[단원 확인 문제 (2문항)]
문항 1. 위 담화의 내용과 일치하는 것을 고르십시오.
  ① 민수는 이미 모든 준비를 끝마쳤다.
  ② 지영은 ${v1} 확인의 중요성을 안내하고 있다. (정답)
  ③ 두 사람은 일정을 전면 취소하기로 했다.
  ④ ${v2} 절차는 이번 주에 필요하지 않다.

문항 2. 다음 빈칸에 가장 알맞은 표현을 고르십시오.
  "원활한 진행을 위해 사전에 ${v1} 사항을 (          )."
  ① 확인하도록 합시다 (정답)   ② 확인하느라고 했습니다   ③ 확인하던 참입니다   ④ 확인하기 마련입니다`
      );
      setZhExplanation(
        `【${currentChapterMeta.titleKo}】 목표 문법: ${gList.join(' / ')} | 핵심 어휘: ${vList.join('、')}`
      );
      setMultilingualExplanations({
        ko: `【${currentChapterMeta.titleKo} 교수·학습 해설】\n• 목표 문법: ${gList.join(
          ', '
        )}\n• 핵심 어휘: ${vList.join(', ')}\n• 과제 유형: ${
          currentChapterMeta.taskType || '실전 문형 및 담화 연습'
        }`,
        zh: `【${currentChapterMeta.titleKo}】\n• 目标语法：${gList.join(
          ' / '
        )}\n• 核心词汇：${vList.join('、')}\n• 重点发音：${
          currentChapterMeta.soriFocus || ''
        }`,
        en: `【${currentChapterMeta.titleKo}】\n• Target Grammar: ${gList.join(
          ', '
        )}\n• Key Vocabulary: ${vList.join(', ')}`,
      });
      setVocabList(
        vList.map((w, i) => ({
          word: w,
          zhMeaning: `${w} (핵심 어휘 #${i + 1})`,
          enMeaning: `Key expression: ${w}`,
          topikLevel: currentSeriesMeta.category === 'life' ? 2 : selectedSeriesId === 'hanup_topik_prep' ? 2 : 4,
          commonChineseErrorNote: `‘${w}’ 표현의 연어 결합과 조사 사용에 유의하세요.`,
        }))
      );
      setDictationBlanksInput(vList.slice(0, 2).join(', '));
      setStructureGuide(
        `도입(상황 제시) ➔ 전개(${gList.join(', ')} 활용) ➔ 마무리(${vList.join(', ')} 결합)`
      );
      setModelAnswer(
        `${currentChapterMeta.soriFocus || ''} 특히 ${vList.join(', ')} 표현을 상황에 맞게 사용하면 자연스러운 한국어 담화를 완성할 수 있습니다.`
      );
      setTargetMinChars(selectedSeriesId === 'hanup_topik_prep' ? 100 : 200);
      setTargetMaxChars(selectedSeriesId === 'hanup_topik_prep' ? 200 : 300);
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

  // Handle Category Filter Change
  const handleSelectCategoryFilter = (cat: 'all' | 'topik' | 'academic' | 'life') => {
    setCategoryFilter(cat);
    const matchingSeries = SYLLABUS_SERIES_METADATA.filter((s) =>
      cat === 'all' ? true : s.category === cat
    );
    if (matchingSeries.length > 0 && !matchingSeries.some((s) => s.seriesId === selectedSeriesId)) {
      handleSelectSeries(matchingSeries[0].seriesId);
    }
  };

  // Handle Series Change
  const handleSelectSeries = (newSeriesId: string) => {
    setSelectedSeriesId(newSeriesId);
    const firstChap = allCombinedChapters.find((c) => c.seriesId === newSeriesId);
    if (firstChap) {
      setSelectedChapterId(firstChap.chapterId);
    }
  };

  // Add Custom Chapter to Current Series
  const handleAddCustomChapter = () => {
    if (!newChapterTitleInput.trim()) return;
    const nextNum = seriesChapters.length + 1;
    const newChapId = `ch_custom_${selectedSeriesId}_${Date.now()}`;
    const gPoints = newChapterGrammarInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const vPoints = newChapterVocabInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newChap: SyllabusChapter = {
      chapterId: newChapId,
      seriesId: selectedSeriesId,
      chapterNumber: nextNum,
      titleKo: newChapterTitleInput.trim().startsWith('제') || newChapterTitleInput.trim().includes('강')
        ? newChapterTitleInput.trim()
        : `${nextNum}강: ${newChapterTitleInput.trim()}`,
      isFree: false,
      timeFormula: '실전 담화·문형 60분',
      grammarPoints: gPoints.length > 0 ? gPoints : ['-아/어서', '-(으)니까'],
      vocabPoints: vPoints.length > 0 ? vPoints : ['핵심 어휘 1', '핵심 어휘 2'],
      taskType: '연구자 커스텀 추가 단원',
      soriFocus: `${newChapterTitleInput.trim()} 핵심 발화 연습`,
    };

    const updated = [...customChapters, newChap];
    setCustomChapters(updated);
    try {
      localStorage.setItem('hanup_custom_chapters_v1', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setSelectedChapterId(newChapId);
    setNewChapterTitleInput('');
    setNewChapterGrammarInput('');
    setNewChapterVocabInput('');
    setShowAddChapterForm(false);
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
            TOPIK 4권(준비편 12차시 포함 총 46차시) · 학문목적 논증 글쓰기 4권(16차시) · 생활한국어 4권(48차시) 등 전체 {allCombinedChapters.length}개 차시를 자유롭게 선택·추가하고 AI로 본문을 구성하세요.
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
                <span>STEP 1. 편집할 교재 트랙 · 시리즈 · 차시 선택</span>
              </h2>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                총 12권 · {allCombinedChapters.length}개 차시
              </span>
            </div>

            {/* Category Filter Pills (TOPIK / 학문목적 논증 글쓰기 / 생활한국어) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
              {[
                { id: 'all' as const, label: '전체 (12권)' },
                { id: 'topik' as const, label: 'TOPIK (4권·46강)' },
                { id: 'academic' as const, label: '논증 글쓰기 (4권·16강)' },
                { id: 'life' as const, label: '생활한국어 (4권·48강)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectCategoryFilter(tab.id)}
                  className={`py-2 px-2.5 rounded-xl font-black transition-all cursor-pointer ${
                    categoryFilter === tab.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Series Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 block">
                교재 시리즈 선택 ({filteredSeriesList.length}권 표시 중)
              </label>
              <select
                value={selectedSeriesId}
                onChange={(e) => handleSelectSeries(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {filteredSeriesList.map((s) => {
                  const chapCount = allCombinedChapters.filter(
                    (c) => c.seriesId === s.seriesId
                  ).length;
                  const catBadge =
                    s.category === 'topik'
                      ? 'TOPIK'
                      : s.category === 'academic'
                      ? '학문목적 논증'
                      : '생활한국어';
                  return (
                    <option key={s.seriesId} value={s.seriesId}>
                      [{catBadge}] {s.titleKo} (총 {chapCount}개 차시)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Chapter List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-slate-700">
                  수록 차시 목록 ({seriesChapters.length}개 차시)
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddChapterForm((prev) => !prev)}
                  className="text-[11px] font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddChapterForm ? '추가 창 닫기' : '새 차시 직접 추가'}</span>
                </button>
              </div>

              {showAddChapterForm && (
                <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-2.5 text-xs">
                  <div className="font-black text-indigo-950">
                    + [{currentSeriesMeta.titleKo}]에 새 차시(단원) 추가
                  </div>
                  <input
                    type="text"
                    value={newChapterTitleInput}
                    onChange={(e) => setNewChapterTitleInput(e.target.value)}
                    placeholder="새 차시 제목 (예: 제13회: 병원 예약과 약국 이용하기)"
                    className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-slate-900"
                  />
                  <input
                    type="text"
                    value={newChapterGrammarInput}
                    onChange={(e) => setNewChapterGrammarInput(e.target.value)}
                    placeholder="목표 문법 (쉼표 구분, 예: -아/어야 하다, -(으)면 되다)"
                    className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-slate-900"
                  />
                  <input
                    type="text"
                    value={newChapterVocabInput}
                    onChange={(e) => setNewChapterVocabInput(e.target.value)}
                    placeholder="핵심 어휘 (쉼표 구분, 예: 처방전, 증상을 설명하다, 복용법)"
                    className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomChapter}
                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer"
                  >
                    차시 생성 및 편집 시작하기
                  </button>
                </div>
              )}

              <div className="max-h-64 overflow-y-auto rounded-2xl border border-slate-200 divide-y divide-slate-100 bg-slate-50/60">
                {seriesChapters.map((ch) => {
                  const isSelected = ch.chapterId === selectedChapterId;
                  const isAuthored =
                    authoredChapterIds.has(ch.chapterId) ||
                    ch.chapterId.startsWith('ch_acad_');
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
                              : 'bg-indigo-400'
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
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {authoredChapterIds.has(ch.chapterId)
                          ? '편집본 저장됨'
                          : ch.chapterId.startsWith('ch_acad_')
                          ? '논증 원고 완비'
                          : '기본 본문 완비'}
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
