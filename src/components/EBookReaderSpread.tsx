'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Headphones,
  PenTool,
  Bookmark,
  Volume2,
  VolumeX,
  FastForward,
  Mic,
  Languages,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Award,
  Layers,
  CheckCircle2,
  FileText,
  HelpCircle,
  Share2,
  Type,
  Sun,
  Moon,
  Columns,
  File,
} from 'lucide-react';
import {
  AuthoringBlock,
  VocabAnnotation,
  BookCoverStyle,
} from '../types/hanup';
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  L1_PROFILES,
} from '../lib/i18n';
import { injectZeroWidthWatermark } from '../lib/security';

export type PaperTheme = 'cream' | 'white' | 'sepia';
export type BookViewMode = 'spread' | 'single';
export type BookFontSize = 'sm' | 'md' | 'lg';

interface EBookReaderSpreadProps {
  currentBlock: AuthoringBlock;
  seriesTitle?: string;
  chapterTitle?: string;
  chapterNumber?: number;
  totalChapters?: number;
  lang: SupportedLanguage;
  licenseToken: string;
  onOpenSoriTutor: (sentence: string) => void;
  onJumpToWritingTab?: () => void;
  onPrevChapter?: () => void;
  onNextChapter?: () => void;
  hasPrevChapter?: boolean;
  hasNextChapter?: boolean;
}

