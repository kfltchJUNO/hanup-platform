'use client';

import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  FileText,
  Headphones,
  QrCode,
  Share2,
  Download,
  CheckCircle,
  Copy,
  Check,
  Eye,
  Plus,
  Save,
  BookOpen,
  Printer,
  X,
  Trash2,
  ExternalLink,
  Volume2,
} from 'lucide-react';
import { useHanUp } from '../../../context/HanUpContext';
import { AuthoringBlock, VocabAnnotation } from '../../../types/hanup';

export default function AuthoringStudioPage() {
  const { authoringBlocks, saveAuthoringBlock, lang } = useHanUp();

  const [selectedBlockId, setSelectedBlockId] = useState<string>(
    authoringBlocks[0]?.blockId || ''
  );
  const activeBlock =
    authoringBlocks.find((b) => b.blockId === selectedBlockId) || authoringBlocks[0];

  // Editor states
  const [koContent, setKoContent] = useState(activeBlock.koContent);
  const [zhExplanation, setZhExplanation] = useState(activeBlock.zhExplanation);
  const [title, setTitle] = useState(activeBlock.title);
  const [vocabList, setVocabList] = useState<VocabAnnotation[]>(activeBlock.vocabAnnotations);

  // New Vocab inline input
  const [newWord, setNewWord] = useState('');
  const [newZh, setNewZh] = useState('');
  const [newLevel, setNewLevel] = useState(5);

  // Studio OSMU Execution States
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [osmuTab, setOsmuTab] = useState<'xiaohongshu' | 'shortform' | 'pdf_qr' | 'quiz'>('xiaohongshu');
  const [copiedText, setCopiedText] = useState(false);
  const [saveNotice, setSaveNotice] = useState(false);

  // PDF Book Layout Preview Modal
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Handle Add New Vocab Annotation
  const handleAddVocab = () => {
    if (!newWord || !newZh) return;
    const newEntry: VocabAnnotation = {
      word: newWord,
      zhMeaning: newZh,
      enMeaning: 'Academic vocab',
      topikLevel: newLevel,
      commonChineseErrorNote: '중국어권 학습자 주요 유의점',
    };
    const updated = [...vocabList, newEntry];
    setVocabList(updated);
    setNewWord('');
    setNewZh('');
  };

  const handleRemoveVocab = (idx: number) => {
    setVocabList(vocabList.filter((_, i) => i !== idx));
  };

  // Trigger AI Auto-tagging & OSMU generation
  const handleAutoGenerateOSMU = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setIsGeneratingAi(false);

      const autoVocabs: VocabAnnotation[] = [
        ...vocabList,
        {
          word: '양극화(兩極化)',
          zhMeaning: '两极分化',
          enMeaning: 'polarization',
          topikLevel: 5,
          commonChineseErrorNote: '‘빈부격차(贫富差距)’와 함께 54번 본론 2단락에서 자주 출제되는 고급 개념어입니다.',
        },
      ];
      setVocabList(autoVocabs);

      const updated: AuthoringBlock = {
        ...activeBlock,
        title,
        koContent,
        zhExplanation,
        vocabAnnotations: autoVocabs,
        osmuExport: {
          xiaohongshuTitle: `🔥TOPIK 54번 "${title}" 3분 만에 마스터하는 만점 공식`,
          xiaohongshuSlides: [
            `【P1 表格】한국어능력시험 쓰기 54번: ${title}`,
            `【P2 核心词汇】비약적(突飞猛进), 편향성(偏向), 선결 과제(首要任务)`,
            `【P3 避坑指南】中国学生最常错的中式表达纠正`,
            `【P4 范文模板】650字论述文标准三段式模板全文`,
            `【P5 扫码互动】右上方扫描二维码立即获取免费AI 1对1批改`,
          ],
          shortFormScript40s: `“토픽 54번 쓸 때 한국인처럼 쓰는 법! ‘발전이 빠르다’ 대신 ‘비약적으로 발전하다’라고 써보세요. 점수가 10점 뜁니다. 프로필 링크에서 AI 첨삭을 무료로 체험해 보세요!”`,
        },
        updatedAt: new Date().toISOString(),
      };

      saveAuthoringBlock(updated);
      setSaveNotice(true);
      setTimeout(() => setSaveNotice(false), 3000);
    }, 800);
  };

  // Real CSV Download for Xiaohongshu Canva Bulk Create
  const handleDownloadXiaohongshuCsv = () => {
    if (!activeBlock.osmuExport) return;
    const headers = ['SlideIndex', 'Title', 'Content', 'Tagline'];
    const rows = activeBlock.osmuExport.xiaohongshuSlides.map((slide, idx) => [
      `P${idx + 1}`,
      `"${activeBlock.osmuExport?.xiaohongshuTitle.replace(/"/g, '""')}"`,
      `"${slide.replace(/"/g, '""')}"`,
      `"HanUp TOPIK II • 韩升"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `xiaohongshu_canva_bulk_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyOsmuCsv = () => {
    if (!activeBlock.osmuExport) return;
    const csvContent = activeBlock.osmuExport.xiaohongshuSlides.join('\n');
    navigator.clipboard?.writeText(csvContent);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-black mb-1">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>Lv.4 저작 스튜디오 (HanUp Studio & OSMU 엔진)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            원고 하나로 PDF 조판·AI 음원·샤오홍슈 카드뉴스 원클릭 추출
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            노션 스타일 블록에 한국어 교재 원고를 입력하면 어휘 태깅, 딕테이션 빈칸, 3:4 카드뉴스 CSV, 40초 숏폼 대본이 자동 생성됩니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveNotice && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <Check className="w-4 h-4" /> 저장 & OSMU 추출 완료!
            </span>
          )}
          <button
            disabled={isGeneratingAi}
            onClick={handleAutoGenerateOSMU}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md shadow-purple-600/20 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isGeneratingAi ? 'OSMU 엔진 생성 중...' : '원클릭 AI 어휘 태깅 & OSMU 추출'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Grid: Left Notion Editor & Right OSMU Live Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Notion-style Block Editor (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              원고 블록 에디터 (Block ID: {activeBlock.blockId})
            </span>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200">
              {activeBlock.blockType}
            </span>
          </div>

          {/* Title Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">단원 / 챕터 제목:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 text-sm font-bold text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans shadow-inner"
            />
          </div>

          {/* Korean Content Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">한국어 본문 원고 (교재·지문):</label>
            <textarea
              rows={8}
              value={koContent}
              onChange={(e) => setKoContent(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm text-slate-900 leading-relaxed border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans shadow-inner"
            />
          </div>

          {/* Chinese Explanation Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">중국어 L1 간섭 해설 및 번역 노트:</label>
            <textarea
              rows={4}
              value={zhExplanation}
              onChange={(e) => setZhExplanation(e.target.value)}
              className="w-full p-3.5 text-xs text-slate-800 leading-relaxed border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans shadow-inner"
            />
          </div>

          {/* Vocab Tagging Manager */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                자동 태깅된 한·중·영 어휘 툴팁 ({vocabList.length}개):
              </span>
              <span className="text-[11px] text-purple-600 font-medium">클릭 시 삭제</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {vocabList.map((v, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs border border-slate-200 group"
                >
                  <strong className="text-blue-700">{v.word}</strong>
                  <span className="text-slate-500">({v.zhMeaning})</span>
                  <button
                    onClick={() => handleRemoveVocab(i)}
                    className="text-slate-400 hover:text-rose-600 transition-colors ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Add Custom Vocab */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <input
                type="text"
                placeholder="한국어 단어 (예: 양극화)"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                className="w-32 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="중국어 뜻 (예: 两极分化)"
                value={newZh}
                onChange={(e) => setNewZh(e.target.value)}
                className="w-36 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
              <button
                onClick={handleAddVocab}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
              >
                + 어휘 추가
              </button>
            </div>
          </div>
        </div>

        {/* Right: OSMU Engine Live Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-purple-600" />
              OSMU 마케팅 & 교재 조판 엔진
            </span>
          </div>

          {/* OSMU Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-2xl text-center text-xs">
            <button
              onClick={() => setOsmuTab('xiaohongshu')}
              className={`py-2 rounded-xl font-black transition-all ${
                osmuTab === 'xiaohongshu' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              샤오홍슈
            </button>
            <button
              onClick={() => setOsmuTab('shortform')}
              className={`py-2 rounded-xl font-black transition-all ${
                osmuTab === 'shortform' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              40초 숏폼
            </button>
            <button
              onClick={() => setOsmuTab('pdf_qr')}
              className={`py-2 rounded-xl font-black transition-all ${
                osmuTab === 'pdf_qr' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              PDF·QR
            </button>
            <button
              onClick={() => setOsmuTab('quiz')}
              className={`py-2 rounded-xl font-black transition-all ${
                osmuTab === 'quiz' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              약점문항
            </button>
          </div>

          {/* OSMU Tab 1: Xiaohongshu 3:4 Card News CSV Real Download */}
          {osmuTab === 'xiaohongshu' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-700">
                  小红书 3:4 카드뉴스 대본 (Canva CSV 연동 규격)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyOsmuCsv}
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? '복사됨' : '복사'}</span>
                  </button>
                  <button
                    onClick={handleDownloadXiaohongshuCsv}
                    className="flex items-center gap-1 text-[11px] font-black text-rose-600 hover:text-rose-800 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV 다운로드</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 text-xs space-y-2.5">
                <div className="font-extrabold text-rose-950 text-sm">
                  {activeBlock.osmuExport?.xiaohongshuTitle}
                </div>
                <div className="space-y-2 pt-1">
                  {activeBlock.osmuExport?.xiaohongshuSlides.map((slide, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white border border-rose-100 text-slate-800 font-mono text-[11px] shadow-xs">
                      {slide}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OSMU Tab 2: 40s Short-Form Video Script */}
          {osmuTab === 'shortform' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-blue-700">
                빌리빌리/더우인/릴스용 40초 숏폼 대본
              </span>
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs text-slate-800 leading-relaxed font-sans shadow-xs">
                "{activeBlock.osmuExport?.shortFormScript40s}"
              </div>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(activeBlock.osmuExport?.shortFormScript40s || '');
                  setCopiedText(true);
                  setTimeout(() => setCopiedText(false), 2000);
                }}
                className="w-full py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors shadow-sm"
              >
                {copiedText ? '대본이 복사되었습니다!' : '숏폼 대본 클립보드 복사'}
              </button>
            </div>
          )}

          {/* OSMU Tab 3: PDF Print Preview with QR DeepLink */}
          {osmuTab === 'pdf_qr' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">
                  출판 인쇄용 PDF 조판 레이아웃
                </span>
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  className="flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>조판 미리보기</span>
                </button>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                <div className="w-24 h-24 mx-auto bg-white p-2 rounded-2xl border border-slate-300 shadow-sm flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-slate-800" />
                </div>
                <div className="text-[11px] text-slate-500">
                  스마트폰 카메라로 스캔 시 즉시 웹앱 학습 페이지로 이동:
                  <div className="font-mono text-blue-600 font-bold text-xs mt-1">
                    {activeBlock.qrBridgeUrl}
                  </div>
                </div>
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-sm hover:bg-slate-800 transition-colors"
                >
                  출판용 PDF 조판 레이아웃 열기
                </button>
              </div>
            </div>
          )}

          {/* OSMU Tab 4: Auto Distractor Question */}
          {osmuTab === 'quiz' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-700">
                본문 기반 자동 생성된 4지선다 약점 문항
              </span>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-2.5">
                <p className="font-bold text-slate-900">
                  Q. 본문에서 AI 기술의 발전에 대해 사용된 가장 적절한 고급 수식어는?
                </p>
                <div className="space-y-1.5 text-slate-700">
                  <div className="p-2 bg-white rounded-xl border border-amber-100">1) 아주 빠르게 발전하다</div>
                  <div className="p-2 bg-emerald-100 rounded-xl border border-emerald-300 font-bold text-emerald-950">
                    2) 비약적으로 발전하다 (정답)
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-amber-100">3) 날마다 좋아지다</div>
                  <div className="p-2 bg-white rounded-xl border border-amber-100">4) 엄청나게 늘어나다</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Printable Book Layout Modal (A4 Publishing Simulation) */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-8 shadow-2xl border border-slate-100 space-y-6 relative max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsPdfModalOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-black text-purple-600 uppercase tracking-wider">
                  HanUp Book Publishing Engine • 300 DPI Ready
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  교재 출판용 PDF 2단 조판 인쇄 레이아웃
                </h3>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-sm hover:bg-slate-800"
              >
                <Printer className="w-4 h-4" />
                <span>PDF 인쇄 / 저장</span>
              </button>
            </div>

            {/* A4 Sheet Mockup */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-300 shadow-inner space-y-6 font-serif">
              {/* Header Bar */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <span className="text-xs font-sans font-black text-blue-700 tracking-wider">
                    한업 토픽 (HanUp TOPIK II) • 쓰기 집중 실전서
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1 font-sans">{activeBlock.title}</h2>
                </div>
                {/* QR Code in Top Right */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-400 flex items-center justify-center">
                    <QrCode className="w-14 h-14 text-slate-900" />
                  </div>
                  <span className="text-[9px] font-sans text-slate-500 mt-1">스마트폰 스캔 (AI 첨삭)</span>
                </div>
              </div>

              {/* 2-Column Text Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-800 leading-relaxed font-sans">
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                    [본문 강독 및 논제 분석]
                  </h4>
                  <p className="whitespace-pre-line">{activeBlock.koContent}</p>
                </div>
                <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                    [중국어권 특화 L1 간섭 해설]
                  </h4>
                  <p className="whitespace-pre-line text-slate-700">{activeBlock.zhExplanation}</p>
                </div>
              </div>

              {/* Footnotes Vocab Box */}
              <div className="border-t-2 border-slate-300 pt-3 text-[11px] font-sans text-slate-600 space-y-1">
                <strong className="block text-slate-900 font-bold mb-1">【핵심 어휘 주석 (Footnotes)】</strong>
                {vocabList.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-bold text-blue-700">• {v.word}:</span>
                    <span>{v.zhMeaning} / {v.enMeaning}</span>
                    <span className="text-slate-400">({v.commonChineseErrorNote})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
