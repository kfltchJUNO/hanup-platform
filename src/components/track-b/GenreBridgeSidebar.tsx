'use client';

import React from 'react';
import {
  GenreBridgeMode,
  ToulminElement,
  TOULMIN_ELEMENT_METAS,
} from '../../types/trackB';
import { GENRE_DEFINITIONS } from '../../mock/genreBridgeData';
import {
  BookOpen,
  GraduationCap,
  FileText,
  ChevronRight,
  Plus,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface GenreBridgeSidebarProps {
  currentMode: GenreBridgeMode;
  onChangeMode: (mode: GenreBridgeMode) => void;
  activeElement?: ToulminElement | null;
  onSelectElement?: (element: ToulminElement) => void;
  onInsertStarter?: (starterText: string) => void;
  className?: string;
}

export const GenreBridgeSidebar: React.FC<GenreBridgeSidebarProps> = ({
  currentMode,
  onChangeMode,
  activeElement = 'C',
  onSelectElement,
  onInsertStarter,
  className = '',
}) => {
  const currentGenre = GENRE_DEFINITIONS[currentMode];
  const elements: ToulminElement[] = ['C', 'D', 'W', 'B', 'Q', 'R'];

  const modeButtons: { mode: GenreBridgeMode; label: string; icon: any }[] = [
    { mode: 'essay', label: '에세이 모드', icon: BookOpen },
    { mode: 'thesis_intro', label: '소논문 서론', icon: GraduationCap },
    { mode: 'critical_review', label: '비판적 서평', icon: FileText },
  ];

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4 font-sans ${className}`}>
      {/* 1. Header & Mode Switcher Bar */}
      <div className="space-y-2 border-b border-slate-100 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-900 font-black text-xs sm:text-sm">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>장르 브릿지 (Genre Bridge)</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
            {currentGenre.badgeKo}
          </span>
        </div>

        {/* 3 Mode Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl text-center text-xs">
          {modeButtons.map((btn) => {
            const Icon = btn.icon;
            const isSelected = currentMode === btn.mode;
            return (
              <button
                key={btn.mode}
                type="button"
                onClick={() => onChangeMode(btn.mode)}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all ${
                  isSelected
                    ? 'bg-white text-indigo-700 shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Current Genre Description & Target Audience */}
        <div className="text-[11px] text-slate-500 leading-snug space-y-1 pt-1">
          <p className="text-slate-700 font-medium">{currentGenre.descriptionKo}</p>
          <p className="text-indigo-900/80 font-mono text-[10px] bg-indigo-50/60 p-1.5 rounded-lg border border-indigo-100">
            🎯 대상 독자: {currentGenre.targetAudienceType}
          </p>
        </div>
      </div>

      {/* 2. Dynamically Mapped Toulmin Elements List */}
      <div className="space-y-2.5">
        <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
          장르별 수사적 블록 가이드 ({currentGenre.nameKo}):
        </span>

        <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
          {elements.map((elem) => {
            const mapping = currentGenre.mappings[elem];
            const meta = TOULMIN_ELEMENT_METAS[elem];
            const isSelected = activeElement === elem;

            return (
              <div
                key={elem}
                onClick={() => onSelectElement && onSelectElement(elem)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-400'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                }`}
              >
                {/* Element Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center ${meta.colorClass.badge}`}>
                      {elem}
                    </span>
                    <span className="font-black text-xs text-slate-900">
                      {mapping.genreLabel}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {meta.nameKo.split(' ')[0]}
                  </span>
                </div>

                {/* Guiding Question */}
                <div className="text-[11px] text-indigo-950 font-medium leading-tight flex items-start gap-1">
                  <HelpCircle className="w-3 h-3 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{mapping.guidingQuestion}</span>
                </div>

                {/* Discourse Starters (1-click snippet insert) */}
                <div className="space-y-1 pt-1 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-500 block">
                    추천 학술 담화 표지:
                  </span>
                  <div className="space-y-1">
                    {mapping.discourseStarters.map((starter, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onInsertStarter) onInsertStarter(starter);
                        }}
                        className="w-full text-left p-1.5 rounded-lg text-[10px] bg-white border border-slate-200/80 text-slate-700 hover:border-indigo-400 hover:text-indigo-900 transition-all flex items-center justify-between group shadow-2xs"
                        title="에디터에 이 문장으로 시작하기"
                      >
                        <span className="truncate pr-1">&ldquo;{starter}&rdquo;</span>
                        <Plus className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