export const EBookReaderSpread: React.FC<EBookReaderSpreadProps> = ({
  currentBlock,
  seriesTitle = '한업 한국어 스마트 마스터',
  chapterTitle = '현대 사회와 인공지능의 공존',
  chapterNumber = 4,
  totalChapters = 16,
  lang,
  licenseToken,
  onOpenSoriTutor,
  onJumpToWritingTab,
  onPrevChapter,
  onNextChapter,
  hasPrevChapter = true,
  hasNextChapter = true,
}) => {
  // E-Reader preferences
  const [paperTheme, setPaperTheme] = useState<PaperTheme>('cream');
  const [viewMode, setViewMode] = useState<BookViewMode>('spread');
  const [fontSize, setFontSize] = useState<BookFontSize>('md');
  const [useSerifFont, setUseSerifFont] = useState<boolean>(true);
  const [showFullExplanation, setShowFullExplanation] = useState<boolean>(true);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Active selected vocabulary for margin note
  const [activeVocab, setActiveVocab] = useState<VocabAnnotation | null>(
    currentBlock.vocabAnnotations[0] || null
  );

  // Audio simulation state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.8 | 1.0 | 1.2>(1.0);

  // Keyboard navigation for page flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft' && hasPrevChapter && onPrevChapter) {
        onPrevChapter();
      } else if (e.key === 'ArrowRight' && hasNextChapter && onNextChapter) {
        onNextChapter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrevChapter, hasNextChapter, onPrevChapter, onNextChapter]);

  // Audio Web Speech API handler
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentBlock.koContent);
      utterance.lang = 'ko-KR';
      utterance.rate = playbackSpeed;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Theme style mapping
  const themeStyles = {
    cream: {
      bgBook: 'bg-[#fbf9f4]',
      bgPage: 'bg-[#fbf9f4]',
      textPrimary: 'text-[#2b2723]',
      textSecondary: 'text-[#6b645c]',
      borderPage: 'border-[#e8e2d5]',
      divider: 'border-[#ded7c8]',
      highlight: 'bg-[#faecd0] text-[#7a4800]',
      shadowSpineLeft: 'bg-gradient-to-r from-transparent via-black/[0.03] to-black/[0.12]',
      shadowSpineRight: 'bg-gradient-to-r from-black/[0.12] via-black/[0.03] to-transparent',
      boxBg: 'bg-[#f4efe4]',
      badgeColor: 'bg-[#ebdcc4] text-[#5e4726]',
    },
    white: {
      bgBook: 'bg-white',
      bgPage: 'bg-white',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-600',
      borderPage: 'border-slate-200',
      divider: 'border-slate-200',
      highlight: 'bg-amber-100 text-amber-950',
      shadowSpineLeft: 'bg-gradient-to-r from-transparent via-black/[0.02] to-black/[0.09]',
      shadowSpineRight: 'bg-gradient-to-r from-black/[0.09] via-black/[0.02] to-transparent',
      boxBg: 'bg-slate-50',
      badgeColor: 'bg-slate-100 text-slate-800',
    },
    sepia: {
      bgBook: 'bg-[#292524]',
      bgPage: 'bg-[#292524]',
      textPrimary: 'text-[#f5f0ea]',
      textSecondary: 'text-[#b8aea4]',
      borderPage: 'border-[#443e39]',
      divider: 'border-[#443e39]',
      highlight: 'bg-[#4a3b2c] text-[#ffd699]',
      shadowSpineLeft: 'bg-gradient-to-r from-transparent via-black/[0.2] to-black/[0.5]',
      shadowSpineRight: 'bg-gradient-to-r from-black/[0.5] via-black/[0.2] to-transparent',
      boxBg: 'bg-[#35302d]',
      badgeColor: 'bg-[#473f3a] text-[#ded3c8]',
    },
  };

  const currentTheme = themeStyles[paperTheme];

  const fontSizeClass = {
    sm: 'text-xs sm:text-sm leading-relaxed sm:leading-loose',
    md: 'text-sm sm:text-base leading-loose sm:leading-[2.2rem]',
    lg: 'text-base sm:text-lg leading-loose sm:leading-[2.4rem]',
  }[fontSize];

  const fontFamClass = useSerifFont
    ? 'font-serif tracking-normal'
    : 'font-sans tracking-tight';

  // Calculate simulated book folio pages
  const leftPageNum = chapterNumber * 2 + 10;
  const rightPageNum = leftPageNum + 1;

  return (
    <div className="space-y-4 font-sans select-text">
      {/* =========================================================================
          1. E-READER TOP TOOLBAR (도서 환경설정 바)
      ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm text-xs">
        {/* Left: View Mode & Font controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Spread vs Single Mode */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('spread')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'spread'
                  ? 'bg-white text-indigo-700 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">양면 스프레드</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'single'
                  ? 'bg-white text-indigo-700 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <File className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">단면 리더</span>
            </button>
          </div>

          {/* Paper Texture Theme Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setPaperTheme('cream')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                paperTheme === 'cream'
                  ? 'bg-[#fbf9f4] text-amber-950 shadow-xs ring-1 ring-amber-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="크림 미색 모조지 (눈 피로 최소화)"
            >
              <span>📜</span>
              <span className="hidden md:inline">크림지</span>
            </button>
            <button
              type="button"
              onClick={() => setPaperTheme('white')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                paperTheme === 'white'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="선명한 순백색"
            >
              <Sun className="w-3 h-3 text-amber-500" />
              <span className="hidden md:inline">화이트</span>
            </button>
            <button
              type="button"
              onClick={() => setPaperTheme('sepia')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                paperTheme === 'sepia'
                  ? 'bg-[#292524] text-[#f5f0ea] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="야간 다크 세피아"
            >
              <Moon className="w-3 h-3 text-indigo-300" />
              <span className="hidden md:inline">세피아</span>
            </button>
          </div>

          {/* Serif vs Sans Toggle */}
          <button
            type="button"
            onClick={() => setUseSerifFont(!useSerifFont)}
            className={`px-2.5 py-1.5 rounded-xl border font-bold text-[11px] transition-all flex items-center gap-1 ${
              useSerifFont
                ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="출판용 명조/바탕 서체 토글"
          >
            <Type className="w-3.5 h-3.5" />
            <span>{useSerifFont ? '명조(바탕)' : '고딕(산세리프)'}</span>
          </button>

          {/* Font Size Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFontSize('sm')}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                fontSize === 'sm' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSize('md')}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                fontSize === 'md' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('lg')}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                fontSize === 'lg' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              A+
            </button>
          </div>
        </div>

        {/* Right: Audio Player & Bookmarks */}
        <div className="flex items-center gap-2">
          {/* TTS Audio Controls */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl">
            <button
              type="button"
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1 font-bold text-xs ${
                isPlayingAudio ? 'text-rose-600 animate-pulse' : 'text-slate-700 hover:text-indigo-600'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? '오디오 정지' : '본문 낭독 듣기'}</span>
            </button>

            <span className="text-slate-300">|</span>

            {/* Speed Picker */}
            <div className="flex items-center gap-1">
              {([0.8, 1.0, 1.2] as const).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    playbackSpeed === spd ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-xl border transition-all ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-600'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
            title="현재 페이지 책갈피 저장"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. THE AUTHENTIC 3D BOOK SPREAD CONTAINER (실제 종이책 양면 뷰)
      ========================================================================= */}
      <div className="relative mx-auto transition-all duration-300">
        {/* Realistic Book Outer Shell & Stacked Paper Layers (책 두께감 3D 그림자) */}
        <div className="relative rounded-3xl p-1 sm:p-2.5 bg-gradient-to-r from-slate-400/40 via-slate-300/60 to-slate-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.08)] border border-slate-300/70">
          {/* Simulated page edges (Stacked paper thickness lines) */}
          <div className="absolute -bottom-1.5 left-4 right-4 h-1.5 bg-slate-200/90 rounded-b-xl shadow-xs border-b border-slate-400/50" />
          <div className="absolute -bottom-2.5 left-8 right-8 h-1 bg-slate-300/80 rounded-b-lg shadow-xs" />

          {/* Two-Page Spread Main Container */}
          <div
            className={`relative rounded-2xl overflow-hidden border ${currentTheme.borderPage} ${currentTheme.bgBook} grid ${
              viewMode === 'spread' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {/* -------------------------------------------------------------------
                LEFT PAGE (좌측 페이지 - 홀수쪽: 러닝헤드, 단원명, 지문 본문, 각주)
            ------------------------------------------------------------------- */}
            <div className={`p-6 sm:p-10 flex flex-col justify-between relative ${currentTheme.bgPage} ${currentTheme.textPrimary}`}>
              <div className="space-y-6">
                {/* Book Running Head (상단 도서명 머리글) */}
                <div className={`flex items-center justify-between pb-3 border-b ${currentTheme.divider} text-xs font-serif opacity-80 select-none`}>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{seriesTitle}</span>
                    <span className="text-slate-300">/</span>
                    <span className="italic">Standard Learning Series</span>
                  </div>
                  <span className="font-bold text-[11px] uppercase tracking-wider">
                    Chapter 0{chapterNumber}
                  </span>
                </div>

                {/* Chapter Heading Banner in Book */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${currentTheme.badgeColor}`}>
                      제{chapterNumber}강 본문 독해
                    </span>
                    <span className="text-xs font-mono opacity-70">
                      [TOPIK II 수험 및 아카데믹 표준]
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black font-serif tracking-tight leading-snug">
                    {chapterTitle}
                  </h2>
                </div>

                {/* Actual Book Passage with Clickable Keywords */}
                <div className={`${fontSizeClass} ${fontFamClass} space-y-4`}>
                  {currentBlock.blockId === 'blk_writing_04' ? (
                    <div className="text-justify indent-4 leading-loose">
                      {injectZeroWidthWatermark(
                        '현대 사회에서 인공지능(AI) 기술은 산업 전반뿐만 아니라 일상생활에까지 깊숙이 자리 잡았습니다. 이에 따라 생산성이 ',
                        licenseToken
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setActiveVocab(
                            currentBlock.vocabAnnotations.find((v) => v.word.includes('비약적')) || null
                          )
                        }
                        className={`inline-block px-1.5 py-0.5 mx-0.5 rounded font-black transition-all underline decoration-2 underline-offset-4 cursor-pointer ${
                          activeVocab?.word.includes('비약적')
                            ? 'bg-amber-300 text-amber-950 font-black shadow-xs ring-2 ring-amber-400'
                            : currentTheme.highlight
                        }`}
                      >
                        비약적(飛躍的)
                      </button>
                      {injectZeroWidthWatermark(
                        '으로 증가하고 삶의 편의성이 향상된 반면, 일자리 감소와 개인정보 침해, 알고리즘 ',
                        licenseToken
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setActiveVocab(
                            currentBlock.vocabAnnotations.find((v) => v.word.includes('편향성')) || null
                          )
                        }
                        className={`inline-block px-1.5 py-0.5 mx-0.5 rounded font-black transition-all underline decoration-2 underline-offset-4 cursor-pointer ${
                          activeVocab?.word.includes('편향성')
                            ? 'bg-amber-300 text-amber-950 font-black shadow-xs ring-2 ring-amber-400'
                            : currentTheme.highlight
                        }`}
                      >
                        편향성(偏向性)
                      </button>
                      {injectZeroWidthWatermark(
                        '과 같은 윤리적 문제 또한 끊임없이 제기되고 있습니다.\n\n이러한 기술의 부작용을 극복하고 인간과의 조화로운 공존을 이룩하기 위해서는 제도적 가이드라인 마련과 윤리 의식 함양이 무엇보다도 시급한 ',
                        licenseToken
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setActiveVocab(
                            currentBlock.vocabAnnotations.find((v) => v.word.includes('선결 과제')) || null
                          )
                        }
                        className={`inline-block px-1.5 py-0.5 mx-0.5 rounded font-black transition-all underline decoration-2 underline-offset-4 cursor-pointer ${
                          activeVocab?.word.includes('선결 과제')
                            ? 'bg-amber-300 text-amber-950 font-black shadow-xs ring-2 ring-amber-400'
                            : currentTheme.highlight
                        }`}
                      >
                        선결 과제(先決課題)
                      </button>
                      {injectZeroWidthWatermark('라 할 수 있습니다.', licenseToken)}
                    </div>
                  ) : (
                    <div className="text-justify indent-4 leading-loose whitespace-pre-line">
                      {injectZeroWidthWatermark(currentBlock.koContent, licenseToken)}
                    </div>
                  )}
                </div>

                {/* Multilingual Footnote / Contrastive Explanation in Book */}
                {showFullExplanation && (
                  <div className={`p-4 rounded-xl border ${currentTheme.divider} ${currentTheme.boxBg} text-xs space-y-2 mt-4`}>
                    <div className="flex items-center justify-between border-b border-black/10 pb-1.5">
                      <span className="font-bold flex items-center gap-1.5">
                        <Languages className="w-3.5 h-3.5 text-indigo-600" />
                        <span>
                          {SUPPORTED_LANGUAGES[lang]?.flag}{' '}
                          {lang === 'en'
                            ? 'English Commentary & Writing Guidance'
                            : lang === 'ja'
                            ? '日本語の解説と対照学習'
                            : lang === 'zh'
                            ? '中韩对比解析与写作指引'
                            : lang === 'vi'
                            ? 'Giải thích đối chiếu & Hướng dẫn'
                            : lang === 'my'
                            ? 'ဘာသာစကား သရုပ်ခွဲရှင်းလင်းချက်'
                            : '모국어 대비 해설'}
                        </span>
                      </span>
                      <span className="text-[10px] font-mono opacity-70">Footnote</span>
                    </div>
                    <p className="leading-relaxed opacity-90 whitespace-pre-line font-sans">
                      {currentBlock.multilingualExplanations?.[lang] || currentBlock.zhExplanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Left Page Bottom Folio (도서 쪽수) */}
              <div className={`pt-8 flex items-center justify-between text-xs font-serif select-none border-t ${currentTheme.divider} mt-8`}>
                <span className="opacity-60">{chapterTitle}</span>
                <span className="font-bold tracking-widest">— {leftPageNum} —</span>
              </div>
            </div>

            {/* -------------------------------------------------------------------
                CENTER SPINE / GUTTER CREASE (가운데 제본선 3D 굴곡 음영)
                Shown only in Spread View
            ------------------------------------------------------------------- */}
            {viewMode === 'spread' && (
              <div className="hidden lg:block absolute inset-y-0 left-1/2 -ml-6 w-12 pointer-events-none z-20">
                <div className="flex h-full w-full">
                  {/* Left half shadow */}
                  <div className={`w-1/2 h-full ${currentTheme.shadowSpineLeft}`} />
                  {/* Center Seam Hairline */}
                  <div className="w-[1px] h-full bg-black/15 shadow-sm" />
                  {/* Right half shadow */}
                  <div className={`w-1/2 h-full ${currentTheme.shadowSpineRight}`} />
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------------
                RIGHT PAGE (우측 페이지 - 짝수쪽: 어휘 각주, 문법 공식, 발음 클리닉, 연습)
            ------------------------------------------------------------------- */}
            <div className={`p-6 sm:p-10 flex flex-col justify-between relative ${currentTheme.bgPage} ${currentTheme.textPrimary} ${
              viewMode === 'spread' ? 'border-t lg:border-t-0 lg:border-l ' + currentTheme.divider : 'border-t ' + currentTheme.divider
            }`}>
              <div className="space-y-6">
                {/* Book Running Head (우측 페이지 상단) */}
                <div className={`flex items-center justify-between pb-3 border-b ${currentTheme.divider} text-xs font-serif opacity-80 select-none`}>
                  <span className="font-bold text-[11px] uppercase tracking-wider">
                    Study Notes &amp; Speech Clinic
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">핵심 문법 및 어휘 노트</span>
                    <span className="text-slate-300">/</span>
                    <span className="italic">HanUp Interactive</span>
                  </div>
                </div>

                {/* Right Page: Margin Note / Selected Vocabulary Card */}
                {activeVocab ? (
                  <div className={`p-5 rounded-2xl border-2 border-amber-300/80 ${currentTheme.boxBg} space-y-3 shadow-xs`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-amber-900 font-serif">
                          {activeVocab.word}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                          TOPIK {activeVocab.topikLevel}급
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                        💡 여백 주석 (Margin Note)
                      </span>
                    </div>

                    {/* Multilingual Meaning */}
                    <div className="space-y-1 text-xs">
                      <div className="p-2.5 rounded-xl bg-white/80 border border-black/5 font-medium leading-relaxed">
                        <strong className="text-indigo-950 block text-[11px]">
                          {SUPPORTED_LANGUAGES[lang]?.flag} {SUPPORTED_LANGUAGES[lang]?.nativeLabel} 의미:
                        </strong>
                        <span className="text-slate-800">
                          {lang === 'en' && activeVocab.enMeaning}
                          {lang === 'zh' && activeVocab.zhMeaning}
                          {lang === 'ja' && (activeVocab.jaMeaning || activeVocab.enMeaning)}
                          {lang === 'vi' && (activeVocab.viMeaning || activeVocab.enMeaning)}
                          {lang === 'my' && (activeVocab.myMeaning || activeVocab.enMeaning)}
                          {lang === 'ko' && `${activeVocab.enMeaning} / ${activeVocab.zhMeaning}`}
                        </span>
                      </div>

                      {/* L1 Interference Warning */}
                      {(activeVocab.l1ContrastiveNotes?.[lang] || activeVocab.commonChineseErrorNote) && (
                        <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-950 text-[11px] leading-relaxed">
                          <strong>⚠️ 작문 감점 방지 팁:</strong>{' '}
                          {activeVocab.l1ContrastiveNotes?.[lang] || activeVocab.commonChineseErrorNote}
                        </div>
                      )}
                    </div>

                    {/* Speech Clinic Button in Book */}
                    <button
                      type="button"
                      onClick={() => {
                        const sampleSentence = activeVocab.word.includes('비약적')
                          ? '인공지능 기술은 생산성을 비약적으로 발전시켰다.'
                          : activeVocab.word.includes('선결 과제')
                          ? '이것이야말로 조화로운 공존을 위한 선결 과제라 할 수 있다.'
                          : activeVocab.word.includes('편향성')
                          ? '알고리즘 데이터 편향성 문제를 극복해야 한다.'
                          : `${activeVocab.word}의 정확한 표준 발음과 연음을 연습합니다.`;
                        onOpenSoriTutor(sampleSentence);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>소리튜터 AI 발음·피치 클리닉 실행</span>
                    </button>
                  </div>
                ) : (
                  <div className={`p-4 rounded-xl border border-dashed ${currentTheme.divider} text-center text-xs opacity-60`}>
                    왼쪽 본문에서 형광펜 어휘를 클릭하면 이곳에 여백 주석이 열립니다.
                  </div>
                )}

                {/* Right Page: Grammar Checklist & Model Answer Preview */}
                {currentBlock.writingRubric && (
                  <div className={`p-4 rounded-2xl border ${currentTheme.divider} ${currentTheme.boxBg} space-y-2.5`}>
                    <div className="flex items-center justify-between border-b border-black/10 pb-2">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>TOPIK 54번 650자 만점 모범 답안 발췌</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        수사학적 구조 점검
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed font-serif opacity-90 line-clamp-4 italic">
                      &ldquo;{injectZeroWidthWatermark(currentBlock.writingRubric.modelAnswer.slice(0, 200), licenseToken)}...&rdquo;
                    </p>
                  </div>
                )}

                {/* Jump to Manuscript Practice CTA inside Book Page */}
                {onJumpToWritingTab && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-2 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-300">
                        실전 작문 훈련
                      </span>
                      <PenTool className="w-4 h-4 text-indigo-300" />
                    </div>
                    <h4 className="font-black text-xs sm:text-sm">
                      20칸 표준 원고지에서 직접 써보기
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      오늘 학습한 &lsquo;비약적&rsquo;, &lsquo;선결 과제&rsquo;를 실제 원고지에 적용하여 30점/50점 실시간 AI 채점을 받아보세요.
                    </p>
                    <button
                      type="button"
                      onClick={onJumpToWritingTab}
                      className="w-full mt-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all shadow-xs cursor-pointer"
                    >
                      원고지 에디터 펼치기 ➔
                    </button>
                  </div>
                )}
              </div>

              {/* Right Page Bottom Folio (우측 도서 쪽수) */}
              <div className={`pt-8 flex items-center justify-between text-xs font-serif select-none border-t ${currentTheme.divider} mt-8`}>
                <span className="font-bold tracking-widest">— {rightPageNum} —</span>
                <span className="opacity-60">HanUp Publishing Co.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Left Page Flip Arrow Button */}
        {hasPrevChapter && onPrevChapter && (
          <button
            type="button"
            onClick={onPrevChapter}
            className="hidden xl:flex absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white text-slate-700 shadow-xl border border-slate-200 items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all hover:scale-110 z-30"
            title="이전 챕터로 책장 넘기기 (단축키: ←)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Floating Right Page Flip Arrow Button */}
        {hasNextChapter && onNextChapter && (
          <button
            type="button"
            onClick={onNextChapter}
            className="hidden xl:flex absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white text-slate-700 shadow-xl border border-slate-200 items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all hover:scale-110 z-30"
            title="다음 챕터로 책장 넘기기 (단축키: →)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Page Flip Bottom Bar (Mobile/Tablet Friendly) */}
      <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-500">
        <button
          type="button"
          onClick={onPrevChapter}
          disabled={!hasPrevChapter}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all ${
            hasPrevChapter
              ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
              : 'text-slate-300 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>이전 챕터</span>
        </button>

        <span className="font-serif text-[11px] text-slate-400">
          키보드 방향키(← / →)를 눌러 실제 책장을 넘기듯 읽을 수 있습니다.
        </span>

        <button
          type="button"
          onClick={onNextChapter}
          disabled={!hasNextChapter}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all ${
            hasNextChapter
              ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
              : 'text-slate-300 cursor-not-allowed'
          }`}
        >
          <span>다음 챕터</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
