'use client';

import React from 'react';
import { BookOpen, Sparkles, ChevronRight, Layers, Award, Globe, Feather } from 'lucide-react';
import { BookCoverStyle } from '../../types/hanup';

export interface CategoryBookItem {
  id: string;
  titleKo: string;
  titleZh?: string;
  subtitleKo: string;
  targetLevelText: string;
  themeColor: string;
  coverStyle: BookCoverStyle;
  link: string;
  actionText: string;
  highlights: string[];
}

export interface BookCategoryData {
  key: 'topik' | 'life' | 'academic';
  badgeKo: string;
  badgeColorClass: string;
  icon: 'award' | 'globe' | 'feather';
  titleKo: string;
  subtitleKo: string;
  descriptionKo: string;
  gradientBg: string;
  accentColor: string;
  books: CategoryBookItem[];
}

interface FannedBookCategoryCardProps {
  category: BookCategoryData;
  onClick: () => void;
}

export const FannedBookCategoryCard: React.FC<FannedBookCategoryCardProps> = ({
  category,
  onClick,
}) => {
  const renderIcon = () => {
    switch (category.icon) {
      case 'award':
        return <Award className="w-5 h-5 text-blue-500" />;
      case 'globe':
        return <Globe className="w-5 h-5 text-emerald-500" />;
      case 'feather':
      default:
        return <Feather className="w-5 h-5 text-purple-500" />;
    }
  };

  // 4 books for fan presentation
  const displayBooks = category.books.slice(0, 4);

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer select-none rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between overflow-hidden p-6 sm:p-7"
    >
      {/* Ambient Top Glow on Hover */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-44 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: category.accentColor }}
      />

      {/* 1. Header Information */}
      <div className="space-y-3 z-10 relative">
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide border shadow-2xs ${category.badgeColorClass}`}
          >
            {renderIcon()}
            <span>{category.badgeKo}</span>
          </span>

          <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors flex items-center gap-1 font-mono">
            {displayBooks.length}권 완비
          </span>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-indigo-950 transition-colors">
            {category.titleKo}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            {category.subtitleKo}
          </p>
        </div>
      </div>

      {/* 2. Interactive Fanned-Out Books Container (부채꼴 펼침 연출) */}
      <div className="py-6 sm:py-8 my-2 relative z-10 flex items-center justify-center h-64 sm:h-72 overflow-visible">
        <div
          className="relative w-36 h-48 sm:w-40 sm:h-56"
          style={{ perspective: '1000px' }}
        >
          {displayBooks.map((book, idx) => {
            // Fan geometry angles & offsets
            const fanConfigs = [
              {
                // Book 0: Far Left
                idle: 'rotate-[-8deg] -translate-x-7 translate-y-3 scale-95 shadow-lg',
                hover: 'group-hover:rotate-[-24deg] group-hover:-translate-x-20 group-hover:-translate-y-4 group-hover:scale-105 group-hover:shadow-2xl',
                zIndex: 10,
              },
              {
                // Book 1: Inner Left
                idle: 'rotate-[-3deg] -translate-x-2 translate-y-1 scale-98 shadow-md',
                hover: 'group-hover:rotate-[-8deg] group-hover:-translate-x-7 group-hover:-translate-y-6 group-hover:scale-108 group-hover:shadow-2xl',
                zIndex: 20,
              },
              {
                // Book 2: Inner Right
                idle: 'rotate-[3deg] translate-x-2 translate-y-1 scale-98 shadow-md',
                hover: 'group-hover:rotate-[8deg] group-hover:translate-x-7 group-hover:-translate-y-6 group-hover:scale-108 group-hover:shadow-2xl',
                zIndex: 30,
              },
              {
                // Book 3: Far Right
                idle: 'rotate-[8deg] translate-x-7 translate-y-3 scale-95 shadow-lg',
                hover: 'group-hover:rotate-[24deg] group-hover:translate-x-20 group-hover:-translate-y-4 group-hover:scale-105 group-hover:shadow-2xl',
                zIndex: 40,
              },
            ];

            const cfg = fanConfigs[idx] || fanConfigs[0];

            return (
              <div
                key={book.id}
                className={`absolute inset-0 transition-all duration-500 ease-out origin-bottom ${cfg.idle} ${cfg.hover}`}
                style={{ zIndex: cfg.zIndex }}
              >
                {/* Realistic 3D Miniature Book Cover */}
                <div
                  className="w-full h-full rounded-r-xl rounded-l-xs overflow-hidden relative border border-white/25 flex flex-col justify-between p-3 sm:p-4 text-white shadow-xl"
                  style={{
                    backgroundColor: book.themeColor,
                    backgroundImage: `
                      linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0.3) 100%),
                      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.25) 0%, transparent 60%)
                    `,
                  }}
                >
                  {/* Left Spine Crease */}
                  <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none z-10" />
                  <div className="absolute top-0 bottom-0 left-2.5 w-[1px] bg-white/30 pointer-events-none z-10" />

                  {/* Right Page Edge Thickness */}
                  <div className="absolute top-1 bottom-1 -right-1 w-1 bg-gradient-to-r from-slate-200 to-amber-50 rounded-r-2xs pointer-events-none z-0" />

                  {/* Bookmark Ribbon */}
                  <div className="absolute -top-0.5 right-3 w-2.5 h-6 bg-gradient-to-b from-amber-300 to-amber-500 rounded-b-2xs shadow-xs pointer-events-none z-20" />

                  {/* Mini Cover Header */}
                  <div className="relative z-10 space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-black/25 text-white/90 border border-white/10 inline-block truncate max-w-full">
                      {book.targetLevelText}
                    </span>
                    <h4 className="font-black text-xs sm:text-sm leading-tight line-clamp-2 drop-shadow-xs">
                      {book.titleKo}
                    </h4>
                  </div>

                  {/* Mini Cover Footer */}
                  <div className="relative z-10 border-t border-white/20 pt-1.5 flex items-center justify-between text-[8px] text-white/80 font-mono">
                    <span className="truncate">한업 (HanUp)</span>
                    <span className="font-bold">Vol. {idx + 1}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Footer Action Strip */}
      <div className="z-10 relative pt-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          {category.descriptionKo}
        </p>

        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 group-hover:bg-indigo-600 text-white font-black text-xs transition-all shadow-md group-hover:scale-105 shrink-0 ml-2">
          <span>교재 선택하기</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
