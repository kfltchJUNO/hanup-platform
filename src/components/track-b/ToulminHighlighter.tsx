'use client';

import React, { useState } from 'react';
import {
  ToulminSentence,
  ToulminElement,
  TOULMIN_ELEMENT_METAS,
} from '../../types/trackB';
import { HelpCircle, Sparkles, X, ChevronRight, Bookmark } from 'lucide-react';

interface ToulminHighlighterProps {
  sentences: ToulminSentence[];
  onSentenceClick?: (sentence: ToulminSentence, index: number) => void;
  selectedSentenceIndex?: number | null;
  interactive?: boolean;
}

export const ToulminHighlighter: React.FC<ToulminHighlighterProps> = ({
  sentences,
  onSentenceClick,
  selectedSentenceIndex,
  interactive = true,
}) => {
  const [activeTooltipIdx, setActiveTooltipIdx] = useState<number | null>(null);

  const activeSentence =
    activeTooltipIdx !== null && sentences[activeTooltipIdx]
      ? sentences[activeTooltipIdx]
      : selectedSentenceIndex !== undefined && selectedSentenceIndex !== null && sentences[selectedSentenceIndex]
      ? sentences[selectedSentenceIndex]
      : null;

  const getElementStyle = (element: ToulminElement, isSelected: boolean) => {
    switch (element) {
      case 'C':
        return `bg-blue-100 text-blue-900 border-b-2 border-blue-500 hover:bg-blue-200 ${
          isSelected ? 'ring-2 ring-blue-500 font-semibold' : ''
        }`;
      case 'D':
        return `bg-green-100 text-green-900 border-b-2 border-green-500 hover:bg-green-200 ${
          isSelected ? 'ring-2 ring-green-500 font-semibold' : ''
        }`;
      case 'W':
        return `bg-amber-100 text-amber-900 border-b-2 border-amber-500 hover:bg-amber-200 ${
          isSelected ? 'ring-2 ring-amber-500 font-semibold' : ''
        }`;
      case 'B':
        return `bg-purple-100 text-purple-900 border-b-2 border-purple-500 hover:bg-purple-200 ${
          isSelected ? 'ring-2 ring-purple-500 font-semibold' : ''
        }`;
      case 'Q':
        return `bg-slate-200 text-slate-800 border-b-2 border-slate-500 hover:bg-slate-300 ${
          isSelected ? 'ring-2 ring-slate-600 font-semibold' : ''
        }`;
      case 'R':
        return `bg-rose-100 text-rose-900 border-b-2 border-rose-500 hover:bg-rose-200 ${
          isSelected ? 'ring-2 ring-rose-500 font-semibold' : ''
        }`;
      case 'NONE':
      default:
        return 'text-slate-800 hover:bg-slate-50';
    }
  };

  const getBadgeStyle = (element: ToulminElement) => {
    switch (element) {
      case 'C':
        return 'bg-blue-600 text-white';
      case 'D':
        return 'bg-green-600 text-white';
      case 'W':
        return 'bg-amber-600 text-white';
      case 'B':
        return 'bg-purple-600 text-white';
      case 'Q':
        return 'bg-slate-700 text-white';
      case 'R':
        return 'bg-rose-600 text-white';
      default:
        return 'bg-slate-400 text-white';
    }
  };

  // Count distribution
  const counts = sentences.reduce(
    (acc, s) => {
      acc[s.element] = (acc[s.element] || 0) + 1;
      return acc;
    },
    {} as Record<ToulminElement, number>
  );

  return (
    <div className="space-y-4">
      {/* 1. Toulmin Color Legend Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
        <span className="font-bold text-slate-500 px-1 text-[11px] uppercase tracking-wider">
          툴민 6요소 범례:
        </span>
        {(['C', 'D', 'W', 'B', 'Q', 'R'] as ToulminElement[]).map((elem) => {
          const meta = TOULMIN_ELEMENT_METAS[elem];
          const count = counts[elem] || 0;
          return (
            <div
              key={elem}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                meta.colorClass.bg
              } ${meta.colorClass.text} ${meta.colorClass.border}`}
              title={meta.descriptionKo}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center font-black text-[10px] ${meta.colorClass.badge}`}>
                {elem}
              </span>
              <span>{meta.nameKo.split(' ')[0]}</span>
              <span className="opacity-70 font-mono text-[10px]">({count})</span>
            </div>
          );
        })}
      </div>

      {/* 2. Highlighted Sentences Canvas */}
      <div className="relative p-5 bg-white rounded-2xl border border-slate-200 shadow-sm leading-relaxed text-sm font-sans space-y-1">
        {sentences.length === 0 ? (
          <p className="text-slate-400 italic text-center py-6">
            분석된 문장이 없습니다. 본문을 작성한 후 툴민 진단을 실행해 주십시오.
          </p>
        ) : (
          <div className="flex flex-wrap gap-x-1.5 gap-y-2 items-baseline">
            {sentences.map((sentence, idx) => {
              const isSelected =
                activeTooltipIdx === idx || selectedSentenceIndex === idx;
              const meta = TOULMIN_ELEMENT_METAS[sentence.element];

              return (
                <span
                  key={idx}
                  onClick={() => {
                    if (!interactive) return;
                    setActiveTooltipIdx(activeTooltipIdx === idx ? null : idx);
                    if (onSentenceClick) onSentenceClick(sentence, idx);
                  }}
                  className={`inline-block px-1.5 py-0.5 rounded-md cursor-pointer transition-all duration-150 ${getElementStyle(
                    sentence.element,
                    isSelected
                  )}`}
                >
                  {sentence.element !== 'NONE' && (
                    <span
                      className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded text-[9px] font-black mr-1 align-middle ${getBadgeStyle(
                        sentence.element
                      )}`}
                    >
                      {sentence.element}
                    </span>
                  )}
                  <span>{sentence.text}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Interactive Rhetorical Tooltip Card */}
      {activeSentence && (
        <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${getBadgeStyle(
                  activeSentence.element
                )}`}
              >
                {activeSentence.element}
              </span>
              <span className="font-bold text-sm text-slate-100">
                {TOULMIN_ELEMENT_METAS[activeSentence.element]?.nameKo}
              </span>
              <span className="text-[11px] text-slate-400">
                ({TOULMIN_ELEMENT_METAS[activeSentence.element]?.nameEn})
              </span>
            </div>
            <button
              onClick={() => setActiveTooltipIdx(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-slate-300 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 font-sans leading-relaxed">
            &ldquo;{activeSentence.text}&rdquo;
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-start gap-1.5 text-blue-300">
              <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                <strong className="text-white">수사적 판별 근거:</strong>{' '}
                {activeSentence.rationale}
              </span>
            </div>
            <div className="flex items-start gap-1.5 text-amber-300">
              <Bookmark className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                <strong className="text-white">페렐만 신수사학 관점:</strong>{' '}
                {TOULMIN_ELEMENT_METAS[activeSentence.element]?.perelmanConcept}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
