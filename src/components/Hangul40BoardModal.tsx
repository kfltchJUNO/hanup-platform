'use client';

import React, { useState } from 'react';
import {
  X,
  Volume2,
  Sparkles,
  Mic,
  Printer,
  ChevronRight,
  BookOpen,
  Languages,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { HANGUL_40_LETTERS, HangulLetterItem } from '../mock/syllabusData';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../lib/i18n';

interface Hangul40BoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSoriTutor?: (targetSentence: string) => void;
  initialCategory?: 'all' | 'basic_vowel' | 'basic_consonant' | 'double_consonant' | 'compound_vowel';
}

export function Hangul40BoardModal({
  isOpen,
  onClose,
  onOpenSoriTutor,
  initialCategory = 'all',
}: Hangul40BoardModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'basic_vowel' | 'basic_consonant' | 'double_consonant' | 'compound_vowel' | 'workbook'
  >(initialCategory);

  const [activeLetter, setActiveLetter] = useState<HangulLetterItem>(HANGUL_40_LETTERS[0]);
  const [activeLang, setActiveLang] = useState<SupportedLanguage>('zh');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const filteredLetters =
    selectedCategory === 'all' || selectedCategory === 'workbook'
      ? HANGUL_40_LETTERS
      : HANGUL_40_LETTERS.filter((l) => l.category === selectedCategory);

  // Play Korean Audio via SpeechSynthesis
  const playNativeSound = (syllable: string) => {
    if (typeof window === 'undefined') return;
    setIsPlayingAudio(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(syllable);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.85; // Slightly slower for clear phoneme perception
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 800);
    }
  };

  const handlePrintWorkbook = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* 1. Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-gradient-to-r from-rose-50 via-white to-amber-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md">
              한
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  한글 자모 40자 완전 정복 인터랙티브 보드
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700">
                  Step 1 첫걸음 편
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                원어민 음가 듣기 • 6개 국어 입모양 조음 팁 • 소리튜터 발음 진단 • A4 바둑판 따라 쓰기 워크북
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Category Filter Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50/60 shrink-0">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedCategory === 'all'
                  ? 'bg-rose-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              전체 자모 (40자)
            </button>
            <button
              onClick={() => setSelectedCategory('basic_vowel')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedCategory === 'basic_vowel'
                  ? 'bg-rose-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              기본 단모음 (10자)
            </button>
            <button
              onClick={() => setSelectedCategory('basic_consonant')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedCategory === 'basic_consonant'
                  ? 'bg-rose-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              기본 자음 (14자)
            </button>
            <button
              onClick={() => setSelectedCategory('double_consonant')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedCategory === 'double_consonant'
                  ? 'bg-rose-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              쌍자음 (5자)
            </button>
            <button
              onClick={() => setSelectedCategory('compound_vowel')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedCategory === 'compound_vowel'
                  ? 'bg-rose-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              복합 이중모음 (11자)
            </button>
          </div>

          {/* Workbook Tab Button */}
          <button
            onClick={() => setSelectedCategory('workbook')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              selectedCategory === 'workbook'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>A4 바둑판 워크북 인쇄</span>
          </button>
        </div>

        {/* 3. Main Body */}
        {selectedCategory === 'workbook' ? (
          /* =========================================================================
             A4 Workbook Tracing Grid View
          ========================================================================= */
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    🖨️ A4 정사각 바둑판 손글씨 따라 쓰기 워크북 (Tracing Grid)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    자음과 모음의 결합 균형을 잡는 4분면 십자 가이드라인 격자입니다.
                  </p>
                </div>
                <button
                  onClick={handlePrintWorkbook}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Printer className="w-4 h-4" />
                  <span>인쇄하기 (A4 가로/세로)</span>
                </button>
              </div>

              {/* Grid Printable Area */}
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-rose-700 block mb-2">
                    [1] 기본 모음 10자 바둑판 쓰기 (천지인 조립)
                  </span>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                    {HANGUL_40_LETTERS.filter((l) => l.category === 'basic_vowel').map((l) => (
                      <div
                        key={l.id}
                        className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-2 flex flex-col items-center justify-between relative group hover:border-rose-400"
                      >
                        <span className="text-xl sm:text-2xl font-black text-slate-800">{l.char}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{l.roman}</span>
                        {/* Cross Hair Guidelines */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <div className="w-full h-px bg-slate-200" />
                          <div className="h-full w-px bg-slate-200 absolute" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-blue-700 block mb-2">
                    [2] 기본 자음 14자 바둑판 쓰기 (가획 원리)
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {HANGUL_40_LETTERS.filter((l) => l.category === 'basic_consonant').map((l) => (
                      <div
                        key={l.id}
                        className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-2 flex flex-col items-center justify-between relative group hover:border-blue-400"
                      >
                        <span className="text-xl sm:text-2xl font-black text-slate-800">{l.char}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{l.nameKo}</span>
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <div className="w-full h-px bg-slate-200" />
                          <div className="h-full w-px bg-slate-200 absolute" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-purple-700 block mb-2">
                    [3] 쌍자음 5자 & 복합 모음 11자 바둑판 쓰기
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {HANGUL_40_LETTERS.filter(
                      (l) => l.category === 'double_consonant' || l.category === 'compound_vowel'
                    ).map((l) => (
                      <div
                        key={l.id}
                        className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-2 flex flex-col items-center justify-between relative group hover:border-purple-400"
                      >
                        <span className="text-xl sm:text-2xl font-black text-slate-800">{l.char}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{l.roman}</span>
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <div className="w-full h-px bg-slate-200" />
                          <div className="h-full w-px bg-slate-200 absolute" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             Interactive Board & Inspector View
          ========================================================================= */
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            {/* Left: 40-Letter Grid (7 cols) */}
            <div className="lg:col-span-7 p-4 sm:p-6 overflow-y-auto border-r border-slate-100 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span>클릭하여 원어민 음가와 6개 국어 조음 팁을 확인하세요:</span>
                <span className="text-[11px] text-slate-400">{filteredLetters.length}개 표시 중</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                {filteredLetters.map((item) => {
                  const isSelected = activeLetter.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveLetter(item);
                        playNativeSound(item.sampleSyllable);
                      }}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-between transition-all group relative ${
                        isSelected
                          ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-400 shadow-md scale-105'
                          : 'bg-white border-slate-200/90 hover:border-rose-300 hover:bg-slate-50/80 shadow-2xs hover:scale-102'
                      }`}
                    >
                      <span
                        className={`text-2xl font-black tracking-tight ${
                          isSelected ? 'text-rose-600' : 'text-slate-800 group-hover:text-rose-500'
                        }`}
                      >
                        {item.char}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold mt-1">
                        {item.roman}
                      </span>

                      {/* Mini audio indicator on active */}
                      {isSelected && isPlayingAudio && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Letter Drill-down Inspector (5 cols) */}
            <div className="lg:col-span-5 p-5 sm:p-6 bg-slate-50/70 overflow-y-auto flex flex-col justify-between space-y-5">
              <div className="space-y-5">
                {/* 1. Letter Showcase Banner */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-black text-4xl shadow-md">
                      {activeLetter.char}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-lg">{activeLetter.nameKo}</span>
                        <span className="font-mono text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          {activeLetter.ipa}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        획순: <strong className="text-slate-700">{activeLetter.strokeCount}획</strong> | 대표 결합: <strong className="text-slate-700">{activeLetter.sampleSyllable}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Audio Play Button */}
                  <button
                    onClick={() => playNativeSound(activeLetter.sampleSyllable)}
                    className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
                    title="원어민 음가 재생"
                  >
                    <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                  </button>
                </div>

                {/* 2. Sample Word Pair */}
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">📖 대표 예시 단어:</span>
                    <strong className="text-sm font-black text-slate-900">{activeLetter.sampleWord}</strong>
                    <span className="text-xs text-slate-500 font-medium">({activeLetter.sampleWordZh} / {activeLetter.sampleWordEn})</span>
                  </div>
                  <button
                    onClick={() => playNativeSound(activeLetter.sampleWord)}
                    className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* 3. 6-Language Mouth Shape & Articulation Guide */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-rose-600" />
                      <span>모국어별 입모양 및 조음 팁</span>
                    </span>
                    {/* Language Switch Pills */}
                    <div className="flex items-center gap-1">
                      {(['zh', 'en', 'ja', 'vi', 'my', 'ko'] as SupportedLanguage[]).map((l) => (
                        <button
                          key={l}
                          onClick={() => setActiveLang(l)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                            activeLang === l
                              ? 'bg-rose-600 text-white font-black'
                              : 'text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {SUPPORTED_LANGUAGES[l]?.flag || l.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                    <div className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                      <span>{SUPPORTED_LANGUAGES[activeLang]?.flag}</span>
                      <span>{SUPPORTED_LANGUAGES[activeLang]?.nativeLabel} 조음 해설:</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {activeLetter.mouthShapeTips[activeLang] || activeLetter.mouthShapeTips.ko}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Sori Tutor Diagnostic CTA */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenSoriTutor) {
                      onOpenSoriTutor(activeLetter.soriTarget);
                    }
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Mic className="w-4 h-4 text-amber-300" />
                  <span>소리튜터로 '{activeLetter.sampleWord}' 발음 진단받기 →</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
