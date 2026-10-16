'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  BookOpen,
  Search,
  ChevronDown,
  ChevronRight,
  Clock,
  Sparkles,
  Award,
  Coffee,
  CheckCircle2,
  Lock,
  ExternalLink,
  Layers,
  GraduationCap,
  Smile,
  Zap,
} from 'lucide-react';
import {
  SYLLABUS_SERIES_METADATA,
  ALL_SYLLABUS_CHAPTERS,
  SyllabusChapter,
} from '../mock/syllabusData';

interface SyllabusDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSeriesId?: string;
  currentChapterId?: string;
  onOpenHangulBoard?: () => void;
  onOpenCampusTip?: (chapterNumber?: number) => void;
}

export function SyllabusDrawer({
  isOpen,
  onClose,
  currentSeriesId,
  currentChapterId,
  onOpenHangulBoard,
  onOpenCampusTip,
}: SyllabusDrawerProps) {
  const router = useRouter();
  const [activeTrack, setActiveTrack] = useState<'all' | 'topik' | 'life'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>({
    [currentSeriesId || 'hanup_topik_prep']: true,
    hanup_topik_master: true,
    hanup_life_step1: true,
  });

  if (!isOpen) return null;

  const toggleExpand = (seriesId: string) => {
    setExpandedSeries((prev) => ({
      ...prev,
      [seriesId]: !prev[seriesId],
    }));
  };

  const handleSelectChapter = (seriesId: string, chapterId: string) => {
    onClose();
    router.push(`/study/${seriesId}/${chapterId}`);
  };

  // Filter series
  const displayedSeries = SYLLABUS_SERIES_METADATA.filter((s) => {
    if (activeTrack === 'topik') return s.category === 'topik';
    if (activeTrack === 'life') return s.category === 'life';
    return true;
  });

  // Filter chapters by search query
  const getFilteredChapters = (seriesId: string): SyllabusChapter[] => {
    const chapters = ALL_SYLLABUS_CHAPTERS.filter((c) => c.seriesId === seriesId);
    if (!searchQuery.trim()) return chapters;

    const q = searchQuery.toLowerCase();
    return chapters.filter(
      (c) =>
        c.titleKo.toLowerCase().includes(q) ||
        c.grammarPoints?.some((g) => g.toLowerCase().includes(q)) ||
        c.vocabPoints?.some((v) => v.toLowerCase().includes(q)) ||
        c.campusTipTitle?.toLowerCase().includes(q) ||
        c.taskType?.toLowerCase().includes(q)
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* 1. Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-xl shrink-0">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg tracking-tight">
                  전체 8종 시리즈 표준 커리큘럼 (82개 단원)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/40 text-indigo-200 border border-indigo-400/30">
                  SYLLABUS v2.0
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-0.5">
                TOPIK 4종 (36강) + 생활한국어 4단계 (48강) 마스터 단원 목록
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Quick Action Pills & Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-3 shrink-0">
          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (onOpenHangulBoard) {
                  onClose();
                  onOpenHangulBoard();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>🔤 한글 자모 40자 보드 & 워크북</span>
            </button>

            <button
              onClick={() => {
                if (onOpenCampusTip) {
                  onClose();
                  onOpenCampusTip(1);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 hover:scale-105"
            >
              <Coffee className="w-3.5 h-3.5 text-amber-100" />
              <span>☕ 캠퍼스 학업 TIP (18편 모음)</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="단원명, 문법 포인트(-아/어서), 학술 어휘, 캠퍼스 TIP 검색..."
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Track Filter Tabs */}
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => setActiveTrack('all')}
              className={`px-3 py-1 rounded-xl transition-all ${
                activeTrack === 'all'
                  ? 'bg-indigo-600 text-white font-black shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              전체 (8종 시리즈)
            </button>
            <button
              onClick={() => setActiveTrack('topik')}
              className={`px-3 py-1 rounded-xl transition-all ${
                activeTrack === 'topik'
                  ? 'bg-indigo-600 text-white font-black shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              한업 TOPIK 4종 (36강)
            </button>
            <button
              onClick={() => setActiveTrack('life')}
              className={`px-3 py-1 rounded-xl transition-all ${
                activeTrack === 'life'
                  ? 'bg-indigo-600 text-white font-black shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              생활한국어 4단계 (48강)
            </button>
          </div>
        </div>

        {/* 3. Series & Chapters Tree List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100/60">
          {displayedSeries.map((series) => {
            const isExpanded = !!expandedSeries[series.seriesId];
            const chapters = getFilteredChapters(series.seriesId);

            if (searchQuery.trim() && chapters.length === 0) {
              return null;
            }

            return (
              <div
                key={series.seriesId}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
              >
                {/* Series Banner Header */}
                <div
                  onClick={() => toggleExpand(series.seriesId)}
                  className="p-4 bg-white hover:bg-slate-50/80 cursor-pointer flex items-start justify-between gap-3 border-b border-slate-100 select-none"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: series.themeColor }}
                      />
                      <h3 className="font-black text-slate-900 text-sm">{series.titleKo}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {series.levelText}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        {series.price}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">{series.description}</p>

                    {/* Time Formula Badge */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{series.timeFormula}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-1">
                    <span className="text-xs font-bold text-slate-400">
                      {chapters.length}개 단원
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Chapter List */}
                {isExpanded && (
                  <div className="divide-y divide-slate-100 bg-slate-50/40">
                    {chapters.map((ch) => {
                      const isCurrent =
                        currentSeriesId === ch.seriesId && currentChapterId === ch.chapterId;
                      return (
                        <div
                          key={ch.chapterId}
                          onClick={() => handleSelectChapter(ch.seriesId, ch.chapterId)}
                          className={`p-3.5 sm:p-4 hover:bg-indigo-50/60 cursor-pointer transition-all flex items-start justify-between gap-3 group ${
                            isCurrent ? 'bg-indigo-50/80 border-l-4 border-l-indigo-600' : ''
                          }`}
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-xs font-black text-indigo-700">
                                {ch.chapterNumber < 10 ? `0${ch.chapterNumber}` : ch.chapterNumber}강
                              </span>
                              <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {ch.titleKo}
                              </h4>
                              {ch.isFree && (
                                <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                                  FREE
                                </span>
                              )}
                            </div>

                            {/* Grammar & Vocab Points */}
                            {ch.grammarPoints && ch.grammarPoints.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 text-[11px]">
                                <span className="text-slate-400 font-bold">문법:</span>
                                {ch.grammarPoints.map((g, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-100"
                                  >
                                    {g}
                                  </span>
                                ))}
                              </div>
                            )}

                            {ch.vocabPoints && ch.vocabPoints.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 text-[11px]">
                                <span className="text-slate-400 font-bold">어휘:</span>
                                {ch.vocabPoints.slice(0, 4).map((v, idx) => (
                                  <span
                                    key={idx}
                                    className="text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]"
                                  >
                                    {v}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Task Summary or Sori Focus */}
                            {ch.taskType && (
                              <div className="text-[11px] text-slate-500 font-medium">
                                📝 과제: <span className="text-slate-700">{ch.taskType}</span>
                              </div>
                            )}

                            {ch.soriFocus && (
                              <div className="text-[11px] text-rose-700 font-medium flex items-center gap-1">
                                <span>🎙️ 소리튜터:</span>
                                <span className="font-bold">{ch.soriFocus}</span>
                              </div>
                            )}

                            {/* Campus Tip Badge */}
                            {ch.campusTipTitle && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onOpenCampusTip) {
                                    onClose();
                                    onOpenCampusTip(ch.chapterNumber);
                                  }
                                }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] transition-colors"
                              >
                                <Coffee className="w-3 h-3 text-amber-700" />
                                <span>{ch.campusTipTitle}</span>
                              </button>
                            )}
                          </div>

                          <div className="shrink-0 pt-1">
                            <span className="p-1 rounded-lg text-slate-300 group-hover:text-indigo-600 transition-colors">
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 4. Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>총 8개 시리즈 • 82개 표준 단원 체계</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
          >
            목차 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
